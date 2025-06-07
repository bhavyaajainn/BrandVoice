from google.adk.agents import Agent
from google.adk.tools import google_search


audience_agent = Agent(
    name="audience_analysis_agent",
    model="gemini-2.0-flash",
    description="Analyzes audience segments and personas.",
    instruction="""
    Research audience demographics, psychographics, and preferences using web search.
    """,
    tools=[google_search],
)