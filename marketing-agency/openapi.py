import json
from main import app

# Get the OpenAPI schema as a dictionary
openapi_schema = app.openapi()

# Save it to a file
with open("openapi_schema.json", "w") as f:
    json.dump(openapi_schema, f, indent=2)

print("OpenAPI schema saved to openapi_schema.json")