from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class FacebookCredentialBase(BaseModel):
    """Base model for Facebook credentials."""
    user_id: str
    page_id: str
    page_name: str
    access_token: str
    is_active: bool = True

class FacebookCredentialCreate(FacebookCredentialBase):
    """Model for creating Facebook credentials."""
    pass

class FacebookCredentialUpdate(BaseModel):
    """Model for updating Facebook credentials."""
    page_name: Optional[str] = None
    access_token: Optional[str] = None
    is_active: Optional[bool] = None

class FacebookCredential(FacebookCredentialBase):
    """Model for Facebook credentials."""
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True 