from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class InstagramCredentialBase(BaseModel):
    """Base model for Instagram credentials."""
    user_id: str = Field(..., description="User ID who owns this credential")
    instagram_account_id: str = Field(..., description="Instagram Business Account ID")
    access_token: str = Field(..., description="Instagram Access Token")
    page_id: str = Field(..., description="Facebook Page ID")
    page_name: Optional[str] = Field(None, description="Facebook Page Name")
    account_name: Optional[str] = Field(None, description="Instagram Account Name")
    token_expires_at: Optional[datetime] = Field(None, description="Token expiration timestamp")

class InstagramCredentialCreate(InstagramCredentialBase):
    """Model for creating Instagram credentials."""
    pass

class InstagramCredentialUpdate(BaseModel):
    """Model for updating Instagram credentials."""
    access_token: Optional[str] = Field(None, description="Instagram Access Token")
    token_expires_at: Optional[datetime] = Field(None, description="Token expiration timestamp")
    account_name: Optional[str] = Field(None, description="Instagram Account Name")

class InstagramCredential(InstagramCredentialBase):
    """Model for Instagram credentials."""
    id: str = Field(..., description="Credential ID")
    created_at: datetime = Field(..., description="Creation timestamp")
    updated_at: datetime = Field(..., description="Last update timestamp")
    is_active: bool = Field(True, description="Whether this credential is active")

    class Config:
        from_attributes = True 