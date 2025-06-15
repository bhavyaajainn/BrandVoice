import yaml
from fastapi.openapi.utils import get_openapi
from main import app

def generate_enhanced_openapi():
    # Get the OpenAPI schema with more details
    openapi_schema = get_openapi(
        title="BrandVoice Marketing API",
        version="1.0.0",
        description="API for brand profile management and marketing content generation",
        routes=app.routes,
    )
     
    # Add server information
    openapi_schema["servers"] = [
        {"url": "https://brandvoice-backend-172212688771.us-central1.run.app/", "description": "Production server"},
        {"url": "http://localhost:8080", "description": "Local development server"}
    ]
    
    # Organize endpoints by tags
    for path in openapi_schema["paths"].values():
        for operation in path.values():
            if "tags" not in operation:
                # Group endpoints by resource type
                if "brand" in operation["operationId"]:
                    operation["tags"] = ["Brand Management"]
                elif "product" in operation["operationId"]:
                    operation["tags"] = ["Product Management"]
                elif "marketing" in operation["operationId"]:
                    operation["tags"] = ["Marketing Content"]
                elif "seo" in operation["operationId"]:
                    operation["tags"] = ["SEO Content"]
                elif "social-media" in operation["operationId"]:
                    operation["tags"] = ["Social Media"]
                elif "color" in operation["operationId"]:
                    operation["tags"] = ["Design & Visuals"]
                else:
                    operation["tags"] = ["General"]
    
    # Add tag descriptions
    openapi_schema["tags"] = [
        {"name": "Brand Management", "description": "Operations for managing brand profiles"},
        {"name": "Product Management", "description": "Operations for managing products under brands"},
        {"name": "Marketing Content", "description": "Generate marketing content for products"},
        {"name": "SEO Content", "description": "Generate SEO-optimized content"},
        {"name": "Social Media", "description": "Generate social media content and assets"},
        {"name": "Design & Visuals", "description": "Generate visual assets like color palettes"}
    ]
    
    # Write formatted OpenAPI schema as YAML
    with open("openapi_schema.yaml", "w") as f:
        yaml.dump(openapi_schema, f, sort_keys=False, default_flow_style=False, width=88)

if __name__ == "__main__":
    generate_enhanced_openapi()