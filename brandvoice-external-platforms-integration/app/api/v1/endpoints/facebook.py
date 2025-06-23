from fastapi import APIRouter, Depends, HTTPException, Request, Form, UploadFile, File, status
from starlette.responses import RedirectResponse
from app.models import User
from app.core.db_dependencies import db_session
from app.api.v1.dependencies import get_current_user
from app.services import facebook_service as fb
from app.services.facebook_service import post_video
from app.models.firestore_db import FirestoreSession
import httpx
from app.core.config import get_settings
from typing import List
from app.models.facebook import FacebookCredential, FacebookCredentialCreate, FacebookCredentialUpdate
import os
from datetime import datetime

settings = get_settings()
router = APIRouter(tags=["Facebook"])

# ---------- OAuth connect ---------- #
@router.get("/connect")
async def fb_connect(
    user: User = Depends(get_current_user),
    db: FirestoreSession = Depends(db_session)
):
    """Start Facebook OAuth flow"""
    if not settings.facebook_app_id:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Facebook App ID not configured"
        )
    
    # Store user ID in state for verification
    state = str(user.id)
    
    # Construct Facebook OAuth URL
    url = "https://www.facebook.com/v23.0/dialog/oauth"
    params = {
        "client_id": settings.facebook_app_id,
        "redirect_uri": settings.facebook_callback_url,
        "state": state,
        "scope": "instagram_basic,instagram_content_publish,pages_show_list,pages_read_engagement"
    }
    
    # Log the URL for debugging (remove in production)
    print(f"Facebook OAuth URL: {url}?{'&'.join(f'{k}={v}' for k, v in params.items())}")
    
    return RedirectResponse(url=f"{url}?{'&'.join(f'{k}={v}' for k, v in params.items())}")

@router.get("/callback")
async def fb_callback(
    code: str,
    state: str,
    db: FirestoreSession = Depends(db_session)
):
    """Handle Facebook OAuth callback"""
    # Exchange code for access token
    token_url = "https://graph.facebook.com/v23.0/oauth/access_token"
    params = {
        "client_id": settings.facebook_app_id,
        "client_secret": settings.facebook_app_secret,
        "redirect_uri": settings.facebook_callback_url,
        "code": code
    }
    
    async with httpx.AsyncClient() as client:
        r = await client.get(token_url, params=params)
        if r.status_code != 200:
            raise HTTPException(400, f"Token exchange failed: {r.text}")
        token_data = r.json()
    
    # Get user ID from state
    user_id = state
    
    # Get user from database
    user = await db.get("users", user_id)
    if not user:
        raise HTTPException(404, "User not found")
    
    # Get long-lived access token
    token_url = "https://graph.facebook.com/v23.0/oauth/access_token"
    params = {
        "grant_type": "fb_exchange_token",
        "client_id": settings.facebook_app_id,
        "client_secret": settings.facebook_app_secret,
        "fb_exchange_token": token_data["access_token"]
    }
    
    async with httpx.AsyncClient() as client:
        r = await client.get(token_url, params=params)
        if r.status_code != 200:
            raise HTTPException(400, f"Long-lived token exchange failed: {r.text}")
        long_lived_token = r.json()["access_token"]
    
    # Get user's Facebook pages
    pages_url = "https://graph.facebook.com/v23.0/me/accounts"
    params = {"access_token": long_lived_token}
    
    async with httpx.AsyncClient() as client:
        r = await client.get(pages_url, params=params)
        if r.status_code != 200:
            raise HTTPException(400, f"Failed to get pages: {r.text}")
        pages_data = r.json()
    
    # For each page, store Facebook credentials and get Instagram account
    for page in pages_data.get("data", []):
        # Get page access token
        page_token_url = f"https://graph.facebook.com/v23.0/{page['id']}"
        params = {
            "fields": "access_token",
            "access_token": long_lived_token
        }
        
        async with httpx.AsyncClient() as client:
            r = await client.get(page_token_url, params=params)
            if r.status_code != 200:
                continue
            page_token = r.json()["access_token"]
        
        # Store Facebook credentials
        fb_credential_data = {
            "user_id": user_id,
            "page_id": page["id"],
            "page_name": page["name"],
            "access_token": page_token,
            "is_active": True
        }
        
        # Check if Facebook credential exists
        existing_fb_credentials = await db.query(
            "facebook_credentials",
            filters=[
                ("user_id", "==", user_id),
                ("page_id", "==", page["id"])
            ]
        )
        
        if existing_fb_credentials:
            # Update existing Facebook credential
            await db.update(
                "facebook_credentials",
                existing_fb_credentials[0]["id"],
                fb_credential_data
            )
        else:
            # Create new Facebook credential
            await db.add("facebook_credentials", fb_credential_data)
        
        # Get Instagram account
        instagram_url = f"https://graph.facebook.com/v23.0/{page['id']}"
        params = {
            "fields": "instagram_business_account{id,username}",
            "access_token": page_token
        }
        
        async with httpx.AsyncClient() as client:
            r = await client.get(instagram_url, params=params)
            if r.status_code != 200:
                continue
            instagram_data = r.json()
            
            if "instagram_business_account" in instagram_data:
                instagram_account = instagram_data["instagram_business_account"]
                
                # Create or update Instagram credential
                instagram_credential_data = {
                    "user_id": user_id,
                    "instagram_account_id": instagram_account["id"],
                    "access_token": page_token,
                    "page_id": page["id"],
                    "page_name": page["name"],
                    "account_name": instagram_account.get("username"),
                    "is_active": True
                }
                
                # Check if Instagram credential exists
                existing_instagram_credentials = await db.query(
                    "instagram_credentials",
                    filters=[
                        ("user_id", "==", user_id),
                        ("instagram_account_id", "==", instagram_account["id"])
                    ]
                )
                
                if existing_instagram_credentials:
                    # Update existing Instagram credential
                    await db.update(
                        "instagram_credentials",
                        existing_instagram_credentials[0]["id"],
                        instagram_credential_data
                    )
                else:
                    # Create new Instagram credential
                    await db.add("instagram_credentials", instagram_credential_data)
    
    return {"message": "Facebook and Instagram accounts connected successfully"}

# ---------- posting ---------- #
@router.post("/post")
async def post_message(
    message: str = Form(...),
    file: UploadFile = File(None),
    user: User = Depends(get_current_user),
    db: FirestoreSession = Depends(db_session)
):
    # Get user's Facebook credentials
    credentials = await db.query(
        "facebook_credentials",
        filters=[("user_id", "==", str(user.id))]
    )
    if not credentials:
        raise HTTPException(status_code=401, detail="Facebook credentials not found")
    
    credential = credentials[0]
    
    # Upload photo if provided
    photo_id = None
    if file:
        path = f"/tmp/{file.filename}"
        with open(path, "wb") as f:
            f.write(await file.read())
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"https://graph.facebook.com/v23.0/{credential['page_id']}/photos",
                params={
                    "access_token": credential["access_token"],
                    "published": False
                },
                files={
                    "source": open(path, "rb")
                }
            )
            
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail="Failed to upload photo")
            
            photo_id = response.json()["id"]
        
        os.remove(path)
    
    # Create post
    async with httpx.AsyncClient() as client:
        data = {
            "message": message,
            "access_token": credential["access_token"]
        }
        if photo_id:
            data["attached_media"] = [{"media_fbid": photo_id}]
        
        response = await client.post(
            f"https://graph.facebook.com/v23.0/{credential['page_id']}/feed",
            data=data
        )
        
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, detail="Failed to create post")
        
        post_id = response.json()["id"]
    
    return {"post_id": post_id}

@router.post("/photo")
async def fb_photo(
    image_url: str = Form(...),
    message: str | None = Form(None),
    credential_id: str | None = Form(None),
    user: User = Depends(get_current_user),
    db: FirestoreSession = Depends(db_session)
):
    """Post a photo to Facebook"""
    # Get the credential
    if credential_id:
        credential = await db.get("facebook_credentials", credential_id)
        if not credential or credential["user_id"] != str(user.id):
            raise HTTPException(status_code=404, detail="Credential not found")
    else:
        # Get the default (first active) credential
        credentials = await db.query(
            "facebook_credentials",
            filters=[("user_id", "==", str(user.id)), ("is_active", "==", True)]
        )
        if not credentials:
            raise HTTPException(status_code=400, detail="No Facebook account connected")
        credential = credentials[0]
    
    url = f"https://graph.facebook.com/v23.0/{credential['page_id']}/photos"
    params = {
        "url": image_url,
        "message": message or "",
        "access_token": credential["access_token"]
    }
    async with httpx.AsyncClient() as client:
        r = await client.post(url, data=params)
    if r.status_code != 200:
        raise HTTPException(400, f"Photo upload failed: {r.text}")
    return r.json()

@router.post("/video")
async def fb_video(
    video_url: str = Form(...),
    title: str = Form(...),
    description: str | None = Form(None),
    credential_id: str | None = Form(None),
    user: User = Depends(get_current_user),
    db: FirestoreSession = Depends(db_session)
):
    """Post a video to Facebook"""
    # Get the credential
    if credential_id:
        credential = await db.get("facebook_credentials", credential_id)
        if not credential or credential["user_id"] != str(user.id):
            raise HTTPException(status_code=404, detail="Credential not found")
    else:
        # Get the default (first active) credential
        credentials = await db.query(
            "facebook_credentials",
            filters=[("user_id", "==", str(user.id)), ("is_active", "==", True)]
        )
        if not credentials:
            raise HTTPException(status_code=400, detail="No Facebook account connected")
        credential = credentials[0]
        credential_id = credential["id"]  # Store the credential ID for later use
    
    # First, create a video container
    url = f"https://graph.facebook.com/v23.0/{credential['page_id']}/videos"
    params = {
        "file_url": video_url,
        "title": title,
        "description": description or "",
        "access_token": credential["access_token"]
    }
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:  # 30 second timeout for initial request
            r = await client.post(url, data=params)
            if r.status_code != 200:
                raise HTTPException(400, f"Video upload failed: {r.text}")
            response = r.json()
            
            # Store the upload status in the database
            status_data = {
                "user_id": str(user.id),
                "credential_id": credential_id,
                "video_id": response.get("id"),
                "status": "processing",
                "created_at": datetime.utcnow().isoformat(),
                "updated_at": datetime.utcnow().isoformat()
            }
            await db.add("video_uploads", status_data)
            
            return {
                "video_id": response.get("id"),
                "status": "processing",
                "message": "Video upload started. Use /video/{video_id}/status to check progress."
            }
    except httpx.TimeoutException:
        raise HTTPException(408, "Request timed out. The video might be too large or the server might be busy.")
    except httpx.RequestError as e:
        raise HTTPException(500, f"Failed to upload video: {str(e)}")

@router.get("/video/{video_id}/status")
async def video_status(
    video_id: str,
    credential_id: str | None = None,
    user: User = Depends(get_current_user),
    db: FirestoreSession = Depends(db_session)
):
    """Check the status of a video upload"""
    # Get the credential
    if credential_id:
        credential = await db.get("facebook_credentials", credential_id)
        if not credential or credential["user_id"] != str(user.id):
            raise HTTPException(status_code=404, detail="Credential not found")
    else:
        # Get the default (first active) credential
        credentials = await db.query(
            "facebook_credentials",
            filters=[("user_id", "==", str(user.id)), ("is_active", "==", True)]
        )
        if not credentials:
            raise HTTPException(status_code=400, detail="No Facebook account connected")
        credential = credentials[0]
    
    # Check status from Facebook
    url = f"https://graph.facebook.com/v23.0/{video_id}"
    params = {
        "fields": "status,status_video",
        "access_token": credential["access_token"]
    }
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            r = await client.get(url, params=params)
            if r.status_code != 200:
                raise HTTPException(400, f"Failed to get video status: {r.text}")
            
            status_data = r.json()
            
            # Update status in database
            uploads = await db.query(
                "video_uploads",
                filters=[
                    ("user_id", "==", str(user.id)),
                    ("video_id", "==", video_id)
                ]
            )
            
            if uploads:
                await db.update(
                    "video_uploads",
                    uploads[0]["id"],
                    {
                        "status": status_data.get("status", "unknown"),
                        "updated_at": datetime.utcnow().isoformat()
                    }
                )
            
            return {
                "video_id": video_id,
                "status": status_data.get("status", "unknown"),
                "status_video": status_data.get("status_video", {})
            }
    except httpx.TimeoutException:
        raise HTTPException(408, "Request timed out while checking video status")
    except httpx.RequestError as e:
        raise HTTPException(500, f"Failed to check video status: {str(e)}")

# @router.post("/video_post", status_code=status.HTTP_201_CREATED)
# async def post_video_feed(
#     video_url: str = Form(...),
#     message: str | None = Form(None),
#     user: User = Depends(get_current_user),
# ):
#     if not user.fb_page_id or not user.fb_page_access_token:
#         raise HTTPException(400, "Facebook not connected")
#     try:
#         post_id = await fb.post_video_as_feed(
#             user.fb_page_id,
#             user.fb_page_access_token,
#             video_url,
#             message or "",
#         )
#         return {"post_id": post_id}
#     except httpx.HTTPStatusError as exc:
#         raise HTTPException(400, f"Video feed post failed: {exc.response.text}")

# @router.post("/", response_model=FacebookCredential)
# async def create_facebook_credential(
#     credential: FacebookCredentialCreate,
#     db: FirestoreSession = Depends(db_session),
#     current_user: User = Depends(get_current_user)
# ):
#     """Create a new Facebook credential."""
#     credential_data = credential.model_dump()
#     credential_data["user_id"] = str(current_user.id)
#     credential_data["created_at"] = datetime.utcnow()
#     credential_data["updated_at"] = datetime.utcnow()
#     doc_id = await db.add("facebook_credentials", credential_data)
#     return {**credential_data, "id": doc_id}

@router.get("/credentials")
async def list_facebook_credentials(
    user: User = Depends(get_current_user),
    db: FirestoreSession = Depends(db_session)
):
    """List all Facebook credentials for the user"""
    credentials = await db.query(
        "facebook_credentials",
        filters=[("user_id", "==", str(user.id))]
    )
    return credentials

@router.get("/credentials/{credential_id}")
async def get_facebook_credential(
    credential_id: str,
    user: User = Depends(get_current_user),
    db: FirestoreSession = Depends(db_session)
):
    """Get a specific Facebook credential"""
    credential = await db.get("facebook_credentials", credential_id)
    if not credential or credential["user_id"] != str(user.id):
        raise HTTPException(status_code=404, detail="Credential not found")
    return credential

@router.put("/{credential_id}", response_model=FacebookCredential)
async def update_facebook_credential(
    credential_id: str,
    credential: FacebookCredentialUpdate,
    db: FirestoreSession = Depends(db_session),
    current_user: User = Depends(get_current_user)
):
    """Update a Facebook credential."""
    existing_credential = await db.get("facebook_credentials", credential_id)
    if not existing_credential:
        raise HTTPException(status_code=404, detail="Facebook credential not found")
    
    if existing_credential["user_id"] != str(current_user.id):
        raise HTTPException(status_code=403, detail="Not authorized to update this credential")
    
    update_data = credential.model_dump(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    await db.update("facebook_credentials", credential_id, update_data)
    
    updated_credential = await db.get("facebook_credentials", credential_id)
    return updated_credential

@router.delete("/credentials/{credential_id}")
async def delete_facebook_credential(
    credential_id: str,
    user: User = Depends(get_current_user),
    db: FirestoreSession = Depends(db_session)
):
    """Delete a Facebook credential"""
    credential = await db.get("facebook_credentials", credential_id)
    if not credential or credential["user_id"] != str(user.id):
        raise HTTPException(status_code=404, detail="Credential not found")
    
    await db.delete("facebook_credentials", credential_id)
    return {"message": "Credential deleted successfully"}
