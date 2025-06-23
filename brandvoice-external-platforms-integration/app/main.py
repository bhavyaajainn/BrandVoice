from dotenv import load_dotenv
import os

# Load .env file from the current directory (app)
# This assumes main.py and .env are in the same directory 'app'
# or that you run the app from the 'app' directory.
# For more robust pathing if running from project root:

dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path=dotenv_path)
import json
from sqlalchemy.future import select
from fastapi import Request, Form, UploadFile, File, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from typing import List, Optional
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from app.api.v1 import router as api_v1_router
from app.core.config import get_settings
from sqlalchemy import create_engine  # <-- sync engine
from sqlmodel import SQLModel
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

settings = get_settings()

async def dispatch_scheduled_tweet(post_id: int):
    try:
        async with db_session() as session:
            post = await session.get(ScheduledPost, post_id)
            if not post or post.status != "pending":
                return
            from app.models.user import User
            user = await session.get(User, post.user_id)
            if not user:
                post.status = "failed"
                await session.update(ScheduledPost, post_id, {"status": "failed"})
                return
            media_list = json.loads(post.media_paths) if post.media_paths else None
            try:
                tweet_id = post_tweet_for_user(
                    access_token=user.access_token,
                    access_token_secret=user.access_token_secret,
                    text=post.text,
                    media_paths=media_list
                )
                await session.update(ScheduledPost, post_id, {"status": "sent"})
            except Exception as e:
                logger.error(f"Failed to post tweet: {str(e)}")
                await session.update(ScheduledPost, post_id, {"status": "failed"})
    except Exception as e:
        logger.error(f"Error in dispatch_scheduled_tweet: {str(e)}")

def create_app() -> FastAPI:
    s = get_settings()
    app = FastAPI(
        title=s.app_name,
        version="1.0.0",
        description="Multi-agent content automation backend, these are the external APIs for BrandVoice.",
        docs_url="/docs", redoc_url="/redoc",
        swagger_ui_init_oauth={
            "usePkceWithAuthorizationCodeGrant": True,
            "useBasicAuthenticationWithAccessCodeGrant": True
        }
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=s.allow_origins, allow_credentials=True,
        allow_methods=["*"], allow_headers=["*"],
    )

    app.add_middleware(
        SessionMiddleware,
        secret_key=s.secret_key,
        session_cookie="session",
        max_age=3600,
        same_site="lax",
        https_only=False
    )

    app.include_router(api_v1_router, prefix="/api/v1")
    return app

app = create_app()
