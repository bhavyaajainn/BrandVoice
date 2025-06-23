"""
Orchestrates all ADK agents for BrandVoice.
"""

from google.adk.agents import SequentialAgent, ParallelAgent, LoopAgent
# from services.agents import research_agent, seo_agent, content_gen_agent
from services.agents.designer import designer_agent

brandvoice_workflow = SequentialAgent(
    name="brandvoice_workflow",
    description="Research ➜ Draft ➜ Design assets",
    sub_agents=[
        designer_agent
    ]
)
