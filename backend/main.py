
import os
from fastapi import FastAPI, HTTPException, Query, UploadFile, File
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime
from google.genai import types

from google.adk.sessions import InMemorySessionService
from google.adk.runners import Runner
from google.adk.agents.sequential_agent import SequentialAgent
from marketing_agency.sub_agents.social_media_image_create import social_media_pipeline_agent
from marketing_agency.sub_agents.content import content_creation_workflow
from marketing_agency.sub_agents.seo import product_seo_agent
from marketing_agency.sub_agents.research import market_analysis_agent
from google.adk.artifacts import InMemoryArtifactService


from firebase_utils import (
    get_brand_profile_by_id,
    get_product_by_id,
    get_products_by_brand,
    store_brand_profile,
    store_product,
    update_brand_logo_url,
    update_brand_marketing_platforms,
    upload_logo_to_firebase
)

APP_NAME = "marketing_agency_app"
USER_ID = "user_1"
SESSION_ID = "session_001"


session_service = InMemorySessionService()
artifact_service = InMemoryArtifactService()
session = session_service.create_session(
    app_name=APP_NAME,
    user_id=USER_ID,
    session_id=SESSION_ID
)


app = FastAPI(title="Marketing Agency API")



class BrandProfileRequest(BaseModel):
    brand_name: str
    description: str
    user_id: Optional[str] = USER_ID
    session_id: Optional[str] = SESSION_ID

class BrandProfileResponse(BaseModel):
    brand_id: str
    brand_name: str
    description: str
    logo_url: Optional[str] = None
    timestamp: str

class ProductRequest(BaseModel):
    product_name: str
    description: str
    category: Optional[str] = None
    user_id: Optional[str] = USER_ID
    session_id: Optional[str] = SESSION_ID

class ProductResponse(BaseModel):
    product_id: str
    brand_id: str
    product_name: str
    description: str
    category: Optional[str] = None
    timestamp: str


class BrandProfileResponse(BaseModel):
    brand_id: str
    brand_name: str
    description: str
    logo_url: Optional[str] = None
    marketing_platforms: Optional[List[str]] = None  # Add this line
    timestamp: str

class MarketingPlatformsRequest(BaseModel):
    platforms: List[str]
    user_id: Optional[str] = USER_ID
    session_id: Optional[str] = SESSION_ID

class MarketAnalysisRequest(BaseModel):
    brand_name: str
    brand_id: str

class MarketAnalysisResponse(BaseModel):
    brand_name: str
    brand_id: str
    results: List[str]

class ContentCreationRequest(BaseModel):
    product_id: str
    platform: str
class ContentCreationResponse(BaseModel):
    product_id: str
    platform: str
    marketing_content: List[str]

class SEOContentRequest(BaseModel):
    product_id: str
    brand_id: str

class SEOContentResponse(BaseModel):
    product_id: str
    brand_id: str
    seo_content: List[str]

class SocialMediaImageRequest(BaseModel):
    product_id: str
    platform: str = "Instagram"  # Default to Instagram, but can be changed

class SocialMediaImageResponse(BaseModel):
    product_id: str
    platform: str
    image_data: List[str]

class ProductPlatformContentResponse(BaseModel):
    product_id: str
    platform: str
    product_name: str
    brand_id: str
    marketing_content: Optional[Dict[str, Any]] = None
    social_media_image_url: Optional[str] = None
    timestamp: str

#---Brand Profile Endpoints---#
@app.post("/brand", response_model=BrandProfileResponse)
async def create_brand_profile(request: BrandProfileRequest):
    """Create a brand profile with name and description"""
    try:
        # Store in Firebase
        brand_id = store_brand_profile(
            brand_name=request.brand_name,
            description=request.description,
            logo_url=None,  # No logo initially
            user_id=request.user_id
        )
        
        return {
            "brand_id": brand_id,
            "brand_name": request.brand_name,
            "description": request.description,
            "logo_url": None,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        print(f"Error in create_brand_profile: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

@app.post("/brand/{brand_id}/logo", response_model=BrandProfileResponse)
async def upload_brand_logo(brand_id: str, logo: UploadFile = File(...)):
    """Upload a logo image for a brand profile"""
    try:
        # First check if brand exists
        brand_data = get_brand_profile_by_id(brand_id)
        if not brand_data:
            raise HTTPException(status_code=404, detail="Brand profile not found")
        
        # Read the file content
        file_content = await logo.read()
        
        # Upload to Firebase Storage
        logo_url = upload_logo_to_firebase(
            file_bytes=file_content,
            filename=logo.filename,
            brand_id=brand_id
        )
        
        
        # Update the brand profile with the logo URL
        update_brand_logo_url(brand_id, logo_url)  # Use the new function instead
        
        # Get the updated brand data
        brand_data = get_brand_profile_by_id(brand_id)
        
        return BrandProfileResponse(**brand_data)
    except Exception as e:
        print(f"Error uploading logo: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error uploading logo: {str(e)}")

@app.get("/brand/{brand_id}", response_model=BrandProfileResponse)
async def get_brand_profile(brand_id: str):
    """Get a brand profile by ID"""
    brand_data = get_brand_profile_by_id(brand_id)
    if not brand_data:
        raise HTTPException(status_code=404, detail="Brand profile not found")
    return BrandProfileResponse(**brand_data)


#---Product Endpoints---#
@app.post("/brand/{brand_id}/products", response_model=ProductResponse)
async def add_product(brand_id: str, request: ProductRequest):
    """Add a product to a brand"""
    try:
        # First check if brand exists
        brand_data = get_brand_profile_by_id(brand_id)
        if not brand_data:
            raise HTTPException(status_code=404, detail="Brand profile not found")
        
        # Store the product in Firebase
        product_id = store_product(
            brand_id=brand_id,
            product_name=request.product_name,
            description=request.description,
            category=request.category,
            user_id=request.user_id
        )
        
        # Get the created product
        product_data = get_product_by_id(product_id)
        
        return ProductResponse(**product_data)
    except Exception as e:
        print(f"Error adding product: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error adding product: {str(e)}")

@app.get("/brand/{brand_id}/products", response_model=List[ProductResponse])
async def get_brand_products(brand_id: str):
    """Get all products for a brand"""
    try:
        # First check if brand exists
        brand_data = get_brand_profile_by_id(brand_id)
        if not brand_data:
            raise HTTPException(status_code=404, detail="Brand profile not found")
        
        # Get all products for the brand
        products = get_products_by_brand(brand_id)
        
        if not products:
            return []
        
        return [ProductResponse(**product) for product in products]
    except Exception as e:
        print(f"Error retrieving products: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving products: {str(e)}")

@app.get("/products/{product_id}", response_model=ProductResponse)
async def get_product(product_id: str):
    """Get a specific product by ID"""
    product_data = get_product_by_id(product_id)
    if not product_data:
        raise HTTPException(status_code=404, detail="Product not found")
    return ProductResponse(**product_data)


#---Marketing Platforms Endpoints---#
@app.post("/brand/{brand_id}/marketing-platforms", response_model=BrandProfileResponse)
async def update_marketing_platforms(brand_id: str, request: MarketingPlatformsRequest):
    """Update the marketing platforms for a brand"""
    try:
        # First check if brand exists
        brand_data = get_brand_profile_by_id(brand_id)
        if not brand_data:
            raise HTTPException(status_code=404, detail="Brand profile not found")
        
        # Update the brand profile with marketing platforms
        # You'll need to create this function in your firebase_utils.py
        update_brand_marketing_platforms(brand_id, request.platforms)
        
        # Get the updated brand data
        brand_data = get_brand_profile_by_id(brand_id)
        
        return BrandProfileResponse(**brand_data)
    except Exception as e:
        print(f"Error updating marketing platforms: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error updating marketing platforms: {str(e)}")

@app.get("/brand/{brand_id}/marketing-platforms", response_model=List[str])
async def get_marketing_platforms(brand_id: str):
    """Get the marketing platforms for a brand"""
    try:
        # First check if brand exists
        brand_data = get_brand_profile_by_id(brand_id)
        if not brand_data:
            raise HTTPException(status_code=404, detail="Brand profile not found")
        
        # Return the marketing platforms
        platforms = brand_data.get("marketing_platforms", [])
        return platforms
    except Exception as e:
        print(f"Error retrieving marketing platforms: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving marketing platforms: {str(e)}")   



#---Market Analysis Endpoints---#
# from marketing_agency.sub_agents.research import brand_details_agent, research_agent, save_research_agent
# market_analysis_agent = SequentialAgent(
#     name="market_analysis",
#     sub_agents=[brand_details_agent, research_agent, save_research_agent]
# )

@app.post("/market-analysis", response_model=MarketAnalysisResponse)
async def create_market_analysis(request: MarketAnalysisRequest):
    """Create a market analysis for a brand using sequential research agents"""
    try:
        
        # Generate a unique session ID for this request
        session_id = f"market_analysis_{request.brand_id}"
        
        # Create the session first
        session = session_service.create_session(
            app_name=APP_NAME,
            user_id=USER_ID,
            session_id=session_id
        )

        runner = Runner(
            agent=market_analysis_agent,
            app_name=APP_NAME,
            session_service=session_service
        )
        
        # Prepare the market analysis query
        query = f"Create a Market Analysis for the brand_name {request.brand_name} with brand_id {request.brand_id}"
        
        # Format as ADK content
        content = types.Content(role='user', parts=[types.Part(text=query)])
         
        # Run the agent
        events = runner.run(user_id=USER_ID, session_id=session_id, new_message=content)
        
        # Extract responses
        responses = []
        for event in events:
            if event.is_final_response():
                responses.append(event.content.parts[0].text)
                print(f"Market Analysis Response: {event.content.parts[0].text}")
        
        return {
            "brand_name": request.brand_name,
            "brand_id": request.brand_id,
            "results": responses
        }
    
    except Exception as e:
        print(f"Error in create_market_analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing market analysis: {str(e)}")



@app.post("/seo-content", response_model=SEOContentResponse)
async def generate_seo_content(request: SEOContentRequest):
    """Generate SEO-optimized content for a specific product and brand"""
    try:
        # Generate a unique session ID for this request
        session_id = f"seo_content_{request.product_id}"

        # Create the session first
        session = session_service.create_session(
            app_name=APP_NAME,
            user_id=USER_ID,
            session_id=session_id
        )
        # Create a Runner with the SEO agent
        runner = Runner(
            agent=product_seo_agent,
            app_name=APP_NAME,
            session_service=session_service
        )
        
        # Prepare the SEO query in the format specified
        query = f"I need SEO content for product_id: {request.product_id} from brand_id: {request.brand_id}.And also save it"
        
        # Format as ADK content
        content = types.Content(role='user', parts=[types.Part(text=query)])
        
        
        # Run the agent
        events = runner.run(user_id=USER_ID, session_id=session_id, new_message=content)
        
        # Extract responses
        responses = []
        for event in events:
            if event.is_final_response():
                responses.append(event.content.parts[0].text)
                print(f"SEO Content Response: {event.content.parts[0].text}")
        
        return {
            "product_id": request.product_id,
            "brand_id": request.brand_id,
            "seo_content": responses
        }
    
    except Exception as e:
        print(f"Error in generate_seo_content: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating SEO content: {str(e)}")



@app.post("/marketing-content", response_model=ContentCreationResponse)
async def generate_marketing_content(request: ContentCreationRequest):
    """Generate platform-specific marketing content for a product"""
    try:
        # Generate a unique session ID for this request
        session_id = f"content_creation_{request.product_id}_{request.platform}"

        # Create the session first
        session = session_service.create_session(
            app_name=APP_NAME,
            user_id=USER_ID,
            session_id=session_id
        )

        # Create a Runner with the content creation workflow
        runner = Runner(
            agent=content_creation_workflow,
            app_name=APP_NAME,
            session_service=session_service
        )
        
        # Prepare the content creation query in the specified format
        query = f"Create marketing content for product_id: {request.product_id} for platform: {request.platform}"
        
        # Format as ADK content
        content = types.Content(role='user', parts=[types.Part(text=query)])
        
        # Run the agent
        events = runner.run(user_id=USER_ID, session_id=session_id, new_message=content)
        
        # Extract responses
        responses = []
        for event in events:
            if event.is_final_response():
                responses.append(event.content.parts[0].text)
                print(f"Marketing Content Response: {event.content.parts[0].text}")
        
        return {
            "product_id": request.product_id,
            "platform": request.platform,
            "marketing_content": responses
        }
    
    except Exception as e:
        print(f"Error in generate_marketing_content: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating marketing content: {str(e)}")


@app.post("/social-media-image", response_model=SocialMediaImageResponse)
async def generate_social_media_image(request: SocialMediaImageRequest):
    """Generate a social media image for a specific product and platform"""
    try:
        session_id = f"social_media_image_{request.product_id}_{request.platform.lower()}"

        # Create the session first
        session = session_service.create_session(
            app_name=APP_NAME,
            user_id=USER_ID,
            session_id=session_id
        )

        # Create a Runner with the social media pipeline agent
        runner = Runner(
            agent=social_media_pipeline_agent,
            app_name=APP_NAME,
            session_service=session_service,
            artifact_service=InMemoryArtifactService()
        )
        
        # Prepare the query in the specified format
        query = f"Generate an {request.platform} image for product_id {request.product_id}"
        
        # Format as ADK content
        content = types.Content(role='user', parts=[types.Part(text=query)])
        
        
        # Run the agent
        events = runner.run(user_id=USER_ID, session_id=session_id, new_message=content)
        
        # Extract responses
        responses = []
        for event in events:
            if event.is_final_response():
                responses.append(event.content.parts[0].text)
                print(f"Social Media Image Response: {event.content.parts[0].text}")
        
        return {
            "product_id": request.product_id,
            "platform": request.platform,
            "image_data": responses
        }
    
    except Exception as e:
        print(f"Error in generate_social_media_image: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating social media image: {str(e)}")
    

@app.get("/products/{product_id}/platform/{platform}", response_model=ProductPlatformContentResponse)
async def get_product_platform_content(product_id: str, platform: str):
    """Get all content for a specific product on a specific platform"""
    try:
        # Get basic product details
        product_data = get_product_by_id(product_id)
        if not product_data:
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Initialize response structure
        response = {
            "product_id": product_id,
            "platform": platform,
            "product_name": product_data.get("product_name", ""),
            "brand_id": product_data.get("brand_id", ""),
            "marketing_content": None,
            "social_media_image_url": None,
            "timestamp": datetime.now().isoformat()
        }
        
        
        # Try to fetch marketing content
        if "marketing_content" in product_data:
            platform_marketing = product_data.get("marketing_content", {}).get(platform.lower(), None)
            if platform_marketing:
                response["marketing_content"] = platform_marketing

            # Try to fetch social media image URL
        if "image_url" in platform_marketing:
            image_url = platform_marketing["image_url"]
            if image_url:
                response["social_media_image_url"] = image_url
        
        return ProductPlatformContentResponse(**response)
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error retrieving product platform content: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving content: {str(e)}")
    

@app.get("/")
def root():
    """Root endpoint with API information"""
    return {
        "name": "Marketing Agency API",
        "description": "API for interacting with marketing agency agents",
        "endpoints": [
            {
                "path": "/query",
                "method": "POST",
                "description": "Run any marketing agent with a custom query"
            },
            {
                "path": "/research",
                "method": "POST", 
                "description": "Run brand and product research"
            },
            {
                "path": "/research/{research_id}",
                "method": "GET",
                "description": "Get specific research by ID"
            },
            {
                "path": "/research/brand/{brand_name}",
                "method": "GET",
                "description": "Get all research for a specific brand"
            }
        ]
    }


if __name__ == "__main__":
    import uvicorn
    # uvicorn.run(app, host="0.0.0.0", port=8000)


    port = int(os.environ.get("PORT", 8080))
    
    # Run application
    uvicorn.run("main:app", host="127.0.0.1", port=port, reload=True, log_level="debug")