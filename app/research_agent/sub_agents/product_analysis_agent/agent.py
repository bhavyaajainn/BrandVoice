from google.adk.agents import Agent
from google.adk.tools import google_search


product_agent = Agent(
    name="product_analysis_agent",
    model="gemini-2.0-flash",
    description="Analyzes product features, benefits, and positioning.",
    instruction="""
    Research the product's features, benefits, reviews, and market positioning using web search.
    """,
    tools=[google_search],
)