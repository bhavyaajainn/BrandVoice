import logging
import os
from pathlib import Path

import firebase_admin
from firebase_admin import credentials, firestore
from google.auth import default as google_auth_default
from google.auth.exceptions import DefaultCredentialsError

logger = logging.getLogger(__name__)

_firebase_app: firebase_admin.App | None = None
_firestore_client: firestore.Client | None = None


def _load_credentials():
    """
    Try credentials in this order:
      1. Application Default Credentials (metadata server on GCP, gcloud auth locally)
      2. JSON file at path in GOOGLE_APPLICATION_CREDENTIALS (e.g. mounted Secret)
      3. JSON file specified by settings.google_application_credentials (local fallback)
    Return a (cred, project_id) tuple; project_id may be None for file-based creds.
    """
    # 1️⃣ ADC – succeeds automatically on Cloud Run / GCF / GKE Workload Identity
    try:
        cred, project_id = google_auth_default()
        logger.info("Using Application Default Credentials")
        return cred, project_id
    except DefaultCredentialsError:
        logger.debug("ADC not available, checking key files")

    # 2️⃣ Env-var path (works with Cloud Run Secret mount)
    key_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
    if key_path and Path(key_path).exists():
        logger.info("Using credentials file from $GOOGLE_APPLICATION_CREDENTIALS")
        return credentials.Certificate(key_path), None

    # 3️⃣ Local settings path
    from app.core.config import get_settings

    settings = get_settings()
    key_path = settings.google_application_credentials
    if key_path and Path(key_path).exists():
        logger.info("Using credentials file from settings.google_application_credentials")
        return credentials.Certificate(key_path), None

    raise FileNotFoundError(
        "No valid GCP credentials found via ADC, "
        "$GOOGLE_APPLICATION_CREDENTIALS, or settings.google_application_credentials"
    )


def initialize_firebase():
    """Return a lazily initialised Firestore client (safe for reuse within one process)."""
    global _firebase_app, _firestore_client
    if _firebase_app:  # already initialised
        return _firestore_client

    cred, project_id = _load_credentials()
    _firebase_app = firebase_admin.initialize_app(
        cred, {"projectId": project_id} if project_id else {}
    )
    _firestore_client = firestore.client()
    logger.info(
        "Firebase initialised (project=%s, app_name=%s)",
        project_id or "<from key file>",
        _firebase_app.name,
    )
    return _firestore_client


def get_firestore_client():
    return initialize_firebase()


def get_firebase_app():
    initialize_firebase()
    return _firebase_app
