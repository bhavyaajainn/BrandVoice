

"""To testthe agent pipeline in the web app, you can use the following code snippet."""

from google.adk.agents import LlmAgent
from google.adk.tools.agent_tool import AgentTool
from google.adk.agents.sequential_agent import SequentialAgent



from .sub_agents.research import formatter_agent
from .sub_agents.seo import product_seo_agent
from .sub_agents.content import content_refinement_loop,content_creation_workflow
from .sub_agents.social_media_image_create import social_media_image_agent,social_media_pipeline_agent
from .sub_agents.mood_board import color_palette_agent

MODEL = "gemini-2.5-pro-preview-05-06" 


code_pipeline_agent = SequentialAgent(
    name="brandvoice",
    sub_agents=[],
    # sub_agents=[brand_details_agent,research_agent,save_research_agent],
    # sub_agents=[product_seo_agent],
    # sub_agents=[content_creation_workflow],
    # sub_agents=[color_palette_agent],
    # sub_agents=[brand_details_agent,research_agent,save_research_agent,product_seo_agent,content_creation_workflow,social_media_pipeline_agent]
    # sub_agents=[research_agent, formatter_agent, seo_agent, content_refinement_loop, social_media_image_agent],
)

root_agent = code_pipeline_agent

