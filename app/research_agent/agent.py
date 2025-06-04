from google.adk.agents import Agent
from google.adk.tools.tool_context import ToolContext
from datetime import datetime
from .schemas import (
    BaseResponse, BrandListResponse, ProductListResponse,
    BrandAnalysisData, ProductAnalysisData, MarketAnalysisData, 
    AudienceAnalysisData, CampaignAnalysisData,
    BrandAnalysisResponse, ProductAnalysisResponse
)

# Brand management tools
def create_brand_session(brand_name: str, tool_context: ToolContext) -> BaseResponse:
    """Create a new brand session.
    
    Args:
        brand_name: Name of the brand to create
        tool_context: Context for accessing and updating session state
        
    Returns:
        Confirmation message
    """
    brands = tool_context.state.get("brands", {})
    
    if brand_name in brands:
        return BaseResponse(
            status="exists",
            message=f"Brand '{brand_name}' already exists"
        )
    
    brands[brand_name] = {
        "created_at": datetime.now().isoformat(),
        "products": {}
    }
    
    tool_context.state["brands"] = brands
    tool_context.state["active_brand"] = brand_name
    
    return BaseResponse(
        status="success",
        message=f"Created brand session for '{brand_name}'"
    )

def select_brand(brand_name: str, tool_context: ToolContext) -> BaseResponse:
    """Select an existing brand as active.
    
    Args:
        brand_name: Name of the brand to select
        tool_context: Context for accessing and updating session state
        
    Returns:
        Confirmation message
    """
    brands = tool_context.state.get("brands", {})
    
    if brand_name not in brands:
        return BaseResponse(
            status="error",
            message=f"Brand '{brand_name}' not found"
        )
    
    tool_context.state["active_brand"] = brand_name
    tool_context.state["active_product"] = None
    
    return BaseResponse(
        status="success",
        message=f"Selected brand '{brand_name}'"
    )

def list_brands(tool_context: ToolContext)-> BrandListResponse:
    """List all brands in the database.
    
    Args:
        tool_context: Context for accessing session state
        
    Returns:
        List of brand names
    """
    brands = tool_context.state.get("brands", {})
    
    return BrandListResponse(
        status="success",
        message="Retrieved brand list",
        brands=list(brands.keys()),
        count=len(brands)
    )

# Product management tools
def create_product(product_name: str, tool_context: ToolContext) -> BrandListResponse:
    """Create a product within the active brand.
    
    Args:
        product_name: Name of the product to create
        tool_context: Context for accessing and updating session state
        
    Returns:
        Confirmation message
    """
    active_brand = tool_context.state.get("active_brand")
    if not active_brand:
        return BaseResponse(
            status="error",
            message="No active brand selected"
        )
    
    brands = tool_context.state.get("brands", {})
    if active_brand not in brands:
        return BaseResponse(
        status="exists",
        message=f"Product '{product_name}' already exists in brand '{active_brand}'"
    )
    
    if "products" not in brands[active_brand]:
        brands[active_brand]["products"] = {}
        
    if product_name in brands[active_brand]["products"]:
        return BaseResponse(
        status="exists",
        message=f"Product '{product_name}' already exists in brand '{active_brand}'"
        )
    
    brands[active_brand]["products"][product_name] = {
        "created_at": datetime.now().isoformat()
    }
    
    tool_context.state["brands"] = brands
    tool_context.state["active_product"] = product_name
    
    return BaseResponse(
    status="success",
    message=f"Created product '{product_name}' in brand '{active_brand}'"
    )

def select_product(product_name: str, tool_context: ToolContext) -> BrandListResponse:
    """Select a product within the active brand.
    
    Args:
        product_name: Name of the product to select
        tool_context: Context for accessing and updating session state
        
    Returns:
        Confirmation message
    """
    active_brand = tool_context.state.get("active_brand")
    if not active_brand:
        return BaseResponse(
            status="error",
            message="No active brand selected"
        )
    
    brands = tool_context.state.get("brands", {})
    if active_brand not in brands:
        return BaseResponse(
            status="error",
            message= f"Brand '{active_brand}' not found"
        )
    
    if product_name not in brands[active_brand].get("products", {}):
        return BaseResponse(
            status="success",
            message=f"Selected product '{product_name}' in brand '{active_brand}'"
        )
    
    tool_context.state["active_product"] = product_name
    
    return BaseResponse(
        status="success",
        message=f"Selected product '{product_name}' in brand '{active_brand}'"
    )

def list_products(tool_context: ToolContext) -> ProductListResponse:
    """List all products for the active brand.
    
    Args:
        tool_context: Context for accessing session state
        
    Returns:
        List of product names
    """
    active_brand = tool_context.state.get("active_brand")
    if not active_brand:
        return ProductListResponse(
            status="error",
            message="No active brand selected",
            brand="",
            products=[],
            count=0
        )
    
    brands = tool_context.state.get("brands", {})
    if active_brand not in brands:
        return ProductListResponse(
            status="error",
            message=f"Brand '{active_brand}' not found",
            brand="",
            products=[],
            count=0
        )

    products = brands[active_brand].get("products", {})
    
    return ProductListResponse(
    status="success",
    message=f"Retrieved products for brand '{active_brand}'",
    brand=active_brand,
    products=list(products.keys()),
    count=len(products)
    )

# Analysis tools
def save_brand_analysis(analysis_data: BrandAnalysisData, tool_context: ToolContext) -> BaseResponse:
    """Save brand analysis data.
    
    Args:
        analysis_data: Brand analysis data to save
        tool_context: Context for accessing and updating session state
        
    Returns:
        Confirmation message
    """
    active_brand = tool_context.state.get("active_brand")
    if not active_brand:
        return BaseResponse(
        status="error",
        message="No active brand or product selected"
        )
    
    brands = tool_context.state.get("brands", {})
    if active_brand not in brands:
        return BaseResponse(
            status="error",
            message=f"Brand '{active_brand}' not found"
        )
    analysis_dict = analysis_data.dict(exclude_none=True)

    current_analysis = brands[active_brand].get("brand_analysis", {})
    merged_analysis = {**current_analysis, **analysis_dict}
    brands[active_brand]["brand_analysis"] = merged_analysis
    
    tool_context.state["brands"] = brands
    
    return BaseResponse(
    status="success",
    message=f"Saved product analysis for '{active_product}' in brand '{active_brand}'"
    )

def save_product_analysis(analysis_data: dict, tool_context: ToolContext) -> dict:
    """Save product analysis data.
    
    Args:
        analysis_data: Product analysis data to save
        tool_context: Context for accessing and updating session state
        
    Returns:
        Confirmation message
    """
    active_brand = tool_context.state.get("active_brand")
    active_product = tool_context.state.get("active_product")
    
    if not active_brand or not active_product:
        return {
            "status": "error",
            "message": "No active brand or product selected"
        }
    
    brands = tool_context.state.get("brands", {})
    if active_brand not in brands or active_product not in brands[active_brand].get("products", {}):
        return {
            "status": "error",
            "message": f"Brand '{active_brand}' or product '{active_product}' not found"
        }
    
    current_analysis = brands[active_brand]["products"][active_product].get("product_analysis", {})
    merged_analysis = {**current_analysis, **analysis_data}
    brands[active_brand]["products"][active_product]["product_analysis"] = merged_analysis
    
    tool_context.state["brands"] = brands
    
    return {
        "status": "success",
        "message": f"Saved product analysis for '{active_product}' in brand '{active_brand}'"
    }

def save_market_analysis(analysis_data: dict, tool_context: ToolContext) -> dict:
    """Save market analysis data.
    
    Args:
        analysis_data: Market analysis data to save
        tool_context: Context for accessing and updating session state
        
    Returns:
        Confirmation message
    """
    active_brand = tool_context.state.get("active_brand")
    if not active_brand:
        return {
            "status": "error",
            "message": "No active brand selected"
        }
    
    brands = tool_context.state.get("brands", {})
    if active_brand not in brands:
        return {
            "status": "error",
            "message": f"Brand '{active_brand}' not found"
        }
    
    current_analysis = brands[active_brand].get("market_analysis", {})
    merged_analysis = {**current_analysis, **analysis_data}
    brands[active_brand]["market_analysis"] = merged_analysis
    
    tool_context.state["brands"] = brands
    
    return {
        "status": "success",
        "message": f"Saved market analysis for '{active_brand}'"
    }

def save_audience_analysis(analysis_data: dict, tool_context: ToolContext) -> dict:
    """Save audience analysis data.
    
    Args:
        analysis_data: Audience analysis data to save
        tool_context: Context for accessing and updating session state
        
    Returns:
        Confirmation message
    """
    active_brand = tool_context.state.get("active_brand")
    if not active_brand:
        return {
            "status": "error",
            "message": "No active brand selected"
        }
    
    brands = tool_context.state.get("brands", {})
    if active_brand not in brands:
        return {
            "status": "error",
            "message": f"Brand '{active_brand}' not found"
        }
    
    current_analysis = brands[active_brand].get("audience_analysis", {})
    merged_analysis = {**current_analysis, **analysis_data}
    brands[active_brand]["audience_analysis"] = merged_analysis
    
    tool_context.state["brands"] = brands
    
    return {
        "status": "success",
        "message": f"Saved audience analysis for '{active_brand}'"
    }

def save_campaign_analysis(analysis_data: dict, tool_context: ToolContext) -> dict:
    """Save campaign analysis data.
    
    Args:
        analysis_data: Campaign analysis data to save
        tool_context: Context for accessing and updating session state
        
    Returns:
        Confirmation message
    """
    active_brand = tool_context.state.get("active_brand")
    active_product = tool_context.state.get("active_product")
    
    brands = tool_context.state.get("brands", {})
    
    # Campaign analysis can be for brand or product
    if active_product and active_brand in brands and active_product in brands[active_brand].get("products", {}):
        # Product-level campaign
        current_analysis = brands[active_brand]["products"][active_product].get("campaign_analysis", {})
        merged_analysis = {**current_analysis, **analysis_data}
        brands[active_brand]["products"][active_product]["campaign_analysis"] = merged_analysis
        
        message = f"Saved campaign analysis for product '{active_product}' in brand '{active_brand}'"
    elif active_brand and active_brand in brands:
        # Brand-level campaign
        current_analysis = brands[active_brand].get("campaign_analysis", {})
        merged_analysis = {**current_analysis, **analysis_data}
        brands[active_brand]["campaign_analysis"] = merged_analysis
        
        message = f"Saved campaign analysis for brand '{active_brand}'"
    else:
        return {
            "status": "error",
            "message": "No valid brand or product selected"
        }
    
    tool_context.state["brands"] = brands
    
    return {
        "status": "success",
        "message": message
    }

# Retrieval tools
def get_brand_analysis(tool_context: ToolContext) -> dict:
    """Get brand analysis data for the active brand.
    
    Args:
        tool_context: Context for accessing session state
        
    Returns:
        Brand analysis data
    """
    active_brand = tool_context.state.get("active_brand")
    if not active_brand:
        return BrandAnalysisResponse(
            status="error",
            message="No active brand selected",
            brand="",
            analysis=BrandAnalysisData()
        )
    
    brands = tool_context.state.get("brands", {})
    if active_brand not in brands:
        return BrandAnalysisResponse(
            status="error",
            message=f"Brand '{active_brand}' not found",
            brand=active_brand,
            analysis=BrandAnalysisData()
        )
    
    analysis_data = brands[active_brand].get("brand_analysis", {})
    
    return BrandAnalysisResponse(
        status="success",
        message=f"Retrieved brand analysis for '{active_brand}'",
        brand=active_brand,
        analysis=BrandAnalysisData(**analysis_data)
    )

def get_product_analysis(tool_context: ToolContext) -> dict:
    """Get product analysis data for the active product.
    
    Args:
        tool_context: Context for accessing session state
        
    Returns:
        Product analysis data
    """
    active_brand = tool_context.state.get("active_brand")
    active_product = tool_context.state.get("active_product")
    
    if not active_brand or not active_product:
        return {
            "status": "error",
            "message": "No active brand or product selected"
        }
    
    brands = tool_context.state.get("brands", {})
    if active_brand not in brands or active_product not in brands[active_brand].get("products", {}):
        return {
            "status": "error",
            "message": f"Brand '{active_brand}' or product '{active_product}' not found"
        }
    
    analysis = brands[active_brand]["products"][active_product].get("product_analysis", {})
    
    return {
        "status": "success",
        "brand": active_brand,
        "product": active_product,
        "analysis": analysis
    }

# Create the unified research agent with all tools
research_agent = Agent(
    name="research_agent",
    model="gemini-2.0-pro",
    description="A comprehensive brand research assistant",
    instruction="""
    You are a brand research assistant that helps analyze brands, products, markets, 
    audiences, and campaigns. You maintain persistent memory across conversations.
    
    When working with a brand:
    1. First create or select a brand session
    2. Then create or select products within that brand
    3. Perform various types of analysis and store the results
    4. Use previously stored analysis to provide insightful recommendations
    
    Always be professional and data-driven in your analyses.
    
    For brand analysis: Focus on brand identity, positioning, and values
    For product analysis: Focus on features, benefits, and unique selling points
    For market analysis: Focus on trends, competitors, and market size
    For audience analysis: Focus on demographics, psychographics, and needs
    For campaign analysis: Focus on messaging, channels, and performance metrics
    
    Keep track of the active brand and product context throughout the conversation.

    When storing analysis data, follow the schema provided in the tool documentation.
    """,
    tools=[
        # Brand management
        create_brand_session,
        select_brand,
        list_brands,
        
        # Product management
        create_product,
        select_product,
        list_products,
        
        # Analysis storage
        save_brand_analysis,
        save_product_analysis,
        save_market_analysis,
        save_audience_analysis,
        save_campaign_analysis,
        
        # Analysis retrieval
        get_brand_analysis,
        get_product_analysis,
        # Add other retrieval functions as needed
    ],
)