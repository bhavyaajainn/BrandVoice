
from google.adk.agents.llm_agent import LlmAgent
from .prompt import COPYWRITER_PROMPT, CRITIC_PROMPT, FORMATTER_PROMPT, REFINER_PROMPT
from google.adk.agents.loop_agent import LoopAgent
from google.adk.tools.tool_context import ToolContext
from google.cloud import firestore
import json
from typing import List, Dict, Any,Optional
from pydantic import Field
from pydantic import BaseModel

GEMINI_MODEL = "gemini-2.0-flash"
COMPLETION_PHRASE = "CONTENT MEETS REQUIREMENTS"
STATE_CURRENT_DOC = "current_document"
STATE_CRITICISM = "criticism"
STATE_BRAND_INFO = "brand_info"
STATE_PLATFORMS = "platforms"
STATE_TARGET_PLATFORMS = "target_platforms"


class SocialPost(BaseModel):
    text: str
    hashtags: List[str] = Field(default_factory=list)
    call_to_action: Optional[str] = None

class InstagramPost(BaseModel):
    caption: str
    hashtags: List[str] = Field(default_factory=list)
    image_description: Optional[str] = None
    call_to_action: Optional[str] = None

class BlogSection(BaseModel):
    heading: str
    content: str

class BlogContent(BaseModel):
    title: str
    meta_description: Optional[str] = None
    sections: List[BlogSection] = Field(default_factory=list)
    call_to_action: Optional[str] = None

class EmailContent(BaseModel):
    subject_line: str
    body: str
    preview_text: Optional[str] = None
    call_to_action: Optional[str] = None

class ContentStructure(BaseModel):
    platforms: Dict[str, Any]
    universal: Dict[str, Any]

# Define a custom exit_loop tool
def exit_loop(tool_context: ToolContext):
    """Call this function ONLY when the critique indicates no further changes are needed, signaling the iterative process should end."""
    print(f"  [Tool Call] exit_loop triggered by {tool_context.agent_name}")
    tool_context.actions.escalate = True
    # Return empty dict as tools should typically return JSON-serializable output
    return {}

def get_platforms_from_firebase(tool_context: ToolContext) -> Dict[str, Any]:
    """Retrieve available content platforms from Firebase"""
    default_platforms = {
            "twitter": {
                "name": "Twitter",
                "max_length": 280,
                "content_type": "social",
                "tone": "conversational",
                "media_support": ["images", "videos", "links", "polls"],
                "format_guidelines": "Concise and direct messaging. Use mentions and hashtags strategically.",
                "hashtag_usage": "1-2 relevant hashtags, placed within or at end of tweet",
                "best_practices": [
                    "Use questions to engage audience",
                    "Include a clear call to action",
                    "Keep tweets under 200 chars for better engagement"
                ]
                },
            # Instagram platform configuration
            "instagram_platform": {
                "name": "Instagram",
                "max_length": 2200,
                "content_type": "social",
                "tone": "engaging",
                "media_support": ["images", "videos", "reels", "stories", "carousels"],
                "format_guidelines": "Use visually appealing images or videos. Write concise, engaging captions. Use emojis and hashtags strategically.",
                "hashtag_usage": "5-10 relevant hashtags, placed at the end of the caption or in the first comment.",
                "active": True,
                "priority": 2,
                "best_practices": [
                    "Start with a hook or question to grab attention",
                    "Include a clear call to action (e.g., 'Follow for more', 'Tag a friend')",
                    "Use line breaks and emojis for readability",
                    "Tag relevant accounts and locations",
                    "Maintain brand voice and visual consistency"
                ]
            },
            "facebook_platform": {
                "name": "Facebook",
                "max_length": 63206,
                "content_type": "social",
                "tone": "friendly",
                "media_support": ["images", "videos", "links", "events", "polls"],
                "format_guidelines": "Write clear, conversational posts. Use images or videos to increase engagement. Include links when relevant.",
                "hashtag_usage": "1-3 relevant hashtags, placed within the post or at the end.",
                "active": True,
                "priority": 1,
                "best_practices": [
                    "Ask questions to encourage comments",
                    "Include a call to action (e.g., 'Share your thoughts', 'Visit our website')",
                    "Use short paragraphs for readability",
                    "Tag pages or people when appropriate",
                    "Post at optimal times for your audience"
                ]
            },
            "blog": {
                "name": "Blog",
                "max_length": 5000,
                "content_type": "long_form",
                "tone": "authoritative",
                "media_support": ["images", "videos", "embeds", "tables"],
                "format_guidelines": "Use headings, subheadings, bullet points. Include intro and conclusion.",
                "hashtag_usage": "Not applicable for body content, optional for meta tags",
                "best_practices": [
                    "Include a compelling headline",
                    "Break text into scannable sections",
                    "End with clear next steps or call to action",
                    "Aim for 1500-2000 words for SEO-optimized content"
                ]
                }
        }
    tool_context.state[STATE_PLATFORMS] = default_platforms
    return {"platforms": default_platforms}
    
    # try:
    #     print(f"  [Tool Call] Retrieving platforms from Firebase")
        
    #     # Initialize Firestore client
    #     db = firestore.Client()
        
    #     # Get platforms from Firestore
    #     platforms_ref = db.collection('platforms').get()
    #     platforms = {doc.id: doc.to_dict() for doc in platforms_ref}
        
    #     # Store platforms in the agent state
    #     tool_context.state[STATE_PLATFORMS] = platforms
    #     print(f"Platforms fetched and stored in state: {platforms}")
        
        
    #     return {"platforms": platforms}
    # except Exception as e:
    #     print(f"Error retrieving platforms: {str(e)}")
    #     # Return default platforms as fallback
    #     default_platforms = {
    #         "twitter": {"max_length": 280, "content_type": "social"},
    #         "instagram": {"max_length": 2200, "content_type": "social"},
    #         "blog": {"max_length": 5000, "content_type": "long_form"}
    #     }
    #     tool_context.state[STATE_PLATFORMS] = default_platforms
    #     return {"platforms": default_platforms, "error": str(e)}


platform_retrieval_agent = LlmAgent(
    name="PlatformRetrievalAgent",
    model=GEMINI_MODEL,
    instruction="Retrieve the available content platforms for this marketing campaign.",
    description="Fetches available platforms from Firebase",
    tools=[get_platforms_from_firebase],
    # No output_key needed as the tool stores data directly in state
)

DYNAMIC_COPYWRITER_PROMPT = """
You are an expert marketing copywriter. Create compelling content based on the SEO research provided.

Available platforms: {platforms}

{original_prompt}
"""

# 1. CopywriterAgent - creates initial draft based on SEO content (keep as is)
copywriter_agent = LlmAgent(
    name="CopywriterAgent",
    model=GEMINI_MODEL,
    instruction=lambda ctx: DYNAMIC_COPYWRITER_PROMPT.format(
        platforms=json.dumps(ctx.state.get(STATE_PLATFORMS, {}), indent=2),
        original_prompt=COPYWRITER_PROMPT
    ),
    description="Creates initial marketing copy draft from SEO content",
    output_key=STATE_CURRENT_DOC,  # Changed to use the standard state key
)

# 2. Critic Agent - combines compliance and persona evaluation into a single critic
critic_agent = LlmAgent(
    name="CriticAgent",
    model=GEMINI_MODEL,
    instruction=CRITIC_PROMPT.format(COMPLETION_PHRASE=COMPLETION_PHRASE),
    description="Reviews marketing copy for compliance issues and customer appeal",
    output_key=STATE_CRITICISM
)

STATE_STRUCTURED_OUTPUT = "structured_output"
formatter_agent = LlmAgent(
    name="ContentFormatterAgent",
    model=GEMINI_MODEL,
    instruction=FORMATTER_PROMPT,
    description="Structures marketing content into platform-specific formats",
    output_key=STATE_STRUCTURED_OUTPUT,
    output_schema=ContentStructure  # Convert Pydantic schema to JSON schema
)

# 3. Refiner Agent - improves content based on criticism or exits loop
refiner_agent = LlmAgent(
    name="RefinerAgent",
    model=GEMINI_MODEL,
    instruction=REFINER_PROMPT.format(
        COMPLETION_PHRASE=COMPLETION_PHRASE),
    description="Refines marketing content based on criticism or finalizes if requirements are met",
    tools=[exit_loop],
    output_key=STATE_CURRENT_DOC
)

# 4. Create the refinement loop with critic and refiner
content_refinement_loop = LoopAgent(
    name="ContentRefinementLoop",
    sub_agents=[
        platform_retrieval_agent,  # First retrieves available platforms
        copywriter_agent,  # First creates the initial content
        critic_agent,      # Then reviews it
        refiner_agent,      # Then refines it or exits the loop
        formatter_agent    # Finally formats the content for each platform
    ],
    max_iterations=5,  # Allow multiple refinement cycles if needed
    description="Iteratively refines marketing content until it meets compliance and customer requirements",

)