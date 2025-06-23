from datetime import datetime
from typing import Optional, List, Dict, Any, Union
from app.models.user import User, UserCreate, UserUpdate, UserInDB
from app.models.firestore_db import FirestoreSession
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserService:
    def __init__(self, session: FirestoreSession):
        self.session = session
        if not isinstance(self.session, FirestoreSession):
            raise ValueError("Invalid session type. Expected FirestoreSession.")

    @staticmethod
    def get_password_hash(password: str) -> str:
        return pwd_context.hash(password)

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        return pwd_context.verify(plain_password, hashed_password)

    async def create_user(self, user_data: Union[UserCreate, Dict[str, Any]]) -> str:
        """
        Create a new user with all social media fields initialized.
        """
        if isinstance(user_data, dict):
            # If we receive a dictionary (e.g., from Firebase registration)
            user_dict = {
                "email": user_data["email"].lower(),
                "full_name": user_data.get("full_name"),
                "is_active": True,
                "is_superuser": False,
                "firebase_uid": user_data.get("firebase_uid"),
                # Social Media Fields
                "twitter_access_token": None,
                "twitter_access_token_secret": None,
                "instagram_page_access_token": None,
                "instagram_business_account_id": None,
                "fb_page_id": None,
                "fb_page_access_token": None,
                "youtube_access_token": None,
                "youtube_channel_id": None,
                "youtube_refresh_token": None,
                # Timestamps
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
        else:
            # If we receive a UserCreate object
            user_dict = UserInDB.from_create(user_data).model_dump()
            user_dict.pop("id")  # Remove the empty ID as Firestore will generate one
            
            # Add social media fields
            user_dict.update({
                "twitter_access_token": None,
                "twitter_access_token_secret": None,
                "instagram_page_access_token": None,
                "instagram_business_account_id": None,
                "fb_page_id": None,
                "fb_page_access_token": None,
                "youtube_access_token": None,
                "youtube_channel_id": None,
                "youtube_refresh_token": None
            })
        
        # Add to Firestore
        user_id = await self.session.add("users", user_dict)
        return user_id

    async def get_user(self, user_id: str) -> Optional[User]:
        user = await self.session.get("users", user_id)
        if user:
            return User.model_validate(user)
        return None

    async def get_user_by_email(self, email: str, include_password: bool = False) -> Optional[Union[User, UserInDB]]:
        """
        Get a user by email.
        """
        users = await self.session.query("users", filters=[("email", "==", email.lower())])
        if not users:
            return None
            
        user_data = users[0]
        if include_password:
            return UserInDB.model_validate(user_data)
        return User.model_validate(user_data)

    async def get_user_by_firebase_uid(self, firebase_uid: str) -> Optional[User]:
        """
        Get a user by Firebase UID.
        """
        users = await self.session.query("users", filters=[("firebase_uid", "==", firebase_uid)])
        if not users:
            return None
        return User.model_validate(users[0])

    async def update_user(self, user_id: str, user_update: Union[UserUpdate, Dict[str, Any]]) -> User:
        """
        Update a user.
        """
        # Convert UserUpdate to dict if needed
        if isinstance(user_update, UserUpdate):
            update_data = user_update.model_dump(exclude_unset=True)
        else:
            update_data = user_update
            
        # Add timestamp
        update_data["updated_at"] = datetime.utcnow()
        
        # Update in Firestore
        await self.session.update("users", user_id, update_data)
        
        # Get and return updated user
        updated_user = await self.get_user(user_id)
        if not updated_user:
            raise ValueError(f"User {user_id} not found after update")
        return updated_user

    async def delete_user(self, user_id: str) -> None:
        """
        Delete a user.
        """
        await self.session.delete("users", user_id)

    async def list_users(self, skip: int = 0, limit: int = 100) -> List[User]:
        # Note: Firestore doesn't support offset pagination directly
        # This is a simplified version that gets all users and slices them
        users = await self.session.query("users", limit=limit)
        return [User.model_validate(user) for user in users[skip:skip + limit]] 