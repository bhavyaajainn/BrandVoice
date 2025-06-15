import yaml

from main import app

# Get the OpenAPI schema as a dictionary
openapi_schema = app.openapi()

# Save it to a file
with open("openapi_schema.yaml", "w") as f:
    yaml.dump(openapi_schema, f, sort_keys=False)

print("OpenAPI schema saved to openapi_schema.yaml")