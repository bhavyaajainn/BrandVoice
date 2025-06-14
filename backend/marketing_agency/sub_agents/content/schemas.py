
from pydantic import Field
from pydantic import BaseModel
from typing import List, Dict, Any,Optional, Union


class SocialPost(BaseModel):
    text: str
    hashtags: List[str] = Field(default_factory=list)
    call_to_action: Optional[str] = None

class InstagramPost(BaseModel):
    caption: str
    hashtags: List[str] = Field(default_factory=list)
    image_description: Optional[str] = None
    call_to_action: Optional[str] = None

class BlogSection(BaseModel):
    heading: str
    content: str

class BlogContent(BaseModel):
    title: str
    meta_description: Optional[str] = None
    sections: List[BlogSection] = Field(default_factory=list)
    call_to_action: Optional[str] = None

class EmailContent(BaseModel):
    subject_line: str
    body: str
    preview_text: Optional[str] = None
    call_to_action: Optional[str] = None

class ContentStructure(BaseModel):
    platforms: Dict[str, Any]
    universal: Dict[str, Any]

class PlatformContent(BaseModel):
    """Dynamic content container for a specific platform"""
    content: Union[SocialPost, InstagramPost, BlogContent, EmailContent, Dict[str, Any]]
    
    class Config:
        arbitrary_types_allowed = True
