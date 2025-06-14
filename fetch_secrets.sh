#!/bin/bash

# Fetch service_account.json from Secret Manager
gcloud secrets versions access latest --secret=brandvoice_service_account > /app/service_account.json

# Fetch .env from Secret Manager (if stored as a secret)
gcloud secrets versions access latest --secret=brandvoice_env > /app/.env

echo "Secrets fetched and written to files."