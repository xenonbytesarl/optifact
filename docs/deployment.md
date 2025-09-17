# CI/CD: Build & Deploy Docker images with GitHub Actions

This document explains how Optifact is built and deployed as Docker images using GitHub Actions, and how to set up a remote server for automated deployments.

Contents
- Overview
- Registry & Image naming
- Files added
- GitHub secrets and variables
- Remote server prerequisites
- First-time server setup
- CI/CD workflow lifecycle
- Manual deployment (workflow_dispatch)
- Rollback strategy
- Troubleshooting

## Overview
- The repository contains Dockerfiles for:
  - backend: docker/backend/Dockerfile
  - frontend: docker/frontend/Dockerfile
- GitHub Actions workflow .github/workflows/cicd.yml builds and pushes both images to a container registry (GHCR by default) with tags:
  - latest
  - commit SHA (e.g., 7c3f2ab) or the pushed tag (e.g. v1.2.3)
- After pushing, the workflow connects to the remote server via SSH and runs Docker Compose with docker-compose.deploy.yaml to pull and run the new images.

## Registry & Image naming
By default the workflow publishes to GitHub Container Registry (GHCR): ghcr.io.

- Backend image: ghcr.io/<IMAGE_NAMESPACE>/optifact-backend:<TAG>
- Frontend image: ghcr.io/<IMAGE_NAMESPACE>/optifact-frontend:<TAG>

You can override:
- REGISTRY via repository variable vars.REGISTRY
- IMAGE_NAMESPACE via repository variable vars.IMAGE_NAMESPACE (defaults to the org/user that owns the repository)

## Files added
- .github/workflows/cicd.yml — CI/CD pipeline (build, push, deploy)
- docker-compose.deploy.yaml — Compose file tailored for deployment (uses prebuilt images)
- scripts/deploy/remote-deploy.sh — Helper script executed on the server (optional, workflow can deploy without it)
- .env.example — Example environment to copy on server as .env
- docs/deployment.md — This documentation

The existing docker-compose.yaml is kept for local development. For deployment, docker-compose.deploy.yaml is used to ensure images are pulled from the registry instead of building from sources.

## GitHub secrets and variables
Configure the following in your GitHub repository Settings » Secrets and variables » Actions.

Required secrets:
- SSH_HOST — Public IP or hostname of the server
- SSH_USER — SSH username
- SSH_KEY — Private key (PEM content) with access to the server user

Optional/conditional secrets:
- SSH_PORT — SSH port (default 22)
- REGISTRY_USERNAME — Registry username. For GHCR you can omit (action will use github.actor)
- REGISTRY_PASSWORD — Registry token/password. For GHCR you can omit and it will use GITHUB_TOKEN with packages:write permission

Repository variables (vars):
- REGISTRY — Default ghcr.io
- IMAGE_NAMESPACE — Defaults to repository owner
- SERVER_APP_DIR — Default /opt/optifact (target directory on the server)
- ENV_FILE_PATH — Default /opt/optifact/.env

Permissions: The workflow requests packages: write so it can push images to GHCR.

## Remote server prerequisites
On the target server (Ubuntu/Debian/RHEL etc.):
- Docker Engine installed
- Docker Compose V2 installed (docker compose version)
- A user with SSH access and permissions to run docker (be in docker group or use sudo in the workflow if required)
- Directory for the app (default /opt/optifact)
- Open ports: 8080 (backend), 8081 (frontend SSR), and 5433 if you expose Postgres for external access (optional)

## First-time server setup
1. Create the application directory:
   - sudo mkdir -p /opt/optifact
   - sudo chown -R <user>:<group> /opt/optifact
2. Optional: Prepare an environment file using the template:
   - Copy .env.example to the server as /opt/optifact/.env and adjust values (DB creds, etc.)
   - If you skip this step, the workflow will generate a minimal .env with sensible defaults on first deploy
3. Ensure the user can run docker and docker compose without password prompts (add to docker group or configure sudo appropriately)

## CI/CD workflow lifecycle
Triggers: push to main/master, tags (v*.*.*), and manual workflow_dispatch.

Jobs:
1) build-and-push
   - Logs in to the registry
   - Builds docker/backend/Dockerfile and docker/frontend/Dockerfile
   - Tags: latest and computed tag (commit SHA, manual input, or Git tag)
   - Pushes images to REGISTRY/IMAGE_NAMESPACE

2) deploy (needs: build-and-push)
   - Copies to the server: docker-compose.deploy.yaml, docker/ directory (not strictly required during deploy), and scripts
   - Logs in to the registry on the server
   - Exports IMAGE_TAG to the environment
   - docker compose -f docker-compose.deploy.yaml --env-file .env up -d

Tag computation:
- Default TAG = commit SHA
- If workflow_dispatch with input image_tag → uses that
- If the ref is a Git tag like refs/tags/v1.2.3 → uses v1.2.3

## Manual deployment (workflow_dispatch)
From the Actions tab, run the workflow manually. You may optionally pass an image_tag to deploy a specific version (e.g., v1.2.3) if already built and pushed.

## Rollback strategy
- To roll back to a previous version, re-run the workflow with workflow_dispatch and set image_tag to the desired previous tag (commit SHA or release tag), or
- On the server, run:
  - export IMAGE_TAG=v1.2.3
  - docker compose -f docker-compose.deploy.yaml --env-file .env up -d

## Troubleshooting
- Permission denied running docker on server:
  - Ensure the SSH_USER is in the docker group, or change the workflow to run docker with sudo
- docker compose not found:
  - Install Docker Compose V2 (it must be docker compose, not docker-compose)
- Images fail to pull (401 Unauthorized):
  - Check REGISTRY credentials. For GHCR, ensure REGISTRY_PASSWORD is a PAT with write:packages. Alternatively, rely on GITHUB_TOKEN with default permissions if pushing within the same org
- Backend cannot connect to DB:
  - Verify .env values (DB_HOST/DB_PORT/DB_NAME/DB_USERNAME/DB_PASSWORD)
- Frontend not accessible:
  - Ensure port 8081 is open on firewall/security groups

## Environment variables
- Application/runtime:
  - PROFILE, BACKEND_PORT
  - DB_HOST, DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD
  - CLAIM_FILE_ROOT_DIR
- Deployment/compose:
  - IMAGE_TAG (set by pipeline)
  - REGISTRY (default ghcr.io), IMAGE_NAMESPACE
  - SERVER_APP_DIR (server path), ENV_FILE_PATH

## Local development
- docker-compose.yaml remains for local usage.
- You can copy .env.example to .env and run:
  - docker compose --env-file .env up -d --build

## Security notes
- Keep SSH_KEY and any registry token secret in GitHub Secrets.
- Limit server user permissions and rotate keys regularly.
- Validate inputs when running workflow_dispatch.
