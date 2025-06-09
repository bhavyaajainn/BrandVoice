"""social_media_image_agent: for creating platform-specific social media images"""

import os

from dotenv import load_dotenv
from google.cloud import storage
from google.adk import Agent
from google.adk.tools import ToolContext, load_artifacts
from google.genai import Client, types

from . import prompt

MODEL = "gemini-2.5-pro-preview-05-06" 
MODEL_IMAGE = "imagen-3.0-generate-002"

load_dotenv()

storage_client = storage.Client()
BUCKET_NAME = "brandvoice-images"

# Only Vertex AI supports image generation for now.
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


# Platform-specific aspect ratios and specs
PLATFORM_SPECS = {
    "instagram": {
        "aspect_ratio": "1:1",  # Square for feed posts
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

def generate_social_media_image(content: str, platform: str, brand_name: str = "", tool_context: "ToolContext" = None):
    """Generates a platform-specific social media image based on content.
    
    Args:
        content: The content to visualize from content_refinement_loop
        platform: Which platform the image is for (instagram, twitter, facebook, etc.)
        brand_name: Optional brand name to include in the image
        tool_context: Tool context for saving artifacts
    """
    # Get the platform specs, default to instagram if not found
    specs = PLATFORM_SPECS.get(platform.lower(), PLATFORM_SPECS["instagram"])
    
    # Create an enhanced prompt that specifies platform requirements
    enhanced_prompt = f"""
    Create a {platform} post image with the following specifications:
    - Dimensions: {specs['dimensions']} (aspect ratio {specs['aspect_ratio']})
    - Style: {specs['style_guide']}
    
    The image should visualize this content: {content}
    
    IMPORTANT:
    - DO NOT include lengthy text or paragraphs in the image
    - If including any text, limit to 1-3 key words maximum
    - {f"The brand name '{brand_name}' can be included as a small logo or watermark" if brand_name else ""}
    - Leave clean space for text to be added separately
    
    Create a professional, marketing-quality image that would work well for a {platform} post.
    """
    
    # Generate the image
    response = client.models.generate_images(
        model=MODEL_IMAGE,
        prompt=enhanced_prompt,
        config={
            "number_of_images": 1,

        },
    )
    
    if not response.generated_images:
        return {"status": "failed"}
    
    image_bytes = response.generated_images[0].image.image_bytes
    filename = f"{platform.lower()}_image.png"
    
    tool_context.save_artifact(
        filename,
        types.Part.from_bytes(data=image_bytes, mime_type="image/png"),
    )

    try:
        # Sanitize brand_name for folder structure
        safe_brand_name = brand_name.lower().replace(" ", "_") if brand_name else "unnamed_brand"
        
        # Create a path within the bucket
        gcs_path = f"{safe_brand_name}/{platform.lower()}/{filename}"
        
        # Upload to Google Cloud Storage
        blob = bucket.blob(gcs_path)
        blob.upload_from_string(image_bytes, content_type="image/png")
        
        # Make the blob publicly accessible
        public_url = "https://storage.googleapis.com/brandvoice-image-storage/{gcs_path}"
        
        return {
            "status": "success",
            "detail": f"{platform} image generated successfully and stored in bucket.",
            "filename": filename,
            "platform": platform,
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
            "specs_used": specs,
            "local_artifact": filename
        }
    
    # return {
    #     "status": "success",
    #     "detail": f"{platform} image generated successfully and stored in artifacts.",
    #     "filename": filename,
    #     "platform": platform,
    #     "specs_used": specs
    # }


social_media_image_agent = Agent(
    model=MODEL,
    name="social_media_image_agent",
    description=(
        "An agent that generates platform-specific social media images "
        "based on content from the content refinement agent."
    ),
    instruction=prompt.SOCIAL_MEDIA_IMAGE_PROMPT,
    output_key="social_media_image_output",
    tools=[generate_social_media_image, load_artifacts],
)