
from google.adk.agents.llm_agent import LlmAgent
from google.adk.agents import SequentialAgent


from .schemas import ProductSEOContentSchema
from .prompt import  PRODUCT_SEO_PROMPT, SEO_PROMPT


GEMINI_MODEL = "gemini-2.0-flash"

seo_agent = LlmAgent(
    name="SEOAgent",
    model=GEMINI_MODEL,
    instruction=SEO_PROMPT,
    description="Generates SEO-optimized content based on marketing analysis and requested content types.",
    output_key="seo_content",
)


import logging
from typing import Dict, Any, List, Optional
from firebase_utils import get_brand_profile_by_id, update_brand_profile

logger = logging.getLogger(__name__)

def get_product_details(product_id: str) -> Optional[Dict[str, Any]]:
    """Retrieve product details from Firebase.
    
    Args:
        product_id: The unique identifier of the product
        
    Returns:
        Dictionary containing product details if found, None otherwise
    """
    try:
        from firebase_utils import db
        
        # Get a reference to the product document
        product_ref = db.collection('products').document(product_id)
        product_doc = product_ref.get()
        
        if not product_doc.exists:
            logger.error(f"No product found with ID: {product_id}")
            return None
            
        return product_doc.to_dict()
    except Exception as e:
        logger.error(f"Error retrieving product details: {e}")
        return None

def get_market_analysis(brand_id: str) -> Optional[Dict[str, Any]]:
    """Retrieve market analysis data for a brand from Firebase.
    
    Args:
        brand_id: The unique identifier of the brand
        
    Returns:
        Dictionary containing market analysis data if found, None otherwise
    """
    try:
        brand_profile = get_brand_profile_by_id(brand_id)
        if not brand_profile:
            logger.error(f"No brand found with ID: {brand_id}")
            return None
            
        market_analysis = brand_profile.get('market_research')
        if not market_analysis:
            logger.warning(f"No market analysis found for brand {brand_id}")
            return None
            
        return market_analysis
    except Exception as e:
        logger.error(f"Error retrieving market analysis: {e}")
        return None

def get_marketing_platforms(brand_id: str) -> List[str]:
    """Retrieve target marketing platforms for a brand from Firebase.
    
    Args:
        brand_id: The unique identifier of the brand
        
    Returns:
        List of marketing platforms for content creation
    """
    try:
        brand_profile = get_brand_profile_by_id(brand_id)
        if not brand_profile:
            logger.error(f"No brand found with ID: {brand_id}")
            return ["website", "blog", "social_media"]  # Default platforms
            
        platforms = brand_profile.get('marketing_platforms')
        if not platforms:
            logger.warning(f"No marketing platforms specified for brand {brand_id}, using defaults")
            return ["website", "blog", "social_media"]  # Default platforms
            
        return platforms
    except Exception as e:
        logger.error(f"Error retrieving marketing platforms: {e}")
        return ["website", "blog", "social_media"]  # Default platforms

def save_product_seo_content(product_id: str, seo_content: Dict[str, Any]) -> bool:
    """Save SEO-optimized content to a product document in Firebase.
    
    Args:
        product_id: The unique identifier of the product
        seo_content: Dictionary containing SEO-optimized content for different platforms
        
    Returns:
        True if successful, False otherwise
    """
    try:
        from firebase_utils import db
        
        # Get a reference to the product document
        product_ref = db.collection('products').document(product_id)
        product_doc = product_ref.get()
        
        if not product_doc.exists:
            logger.error(f"No product found with ID: {product_id}")
            return False
            
        # Get the current product data
        product_data = product_doc.to_dict()
        
        # Update the product with the new SEO content
        if 'seo_content' in product_data:
            # If seo_content already exists, update it by platform
            for platform, content in seo_content.items():
                product_data['seo_content'][platform] = content
        else:
            # If seo_content doesn't exist, create it
            product_data['seo_content'] = seo_content
        
        # Save back to Firebase
        product_ref.update(product_data)
        logger.info(f"Successfully saved SEO content for product {product_id}")
        return True
    except Exception as e:
        logger.error(f"Error saving product SEO content: {e}")
        return False
    
# STEP 1: Agent for data gathering and SEO content generation (with tools)
product_seo_data_agent = LlmAgent(
    name="ProductSEODataAgent",
    model=GEMINI_MODEL,
    instruction="""
        You are an expert product SEO specialist with extensive knowledge of e-commerce and digital marketing.

        TASK:
        Create comprehensive, SEO-optimized content for multiple marketing platforms focused specifically on a product,
        using both the product details and the broader market analysis data.

        STEP 1: Retrieve Essential Data
        - Use the get_product_details tool to retrieve detailed information about the product
        - Use the get_market_analysis tool to retrieve the market research for the brand
        - Use the get_marketing_platforms tool to identify which platforms to create content for

        STEP 2: Analyze the Product and Market Data and create SEO content for each platform

        When creating your response, focus on these platforms:
        - facebook
        - instagram
        - twitter
        - youtube
        
        For each platform, include:
        - title: A platform-appropriate title/headline
        - description: Platform-specific description text
        - hashtags: Relevant hashtags for the platform
        
        Also include:
        - body_content: Main product description
        - keywords: Keywords for SEO
        - title: SEO page title
        - meta_description: SEO meta description
        
        
        When creating your response, structure the data in a clean, organized JSON format that follows
        the ProductSEOContentSchema structure, even though you don't have direct schema validation.
    """,
    description="Gathers data and generates product-specific SEO content for marketing platforms.",
    output_key="raw_product_seo_data",
    tools=[get_product_details, get_market_analysis, get_marketing_platforms],
)

product_seo_save_agent = LlmAgent(
    name="ProductSEOSaveAgent",
    model=GEMINI_MODEL,
    instruction="""
        You are a data storage specialist.
        
        Your task is to save the SEO content that has been generated and formatted.
        
        1. Retrieve the formatted SEO content from the session state under 'product_seo_content'
        2. Extract the product_id from this content
        3. Use the save_product_seo_content tool to save this data to Firebase
        4. Confirm the save was successful
        
        This is a critical step to ensure all the SEO work is properly stored for future use.
    """,
    description="Saves the formatted SEO content to Firebase.",
    output_key="save_confirmation",
    tools=[save_product_seo_content],
)

# STEP 2: Agent for schema validation (with output_schema, but no tools)
product_seo_formatter_agent = LlmAgent(
    name="ProductSEOFormatterAgent",
    model=GEMINI_MODEL,
    instruction="""
        You are a data formatting specialist for SEO content.
        
        Your task is to take the raw SEO content provided in the session state under 'raw_product_seo_data'
        and format it according to the ProductSEOContentSchema structure.It follows below schema:
        
        {
            "facebook": {
                "title": "Product Title for Facebook",
                "description": "Product description for Facebook"
            },
            "instagram": {
                "title": "Product Title for Instagram",
                "description": "Product description for Instagram",
                "hashtags": ["tag1", "tag2", "tag3"]
            },
            "body_content": "Main product description",
            "keywords": ["keyword1", "keyword2", "keyword3"],
            "title": "SEO Page Title",
            "meta_description": "SEO Meta Description"
        }
        
        Ensure all required fields are properly populated and follow the schema exactly.
        This simple format is critical for our existing system integrations.
        This formatted data will be used for presentation and analysis purposes.
    """,
    description="Formats raw SEO content according to the schema.",
    output_key="product_seo_content",
    output_schema=ProductSEOContentSchema,
)

# Create a sequential agent that combines both steps
product_seo_agent = SequentialAgent(
    name="ProductSEOAgent",
    description="Complete workflow for product-specific SEO content generation and storage",
    sub_agents=[
        product_seo_data_agent,     # Step 1: Gather data and generate content
        # product_seo_formatter_agent,  # Step 2: Format according to schema
        product_seo_save_agent
    ]
)