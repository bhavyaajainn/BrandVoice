"""color_palette_agent: for generating brand-specific color palettes"""

import os
import time
from typing import Dict, Any, List, Optional
import json
import colorsys

from dotenv import load_dotenv
from google.cloud import storage
from google.adk import Agent
from google.adk.tools import ToolContext, load_artifacts
from google.genai import Client, types
from PIL import Image, ImageDraw, ImageFont
from io import BytesIO
import numpy as np
from firebase_utils import db

load_dotenv()

MODEL = "gemini-2.0-flash" # Changed from problematic model to more accessible one
MODEL_IMAGE = "imagen-3.0-generate-002"

# Initialize clients
client = Client(
    vertexai=True,
    project=os.getenv("GOOGLE_CLOUD_PROJECT"),
    location=os.getenv("GOOGLE_CLOUD_LOCATION"),
)

# Initialize Google Cloud Storage
storage_client = storage.Client()
BUCKET_NAME = "brandvoice-images"

try:
    bucket = storage_client.get_bucket(BUCKET_NAME)
except Exception:
    print(f"Bucket {BUCKET_NAME} not found, creating it...")
    bucket = storage_client.create_bucket(BUCKET_NAME)
    # Set the bucket to allow public access
    bucket.iam_configuration.public_access_prevention = "unspecified"
    bucket.patch()

def get_product_brand_details(tool_context: ToolContext, product_id: str) -> Dict[str, Any]:
    """Retrieves product and associated brand details from the database.
    
    Args:
        tool_context: Tool context for state management
        product_id: ID of the product to retrieve details for
        
    Returns:
        Dictionary containing product and brand details
    """
    try:
        print(f"  [Tool Call] Retrieving details for product {product_id}")
        
        # Get product details
        product_ref = db.collection('products').document(product_id)
        product_doc = product_ref.get()
        
        if not product_doc.exists:
            error_msg = f"No product found with ID: {product_id}"
            print(error_msg)
            tool_context.state["error"] = error_msg
            return {"error": error_msg}
            
        product_data = product_doc.to_dict()
        
        # Store product details in state
        tool_context.state["product_id"] = product_id
        tool_context.state["product_name"] = product_data.get("product_name", "")
        tool_context.state["product_description"] = product_data.get("product_description", "")
        
        # Get brand details if available
        brand_details = {}
        brand_id = product_data.get('brand_id')
        if brand_id:
            brand_ref = db.collection('brands').document(brand_id)
            brand_doc = brand_ref.get()
            
            if brand_doc.exists:
                brand_data = brand_doc.to_dict()
                brand_details = {
                    "brand_id": brand_id,
                    "brand_name": brand_data.get("brand_name", ""),
                    "brand_description": brand_data.get("brand_description", ""),
                    "brand_tone": brand_data.get("brand_tone", ""),
                    "industry": brand_data.get("industry", ""),
                    "target_audience": brand_data.get("target_audience", "")
                }
                
                # Store brand details in state
                tool_context.state["brand_id"] = brand_id
                tool_context.state["brand_name"] = brand_data.get("brand_name", "")
                tool_context.state["brand_description"] = brand_data.get("brand_description", "")
                tool_context.state["brand_tone"] = brand_data.get("brand_tone", "")
                tool_context.state["industry"] = brand_data.get("industry", "")
                tool_context.state["target_audience"] = brand_data.get("target_audience", "")
        
        return {
            "product": {
                "id": product_id,
                "name": product_data.get("product_name", ""),
                "description": product_data.get("product_description", ""),
                "category": product_data.get("category", "")
            },
            "brand": brand_details
        }
        
    except Exception as e:
        error_msg = f"Error retrieving product/brand details: {str(e)}"
        print(error_msg)
        tool_context.state["error"] = error_msg
        return {"error": error_msg}

def analyze_brand_for_colors(tool_context: ToolContext, platform: str) -> Dict[str, Any]:
    """Analyzes the brand and product details to determine appropriate color palette.
    
    Args:
        tool_context: Tool context containing brand and product details
        platform: The platform for which to generate the color palette
        
    Returns:
        Dictionary containing color analysis results
    """
    try:
        # Check if we have product/brand details
        if "product_name" not in tool_context.state:
            return {"error": "No product details available. Run get_product_brand_details first."}
            
        # Get data from state
        product_name = tool_context.state.get("product_name", "")
        product_description = tool_context.state.get("product_description", "")
        brand_name = tool_context.state.get("brand_name", "")
        brand_description = tool_context.state.get("brand_description", "")
        brand_tone = tool_context.state.get("brand_tone", "")
        industry = tool_context.state.get("industry", "")
        target_audience = tool_context.state.get("target_audience", "")
        
        # Store platform in state
        tool_context.state["platform"] = platform
        
        # Build a detailed prompt for the AI model
        prompt = f"""
        Analyze the following brand and product details and suggest a cohesive color palette 
        with exactly 5 colors (primary, secondary, accent, background, text). 
        Provide the hex codes for each color.
        
        Product: {product_name}
        Product Description: {product_description}
        
        Brand: {brand_name}
        Brand Description: {brand_description}
        Brand Tone: {brand_tone}
        Industry: {industry}
        Target Audience: {target_audience}
        Platform: {platform}
        
        For each color, explain why it fits the brand's identity and how it should be used.
        Format the response as JSON with the following structure:
        {{
            "primary": {{
                "hex": "#HEXCODE",
                "name": "Color Name",
                "rationale": "Why this color works"
            }},
            "secondary": {{
                "hex": "#HEXCODE",
                "name": "Color Name",
                "rationale": "Why this color works"
            }},
            "accent": {{
                "hex": "#HEXCODE",
                "name": "Color Name",
                "rationale": "Why this color works"
            }},
            "background": {{
                "hex": "#HEXCODE",
                "name": "Color Name",
                "rationale": "Why this color works"
            }},
            "text": {{
                "hex": "#HEXCODE",
                "name": "Color Name",
                "rationale": "Why this color works"
            }}
        }}
        """
        
        # Call the AI model for color analysis
        response = client.models.generate_content(
            model=MODEL,
            contents=prompt
        )
        
        response_text = response.text
        
        # Extract the JSON part from the response
        try:
            # Look for JSON object between curly braces
            start_idx = response_text.find('{')
            end_idx = response_text.rfind('}') + 1
            
            if start_idx >= 0 and end_idx > start_idx:
                json_str = response_text[start_idx:end_idx]
                color_data = json.loads(json_str)
                
                # Store color data in state
                tool_context.state["color_analysis"] = color_data
                
                return {
                    "status": "success",
                    "color_palette": color_data,
                    "platform": platform
                }
            else:
                raise ValueError("No valid JSON found in response")
                
        except Exception as e:
            error_msg = f"Error parsing color analysis response: {str(e)}"
            print(error_msg)
            print(f"Response was: {response_text[:500]}...")
            tool_context.state["error"] = error_msg
            return {"error": error_msg, "raw_response": response_text}
        
    except Exception as e:
        error_msg = f"Error analyzing brand for colors: {str(e)}"
        print(error_msg)
        tool_context.state["error"] = error_msg
        return {"error": error_msg}

def generate_color_palette_image(tool_context: ToolContext) -> Dict[str, Any]:
    """Generates a visual color palette image based on the color analysis.
    
    Args:
        tool_context: Tool context containing color analysis
        
    Returns:
        Dictionary containing the image generation results
    """
    try:
        # Check if we have color analysis
        if "color_analysis" not in tool_context.state:
            return {"error": "No color analysis available. Run analyze_brand_for_colors first."}
            
        color_data = tool_context.state["color_analysis"]
        platform = tool_context.state.get("platform", "general")
        product_id = tool_context.state.get("product_id", "")
        brand_name = tool_context.state.get("brand_name", "Unknown Brand")
        
        # Extract colors from analysis
        colors = [
            (color_data["primary"]["hex"], color_data["primary"]["name"]),
            (color_data["secondary"]["hex"], color_data["secondary"]["name"]),
            (color_data["accent"]["hex"], color_data["accent"]["name"]),
            (color_data["background"]["hex"], color_data["background"]["name"]),
            (color_data["text"]["hex"], color_data["text"]["name"])
        ]
        
        # Generate a palette image programmatically
        width, height = 1200, 600
        img = Image.new('RGB', (width, height), (255, 255, 255))
        draw = ImageDraw.Draw(img)
        
        # Draw brand name
        try:
            font = ImageFont.truetype("Arial.ttf", 40)
        except IOError:
            # Fallback to default font
            font = ImageFont.load_default()
            
        draw.text((50, 50), f"Color Palette: {brand_name}", fill=(0, 0, 0), font=font)
        
        # Draw color swatches
        swatch_width = (width - 100) // len(colors)
        swatch_height = 300
        
        for i, (hex_code, color_name) in enumerate(colors):
            # Convert hex to RGB
            hex_code = hex_code.lstrip('#')
            r, g, b = tuple(int(hex_code[j:j+2], 16) for j in (0, 2, 4))
            
            # Draw swatch
            x1 = 50 + (i * swatch_width)
            y1 = 150
            x2 = x1 + swatch_width - 10
            y2 = y1 + swatch_height
            draw.rectangle([x1, y1, x2, y2], fill=(r, g, b))
            
            # Draw color info
            text_y = y2 + 20
            draw.text((x1, text_y), hex_code, fill=(0, 0, 0), font=font)
            draw.text((x1, text_y + 50), color_name, fill=(0, 0, 0), font=font)
        
        # Convert PIL Image to bytes
        img_byte_arr = BytesIO()
        img.save(img_byte_arr, format='PNG')
        img_bytes = img_byte_arr.getvalue()
        
        # Format filename
        safe_brand_name = brand_name.lower().replace(" ", "_").replace("'", "").replace('"', "")
        timestamp = int(time.time())
        filename = f"{safe_brand_name}_palette_{timestamp}.png"
        
        # Save artifact
        tool_context.save_artifact(
            filename,
            types.Part.from_bytes(data=img_bytes, mime_type="image/png"),
        )
        
        # Save to Google Cloud Storage
        gcs_path = f"color_palettes/{safe_brand_name}/{platform}/{filename}"
        blob = bucket.blob(gcs_path)
        blob.upload_from_string(img_bytes, content_type="image/png")
        
        # Make it publicly accessible
        blob.make_public()
        public_url = blob.public_url
        
        # Store palette image info in state
        tool_context.state["palette_image"] = {
            "filename": filename,
            "gcs_path": gcs_path,
            "public_url": public_url
        }
        
        # Extract just the hex codes for database storage
        hex_codes = [color[0] for color in colors]
        tool_context.state["color_hex_codes"] = hex_codes
        
        return {
            "status": "success",
            "filename": filename,
            "gcs_path": gcs_path,
            "public_url": public_url,
            "colors": colors,
            "hex_codes": hex_codes
        }
        
    except Exception as e:
        error_msg = f"Error generating color palette image: {str(e)}"
        print(error_msg)
        tool_context.state["error"] = error_msg
        return {"error": error_msg}

def save_palette_to_product(tool_context: ToolContext) -> Dict[str, Any]:
    """Saves the generated color palette to the product database.
    
    Args:
        tool_context: Tool context containing color palette data
        
    Returns:
        Dictionary containing the database update status
    """
    try:
        # Check if we have the required data
        if "color_hex_codes" not in tool_context.state:
            return {"error": "No color palette available. Run generate_color_palette_image first."}
            
        product_id = tool_context.state.get("product_id", "")
        if not product_id:
            return {"error": "No product ID available."}
            
        platform = tool_context.state.get("platform", "general")
        hex_codes = tool_context.state["color_hex_codes"]
        palette_image = tool_context.state.get("palette_image", {})
        color_analysis = tool_context.state.get("color_analysis", {})
        
        # Get a reference to the product document
        product_ref = db.collection('products').document(product_id)
        product_doc = product_ref.get()
        
        if not product_doc.exists:
            return {"error": f"Product {product_id} no longer exists in the database."}
            
        product_data = product_doc.to_dict()
        
        # Ensure marketing_content exists
        if 'marketing_content' not in product_data:
            product_data['marketing_content'] = {}
        
        # Ensure platform exists in marketing_content
        if platform not in product_data['marketing_content']:
            product_data['marketing_content'][platform] = {}
        
        # Add color palette data
        product_data['marketing_content'][platform]['color_palette'] = {
            'hex_codes': hex_codes,
            'palette_image_url': palette_image.get("public_url", ""),
            'analysis': color_analysis,
            'generated_at': int(time.time())
        }
        
        # Update the document
        product_ref.update(product_data)
        
        return {
            "status": "success",
            "detail": f"Color palette saved to product {product_id} for platform {platform}",
            "product_id": product_id,
            "platform": platform,
            "hex_codes": hex_codes,
            "palette_image_url": palette_image.get("public_url", "")
        }
        
    except Exception as e:
        error_msg = f"Error saving color palette to product: {str(e)}"
        print(error_msg)
        tool_context.state["error"] = error_msg
        return {"error": error_msg}

# Color palette agent prompt
COLOR_PALETTE_PROMPT = """
You are a professional brand color strategist specializing in creating cohesive, 
impactful color palettes for brands across different marketing platforms.

Your task is to analyze brand and product details to determine the perfect color 
palette that represents the brand's identity, appeals to their target audience,
and works effectively on their chosen marketing platform.

WORKFLOW:
1. First, retrieve the product and brand details using get_product_brand_details()
2. Analyze those details to create a color palette using analyze_brand_for_colors()
3. Generate a visual representation of the color palette using generate_color_palette_image()
4. Save the color palette to the product's database record using save_palette_to_product()

When analyzing colors, consider:
- Brand personality and values
- Industry expectations and differentiators
- Target audience preferences
- Psychological effects of colors
- Platform-specific considerations
- Color accessibility and contrast requirements

Your final output should include a cohesive 5-color palette with:
- Primary brand color
- Secondary brand color
- Accent color
- Background color
- Text color

For each color, provide a rationale explaining why it fits the brand identity
and how it should be used in marketing materials.
"""

# Create the color palette agent
color_palette_agent = Agent(
    model=MODEL,
    name="color_palette_agent",
    description=(
        "An agent that analyzes brand and product details to generate optimized "
        "color palettes and save them to the product database."
    ),
    instruction=COLOR_PALETTE_PROMPT,
    output_key="color_palette_output",
    tools=[
        get_product_brand_details, 
        analyze_brand_for_colors, 
        generate_color_palette_image, 
        save_palette_to_product,
        load_artifacts
    ],
)