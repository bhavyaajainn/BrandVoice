from google.adk.agents import Agent
from google.adk.tools.agent_tool import AgentTool
from google.adk.tools import google_search

from .sub_agents.brand_analysis_agent.agent import brand_agent
from .sub_agents.product_analysis_agent.agent import product_agent
from .sub_agents.market_analysis_agent.agent import market_agent
from .sub_agents.audience_analysis_agent.agent import audience_agent
from .sub_agents.campaign_analysis_agent.agent import campaign_agent



brand_agent_tool = AgentTool(brand_agent)
product_agent_tool = AgentTool(product_agent)
market_agent_tool = AgentTool(market_agent)
audience_agent_tool = AgentTool(audience_agent)
campaign_agent_tool = AgentTool(campaign_agent)

# Root agent combines all subagents
root_agent = Agent(
    name="research_agent",
    model="gemini-2.0-flash",
    description="An agent that coordinates subagents to analyze all aspects of a company/product.",
    instruction="""
    You are a research agent that delegates to specialized subagents for brand, product, market, audience, and campaign analysis.
    Use the appropriate subagent for each aspect of the research.
    """,
    tools=[
        brand_agent_tool,
        product_agent_tool,
        market_agent_tool,
        audience_agent_tool,
        campaign_agent_tool,
    ],
)