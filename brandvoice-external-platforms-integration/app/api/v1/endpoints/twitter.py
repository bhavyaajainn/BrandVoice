from fastapi import APIRouter, Depends, HTTPException, Request, Form, UploadFile, File, status
from starlette.responses import RedirectResponse
from app.models.user import User
from app.core.db_dependencies import db_session
from app.api.v1.dependencies import get_current_user
from app.models.firestore_db import FirestoreSession
from app.services.twitter_service import post_tweet_for_user
from app.models.twitter import TwitterCredential
from typing import List, Optional
import tweepy
from app.core.config import get_settings
import os
from datetime import datetime

router = APIRouter(tags=["Twitter"])
settings = get_settings()

@router.get("/connect")
async def twitter_connect(
    request: Request,
    user: User = Depends(get_current_user),
    db: FirestoreSession = Depends(db_session)
):
    auth = tweepy.OAuth1UserHandler(
        settings.twitter_api_key,
        settings.twitter_api_secret,
        callback=settings.twitter_callback_url
    )
    try:
        redirect_url = auth.get_authorization_url()
        request.session["request_token"] = auth.request_token
        return RedirectResponse(redirect_url)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Twitter auth error: {e}")

@router.get("/callback")
async def twitter_callback(
    request: Request,
    user: User = Depends(get_current_user),
    db: FirestoreSession = Depends(db_session)
):
    request_token = request.session.pop("request_token", None)
    if not request_token:
        raise HTTPException(status_code=400, detail="Missing request token.")
    verifier = request.query_params.get("oauth_verifier")
    if not verifier:
        raise HTTPException(status_code=400, detail="Missing oauth_verifier.")

    auth = tweepy.OAuth1UserHandler(
        settings.twitter_api_key,
        settings.twitter_api_secret,
    )
    auth.request_token = request_token
    try:
        access_token, access_token_secret = auth.get_access_token(verifier)
        # Check if credential already exists for this user
        existing_credentials = await db.query(
            "twitter_credentials",
            filters=[("user_id", "==", str(user.id))]
        )
        credential_data = {
            "user_id": str(user.id),
            "access_token": access_token,
            "access_token_secret": access_token_secret,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "is_active": True
        }
        if existing_credentials:
            credential_id = existing_credentials[0]["id"]
            await db.update("twitter_credentials", credential_id, credential_data)
        else:
            credential_id = await db.add("twitter_credentials", credential_data)
        return {
            "status": "success",
            "credential_id": credential_id,
            "message": "Twitter account connected! You can close this tab."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Twitter callback error: {e}")

@router.get("/credentials", response_model=List[TwitterCredential])
async def list_twitter_credentials(
    user: User = Depends(get_current_user),
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
    user: User = Depends(get_current_user),
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
    user: User = Depends(get_current_user)
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
    user: User = Depends(get_current_user),
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
    user: User = Depends(get_current_user),
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
