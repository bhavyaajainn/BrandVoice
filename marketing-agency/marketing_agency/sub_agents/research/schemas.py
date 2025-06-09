from pydantic import BaseModel

# Define the schema for the output
class CompetitorAnalysis(BaseModel):
    name: str
    marketing_strategy: str

# Define a fixed structure for competitors
class CompetitorsList(BaseModel):
    competitor_1: CompetitorAnalysis
    competitor_2: CompetitorAnalysis

class BrandAnalysis(BaseModel):
    brand_name: str
    marketing_strategy: str
    product_analysis: str
    region_analysis: str

class MarketingRecommendations(BaseModel):
    overall_strategy: str
    regional_adaptations: str

class MarketingAnalysisSchema(BaseModel):
    brand_analysis: BrandAnalysis
    competitor_analysis: CompetitorsList
    marketing_recommendations: MarketingRecommendations