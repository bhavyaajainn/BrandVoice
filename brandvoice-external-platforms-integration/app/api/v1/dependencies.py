from fastapi import Depends, HTTPException, status, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.models.user import User
from app.services.user_service import UserService
from app.models.firestore_db import verify_firebase_token, FirestoreSession
from app.core.db_dependencies import db_session

security = HTTPBearer()

async def get_user_service(db: FirestoreSession = Depends(db_session)) -> UserService:
    """
    Get a UserService instance.
    """
    if not isinstance(db, FirestoreSession):
        raise ValueError("Invalid database session type")
    return UserService(db)

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(security),
    user_service: UserService = Depends(get_user_service)
) -> User:
    """
    Get the current user from the token.
    """
    try:
        # Verify Firebase token
        decoded_token = await verify_firebase_token(credentials.credentials)
        
        # Get user from Firestore using Firebase UID
        user = await user_service.get_user_by_firebase_uid(decoded_token["uid"])
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        return user
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )
