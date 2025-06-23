from fastapi import APIRouter, Depends, HTTPException, Request, Form, UploadFile, File, status
from typing import List
from app.core.config import get_settings
from app.models.user import User
from app.core.db_dependencies import get_db
from app.api.v1.dependencies import get_firebase_user
from app.models.firestore_db import FirestoreSession
from app.models.youtube import YouTubeCredential, YouTubeCredentialCreate, YouTubeCredentialUpdate
import httpx
from starlette.responses import RedirectResponse
import os
from datetime import datetime, timedelta
import json
from app.services.user_service_new import UserService
from app.core.db_dependencies import db_session

router = APIRouter()
settings = get_settings()

@router.get("/connect")
async def youtube_connect(request: Request, user: User = Depends(get_firebase_user)):
    print(f"***Received Callback URI: {settings.youtube_callback_url}***")
    params = {
        "client_id": settings.youtube_client_id,
        "redirect_uri": "https://brandvoice-api-995012456302.us-central1.run.app/api/v1/youtube/callback",
        "response_type": "code",
        "scope": "https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.force-ssl",
        "access_type": "offline",
        "prompt": "consent",
        "state": str(user.id)  # Pass user ID in state parameter
    }
    auth_url = f"https://accounts.google.com/o/oauth2/v2/auth?{'&'.join(f'{k}={v}' for k, v in params.items())}"
    # return RedirectResponse(auth_url)
    return {"redirect_to" :auth_url}

@router.get("/callback")
async def youtube_callback(
    code: str,
    state: str, # This is the firebase UID
    db: FirestoreSession = Depends(db_session)
):
    """
    Handle the OAuth2 callback from YouTube.
    """
    # Get user from firebase
    user_service = UserService()
    user = await user_service.get_user_by_firebase_uid(state)
    if not user:
        raise HTTPException(404, "User not found")

    try:
        # Exchange code for tokens
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://oauth2.googleapis.com/token",
                data={
                    "client_id": settings.youtube_client_id,
                    "client_secret": settings.youtube_client_secret,
                    "code": code,
                    "grant_type": "authorization_code",
                    "redirect_uri": "https://brandvoice-api-995012456302.us-central1.run.app/api/v1/youtube/callback"
                }
            )
            
            if response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Failed to get access token"
                )
            
            token_data = response.json()
            
            # Create credential in database
            credential_data = {
                "user_id": user.id,  # state parameter contains user ID
                "access_token": token_data["access_token"],
                "refresh_token": token_data["refresh_token"],
                "token_type": token_data["token_type"],
                "expires_at": (datetime.utcnow() + timedelta(seconds=token_data["expires_in"])).isoformat(),
                "scope": token_data["scope"],
                "created_at": datetime.utcnow().isoformat(),
                "updated_at": datetime.utcnow().isoformat()
            }
            
            # Check if user already has credentials
            existing_credentials = await db.query(
                "youtube_credentials",
                filters=[("user_id", "==", user.id)]
            )
            
            if existing_credentials:
                # Update existing credential
                credential_id = existing_credentials[0]["id"]
                await db.update("youtube_credentials", credential_id, credential_data)
                return {"message": "YouTube credentials updated successfully", "credential_id": credential_id}
            else:
                # Create new credential
                credential_id = await db.add("youtube_credentials", credential_data)
                return {"message": "YouTube credentials created successfully", "credential_id": credential_id}
            
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.post("/upload")
async def youtube_upload(
    title: str = Form(...),
    description: str = Form(""),
    file: UploadFile = File(...),
    user: User = Depends(get_firebase_user),
    db: FirestoreSession = Depends(get_db)
):
    path = f"/tmp/{file.filename}"
    with open(path, "wb") as f:
        f.write(await file.read())
    
    # Get user's YouTube credentials
    credentials = await db.query(
        "youtube_credentials",
        filters=[("user_id", "==", str(user.id))]
    )
    if not credentials:
        raise HTTPException(status_code=401, detail="YouTube credentials not found")
    
    credential = credentials[0]
    
    # Upload to YouTube
    async with httpx.AsyncClient() as client:
        # Prepare the metadata part
        metadata = {
            "snippet": {
                "title": title,
                "description": description,
                "categoryId": "22"  # People & Blogs category
            },
            "status": {
                "privacyStatus": "private"
            }
        }
        
        # Prepare the multipart request
        files = {
            "file": ("video.mp4", open(path, "rb"), "video/mp4")
        }
        
        data = {
            "part": "snippet,status",
            "uploadType": "multipart"
        }
        
        headers = {
            "Authorization": f"Bearer {credential['access_token']}"
        }
        
        # First, create the video with metadata
        response = await client.post(
            "https://www.googleapis.com/upload/youtube/v3/videos",
            params=data,
            headers=headers,
            files=files,
            data={"metadata": json.dumps(metadata)}
        )
        
        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"Failed to upload to YouTube: {response.text}"
            )
        
        video_id = response.json()["id"]
        
        # Update the video with metadata to ensure it's set
        update_response = await client.put(
            f"https://www.googleapis.com/youtube/v3/videos?part=snippet,status",
            headers=headers,
            json={
                "id": video_id,
                "snippet": {
                    "title": title,
                    "description": description,
                    "categoryId": "22"  # People & Blogs category
                },
                "status": {
                    "privacyStatus": "public"
                }
            }
        )
        
        if update_response.status_code != 200:
            print(f"Warning: Failed to update video metadata: {update_response.text}")
    
    os.remove(path)
    return {"video_id": video_id}

# @router.post("/", response_model=YouTubeCredential)
# async def create_youtube_credential(
#     credential: YouTubeCredentialCreate,
#     db: FirestoreSession = Depends(get_db),
#     current_user: User = Depends(get_firebase_user)
# ):
#     """Create a new YouTube credential."""
#     credential_data = credential.model_dump()
#     credential_data["user_id"] = str(current_user.id)
#     credential_data["created_at"] = datetime.utcnow()
#     credential_data["updated_at"] = datetime.utcnow()
#     doc_id = await db.add("youtube_credentials", credential_data)
#     return {**credential_data, "id": doc_id}

# @router.get("/", response_model=List[YouTubeCredential])
# async def list_youtube_credentials(
#     db: FirestoreSession = Depends(get_db),
#     current_user: User = Depends(get_firebase_user)
# ):
#     """List all YouTube credentials for the current user."""
#     credentials = await db.query(
#         "youtube_credentials",
#         filters=[("user_id", "==", str(current_user.id))]
#     )
#     return credentials

@router.get("/{user_id}", response_model=YouTubeCredential)
async def get_youtube_credential(
    credential_id: str,
    db: FirestoreSession = Depends(get_db),
    current_user: User = Depends(get_firebase_user)
):
    """Get a specific YouTube credential."""
    credential = await db.get("youtube_credentials", credential_id)
    if not credential:
        raise HTTPException(status_code=404, detail="YouTube credential not found")
    
    if credential["user_id"] != str(current_user.id):
        raise HTTPException(status_code=403, detail="Not authorized to access this credential")
    
    return credential

@router.put("/{user_id}", response_model=YouTubeCredential)
async def update_youtube_credential(
    user_id: str,
    credential: YouTubeCredentialUpdate,
    db: FirestoreSession = Depends(get_db),
    current_user: User = Depends(get_firebase_user)
):
    """Update a YouTube credential."""
    existing_credential = await db.get("youtube_credentials", user_id)
    if not existing_credential:
        raise HTTPException(status_code=404, detail="YouTube credential not found")
    
    if existing_credential["user_id"] != str(current_user.id):
        raise HTTPException(status_code=403, detail="Not authorized to update this credential")
    
    update_data = credential.model_dump(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    await db.update("youtube_credentials", user_id, update_data)
    
    updated_credential = await db.get("youtube_credentials", user_id)
    return updated_credential

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_youtube_credential(
    user_id: str,
    db: FirestoreSession = Depends(get_db),
    current_user: User = Depends(get_firebase_user)
):
    """Delete a YouTube credential."""
    existing_credential = await db.get("youtube_credentials", user_id)
    if not existing_credential:
        raise HTTPException(status_code=404, detail="YouTube credential not found")
    
    if existing_credential["user_id"] != str(current_user.id):
        raise HTTPException(status_code=403, detail="Not authorized to delete this credential")
    
    await db.delete("youtube_credentials", user_id)
