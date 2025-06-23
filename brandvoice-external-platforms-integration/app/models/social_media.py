from pydantic import BaseModel
from typing import Optional

class YouTubeCredentials(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str
    expires_in: int
    scope: str

class FacebookCredentials(BaseModel):
    access_token: str
    token_type: str
    expires_in: int

class InstagramCredentials(BaseModel):
    access_token: str
    token_type: str
    expires_in: int

class TwitterCredentials(BaseModel):
    access_token: str
    access_token_secret: str
    consumer_key: str
    consumer_secret: str

class SocialMediaCredentials(BaseModel):
    youtube: Optional[YouTubeCredentials] = None
    facebook: Optional[FacebookCredentials] = None
    instagram: Optional[InstagramCredentials] = None
    twitter: Optional[TwitterCredentials] = None 