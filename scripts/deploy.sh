#!/usr/bin/env bash
set -euo pipefail

# This script is intended to be executed on the remote host via SSH.
# It expects the application repository (or deploy bundle) to be present at $REMOTE_APP_DIR.

REMOTE_APP_DIR=${REMOTE_APP_DIR:-/opt/optifact}
COMPOSE_FILE=${COMPOSE_FILE:-docker-compose.yml}

mkdir -p "$REMOTE_APP_DIR"
cd "$REMOTE_APP_DIR"

# Write .env from environment variables exported by the caller (GitHub Actions)
cat > .env <<EOF
DB_NAME=${DB_NAME}
DB_USERNAME=${DB_USERNAME}
DB_PASSWORD=${DB_PASSWORD}
DB_PORT=${DB_PORT}
PROFILE=${PROFILE}
BACKEND_PORT=${BACKEND_PORT}
CLAIM_FILE_ROOT_DIR=${CLAIM_FILE_ROOT_DIR}
FRONTEND_PORT=${FRONTEND_PORT}
EOF

# Pull or build images if provided as tarballs
if [ -f backend-image.tar ]; then
  docker load -i backend-image.tar || true
fi
if [ -f frontend-image.tar ]; then
  docker load -i frontend-image.tar || true
fi

# Start/Update the stack
DOCKER_COMPOSE="docker compose"
if ! command -v docker &>/dev/null; then
  echo "Docker not found on remote host" >&2
  exit 1
fi

$DOCKER_COMPOSE pull || true
$DOCKER_COMPOSE up -d --remove-orphans

$DOCKER_COMPOSE ps
