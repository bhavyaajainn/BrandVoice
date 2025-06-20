from pydantic import BaseModel, Field
from typing import Dict, List, Optional,Any

class WebsiteContent(BaseModel):
    """Schema for website SEO content"""
    
    meta_title: str = Field(
        description="SEO-optimized meta title for the website (50-60 characters)"
    )
    
    meta_description: str = Field(
        description="SEO-optimized meta description (150-160 characters)"
    )
    
    header_tags: Dict[str, str] = Field(
        description="H1, H2, and H3 tag suggestions with keywords",
        default_factory=dict
    )
    
    page_content: List[Dict[str, str]] = Field(
        description="Suggested content sections with SEO-optimized copy",
        default_factory=list
    )
    
    keywords: List[str] = Field(
        description="Primary and secondary keywords to target",
        default_factory=list
    )

class BlogContent(BaseModel):
    """Schema for blog SEO content"""
    
    blog_posts: List[Dict[str, Any]] = Field(
        description="List of blog post ideas with SEO elements",
        default_factory=list
    )
    
    content_calendar: Optional[Dict[str, List[str]]] = Field(
        description="Suggested content calendar with topics by month/quarter",
        default=None
    )
    
    keywords: List[str] = Field(
        description="Blog-specific keywords to target",
        default_factory=list
    )

class SocialMediaContent(BaseModel):
    """Schema for social media SEO content"""
    
    platform_content: Dict[str, List[Dict[str, str]]] = Field(
        description="Content ideas for each social platform (Twitter, Facebook, Instagram, Youtube)",
        default_factory=dict
    )
    
    hashtags: List[str] = Field(
        description="Recommended hashtags for social media posts",
        default_factory=list
    )
    
    posting_schedule: Optional[Dict[str, str]] = Field(
        description="Recommended posting frequency and timing",
        default=None
    )

class ProductSEOContentSchema(BaseModel):
    """Schema for comprehensive product-specific SEO content across platforms"""
    
    product_id: str = Field(
        description="The ID of the product this content is for"
    )
    
    brand_id: str = Field(
        description="The ID of the brand this product belongs to"
    )
    
    website: WebsiteContent = Field(
        description="SEO content for product pages on the brand website"
    )
    
    blog: Optional[BlogContent] = Field(
        description="SEO content for product-related blog posts",
        default=None
    )
    
    social_media: Optional[SocialMediaContent] = Field(
        description="SEO content for product-focused social media posts",
        default=None
    )
    
    email: Optional[Dict[str, Any]] = Field(
        description="SEO content for product-focused email marketing",
        default=None
    )
    
    additional_platforms: Optional[Dict[str, Any]] = Field(
        description="SEO content for other product marketing platforms",
        default=None
    )