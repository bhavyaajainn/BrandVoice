from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class Content(BaseModel):
    id: str
    user_id: str
    product_id: str
    body_text: str
    image_url: Optional[str] = None
    state: str = "draft"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    modified_at: datetime = Field(default_factory=datetime.utcnow)

class ContentCreate(BaseModel):
    product_id: str
    body_text: str
    image_url: Optional[str] = None

class ContentUpdate(BaseModel):
    body_text: Optional[str] = None
    image_url: Optional[str] = None
    state: Optional[str] = None
