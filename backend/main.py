from google.adk.agents.sequential_agent import SequentialAgent
from google.adk.agents.llm_agent import LlmAgent
from google.genai import types
from google.adk.sessions import InMemorySessionService
from google.adk.runners import Runner
from google.adk.tools import google_search

import google.generativeai as genai
import os
import dotenv

dotenv.load_dotenv()
api_key = os.getenv('GOOGLE_API_KEY')
genai.configure(api_key=api_key)

APP_NAME = "code_pipeline_app"
USER_ID = "dev_user_01"
SESSION_ID = "pipeline_session_01"
GEMINI_MODEL = "gemini-2.0-flash"

# 1. Define Sub-Agents 
# ---------------------------

from typing import List, Dict, Optional
from pydantic import BaseModel

# Define the schema for the output
class CompetitorAnalysis(BaseModel):
    name: str
    marketing_strategy: str

# Define a fixed structure for competitors
class CompetitorsList(BaseModel):
    competitor_1: CompetitorAnalysis
    competitor_2: CompetitorAnalysis

class BrandAnalysis(BaseModel):
    brand_name: str
    marketing_strategy: str
    product_analysis: str
    region_analysis: str

class MarketingRecommendations(BaseModel):
    overall_strategy: str
    regional_adaptations: str

class MarketingAnalysisSchema(BaseModel):
    brand_analysis: BrandAnalysis
    competitor_analysis: CompetitorsList
    marketing_recommendations: MarketingRecommendations

# Researcher Agent - uses Google Search but doesn't enforce schema
research_agent = LlmAgent(
    name="ResearchAgent",
    model=GEMINI_MODEL,
    instruction="""
        You are a marketing research agent.
        Your goal is to provide comprehensive marketing research for a given brand, product, and region.
        Use the `google_search` tool to gather information about:
        1. The brand's marketing strategies
        2. The product's market position
        3. The specified region's market characteristics
        4. Key competitors and their marketing strategies
        
        Collect as much relevant information as possible. Do not format your output in any special way.
        Simply provide all the research information in a detailed, organized manner.
    """,
    description="Gathers marketing research using Google Search.",
    output_key="raw_research_data",
    tools=[google_search],
)

# Formatter Agent - enforces schema but doesn't use tools
formatter_agent = LlmAgent(
    name="FormatterAgent",
    model=GEMINI_MODEL,
    instruction="""
        You are a data formatting agent.
        Your task is to take the raw research data provided in the session state under the key 'raw_research_data'
        and format it according to a specific JSON structure.
        
        You must extract all relevant information and organize it precisely according to the schema.
    """,
    description="Formats research data according to a specific schema.",
    output_key="topic_research_items",
    output_schema=MarketingAnalysisSchema
)

seo_agent = LlmAgent(
    name="SEOAgent",
    model=GEMINI_MODEL,
    instruction="""
    You are an SEO specialist agent.
    Your task is to take the marketing analysis data provided in the session state under the key 'topic_research_items'
    and generate search-optimized phrases and content ideas for various marketing channels.
    
    Based on the brand analysis, competitor strategies, and marketing recommendations, create:
    
    1. KEYWORDS: A list of 10-15 high-value SEO keywords related to the brand and product
    
    2. SOCIAL MEDIA: 5 engaging social media post templates optimized for different platforms (Twitter, Instagram, LinkedIn)
    
    3. BLOG IDEAS: 5 blog post titles with SEO-friendly structures
    
    4. VIDEO CONTENT: 5 YouTube video title and description pairs that would rank well
    
    5. AD COPY: 3-5 compelling ad headlines and descriptions for PPC campaigns
    
    For each item, focus on:
    - Including relevant keywords naturally
    - Maintaining the brand voice
    - Addressing customer pain points
    - Differentiating from competitors
    - Regional considerations when applicable
    
    Structure your response clearly with sections for each content type.
    """,
    description="Generates SEO-optimized content based on marketing analysis.",
    output_key="seo_content",
)

# Paragraph Writer Agent - same as before
paragraph_writer_agent = LlmAgent(
    name="ParagraphWriterAgent",
    model=GEMINI_MODEL,
    instruction="""
    You are a Paragraph Writer AI.
    You write a paragraph based on the information provided in the session state under the key 'topic_research_items'.
    You should write a paragraph that summarizes the information in a clear and concise manner.
    The paragraph should be well-structured and easy to read.
    The paragraph should be written in a formal tone and should be free of grammatical errors.
    The paragraph should be written in English.
    The paragraph should be no more than 5 sentences long.
    """,
    description="Generates a paragraph based on the research results.",
    output_key="paragraph",
)


from google.adk.agents.loop_agent import LoopAgent




from google.adk.tools.tool_context import ToolContext

# Define a custom exit_loop tool
def exit_loop(tool_context: ToolContext):
    """Call this function ONLY when the critique indicates no further changes are needed, signaling the iterative process should end."""
    print(f"  [Tool Call] exit_loop triggered by {tool_context.agent_name}")
    tool_context.actions.escalate = True
    # Return empty dict as tools should typically return JSON-serializable output
    return {}

# Create exit_loop tool instance


# Define exit condition
COMPLETION_PHRASE = "CONTENT MEETS REQUIREMENTS"
STATE_CURRENT_DOC = "current_document"
STATE_CRITICISM = "criticism"

# Create exit_loop tool


# 1. CopywriterAgent - creates initial draft based on SEO content (keep as is)
copywriter_agent = LlmAgent(
    name="CopywriterAgent",
    model=GEMINI_MODEL,
    instruction="""
    You are an expert copywriter with a talent for creating compelling marketing content.
    
    Your task is to take the SEO content suggestions provided in the session state under the key 'seo_content'
    and create a polished first draft of marketing copy that incorporates the SEO keywords naturally
    while maintaining a compelling brand voice.
    
    Create content that:
    - Uses the SEO keywords and content ideas effectively
    - Maintains the brand's established tone and positioning
    - Appeals to the target audience in the specified region
    - Differentiates from competitors
    - Is concise, persuasive, and action-oriented
    
    Your output should include:
    1. A headline or title
    2. Main copy (150-300 words)
    3. A compelling call-to-action
    
    This is a first draft that will be reviewed by compliance and customer persona experts,
    so focus on creativity and impact rather than technical details.
    """,
    description="Creates initial marketing copy draft from SEO content",
    output_key=STATE_CURRENT_DOC,  # Changed to use the standard state key
)

# 2. Critic Agent - combines compliance and persona evaluation into a single critic
critic_agent = LlmAgent(
    name="CriticAgent",
    model=GEMINI_MODEL,
    instruction=f"""You are a Marketing Content Critic with expertise in both regulatory compliance and customer psychology.

    **Marketing Content to Review:**
    {{current_document}}

    **Task:**
    Review the marketing content from two critical perspectives:

    1. COMPLIANCE PERSPECTIVE:
       - Check for legal marketing standards and potential false claims
       - Identify regulatory issues specific to the industry
       - Verify brand voice consistency
       - Ensure ethical marketing practices
       - Check if appropriate disclaimers are needed

    2. CUSTOMER PERSPECTIVE:
       - Evaluate how well it resonates with the target demographic
       - Assess if it addresses key customer pain points and desires
       - Check if tone and language are appropriate for the audience
       - Determine if it effectively motivates customer action

    IF you identify clear issues or improvements needed in either area:
      Provide specific, actionable feedback, listing the most important 2-3 issues to fix.

    ELSE IF the content meets all critical requirements for both compliance and customer appeal:
      Respond *exactly* with the phrase "{COMPLETION_PHRASE}" and nothing else.

    Focus on critical issues, not minor stylistic preferences. Be constructive but thorough.
    """,
    description="Reviews marketing copy for compliance issues and customer appeal",
    output_key=STATE_CRITICISM
)

# 3. Refiner Agent - improves content based on criticism or exits loop
refiner_agent = LlmAgent(
    name="RefinerAgent",
    model=GEMINI_MODEL,
    instruction=f"""You are an Expert Marketing Content Refiner.
    
    **Current Marketing Content:**
    {{current_document}}
    
    **Critique/Suggestions:**
    {{criticism}}

    **Task:**
    Analyze the critique of the marketing content.
    
    IF the critique is *exactly* "{COMPLETION_PHRASE}":
      You MUST call the 'exit_loop' function to finalize the content. Do not output any text.
    
    ELSE (the critique contains actionable feedback):
      Carefully apply the suggestions to improve the marketing content while preserving:
      - The original structure (headline, main copy, call-to-action)
      - SEO keywords and brand positioning
      - The core message and value proposition
      
      Output only the revised marketing content with no additional explanations.

    Make thoughtful, substantive improvements based on the critique while maintaining what works.
    """,
    description="Refines marketing content based on criticism or finalizes if requirements are met",
    tools=[exit_loop],
    output_key=STATE_CURRENT_DOC
)

# 4. Create the refinement loop with critic and refiner
content_refinement_loop = LoopAgent(
    name="ContentRefinementLoop",
    sub_agents=[
        copywriter_agent,  # First creates the initial content
        critic_agent,      # Then reviews it
        refiner_agent      # Then refines it or exits the loop
    ],
    max_iterations=5,  # Allow multiple refinement cycles if needed
    description="Iteratively refines marketing content until it meets compliance and customer requirements",

)

# Update the main pipeline to include the content refinement loop
code_pipeline_agent = SequentialAgent(
    name="CodePipelineAgent",
    sub_agents=[research_agent, formatter_agent, seo_agent, content_refinement_loop, paragraph_writer_agent],
)
# 2. Create the SequentialAgent

# Session and Runner
session_service = InMemorySessionService()
session = session_service.create_session(app_name=APP_NAME, user_id=USER_ID, session_id=SESSION_ID)
runner = Runner(agent=code_pipeline_agent, app_name=APP_NAME, session_service=session_service)


# Agent Interaction
def call_agent(query):
    content = types.Content(role='user', parts=[types.Part(text=query)])
    events = runner.run(user_id=USER_ID, session_id=SESSION_ID, new_message=content)
    
    for event in events:
        if event.is_final_response():
            final_response = event.content.parts[0].text
            print("Agent Response: ", final_response)

# call_agent("Analyse the brand Tesla")

# ... existing imports and agent definitions ...

import argparse
import json
from typing import Optional

def create_marketing_analysis_cli():
    """Create a command-line interface for the marketing analysis tool."""
    parser = argparse.ArgumentParser(
        description="BrandVoice: Generate comprehensive marketing analysis and strategy for brands and products."
    )
    
    parser.add_argument(
        "brand", 
        type=str, 
        help="The brand name to analyze (e.g., 'Nike', 'Apple')"
    )
    
    parser.add_argument(
        "--product", 
        type=str, 
        help="Specific product to analyze (e.g., 'Air Jordan', 'iPhone 15')"
    )
    
    parser.add_argument(
        "--region", 
        type=str, 
        default="Global", 
        help="Target region for marketing (e.g., 'North America', 'Europe', 'Asia')"
    )
    
    parser.add_argument(
        "--json", 
        action="store_true", 
        help="Output the full analysis in JSON format"
    )
    
    parser.add_argument(
        "--summary-only", 
        action="store_true", 
        help="Output only the summary paragraph"
    )
    
    return parser

def format_query(brand: str, product: Optional[str] = None, region: str = "Global") -> str:
    """Format the query string based on inputs."""
    if product:
        return f"Analyze the brand {brand} and its product {product} for marketing in the {region} region."
    else:
        return f"Analyze the brand {brand} for marketing in the {region} region."

def run_analysis(brand: str, product: Optional[str] = None, region: str = "Global", json_output: bool = False, summary_only: bool = False):
    """Run the marketing analysis and output results based on preferences."""
    query = format_query(brand, product, region)
    
    # Reset session to ensure fresh analysis
    session_service.create_session(app_name=APP_NAME, user_id=USER_ID, session_id=SESSION_ID)
    
    content = types.Content(role='user', parts=[types.Part(text=query)])
    events = runner.run(user_id=USER_ID, session_id=SESSION_ID, new_message=content)
    
    # Track responses for different stages
    research_data = None
    formatted_data = None
    summary = None
    
    for event in events:
        if event.is_final_response():
            summary = event.content.parts[0].text
            
        # Optional: capture intermediate responses if needed
        elif hasattr(event, 'agent_name') and event.agent_name == "FormatterAgent":
            try:
                formatted_data = json.loads(event.content.parts[0].text)
            except:
                formatted_data = event.content.parts[0].text
    
    # Output based on user preferences
    if summary_only:
        print("\n=== MARKETING SUMMARY ===")
        print(summary)
    elif json_output and formatted_data:
        print(json.dumps(formatted_data, indent=2))
    else:
        # Full report with both structured data and summary
        print(f"\n=== MARKETING ANALYSIS: {brand.upper()} ===")
        if product:
            print(f"Product: {product}")
        print(f"Region: {region}")
        print("\n=== DETAILED ANALYSIS ===")
        
        # Try to access formatted data as structured content
        if formatted_data and isinstance(formatted_data, dict):
            try:
                # Brand Analysis
                brand_analysis = formatted_data.get("brand_analysis", {})
                print("\n--- BRAND ANALYSIS ---")
                print(f"Brand Name: {brand_analysis.get('brand_name', brand)}")
                print(f"Marketing Strategy: {brand_analysis.get('marketing_strategy', 'N/A')}")
                print(f"Product Analysis: {brand_analysis.get('product_analysis', 'N/A')}")
                print(f"Region Analysis: {brand_analysis.get('region_analysis', 'N/A')}")
                
                # Competitor Analysis
                print("\n--- COMPETITOR ANALYSIS ---")
                competitors = formatted_data.get("competitor_analysis", {})
                for comp_key, comp_data in competitors.items():
                    if isinstance(comp_data, dict):
                        print(f"\nCompetitor: {comp_data.get('name', comp_key)}")
                        print(f"Strategy: {comp_data.get('marketing_strategy', 'N/A')}")
                
                # Recommendations
                recommendations = formatted_data.get("marketing_recommendations", {})
                print("\n--- MARKETING RECOMMENDATIONS ---")
                print(f"Overall Strategy: {recommendations.get('overall_strategy', 'N/A')}")
                print(f"Regional Adaptations: {recommendations.get('regional_adaptations', 'N/A')}")
            except Exception as e:
                print(f"Error parsing structured data: {e}")
                print(formatted_data)
        else:
            print(formatted_data)
            
        print("\n=== SUMMARY ===")
        print(summary)

def print_session_state():
    """Print the current contents of the session state for debugging."""
    try:
        # Retrieve the session to inspect its state
        current_session = session_service.get_session(
            app_name=APP_NAME, 
            user_id=USER_ID, 
            session_id=SESSION_ID
        )
        
        # Access the state dictionary
        state_dict = current_session.state.dict
        
        print("\n=== CURRENT SESSION STATE ===")
        for key, value in state_dict.items():
            # Handle large values by truncating
            if isinstance(value, str) and len(value) > 500:
                print(f"{key}: {value[:500]}... [truncated]")
            else:
                print(f"{key}: {value}")
        print("============================\n")
    except Exception as e:
        print(f"Error accessing session state: {e}")

if __name__ == "__main__":
    parser = create_marketing_analysis_cli()
    args = parser.parse_args()

    query= format_query(args.brand, args.product, args.region)
    
    call_agent(query)

    # run_analysis(
    #     brand=args.brand,
    #     product=args.product,
    #     region=args.region,
    #     json_output=args.json,
    #     summary_only=args.summary_only
    # )
