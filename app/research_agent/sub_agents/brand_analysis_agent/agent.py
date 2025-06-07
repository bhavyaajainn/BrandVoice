from google.adk.agents import Agent
from google.adk.tools import google_search


brand_agent = Agent(
    name="brand_analysis_agent",
    model="gemini-2.0-flash",
    description="Analyzes brand/company background and reputation.",
    instruction="""
    Research the company's history, mission, values, and reputation using web search.
    Store your findings for future reference.
    """,
    tools=[google_search],
)