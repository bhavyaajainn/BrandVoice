from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any

# Base response models
class BaseResponse(BaseModel):
    status: str = Field(description="Status of the operation (success, error, exists)")
    message: str = Field(description="Human-readable message about the operation")

# Brand models
class BrandListResponse(BaseResponse):
    brands: List[str] = Field(description="List of brand names")
    count: int = Field(description="Number of brands")

# Product models
class ProductListResponse(BaseResponse):
    brand: str = Field(description="Active brand name")
    products: List[str] = Field(description="List of product names for the active brand")
    count: int = Field(description="Number of products")

# Analysis data models
class BrandAnalysisData(BaseModel):
    identity: Optional[Dict[str, Any]] = Field(None, description="Brand identity information")
    positioning: Optional[Dict[str, Any]] = Field(None, description="Brand positioning information")
    values: Optional[List[str]] = Field(None, description="Brand values")
    strengths: Optional[List[str]] = Field(None, description="Brand strengths")
    weaknesses: Optional[List[str]] = Field(None, description="Brand weaknesses")
    other: Optional[Dict[str, Any]] = Field(None, description="Additional brand analysis data")

class ProductAnalysisData(BaseModel):
    features: Optional[List[Dict[str, Any]]] = Field(None, description="Product features")
    benefits: Optional[List[str]] = Field(None, description="Product benefits")
    usps: Optional[List[str]] = Field(None, description="Unique selling points")
    pricing: Optional[Dict[str, Any]] = Field(None, description="Pricing information")
    other: Optional[Dict[str, Any]] = Field(None, description="Additional product analysis data")

class MarketAnalysisData(BaseModel):
    trends: Optional[List[Dict[str, Any]]] = Field(None, description="Market trends")
    competitors: Optional[List[Dict[str, Any]]] = Field(None, description="Competitor information")
    market_size: Optional[Dict[str, Any]] = Field(None, description="Market size information")
    opportunities: Optional[List[str]] = Field(None, description="Market opportunities")
    threats: Optional[List[str]] = Field(None, description="Market threats")
    other: Optional[Dict[str, Any]] = Field(None, description="Additional market analysis data")

class AudienceAnalysisData(BaseModel):
    demographics: Optional[Dict[str, Any]] = Field(None, description="Demographic information")
    psychographics: Optional[Dict[str, Any]] = Field(None, description="Psychographic information")
    needs: Optional[List[str]] = Field(None, description="Audience needs")
    pain_points: Optional[List[str]] = Field(None, description="Audience pain points")
    other: Optional[Dict[str, Any]] = Field(None, description="Additional audience analysis data")

class CampaignAnalysisData(BaseModel):
    messaging: Optional[Dict[str, Any]] = Field(None, description="Campaign messaging")
    channels: Optional[List[Dict[str, Any]]] = Field(None, description="Marketing channels")
    performance: Optional[Dict[str, Any]] = Field(None, description="Performance metrics")
    budget: Optional[Dict[str, Any]] = Field(None, description="Budget information")
    other: Optional[Dict[str, Any]] = Field(None, description="Additional campaign analysis data")

# Analysis response models
class BrandAnalysisResponse(BaseResponse):
    brand: str = Field(description="Brand name")
    analysis: BrandAnalysisData = Field(description="Brand analysis data")

class ProductAnalysisResponse(BaseResponse):
    brand: str = Field(description="Brand name")
    product: str = Field(description="Product name")
    analysis: ProductAnalysisData = Field(description="Product analysis data")

class MarketAnalysisResponse(BaseResponse):
    brand: str = Field(description="Brand name")
    analysis: MarketAnalysisData = Field(description="Market analysis data")

class AudienceAnalysisResponse(BaseResponse):
    brand: str = Field(description="Brand name")
    analysis: AudienceAnalysisData = Field(description="Audience analysis data")

class CampaignAnalysisResponse(BaseResponse):
    brand: str = Field(description="Brand name")
    product: Optional[str] = Field(None, description="Product name (if product-specific)")
    analysis: CampaignAnalysisData = Field(description="Campaign analysis data")