from pathlib import Path
from fastapi.openapi.utils import get_openapi
from app.main import app                     # import your FastAPI()
import yaml

schema = get_openapi(
    title=app.title,
    version=app.version,
    routes=app.routes,
)
import json

Path("openapi.yaml").write_text(yaml.safe_dump(schema, indent=2))
