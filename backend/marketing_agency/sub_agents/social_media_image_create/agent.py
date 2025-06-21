"""social_media_image_agent: for creating platform-specific social media images"""

import os
from typing import Dict, Any, Optional

from dotenv import load_dotenv
from google.cloud import storage
from google.adk import Agent
from google.adk.tools import ToolContext, load_artifacts
from google.genai import Client, types
from google.adk.agents import SequentialAgent


# MODEL = "gemini-2.5-pro-preview-05-06" 
MODEL = "gemini-2.0-flash"
MODEL_IMAGE = "imagen-3.0-generate-002"

load_dotenv()

storage_client = storage.Client()
BUCKET_NAME = "brandvoice-images"


from firebase_utils import db
import logging

logger = logging.getLogger(__name__)


client = Client(
    vertexai=True,
    project=os.getenv("GOOGLE_CLOUD_PROJECT"),
    location=os.getenv("GOOGLE_CLOUD_LOCATION"),
)

try:
    bucket = storage_client.get_bucket(BUCKET_NAME)
except Exception:
    print(f"Bucket {BUCKET_NAME} not found, creating it...")
    bucket = storage_client.create_bucket(BUCKET_NAME)
    # Set the bucket to allow public access
    bucket.iam_configuration.public_access_prevention = "unspecified"
    bucket.patch()


# Platform-specific aspect ratios and specs
PLATFORM_SPECS = {
    "instagram": {
        "aspect_ratio": "16:9",  # Square for feed posts
        "dimensions": "1080x1080",
        "style_guide": "vibrant, high-contrast, visually striking images with room for text overlay"
    },
    "instagram_story": {
        "aspect_ratio": "9:16",  # Vertical for stories
        "dimensions": "1080x1920",
        "style_guide": "vertical composition with key elements centered"
    },
    "twitter": {
        "aspect_ratio": "16:9",  # Landscape for Twitter
        "dimensions": "1200x675",
        "style_guide": "clear, simple visuals that work at smaller sizes"
    },
    "facebook": {
        "aspect_ratio": "1.91:1",  # Facebook recommended
        "dimensions": "1200x630",
        "style_guide": "vibrant images that work well with text overlay"
    },
    "linkedin": {
        "aspect_ratio": "1.91:1",  # Similar to Facebook
        "dimensions": "1200x627",
        "style_guide": "professional-looking images that complement business content"
    }
}


def get_content_from_database(tool_context: ToolContext, product_id: str, platform: str) -> Dict[str, Any]:
    """Retrieve marketing content for a specific product and platform.
    
    Args:
        tool_context: Tool context for state management
        product_id: The unique identifier of the product
        platform: The marketing platform to retrieve content for
        
    Returns:
        Dictionary containing marketing content and associated metadata
    """
    try:
        print(f"  [Tool Call] Retrieving marketing content for product {product_id}, platform {platform}")
        
        # Get a reference to the product document
        product_ref = db.collection('products').document(product_id)
        product_doc = product_ref.get()
        
        if not product_doc.exists:
            error_msg = f"No product found with ID: {product_id}"
            logger.error(error_msg)
            tool_context.state["error"] = error_msg
            return {"error": error_msg}
            
        product_data = product_doc.to_dict()
        
        # Check if marketing content exists for this product
        if 'marketing_content' not in product_data:
            error_msg = f"No marketing content found for product {product_id}"
            logger.warning(error_msg)
            tool_context.state["error"] = error_msg
            return {"error": error_msg}
            
        # Check if the specific platform exists in the marketing content
        if platform not in product_data['marketing_content']:
            error_msg = f"No marketing content found for platform {platform}"
            logger.warning(error_msg)
            tool_context.state["error"] = error_msg
            return {"error": error_msg}
            
        # Store the marketing content in the agent state
        marketing_content = product_data['marketing_content'][platform]
        tool_context.state["marketing_content"] = marketing_content
        tool_context.state["product_id"] = product_id
        tool_context.state["platform"] = platform
        
        # Also fetch product details for richer context
        tool_context.state["product_name"] = product_data.get("product_name", "")
        tool_context.state["product_description"] = product_data.get("product_description", "")
        
        # Fetch brand info if available
        brand_id = product_data.get('brand_id')
        if brand_id:
            from firebase_utils import get_brand_profile_by_id
            brand_profile = get_brand_profile_by_id(brand_id)
            if brand_profile:
                tool_context.state["brand_info"] = brand_profile
                tool_context.state["brand_name"] = brand_profile.get("brand_name", "")
                tool_context.state["brand_colors"] = brand_profile.get("brand_colors", [])
                tool_context.state["brand_tone"] = brand_profile.get("brand_tone", "")
                
        return {
            "product_id": product_id,
            "platform": platform,
            "marketing_content": marketing_content,
            "product_name": tool_context.state.get("product_name", ""),
            "brand_name": tool_context.state.get("brand_name", ""),
            "brand_colors": tool_context.state.get("brand_colors", []),
            "brand_tone": tool_context.state.get("brand_tone", "")
        }
    except Exception as e:
        error_msg = f"Error retrieving marketing content: {str(e)}"
        logger.error(error_msg)
        tool_context.state["error"] = error_msg
        return {"error": error_msg}

def formulate_media_prompt(tool_context: ToolContext, media_type: str = "image") -> Dict[str, Any]:
    """Formulates an optimal prompt for media generation based on the content and media type.
    
    Args:
        tool_context: Tool context containing state with marketing content
        media_type: Type of media to generate (image, video, carousel)
        
    Returns:
        Dictionary containing the formulated prompt and metadata
    """
    try:
        # Check if we have marketing content in the state
        if "marketing_content" not in tool_context.state:
            return {"error": "No marketing content available in state. Run get_content_from_database first."}
            
        marketing_content = tool_context.state["marketing_content"]
        platform = tool_context.state.get("platform", "instagram")  # Default to Instagram if not specified
        product_id = tool_context.state.get("product_id", "")
        product_name = tool_context.state.get("product_name", "")
        brand_name = tool_context.state.get("brand_name", "")
        brand_colors = tool_context.state.get("brand_colors", [])
        brand_tone = tool_context.state.get("brand_tone", "")
        
        # Get platform specifications
        specs = PLATFORM_SPECS.get(platform.lower(), PLATFORM_SPECS["instagram"])
        
        # Create a base content summary from the marketing content
        content_summary = marketing_content
        
        # Brand styling information
        brand_styling = ""
        if brand_name:
            brand_styling = f"Brand: {brand_name}"
            if brand_colors:
                color_str = ", ".join(brand_colors)
                brand_styling += f", with brand colors: {color_str}"
            if brand_tone:
                brand_styling += f", using a {brand_tone} tone"
        
        # Formulate different prompts based on media type
        if media_type.lower() == "image":
            prompt = f"""
            Create a {platform} post image with the following specifications:
            - Dimensions: {specs['dimensions']} (aspect ratio {specs['aspect_ratio']})
            - Style: {specs['style_guide']}
            
            The image should visualize this content concept: {content_summary}
            {f"Product: {product_name}" if product_name else ""}
            {brand_styling}
            
            IMPORTANT REQUIREMENTS:
            - DO NOT include ANY text, words, letters, or numbers in the image
            - Create a clean, text-free visual that only uses imagery
            - Focus on creating a compelling visual representation without relying on text
            - {f"The brand identity for '{brand_name}' can be represented through colors or visual elements only" if brand_name else ""}
            - Leave clean space for text to be added separately by the user
            
            Create a professional, marketing-quality image that communicates the message visually without any words.
            The image MUST NOT contain any text, writing, lettering, numbers, or characters of any language or writing system.
            """
            
        elif media_type.lower() == "video":
            prompt = f"""
            Create a {platform} video concept with the following specifications:
            - (aspect ratio {specs['aspect_ratio']})
            - Style: {specs['style_guide']}
            - Length: 8 seconds
            
            The video should visualize this content concept: {content_summary}
            {f"Product: {product_name}" if product_name else ""}
            {brand_styling}
            
            Key scenes to include:
            - Opening that immediately captures attention
            - Clear product/service showcase
            - Closing with strong visual impact
            
            IMPORTANT REQUIREMENTS:
            - Keep any text minimal and impactful
            - Focus on visual storytelling
            - Create a professional, high-quality look
            - Use motion and transitions effectively
            - Design for mobile-first viewing
            """
            
        elif media_type.lower() == "carousel":
            prompt = f"""
            Create a {platform} carousel (multiple slides) with the following specifications:
            - Dimensions: {specs['dimensions']} (aspect ratio {specs['aspect_ratio']})
            - Style: {specs['style_guide']}
            - Number of slides: 3-5
            
            The carousel should present this content concept: {content_summary}
            {f"Product: {product_name}" if product_name else ""}
            {brand_styling}
            
            Structure for the carousel:
            - First slide: Attention-grabbing visual that introduces the topic
            - Middle slides: Key points or features, each with distinct visuals
            - Final slide: Call-to-action or conclusion visual
            
            IMPORTANT REQUIREMENTS:
            - Maintain visual consistency across all slides
            - Each slide should work both individually and as part of the sequence
            - DO NOT include text in the images (text will be added separately)
            - Create a visual flow that encourages swiping to the next slide
            """
        else:
            prompt = f"""
            Create visual content for {platform} that showcases: {content_summary}
            {f"Product: {product_name}" if product_name else ""}
            {brand_styling}
            
            Using specifications:
            - Dimensions: {specs['dimensions']} (aspect ratio {specs['aspect_ratio']})
            - Style: {specs['style_guide']}
            
            IMPORTANT REQUIREMENTS:
            - Focus on professional, marketing-quality visuals
            - DO NOT include text in the images (text will be added separately)
            - Create visuals that align with brand identity
            """
        
        # Save the formulated prompt to the state
        tool_context.state["media_prompt"] = prompt
        tool_context.state["media_type"] = media_type
        
        return {
            "prompt": prompt,
            "media_type": media_type,
            "platform": platform,
            "product_id": product_id,
            "specs_used": specs
        }
        
    except Exception as e:
        error_msg = f"Error formulating media prompt: {str(e)}"
        logger.error(error_msg)
        tool_context.state["error"] = error_msg
        return {"error": error_msg}

# Create the preprocessing agent
PREPROCESSING_PROMPT = """
You are a content preprocessing agent that fetches marketing content from a database and 
formulates optimal prompts for media generation. You'll analyze the marketing content,
understand the platform requirements, and create detailed prompts that can be used by
media generation systems to create high-quality social media assets.

Your tasks include:
1. Fetching content from the database based on product ID and platform
2. Analyzing the content to understand its key messages and themes
3. Formulating detailed prompts for different media types (images, videos, carousels)
4. Ensuring the prompts follow platform-specific requirements and best practices

When a user requests media generation, first gather the necessary content, then create
an appropriate prompt based on the requested media type before passing it to the media
generation agent.
"""

content_preprocessing_agent = Agent(
    model=MODEL,
    name="content_preprocessing_agent",
    description=(
        "An agent that retrieves marketing content and formulates optimal prompts "
        "for social media media generation across different platforms and media types."
    ),
    instruction=PREPROCESSING_PROMPT,
    output_key="preprocessing_output",
    tools=[get_content_from_database, formulate_media_prompt],
)


def get_prompt_refinement_context(tool_context: ToolContext) -> Dict[str, Any]:
    """
    Retrieves all relevant context needed for prompt refinement.
    
    Args:
        tool_context: Tool context containing the preprocessing output
        
    Returns:
        Dictionary containing all context data needed for prompt refinement
    """
    try:
        # Check if preprocessing output exists in the state
        if "preprocessing_output" not in tool_context.state:
            return {"error": "No preprocessing output available. Run content_preprocessing_agent first."}
        
        preprocessing_output = tool_context.state["preprocessing_output"]

        if isinstance(preprocessing_output, str):
            # Try to convert string to dictionary if it's JSON
            try:
                import json
                preprocessing_output = json.loads(preprocessing_output)
            except:
                print("Preprocessing output is not JSON, using as is.")
                # If not JSON, create a simple dictionary with the string as prompt
                preprocessing_output = {
                    "prompt": preprocessing_output,
                    "platform": tool_context.state.get("platform", "instagram"),
                    "product_id": tool_context.state.get("product_id", ""),
                    "media_type": tool_context.state.get("media_type", "image"),
                    "specs_used": PLATFORM_SPECS.get(
                        tool_context.state.get("platform", "instagram").lower(), 
                        PLATFORM_SPECS["instagram"]
                    )
                }
        
        # Extract relevant information from preprocessing output
        base_prompt = preprocessing_output.get("prompt", "")
        platform = preprocessing_output.get("platform", "instagram")
        product_id = preprocessing_output.get("product_id", "")
        media_type = preprocessing_output.get("media_type", "image")
        specs = preprocessing_output.get("specs_used", PLATFORM_SPECS["instagram"])
        
        # Get additional context from tool_context.state
        product_name = tool_context.state.get("product_name", "")
        product_description = tool_context.state.get("product_description", "")
        brand_name = tool_context.state.get("brand_name", "")
        brand_colors = tool_context.state.get("brand_colors", [])
        brand_tone = tool_context.state.get("brand_tone", "")
        marketing_content = tool_context.state.get("marketing_content", {})
        
        # Return all the context data without doing any model calls
        return {
            "base_prompt": base_prompt,
            "platform": platform,
            "product_id": product_id,
            "media_type": media_type,
            "specs": specs,
            "product_name": product_name,
            "product_description": product_description,
            "brand_name": brand_name,
            "brand_colors": brand_colors,
            "brand_tone": brand_tone,
            "marketing_content": marketing_content
        }
        
    except Exception as e:
        error_msg = f"Error retrieving prompt refinement context: {str(e)}"
        logger.error(error_msg)
        tool_context.state["error"] = error_msg
        return {"error": error_msg}

def save_refined_prompt(tool_context: ToolContext, refined_prompt: str) -> Dict[str, Any]:
    """
    Saves the refined prompt created by the agent into the state.
    
    Args:
        tool_context: Tool context for state management
        refined_prompt: The detailed prompt created by the agent
        
    Returns:
        Status dictionary
    """
    try:
        # Add a final reminder about NO TEXT to the prompt if not already present
        if "MUST NOT CONTAIN ANY TEXT" not in refined_prompt.upper():
            refined_prompt += """
            
            IMPORTANT: The image MUST NOT contain any text, writing, lettering, numbers, or characters of any language or writing system.
            Create a professional, marketing-quality image that communicates the message visually without any words.
            """
        
        # Save the refined prompt to the state
        tool_context.state["refined_image_prompt"] = refined_prompt
        
        # Also retrieve necessary metadata to return
        preprocessing_output = tool_context.state.get("preprocessing_output", {})
        # Add type checking
        if isinstance(preprocessing_output, str):
            try:
                import json
                preprocessing_output = json.loads(preprocessing_output)
            except:
                preprocessing_output = {}
        platform = preprocessing_output.get("platform", tool_context.state.get("platform", "instagram"))
        product_id = preprocessing_output.get("product_id", tool_context.state.get("product_id", ""))
        media_type = preprocessing_output.get("media_type", tool_context.state.get("media_type", "image"))
        
        return {
            "status": "success",
            "refined_prompt": refined_prompt,
            "platform": platform,
            "product_id": product_id,
            "media_type": media_type
        }
        
    except Exception as e:
        error_msg = f"Error saving refined prompt: {str(e)}"
        logger.error(error_msg)
        tool_context.state["error"] = error_msg
        return {"error": error_msg}


PROMPT_REFINER_PROMPT = """
You are an expert prompt engineer specializing in crafting detailed, high-quality image generation prompts.

Your task is to examine the preprocessing output and create a richly detailed image prompt that will guide
the image generation system to create stunning, on-brand social media visuals.

WORKFLOW:
1. First, call get_prompt_refinement_context() to retrieve all available context
2. Carefully analyze all the data: product details, brand information, platform specifications, and marketing content
3. Craft an extremely detailed image generation prompt that incorporates:
   - Specific visual scene details (setting, environment, lighting, mood, atmosphere)
   - Clear product presentation instructions (how the product should appear, positioning, focus)
   - Brand aesthetic elements (colors, visual style, emotional tone)
   - Platform-specific requirements (dimensions, aspect ratio, visual style common on that platform)
   - Composition guidance (foreground/background balance, focal points, space for text overlay)

Your prompt should paint a complete visual picture, be highly specific about aesthetics,
and never include instructions to add text (as all images must be text-free).

Use photographic/artistic terminology to specify:
- Lighting quality (soft, dramatic, high-key, low-key)
- Perspective (close-up, wide angle, eye-level, birds-eye)
- Color palette (vibrant, muted, complementary to brand colors)
- Mood/atmosphere (energetic, serene, professional, playful)
- Texture and material qualities
- Compositional structure (rule of thirds, centered, asymmetrical)

When you've crafted the perfect prompt, call save_refined_prompt() with your detailed text.
"""

prompt_refiner_agent = Agent(
    model=MODEL,
    name="prompt_refiner_agent",
    description=(
        "An agent that transforms preprocessing output into richly detailed image prompts "
        "optimized for high-quality, on-brand social media image generation."
    ),
    instruction=PROMPT_REFINER_PROMPT,
    output_key="refined_prompt_output",
    tools=[get_prompt_refinement_context, save_refined_prompt],
)


# def generate_image_from_refined_prompt(tool_context: ToolContext, platform: Optional[str] = None) -> Dict[str, Any]:
#     """Generates a social media image using the refined prompt that was created earlier in the pipeline.
    
#     Args:
#         tool_context: Tool context for saving artifacts
#         platform: Optional platform override (otherwise uses platform from state)
        
#     Returns:
#         Dictionary containing the image generation results
#     """
#     # Get platform from state if not provided
#     if not platform and "platform" in tool_context.state:
#         platform = tool_context.state["platform"]
    
#     # Default platform if still None
#     platform = platform or "instagram"
    
#     # Get product_id from state
#     product_id = tool_context.state.get("product_id", "")
    
#     # Get the refined prompt
#     if "refined_image_prompt" not in tool_context.state:
#         return {
#             "status": "failed", 
#             "error": "No refined prompt found in state. This agent should be run after the prompt_refiner_agent."
#         }
    
#     enhanced_prompt = tool_context.state["refined_image_prompt"]
#     print(f"  [Tool Call] Using refined prompt to generate image for {platform}")
    
#     # Get the platform specs
#     specs = PLATFORM_SPECS.get(platform.lower(), PLATFORM_SPECS["instagram"])
    
#     # Generate the image
#     response = client.models.generate_images(
#         model=MODEL_IMAGE,
#         prompt=enhanced_prompt,
#         config={
#             "number_of_images": 1,
#             "negative_prompt": "text, words, letters, numbers, captions, labels, writing, fonts, characters, typography, overlaid text, embedded text, signature, watermark"
#         },
#     )
    
#     if not response.generated_images:
#         return {"status": "failed", "error": "No images were generated"}
    
#     image_bytes = response.generated_images[0].image.image_bytes
    
#     # Format filename with product_id if available
#     product_segment = f"{product_id}_" if product_id else ""
#     filename = f"{platform.lower()}_{product_segment}image.png"
    
#     tool_context.save_artifact(
#         filename,
#         types.Part.from_bytes(data=image_bytes, mime_type="image/png"),
#     )

#     try:
#         # Get brand name from state if available
#         brand_name = tool_context.state.get("brand_name", "unnamed_brand")
        
#         # Sanitize names for folder structure
#         safe_brand_name = brand_name.lower().replace(" ", "_")
#         safe_product_id = product_id.lower().replace(" ", "_") if product_id else "unspecified_product"
        
#         # Create a path within the bucket: brand/product/platform/filename
#         gcs_path = f"{safe_brand_name}/{safe_product_id}/{platform.lower()}/{filename}"
        
#         # Upload to Google Cloud Storage
#         blob = bucket.blob(gcs_path)
#         blob.upload_from_string(image_bytes, content_type="image/png")
        
#         # Make the blob publicly accessible
#         blob.make_public()
#         public_url = blob.public_url

#         # Save the image URL back to the marketing content in Firebase
#         if product_id and platform:
#             try:
#                 # Get a reference to the product document
#                 product_ref = db.collection('products').document(product_id)
#                 product_doc = product_ref.get()
                
#                 if product_doc.exists:
#                     product_data = product_doc.to_dict()
                    
#                     # Make sure marketing_content exists
#                     if 'marketing_content' not in product_data:
#                         product_data['marketing_content'] = {}
                    
#                     # Make sure platform exists in marketing_content
#                     if platform not in product_data['marketing_content']:
#                         product_data['marketing_content'][platform] = {}
                    
#                     # Add the image URL to the marketing content
#                     product_data['marketing_content'][platform]['image_url'] = public_url
                    
#                     # Update the document
#                     product_ref.update(product_data)
#                     print(f"  [Tool Call] Updated product {product_id} with image URL for {platform}")
#             except Exception as e:
#                 print(f"  [Tool Call] Error updating product with image URL: {str(e)}")
        
#         return {
#             "status": "success",
#             "detail": f"{platform} image generated successfully and stored in bucket.",
#             "filename": filename,
#             "platform": platform,
#             "product_id": product_id,
#             "specs_used": specs,
#             "local_artifact": filename,
#             "gcs_path": gcs_path,
#             "public_url": public_url
#         }
    
#     except Exception as e:
#         return {
#             "status": "partial_success",
#             "detail": f"Image generated but bucket upload failed: {str(e)}",
#             "filename": filename,
#             "platform": platform,
#             "product_id": product_id,
#             "specs_used": specs,
#             "local_artifact": filename
#         }


def generate_image_from_refined_prompt(tool_context: ToolContext, platform: Optional[str] = None) -> Dict[str, Any]:
    """Generates social media content based on the refined prompt and media type.
    
    Args:
        tool_context: Tool context for saving artifacts
        platform: Optional platform override (otherwise uses platform from state)
        
    Returns:
        Dictionary containing the generation results
    """
    # Get platform from state if not provided
    if not platform and "platform" in tool_context.state:
        platform = tool_context.state["platform"]
    
    # Default platform if still None
    platform = platform or "instagram"
    
    # Get product_id from state
    product_id = tool_context.state.get("product_id", "")
    
    # Get the refined prompt
    if "refined_image_prompt" not in tool_context.state:
        return {
            "status": "failed", 
            "error": "No refined prompt found in state. This agent should be run after the prompt_refiner_agent."
        }
    
    enhanced_prompt = tool_context.state["refined_image_prompt"]
    print(f"  [Tool Call] Using refined prompt to generate content for {platform}")
    
    # Get the platform specs
    specs = PLATFORM_SPECS.get(platform.lower(), PLATFORM_SPECS["instagram"])
    
    # Get media_type from state
    media_type = tool_context.state.get("media_type", "image").lower()
    
    # Get brand name from state if available
    brand_name = tool_context.state.get("brand_name", "unnamed_brand")
    
    # Sanitize names for folder structure
    safe_brand_name = brand_name.lower().replace(" ", "_")
    safe_product_id = product_id.lower().replace(" ", "_") if product_id else "unspecified_product"
    
    # Handle different media types
    if media_type == "image":
        # Generate a single image
        return generate_single_image(tool_context, enhanced_prompt, platform, product_id, 
                                    safe_brand_name, safe_product_id, specs)
    
    elif media_type == "carousel":
        # Generate multiple images for carousel
        return generate_carousel_images(tool_context, enhanced_prompt, platform, product_id, 
                                      safe_brand_name, safe_product_id, specs)
    
    elif media_type in ["video", "shorts"]:
        # Generate a video
        return generate_video_content(tool_context, enhanced_prompt, platform, product_id, 
                                     safe_brand_name, safe_product_id, specs)
    
    else:
        return {"status": "failed", "error": f"Unsupported media_type: {media_type}"}


def generate_single_image(tool_context, enhanced_prompt, platform, product_id, 
                         safe_brand_name, safe_product_id, specs):
    """Generates a single image and saves it to GCS bucket."""
    response = client.models.generate_images(
        model=MODEL_IMAGE,
        prompt=enhanced_prompt,
        config={
            "number_of_images": 1,
            "negative_prompt": "text, words, letters, numbers, captions, labels, writing, fonts, characters, typography, overlaid text, embedded text, signature, watermark"
        },
    )
    
    if not response.generated_images:
        return {"status": "failed", "error": "No images were generated"}
    
    image_bytes = response.generated_images[0].image.image_bytes
    
    # Format filename with product_id if available
    product_segment = f"{product_id}_" if product_id else ""
    filename = f"{platform.lower()}_{product_segment}image.png"
    
    tool_context.save_artifact(
        filename,
        types.Part.from_bytes(data=image_bytes, mime_type="image/png"),
    )

    try:
        # Create a path within the bucket: brand/product/platform/filename
        gcs_path = f"{safe_brand_name}/{safe_product_id}/{platform.lower()}/{filename}"
        
        # Upload to Google Cloud Storage
        blob = bucket.blob(gcs_path)
        blob.upload_from_string(image_bytes, content_type="image/png")
        
        # Make the blob publicly accessible
        blob.make_public()
        public_url = blob.public_url

        # Save the image URL back to the marketing content in Firebase
        if product_id and platform:
            try:
                # Get a reference to the product document
                product_ref = db.collection('products').document(product_id)
                product_doc = product_ref.get()
                
                if product_doc.exists:
                    product_data = product_doc.to_dict()
                    
                    # Make sure marketing_content exists
                    if 'marketing_content' not in product_data:
                        product_data['marketing_content'] = {}
                    
                    # Make sure platform exists in marketing_content
                    if platform not in product_data['marketing_content']:
                        product_data['marketing_content'][platform] = {}
                    
                    # Add the image URL to the marketing content
                    product_data['marketing_content'][platform]['image_url'] = public_url
                    
                    # Update the document
                    product_ref.update(product_data)
                    print(f"  [Tool Call] Updated product {product_id} with image URL for {platform}")
            except Exception as e:
                print(f"  [Tool Call] Error updating product with image URL: {str(e)}")
        
        return {
            "status": "success",
            "detail": f"{platform} image generated successfully and stored in bucket.",
            "filename": filename,
            "platform": platform,
            "product_id": product_id,
            "specs_used": specs,
            "local_artifact": filename,
            "gcs_path": gcs_path,
            "public_url": public_url
        }
    
    except Exception as e:
        return {
            "status": "partial_success",
            "detail": f"Image generated but bucket upload failed: {str(e)}",
            "filename": filename,
            "platform": platform,
            "product_id": product_id,
            "specs_used": specs,
            "local_artifact": filename
        }

def generate_carousel_images(tool_context, enhanced_prompt, platform, product_id, 
                            safe_brand_name, safe_product_id, specs):
    """Generates 4 images for a carousel and saves them to GCS bucket."""
    response = client.models.generate_images(
        model=MODEL_IMAGE,
        prompt=enhanced_prompt,
        config={
            "number_of_images": 2,  # Generate 4 images for carousel
            "negative_prompt": "text, words, letters, numbers, captions, labels, writing, fonts, characters, typography, overlaid text, embedded text, signature, watermark"
        },
    )
    
    if not response.generated_images:
        return {"status": "failed", "error": "No images were generated"}
    
    results = []
    image_urls = []
    
    for i, generated_image in enumerate(response.generated_images):
        image_bytes = generated_image.image.image_bytes
        
        # Format filename for carousel image
        product_segment = f"{product_id}_" if product_id else ""
        filename = f"{platform.lower()}_{product_segment}carousel_{i+1}.png"
        
        tool_context.save_artifact(
            filename,
            types.Part.from_bytes(data=image_bytes, mime_type="image/png"),
        )

        try:
            # Create a path within the bucket: brand/product/platform/carousel/filename
            gcs_path = f"{safe_brand_name}/{safe_product_id}/{platform.lower()}/carousel/{filename}"
            
            # Upload to Google Cloud Storage
            blob = bucket.blob(gcs_path)
            blob.upload_from_string(image_bytes, content_type="image/png")
            
            # Make the blob publicly accessible
            blob.make_public()
            public_url = blob.public_url
            
            # Add to the list of URLs
            image_urls.append(public_url)
            
            results.append({
                "filename": filename,
                "gcs_path": gcs_path,
                "public_url": public_url
            })
            
        except Exception as e:
            results.append({
                "status": "failed",
                "error": f"Failed to upload carousel image {i+1}: {str(e)}",
                "filename": filename
            })
    
    # Save all carousel image URLs back to the marketing content in Firebase
    if product_id and platform and image_urls:
        try:
            # Get a reference to the product document
            product_ref = db.collection('products').document(product_id)
            product_doc = product_ref.get()
            
            if product_doc.exists:
                product_data = product_doc.to_dict()
                
                # Make sure marketing_content exists
                if 'marketing_content' not in product_data:
                    product_data['marketing_content'] = {}
                
                # Make sure platform exists in marketing_content
                if platform not in product_data['marketing_content']:
                    product_data['marketing_content'][platform] = {}
                
                # Add the carousel image URLs to the marketing content
                product_data['marketing_content'][platform]['carousel_urls'] = image_urls
                
                # Update the document
                product_ref.update(product_data)
                print(f"  [Tool Call] Updated product {product_id} with carousel URLs for {platform}")
        except Exception as e:
            print(f"  [Tool Call] Error updating product with carousel URLs: {str(e)}")
    
    return {
        "status": "success",
        "detail": f"{platform} carousel with {len(results)} images generated successfully.",
        "platform": platform,
        "product_id": product_id,
        "specs_used": specs,
        "carousel_images": results
    }

# Add at the top with other constants
MODEL_VIDEO = "veo-3.0-generate-preview" # Google's Veo model

import time

def generate_video_content(tool_context, enhanced_prompt, platform, product_id, 
                          safe_brand_name, safe_product_id, specs):
    """Generates a video using Google's Veo model and saves it to GCS bucket."""
    try:
        # Prepare output GCS URI for the video (let's use a temp path)
        gcs_path = f"{safe_brand_name}/{safe_product_id}/{platform.lower()}/"
        output_gcs_uri = f"gs://{BUCKET_NAME}/{gcs_path}{platform.lower()}_{product_id or 'noid'}_video.mp4"

        # Compose prompt and config
        aspect_ratio = specs.get('aspect_ratio', '16:9')
        operation = client.models.generate_videos(
            model=MODEL_VIDEO,
            prompt=enhanced_prompt,
            config={
                "aspect_ratio": aspect_ratio,
                "number_of_videos": 1,
                "output_gcs_uri": output_gcs_uri,
                "negative_prompt": "text, words, letters, numbers, poor quality, blurry"
            },
        )

        # Poll until done
        print("Waiting for video generation operation to complete...")
        while not operation.done:
            time.sleep(15)
            operation = client.operations.get(operation)
            print("Operation status:", operation.done)

        print("DEBUG: operation:", operation)
        if hasattr(operation, "error") and operation.error:
            print("DEBUG: operation.error:", operation.error)
            return {
                "status": "failed",
                "error": f"Video generation operation failed: {operation.error}",
                "platform": platform,
                "product_id": product_id
            }
        

        print("DEBUG: operation.result:", operation.result)
        print("DEBUG: dir(operation.result):", dir(operation.result))
        # ----------------------------------------------

        if hasattr(operation, "result") and hasattr(operation.result, "generated_videos"):
            print("DEBUG: operation.result.generated_videos:", operation.result.generated_videos)
            if operation.result.generated_videos:
                video_uri = operation.result.generated_videos[0].video.uri
            else:
                return {
                    "status": "failed",
                    "error": "operation.result.generated_videos is empty.",
                    "platform": platform,
                    "product_id": product_id
                }
        else:
            return {
                "status": "failed",
                "error": f"No video URI found in operation result. result={operation.result}",
                "platform": platform,
                "product_id": product_id
            }

        # Make the blob public and get the public URL
        from urllib.parse import urlparse

        # Remove 'gs://' and bucket name
        gcs_uri = video_uri
        if gcs_uri.startswith("gs://"):
            parts = gcs_uri[5:].split("/", 1)
            bucket_name = parts[0]
            blob_path = parts[1]
        else:
            raise ValueError(f"Unexpected GCS URI: {gcs_uri}")

        # Get the blob using the actual path
        blob = bucket.blob(blob_path)
        blob.make_public()
        public_url = blob.public_url

        # Save artifact (just the URI, since bytes are not directly available)
        tool_context.save_artifact(
            os.path.basename(blob_path),
            types.Part.from_bytes(data=b"", mime_type="video/mp4"),  # Placeholder, since bytes not available
        )

        if product_id and platform:
            try:
                # Get a reference to the product document
                product_ref = db.collection('products').document(product_id)
                product_doc = product_ref.get()
                
                if product_doc.exists:
                    product_data = product_doc.to_dict()
                    
                    # Make sure marketing_content exists
                    if 'marketing_content' not in product_data:
                        product_data['marketing_content'] = {}
                    
                    # Make sure platform exists in marketing_content
                    if platform not in product_data['marketing_content']:
                        product_data['marketing_content'][platform] = {}
                    
                    # Add the video URL to the marketing content
                    product_data['marketing_content'][platform]['video_url'] = public_url
                    
                    # Update the document
                    product_ref.update(product_data)
                    print(f"  [Tool Call] Updated product {product_id} with video URL for {platform}")
            except Exception as e:
                print(f"  [Tool Call] Error updating product with video URL: {str(e)}")

        return {
            "status": "success",
            "detail": f"{platform} video generated successfully.",
            "filename": f"{platform.lower()}_{product_id or 'noid'}_video.mp4",
            "platform": platform,
            "product_id": product_id,
            "specs_used": specs,
            "gcs_path": blob_path,
            "public_url": public_url,
            "video_uri": video_uri,
            "media_type": "video",
            "duration_seconds": 8
        }

    except Exception as e:
        import traceback
        error_msg = f"Video generation failed: {str(e)}\n{traceback.format_exc()}"
        logger.error(error_msg)
        return {
            "status": "failed",
            "error": error_msg,
            "platform": platform,
            "product_id": product_id
        }

# Update the instruction prompt for the image generation agent
IMAGE_GENERATION_PROMPT = """
You are a specialized media generation agent that creates high-quality social media content.

In the pipeline workflow:
1. The content preprocessing agent has already fetched marketing content
2. The prompt refiner agent has already created a detailed content prompt
3. Your job is to generate the actual media content using that refined prompt

The content type will depend on the media_type specified:
- For "image": Generate a single high-quality image
- For "carousel": Generate 2 images to be displayed as a carousel
- For "video" or "shorts": Generate a short video (currently a placeholder)

WORKFLOW:
1. Call generate_image_from_refined_prompt() to create the content
2. Return the results including the content URLs

You do NOT need to fetch marketing content again or create prompts - those steps
have already been completed by previous agents in the pipeline.
"""

# Update the social media image agent to use the simplified function
social_media_image_agent = Agent(
    model=MODEL,
    name="social_media_image_agent",
    description=(
        "An agent that generates platform-specific, text-free social media images "
        "using refined prompts created earlier in the pipeline."
    ),
    instruction=IMAGE_GENERATION_PROMPT,
    output_key="social_media_image_output",
    tools=[generate_image_from_refined_prompt, load_artifacts],
)

social_media_pipeline_agent = SequentialAgent(
    name="social_media_pipeline_agent",
    description=(
        "An end-to-end agent that processes marketing content and generates "
        "platform-specific social media images in a sequential workflow."
    ),
    sub_agents=[
        content_preprocessing_agent, 
        prompt_refiner_agent, 
        social_media_image_agent
    ]
)