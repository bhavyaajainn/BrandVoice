
from google.adk.agents.llm_agent import LlmAgent
from google.adk.tools import google_search

from .schemas import MarketingAnalysisSchema
from .prompt import RESEARCH_AGENT_PROMPT
GEMINI_MODEL = "gemini-2.0-flash"
research_agent = LlmAgent(
    name="ResearchAgent",
    model=GEMINI_MODEL,
    instruction=RESEARCH_AGENT_PROMPT,
    description="Gathers marketing research using Google Search.",
    output_key="raw_research_data",
    tools=[google_search],
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