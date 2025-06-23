from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field

class UserBase(BaseModel):
    """Base user model with common attributes."""
    email: EmailStr
    full_name: Optional[str] = None
    is_active: bool = True
    is_superuser: bool = False
    firebase_uid: Optional[str] = None
    # Social Media Fields
    twitter_access_token: Optional[str] = None
    twitter_access_token_secret: Optional[str] = None
    instagram_page_access_token: Optional[str] = None
    instagram_business_account_id: Optional[str] = None
    fb_page_id: Optional[str] = None
    fb_page_access_token: Optional[str] = None
    youtube_access_token: Optional[str] = None
    youtube_channel_id: Optional[str] = None
    youtube_refresh_token: Optional[str] = None

class UserCreate(UserBase):
    """User creation model with password."""
    password: str

class UserUpdate(BaseModel):
    """User update model with optional fields. Email cannot be updated."""
    full_name: Optional[str] = None
    is_active: Optional[bool] = None
    # Social Media Fields
    twitter_access_token: Optional[str] = None
    twitter_access_token_secret: Optional[str] = None
    instagram_page_access_token: Optional[str] = None
    instagram_business_account_id: Optional[str] = None
    fb_page_id: Optional[str] = None
    fb_page_access_token: Optional[str] = None
    youtube_access_token: Optional[str] = None
    youtube_channel_id: Optional[str] = None
    youtube_refresh_token: Optional[str] = None

class UserInDB(UserBase):
    """User model as stored in database."""
    id: str
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    @classmethod
    def from_create(cls, user_create: UserCreate) -> "UserInDB":
        """Create a UserInDB instance from a UserCreate instance."""
        now = datetime.utcnow()
        return cls(
            id="",  # Will be set by Firestore
            email=user_create.email.lower(),
            full_name=user_create.full_name,
            hashed_password=user_create.password,  # Will be hashed in the service
            created_at=now,
            updated_at=now,
            is_active=True,
            is_superuser=False,
            firebase_uid=None,
            twitter_access_token=None,
            twitter_access_token_secret=None,
            instagram_page_access_token=None,
            instagram_business_account_id=None,
            fb_page_id=None,
            fb_page_access_token=None,
            youtube_access_token=None,
            youtube_channel_id=None,
            youtube_refresh_token=None
        )

    class Config:
        from_attributes = True

class User(UserBase):
    """User model for API responses."""
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class UserRead(User):
    """Model for reading user data, used in API responses"""
    pass
