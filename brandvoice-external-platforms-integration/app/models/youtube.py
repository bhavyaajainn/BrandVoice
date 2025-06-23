from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class YouTubeCredentialBase(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str
    expires_at: datetime
    scope: str

class YouTubeCredentialCreate(YouTubeCredentialBase):
    pass

class YouTubeCredentialUpdate(BaseModel):
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None
    token_type: Optional[str] = None
    expires_at: Optional[datetime] = None
    scope: Optional[str] = None

class YouTubeCredential(YouTubeCredentialBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True 