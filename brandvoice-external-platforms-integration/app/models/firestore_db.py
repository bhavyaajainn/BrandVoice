import firebase_admin
from firebase_admin import credentials, firestore, auth, initialize_app
from pathlib import Path
from typing import AsyncGenerator, Any, Dict, Optional, Type, List, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from fastapi import HTTPException, status
import requests
import json
import os
from datetime import datetime
from app.core.config import get_settings
from app.core.firebase import get_firestore_client
import logging

logger = logging.getLogger(__name__)
settings = get_settings()

# Initialize Firebase Admin SDK lazily
_firebase_app = None
_db = None

def get_firebase_app():
    global _firebase_app
    if _firebase_app is None:
        try:
            # Use the service account file path from settings
            cred = credentials.Certificate(settings.google_application_credentials)
            _firebase_app = initialize_app(cred)
        except FileNotFoundError:
            logger.warning("Service account file not found. Firebase features will be disabled.")
            return None
        except Exception as e:
            logger.error(f"Error initializing Firebase: {str(e)}")
            return None
    return _firebase_app

def get_db():
    global _db
    if _db is None:
        app = get_firebase_app()
        if app is not None:
            _db = firestore.client()
    return _db

def get_collection(collection_name: str):
    db = get_db()
    if db is None:
        raise RuntimeError("Firebase is not initialized. Check service account configuration.")
    return db.collection(collection_name)

class FirestoreSession:
    def __init__(self):
        self.db = get_firestore_client()
        if self.db is None:
            raise RuntimeError("Firebase is not initialized. Check service account configuration.")

    async def add(self, collection: str, data: dict) -> str:
        # Convert datetime objects to strings
        data = self._serialize_datetime(data)
        
        # Add timestamps
        data["created_at"] = datetime.utcnow()
        data["modified_at"] = datetime.utcnow()
        
        doc_ref = self.db.collection(collection).document()
        doc_ref.set(data)
        return doc_ref.id

    async def get(self, collection: str, doc_id: str) -> dict:
        doc_ref = self.db.collection(collection).document(doc_id)
        doc = doc_ref.get()
        if not doc.exists:
            return None
        doc_dict = doc.to_dict()
        if doc_dict is None:
            return None
        return {"id": doc.id, **doc_dict}

    async def query(
        self,
        collection: str,
        filters: List[Tuple[str, str, Any]] = [],
        order_by: Optional[str] = None,
        limit: Optional[int] = None
    ) -> List[Dict[str, Any]]:
        """Query documents in a collection."""
        query = self.db.collection(collection)
        
        # Apply filters
        for field, op, value in filters:
            query = query.where(field, op, value)
        
        # Apply ordering
        if order_by:
            query = query.order_by(order_by)
        
        # Apply limit
        if limit:
            query = query.limit(limit)
        
        # Execute query
        docs = query.stream()
        return [{"id": doc.id, **doc.to_dict()} for doc in docs]

    async def update(self, collection: str, doc_id: str, data: dict) -> None:
        """Update a document in a collection."""
        # Convert datetime objects to strings
        data = self._serialize_datetime(data)
        
        # Add timestamp
        data["modified_at"] = datetime.utcnow()
        
        doc_ref = self.db.collection(collection).document(doc_id)
        doc_ref.update(data)

    async def delete(self, collection: str, doc_id: str) -> None:
        """Delete a document from a collection."""
        doc_ref = self.db.collection(collection).document(doc_id)
        doc_ref.delete()

    def _serialize_datetime(self, data: dict) -> dict:
        """Pass through datetime objects for Firestore Timestamp conversion."""
        # The Firestore client library automatically converts timezone-aware
        # Python datetime objects to Firestore Timestamp objects.
        # We just need to ensure they are not converted to strings first.
        return data

# Collection access functions
def get_users_collection():
    return get_collection('users')

def get_products_collection():
    return get_collection('products')

def get_content_collection():
    return get_collection('content')

def get_schedules_collection():
    return get_collection('schedules')

def get_scheduled_posts_collection():
    return get_collection('scheduled_posts')

def get_facebook_credentials_collection():
    return get_collection('facebook_credentials')

def get_instagram_credentials_collection():
    return get_collection('instagram_credentials')

def get_twitter_credentials_collection():
    return get_collection('twitter_credentials')

def get_youtube_credentials_collection():
    return get_collection('youtube_credentials')

# Get Firebase Web API Key from environment variable
FIREBASE_WEB_API_KEY = os.getenv("FIREBASE_WEB_API_KEY")
if not FIREBASE_WEB_API_KEY:
    raise ValueError("FIREBASE_WEB_API_KEY environment variable is not set")

async def get_db() -> AsyncGenerator[FirestoreSession, None]:
    """
    Get a Firestore session.
    """
    session = FirestoreSession()
    try:
        yield session
    finally:
        pass  # No cleanup needed for Firestore

# Firebase Auth helper functions
async def create_firebase_user(email: str, password: str) -> str:
    """
    Create a new user in Firebase Auth.
    """
    try:
        user = auth.create_user(
            email=email,
            password=password,
            email_verified=False
        )
        return user.uid
    except auth.EmailAlreadyExistsError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

async def sign_in_with_email_password(email: str, password: str) -> Dict[str, str]:
    """
    Sign in with email and password using Firebase Auth REST API.
    """
    try:
        # Sign in with email and password using Firebase Web API
        response = requests.post(
            f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={FIREBASE_WEB_API_KEY}",
            json={
                "email": email,
                "password": password,
                "returnSecureToken": True
            }
        )
        
        if response.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
            
        data = response.json()
        return {
            "id_token": data["idToken"],
            "refresh_token": data["refreshToken"]
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )

async def verify_firebase_token(token: str) -> Dict[str, Any]:
    """Verify a Firebase ID token."""
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        raise ValueError(f"Invalid token: {str(e)}")

async def get_firebase_user(uid: str) -> Dict[str, Any]:
    """
    Get a user from Firebase Auth.
    """
    try:
        user = auth.get_user(uid)
        return {
            "uid": user.uid,
            "email": user.email,
            "email_verified": user.email_verified,
            "display_name": user.display_name,
            "photo_url": user.photo_url,
            "disabled": user.disabled
        }
    except auth.UserNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        ) 