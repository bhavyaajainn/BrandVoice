
from google.adk.agents.llm_agent import LlmAgent
from .prompt import COPYWRITER_PROMPT, CRITIC_PROMPT, PLATFORM_SPECIFIC_FORMATTER_PROMPT, REFINER_PROMPT
from google.adk.agents.loop_agent import LoopAgent
from google.adk.tools.tool_context import ToolContext
from google.cloud import firestore
import json
from .schemas import PlatformContent
from typing import List, Dict, Any,Optional


GEMINI_MODEL            = "gemini-2.0-flash"
COMPLETION_PHRASE       = "CONTENT MEETS REQUIREMENTS"
STATE_CURRENT_DOC       = "current_document"
STATE_CRITICISM         = "criticism"
STATE_BRAND_INFO        = "brand_info"
STATE_PLATFORMS         = "platforms"
STATE_TARGET_PLATFORMS  = "target_platforms"
STATE_STRUCTURED_OUTPUT = "structured_output"
STATE_SEO_CONTENT       = "seo_content"
STATE_PRODUCT_ID        = "product_id"
STATE_PLATFORM          = "platform"


# Add this directly in agent.py - remove the import from prompt.py
PLATFORM_GUIDELINES = {
    "twitter": {
        "character_limit": 280,
        "recommended_hashtags": 2,
        "format": "Short, punchy text with hashtags and a clear call-to-action",
        "best_practices": [
            "Use relevant hashtags to increase discoverability",
            "Include a link when appropriate",
            "Ask questions to encourage engagement",
            "Keep copy concise and direct"
        ]
    },
    "instagram": {
        "character_limit": 2200,
        "recommended_hashtags": "5-15",
        "format": "Engaging caption with hashtags and emojis",
        "best_practices": [
            "Start with a hook in the first line",
            "Use line breaks for readability",
            "Add relevant hashtags at the end or in first comment",
            "Include a call-to-action"
        ]
    },
    "facebook": {
        "optimal_length": "40-80 characters",
        "format": "Conversational text with optional link and minimal hashtags",
        "best_practices": [
            "Ask questions to boost engagement",
            "Include compelling visuals",
            "Keep content conversational and authentic",
            "Use 1-2 hashtags maximum"
        ]
    },
    "blog": {
        "title_length": "50-60 characters",
        "meta_description": "150-160 characters",
        "format": "Structured content with headings, paragraphs, and CTAs",
        "best_practices": [
            "Use H2 and H3 headings with keywords",
            "Keep paragraphs short (3-4 sentences)",
            "Include internal and external links",
            "End with a compelling call-to-action"
        ]
    }
}

from firebase_utils import get_brand_profile_by_id
import logging

logger = logging.getLogger(__name__)

def get_product_seo_content(tool_context: ToolContext, product_id: str, platform: str) -> Dict[str, Any]:
    """Retrieve SEO content for a specific product and marketing platform.
    
    Args:
        product_id: The unique identifier of the product
        platform: The marketing platform to retrieve content for (e.g., 'twitter', 'instagram', 'blog')
        
    Returns:
        Dictionary containing SEO content for the specified platform
    """
    try:
        print(f"  [Tool Call] Retrieving SEO content for product {product_id}, platform {platform}")
        
        from firebase_utils import db
        
        # Get a reference to the product document
        product_ref = db.collection('products').document(product_id)
        product_doc = product_ref.get()
        
        if not product_doc.exists:
            logger.error(f"No product found with ID: {product_id}")
            tool_context.state["error"] = f"No product found with ID: {product_id}"
            return {"error": f"No product found with ID: {product_id}"}
            
        product_data = product_doc.to_dict()
        
        # Check if SEO content exists for this product
        if 'seo_content' not in product_data:
            logger.warning(f"No SEO content found for product {product_id}")
            tool_context.state["error"] = f"No SEO content found for product {product_id}"
            return {"error": f"No SEO content found for product {product_id}"}
            
        # Check if the specific platform exists in the SEO content
        if platform not in product_data['seo_content']:
            logger.warning(f"No SEO content found for platform {platform}")
            tool_context.state["error"] = f"No SEO content found for platform {platform}"
            return {"error": f"No SEO content found for platform {platform}"}
            
        # Store the SEO content in the agent state
        seo_content = product_data['seo_content'][platform]
        tool_context.state["seo_content"] = seo_content
        tool_context.state["product_id"] = product_id
        tool_context.state["platform"] = platform
        
        # Also fetch brand info if available
        brand_id = product_data.get('brand_id')
        if brand_id:
            brand_profile = get_brand_profile_by_id(brand_id)
            if brand_profile:
                tool_context.state[STATE_BRAND_INFO] = brand_profile
                
        return {
            "product_id": product_id,
            "platform": platform,
            "seo_content": seo_content
        }
    except Exception as e:
        error_msg = f"Error retrieving SEO content: {str(e)}"
        logger.error(error_msg)
        tool_context.state["error"] = error_msg
        return {"error": error_msg}

def save_product_content(tool_context: ToolContext, content: Dict[str, Any]) -> Dict[str, Any]:
    """Save final content to a product document in Firebase.
    
    Args:
        content: Dictionary containing the finalized content
        
    Returns:
        Status of the save operation
    """
    try:
        print(f"  [Tool Call] Saving content to product database")
        
        # Get product_id and platform from state
        product_id = tool_context.state.get("product_id")
        platform = tool_context.state.get("platform")
        
        if not product_id or not platform:
            error_msg = "Missing product_id or platform in state"
            logger.error(error_msg)
            return {"success": False, "error": error_msg}
        
        from firebase_utils import db
        
        # Get a reference to the product document
        product_ref = db.collection('products').document(product_id)
        product_doc = product_ref.get()
        
        if not product_doc.exists:
            error_msg = f"No product found with ID: {product_id}"
            logger.error(error_msg)
            return {"success": False, "error": error_msg}
            
        # Get the current product data
        product_data = product_doc.to_dict()
        
        # Create content structure if it doesn't exist
        if 'marketing_content' not in product_data:
            product_data['marketing_content'] = {}
            
        # Save the content for the specific platform
        product_data['marketing_content'][platform] = content
        
        # Save back to Firebase
        product_ref.update(product_data)
        logger.info(f"Successfully saved content for product {product_id}, platform {platform}")
        
        return {
            "success": True,
            "product_id": product_id,
            "platform": platform
        }
    except Exception as e:
        error_msg = f"Error saving content: {str(e)}"
        logger.error(error_msg)
        return {"success": False, "error": error_msg}

# Define a custom exit_loop tool
def exit_loop(tool_context: ToolContext):
    """Call this function ONLY when the critique indicates no further changes are needed, signaling the iterative process should end."""
    print(f"  [Tool Call] exit_loop triggered by {tool_context.agent_name}")
    tool_context.actions.escalate = True
    # Return empty dict as tools should typically return JSON-serializable output
    return {}


seo_content_retrieval_agent = LlmAgent(
    name="SEOContentRetrievalAgent",
    model=GEMINI_MODEL,
    instruction="""
        You are an agent responsible for retrieving SEO content from the database.
        
        Your task is to:
        1. Extract the product_id and platform from the user request
        2. Use the get_product_seo_content tool to retrieve the SEO content
        3. Confirm that the content was successfully retrieved
        
        If there is any error retrieving the content, clearly explain the issue to the user.
    """,
    description="Fetches SEO content for a specific product and platform",
    output_key="product_seo_content",
    tools=[get_product_seo_content],
)

DYNAMIC_COPYWRITER_PROMPT = """
You are an expert marketing copywriter. Create compelling content based on the SEO research provided.

Target Platform: {platform}
Platform Guidelines: {platform_guidelines}

SEO Content for this product and platform:
{seo_content}

{original_prompt}
"""

# 1. CopywriterAgent - creates initial draft based on SEO content (keep as is)
copywriter_agent = LlmAgent(
    name="CopywriterAgent",
    model=GEMINI_MODEL,
    instruction=lambda ctx: DYNAMIC_COPYWRITER_PROMPT.format(
        platform=ctx.state.get("platform", "unknown"),
        platform_guidelines=json.dumps(PLATFORM_GUIDELINES.get(ctx.state.get("platform", "unknown"), {}), indent=2),
        seo_content=json.dumps(ctx.state.get("seo_content", {}), indent=2),
        original_prompt=COPYWRITER_PROMPT
    ),
    description="Creates initial marketing copy draft from SEO content",
    output_key=STATE_CURRENT_DOC,
)

# 2. Critic Agent - combines compliance and persona evaluation into a single critic
critic_agent = LlmAgent(
    name="CriticAgent",
    model=GEMINI_MODEL,
    instruction=CRITIC_PROMPT.format(COMPLETION_PHRASE=COMPLETION_PHRASE),
    description="Reviews marketing copy for compliance issues and customer appeal",
    output_key=STATE_CRITICISM
)


# 3. Refiner Agent - improves content based on criticism or exits loop
refiner_agent = LlmAgent(
    name="RefinerAgent",
    model=GEMINI_MODEL,
    instruction=REFINER_PROMPT.format(
        COMPLETION_PHRASE=COMPLETION_PHRASE),
    description="Refines marketing content based on criticism or finalizes if requirements are met",
    tools=[exit_loop],
    output_key=STATE_CURRENT_DOC
)

formatter_agent = LlmAgent(
    name="ContentFormatterAgent",
    model=GEMINI_MODEL,
    instruction=lambda ctx: PLATFORM_SPECIFIC_FORMATTER_PROMPT.format(
        platform=ctx.state.get("platform", "unknown"),
        platform_guidelines=json.dumps(PLATFORM_GUIDELINES.get(ctx.state.get("platform", "unknown"), {}), indent=2),
        current_document=ctx.state.get(STATE_CURRENT_DOC, "")
    ),
    description="Structures marketing content into platform-specific formats",
    output_key=STATE_STRUCTURED_OUTPUT,
    output_schema=PlatformContent
)


content_save_agent = LlmAgent(
    name="ContentSaveAgent",
    model=GEMINI_MODEL,
    instruction="""
        You are an agent responsible for saving the final content to the database.
        
        Your task is to:
        1. Retrieve the formatted content from the session state
        2. Use the save_product_content tool to save it to the database
        3. Confirm to the user that the content was successfully saved
        
        Provide a summary of what was saved and for which product and platform.
    """,
    description="Saves the final content to the product database",
    tools=[save_product_content],
    output_key="save_confirmation"
)

# 4. Create the refinement loop with critic and refiner
content_refinement_loop = LoopAgent(
    name="ContentRefinementLoop",
    sub_agents=[
        critic_agent,      # Then reviews it
        refiner_agent      # Then refines it or exits the loop   
    ],
    max_iterations=5,  # Allow multiple refinement cycles if needed
    description="Iteratively refines marketing content until it meets compliance and customer requirements",

)

from google.adk.agents import SequentialAgent

content_creation_workflow = SequentialAgent(
    name="ContentCreationWorkflow",
    sub_agents=[
        seo_content_retrieval_agent,    # Step 1: Retrieve SEO content
        copywriter_agent,               # Step 2: Create initial content
        content_refinement_loop,        # Step 3: Refine until content meets requirements
        formatter_agent,                # Step 4: Format the content
        content_save_agent              # Step 5: Save to database
    ],
    description="End-to-end workflow for creating and saving marketing content based on SEO data",
)