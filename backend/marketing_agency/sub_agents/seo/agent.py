
# from google.adk.agents.llm_agent import LlmAgent
# from google.adk.agents import SequentialAgent


# from .schemas import ProductSEOContentSchema
# from .prompt import  PRODUCT_SEO_PROMPT, SEO_PROMPT


# GEMINI_MODEL = "gemini-2.0-flash"


# import logging
# from typing import Dict, Any, List, Optional
# from firebase_utils import get_brand_profile_by_id, update_brand_profile
# from google.adk.tools.tool_context import ToolContext

# logger = logging.getLogger(__name__)

    
# def get_product_details(tool_context: ToolContext, product_id: str) -> Optional[Dict[str, Any]]:
#     """Retrieve product details from Firebase.
    
#     Args:
#         tool_context: The tool context containing state information
#         product_id: The unique identifier of the product
        
#     Returns:
#         Dictionary containing product details if found, None otherwise
#     """
#     try:
#         print(f"Attempting to import firebase_utils...")
#         from firebase_utils import db
        
#         # Get a reference to the product document
#         print(f"Attempting to retrieve document for product_id={product_id}")
#         product_ref = db.collection('products').document(product_id)
#         product_doc = product_ref.get()
        
#         if not product_doc.exists:
#             error_msg = f"ERROR: No product found with ID: {product_id}"
#             print(error_msg)
#             tool_context.state["error"] = error_msg
#             return None
            
#         product_data = product_doc.to_dict()
#         print(f"SUCCESS: Product details retrieved for ID: {product_id}")
#         print(f"Product data keys: {list(product_data.keys())}")
#         print(f"Product name: {product_data.get('product_name', 'Not found')}")
        
#         # Store product data in tool_context state
#         tool_context.state["product_data"] = product_data
#         tool_context.state["product_id"] = product_id
        
#         return product_data
#     except Exception as e:
#         error_msg = f"ERROR: Failed to retrieve product details: {e}"
#         print(error_msg)
#         tool_context.state["error"] = error_msg
#         return None

# def get_market_analysis(tool_context: ToolContext, brand_id: str) -> Optional[Dict[str, Any]]:
#     """Retrieve market analysis data for a brand from Firebase.
    
#     Args:
#         tool_context: The tool context containing state information
#         brand_id: The unique identifier of the brand
        
#     Returns:
#         Dictionary containing market analysis data if found, None otherwise
#     """
#     try:
#         brand_profile = get_brand_profile_by_id(brand_id)
#         if not brand_profile:
#             error_msg = f"No brand found with ID: {brand_id}"
#             logger.error(error_msg)
#             tool_context.state["error"] = error_msg
#             return None
            
#         market_analysis = brand_profile.get('market_research')
#         if not market_analysis:
#             error_msg = f"No market analysis found for brand {brand_id}"
#             logger.warning(error_msg)
#             tool_context.state["error"] = error_msg
#             return None
            
#         # Store market analysis in tool_context state
#         tool_context.state["market_analysis"] = market_analysis
#         tool_context.state["brand_id"] = brand_id
        
#         return market_analysis
#     except Exception as e:
#         error_msg = f"Error retrieving market analysis: {e}"
#         logger.error(error_msg)
#         tool_context.state["error"] = error_msg
#         return None

# def get_marketing_platforms(tool_context: ToolContext, brand_id: str) -> List[str]:
#     """Retrieve target marketing platforms for a brand from Firebase.
    
#     Args:
#         tool_context: The tool context containing state information
#         brand_id: The unique identifier of the brand
        
#     Returns:
#         List of marketing platforms for content creation
#     """
#     try:
#         brand_profile = get_brand_profile_by_id(brand_id)
#         if not brand_profile:
#             error_msg = f"No brand found with ID: {brand_id}"
#             logger.error(error_msg)
#             tool_context.state["error"] = error_msg
#             return ["instagram", "facebook", "youtube"]    # Default platforms
            
#         platforms = brand_profile.get('marketing_platforms')
#         if not platforms:
#             warning_msg = f"No marketing platforms specified for brand {brand_id}, using defaults"
#             logger.warning(warning_msg)
#             tool_context.state["warning"] = warning_msg
#             platforms = ["instagram", "facebook", "youtube"]    # Default platforms
            
#         # Store platforms in tool_context state
#         tool_context.state["marketing_platforms"] = platforms
        
#         return platforms
#     except Exception as e:
#         error_msg = f"Error retrieving marketing platforms: {e}"
#         logger.error(error_msg)
#         tool_context.state["error"] = error_msg
#         return ["instagram", "facebook", "youtube"]  

# def save_product_seo_content(tool_context: ToolContext, product_id: str, seo_content: Dict[str, Any]) -> bool:
#     """Save SEO-optimized content to a product document in Firebase.
    
#     Args:
#         product_id: The unique identifier of the product
#         seo_content: Dictionary containing SEO-optimized content for different platforms
        
#     Returns:
#         True if successful, False otherwise
#     """
#     try:
#         from firebase_utils import db
        
#         # Get a reference to the product document
#         product_ref = db.collection('products').document(product_id)
#         product_doc = product_ref.get()
        
#         if not product_doc.exists:
#             error_msg = f"No product found with ID: {product_id}"
#             logger.error(error_msg)
#             tool_context.state["error"] = error_msg
#             return False
            
#         # Get the current product data
#         product_data = product_doc.to_dict()
        
#         # Update the product with the new SEO content
#         if 'seo_content' in product_data:
#             # If seo_content already exists, update it by platform
#             for platform, content in seo_content.items():
#                 product_data['seo_content'][platform] = content
#         else:
#             # If seo_content doesn't exist, create it
#             product_data['seo_content'] = seo_content
        
#         # Save back to Firebase
#         product_ref.update(product_data)
#         success_msg = f"Successfully saved SEO content for product {product_id}"
#         logger.info(success_msg)
#         tool_context.state["success"] = success_msg
#         return True
#     except Exception as e:
#         error_msg = f"Error saving product SEO content: {e}"
#         logger.error(error_msg)
#         tool_context.state["error"] = error_msg
#         return False
    
# # STEP 1: Agent for data gathering and SEO content generation (with tools)
# product_seo_data_agent = LlmAgent(
#     name="ProductSEODataAgent",
#     model=GEMINI_MODEL,
#     instruction="""
#         You are an expert product SEO specialist with extensive knowledge of e-commerce and digital marketing.

#         TASK:
#         Create comprehensive, SEO-optimized content for multiple marketing platforms focused specifically on a product,
#         using both the product details and the broader market analysis data.

#         INPUTS:
#         - product_id: The unique identifier for the product you're analyzing
#         - brand_id: The unique identifier for the brand this product belongs to

#         STEP 1: Retrieve Essential Data
#         - Use the get_product_details tool with the provided product_id
#         - Use the get_market_analysis tool with the provided brand_id
#         - Use the get_marketing_platforms tool with the provided brand_id

#         STEP 2: Analyze the Product and Market Data and create SEO content for each platform
#         The product details:
#          {product_data}
         
#         When creating your response, focus on these platforms:
#         - facebook
#         - instagram
#         - twitter
#         - youtube
        
#         For each platform, include:
#         - title: A platform-appropriate title/headline
#         - description: Platform-specific description text
#         - hashtags: Relevant hashtags for the platform
        
#         Also include:
#         - body_content: Main product description
#         - keywords: Keywords for SEO
#         - title: SEO page title
#         - meta_description: SEO meta description

#         FORMAT YOUR RESPONSE EXACTLY AS FOLLOWS:
#         {
#             "body_content": "Main product description text",
#             "keywords": "comma-separated keywords for SEO",
#             "meta_description": "SEO meta description text",
#             "title": "SEO page title",
#             "platforms": {
#                 "facebook": {
#                     "title": "Facebook-specific title",
#                     "description": "Facebook-specific description",
#                     "hashtags": "#Hashtag1 #Hashtag2 #Hashtag3"
#                 },
#                 "instagram": {
#                     "title": "Instagram-specific title",
#                     "description": "Instagram-specific description",
#                     "hashtags": "#Hashtag1 #Hashtag2 #Hashtag3"
#                 },
#                 "twitter": {
#                     "title": "Twitter-specific title",
#                     "description": "Twitter-specific description",
#                     "hashtags": "#Hashtag1 #Hashtag2 #Hashtag3"
#                 },
#                 "youtube": {
#                     "title": "YouTube-specific title",
#                     "description": "YouTube-specific description",
#                     "hashtags": "#Hashtag1 #Hashtag2 #Hashtag3"
#                 }
#             }
#         }
        
#         This exact structure is critical for our system. Do not deviate from it
        
#         When creating your response, structure the data in a clean, organized JSON format that follows
#         the ProductSEOContentSchema structure, even though you don't have direct schema validation.
#     """,
#     description="Gathers data and generates product-specific SEO content for marketing platforms.",
#     output_key="product_seo_content",
#     tools=[get_product_details, get_market_analysis, get_marketing_platforms],
# )

# product_seo_save_agent = LlmAgent(
#     name="ProductSEOSaveAgent",
#     model=GEMINI_MODEL,
#     instruction="""
#         You are a data storage specialist.
        
#         Your task is to save the SEO content that has been generated and formatted.
        
#         1. Retrieve the formatted SEO content from the session state under 'product_seo_content'
#         2. Extract the product_id from this content
#         3. Use the save_product_seo_content tool to save this data to Firebase
#         4. Confirm the save was successful
        
#         This is a critical step to ensure all the SEO work is properly stored for future use.
#     """,
#     description="Saves the formatted SEO content to Firebase.",
#     output_key="save_confirmation",
#     tools=[save_product_seo_content],
# )

# # STEP 2: Agent for schema validation (with output_schema, but no tools)
# product_seo_formatter_agent = LlmAgent(
#     name="ProductSEOFormatterAgent",
#     model=GEMINI_MODEL,
#     instruction="""
#         You are a data formatting specialist for SEO content.
        
#         Your task is to take the raw SEO content provided in the session state under 'raw_product_seo_data'
#         and format it according to the ProductSEOContentSchema structure.It follows below schema:
        
#         {
#             "facebook": {
#                 "title": "Product Title for Facebook",
#                 "description": "Product description for Facebook"
#             },
#             "instagram": {
#                 "title": "Product Title for Instagram",
#                 "description": "Product description for Instagram",
#                 "hashtags": ["tag1", "tag2", "tag3"]
#             },
#             "body_content": "Main product description",
#             "keywords": ["keyword1", "keyword2", "keyword3"],
#             "title": "SEO Page Title",
#             "meta_description": "SEO Meta Description"
#         }
        
#         Ensure all required fields are properly populated and follow the schema exactly.
#         This simple format is critical for our existing system integrations.
#         This formatted data will be used for presentation and analysis purposes.
#     """,
#     description="Formats raw SEO content according to the schema.",
#     output_key="product_seo_content",
#     output_schema=ProductSEOContentSchema,
# )

# # Create a sequential agent that combines both steps
# product_seo_agent = SequentialAgent(
#     name="ProductSEOAgent",
#     description="Complete workflow for product-specific SEO content generation and storage",
#     sub_agents=[
#         product_seo_data_agent,     # Step 1: Gather data and generate content
#         product_seo_save_agent
#     ]
# )

from google.adk.agents.llm_agent import LlmAgent
from google.adk.agents import SequentialAgent

from .schemas import ProductSEOContentSchema
from .prompt import PRODUCT_SEO_PROMPT, SEO_PROMPT

GEMINI_MODEL = "gemini-2.0-flash"

import logging
from typing import Dict, Any, List, Optional
from firebase_utils import get_brand_profile_by_id, update_brand_profile
from google.adk.tools.tool_context import ToolContext

logger = logging.getLogger(__name__)

    
def get_product_details(tool_context: ToolContext, product_id: str) -> Optional[Dict[str, Any]]:
    """Retrieve product details from Firebase.
    
    Args:
        tool_context: The tool context containing state information
        product_id: The unique identifier of the product
        
    Returns:
        Dictionary containing product details if found, None otherwise
    """
    try:
        print(f"Attempting to import firebase_utils...")
        from firebase_utils import db
        
        # Get a reference to the product document
        print(f"Attempting to retrieve document for product_id={product_id}")
        product_ref = db.collection('products').document(product_id)
        product_doc = product_ref.get()
        
        if not product_doc.exists:
            error_msg = f"ERROR: No product found with ID: {product_id}"
            print(error_msg)
            tool_context.state["error"] = error_msg
            return None
            
        product_data = product_doc.to_dict()
        print(f"SUCCESS: Product details retrieved for ID: {product_id}")
        print(f"Product data keys: {list(product_data.keys())}")
        print(f"Product name: {product_data.get('product_name', 'Not found')}")
        
        # Store product data in tool_context state
        tool_context.state["product_data"] = product_data
        tool_context.state["product_id"] = product_id
        
        return product_data
    except Exception as e:
        error_msg = f"ERROR: Failed to retrieve product details: {e}"
        print(error_msg)
        tool_context.state["error"] = error_msg
        return None

def get_market_analysis(tool_context: ToolContext, brand_id: str) -> Optional[Dict[str, Any]]:
    """Retrieve market analysis data for a brand from Firebase."""
    try:
        brand_profile = get_brand_profile_by_id(brand_id)
        if not brand_profile:
            error_msg = f"No brand found with ID: {brand_id}"
            logger.error(error_msg)
            tool_context.state["error"] = error_msg
            # Return empty dict instead of None
            tool_context.state["market_analysis"] = {}
            tool_context.state["market_analysis_missing"] = True
            return {}
            
        market_analysis = brand_profile.get('market_research')
        if not market_analysis:
            warning_msg = f"No market analysis found for brand {brand_id}"
            logger.warning(warning_msg)
            tool_context.state["warning"] = warning_msg
            # Return empty dict instead of None
            tool_context.state["market_analysis"] = {}
            tool_context.state["market_analysis_missing"] = True
            return {}
            
        # Store market analysis in tool_context state
        tool_context.state["market_analysis"] = market_analysis
        tool_context.state["brand_id"] = brand_id
        
        return market_analysis
    except Exception as e:
        error_msg = f"Error retrieving market analysis: {e}"
        logger.error(error_msg)
        tool_context.state["error"] = error_msg
        # Return empty dict instead of None
        tool_context.state["market_analysis"] = {}
        tool_context.state["market_analysis_missing"] = True
        return {}

def get_marketing_platforms(tool_context: ToolContext, brand_id: str) -> List[str]:
    """Retrieve target marketing platforms for a brand from Firebase.
    
    Args:
        tool_context: The tool context containing state information
        brand_id: The unique identifier of the brand
        
    Returns:
        List of marketing platforms for content creation
    """
    try:
        brand_profile = get_brand_profile_by_id(brand_id)
        if not brand_profile:
            error_msg = f"No brand found with ID: {brand_id}"
            logger.error(error_msg)
            tool_context.state["error"] = error_msg
            return ["instagram", "facebook", "youtube"]    # Default platforms
            
        platforms = brand_profile.get('marketing_platforms')
        if not platforms:
            warning_msg = f"No marketing platforms specified for brand {brand_id}, using defaults"
            logger.warning(warning_msg)
            tool_context.state["warning"] = warning_msg
            platforms = ["instagram", "facebook", "youtube"]    # Default platforms
            
        # Store platforms in tool_context state
        tool_context.state["marketing_platforms"] = platforms
        
        return platforms
    except Exception as e:
        error_msg = f"Error retrieving marketing platforms: {e}"
        logger.error(error_msg)
        tool_context.state["error"] = error_msg
        return ["instagram", "facebook", "youtube"]  

def save_product_seo_content(tool_context: ToolContext, product_id: str, seo_content: Dict[str, Any]) -> bool:
    """Save SEO-optimized content to a product document in Firebase."""
    try:
        print(f"SAVE: Starting save operation for product_id={product_id}")
        print(f"SAVE: Content structure received: {list(seo_content.keys())}")
        
        from firebase_utils import db
        
        # Get a reference to the product document
        product_ref = db.collection('products').document(product_id)
        product_doc = product_ref.get()
        
        if not product_doc.exists:
            error_msg = f"SAVE ERROR: No product found with ID: {product_id}"
            print(error_msg)
            logger.error(error_msg)
            tool_context.state["error"] = error_msg
            return False
            
        # Get the current product data
        product_data = product_doc.to_dict()
        print(f"SAVE: Retrieved existing product data with keys: {list(product_data.keys())}")
        
        # Update the product with the new SEO content
        if 'seo_content' in product_data:
            print(f"SAVE: Updating existing seo_content")
            # If seo_content already exists, update it by platform
            for platform, content in seo_content.items():
                product_data['seo_content'][platform] = content
        else:
            print(f"SAVE: Creating new seo_content field")
            # If seo_content doesn't exist, create it
            product_data['seo_content'] = seo_content
        
        # Save back to Firebase
        print(f"SAVE: Updating document in Firebase")
        product_ref.update(product_data)
        success_msg = f"SAVE SUCCESS: Saved SEO content for product {product_id}"
        print(success_msg)
        logger.info(success_msg)
        tool_context.state["success"] = success_msg
        return True
    except Exception as e:
        error_msg = f"SAVE ERROR: Failed to save product SEO content: {e}"
        print(error_msg)
        logger.error(error_msg)
        tool_context.state["error"] = error_msg
        return False
    
# STEP 1: Agent for data gathering only
data_gathering_agent = LlmAgent(
    name="DataGatheringAgent",
    model=GEMINI_MODEL,
    instruction="""
        You are a data gathering assistant for SEO content generation.

        TASK:
        Retrieve all necessary data for creating SEO-optimized content for a product.

        INPUTS:
        - product_id: The unique identifier for the product you're analyzing
        - brand_id: The unique identifier for the brand this product belongs to

        STEP 1: Retrieve Essential Data
        - Use the get_product_details tool with the provided product_id
        - Use the get_market_analysis tool with the provided brand_id
        - Use the get_marketing_platforms tool with the provided brand_id

        STEP 2: Confirm data retrieval
        Confirm that you've retrieved the following data:
        - Product details
        - Market analysis
        - Marketing platforms

        Important: Do not attempt to generate any SEO content at this stage. Simply confirm
        that all necessary data has been retrieved and stored in the tool context.
    """,
    description="Gathers all necessary data for SEO content generation.",
    output_key="data_gathering_confirmation",
    tools=[get_product_details, get_market_analysis, get_marketing_platforms],
)

# STEP 2: Agent for SEO content generation (using the gathered data)
content_generation_agent = LlmAgent(
    name="ContentGenerationAgent",
    model=GEMINI_MODEL,
    instruction="""
        You are an expert product SEO specialist with extensive knowledge of e-commerce and digital marketing.

        TASK:
        Create comprehensive, SEO-optimized content for multiple marketing platforms focused specifically on a product,
        using the data that has already been gathered and stored in the tool context.

        The necessary data has already been gathered and is available in the tool context state:
        - Product details under "product_data"
        - Market analysis under "market_analysis"
        - Marketing platforms under "marketing_platforms"
        
        Create SEO content for these platforms:
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

        FORMAT YOUR RESPONSE EXACTLY AS FOLLOWS:
        {
            "body_content": "Main product description text",
            "keywords": "comma-separated keywords for SEO",
            "meta_description": "SEO meta description text",
            "title": "SEO page title",
            "platforms": {
                "facebook": {
                    "title": "Facebook-specific title",
                    "description": "Facebook-specific description",
                    "hashtags": "#Hashtag1 #Hashtag2 #Hashtag3"
                },
                "instagram": {
                    "title": "Instagram-specific title",
                    "description": "Instagram-specific description",
                    "hashtags": "#Hashtag1 #Hashtag2 #Hashtag3"
                },
                "twitter": {
                    "title": "Twitter-specific title",
                    "description": "Twitter-specific description",
                    "hashtags": "#Hashtag1 #Hashtag2 #Hashtag3"
                },
                "youtube": {
                    "title": "YouTube-specific title",
                    "description": "YouTube-specific description",
                    "hashtags": "#Hashtag1 #Hashtag2 #Hashtag3"
                }
            }
        }
        
        This exact structure is critical for our system. Do not deviate from it.
        When creating your response, structure the data in a clean, that follows
        the ProductSEOContentSchema structure, even though you don't have direct schema validation.
    """,
    description="Generates SEO content based on the gathered data.",
    output_key="product_seo_content",
)

# STEP 3: Agent for saving the generated content
product_seo_save_agent = LlmAgent(
    name="ProductSEOSaveAgent",
    model=GEMINI_MODEL,
    instruction="""
        You are a data storage specialist.
        
        Your task is to save the SEO content that has been generated and formatted.
        
        1. Retrieve the formatted SEO content from the tool context state under 'product_seo_content'
        2. Retrieve the product_id from the tool context state under 'product_id'
        3. Call the save_product_seo_content tool with exactly these two parameters
        4. Confirm the save was successful
        
        IMPORTANT: You must call save_product_seo_content with exactly the product_id and seo_content parameters.
    
        This is a critical step to ensure all the SEO work is properly stored for future use.
    """,
    description="Saves the formatted SEO content to Firebase.",
    output_key="save_confirmation",
    tools=[save_product_seo_content],
)

# Create a sequential agent that combines all three steps
product_seo_agent = SequentialAgent(
    name="ProductSEOAgent",
    description="Complete workflow for product-specific SEO content generation and storage",
    sub_agents=[
        data_gathering_agent,      # Step 1: Gather data only
        content_generation_agent,  # Step 2: Generate content using gathered data
        product_seo_save_agent     # Step 3: Save the generated content
    ]
)