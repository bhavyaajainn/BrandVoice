from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class TwitterCredential(BaseModel):
    """Model for Twitter credentials."""
    id: str = Field(..., description="Credential ID")
    user_id: str = Field(..., description="User ID who owns this credential")
    access_token: str = Field(..., description="Twitter Access Token")
    access_token_secret: str = Field(..., description="Twitter Access Token Secret")
    created_at: datetime = Field(..., description="Creation timestamp")
    updated_at: datetime = Field(..., description="Last update timestamp")
    is_active: bool = Field(..., description="Is the credential active")

    class Config:
        from_attributes = True