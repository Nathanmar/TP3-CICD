# Présentation orale — Data Mock API

> API REST de génération de données fictives, construite en TypeScript/Node.js avec une architecture propre et une chaîne CI/CD complète.

---

## 1. Code & Design Patterns — /4

**Architecture :** Clean Architecture en 4 couches strictement séparées.

```
src/
├── domain/          → Logique métier pure (strategies, builders)
├── application/     → Cas d'usage (validation, orchestration)
├── infrastructure/  → Détails techniques (logger pino)
└── presentation/    → Express (routes, contrôleurs)
```

**3 patterns justifiés :**

| Pattern | Où | Pourquoi |
|---|---|---|
| **Strategy** | `StringGenerator`, `NumberGenerator`, `UUIDGenerator`, `NameGenerator` | Ajouter un nouveau type de données sans toucher au code existant (Open/Closed) |
| **Builder** | `MockDataBuilder` | Construire des objets complexes dynamiquement à partir d'un schéma JSON arbitraire |
| **Chain of Responsibility** | `SchemaFormatHandler → MaxLimitHandler → TypeSupportedHandler` | Chaîner les validations de façon indépendante et extensible |

**Principes SOLID respectés :**
- Single Responsibility : chaque classe a une responsabilité unique
- Open/Closed : ajouter un type = créer une classe, pas modifier l'existant
- Dependency Inversion : les handlers dépendent de l'interface `ValidationHandler`, pas des implémentations

---

## 2. Tests — /3

**3 niveaux de tests** couvrant toute la pyramide :

```
tests/
├── unit/         → strategies.test.ts, builder.test.ts
├── integration/  → api.test.ts (Supertest)
└── e2e/          → data-generation.spec.ts (Playwright)
```

**Structure AAA systématique :**
```ts
// Arrange
const generator = new UUIDGenerator()
// Act
const result = generator.generate()
// Assert
expect(result).toMatch(/^[0-9a-f]{8}-...$/)
```

**Ce que testent les suites :**

- **Unitaires (7 tests)** : chaque stratégie retourne le bon type (string, number, UUID valide, nom)
- **Builder (3 tests)** : `build()`, `buildMany(5)`, et cas limite objet vide
- **Intégration (4 tests)** : POST `/api/mock` → 200 valide, 400 si schema manquant, count > 1000, type inconnu
- **E2E (2 tests)** : l'utilisateur remplit le formulaire, clique, vérifie le JSON affiché

**Couverture : ~94%** (seuil configuré à 70% dans `jest.config.js`, bloquant en CI)

---

## 3. Qualité automatisée — /2

- **ESLint** avec règles personnalisées : `no-explicit-any`, `explicit-function-return-type`, complexité cyclomatique limitée à 10
- **Prettier** formatage forcé via ESLint
- **Husky + lint-staged** : hook pre-commit qui lance `eslint --fix` + `prettier --write` sur les fichiers stagés uniquement
- **SonarCloud** : analyse statique CI-based (0 bugs, 0 vulnérabilités, duplication < 3%, couverture ≥ 70%)
- **Snyk** : scan des dépendances, pipeline bloqué si vulnérabilité HIGH ou CRITICAL

---

## 4. Git & Conventions — /2

- **Conventional Commits** : `feat:`, `fix:`, `ci:`, `chore:`, `test:`, `docs:`
- **Branche `main` protégée** : push direct impossible, PR obligatoire avec approbation
- **5 Pull Requests mergées** :
  1. `tests` → unitaires, intégration, E2E + seuils couverture
  2. `lint` → ESLint custom, Prettier, Husky, SonarCloud
  3. `feat/ci-pipeline-sonar` → pipeline GitHub Actions + Snyk
  4. `feat/docker-configuration` → Dockerfile, Trivy, Docker Compose
  5. `feat/observability` → logger pino, `/metrics`, Terraform, CD ghcr.io

---

## 5. Docker — /2

**Multi-stage build** : 2 stages pour séparer compilation et exécution.

```dockerfile
FROM node:20-alpine AS builder   # Compile le TypeScript
  RUN npm ci && npm run build
  RUN npm prune --omit=dev       # Supprime les devDependencies

FROM alpine:3.19 AS production   # Image finale ultra-légère
  RUN apk add --no-cache nodejs  # Runtime uniquement, sans npm
  COPY --from=builder ...
  USER appuser                   # Utilisateur non-root
  HEALTHCHECK CMD wget /health
```

**Résultats :**
- Taille image : **133 MB** (vs 238 MB sans optimisation, vs ~1 GB sans multi-stage)
- Aucun secret dans l'image
- `.dockerignore` : exclut `node_modules`, `.git`, `tests/`, `.env`, `coverage/`

**Docker Compose** : dev local sur le port 3001, réseau dédié `app-network`, restart policy, healthcheck aligné.

**Trivy** : scan de l'image dans la CI, pipeline bloqué sur vulnérabilité CRITIQUE.

---

## 6. Pipeline CI/CD — /3  ⭐ (le plus important)

**8 jobs** organisés avec dépendances, parallélisme et cache :

```
push / PR
    │
    ├──► lint ──────────────────────────────────┐
    │       │                                   │
    │       ├──► test ──► e2e                   ├──► docker ──► trivy ──► deploy*
    │       │        └──► sonarcloud            │
    │       └──► security (Snyk)               ─┘
```

**Détail des jobs :**

| Job | Rôle | Déclenché après |
|---|---|---|
| `lint` | ESLint + Prettier check | — |
| `test` | Jest + coverage ≥ 70% → artifact `coverage/` | `lint` |
| `e2e` | Playwright Chromium → artifact `playwright-report/` | `lint` + `test` |
| `sonarcloud` | Quality Gate SonarCloud | `test` |
| `security` | Snyk — bloque sur HIGH/CRITICAL | `lint` |
| `docker` | Build image + affiche taille | `lint` |
| `trivy` | Scan CVE image — bloque sur CRITICAL | `docker` |
| `deploy` | Push sur `ghcr.io` (**CD**) — main uniquement | `trivy` |

**Points techniques :**
- **Cache** : `actions/setup-node` avec cache npm + cache GHA pour Docker layers
- **Artifacts** : `coverage/`, `playwright-report/`, `snyk-report/`, `trivy-report/` conservés 7 jours
- **Concurrence** : `cancel-in-progress: true` — un seul run actif par branche
- **CD** : sur merge dans `main`, l'image est taguée avec le SHA du commit et poussée sur `ghcr.io/nathanmar/data-mock:latest`

---

## 7. Infrastructure as Code — /2

**Terraform** — déploiement sur AWS ECS Fargate :

```
terraform/
├── main.tf       → ECS Cluster, Task Definition, Service, Security Group, IAM, CloudWatch
├── variables.tf  → région, image Docker, VPC, subnets
└── outputs.tf    → cluster name, service name, log group
```

**Architecture déployée :**
```
ghcr.io image → ECS Fargate Task (256 CPU / 512 MB)
                      │
               Security Group (inbound :3000)
                      │
               CloudWatch Logs /ecs/data-mock
```

> Non appliqué faute de compte AWS dans le cadre du TP, mais le code est complet, valide et prêt à être exécuté avec `terraform apply`.

---

## 8. Monitoring & Observabilité — /1

**3 éléments :**

**Health check** — `GET /health`
```json
{ "status": "ok" }
```
Utilisé par Docker (`HEALTHCHECK`) et ECS pour redémarrer automatiquement le conteneur si l'app plante.

**Metrics** — `GET /metrics`
```json
{
  "uptime_seconds": 3600,
  "version": "1.0.0",
  "node_version": "v20.20.2",
  "memory_mb": 42,
  "timestamp": "2026-06-12T09:30:00.000Z"
}
```

**Logs JSON structurés** — `pino`
```json
{"level":"info","time":"2026-06-12T09:30:00.000Z","method":"POST","url":"/api/mock","msg":"incoming request"}
```
Parseable par Datadog, CloudWatch Insights, Grafana Loki — pas besoin de regex sur des chaînes de caractères.

---

## 9. Documentation & Justifications — /1

| Fichier | Contenu |
|---|---|
| `README.md` | Présentation projet, instructions d'installation et d'utilisation |
| `DOCUMENTATION_TEST.md` | Détail des 3 suites de tests, couverture, commandes |
| `DOCUMENTATION_DOCKER.md` | Architecture multi-stage, optimisation taille, sécurité |
| `DOCUMENTATION_INFRA.md` | Terraform ECS Fargate, monitoring pino + CloudWatch |

Chaque choix technique est justifié : pourquoi Alpine, pourquoi pino, pourquoi ECS Fargate, pourquoi chaque règle ESLint, pourquoi la Chain of Responsibility pour la validation.
