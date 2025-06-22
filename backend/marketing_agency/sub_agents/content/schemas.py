
from pydantic import Field
from pydantic import BaseModel
from typing import List, Dict, Any,Optional, Union


class SocialPost(BaseModel):
    caption: str
    hashtags: List[str] = Field(default_factory=list)
    call_to_action: Optional[str] = None

class InstagramPost(BaseModel):
    caption: str
    hashtags: List[str] = Field(default_factory=list)
    image_description: Optional[str] = None
    call_to_action: Optional[str] = None

class FacebookPost(BaseModel):
    title: Optional[str] = None
    caption: str
    hashtags: List[str] = Field(default_factory=list)
    call_to_action: Optional[str] = None

class TwitterPost(BaseModel):
    tweet: str
    hashtags: List[str] = Field(default_factory=list)
    mention_handles: Optional[List[str]] = None
    call_to_action: Optional[str] = None

class YouTubePost(BaseModel):
    title: str
    description: str
    tags: List[str] = Field(default_factory=list)
    call_to_action: Optional[str] = None



class ContentStructure(BaseModel):
    platforms: Dict[str, Any]
    universal: Dict[str, Any]

class PlatformContent(BaseModel):
    """Dynamic content container for a specific platform"""
    content: Union[SocialPost, InstagramPost,FacebookPost,TwitterPost, YouTubePost,Dict[str, Any]]
    
    class Config:
        arbitrary_types_allowed = True
