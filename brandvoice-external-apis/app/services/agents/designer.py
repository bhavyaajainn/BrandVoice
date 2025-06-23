"""
Designer agent  –  generates brand-compliant images for social posts.
Place this file in  app/services/agents/designer.py
"""

from __future__ import annotations
import uuid
from typing import Dict

from google.adk.agents import LlmAgent           # ADK’s high-level LLM agent class  :contentReference[oaicite:4]{index=4}
from google.genai import types                   # Needed only if you call the runner in tests

# ────────────────────────────────
# 1. Tool definition
# ────────────────────────────────
def generate_image(prompt: str,
                   platform: str = "instagram",
                   aspect_ratio: str = "1:1") -> Dict[str, str]:
    """
    Creates an image via Vertex-AI Imagen (stubbed here).

    Args:
        prompt:   Full text prompt describing the desired creative.
        platform: Target platform so the agent can request size/ratio.
        aspect_ratio: Output aspect ratio, e.g. 1:1, 4:5 or 16:9.

    Returns:
        dict with at least a `url` key – ADK tools must return JSON-serialisable data.
    """
    # TODO: replace this stub with an actual Vertex AI Images call.
    fake_url = f"https://cdn.brandvoice.ai/{uuid.uuid4()}.png"
    return {
        "status": "success",
        "url": fake_url,
        "platform": platform,
        "aspect_ratio": aspect_ratio
    }

# ────────────────────────────────
# 2. Agent definition
# ────────────────────────────────
designer_agent: LlmAgent = LlmAgent(             # matches Quick-start alias `Agent`  :contentReference[oaicite:5]{index=5}
    name="designer_agent",
    model="gemini-2.0-flash",
    description="Creates brand-safe images or short videos for scheduled posts.",
    instruction=(
        "You are **BrandVoice Designer**.\n\n"
        "Workflow:\n"
        "1. Read `post_text`, `mood`, and `brand_tokens` from session.state.\n"
        "2. Craft a detailed image prompt that respects brand colours, fonts and mood.\n"
        "3. Call `generate_image` **once per platform** requested.\n"
        "4. Reply ONLY with one short sentence per platform in the form "
        "\"<platform>: <image_url>\".\n"
        "Do not expose internal reasoning."
    ),
    tools=[generate_image],                      # declare the Python function as a tool  :contentReference[oaicite:6]{index=6}
    # (you could also pull in built-in google_search, etc.)
    output_key="designer_result"                 # stores final reply in ctx.session.state  :contentReference[oaicite:7]{index=7}
)
