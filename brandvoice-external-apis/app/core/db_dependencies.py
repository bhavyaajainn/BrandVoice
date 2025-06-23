from typing import AsyncGenerator
from app.models.firestore_db import FirestoreSession
from app.core.firebase import get_firestore_client
import logging

logger = logging.getLogger(__name__)

async def db_session() -> FirestoreSession:
    """
    Dependency that returns a Firestore session.
    """
    try:
        db = get_firestore_client()
        if db is None:
            raise RuntimeError("Firebase is not initialized. Check service account configuration.")
        return FirestoreSession()
    except Exception as e:
        logger.error(f"Failed to create database session: {str(e)}")
        raise RuntimeError(f"Failed to create database session: {str(e)}")

# Alias for backward compatibility
get_db = db_session 