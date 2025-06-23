from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials, OAuth2PasswordRequestForm
from app.models.user import User, UserCreate, UserInDB, UserUpdate
from app.services.user_service import UserService
from app.api.v1.dependencies import get_user_service, get_current_user
from app.models.firestore_db import (
    create_firebase_user,
    verify_firebase_token,
    get_firebase_user,
    sign_in_with_email_password
)
from app.core.db_dependencies import db_session
from typing import Dict

router = APIRouter(prefix="/auth", tags=["Authentication"])

security = HTTPBearer()

@router.post("/register", response_model=Dict[str, str])
async def register(
    user_in: UserCreate,
    user_service: UserService = Depends(get_user_service)
):
    """
    Register a new user with Firebase Authentication.
    """
    # Check if user already exists
    existing_user = await user_service.get_user_by_email(user_in.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Create user in Firebase Auth
    firebase_uid = await create_firebase_user(user_in.email, user_in.password)
    
    # Create user in Firestore
    user_data = user_in.model_dump()
    user_data["firebase_uid"] = firebase_uid
    user_id = await user_service.create_user(user_data)
    
    return {"message": "User registered successfully", "user_id": user_id}

@router.post("/login", response_model=Dict[str, str])
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    user_service: UserService = Depends(get_user_service)
):
    """
    Login with Firebase Authentication.
    """
    # Get user from Firestore
    user = await user_service.get_user_by_email(form_data.username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Sign in with Firebase
    tokens = await sign_in_with_email_password(form_data.username, form_data.password)
    
    return {
        "access_token": tokens["id_token"],
        "refresh_token": tokens["refresh_token"],
        "token_type": "bearer",
        "user_id": str(user.id)
    }

@router.get("/me", response_model=User)
async def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    """
    Get current user information.
    """
    return current_user

@router.put("/me", response_model=User)
async def update_current_user_info(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    user_service: UserService = Depends(get_user_service)
):
    """
    Update current user information. Email cannot be updated.
    """
    # Update user
    update_data = user_update.model_dump(exclude_unset=True)
    
    # Ensure email and firebase_uid cannot be updated
    if "email" in update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email cannot be updated"
        )
    if "firebase_uid" in update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Firebase UID cannot be updated"
        )
    
    await user_service.update_user(current_user.id, update_data)
    
    # Get updated user
    if not current_user.firebase_uid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User has no Firebase UID"
        )
    updated_user = await user_service.get_user_by_firebase_uid(current_user.firebase_uid)
    return updated_user

@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
async def delete_current_user(
    current_user: User = Depends(get_current_user),
    user_service: UserService = Depends(get_user_service)
):
    """
    Delete current user account.
    """
    success = await user_service.delete_user(str(current_user.id))
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )