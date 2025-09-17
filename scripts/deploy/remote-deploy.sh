#!/usr/bin/env bash
set -euo pipefail

# Remote deployment helper
# This script is intended to be uploaded and executed on the remote server by the CI pipeline.
# It requires Docker and Docker Compose V2 installed on the server.

APP_DIR=${APP_DIR:-/opt/optifact}
ENV_FILE_PATH=${ENV_FILE_PATH:-$APP_DIR/.env}
TAG=${IMAGE_TAG:-${TAG:-latest}}
REGISTRY=${REGISTRY:-ghcr.io}
IMAGE_NAMESPACE=${IMAGE_NAMESPACE:-xenonbytesarl}
BACKEND_IMAGE_NAME=${BACKEND_IMAGE_NAME:-optifact-backend}
FRONTEND_IMAGE_NAME=${FRONTEND_IMAGE_NAME:-optifact-frontend}

cd "$APP_DIR"

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is not installed on the server" >&2
  exit 1
fi
if ! command -v docker compose >/dev/null 2>&1; then
  echo "Docker Compose V2 is not installed on the server" >&2
  exit 1
fi

# Ensure .env exists
if [ ! -f "$ENV_FILE_PATH" ]; then
  echo "Creating default .env at $ENV_FILE_PATH"
  mkdir -p "$(dirname "$ENV_FILE_PATH")"
  printf "%s\n" \
    "PROFILE=prod" \
    "BACKEND_PORT=8080" \
    "DB_HOST=db" \
    "DB_PORT=5432" \
    "DB_NAME=optifact_db" \
    "DB_USERNAME=optifact" \
    "DB_PASSWORD=change_me" \
    "CLAIM_FILE_ROOT_DIR=/data/claims" \
    "# docker-compose specific" \
    "IMAGE_TAG=${TAG}" \
    > "$ENV_FILE_PATH"
fi

# Pull and restart
export IMAGE_TAG="$TAG"
set -x
docker compose --env-file "$ENV_FILE_PATH" pull || true
docker compose --env-file "$ENV_FILE_PATH" up -d --remove-orphans
docker image prune -f || true
