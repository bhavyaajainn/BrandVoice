
from fastapi import FastAPI, HTTPException, Query, UploadFile, File
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

from google.adk.sessions import InMemorySessionService
from google.adk.runners import Runner
from marketing_agency.agent import root_agent, code_pipeline_agent
from marketing_agency.sub_agents.research import research_agent, formatter_agent
from marketing_agency.sub_agents.seo import seo_agent
from marketing_agency.sub_agents.content import content_refinement_loop
from google.genai import types



# Import Firebase utilities
from firebase_utils import (
    get_brand_profile_by_id,
    get_product_by_id,
    get_product_research,
    get_products_by_brand,
    store_brand_profile,
    store_formatted_content,
    store_product,
    store_research_data,
    get_research_by_id,
    get_research_by_brand,
    update_brand_logo_url,
    update_brand_marketing_platforms,
    upload_logo_to_firebase
)

# Define the app_name for the application
APP_NAME = "marketing_agency_app"
USER_ID = "user_1"
SESSION_ID = "session_001"

# Create a session service
session_service = InMemorySessionService()
session = session_service.create_session(
    app_name=APP_NAME,
    user_id=USER_ID,
    session_id=SESSION_ID
)

# Create FastAPI app
app = FastAPI(title="Marketing Agency API")

# Define request models
class QueryRequest(BaseModel):
    query: str
    agent_type: Optional[str] = "code_pipeline"
    user_id: Optional[str] = USER_ID
    session_id: Optional[str] = SESSION_ID

class ResearchRequest(BaseModel):
    brand_name: str
    product_name: Optional[str] = None
    is_new_brand: Optional[bool] = False
    user_id: Optional[str] = USER_ID
    session_id: Optional[str] = SESSION_ID

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

# Define response models
class QueryResponse(BaseModel):
    responses: List[str]

class ResearchResponse(BaseModel):
    research_id: str
    brand_name: str
    product_name: Optional[str]
    is_new_brand: bool
    research_data: List[str]
    timestamp: str

# Add marketing_platforms to the BrandProfileResponse model

class BrandProfileResponse(BaseModel):
    brand_id: str
    brand_name: str
    description: str
    logo_url: Optional[str] = None
    marketing_platforms: Optional[List[str]] = None  # Add this line
    timestamp: str

# Add this with your other request models

class MarketingPlatformsRequest(BaseModel):
    platforms: List[str]
    user_id: Optional[str] = USER_ID
    session_id: Optional[str] = SESSION_ID

# Map agent types to agent objects
agent_mapping = {
    "root": root_agent,
    "code_pipeline": code_pipeline_agent,
    "research": research_agent,
    "formatter": formatter_agent,
    "seo": seo_agent,
    "content_refinement": content_refinement_loop
}

async def run_agent_query(query: str, agent_type: str, user_id: str, session_id: str):
    """Sends a query to the agent and returns the final response."""
    
    try:
        # Get the appropriate agent
        agent = agent_mapping.get(agent_type, code_pipeline_agent)
        session = session_service.create_session(
            app_name=APP_NAME,
            user_id=user_id,
            session_id=session_id
        )
        # Create a Runner
        runner = Runner(
            agent=agent,
            app_name=APP_NAME,
            session_service=session_service
        )

        # Prepare the user's message in ADK format
        content = types.Content(role='user', parts=[types.Part(text=query)])
        
        # Run the agent
        events = runner.run(user_id=user_id, session_id=session_id, new_message=content)
        
        # Extract all responses
        all_responses = []
        for event in events:
            if event.is_final_response():
                all_responses.append(event.content.parts[0].text)
                print(f"Agent Response: {event.content.parts[0].text}")
        
        # Ensure we return a list, even if empty
        return all_responses or ["No response from agent"]
    
    except Exception as e:
        print(f"Error in run_agent_query: {str(e)}")
        return [f"Error processing request: {str(e)}"]

async def run_research_agent(brand_name: str, product_name: Optional[str], is_new_brand: bool, user_id: str, session_id: str,session=None):
    """Runs the research agent specifically for brand and product research."""
    
    try:
        # Create or get existing session
        if session is None:
            session = session_service.create_session(
                app_name=APP_NAME,
                user_id=user_id,
                session_id=session_id
            )
        
        # Get brand and product descriptions from session if available
        brand_description = session.state.get("brand_description", "")
        product_description = session.state.get("product_description", "")
        
        # Add context information to the query
        brand_context = f" described as '{brand_description}'" if brand_description else ""
        product_context = f" described as '{product_description}'" if product_description and product_name else ""
        
        # Construct the query based on whether it's a new or existing brand
        if is_new_brand:
            if product_name:
                query = f"Research marketing strategies for a new brand called '{brand_name}'{brand_context} that will launch a product called '{product_name}'{product_context}. Include competitor analysis, market positioning, and marketing channel recommendations."
            else:
                query = f"Research marketing strategies for launching a new brand called '{brand_name}'{brand_context}. Include competitor analysis, market positioning, and marketing channel recommendations."
        else:
            if product_name:
                query = f"Analyze the marketing strategy of the existing brand '{brand_name}'{brand_context} for their product '{product_name}'{product_context}. Include their current positioning, marketing channels, and effectiveness."
            else:
                query = f"Analyze the marketing strategy of the existing brand '{brand_name}'{brand_context}. Include their current positioning, marketing channels, target audience, and effectiveness."
        
        # Create a Runner for research agent
        runner = Runner(
            agent=research_agent,
            app_name=APP_NAME,
            session_service=session_service
        )

        # Prepare the user's message in ADK format
        content = types.Content(role='user', parts=[types.Part(text=query)])
        
        # Run the research agent
        research_events = runner.run(user_id=user_id, session_id=session_id, new_message=content)
        # print(f"Total research events: {len(research_events)}")

        
        # Extract research responses
        research_responses = []
        for event in research_events:
            if event.is_final_response():
                research_responses.append(event.content.parts[0].text)
                session.state["raw_research_data"] = event.content.parts[0].text
                print(f"Research Response: {event.content.parts[0].text}")

        # After running the research agent
        print(f"Session state after:", session.state)
        print(f"Research responses count: {len(research_responses)}")

        # If the raw_research_data isn't in the session state but we have responses,
        # manually set it from our collected responses
        if "raw_research_data" not in session.state and research_responses:
            session.state["raw_research_data"] = research_responses[0]
            print("Manually set raw_research_data in session state")
        
        # Now run the formatter agent to structure the data
        formatter_runner = Runner(
            agent=formatter_agent,
            app_name=APP_NAME,
            session_service=session_service
        )
        
        # No need for a new query, the formatter will use the session state
        content = types.Content(role='user', parts=[types.Part(text="Format the research data")])
        formatter_events = formatter_runner.run(user_id=user_id, session_id=session_id, new_message=content)
        
        # Extract formatted responses
        formatted_responses = []
        for event in formatter_events:
            if event.is_final_response():
                formatted_responses.append(event.content.parts[0].text)

        all_responses = formatted_responses

        # Store in Firebase
        research_id = store_research_data(
            brand_name=brand_name,
            product_name=product_name,
            is_new_brand=is_new_brand,
            research_data=all_responses,
            user_id=user_id,
            agent_type="research"
        )
        
        return {
            "research_id": research_id,
            "brand_name": brand_name,
            "product_name": product_name,
            "is_new_brand": is_new_brand,
            "research_data": all_responses,
            "timestamp": datetime.now().isoformat()
        }
    
    except Exception as e:
        print(f"Error in run_research_agent: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing research request: {str(e)}")

@app.post("/research/brand/{brand_id}", response_model=ResearchResponse)
async def research_from_brand_profile(
    brand_id: str, 
    product_id: Optional[str] = None,
    is_new_brand: Optional[bool] = False,
    user_id: Optional[str] = USER_ID,
    session_id: Optional[str] = SESSION_ID
):
    """Run research analysis using stored brand and product data"""
    try:
        # Create a unique session ID if not provided
        if not session_id:
            session_id = f"session_{datetime.now().strftime('%Y%m%d%H%M%S')}"
            
        # Retrieve brand data from database
        brand_data = get_brand_profile_by_id(brand_id)
        if not brand_data:
            raise HTTPException(status_code=404, detail="Brand profile not found")
        
        # Get brand details
        brand_name = brand_data["brand_name"]
        brand_description = brand_data["description"]
        
        # Get product details if product_id is provided
        product_data = None
        product_name = None
        product_description = None
        
        if product_id:
            product_data = get_product_by_id(product_id)
            if not product_data:
                raise HTTPException(status_code=404, detail="Product not found")
            
            product_name = product_data["product_name"]
            product_description = product_data["description"]
        
        # Create a new session with brand and product details
        session = session_service.create_session(
            app_name=APP_NAME,
            user_id=user_id,
            session_id=session_id
        )
        
        # Store details in session state for agents to access
        session.state["brand_description"] = brand_description
        if product_description:
            session.state["product_description"] = product_description
        
        print("Session state after storing brand and product info:,", session.state)
        # Run the research agent with brand and product info
        research_data = await run_research_agent(
            brand_name=brand_name,
            product_name=product_name,
            is_new_brand=is_new_brand,
            user_id=user_id,
            session_id=session_id,
            session=session 
        )
        
        return ResearchResponse(**research_data)
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in research_from_brand_profile: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

@app.post("/query", response_model=QueryResponse)
async def query_agent(request: QueryRequest):
    """Process a query using the selected marketing agent"""
    try:
        response = await run_agent_query(
            query=request.query,
            agent_type=request.agent_type,
            user_id=request.user_id,
            session_id=request.session_id
        )
        if response is None:
            response = ["No response received"]
        return QueryResponse(responses=response)
    except Exception as e:
        print(f"Error in query_agent: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

@app.post("/research", response_model=ResearchResponse)
async def research_brand(request: ResearchRequest):
    """Run brand research using the research and formatter agents"""
    try:
        research_data = await run_research_agent(
            brand_name=request.brand_name,
            product_name=request.product_name,
            is_new_brand=request.is_new_brand,
            user_id=request.user_id,
            session_id=request.session_id
        )
        return ResearchResponse(**research_data)
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in research_brand: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

@app.get("/research/{research_id}", response_model=ResearchResponse)
async def get_research(research_id: str):
    """Retrieve a specific research by ID"""
    research_data = get_research_by_id(research_id)
    if not research_data:
        raise HTTPException(status_code=404, detail="Research not found")
    return ResearchResponse(**research_data)

@app.get("/research/brand/{brand_name}", response_model=List[ResearchResponse])
async def get_brand_research(
    brand_name: str,
    product_name: Optional[str] = Query(None, description="Filter by product name")
):
    """Retrieve all research for a specific brand"""
    research_list = get_research_by_brand(brand_name)
    
    # Filter by product name if provided
    if product_name:
        research_list = [r for r in research_list if r.get("product_name") == product_name]
    
    if not research_list:
        raise HTTPException(status_code=404, detail=f"No research found for brand: {brand_name}")
    
    return [ResearchResponse(**research) for research in research_list]

@app.get("/research/brand/{brand_name}/product/{product_name}", response_model=Dict[str, Any])
async def get_product_research_endpoint(brand_name: str, product_name: str):
    """Retrieve research for a specific product of a brand"""
    research_data = get_product_research(brand_name, product_name)
    if not research_data:
        raise HTTPException(status_code=404, detail=f"No research found for product: {product_name} of brand: {brand_name}")
    return research_data


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

# Add this with your other API endpoints

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

# Run the FastAPI app with uvicorn when executed directly
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)