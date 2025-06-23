from fastapi import APIRouter, Depends, Request, HTTPException, Form, status
from app.models import User
from app.core.config import get_settings
from app.core.db_dependencies import get_db
from app.api.v1.dependencies import get_current_user
from app.models.firestore_db import FirestoreSession
from app.models.instagram import InstagramCredential, InstagramCredentialCreate, InstagramCredentialUpdate
import httpx
from starlette.responses import RedirectResponse
from datetime import datetime, timedelta

settings = get_settings()
router = APIRouter(tags=["Instagram"])

@router.get('/connect')
def instagram_connect(request: Request, user: User = Depends(get_current_user)):
    fb_auth_url = "https://www.facebook.com/v23.0/dialog/oauth"
    params = {
        "client_id": settings.facebook_app_id,
        "redirect_uri": settings.instagram_callback_url,
        "scope": "pages_show_list,instagram_basic,instagram_content_publish",
        "response_type": "code",
        "state": str(user.id)
    }
    url = httpx.URL(fb_auth_url, params=params)
    return RedirectResponse(str(url))

@router.get("/callback")
async def instagram_callback(
    request: Request,
    code: str | None = None,
    state: str | None = None,
    db: FirestoreSession = Depends(get_db)
):
    if not code or not state:
        raise HTTPException(
            status_code=400,
            detail="Missing code or state parameter in callback.")
    
    token_url = "https://graph.facebook.com/v23.0/oauth/access_token"
    params = {
        "client_id": settings.facebook_app_id,
        "redirect_uri": settings.instagram_callback_url,
        "client_secret": settings.facebook_app_secret,
        "code": code
    }

    async with httpx.AsyncClient() as client:
        response1 = await client.get(token_url, params=params)
        if response1.status_code != 200:
            raise HTTPException(status_code=response1.status_code,
                              detail="Failed to get access token from Facebook.")
        data = response1.json()
        access_token = data.get("access_token")
        expires_in = data.get("expires_in", 0)

    exchange_url = "https://graph.facebook.com/v23.0/oauth/access_token"
    exchange_params = {
        "client_id": settings.facebook_app_id,
        "grant_type": "fb_exchange_token",
        "fb_exchange_token": access_token,
        "client_secret": settings.facebook_app_secret
    }

    async with httpx.AsyncClient() as client:
        response2 = await client.get(exchange_url, params=exchange_params)
        if response2.status_code != 200:
            raise HTTPException(status_code=response2.status_code,
                              detail="Failed to exchange access token.")
        data = response2.json()
        long_lived_token = data.get("access_token")
        long_lived_expires_in = data.get("expires_in", 0)

    # Fetch Page list to get the Page ID
    pages_url = "https://graph.facebook.com/v23.0/me/accounts"
    async with httpx.AsyncClient() as client:
        r3 = await client.get(pages_url, params={"access_token": long_lived_token})
    if r3.status_code != 200 or not (pages := r3.json().get("data")):
        raise HTTPException(status_code=400, detail="Failed to fetch Facebook Pages")
    
    # Get the first page (you might want to let users choose)
    page = pages[0]
    page_id = page["id"]
    page_name = page.get("name")

    # Get IG Business Account ID
    ig_url = f"https://graph.facebook.com/v23.0/{page_id}"
    async with httpx.AsyncClient() as client:
        r4 = await client.get(ig_url, params={
            "fields": "instagram_business_account{id,username}",
            "access_token": long_lived_token
        })
    if r4.status_code != 200 or not (ig := r4.json().get("instagram_business_account")):
        raise HTTPException(status_code=400, detail="No Instagram Business account found")
    
    ig_id = ig["id"]
    ig_username = ig.get("username")

    # Create or update credential
    credential_data = {
        "user_id": state,
        "instagram_account_id": ig_id,
        "access_token": long_lived_token,
        "page_id": page_id,
        "page_name": page_name,
        "account_name": ig_username,
        "token_expires_at": datetime.utcnow() + timedelta(seconds=long_lived_expires_in),
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "is_active": True
    }

    # Check if credential already exists
    existing_credentials = await db.query(
        "instagram_credentials",
        filters=[
            ("user_id", "==", state),
            ("instagram_account_id", "==", ig_id)
        ]
    )

    if existing_credentials:
        # Update existing credential
        credential_id = existing_credentials[0]["id"]
        await db.update("instagram_credentials", credential_id, credential_data)
    else:
        # Create new credential
        credential_id = await db.add("instagram_credentials", credential_data)

    return {
        "status": "connected",
        "credential_id": credential_id,
        "instagram_business_account_id": ig_id,
        "account_name": ig_username
    }

@router.get("/credentials", response_model=list[InstagramCredential])
async def list_credentials(
    user: User = Depends(get_current_user),
    db: FirestoreSession = Depends(get_db)
):
    """List all Instagram credentials for the current user."""
    credentials = await db.query(
        "instagram_credentials",
        filters=[("user_id", "==", str(user.id)), ("is_active", "==", True)]
    )
    return credentials

@router.get("/credentials/{credential_id}", response_model=InstagramCredential)
async def get_credential(
    credential_id: str,
    user: User = Depends(get_current_user),
    db: FirestoreSession = Depends(get_db)
):
    """Get a specific Instagram credential."""
    credential = await db.get("instagram_credentials", credential_id)
    if not credential:
        raise HTTPException(status_code=404, detail="Credential not found")
    
    if credential["user_id"] != str(user.id):
        raise HTTPException(status_code=403, detail="Not authorized to access this credential")
    
    return credential

@router.delete("/credentials/{credential_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_credential(
    credential_id: str,
    user: User = Depends(get_current_user),
    db: FirestoreSession = Depends(get_db)
):
    """Delete an Instagram credential."""
    credential = await db.get("instagram_credentials", credential_id)
    if not credential:
        raise HTTPException(status_code=404, detail="Credential not found")
    
    if credential["user_id"] != str(user.id):
        raise HTTPException(status_code=403, detail="Not authorized to delete this credential")
    
    await db.update("instagram_credentials", credential_id, {"is_active": False})
    return None

# Media endpoints remain the same but use the credential from the database
@router.post("/media", status_code=status.HTTP_201_CREATED)
async def create_media(
    image_url: str = Form(...),
    caption: str | None = Form(None),
    credential_id: str | None = Form(None),
    user: User = Depends(get_current_user),
    db: FirestoreSession = Depends(get_db)
):
    # Get the credential
    if credential_id:
        credential = await db.get("instagram_credentials", credential_id)
        if not credential or credential["user_id"] != str(user.id):
            raise HTTPException(status_code=404, detail="Credential not found")
    else:
        # Get the default (first active) credential
        credentials = await db.query(
            "instagram_credentials",
            filters=[("user_id", "==", str(user.id)), ("is_active", "==", True)]
        )
        if not credentials:
            raise HTTPException(status_code=400, detail="No Instagram account connected")
        credential = credentials[0]
    
    url = f"https://graph.facebook.com/v23.0/{credential['instagram_account_id']}/media"
    params = {
        "image_url": image_url,
        "caption": caption or "",
        "access_token": credential["access_token"]
    }
    async with httpx.AsyncClient() as client:
        r = await client.post(url, data=params)
    if r.status_code != 200:
        raise HTTPException(400, f"Media create failed: {r.text}")
    container_id = r.json()["id"]
    return {"container_id": container_id}

@router.get("/media/{container_id}/status")
async def media_status(
    container_id: str,
    credential_id: str | None = None,
    user: User = Depends(get_current_user),
    db: FirestoreSession = Depends(get_db)
):
    # Get the credential
    if credential_id:
        credential = await db.get("instagram_credentials", credential_id)
        if not credential or credential["user_id"] != str(user.id):
            raise HTTPException(status_code=404, detail="Credential not found")
    else:
        # Get the default (first active) credential
        credentials = await db.query(
            "instagram_credentials",
            filters=[("user_id", "==", str(user.id)), ("is_active", "==", True)]
        )
        if not credentials:
            raise HTTPException(status_code=400, detail="No Instagram account connected")
        credential = credentials[0]
    
    url = f"https://graph.facebook.com/v23.0/{container_id}"
    params = {
        "fields": "status_code",
        "access_token": credential["access_token"]
    }
    async with httpx.AsyncClient() as client:
        r = await client.get(url, params=params)
    if r.status_code != 200:
        raise HTTPException(400, f"Status fetch failed: {r.text}")
    return {"status_code": r.json().get("status_code")}

@router.post("/publish")
async def publish_media(
    container_id: str = Form(...),
    credential_id: str | None = Form(None),
    user: User = Depends(get_current_user),
    db: FirestoreSession = Depends(get_db)
):
    # Get the credential
    if credential_id:
        credential = await db.get("instagram_credentials", credential_id)
        if not credential or credential["user_id"] != str(user.id):
            raise HTTPException(status_code=404, detail="Credential not found")
    else:
        # Get the default (first active) credential
        credentials = await db.query(
            "instagram_credentials",
            filters=[("user_id", "==", str(user.id)), ("is_active", "==", True)]
        )
        if not credentials:
            raise HTTPException(status_code=400, detail="No Instagram account connected")
        credential = credentials[0]
    
    url = f"https://graph.facebook.com/v23.0/{credential['instagram_account_id']}/media_publish"
    params = {
        "creation_id": container_id,
        "access_token": credential["access_token"]
    }
    async with httpx.AsyncClient() as client:
        r = await client.post(url, data=params)
    if r.status_code != 200:
        raise HTTPException(400, f"Publish failed: {r.text}")
    return {"media_object_id": r.json()["id"]}
