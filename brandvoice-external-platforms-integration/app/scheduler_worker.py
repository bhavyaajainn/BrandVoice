"""
app/services/scheduler.py
------------------------

• Runs every 10 s (APS-scheduler) and publishes any schedule whose
  `run_at` ≤ now  AND  `status == "upcoming"`.

• Extracts caption, call-to-action, hashtags, image / video URLs from the
  nested structure:

    marketing_content[platform] = {
        "content": {
            "caption": "...",
            "call_to_action": "...",
            "hashtags": [...]
        },
        "image_url": "...",   # optional
        "video_url": "..."    # optional
    }

• Supports Facebook, Instagram, Twitter/X, YouTube out-of-the-box.
"""
from __future__ import annotations

import asyncio
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List

import aiohttp
from apscheduler.schedulers.asyncio import AsyncIOScheduler

from app.models.enums import ScheduleState
from app.models.firestore_db import FirestoreSession
from app.services.facebook_service import post_feed, post_photo, post_video
from app.services.twitter_service import post_tweet_for_user
from app.services.youtube_service import upload_video_for_user


# ────────────────────────────────────────────────────────────────────────
#  Utility helpers
# ────────────────────────────────────────────────────────────────────────
TMP_DIR = Path("/tmp")
TMP_DIR.mkdir(exist_ok=True)


async def download_file(url: str, dest: Path) -> Path:
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as resp:
            if resp.status != 200:
                raise RuntimeError(f"Failed to download {url}: HTTP {resp.status}")
            dest.write_bytes(await resp.read())
            return dest


async def post_to_instagram(
    cred: Dict[str, Any],
    image_url: str | None,
    video_url: str | None,
    caption: str,
):
    """
    Two-step IG posting flow: 1) create media container → 2) poll for video status if needed → 3) publish.
    """
    async with aiohttp.ClientSession() as session:
        base = f"https://graph.facebook.com/v23.0/{cred['instagram_account_id']}"
        token = cred["access_token"]

        if video_url:
            params = {
                "media_type": "REELS",  # Use REELS for video
                "video_url": video_url,
                "caption": caption,
                "access_token": token,
            }
        elif image_url:
            params = {
                "image_url": image_url,
                "caption": caption,
                "access_token": token,
            }
        else:
            raise ValueError("Instagram post needs either image_url or video_url")

        # Step 1 — container
        async with session.post(f"{base}/media", data=params) as resp:
            res = await resp.json()
            print(f"\n***response from media creation {res}***\n")
            container_id = int(res.get("id"))
            print(f"*** Instagram container created: {container_id} type-{type(container_id)}***")
            if not container_id:
                print(f"Instagram media upload failed: {res}")
                return res  # Return error response

        # Step 2 — poll for video status if video_url
        if video_url:
            for _ in range(20):  # Try for up to ~1 minute (20 x 3s)
                status_url = f"https://graph.facebook.com/v23.0/{container_id}?fields=status_code&access_token={token}"
                async with session.get(status_url) as status_resp:
                    status_json = await status_resp.json()
                    status = status_json.get("status_code")
                    print(f"Instagram container status: {status}")
                    if status == "FINISHED":
                        break
                    elif status == "ERROR":
                        print(f"Instagram video processing error: {status_json}")
                        return status_json  # Return error response
                await asyncio.sleep(3)
            else:
                print(f"Instagram video not ready after waiting: {status_json}")
                return status_json  # Return error response

        # Step 3 — publish
        async with session.post(
            f"{base}/media_publish",
            data={"creation_id": container_id, "access_token": token},
        ) as resp:
            return await resp.json()


# ────────────────────────────────────────────────────────────────────────
#  Core scheduler logic
# ────────────────────────────────────────────────────────────────────────
PLATFORM_ALIAS = {
    "x": "twitter",
}  # extend if you have more aliases: e.g. "fb": "facebook"


async def process_due_schedules() -> None:
    db = FirestoreSession()
    now = datetime.now(timezone.utc)
    print(f"\n*** Checking due schedules at {now.isoformat()} ***")

    due: List[Dict[str, Any]] = await db.query(
        "schedules",
        filters=[("run_at", "<=", now), ("status", "==", ScheduleState.upcoming)],
    )
    print(f"*** Found {len(due)} schedule(s) ***")

    for sched in due:
        user_id: str = sched["user_id"]
        product_id: str | None = sched.get("product_id")

        # 1️⃣  Pull the product document
        product: Dict[str, Any] | None = (
            await db.get("products", product_id) if product_id else None
        )
        if product is None:
            await db.update(
                "schedules",
                sched["id"],
                {
                    "status": ScheduleState.failed,
                    "results": {"error": "Product not found"},
                },
            )
            continue

        mc_root = product.get("marketing_content", {})
        youtube_video_url = product.get("video_url")
        print(f"\n*** Processing video URL: {youtube_video_url} ***\n")
        results: Dict[str, str] = {}

        # 2️⃣  Iterate over each requested platform
        for raw_platform in sched["platforms"]:
            platform = PLATFORM_ALIAS.get(raw_platform, raw_platform)
            try:
                block = mc_root.get(platform, {})
                content = block.get("content", {})

                caption = content.get("caption", "") or ""
                cta = content.get("call_to_action", "") or ""
                text = content.get("text", "") or ""
                hashtags = content.get("hashtags", []) or []
                if isinstance(hashtags, str):
                    hashtags = hashtags.split()
                hashtags_str = " ".join(hashtags)

                img_url = block.get("image_url")
                vid_url = block.get("video_url")

                message = f"{caption}\n\n{cta}\n\n{hashtags_str}".strip()
                
                if platform == "twitter" or platform == "x" or platform == "facebook":
                    # Twitter/X has a 280 char limit, truncate if needed
                    message = ""
                    message = f"{cta}\n\n{text}\n\n{hashtags_str}".strip()
                if platform == "youtube":
                    message = ""
                    message = f"{caption}\n\n{cta}\n\n{hashtags_str}".strip()

                # ─── Facebook ───────────────────────────────────
                if platform == "facebook":
                    creds = await db.query(
                        "facebook_credentials",
                        filters=[("user_id", "==", user_id), ("is_active", "==", True)],
                    )
                    if not creds:
                        results[raw_platform] = "no_credentials"
                        continue
                    cred = creds[0]

                    if vid_url:
                        result_from_fb_video = await post_video(cred["page_id"], cred["access_token"], vid_url, description=message)
                        print(f"***Facebook video post result: {result_from_fb_video}***")
                        results[raw_platform] = "video_success"
                    elif img_url:
                        result_from_fb_img = await post_photo(cred["page_id"], cred["access_token"], img_url, caption=message)
                        print(f"***Facebook image post result: {result_from_fb_img}***")
                        results[raw_platform] = "image_success"
                    else:
                        result_from_fb_feed = await post_feed(cred["page_id"], cred["access_token"], message)
                        print(f"***Facebook feed post result: {result_from_fb_feed}***")
                        results[raw_platform] = "text_success"

                # ─── Instagram ─────────────────────────────────
                elif platform == "instagram":
                    
                    creds = await db.query(
                        "instagram_credentials",
                        filters=[("user_id", "==", user_id), ("is_active", "==", True)],
                    )
                    if not creds:
                        results[raw_platform] = "no_credentials"
                        continue
                    cred = creds[0]
                    result_from_post = await post_to_instagram(cred, img_url, vid_url, message)
                    print(f"***Instagram post result: {result_from_post}***")
                    results[raw_platform] = "success"

                # ─── Twitter / X ───────────────────────────────
                elif platform == "twitter":
                    creds = await db.query(
                        "twitter_credentials",
                        filters=[("user_id", "==", user_id), ("is_active", "==", True)],
                    )
                    print(f"[DEBUG] Twitter creds for user {user_id}: {creds}")
                    if not creds:
                        results[raw_platform] = "no_credentials"
                        continue
                    cred = creds[0]

                    media_paths: List[str] = []
                    if img_url:
                        tmp = TMP_DIR / f"{product_id}_tw_image.jpg"
                        print(f"[DEBUG] Downloading Twitter image from {img_url} to {tmp}")
                        await download_file(img_url, tmp)
                        media_paths.append(str(tmp))

                    print(f"[DEBUG] Twitter post payload: access_token={cred['access_token'][:6]}..., "
                        f"access_token_secret={cred['access_token_secret'][:6]}..., "
                        f"message='{message}', media_paths={media_paths or None}")

                    result_from_tweet = await post_tweet_for_user(
                        cred["access_token"],
                        cred["access_token_secret"],
                        message,
                        media_paths or None,
                    )
                    print(f"***Twitter post result: {result_from_tweet}***")
                    for p in media_paths:
                        try:
                            os.remove(p)
                            print(f"[DEBUG] Removed temp file {p}")
                        except FileNotFoundError:
                            print(f"[DEBUG] Temp file {p} not found for removal")

                    results[raw_platform] = "success"

                # ─── YouTube ───────────────────────────────────
                elif platform == "youtube":
                    creds = await db.query(
                        "youtube_credentials", filters=[("user_id", "==", user_id)]
                    )
                    if not creds:
                        print(f"[DEBUG] No YouTube credentials found for user {user_id}")
                        results[raw_platform] = "no_credentials"
                        continue
                    cred = creds[0]
                    if not youtube_video_url:
                        print(f"[DEBUG] YouTube post requires video_url")
                        results[raw_platform] = "no_video"
                        continue
                    vid_url= youtube_video_url
                    if vid_url:
                        tmp_vid = TMP_DIR / f"{product_id}_yt_video.mp4"
                        await download_file(vid_url, tmp_vid)
                        print(f"[DEBUG] Downloaded YouTube video to {tmp_vid}")
                        result_from_you = await upload_video_for_user(
                            cred,
                            tmp_vid,
                            title=caption,
                            desc=cta,
                        )
                        print(f"***YouTube upload result: {result_from_you}***")
                        os.remove(tmp_vid)
                        results[raw_platform] = "success"
                    elif img_url:
                        print(f"[DEBUG] Skipping YouTube upload: image uploads are not supported.")
                        results[raw_platform] = "image_not_supported"
                    else:
                        print(f"[DEBUG] YouTube post requires video_url or image_url")
                        results[raw_platform] = "no_video_or_image"
                        continue

                # ─── Unknown platform ──────────────────────────
                else:
                    results[raw_platform] = "unsupported_platform"

            except Exception as exc:
                results[raw_platform] = f"error: {exc}"

        # 3️⃣  Persist status on the schedule document
        if all(v.startswith(("success", "text_success", "image_success", "video_success"))
               for v in results.values()):
            new_state = ScheduleState.published
        else:
            new_state = ScheduleState.failed

        await db.update(
            "schedules",
            sched["id"],
            {"status": new_state, "results": results},
        )


# ────────────────────────────────────────────────────────────────────────
#  (Optional) one-off migration helper
# ────────────────────────────────────────────────────────────────────────
async def migrate_run_at_to_timestamp() -> None:
    db = FirestoreSession()
    schedules = await db.query("schedules", filters=[])
    for sched in schedules:
        run_at = sched.get("run_at")
        if isinstance(run_at, str):
            try:
                dt = datetime.fromisoformat(run_at.replace("Z", "+00:00"))
                await db.update("schedules", sched["id"], {"run_at": dt})
                print(f"Migrated {sched['id']} to timestamp.")
            except Exception as exc:
                print(f"Failed to migrate {sched['id']}: {exc}")


# ────────────────────────────────────────────────────────────────────────
#  Entry-point
# ────────────────────────────────────────────────────────────────────────
async def main() -> None:
    scheduler = AsyncIOScheduler()
    scheduler.add_job(process_due_schedules, "interval", seconds=10)
    scheduler.start()

    print("🚀 Scheduler started — press Ctrl-C to stop.")
    try:
        while True:
            await asyncio.sleep(3600)
    except (KeyboardInterrupt, SystemExit):
        pass


if __name__ == "__main__":
    import sys

    if len(sys.argv) > 1 and sys.argv[1] == "migrate":
        asyncio.run(migrate_run_at_to_timestamp())
    else:
        asyncio.run(main())
