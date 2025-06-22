from typing import Dict, Any, List, Optional, Union
import logging
import json
from pydantic import BaseModel, Field, ValidationError

logger = logging.getLogger(__name__)

# Define platform-specific content models
class InstagramContent(BaseModel):
    caption: str
    hashtags: List[str] = Field(default_factory=list)
    call_to_action: Optional[str] = None

class FacebookContent(BaseModel):
    title: Optional[str] = None
    caption: str
    hashtags: List[str] = Field(default_factory=list)
    call_to_action: Optional[str] = None

class TwitterContent(BaseModel):
    tweet: str
    hashtags: List[str] = Field(default_factory=list)
    mention_handles: Optional[List[str]] = None
    call_to_action: Optional[str] = None

class YouTubeContent(BaseModel):
    title: str
    description: str
    tags: List[str] = Field(default_factory=list)
    call_to_action: Optional[str] = None

# Map platform names to their content models
PLATFORM_MODELS = {
    "instagram": InstagramContent,
    "facebook": FacebookContent,
    "twitter": TwitterContent,
    "youtube": YouTubeContent
}

def validate_content_structure(platform: str, content: Dict[str, Any]) -> bool:
    """
    Validates if the content has the correct structure for the specified platform.
    
    Args:
        platform: Platform name (instagram, facebook, twitter, youtube)
        content: Content dictionary to validate
        
    Returns:
        True if content structure is valid, False otherwise
    """
    # Check if platform is supported
    platform = platform.lower()
    if platform not in PLATFORM_MODELS:
        logger.error(f"Unsupported platform: {platform}")
        return False
    
    # Check if content dictionary exists
    if not isinstance(content, dict):
        logger.error(f"Content must be a dictionary, got {type(content)}")
        return False
    
    # Check if content has a 'content' key for text content
    if "content" not in content:
        logger.error(f"Missing 'content' key in {platform} content")
        return False
    
    # Validate the content structure using the appropriate model
    try:
        model = PLATFORM_MODELS[platform]
        model(**content["content"])
        return True
    except ValidationError as e:
        logger.error(f"Invalid {platform} content structure: {e}")
        return False

def enforce_content_structure(platform: str, content: Dict[str, Any]) -> Dict[str, Any]:
    """
    Enforces the correct content structure for the specified platform.
    If the structure is incorrect, it attempts to fix it.
    
    Args:
        platform: Platform name (instagram, facebook, twitter, youtube)
        content: Content dictionary to enforce structure on
        
    Returns:
        Content with the correct structure
    """
    platform = platform.lower()
    
    # If content is already correctly structured, return it
    if validate_content_structure(platform, content):
        return content
    
    # Initialize the enforced structure
    enforced_content = {
        "content": {}
    }
    
    # Copy media URLs from original content if they exist
    for media_key in ["image_url", "carousel_urls", "video_url", "media_type"]:
        if media_key in content:
            enforced_content[media_key] = content[media_key]
    
    # Extract content fields based on platform
    if platform == "instagram":
        # Check if content has content.caption or just caption
        if "content" in content and "caption" in content["content"]:
            enforced_content["content"]["caption"] = content["content"]["caption"]
        elif "caption" in content:
            enforced_content["content"]["caption"] = content["caption"]
        else:
            # Look for any text field to use as caption
            for field in ["text", "description", "body"]:
                if field in content:
                    enforced_content["content"]["caption"] = content[field]
                    break
            else:
                enforced_content["content"]["caption"] = "No caption provided"
        
        # Extract hashtags
        if "content" in content and "hashtags" in content["content"]:
            enforced_content["content"]["hashtags"] = content["content"]["hashtags"]
        elif "hashtags" in content:
            enforced_content["content"]["hashtags"] = content["hashtags"]
        else:
            enforced_content["content"]["hashtags"] = []
        
        # Extract call to action
        if "content" in content and "call_to_action" in content["content"]:
            enforced_content["content"]["call_to_action"] = content["content"]["call_to_action"]
        elif "call_to_action" in content:
            enforced_content["content"]["call_to_action"] = content["call_to_action"]
    
    # Similar extraction logic for other platforms...
    elif platform == "facebook":
        # Extract title
        if "content" in content and "title" in content["content"]:
            enforced_content["content"]["title"] = content["content"]["title"]
        elif "title" in content:
            enforced_content["content"]["title"] = content["title"]
        
        # Extract caption
        if "content" in content and "caption" in content["content"]:
            enforced_content["content"]["caption"] = content["content"]["caption"]
        elif "caption" in content:
            enforced_content["content"]["caption"] = content["caption"]
        else:
            for field in ["text", "description", "body"]:
                if field in content:
                    enforced_content["content"]["caption"] = content[field]
                    break
            else:
                enforced_content["content"]["caption"] = "No caption provided"
        
        # Extract hashtags and call_to_action (similar to Instagram)
        if "content" in content and "hashtags" in content["content"]:
            enforced_content["content"]["hashtags"] = content["content"]["hashtags"]
        elif "hashtags" in content:
            enforced_content["content"]["hashtags"] = content["hashtags"]
        else:
            enforced_content["content"]["hashtags"] = []
        
        if "content" in content and "call_to_action" in content["content"]:
            enforced_content["content"]["call_to_action"] = content["content"]["call_to_action"]
        elif "call_to_action" in content:
            enforced_content["content"]["call_to_action"] = content["call_to_action"]
    
    elif platform == "twitter":
        # Extract tweet
        if "content" in content and "tweet" in content["content"]:
            enforced_content["content"]["tweet"] = content["content"]["tweet"]
        elif "tweet" in content:
            enforced_content["content"]["tweet"] = content["tweet"]
        elif "content" in content and "text" in content["content"]:
            enforced_content["content"]["tweet"] = content["content"]["text"]
        elif "text" in content:
            enforced_content["content"]["tweet"] = content["text"]
        else:
            # Look for any text field to use as tweet
            for field in ["caption", "description", "body"]:
                if field in content:
                    enforced_content["content"]["tweet"] = content[field]
                    break
            else:
                enforced_content["content"]["tweet"] = "No tweet provided"
        
        # Extract hashtags
        if "content" in content and "hashtags" in content["content"]:
            enforced_content["content"]["hashtags"] = content["content"]["hashtags"]
        elif "hashtags" in content:
            enforced_content["content"]["hashtags"] = content["hashtags"]
        else:
            enforced_content["content"]["hashtags"] = []
        
        # Extract mention_handles
        if "content" in content and "mention_handles" in content["content"]:
            enforced_content["content"]["mention_handles"] = content["content"]["mention_handles"]
        elif "mention_handles" in content:
            enforced_content["content"]["mention_handles"] = content["mention_handles"]
        
        # Extract call_to_action
        if "content" in content and "call_to_action" in content["content"]:
            enforced_content["content"]["call_to_action"] = content["content"]["call_to_action"]
        elif "call_to_action" in content:
            enforced_content["content"]["call_to_action"] = content["call_to_action"]
    
    elif platform == "youtube":
        # Extract title
        if "content" in content and "title" in content["content"]:
            enforced_content["content"]["title"] = content["content"]["title"]
        elif "title" in content:
            enforced_content["content"]["title"] = content["title"]
        else:
            # Look for any title-like field
            for field in ["headline", "header"]:
                if field in content:
                    enforced_content["content"]["title"] = content[field]
                    break
            else:
                enforced_content["content"]["title"] = "No title provided"
        
        # Extract description
        if "content" in content and "description" in content["content"]:
            enforced_content["content"]["description"] = content["content"]["description"]
        elif "description" in content:
            enforced_content["content"]["description"] = content["description"]
        else:
            # Look for any text field to use as description
            for field in ["text", "body", "caption"]:
                if field in content:
                    enforced_content["content"]["description"] = content[field]
                    break
            else:
                enforced_content["content"]["description"] = "No description provided"
        
        # Extract tags
        if "content" in content and "tags" in content["content"]:
            enforced_content["content"]["tags"] = content["content"]["tags"]
        elif "tags" in content:
            enforced_content["content"]["tags"] = content["tags"]
        elif "content" in content and "hashtags" in content["content"]:
            enforced_content["content"]["tags"] = content["content"]["hashtags"]
        elif "hashtags" in content:
            enforced_content["content"]["tags"] = content["hashtags"]
        else:
            enforced_content["content"]["tags"] = []
        
        # Extract call_to_action
        if "content" in content and "call_to_action" in content["content"]:
            enforced_content["content"]["call_to_action"] = content["content"]["call_to_action"]
        elif "call_to_action" in content:
            enforced_content["content"]["call_to_action"] = content["call_to_action"]
    
    # Validate the enforced structure
    if not validate_content_structure(platform, enforced_content):
        logger.warning(f"Failed to enforce {platform} content structure")
    
    return enforced_content

