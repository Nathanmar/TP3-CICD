# 🐳 Docker - Data Mock REST API

> Documentation de la conteneurisation du projet.

---

## 🏗️ Architecture Docker

L'application est conteneurisée à l'aide d'un **Multi-stage build** pour séparer l'environnement de compilation de l'environnement d'exécution, garantissant ainsi une image finale ultra-légère et sécurisée.

### Stage 1 : Builder (`node:20-alpine`)
- Installation de toutes les dépendances (y compris les devDependencies) via `npm ci`.
- Compilation du code TypeScript vers du JavaScript dans le dossier `dist/`.
- **Optimisation clé :** Exécution de `npm prune --omit=dev` pour supprimer toutes les dépendances de développement (TypeScript, Jest, ESLint, etc.) directement dans ce stage.

### Stage 2 : Production (`alpine:3.19`)
- **Image de base :** Alpine Linux pur (sans le package `node` complet).
- **Runtime :** Installation manuelle et minimale de l'exécutable `nodejs` via `apk add --no-cache nodejs` (sans `npm`, `yarn`, ni autres utilitaires inutiles en production).
- **Contenu :** Récupération exclusive du code compilé (`dist/`), des dépendances nettoyées (`node_modules/`), et du fichier de configuration (`package.json`) depuis le builder.

---

## 📊 Taille et Optimisation

- Taille de l'image de base (`node:20-alpine`) : ~140 MB
- **Taille de notre image finale optimisée : ~133 MB**
- Objectif initial : `< 200 MB` ✅ 
- **Bénéfice :** L'absence de `npm` et d'outils de build dans l'image finale réduit considérablement la surface d'attaque et le temps de transfert de l'image.

---

## 🛡️ Sécurité de l'image

1. **Utilisateur Non-Root :** L'application s'exécute sous un utilisateur dédié `appuser` (créé via `addgroup` et `adduser`), évitant toute élévation de privilèges en cas de compromission.
2. **HEALTHCHECK :** Intégré nativement dans le Dockerfile. Docker vérifie toutes les 30 secondes que l'API répond correctement sur la route `GET /health`.
3. **.dockerignore :** Exclut strictement le code source TypeScript, les tests, les rapports de couverture, le dossier `.git`, et les fichiers `.env` du contexte de build.
4. **Trivy Image Scan :** L'image Docker est scannée automatiquement dans le pipeline CI/CD (Job 7) pour détecter les vulnérabilités liées à l'OS (Alpine) et aux librairies. Le pipeline est configuré pour **échouer si une vulnérabilité de sévérité CRITIQUE est détectée**.

---

## 🚀 Utilisation locale (Docker Compose)

Un fichier `docker-compose.yml` est fourni pour lancer l'application en une seule commande en environnement local.

```bash
# Lancer l'application en arrière-plan (construit l'image si nécessaire)
docker-compose up -d --build

# Voir les logs du conteneur
docker-compose logs -f

# Arrêter le conteneur
docker-compose down
```

### Configuration Compose
- **Réseau :** Utilisation d'un réseau dédié (`app-network`).
- **Ports :** Redirection du port hôte `3001` vers le port conteneur `3000` (pour éviter les conflits avec un serveur de dev local `npm run dev` tournant déjà sur le port 3000).
- **Variables d'environnement :** Gérées via un fichier local `.env` (non commité, basé sur le template `.env.example`).
- **Redémarrage :** Politique `restart: unless-stopped`.

---

## 🔁 Intégration CI/CD

Le workflow GitHub Actions (`ci.yml`) inclut 2 jobs spécifiques à Docker :

1. **Job `docker` (🐳 Docker Build) :**
   - Construit l'image Docker à chaque push/PR.
   - Tag l'image avec le SHA du commit courant.
   - Utilise le cache GitHub Actions (`cache-to`/`cache-from`) pour accélérer considérablement les builds suivants.
   - Exécute `docker image inspect` pour afficher publiquement la taille de l'image finale dans les logs GitHub.

2. **Job `trivy` (🔍 Trivy Image Scan) :**
   - Dépend de la réussite du build Docker.
   - Scanne l'image compilée avec AquaSecurity Trivy.
   - Génère un rapport SARIF uploadé en tant qu'artifact.
