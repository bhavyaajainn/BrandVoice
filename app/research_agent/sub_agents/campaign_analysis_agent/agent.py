from google.adk.agents import Agent
from google.adk.tools import google_search



campaign_agent = Agent(
    name="campaign_analysis_agent",
    model="gemini-2.0-flash",
    description="Analyzes marketing campaigns and best practices.",
    instruction="""
    Research campaign types, best practices, and successful examples using web search.
    """,
    tools=[google_search],
)