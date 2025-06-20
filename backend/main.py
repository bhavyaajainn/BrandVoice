
import os
from fastapi import Body, FastAPI, Form, HTTPException, Query, UploadFile, File
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any, Union
from datetime import datetime
from google.genai import types

from google.adk.sessions import InMemorySessionService
from google.adk.runners import Runner
from google.adk.agents.sequential_agent import SequentialAgent
from marketing_agency.sub_agents.social_media_image_create import social_media_pipeline_agent
from marketing_agency.sub_agents.content import content_creation_workflow
from marketing_agency.sub_agents.seo import product_seo_agent
from marketing_agency.sub_agents.research import market_analysis_agent
from marketing_agency.sub_agents.mood_board import color_palette_agent
from google.adk.artifacts import InMemoryArtifactService

from fastapi import BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
import uvicorn




from firebase_utils import (
    get_brand_profile_by_id,
    get_product_by_id,
    get_products_by_brand,
    store_brand_profile,
    store_product,
    update_brand_logo_url,
    update_brand_marketing_platforms,
    update_brand_profile,
    update_product_media,
    upload_logo_to_firebase,
    upload_media_to_firebase
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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"], 
)


class BrandProfileRequest(BaseModel):
    brand_name: str
    description: str
    user_id: Optional[str] = USER_ID
    session_id: Optional[str] = SESSION_ID


class ProductRequest(BaseModel):
    product_name: str
    description: str
    category: Optional[str] = None

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
    media_type: str = "image"    # New field: can be "image", "carousel", or "video"

class SocialMediaImageResponse(BaseModel):
    product_id: str
    platform: str
    media_type: str       
    image_data: List[str]

class ProductPlatformContentResponse(BaseModel):
    product_id: str
    platform: str
    product_name: str
    brand_id: str
    marketing_content: Optional[Dict[str, Any]] = None
    social_media_image_url: Optional[str] = None
    social_media_carousel_urls: Optional[List[str]] = None  # New field for carousel
    social_media_video_url: Optional[str] = None            # New field for video
    media_type: Optional[str] = None    
    timestamp: str


class ProductPlatformTextResponse(BaseModel):
    product_id: str
    platform: str
    product_name: str
    brand_id: str
    marketing_content: Optional[Dict[str, Any]] = None
    timestamp: str

class ProductPlatformMediaResponse(BaseModel):
    product_id: str
    platform: str
    product_name: str
    brand_id: str
    social_media_image_url: Optional[str] = None
    social_media_carousel_urls: Optional[List[str]] = None
    social_media_video_url: Optional[str] = None
    media_type: Optional[str] = None
    timestamp: str

class ColorPaletteRequest(BaseModel):
    product_id: str
    platform: str

class ColorPaletteResponse(BaseModel):
    product_id: str
    platform: str
    palette: Dict[str, Dict[str, str]]  # Contains color structure (primary, secondary, etc.)
    palette_image_url: Optional[str] = None
    timestamp: str

class BrandProfileMultipartRequest(BaseModel):
    brand_id: str  # Client-generated UUID
    brand_name: str
    description: str
    user_id: Optional[str] = USER_ID
    session_id: Optional[str] = SESSION_ID

class InstagramTextContent(BaseModel):
    caption: str
    hashtags: List[str] = Field(default_factory=list)
    call_to_action: Optional[str] = None
    
class FacebookTextContent(BaseModel):
    title: Optional[str] = None
    main_text: str
    hashtags: List[str] = Field(default_factory=list)
    call_to_action: Optional[str] = None

class CombinedContentResponse(BaseModel):
    product_id: str
    platform: str
    marketing_content: Optional[List[str]] = None
    media_type: Optional[str] = None
    media_data: Optional[List[str]] = None

async def run_background_market_analysis(brand_id: str, brand_name: str, user_id: str = USER_ID):
    """Run market analysis in the background"""
    try:
        # Generate a unique session ID for this request
        session_id = f"market_analysis_{brand_id}"
        
        # Create the session
        session = session_service.create_session(
            app_name=APP_NAME,
            user_id=user_id,
            session_id=session_id
        )

        # Create runner with market analysis agent
        runner = Runner(
            agent=market_analysis_agent,
            app_name=APP_NAME,
            session_service=session_service
        )
        
        # Prepare the market analysis query
        query = f"Create a Market Analysis for the brand_name {brand_name} with brand_id {brand_id}"
        
        # Format as ADK content
        content = types.Content(role='user', parts=[types.Part(text=query)])
         
        # Run the agent
        events = runner.run(user_id=user_id, session_id=session_id, new_message=content)
        
        # Extract responses
        responses = []
        for event in events:
            if event.is_final_response():
                responses.append(event.content.parts[0].text)
                print(f"Background Market Analysis Complete: {brand_name}")
        
    
    except Exception as e:
        print(f"Error in background market analysis: {str(e)}")

async def run_background_seo_content(product_id: str, brand_id: str, user_id: str = USER_ID):
    """Run SEO content generation in the background"""
    try:
        # Generate a unique session ID for this request
        session_id = f"seo_content_{product_id}"
        
        # Create the session
        session = session_service.create_session(
            app_name=APP_NAME,
            user_id=user_id,
            session_id=session_id
        )

        # Create runner with SEO agent
        runner = Runner(
            agent=product_seo_agent,
            app_name=APP_NAME,
            session_service=session_service
        )
        
        # Prepare the SEO query
        query = f"I need SEO content for product_id: {product_id} from brand_id: {brand_id}. And also save it"
        
        # Format as ADK content
        content = types.Content(role='user', parts=[types.Part(text=query)])
         
        # Run the agent
        events = runner.run(user_id=user_id, session_id=session_id, new_message=content)
        
        # Extract responses
        responses = []
        for event in events:
            if event.is_final_response():
                # Add error handling for None content
                if event.content and hasattr(event.content, 'parts') and event.content.parts:
                    responses.append(event.content.parts[0].text)
                    print(f"SEO Content Generation Complete for product: {product_id} extracted: {event.content.parts[0].text}")
                else:
                    print(f"Warning: Empty response received for product: {product_id}")
        updated_product = get_product_by_id(product_id)
        return updated_product
    except Exception as e:
        print(f"Error in background SEO content generation: {str(e)}")
        raise e



#---Brand Profile Endpoints---#

@app.post("/brand", response_model=BrandProfileResponse)
async def create_brand_profile_multipart(
    background_tasks: BackgroundTasks,
    brand_id: str = Form(...),
    brand_name: str = Form(...),
    description: Optional[str] = Form(None),
    platforms: Optional[str] = Form(None),  # Comma-separated platforms
    logo: Optional[UploadFile] = File(None),
):
    """Create a brand profile with optional logo in a single request"""
    try:
        # Check if brand with this ID already exists
        if get_brand_profile_by_id(brand_id):
            raise HTTPException(status_code=409, detail="Brand with this ID already exists")
        
        # Handle logo upload if provided
        logo_url = None
        if logo:
            file_content = await logo.read()
            logo_url = upload_logo_to_firebase(
                file_bytes=file_content,
                filename=logo.filename,
                brand_id=brand_id
            )
        
        # Parse platforms string into list if provided
        marketing_platforms = []
        if platforms:
            marketing_platforms = [p.strip() for p in platforms.split(",") if p.strip()]
        
        # Store in Firebase
        brand_id = store_brand_profile(
            brand_id=brand_id,
            brand_name=brand_name,
            description=description or brand_name,
            logo_url=logo_url,
            marketing_platforms=marketing_platforms  # Add platforms to storage
        )
        
        # Get the created brand profile
        brand_data = get_brand_profile_by_id(brand_id)

        background_tasks.add_task(
                run_background_market_analysis, 
                brand_id=brand_id,
                brand_name=brand_name
            )
            # Add a flag to indicate analysis is in progress
        brand_data["market_analysis_status"] = "running"

        return BrandProfileResponse(**brand_data)
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error creating brand profile: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error creating brand profile: {str(e)}")


@app.patch("/brand/{brand_id}", response_model=BrandProfileResponse)
async def update_brand_details(
    brand_id: str,
    brand_name: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    platforms: Optional[str] = Form(None),  # Comma-separated platforms
    logo: Optional[UploadFile] = File(None),
):
    """Update a brand profile with new information, including optional logo"""
    try:
        # Check if brand exists
        brand_data = get_brand_profile_by_id(brand_id)
        if not brand_data:
            raise HTTPException(status_code=404, detail="Brand profile not found")
        
        # Prepare updates
        updates = {}
        if brand_name is not None:
            updates["brand_name"] = brand_name
        if description is not None:
            updates["description"] = description

        # Parse platforms string into list if provided
        if platforms is not None:
            marketing_platforms = [p.strip() for p in platforms.split(",") if p.strip()]
            updates["marketing_platforms"] = marketing_platforms
            
        # Handle logo upload if provided
        if logo:
            file_content = await logo.read()
            logo_url = upload_logo_to_firebase(
                file_bytes=file_content,
                filename=logo.filename,
                brand_id=brand_id
            )
            updates["logo_url"] = logo_url
        
        # Update timestamp
        updates["timestamp"] = datetime.now().isoformat()
        
        # Update in Firebase
        if updates:
            success = update_brand_profile(brand_id, updates)
            if not success:
                raise HTTPException(status_code=500, detail="Failed to update brand profile")
        
        # Get the updated brand profile
        updated_brand = get_brand_profile_by_id(brand_id)
        
        return BrandProfileResponse(**updated_brand)
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating brand profile: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error updating brand profile: {str(e)}")


@app.get("/brand/{brand_id}", response_model=BrandProfileResponse)
async def get_brand_profile(brand_id: str):
    """Get a brand profile by ID"""
    brand_data = get_brand_profile_by_id(brand_id)
    if not brand_data:
        raise HTTPException(status_code=404, detail="Brand profile not found")
    return BrandProfileResponse(**brand_data)


#---Product Endpoints---#
@app.post("/brand/{brand_id}/product", response_model=ProductResponse)
async def add_product(brand_id: str, request: ProductRequest, background_tasks: BackgroundTasks):
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
            category=request.category
        )
        
        # Generate SEO content synchronously (wait for it to complete)
        try:
            print(f"Starting synchronous SEO content generation for product: {product_id}")
            product_data = await run_background_seo_content(
                product_id=product_id,
                brand_id=brand_id
            )
            product_data["seo_content_status"] = "completed"
        except Exception as e:
            print(f"Error in synchronous SEO content generation: {str(e)}")
            # If SEO generation fails, still return the basic product
            product_data = get_product_by_id(product_id)
            product_data["seo_content_status"] = "error"
        
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


@app.post("/products/{product_id}/platform/{platform}/content", response_model=ContentCreationResponse)
async def generate_marketing_content(product_id: str, platform: str):
    """Generate platform-specific marketing content for a product"""
    try:
        # Generate a unique session ID for this request
        session_id = f"content_creation_{product_id}_{platform}"

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
        query = f"Create marketing content for product_id: {product_id} for platform: {platform}"
        
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
            "product_id": product_id,
            "platform": platform,
            "marketing_content": responses
        }
    
    except Exception as e:
        print(f"Error in generate_marketing_content: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating marketing content: {str(e)}")


@app.post("/products/{product_id}/platform/{platform}/generate-media", response_model=SocialMediaImageResponse)
async def generate_social_media_image(
    product_id: str, 
    platform: str,
    media_type: str = Query("image", description="Type of media to generate: 'image', 'carousel', or 'video'")
):
    """Generate social media media for a specific product and platform"""
    try:
        session_id = f"social_media_image_{product_id}_{platform.lower()}"

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
        query = f"Generate {platform} {media_type} for product_id {product_id}"
        
        # Format as ADK content
        content = types.Content(role='user', parts=[types.Part(text=query)])
        
        # Run the agent
        events = runner.run(user_id=USER_ID, session_id=session_id, new_message=content)
        
        # Extract responses
        responses = []
        for event in events:
            if event.is_final_response():
                responses.append(event.content.parts[0].text)
                print(f"Social Media {media_type.capitalize()} Response: {event.content.parts[0].text}")
        
        return {
            "product_id": product_id,
            "platform": platform,
            "media_type": media_type,
            "image_data": responses
        }
    
    except Exception as e:
        print(f"Error in generate_social_media_content: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating social media {media_type}: {str(e)}")

@app.post("/products/{product_id}/platform/{platform}/generate-content", response_model=CombinedContentResponse)
async def generate_product_content(
    product_id: str, 
    platform: str,
    media_type: str = Query("image", description="Type of media to generate: 'image', 'carousel', or 'video'"),
    content_only: bool = Query(False, description="Generate only text content without media"),
    media_only: bool = Query(False, description="Generate only media without text content")
):
    """Generate both marketing content and social media for a product and platform"""
    try:
        # Initialize response variables
        marketing_content_responses = []
        media_responses = []
        
        # Generate text content if not media_only
        if not media_only:
            # Generate a unique session ID for content creation
            content_session_id = f"content_creation_{product_id}_{platform}"
            
            # Create session for content creation
            session_service.create_session(
                app_name=APP_NAME,
                user_id=USER_ID,
                session_id=content_session_id
            )
            
            # Create Runner for content creation
            content_runner = Runner(
                agent=content_creation_workflow,
                app_name=APP_NAME,
                session_service=session_service
            )
            
            # Prepare the content creation query
            content_query = f"Create marketing content for product_id: {product_id} for platform: {platform}"
            
            # Format as ADK content
            content = types.Content(role='user', parts=[types.Part(text=content_query)])
            
            # Run the content creation agent
            content_events = content_runner.run(user_id=USER_ID, session_id=content_session_id, new_message=content)
            
            # Extract content responses
            for event in content_events:
                if event.is_final_response():
                    marketing_content_responses.append(event.content.parts[0].text)
                    print(f"Marketing Content Response: {event.content.parts[0].text}")
        
        # Generate media if not content_only
        if not content_only:
            # Generate a unique session ID for media creation
            media_session_id = f"social_media_image_{product_id}_{platform.lower()}"
            
            # Create session for media creation
            session_service.create_session(
                app_name=APP_NAME,
                user_id=USER_ID,
                session_id=media_session_id
            )
            
            # Create Runner for media creation
            media_runner = Runner(
                agent=social_media_pipeline_agent,
                app_name=APP_NAME,
                session_service=session_service,
                artifact_service=InMemoryArtifactService()
            )
            
            # Prepare the media creation query
            media_query = f"Generate {platform} {media_type} for product_id {product_id}"
            
            # Format as ADK content
            media_content = types.Content(role='user', parts=[types.Part(text=media_query)])
            
            # Run the media creation agent
            media_events = media_runner.run(user_id=USER_ID, session_id=media_session_id, new_message=media_content)
            
            # Extract media responses
            for event in media_events:
                if event.is_final_response():
                    media_responses.append(event.content.parts[0].text)
                    print(f"Social Media {media_type.capitalize()} Response: {event.content.parts[0].text}")
        
        # Return combined response
        return {
            "product_id": product_id,
            "platform": platform,
            "marketing_content": marketing_content_responses if not media_only else None,
            "media_type": media_type if not content_only else None,
            "media_data": media_responses if not content_only else None
        }
    
    except Exception as e:
        print(f"Error in generate_product_content: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating product content: {str(e)}")

@app.get("/products/{product_id}/platform/{platform}/text", response_model=ProductPlatformTextResponse)
async def get_product_platform_text_content(product_id: str, platform: str):
    """Get text content for a specific product on a platform"""
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
            "timestamp": datetime.now().isoformat()
        }
        
        # Get marketing content (text portions only)
        if "marketing_content" in product_data:
            platform_marketing = product_data.get("marketing_content", {}).get(platform.lower(), {})
            if platform_marketing:
                # Filter out media URLs, keep only text content
                text_content = {k: v for k, v in platform_marketing.items() 
                               if k not in ["image_url", "carousel_urls", "video_url"]}
                response["marketing_content"] = text_content
        
        
        return ProductPlatformTextResponse(**response)
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error retrieving product text content: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving text content: {str(e)}")

@app.get("/products/{product_id}/platform/{platform}/media", response_model=ProductPlatformMediaResponse)
async def get_product_platform_media_content(product_id: str, platform: str):
    """Get media assets for a specific product on a platform"""
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
            "social_media_image_url": None,
            "social_media_carousel_urls": None,
            "social_media_video_url": None,
            "media_type": None,
            "timestamp": datetime.now().isoformat()
        }
        
        # Extract media URLs if available
        if "marketing_content" in product_data:
            platform_marketing = product_data.get("marketing_content", {}).get(platform.lower(), {})
            if platform_marketing:
                # Determine media type and fetch appropriate URLs
                if "image_url" in platform_marketing:
                    response["social_media_image_url"] = platform_marketing["image_url"]
                    response["media_type"] = "image"
                
                if "carousel_urls" in platform_marketing:
                    response["social_media_carousel_urls"] = platform_marketing["carousel_urls"]
                    response["media_type"] = "carousel"
                
                if "video_url" in platform_marketing:
                    response["social_media_video_url"] = platform_marketing["video_url"]
                    response["media_type"] = "video"
        
        return ProductPlatformMediaResponse(**response)
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error retrieving product media content: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving media content: {str(e)}")

@app.post("/products/{product_id}/platform/{platform}/media", response_model=ProductPlatformMediaResponse)
async def upload_product_media(
    product_id: str, 
    platform: str,
    media_type: str = Form(..., description="Type: 'image', 'carousel', or 'video'"),
    file: Optional[UploadFile] = File(None),
    carousel_files: List[UploadFile] = File([]),
    video_file: Optional[UploadFile] = File(None)
):
    """Upload media files for a specific product on a platform"""
    try:
        # Validate media type
        if media_type not in ["image", "carousel", "video"]:
            raise HTTPException(
                status_code=400, 
                detail=f"Invalid media_type. Must be 'image', 'carousel', or 'video'"
            )
            
        # Check if product exists
        product_data = get_product_by_id(product_id)
        if not product_data:
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Get brand ID for storage path
        brand_id = product_data.get("brand_id", "")
        
        # Initialize URLs
        image_url = None
        carousel_urls = []
        video_url = None
        
        # Process files based on media type
        if media_type == "image" and file:
            file_content = await file.read()
            image_url = upload_media_to_firebase(
                file_bytes=file_content,
                filename=file.filename,
                brand_id=brand_id,
                product_id=product_id,
                platform=platform,
                media_type="image"
            )
            
        elif media_type == "carousel" and carousel_files:
            for carousel_file in carousel_files:
                file_content = await carousel_file.read()
                url = upload_media_to_firebase(
                    file_bytes=file_content,
                    filename=carousel_file.filename,
                    brand_id=brand_id,
                    product_id=product_id,
                    platform=platform,
                    media_type="carousel",
                    index=len(carousel_urls)
                )
                carousel_urls.append(url)
                
        elif media_type == "video" and video_file:
            file_content = await video_file.read()
            video_url = upload_media_to_firebase(
                file_bytes=file_content,
                filename=video_file.filename,
                brand_id=brand_id,
                product_id=product_id,
                platform=platform,
                media_type="video"
            )
        
        # Update the product data with the new URLs
        if "marketing_content" not in product_data:
            product_data["marketing_content"] = {}
            
        if platform.lower() not in product_data["marketing_content"]:
            product_data["marketing_content"][platform.lower()] = {}
        
        platform_content = product_data["marketing_content"][platform.lower()]
        
        # Update the appropriate URL based on media type
        if media_type == "image" and image_url:
            platform_content["image_url"] = image_url
            
            
        elif media_type == "carousel" and carousel_urls:
            platform_content["carousel_urls"] = carousel_urls
            
            
        elif media_type == "video" and video_url:
            platform_content["video_url"] = video_url
            
        
        # Update the product in Firebase
        update_product_media(
            product_id=product_id,
            platform=platform.lower(),
            content=platform_content
        )
        
        # Get the updated product
        updated_product = get_product_by_id(product_id)
        platform_marketing = updated_product.get("marketing_content", {}).get(platform.lower(), {})
        
        # Prepare response
        response = {
            "product_id": product_id,
            "platform": platform,
            "product_name": updated_product.get("product_name", ""),
            "brand_id": brand_id,
            "social_media_image_url": platform_marketing.get("image_url"),
            "social_media_carousel_urls": platform_marketing.get("carousel_urls"),
            "social_media_video_url": platform_marketing.get("video_url"),
            "media_type": platform_marketing.get("media_type"),
            "timestamp": datetime.now().isoformat()
        }
        
        return ProductPlatformMediaResponse(**response)
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error uploading media: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error uploading media: {str(e)}")

@app.post("/products/{product_id}/platform/{platform}/text", response_model=ProductPlatformTextResponse)
async def update_product_platform_text(
    product_id: str, 
    platform: str,
    content: Union[
        InstagramTextContent, 
        FacebookTextContent, 
    ] = Body(...)
):
    """Update text content for a specific product on a platform"""
    try:
        # Check if product exists
        product_data = get_product_by_id(product_id)
        if not product_data:
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Get brand ID for reference
        brand_id = product_data.get("brand_id", "")
        
        # Initialize marketing content if not exists
        if "marketing_content" not in product_data:
            product_data["marketing_content"] = {}
            
        if platform.lower() not in product_data["marketing_content"]:
            product_data["marketing_content"][platform.lower()] = {}
        
        platform_content = product_data["marketing_content"][platform.lower()]
        
        # Preserve media URLs and type
        preserved_fields = {}
        for field in ["image_url", "carousel_urls", "video_url"]:
            if field in platform_content:
                preserved_fields[field] = platform_content[field]
        
        # Initialize content key if not exists
        if "content" not in platform_content:
            platform_content["content"] = {}
            
        # Convert Pydantic model to dict and update
        content_dict = content.dict(exclude_unset=True)
        platform_content["content"].update(content_dict)
        
        # Restore preserved fields
        for field, value in preserved_fields.items():
            platform_content[field] = value
        
        # Update the product in Firebase
        update_product_media(
            product_id=product_id,
            platform=platform.lower(),
            content=platform_content
        )
        
        # Get the updated product
        updated_product = get_product_by_id(product_id)
        platform_marketing = updated_product.get("marketing_content", {}).get(platform.lower(), {})
        
        # Filter out media URLs for response
        text_content = {k: v for k, v in platform_marketing.items() 
                      if k not in ["image_url", "carousel_urls", "video_url"]}
        
        # Prepare response
        response = {
            "product_id": product_id,
            "platform": platform,
            "product_name": updated_product.get("product_name", ""),
            "brand_id": brand_id,
            "marketing_content": text_content,
            "timestamp": datetime.now().isoformat()
        }
        
        return ProductPlatformTextResponse(**response)
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating text content: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error updating text content: {str(e)}")


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
            "social_media_carousel_urls": None,
            "social_media_video_url": None,
            "media_type": None,
            "timestamp": datetime.now().isoformat()
        }
        
        
        # Try to fetch marketing content
        if "marketing_content" in product_data:
            platform_marketing = product_data.get("marketing_content", {}).get(platform.lower(), None)
            if platform_marketing:
                response["marketing_content"] = platform_marketing
                
                # Determine media type and fetch appropriate URLs
                if "image_url" in platform_marketing:
                    response["social_media_image_url"] = platform_marketing["image_url"]
                    response["media_type"] = "image"
                
                if "carousel_urls" in platform_marketing:
                    response["social_media_carousel_urls"] = platform_marketing["carousel_urls"]
                    response["media_type"] = "carousel"
                
                if "video_url" in platform_marketing:
                    response["social_media_video_url"] = platform_marketing["video_url"]
                    response["media_type"] = "video"
    
        
        return ProductPlatformContentResponse(**response)
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error retrieving product platform content: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving content: {str(e)}")


@app.post("/products/{product_id}/platform/{platform}/color-palette", response_model=ColorPaletteResponse)
async def generate_color_palette(product_id: str, platform: str):
    """Generate a color palette for a specific product on a platform"""
    try:
        # Generate a unique session ID for this request
        session_id = f"color_palette_{product_id}_{platform.lower()}"

        # Create the session first
        session = session_service.create_session(
            app_name=APP_NAME,
            user_id=USER_ID,
            session_id=session_id
        )

        # Create a Runner with the color palette agent
        runner = Runner(
            agent=color_palette_agent,
            app_name=APP_NAME,
            session_service=session_service,
            artifact_service=artifact_service
        )
        
        # Prepare the query for color palette generation
        query = f"Generate a color palette for product_id {product_id} on platform {platform}"
        
        # Format as ADK content
        content = types.Content(role='user', parts=[types.Part(text=query)])
        
        # Run the agent
        events = runner.run(user_id=USER_ID, session_id=session_id, new_message=content)
        
        # Extract response
        palette_data = {}
        palette_image_url = None
        
        for event in events:
            if event.is_final_response():
                response_text = event.content.parts[0].text
                print(f"Color Palette Response: {response_text}")
                
                # Check if we need to parse the response for more details
                if "palette_image_url" in response_text:
                    # Try to extract the URL if it's in the response
                    import re
                    url_match = re.search(r'https?://[^\s]+', response_text)
                    if url_match:
                        palette_image_url = url_match.group(0)
        
        # Get updated product data to retrieve the saved palette
        product_data = get_product_by_id(product_id)
        if product_data and "marketing_content" in product_data:
            platform_content = product_data["marketing_content"].get(platform.lower(), {})
            if "color_palette" in platform_content:
                palette_data = platform_content["color_palette"]
                palette_image_url = palette_data.get("palette_image_url", palette_image_url)
        
        return {
            "product_id": product_id,
            "platform": platform,
            "palette": palette_data.get("analysis", {}),
            "palette_image_url": palette_image_url,
            "timestamp": datetime.now().isoformat()
        }
    
    except Exception as e:
        print(f"Error generating color palette: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating color palette: {str(e)}")


@app.get("/products/{product_id}/platform/{platform}/color-palette", response_model=ColorPaletteResponse)
async def get_product_color_palette(product_id: str, platform: str):
    """Get the color palette for a specific product on a platform"""
    try:
        # Get basic product details
        product_data = get_product_by_id(product_id)
        if not product_data:
            raise HTTPException(status_code=404, detail="Product not found")
        
        # Initialize default response
        response = {
            "product_id": product_id,
            "platform": platform,
            "palette": {},
            "palette_image_url": None,
            "timestamp": datetime.now().isoformat()
        }
        
        # Extract color palette if available
        if "marketing_content" in product_data:
            platform_content = product_data.get("marketing_content", {}).get(platform.lower(), {})
            if "color_palette" in platform_content:
                palette_data = platform_content["color_palette"]
                response["palette"] = palette_data.get("analysis", {})
                response["palette_image_url"] = palette_data.get("palette_image_url")
                
                # If there's a stored timestamp, use it
                if "timestamp" in palette_data:
                    response["timestamp"] = palette_data["timestamp"]
        
        # If no palette exists, return a 404
        if not response["palette"]:
            raise HTTPException(
                status_code=404, 
                detail=f"No color palette found for product {product_id} on platform {platform}"
            )
            
        return ColorPaletteResponse(**response)
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error retrieving color palette: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving color palette: {str(e)}")


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
    port = int(os.environ.get("PORT", 8080))
    # Run application
    uvicorn.run("main:app", host="127.0.0.1", port=port, reload=True, log_level="debug")