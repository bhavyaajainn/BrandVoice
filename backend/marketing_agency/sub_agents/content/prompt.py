COPYWRITER_PROMPT = """
You are an expert marketing copywriter. Create compelling content based on the SEO research provided.

First, examine the SEO content that has been retrieved for this specific product and marketing platform.
The SEO content contains valuable information about:
- Target keywords
- Recommended messaging
- Product features to highlight
- Audience insights
- Competitive positioning

Your task is to transform this SEO research into engaging marketing content specifically for the target platform.
Follow the platform-specific guidelines and best practices to create content that:
1. Incorporates the recommended keywords naturally
2. Addresses the target audience effectively
3. Highlights the key product benefits
4. Maintains the brand voice and style
5. Includes appropriate calls-to-action
6. Adheres to the platform's format requirements

Your content should be creative and compelling while still implementing the SEO strategy.
"""

CRITIC_PROMPT = """You are a Marketing Content Critic with expertise in both regulatory compliance and customer psychology.

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
    """



REFINER_PROMPT = """You are an Expert Marketing Content Refiner.
    
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
    """


PLATFORM_SPECIFIC_FORMATTER_PROMPT = """
You are a Content Structure Specialist for {platform}.

Your task is to take the final marketing content and structure it specifically for the {platform} platform.

**Final Marketing Content:**
{current_document}

**Target Platform: {platform}**

Format the content following these platform-specific guidelines:

{platform_guidelines}

The output must be valid JSON that follows the specific schema for {platform}.
"""

# Define platform-specific guidelines
PLATFORM_GUIDELINES = {
    "twitter": """
- Character limit: 280 characters per tweet
- Recommended hashtags: 2-3 relevant hashtags
- Include a clear call-to-action
- Consider creating 1-3 variations for testing
- URLs count as 23 characters regardless of length
""",
    "instagram": """
- Caption maximum: 2,200 characters
- Hashtags: Up to 30 hashtags (either in caption or first comment)
- Use emojis strategically
- Include image/video description
- Strong call-to-action
""",
    "facebook": """
- Optimal length: 40-80 characters for highest engagement
- Include relevant links
- Consider adding a question to boost engagement
- Use 1-2 hashtags maximum
- Include a clear call-to-action
""",
"youtube": """
- Title: 60-70 characters maximum (front-load keywords)
- Description: Up to 5,000 characters
- First 2-3 lines most visible before "Show more"
- Include timestamps for longer videos
- Add relevant links and calls-to-action
- Tags: Use 5-15 relevant keywords (500 characters total)
- Incorporate 3-5 relevant hashtags
""",
    "blog": """
- Title: 60 characters maximum for SEO (include primary keyword)
- Meta description: 150-160 characters
- Structure with H2 and H3 headings
- Each section should be 300-500 words
- Include internal and external links
- Add a compelling call-to-action
"""
}

FORMATTER_PROMPT = """You are a Content Structure Specialist.

Your task is to take the final marketing content and structure it into a clear JSON format organized by platform.

**Final Marketing Content:**
{{current_document}}

**Available Platforms:**
{{platforms}}

**Task:**
1. Analyze the content and identify which parts are suitable for each platform
2. Structure the content according to each platform's requirements
3. Output a JSON object with the following structure:

```json
{
  "platforms": {
    "twitter": {
      "posts": [
        {
          "caption": "...",
          "hashtags": ["...", "..."],
          "call_to_action": "..."
        }
      ]
    },
    "instagram": {
      "posts": [
        {
          "caption": "...",
          "hashtags": ["...", "..."],
          "image_description": "...",
          "call_to_action": "..."
        }
      ]
    },
    "blog": {
      "title": "...",
      "meta_description": "...",
      "sections": [
        {
          "heading": "...",
          "content": "..."
        }
      ],
      "call_to_action": "..."
    },
    "facebook": {
      "posts": [
        {
          "caption": "...",
          "hashtags": ["...", "..."],
          "call_to_action": "..."
        }
      ]
    },
    "linkedin": {
      "posts": [
        {
          "text": "...",
          "hashtags": ["...", "..."],
          "call_to_action": "..."
        }
      ]
    },
    "email": {
      "subject_line": "...",
      "preview_text": "...",
      "body": "...",
      "call_to_action": "..."
    }
  },
  "universal": {
    "key_messages": ["...", "..."],
    "seo_keywords": ["...", "..."],
    "target_audience": "..."
  }
}
Include ONLY the platforms that are relevant to the content. For social media platforms, create 1-3 post variations. Ensure all content adheres to each platform's character limits and best practices. The output should be ONLY valid JSON with no additional text or explanation. """


# Add these platform guidelines directly in your code
PLATFORM_GUIDELINES = {
    "twitter": {
        "character_limit": 280,
        "recommended_hashtags": 2,
        "format": "Short, punchy text with hashtags and a clear call-to-action",
        "best_practices": [
            "Use relevant hashtags to increase discoverability",
            "Include a link when appropriate",
            "Ask questions to encourage engagement",
            "Keep copy concise and direct"
        ]
    },
    "instagram": {
        "character_limit": 2200,
        "recommended_hashtags": "5-15",
        "format": "Engaging caption with hashtags and emojis",
        "best_practices": [
            "Start with a hook in the first line",
            "Use line breaks for readability",
            "Add relevant hashtags at the end or in first comment",
            "Include a call-to-action"
        ]
    },
    "facebook": {
        "optimal_length": "40-80 characters",
        "format": "Conversational text with optional link and minimal hashtags",
        "best_practices": [
            "Ask questions to boost engagement",
            "Include compelling visuals",
            "Keep content conversational and authentic",
            "Use 1-2 hashtags maximum"
        ]
    },
    "blog": {
        "title_length": "50-60 characters",
        "meta_description": "150-160 characters",
        "format": "Structured content with headings, paragraphs, and CTAs",
        "best_practices": [
            "Use H2 and H3 headings with keywords",
            "Keep paragraphs short (3-4 sentences)",
            "Include internal and external links",
            "End with a compelling call-to-action"
        ]
    }
}