from google.adk.agents import Agent
from google.adk.tools import google_search


market_agent = Agent(
    name="market_analysis_agent",
    model="gemini-2.0-flash",
    description="Analyzes target markets and trends.",
    instruction="""
    Research market size, trends, consumer behavior, and competitors using web search.
    """,
    tools=[google_search],
)