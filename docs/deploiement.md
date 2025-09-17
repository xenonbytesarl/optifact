# CI/CD : Construire et déployer les images Docker avec GitHub Actions (FR)

Ce document explique comment Optifact est construit et déployé sous forme d’images Docker via GitHub Actions, et comment préparer un serveur distant pour des déploiements automatisés.

Sommaire
- Aperçu
- Registre & nommage des images
- Fichiers ajoutés
- Secrets et variables GitHub
- Pré‑requis sur le serveur distant
- Première mise en place du serveur
- Cycle de vie du workflow CI/CD
- Déploiement manuel (workflow_dispatch)
- Stratégie de rollback
- Dépannage
- Variables d’environnement
- Développement local
- Notes de sécurité

Version anglaise disponible : docs/deployment.md

## Aperçu
- Le dépôt contient des Dockerfiles pour :
  - backend : docker/backend/Dockerfile
  - frontend : docker/frontend/Dockerfile
- Le workflow GitHub Actions .github/workflows/cicd.yml construit et pousse les deux images vers un registre (GHCR par défaut) avec les tags :
  - latest
  - SHA du commit (ex. 7c3f2ab) ou le tag Git poussé (ex. v1.2.3)
- Après le push, le workflow se connecte au serveur distant via SSH et exécute Docker Compose avec docker-compose.deploy.yaml afin de récupérer et lancer les nouvelles images.

## Registre & nommage des images
Par défaut, le workflow publie vers GitHub Container Registry (GHCR) : ghcr.io.

- Image backend : ghcr.io/<IMAGE_NAMESPACE>/optifact-backend:<TAG>
- Image frontend : ghcr.io/<IMAGE_NAMESPACE>/optifact-frontend:<TAG>

Vous pouvez surcharger :
- REGISTRY via la variable de dépôt vars.REGISTRY
- IMAGE_NAMESPACE via la variable de dépôt vars.IMAGE_NAMESPACE (par défaut l’organisation/utilisateur propriétaire du dépôt)

## Fichiers ajoutés
- .github/workflows/cicd.yml — Pipeline CI/CD (build, push, deploy)
- docker-compose.deploy.yaml — Fichier Compose dédié au déploiement (utilise des images pré‑construites)
- scripts/deploy/remote-deploy.sh — Script d’aide exécuté sur le serveur (optionnel, le workflow peut déployer sans)
- .env.example — Exemple d’environnement à copier sur le serveur en .env
- docs/deploiement.md — Cette documentation (FR)

Le fichier docker-compose.yaml existant est conservé pour le développement local. Pour le déploiement, docker-compose.deploy.yaml est utilisé pour garantir que les images sont tirées depuis le registre (et non reconstruites).

## Secrets et variables GitHub
Configurez les éléments suivants dans votre dépôt GitHub (Settings » Secrets and variables » Actions).

Secrets requis :
- SSH_HOST — IP publique ou nom d’hôte du serveur
- SSH_USER — Utilisateur SSH
- SSH_KEY — Clé privée (contenu PEM) ayant accès à l’utilisateur sur le serveur

Secrets optionnels/conditionnels :
- SSH_PORT — Port SSH (par défaut 22)
- REGISTRY_USERNAME — Identifiant du registre. Pour GHCR vous pouvez omettre (l’action utilisera github.actor)
- REGISTRY_PASSWORD — Jeton/mot de passe du registre. Pour GHCR vous pouvez omettre et utiliser GITHUB_TOKEN avec la permission packages:write

Variables de dépôt (vars) :
- REGISTRY — Par défaut ghcr.io
- IMAGE_NAMESPACE — Par défaut propriétaire du dépôt
- SERVER_APP_DIR — Par défaut /opt/optifact (répertoire cible sur le serveur)
- ENV_FILE_PATH — Par défaut /opt/optifact/.env

Permissions : Le workflow demande packages:write pour pouvoir pousser des images vers GHCR.

## Pré‑requis sur le serveur distant
Sur le serveur cible (Ubuntu/Debian/RHEL, etc.) :
- Docker Engine installé
- Docker Compose V2 installé (commande docker compose version)
- Un utilisateur avec accès SSH et les permissions pour exécuter docker (membre du groupe docker ou usage de sudo dans le workflow si nécessaire)
- Un répertoire pour l’application (par défaut /opt/optifact)
- Ports ouverts : 8080 (backend), 8081 (frontend SSR), et 5433 si vous exposez Postgres pour un accès externe (optionnel)

## Première mise en place du serveur
1. Créez le répertoire applicatif :
   - sudo mkdir -p /opt/optifact
   - sudo chown -R <user>:<group> /opt/optifact
2. Optionnel : préparez un fichier d’environnement en utilisant le template :
   - Copiez .env.example sur le serveur en /opt/optifact/.env et ajustez les valeurs (identifiants DB, etc.)
   - Si vous sautez cette étape, le workflow générera un .env minimal avec des valeurs par défaut lors du premier déploiement
3. Assurez-vous que l’utilisateur peut exécuter docker et docker compose sans demandes de mot de passe (ajoutez-le au groupe docker ou configurez sudo).

## Cycle de vie du workflow CI/CD
Déclencheurs : push sur main/master, tags (v*.*.*), et exécution manuelle workflow_dispatch.

Jobs :
1) build-and-push
   - Connexion au registre
   - Build de docker/backend/Dockerfile et docker/frontend/Dockerfile
   - Tags : latest et tag calculé (SHA du commit, saisie manuelle, ou tag Git)
   - Push des images vers REGISTRY/IMAGE_NAMESPACE

2) deploy (needs: build-and-push)
   - Copie vers le serveur : docker-compose.deploy.yaml, répertoire docker/ (non strictement requis pour le déploiement), et scripts
   - Connexion au registre sur le serveur
   - Export de IMAGE_TAG dans l’environnement
   - docker compose -f docker-compose.deploy.yaml --env-file .env up -d

Calcul du tag :
- TAG par défaut = SHA du commit
- Si workflow_dispatch avec input image_tag → utilise cette valeur
- Si la ref est un tag Git comme refs/tags/v1.2.3 → utilise v1.2.3

## Déploiement manuel (workflow_dispatch)
Depuis l’onglet Actions, lancez le workflow manuellement. Vous pouvez fournir optionnellement image_tag pour déployer une version spécifique (ex. v1.2.3) si elle a déjà été construite et poussée.

## Stratégie de rollback
- Pour revenir à une version précédente, relancez le workflow via workflow_dispatch et renseignez image_tag avec le tag souhaité (SHA de commit ou tag de release), ou
- Sur le serveur, exécutez :
  - export IMAGE_TAG=v1.2.3
  - docker compose -f docker-compose.deploy.yaml --env-file .env up -d

## Dépannage
- Permission refusée lors de l’exécution de docker sur le serveur :
  - Vérifiez que SSH_USER est dans le groupe docker, ou modifiez le workflow pour exécuter docker avec sudo
- docker compose introuvable :
  - Installez Docker Compose V2 (la commande doit être docker compose, et non docker-compose)
- Échec lors du pull des images (401 Unauthorized) :
  - Vérifiez les identifiants du REGISTRY. Pour GHCR, assurez-vous que REGISTRY_PASSWORD est un PAT avec write:packages. Alternativement, utilisez GITHUB_TOKEN avec les permissions par défaut si vous poussez au sein de la même organisation
- Le backend ne parvient pas à se connecter à la base de données :
  - Vérifiez les valeurs du .env (DB_HOST/DB_PORT/DB_NAME/DB_USERNAME/DB_PASSWORD)
- Le frontend n’est pas accessible :
  - Assurez-vous que le port 8081 est ouvert dans le pare-feu/groupes de sécurité

## Variables d’environnement
- Application/runtime :
  - PROFILE, BACKEND_PORT
  - DB_HOST, DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD
  - CLAIM_FILE_ROOT_DIR
- Déploiement/compose :
  - IMAGE_TAG (défini par le pipeline)
  - REGISTRY (ghcr.io par défaut), IMAGE_NAMESPACE
  - SERVER_APP_DIR (chemin sur le serveur), ENV_FILE_PATH

## Développement local
- docker-compose.yaml reste destiné à l’usage local.
- Vous pouvez copier .env.example en .env puis lancer :
  - docker compose --env-file .env up -d --build

## Notes de sécurité
- Conservez SSH_KEY et tout jeton de registre dans les Secrets GitHub.
- Limitez les permissions de l’utilisateur du serveur et faites tourner les clés régulièrement.
- Validez les entrées lors de l’utilisation de workflow_dispatch.
