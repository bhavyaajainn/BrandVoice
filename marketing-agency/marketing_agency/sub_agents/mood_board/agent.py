"""mood_board_agent: for creating brand mood boards"""

import os
import time
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont
from google.cloud import storage
from typing import Optional 

from dotenv import load_dotenv
from google.adk import Agent
from google.adk.tools import ToolContext, load_artifacts
from google.genai import Client, types

from . import prompt

MODEL = "gemini-2.5-pro-preview-05-06" 
MODEL_IMAGE = "imagen-3.0-generate-002"

load_dotenv()

# Only Vertex AI supports image generation for now.
client = Client(
    vertexai=True,
    project=os.getenv("GOOGLE_CLOUD_PROJECT"),
    location=os.getenv("GOOGLE_CLOUD_LOCATION"),
)

# Initialize Google Cloud Storage
storage_client = storage.Client()
BUCKET_NAME = "brandvoice-moodboards"

try:
    bucket = storage_client.get_bucket(BUCKET_NAME)
except Exception:
    print(f"Bucket {BUCKET_NAME} not found, creating it...")
    bucket = storage_client.create_bucket(BUCKET_NAME)

# Mood board style templates
MOOD_BOARD_STYLES = {
    "minimal": {
        "description": "Clean, simple, with lots of white space",
        "background_color": "#FFFFFF",
        "accent_color": "#EEEEEE",
        "layout": "grid",
        "style_guide": "minimalist, elegant, understated, clean lines, subtle textures"
    },
    "vibrant": {
        "description": "Bold, colorful, energetic and eye-catching",
        "background_color": "#F5F5F5",
        "accent_color": "#FF4D4D",
        "layout": "collage",
        "style_guide": "bright colors, bold shapes, dynamic compositions, high energy"
    },
    "rustic": {
        "description": "Warm, organic, natural textures and earthy tones",
        "background_color": "#F8F4E9",
        "accent_color": "#A67C52",
        "layout": "asymmetric",
        "style_guide": "natural materials, warm tones, organic textures, handcrafted feel"
    },
    "luxury": {
        "description": "Sophisticated, premium, elegant with rich colors",
        "background_color": "#1A1A1A",
        "accent_color": "#D4AF37",
        "layout": "grid",
        "style_guide": "gold accents, rich textures, premium materials, sophisticated typography"
    },
    "modern": {
        "description": "Contemporary, sleek, with geometric elements",
        "background_color": "#FFFFFF",
        "accent_color": "#2C2C2C",
        "layout": "asymmetric",
        "style_guide": "geometric shapes, monochromatic palette, clean typography, contemporary feel"
    }
}

def generate_mood_board(
    brand_name: str, 
    brand_description: str, 
    style: str = "modern", 
    color_palette: Optional[str] = None,  # Changed from str = None
    keywords: Optional[str] = None,       # Changed from str = None
    tool_context: Optional["ToolContext"] = None  # Be consistent with Optional
):
    """Generates a mood board for a brand with various visual elements.
    
    Args:
        brand_name: Name of the brand
        brand_description: Description of the brand, its values, and target audience
        style: Style template to use (minimal, vibrant, rustic, luxury, modern)
        color_palette: Optional specific color palette to incorporate
        keywords: Optional additional keywords to influence the mood
        tool_context: Tool context for saving artifacts
    """
    if tool_context is None:
        return {"status": "failed", "detail": "Tool context is not available"}
    
    # Get the style template, default to modern if not found
    style_template = MOOD_BOARD_STYLES.get(style.lower(), MOOD_BOARD_STYLES["modern"])
    
    # Elements to include in the mood board
    elements = [
        "color palette",
        "typography example",
        "texture or pattern",
        "product visualization",
        "lifestyle imagery",
        "brand personality representation"
    ]
    
    # Generate individual elements
    mood_board_elements = {}
    gcs_urls = {}  # To store GCS URLs
    
    # Sanitize brand name for folder structure
    safe_brand_name = brand_name.lower().replace(" ", "_").replace("'", "").replace('"', "")
    timestamp = int(time.time())
    
    # Add keywords to the brand description
    enhanced_description = f"{brand_description}"
    if keywords:
        enhanced_description += f" Keywords: {keywords}"
    
    # Add color palette info if provided
    color_info = ""
    if color_palette:
        color_info = f" Use this color palette: {color_palette}."
    
    # Generate each element of the mood board
    for i, element in enumerate(elements):
        prompt = f"""
        Create a single image for a {style_template['description']} mood board for the brand "{brand_name}".
        
        Brand description: {enhanced_description}
        
        This specific image should represent the "{element}" aspect of the brand.{color_info}
        
        Create a professional, high-quality image with these characteristics:
        - Style: {style_template['style_guide']}
        - Clean composition that works well in a mood board
        - Suitable for professional brand presentation
        - No text overlay or labels (these will be added separately)
        """
        
        try:
            response = client.models.generate_images(
                model=MODEL_IMAGE,
                prompt=prompt,
                config={
                    "number_of_images": 1,
                    "size": "1024x1024"  # Square format for consistent layout
                },
            )
            
            if response.generated_images:
                element_name = element.replace(' ', '_')
                element_filename = f"moodboard_{element.replace(' ', '_')}_{int(time.time())}.png"
                image_bytes = response.generated_images[0].image.image_bytes
                
                # Save individual element
                tool_context.save_artifact(
                    element_filename,
                    types.Part.from_bytes(data=image_bytes, mime_type="image/png"),
                )
                gcs_path = f"moodboards/{safe_brand_name}/{style}/{element_name}/{element_filename}"
                blob = bucket.blob(gcs_path)
                blob.upload_from_string(image_bytes, content_type="image/png")

                # Make it publicly accessible
                
                public_url = f"https://storage.googleapis.com/brandvoice-moodboards/{gcs_path}"
                
                mood_board_elements[element] = {
                    "filename": element_filename,
                    "image_bytes": image_bytes,
                    "gcs_path": gcs_path,
                    "public_url": public_url
                }

                gcs_urls[element] = public_url
                
                print(f"Generated {element} and uploaded to {gcs_path}")
        except Exception as e:
            print(f"Error generating {element}: {str(e)}")
    
    # Generate color palette suggestion if not provided
    if not color_palette:
        palette_prompt = f"""
        Create a color palette image for the brand "{brand_name}".
        
        Brand description: {enhanced_description}
        
        The image should show 5 complementary colors in swatches with their hex codes.
        Style: {style_template['style_guide']}
        """
        
        try:
            palette_response = client.models.generate_images(
                model=MODEL_IMAGE,
                prompt=palette_prompt,
                config={"number_of_images": 1},
            )
            
            if palette_response.generated_images:
                palette_filename = f"moodboard_color_palette_{int(time.time())}.png"
                palette_bytes = palette_response.generated_images[0].image.image_bytes
                
                # Save color palette
                tool_context.save_artifact(
                    palette_filename,
                    types.Part.from_bytes(data=palette_bytes, mime_type="image/png"),
                )

                # 2. Save to Google Cloud Storage
                gcs_path = f"moodboards/{safe_brand_name}/{style}/color_palette/{palette_filename}"
                blob = bucket.blob(gcs_path)
                blob.upload_from_string(palette_bytes, content_type="image/png")

                
                public_url = f"https://storage.googleapis.com/brandvoice-moodboards/{gcs_path}"
                
                mood_board_elements["color_palette"] = {
                    "filename": palette_filename,
                    "image_bytes": palette_bytes,
                    "gcs_path": gcs_path,
                    "public_url": public_url
                }
                gcs_urls["color_palette"] = public_url
                
                print(f"Generated color palette and uploaded to {gcs_path}")
        except Exception as e:
            print(f"Error generating color palette: {str(e)}")
    
    # Create a combined mood board layout (if you have PIL installed)
    try:
        collection_data = {
            "brand_name": brand_name,
            "style": style,
            "timestamp": timestamp,
            "elements": list(mood_board_elements.keys()),
            "gcs_urls": gcs_urls
        }
        
        # Save collection data as JSON to GCS
        collection_filename = f"moodboard_collection_{safe_brand_name}_{timestamp}.json"
        collection_gcs_path = f"moodboards/{safe_brand_name}/{style}/collections/{collection_filename}"
        
        import json
        collection_blob = bucket.blob(collection_gcs_path)
        collection_blob.upload_from_string(
            json.dumps(collection_data, indent=2),
            content_type="application/json"
        )
        collection_url = f"https://storage.googleapis.com/brandvoice-moodboards/{collection_gcs_path}"
        
        return {
            "status": "success",
            "detail": f"Mood board elements for '{brand_name}' generated and stored in Google Cloud Storage.",
            "style": style,
            "brand_name": brand_name,
            "elements": list(mood_board_elements.keys()),
            "element_files": [info["filename"] for info in mood_board_elements.values()],
            "gcs_urls": gcs_urls,
            "collection_url": collection_url,
            "timestamp": timestamp,
            "mood_board_style": style_template
        }
        
    except Exception as e:
        # Even if collection creation fails, we still have individual elements
        return {
            "status": "partial_success",
            "detail": f"Individual mood board elements generated and stored, but collection creation failed: {str(e)}",
            "elements": list(mood_board_elements.keys()),
            "element_files": [info["filename"] for info in mood_board_elements.values()],
            "gcs_urls": gcs_urls,
            "timestamp": timestamp
        }


mood_board_agent = Agent(
    model=MODEL,
    name="mood_board_agent",
    description=(
        "An agent that generates brand mood boards containing multiple visual elements "
        "to establish the visual direction, tone, and style for a brand."
    ),
    instruction=prompt.MOOD_BOARD_PROMPT,
    output_key="mood_board_output",
    tools=[generate_mood_board, load_artifacts],
)