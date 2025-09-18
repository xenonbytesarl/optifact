# Optifact – CI/CD, Docker & Deployment Guide (FR/EN)

This document explains how to containerize, run locally with Docker Compose, and deploy via GitHub Actions over SSH to a remote server. It is bilingual (FR/EN).

---

## 1) Variables d'environnement et configuration (FR)

Backend (Spring Boot 3.5, Java 21) – variables supportées par l'app et Docker:
- BACKEND_PORT: port HTTP exposé (par défaut 8080).
- PROFILE: profil Spring actif (prod par défaut).
- DB_HOST, DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD: paramètres PostgreSQL.
- FRONTEND_HOST, FRONTEND_PORT: info de frontal (optionnel, si utilisé par l'app).
- CLAIM_FILE_ROOT_DIR: répertoire des pièces jointes réclamations (par défaut /data/claimFiles).
- SPRING_DATASOURCE_URL, SPRING_DATASOURCE_USERNAME, SPRING_DATASOURCE_PASSWORD: clés standard Spring (en plus des variables ci-dessus) – générées automatiquement dans les images/compose.

Frontend (Angular 20, SSR activé):
- Deux conteneurs: frontend (Nginx) pour les assets statiques et frontend-ssr (Node) pour le rendu serveur (server.mjs).
- Nginx sert les fichiers statiques (/usr/share/nginx/html) et proxy les requêtes HTML vers frontend-ssr:4000. Les requêtes API /api/ sont proxy vers le backend.
- Pas de variables runtime nécessaires côté frontend; optionnellement SSR_PORT=4000 peut être changé si vous modifiez le Dockerfile.
- Assurez-vous que l'API dans environment.ts pointe vers "/api/v1" pour une intégration optimale via Nginx (proxy configuré).

Docker Compose (.env):
- DB_NAME, DB_USERNAME, DB_PASSWORD, DB_PORT
- PROFILE, BACKEND_PORT, CLAIM_FILE_ROOT_DIR
- FRONTEND_PORT

Secrets GitHub Actions (déploiement SSH):
- SSH_HOST: adresse/nom DNS du serveur.
- SSH_USER: utilisateur SSH.
- SSH_KEY: clé privée (format OpenSSH) du compte déployeur.
- SSH_PORT: port SSH (optionnel, 22 par défaut).
- REMOTE_APP_DIR: répertoire d'installation sur le serveur (ex: /opt/optifact).
- DB_NAME, DB_USERNAME, DB_PASSWORD, DB_PORT: paramètres DB pour la prod.
- BACKEND_PROFILE (ex: prod), BACKEND_PORT (ex: 8080), CLAIM_FILE_ROOT_DIR (ex: /data/claimFiles), FRONTEND_PORT (ex: 80).
- Optionnel registry: DOCKER_REGISTRY (par ex ghcr.io), DOCKER_USERNAME, DOCKER_PASSWORD si vous souhaitez pousser les images.

---

## 2) Préparation du serveur distant (FR)

Prérequis: Docker et Docker Compose Plugin installés.

1. Créer un utilisateur système (ex: deploy) et le répertoire cible:
   - sudo useradd -m -s /bin/bash deploy
   - sudo mkdir -p /opt/optifact && sudo chown -R deploy:deploy /opt/optifact
2. Installer Docker (si absent): suivre docs officielles Docker pour votre OS.
3. Clés SSH:
   - Sur votre machine locale: ssh-keygen -t ed25519 -C "ci@optifact" (laisser la passphrase vide pour CI)
   - Copier la clé publique sur le serveur: ssh-copy-id -i ~/.ssh/id_ed25519.pub deploy@server
   - Copier le contenu de ~/.ssh/id_ed25519 (privée) dans le secret GitHub SSH_KEY.
4. Ouvrir les ports nécessaires sur le pare-feu: FRONTEND_PORT (80 par défaut), BACKEND_PORT (8080), DB_PORT (si accès externe requis).

---

## 3) Exécution locale avec Docker Compose (FR)

1. Copier .env.sample en .env et adapter les valeurs:
   - cp .env.sample .env
2. Construire et démarrer:
   - docker compose up -d --build
3. Accéder:
   - Frontend: http://localhost:FRONTEND_PORT (80 par défaut)
   - Backend: http://localhost:BACKEND_PORT (8080 par défaut)
   - PostgreSQL: localhost:DB_PORT (5432 par défaut)

---

## 4) CI/CD via GitHub Actions (FR)

Workflow: .github/workflows/ci-cd.yml

Entrées (workflow_dispatch):
- action: build_and_deploy | build_only | deploy_only
- scope: all | backend | frontend
- push_images: true/false (pousser vers un registry ou transférer les tarballs en SSH)

Scénarios:
- Builder tout et déployer: action=build_and_deploy, scope=all
- Builder seulement le backend: action=build_only, scope=backend
- Déployer seulement le frontend (image existante): action=deploy_only, scope=frontend

Déploiement:
- Le workflow transfère docker-compose.yml, scripts/ et les images (si non poussées) sur REMOTE_APP_DIR, puis exécute scripts/deploy.sh via SSH.

---

## 5) Structure des images (FR)

Backend:
- Multi-stage Maven (Java 21) -> JRE 21.
- Variables exposées (voir section 1).
- Port interne 8080 (mappé par SERVER_PORT/BACKEND_PORT).

Frontend (SSR):
- Build Node 20 for both browser (client) and server bundles.
- Two runtime images:
  - frontend (Nginx 1.27-alpine): serves static assets and proxies HTML to SSR.
  - frontend-ssr (Node 20-alpine): runs server.mjs on port 4000.
- Nginx proxy /api/ -> http://backend:8080/api/

---

## 6) English – Environment & Config

Backend (Spring Boot 3.5, Java 21):
- BACKEND_PORT, PROFILE, DB_HOST, DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD, FRONTEND_HOST, FRONTEND_PORT, CLAIM_FILE_ROOT_DIR.
- Also standard Spring envs supported: SPRING_DATASOURCE_URL/USERNAME/PASSWORD, SERVER_PORT.

Frontend (Angular 20, SSR enabled):
- Two containers: frontend (Nginx) for static assets and frontend-ssr (Node) for server-side rendering (server.mjs).
- Nginx serves static files (/usr/share/nginx/html) and proxies HTML requests to frontend-ssr:4000. API requests /api are proxied to the backend.
- No runtime env required for the frontend; optionally SSR_PORT=4000 can be changed if you modify the Dockerfile.
- Ensure environment.ts uses "/api/v1" for API base when serving behind Nginx.

Docker Compose (.env): DB_NAME, DB_USERNAME, DB_PASSWORD, DB_PORT, PROFILE, BACKEND_PORT, CLAIM_FILE_ROOT_DIR, FRONTEND_PORT.

GitHub Actions Secrets:
- SSH_HOST, SSH_USER, SSH_KEY, SSH_PORT (optional), REMOTE_APP_DIR
- DB_NAME, DB_USERNAME, DB_PASSWORD, DB_PORT
- BACKEND_PROFILE, BACKEND_PORT, CLAIM_FILE_ROOT_DIR, FRONTEND_PORT
- Optional registry: DOCKER_REGISTRY, DOCKER_USERNAME, DOCKER_PASSWORD

---

## 7) Remote Server Preparation (EN)

1) Install Docker + Compose plugin. Create deploy user and app dir:
- sudo useradd -m -s /bin/bash deploy
- sudo mkdir -p /opt/optifact && sudo chown -R deploy:deploy /opt/optifact

2) Generate SSH key and add to server:
- ssh-keygen -t ed25519 -C "ci@optifact"
- ssh-copy-id -i ~/.ssh/id_ed25519.pub deploy@server
- Put the private key (~/.ssh/id_ed25519) content into GitHub Secret SSH_KEY.

3) Open firewall ports: FRONTEND_PORT (80), BACKEND_PORT (8080), DB_PORT if needed.

---

## 8) Local Run & Troubleshooting (EN/FR)

- docker compose logs -f backend | frontend | db  (consulter les logs)
- If the frontend calls wrong API host, verify environment.ts points to "/api/v1" and Nginx proxy works.
- Ensure Postgres credentials match in .env and app can create schema (Liquibase is included).
- Disk permissions: CLAIM_FILE_ROOT_DIR volume is created and owned by container user.

---

## 9) What to change in code (optional)

- Frontend environments currently point to fixed IPs. For containerized prod behind Nginx, set apiUrl to "/api/v1" in src/environments/environment.ts to avoid hard dependency on external host/port.

# Optifact – CI/CD, Docker & Deployment Guide (FR/EN)

This document explains how to containerize, run locally with Docker Compose, and deploy via GitHub Actions over SSH to a remote server. It is bilingual (FR/EN).

---

## 1) Variables d'environnement et configuration (FR)

Backend (Spring Boot 3.5, Java 21) – variables supportées par l'app et Docker:
- BACKEND_PORT: port HTTP exposé (par défaut 8080).
- PROFILE: profil Spring actif (prod par défaut).
- DB_HOST, DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD: paramètres PostgreSQL.
- FRONTEND_HOST, FRONTEND_PORT: info de frontal (optionnel, si utilisé par l'app).
- CLAIM_FILE_ROOT_DIR: répertoire des pièces jointes réclamations (par défaut /data/claimFiles).
- SPRING_DATASOURCE_URL, SPRING_DATASOURCE_USERNAME, SPRING_DATASOURCE_PASSWORD: clés standard Spring (en plus des variables ci-dessus) – générées automatiquement dans les images/compose.

Frontend (Angular 20, SSR activé):
- Deux conteneurs: frontend (Nginx) pour les assets statiques et frontend-ssr (Node) pour le rendu serveur (server.mjs).
- Nginx sert les fichiers statiques (/usr/share/nginx/html) et proxy les requêtes HTML vers frontend-ssr:4000. Les requêtes API /api/ sont proxy vers le backend.
- Pas de variables runtime nécessaires côté frontend; optionnellement SSR_PORT=4000 peut être changé si vous modifiez le Dockerfile.
- Assurez-vous que l'API dans environment.ts pointe vers "/api/v1" pour une intégration optimale via Nginx (proxy configuré).

Docker Compose (.env):
- DB_NAME, DB_USERNAME, DB_PASSWORD, DB_PORT
- PROFILE, BACKEND_PORT, CLAIM_FILE_ROOT_DIR
- FRONTEND_PORT

Secrets GitHub Actions (déploiement SSH):
- SSH_HOST: adresse/nom DNS du serveur.
- SSH_USER: utilisateur SSH.
- SSH_KEY: clé privée (format OpenSSH) du compte déployeur.
- SSH_PORT: port SSH (optionnel, 22 par défaut).
- REMOTE_APP_DIR: répertoire d'installation sur le serveur (ex: /opt/optifact).
- DB_NAME, DB_USERNAME, DB_PASSWORD, DB_PORT: paramètres DB pour la prod.
- BACKEND_PROFILE (ex: prod), BACKEND_PORT (ex: 8080), CLAIM_FILE_ROOT_DIR (ex: /data/claimFiles), FRONTEND_PORT (ex: 80).
- Optionnel registry: DOCKER_REGISTRY (par ex ghcr.io), DOCKER_USERNAME, DOCKER_PASSWORD si vous souhaitez pousser les images.

---

## 2) Préparation du serveur distant (FR)

Prérequis: Docker et Docker Compose Plugin installés.

1. Créer un utilisateur système (ex: deploy) et le répertoire cible:
   - sudo useradd -m -s /bin/bash deploy
   - sudo mkdir -p /opt/optifact && sudo chown -R deploy:deploy /opt/optifact
2. Installer Docker (si absent): suivre docs officielles Docker pour votre OS.
3. Clés SSH:
   - Sur votre machine locale: ssh-keygen -t ed25519 -C "ci@optifact" (laisser la passphrase vide pour CI)
   - Copier la clé publique sur le serveur: ssh-copy-id -i ~/.ssh/id_ed25519.pub deploy@server
   - Copier le contenu de ~/.ssh/id_ed25519 (privée) dans le secret GitHub SSH_KEY.
4. Ouvrir les ports nécessaires sur le pare-feu: FRONTEND_PORT (80 par défaut), BACKEND_PORT (8080), DB_PORT (si accès externe requis).

---

## 3) Exécution locale avec Docker Compose (FR)

1. Copier .env.sample en .env et adapter les valeurs:
   - cp .env.sample .env
2. Construire et démarrer:
   - docker compose up -d --build
3. Accéder:
   - Frontend: http://localhost:FRONTEND_PORT (80 par défaut)
   - Backend: http://localhost:BACKEND_PORT (8080 par défaut)
   - PostgreSQL: localhost:DB_PORT (5432 par défaut)

---

## 4) CI/CD via GitHub Actions (FR)

Workflow: .github/workflows/ci-cd.yml

Entrées (workflow_dispatch):
- action: build_and_deploy | build_only | deploy_only
- scope: all | backend | frontend
- push_images: true/false (pousser vers un registry ou transférer les tarballs en SSH)

Scénarios:
- Builder tout et déployer: action=build_and_deploy, scope=all
- Builder seulement le backend: action=build_only, scope=backend
- Déployer seulement le frontend (image existante): action=deploy_only, scope=frontend

Déploiement:
- Le workflow transfère docker-compose.yml, scripts/ et les images (si non poussées) sur REMOTE_APP_DIR, puis exécute scripts/deploy.sh via SSH.

---

## 5) Structure des images (FR)

Backend:
- Multi-stage Maven (Java 21) -> JRE 21.
- Variables exposées (voir section 1).
- Port interne 8080 (mappé par SERVER_PORT/BACKEND_PORT).

Frontend (SSR):
- Build Node 20 for both browser (client) and server bundles.
- Two runtime images:
  - frontend (Nginx 1.27-alpine): serves static assets and proxies HTML to SSR.
  - frontend-ssr (Node 20-alpine): runs server.mjs on port 4000.
- Nginx proxy /api/ -> http://backend:8080/api/

---

## 6) English – Environment & Config

Backend (Spring Boot 3.5, Java 21):
- BACKEND_PORT, PROFILE, DB_HOST, DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD, FRONTEND_HOST, FRONTEND_PORT, CLAIM_FILE_ROOT_DIR.
- Also standard Spring envs supported: SPRING_DATASOURCE_URL/USERNAME/PASSWORD, SERVER_PORT.

Frontend (Angular 20, SSR enabled):
- Two containers: frontend (Nginx) for static assets and frontend-ssr (Node) for server-side rendering (server.mjs).
- Nginx serves static files (/usr/share/nginx/html) and proxies HTML requests to frontend-ssr:4000. API requests /api are proxied to the backend.
- No runtime env required for the frontend; optionally SSR_PORT=4000 can be changed if you modify the Dockerfile.
- Ensure environment.ts uses "/api/v1" for API base when serving behind Nginx.

Docker Compose (.env): DB_NAME, DB_USERNAME, DB_PASSWORD, DB_PORT, PROFILE, BACKEND_PORT, CLAIM_FILE_ROOT_DIR, FRONTEND_PORT.

GitHub Actions Secrets:
- SSH_HOST, SSH_USER, SSH_KEY, SSH_PORT (optional), REMOTE_APP_DIR
- DB_NAME, DB_USERNAME, DB_PASSWORD, DB_PORT
- BACKEND_PROFILE, BACKEND_PORT, CLAIM_FILE_ROOT_DIR, FRONTEND_PORT
- Optional registry: DOCKER_REGISTRY, DOCKER_USERNAME, DOCKER_PASSWORD

---

## 7) Remote Server Preparation (EN)

1) Install Docker + Compose plugin. Create deploy user and app dir:
- sudo useradd -m -s /bin/bash deploy
- sudo mkdir -p /opt/optifact && sudo chown -R deploy:deploy /opt/optifact

2) Generate SSH key and add to server:
- ssh-keygen -t ed25519 -C "ci@optifact"
- ssh-copy-id -i ~/.ssh/id_ed25519.pub deploy@server
- Put the private key (~/.ssh/id_ed25519) content into GitHub Secret SSH_KEY.

3) Open firewall ports: FRONTEND_PORT (80), BACKEND_PORT (8080), DB_PORT if needed.

---

## 8) Local Run & Troubleshooting (EN/FR)

- docker compose logs -f backend | frontend | db  (consulter les logs)
- If the frontend calls wrong API host, verify environment.ts points to "/api/v1" and Nginx proxy works.
- Ensure Postgres credentials match in .env and app can create schema (Liquibase is included).
- Disk permissions: CLAIM_FILE_ROOT_DIR volume is created and owned by container user.

---

## 9) SSH deployment authentication – Troubleshooting (FR/EN)

FR:
- Le workflow supporte deux méthodes d'authentification: clé privée (SSH_KEY) ou mot de passe (SSH_PASSWORD).
- Format attendu de SSH_KEY: collez la clé privée brute multi‑ligne, sans guillemets, débutant par "-----BEGIN OPENSSH PRIVATE KEY-----" (ou RSA ancienne version). Ne minifiez pas sur une seule ligne.
- La clé est écrite dans ~/.ssh/deploy_key avec chmod 600 et transmise via key_path aux actions appleboy. Cela évite les erreurs ssh.ParsePrivateKey.
- Si vous n'avez pas de clé, fournissez SSH_PASSWORD. Le pipeline échouera tôt si ni SSH_KEY ni SSH_PASSWORD ne sont présents.

EN:
- The workflow supports two auth methods: private key (SSH_KEY) or password (SSH_PASSWORD).
- SSH_KEY must be a raw multi‑line private key, starting with "-----BEGIN OPENSSH PRIVATE KEY-----" (or legacy RSA). Do not wrap or JSON‑escape it.
- The key is written to ~/.ssh/deploy_key with chmod 600 and passed via key_path to appleboy actions to avoid ssh.ParsePrivateKey errors.
- If no key is available, provide SSH_PASSWORD. The pipeline fails early if neither is set.
