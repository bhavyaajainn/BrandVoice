
from datetime import datetime
from google.adk.agents.llm_agent import LlmAgent
from google.adk.agents.sequential_agent import SequentialAgent
from google.adk.tools import google_search
from .prompt import BRAND_DETAILS_AGENT_PROMPT

from .schemas import MarketingAnalysisSchema
from .prompt import RESEARCH_AGENT_PROMPT
GEMINI_MODEL = "gemini-2.0-flash"

import logging
from typing import Dict, Any, Optional
from firebase_utils import get_brand_profile_by_id as firebase_get_brand
from firebase_utils import update_brand_profile as firebase_update_brand 

logger = logging.getLogger(__name__)


def get_brand_profile(brand_id: str) -> Optional[Dict[str, Any]]:
    """Retrieves a brand profile from Firebase by its ID.
    
    Args:
        brand_id: The unique identifier of the brand to retrieve.
        
    Returns:
        A dictionary containing the brand profile data if found, None otherwise.
    """
    try:
        return firebase_get_brand(brand_id)
    except Exception as e:
        logger.error(f"Error retrieving brand profile: {e}")
        return None

def save_market_research(brand_id: str, research_data: Dict[str, Any]) -> bool:
    """Saves market research data to a brand profile in Firebase.
    
    Args:
        brand_id: The unique identifier of the brand to update
        research_data: The market research data to save
        
    Returns:
        True if successful, False otherwise
    """
    try:
        # Just update the specific field, not the entire document
        update_data = {
            'market_analysis': research_data,  # Change field name to match API
            'market_analysis_status': 'completed',  # Add status for frontend
            'market_analysis_timestamp': datetime.now().isoformat()  # Add timestamp
        }
        
        # Save only the necessary fields to Firebase
        success = firebase_update_brand(brand_id, update_data)
        
        if success:
            logger.info(f"Successfully saved market analysis for brand {brand_id}")
            return True
        else:
            logger.error(f"Failed to update market analysis in Firebase")
            return False
    except Exception as e:
        logger.error(f"Error saving market analysis: {e}")
        return False

brand_details_agent = LlmAgent(
    name="BrandDetailsAgent",
    model=GEMINI_MODEL,
    instruction=BRAND_DETAILS_AGENT_PROMPT,
    description="Fetches and preprocesses brand details from Firebase.",
    output_key="brand_details",
    tools=[get_brand_profile],
)

research_agent = LlmAgent(
    name="ResearchAgent",
    model=GEMINI_MODEL,
    instruction=RESEARCH_AGENT_PROMPT,
    description="Gathers marketing research using Google Search.",
    output_key="raw_research_data",
    tools=[google_search],
)

save_research_agent = LlmAgent(
    name="SaveResearchAgent",
    model=GEMINI_MODEL,
    instruction="""
        You are a data storage agent.
        Your task is to save the completed market analysis to Firebase.
        
        1. Retrieve the 'brand_id' from the user's initial request
        2. Get the completed market analysis from the 'raw_research_data' session state
        3. Use the save_market_research tool to save this data to Firebase
        
        Confirm to the user when the data has been successfully saved.
    """,
    description="Saves the market analysis back to Firebase.",
    output_key="save_confirmation",
    tools=[save_market_research],
)

formatter_agent = LlmAgent(
    name="FormatterAgent",
    model=GEMINI_MODEL,
    instruction="""
        You are a data formatting agent.
        Your task is to take the raw research data provided in the session state under the key 'raw_research_data'
        and format it according to a specific JSON structure.
        
        You must extract all relevant information and organize it precisely according to the schema.
    """,
    description="Formats research data according to a specific schema.",
    output_key="topic_research_items",
    output_schema=MarketingAnalysisSchema
)

market_analysis_agent = SequentialAgent(
    name="market_analysis",
    sub_agents=[brand_details_agent, research_agent, save_research_agent]
)