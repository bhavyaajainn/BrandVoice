#!/usr/bin/env bash
# ---------------------------------------------------------------------
# Build with Cloud Build and deploy to Cloud Run
#   – NO secret creation here; we assume secrets already exist
# ---------------------------------------------------------------------
set -euo pipefail

PROJECT_ID=$(gcloud config get-value project)
[[ -z $PROJECT_ID ]] && { echo "❌  No GCP project set"; exit 1; }

REGION="us-central1"
SERVICE_NAME="brandvoice-external-apis"

echo "🚀  Submitting Cloud Build for project $PROJECT_ID"
gcloud builds submit \
  --config cloudbuild.yaml \
  --substitutions=_SERVICE="$SERVICE_NAME",_REGION="$REGION"

echo "🎉  Build submitted. Watch progress in the Cloud Build console."
