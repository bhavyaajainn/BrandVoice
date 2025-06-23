from fastapi import APIRouter, Depends, HTTPException, Request, status, Form, File, UploadFile
from starlette.responses import HTMLResponse
from app.models.user import User
from app.models.twitter import TwitterCredential
from app.core.db_dependencies import db_session
from app.api.v1.dependencies import get_firebase_user
from app.models.firestore_db import FirestoreSession
from app.core.config import get_settings
import tweepy, secrets
from datetime import datetime, timedelta
from typing import List, Optional

router = APIRouter(tags=["Twitter"])
settings = get_settings()

# --- temporary store for pending OAuth exchanges ---
STATE_COLL = "twitter_oauth_state"
STATE_TTL  = timedelta(minutes=10)            # one-time use, short-lived


# ─────────────────────────────────────────────────────────────
# 1.  /connect  – generate request token & dynamic callback URL
# ─────────────────────────────────────────────────────────────
@router.get("/connect", response_model=dict)
async def twitter_connect(
    user: User = Depends(get_firebase_user),
    db:   FirestoreSession = Depends(db_session),
):
    state        = secrets.token_urlsafe(24)               # ① random nonce
    callback_url = (
        "https://brandvoice-api-995012456302.us-central1.run.app"
        f"/api/v1/twitter/callback?state={state}"          # ② embed state HERE
        # for local dev: "http://localhost:8000/api/v1/twitter/callback?state={state}"
    )

    handler = tweepy.OAuth1UserHandler(
        settings.twitter_api_key,
        settings.twitter_api_secret,
        callback=callback_url,
    )

    try:
        redirect_url = handler.get_authorization_url()     # ③ user goes to Twitter

        # ④ persist mapping <state → request_token + user>
        await db.add(
            STATE_COLL,
            {
                "state":         state,
                "request_token": handler.request_token,
                "user_id":       str(user.id),
                "expires_at":    datetime.utcnow() + STATE_TTL,
            },
        )

        return {"redirect_to": redirect_url}
    except Exception as e:
        raise HTTPException(500, f"Twitter auth error: {e}")


# ─────────────────────────────────────────────────────────────
# 2.  /callback – finish OAuth, save credentials
# ─────────────────────────────────────────────────────────────
@router.get("/callback")
async def twitter_callback(
    request: Request,
    db:      FirestoreSession = Depends(db_session),
):
    oauth_verifier = request.query_params.get("oauth_verifier")
    state          = request.query_params.get("state")

    if not oauth_verifier or not state:
        raise HTTPException(400, "Missing oauth_verifier or state")

    # ① find the record we stashed under this state
    recs = await db.query(STATE_COLL, filters=[("state", "==", state)])
    if not recs:
        raise HTTPException(400, "State expired or unknown")

    rec          = recs[0]
    request_tok  = rec["request_token"]      # full {"oauth_token": ..., "oauth_token_secret": ...}
    user_id      = rec["user_id"]
    await db.delete(STATE_COLL, rec["id"])   # one-time use

    handler = tweepy.OAuth1UserHandler(
        settings.twitter_api_key,
        settings.twitter_api_secret,
    )
    handler.request_token = request_tok      # set both key & secret

    try:
        access_token, access_token_secret = handler.get_access_token(oauth_verifier)

        cred = {
            "user_id":            user_id,
            "access_token":       access_token,
            "access_token_secret":access_token_secret,
            "created_at":         datetime.utcnow(),
            "updated_at":         datetime.utcnow(),
            "is_active":          True,
        }

        existing = await db.query("twitter_credentials", filters=[("user_id", "==", user_id)])
        if existing:
            credentail_id = await db.update("twitter_credentials", existing[0]["id"], cred)
        else:
            credentail_id = await db.add("twitter_credentials", cred)
        return {"message": "Twitter credentials created successfully", "credential_id": credentail_id}
    
    except Exception as e:
        raise HTTPException(500, f"Twitter callback error: {e}")


@router.get("/credentials", response_model=List[TwitterCredential])
async def list_twitter_credentials(
    user: User = Depends(get_firebase_user),
    db: FirestoreSession = Depends(db_session)
):
    """List all Twitter credentials for the user"""
    credentials = await db.query(
        "twitter_credentials",
        filters=[("user_id", "==", str(user.id)), ("is_active", "==", True)]
    )
    return credentials

@router.get("/credentials/{credential_id}", response_model=TwitterCredential)
async def get_twitter_credential(
    credential_id: str,
    user: User = Depends(get_firebase_user),
    db: FirestoreSession = Depends(db_session)
):
    credential = await db.get("twitter_credentials", credential_id)
    if not credential or credential["user_id"] != str(user.id):
        raise HTTPException(status_code=404, detail="Credential not found")
    return credential

@router.put("/credentials/{credential_id}", response_model=TwitterCredential)
async def update_twitter_credential(
    credential_id: str,
    credential: TwitterCredential,
    db: FirestoreSession = Depends(db_session),
    user: User = Depends(get_firebase_user)
):
    existing_credential = await db.get("twitter_credentials", credential_id)
    if not existing_credential:
        raise HTTPException(status_code=404, detail="Twitter credential not found")
    if existing_credential["user_id"] != str(user.id):
        raise HTTPException(status_code=403, detail="Not authorized to update this credential")
    update_data = credential.model_dump(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    await db.update("twitter_credentials", credential_id, update_data)
    updated_credential = await db.get("twitter_credentials", credential_id)
    return updated_credential

@router.delete("/credentials/{credential_id}")
async def delete_twitter_credential(
    credential_id: str,
    user: User = Depends(get_firebase_user),
    db: FirestoreSession = Depends(db_session)
):
    credential = await db.get("twitter_credentials", credential_id)
    if not credential or credential["user_id"] != str(user.id):
        raise HTTPException(status_code=404, detail="Credential not found")
    await db.update("twitter_credentials", credential_id, {"is_active": False})
    return {"message": "Credential deleted successfully"}

@router.post("/post", status_code=status.HTTP_201_CREATED)
async def post_to_twitter(
    text: str = Form(...),
    media: Optional[List[UploadFile]] = File(None),
    credential_id: Optional[str] = Form(None),
    user: User = Depends(get_firebase_user),
    db: FirestoreSession = Depends(db_session)
):
    # Get the credential
    if credential_id:
        credential = await db.get("twitter_credentials", credential_id)
        if not credential or credential["user_id"] != str(user.id):
            raise HTTPException(status_code=404, detail="Credential not found")
    else:
        # Get the default (first active) credential
        credentials = await db.query(
            "twitter_credentials",
            filters=[("user_id", "==", str(user.id)), ("is_active", "==", True)]
        )
        if not credentials:
            raise HTTPException(status_code=400, detail="No Twitter account connected")
        credential = credentials[0]
        credential_id = credential["id"]  # Store the credential ID for later use

    media_paths = []
    if media:
        for file in media:
            path = f"/tmp/{file.filename}"
            with open(path, "wb") as out:
                out.write(file.file.read())
            media_paths.append(path)

    try:
        tweet_id = await post_tweet_for_user(
            credential["access_token"],
            credential["access_token_secret"],
            text,
            media_paths
        )
        return {"status": "success", "tweet_id": tweet_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to post tweet: {e}")
    finally:
        for path in media_paths:
            try:
                os.remove(path)
            except Exception:
                pass
