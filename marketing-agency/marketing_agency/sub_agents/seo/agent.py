
from google.adk.agents.llm_agent import LlmAgent

from .prompt import SEO_PROMPT


GEMINI_MODEL = "gemini-2.0-flash"

seo_agent = LlmAgent(
    name="SEOAgent",
    model=GEMINI_MODEL,
    instruction=SEO_PROMPT,
    description="Generates SEO-optimized content based on marketing analysis and requested content types.",
    output_key="seo_content",
)