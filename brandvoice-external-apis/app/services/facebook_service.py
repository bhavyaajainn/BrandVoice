import httpx
from app.core.config import get_settings
settings = get_settings()

import json

GRAPH = "https://graph.facebook.com/v23.0"

async def exchange_code_for_token(code: str) -> str:
    """Step-1: code → short-lived token"""
    url = f"{GRAPH}/oauth/access_token"
    params = {
        "client_id": settings.facebook_app_id,
        "redirect_uri": settings.facebook_callback_url,
        "client_secret": settings.facebook_app_secret,
        "code": code,
    }
    async with httpx.AsyncClient() as c:
        r = await c.get(url, params=params)
    r.raise_for_status()
    return r.json()["access_token"]

async def upgrade_to_long_lived(short_token: str) -> str:
    """Step-2: short-token → 60-day user token"""
    url = f"{GRAPH}/oauth/access_token"
    params = {
        "grant_type": "fb_exchange_token",
        "client_id": settings.facebook_app_id,
        "client_secret": settings.facebook_app_secret,
        "fb_exchange_token": short_token,
    }
    async with httpx.AsyncClient() as c:
        r = await c.get(url, params=params)
    r.raise_for_status()
    return r.json()["access_token"]

async def page_id_and_token(long_user_token: str) -> tuple[str, str]:
    """Step-3: pick the first Page & return its never-expiring Page token"""
    # 3a list pages
    async with httpx.AsyncClient() as c:
        r = await c.get(f"{GRAPH}/me/accounts",
                        params={"access_token": long_user_token})
    r.raise_for_status()
    page = r.json()["data"][0]          # or make UI to pick
    page_id = page["id"]
    # 3b fetch page access_token
    async with httpx.AsyncClient() as c:
        r2 = await c.get(f"{GRAPH}/{page_id}",
                         params={"fields": "access_token",
                                 "access_token": long_user_token})
    r2.raise_for_status()
    page_token = r2.json()["access_token"]
    return page_id, page_token

# ----------  post helpers ---------- #
async def post_feed(page_id: str, page_token: str, message: str, link: str | None = None):
    url = f"{GRAPH}/{page_id}/feed"
    data = {"message": message, "access_token": page_token}
    if link:
        data["link"] = link
    async with httpx.AsyncClient() as c:
        r = await c.post(url, data=data)
    r.raise_for_status()
    return r.json()["id"]

async def post_photo(page_id: str, page_token: str, image_url: str, caption: str | None):
    url = f"{GRAPH}/{page_id}/photos"
    data = {"url": image_url, "caption": caption or "", "access_token": page_token}
    async with httpx.AsyncClient(timeout= 30.0) as c:
        r = await c.post(url, data=data)
    r.raise_for_status()
    return r.json()["id"]


async def post_video(
    page_id: str,
    page_token: str,
    video_url: str,
    description: str | None = None,
) -> str:
    """
    Publish a small/medium video to a Facebook Page using file_url.
    Returns the video ID (e.g. '12345_67890')
    """
    url = f"{GRAPH}/{page_id}/videos"
    data = {
        "file_url": video_url,
        "description": description or "",
        "access_token": page_token,
        # optional: "published": "true" (default)
    }
    async with httpx.AsyncClient(timeout = 120.0) as c:  # 2-minute budget
        r = await c.post(url, data=data)
    r.raise_for_status()                       # raise HTTP 4xx/5xx as Python error
    return r.json()["id"]                      # { "id": "{page_id}_{video_id}" }


# app/services/facebook_service.py
async def post_video_as_feed(page_id: str,
                             page_token: str,
                             video_url: str,
                             message: str = "") -> str:
    """
    Upload a video with published=false, then create a feed post that references it.
    Returns the final feed post ID.
    """

    # 1) Stage (hidden) upload
    upload_url = f"{GRAPH}/{page_id}/videos"
    upload_data = {
        "file_url": video_url,
        "published": "false",
        "access_token": page_token,
    }
    async with httpx.AsyncClient(timeout = 300) as c:   # large videos take time
        up = await c.post(upload_url, data=upload_data)
    up.raise_for_status()
    video_id = up.json()["id"]

    # 2) Feed post referencing that video
    feed_url = f"{GRAPH}/{page_id}/feed"
    feed_data = {
        "message": message,
        # attached_media must be a JSON string or multipart key:
        # attached_media[0]={"media_fbid":"<VIDEO_ID>"}
        "attached_media[0]": json.dumps({"media_fbid": video_id}),
        "access_token": page_token,
    }
    async with httpx.AsyncClient(timeout = (60)) as c:
        post = await c.post(feed_url, data=feed_data)
    post.raise_for_status()
    return post.json()["id"]          # "{page-id}_{post-id}"
