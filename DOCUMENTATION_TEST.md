# 📋 Tests - Data Mock REST API

> Fichier de référence rapide. Mis à jour au fil du projet.

---

## 🏗️ Stack & Architecture

- **Langage :** TypeScript (Node.js v20+)
- **Framework API :** Express.js
- **Architecture :** Clean Architecture (4 couches : Domain, Application, Infrastructure, Presentation)
- **Patterns :** Strategy, Builder, Chain of Responsibility
- **Lib données :** Faker.js

---

## 🧪 Tests

### Framework
- **Unitaires & Intégration :** Jest + ts-jest (ESM)
- **E2E :** Playwright (Chromium uniquement)
- **HTTP :** Supertest (pour les tests d'intégration)

### Commandes
```bash
npm test          # Tests sans couverture
npm run test:ci   # Tests avec couverture (mode CI, bloque si < 70%)
npx playwright test            # Tests E2E
npx playwright show-report     # Rapport HTML sur http://localhost:9323
```

### Structure des fichiers de test
```
tests/
├── unit/
│   ├── strategies.test.ts   # Teste les 4 stratégies (String, Number, UUID, Name)
│   └── builder.test.ts      # Teste MockDataBuilder (build, buildMany, empty)
├── integration/
│   └── api.test.ts          # Teste POST /api/mock via Supertest
└── e2e/
    └── data-generation.spec.ts  # Teste le frontend via Playwright
```

### Ce que chaque suite teste (exemples concrets)

#### `strategies.test.ts` (7 tests)
| Test | Ce qu'il vérifie |
|---|---|
| `StringGenerator` | Retourne bien un `string` non vide |
| `NumberGenerator` | Retourne bien un `number` |
| `UUIDGenerator` | Retourne un UUID valide (regex `/^[0-9a-f]{8}-...$/i`) |
| `NameGenerator` | Retourne un prénom + nom (string avec espace) |

#### `builder.test.ts` (3 tests)
| Test | Ce qu'il vérifie |
|---|---|
| `build()` avec schema | L'objet construit a bien les propriétés `testString` et `testNumber` |
| `buildMany(5)` | Retourne un tableau de 5 objets, chacun avec la clé `id` |
| `build()` vide | Retourne un objet `{}` sans erreur |

#### `api.test.ts` (4 tests — intégration via Supertest)
| Test | Ce qu'il vérifie |
|---|---|
| POST valide | `200` + tableau de 3 objets avec `id` et `name` |
| POST sans `schema` | `400` + erreur "Missing required property: 'schema'" |
| POST avec `count > 1000` | `400` + erreur "exceeds the maximum limit" |
| POST avec type inconnu | `400` + erreur "Unsupported type 'invalid_type'" |

#### `data-generation.spec.ts` (2 tests E2E — Playwright)
| Test | Ce qu'il vérifie |
|---|---|
| Génération valide | Remplit `#count`, clique `#generate-btn`, vérifie que le JSON retourné est un tableau de 5 |
| Count > 1000 | Vérifie que le message d'erreur s'affiche dans `#result-display` |

### Couverture actuelle (dernier run)
| Métrique | Valeur | Seuil CI |
|---|---|---|
| Statements | **94.2%** | ≥ 70% ✅ |
| Branches | **79.16%** | ≥ 70% ✅ |
| Functions | **100%** | ≥ 70% ✅ |
| Lines | **94.11%** | ≥ 70% ✅ |

**Test Suites :** 3 passées / 3 total | **Tests :** 11 passés / 11 total

### Fichiers non couverts à 100%
| Fichier | % Branches | Lignes non couvertes |
|---|---|---|
| `MaxLimitHandler.ts` | 66.66% | L.11, L.15 |
| `SchemaFormatHandler.ts` | 75% | L.8, L.16 |
| `MockController.ts` | 75% | L.38 |

---

## 🧹 Qualité de Code

### Linter & Formatter
- **ESLint** v10 avec règles personnalisées justifiées :
  - `@typescript-eslint/no-explicit-any: error` → Sécurité de type maximale
  - `@typescript-eslint/explicit-function-return-type: error` → Contrats d'API clairs
  - `complexity: ['error', 10]` → Limite la complexité cyclomatique
  - `prettier/prettier: error` → Formatage forcé via ESLint
- **Prettier** configuré via `.prettierrc`

### Commandes
```bash
npm run lint     # ESLint
npm run format   # Prettier --write
```

### Pre-commit Hook
- **Husky** v9 + **lint-staged**
- Déclenché sur `*.ts` uniquement (fichiers stagés)
- Actions : `eslint --fix` + `prettier --write`
- Config dans `package.json` sous `"lint-staged"`

---

## 🔁 Pipeline CI/CD (GitHub Actions)

### Fichier : `.github/workflows/ci.yml`
### Déclencheurs : Push & PR sur `main` et `develop`
### Concurrence : Annule les anciens runs sur la même branche

```
push/PR
   │
   ├─► 🧹 lint          → ESLint + Prettier --check
   │       │
   │       ├─► 🧪 test  → Jest + coverage ≥ 70% → upload artifact coverage/
   │       │       │
   │       │       ├─► 🎭 e2e        → Playwright Chromium → upload playwright-report/
   │       │       └─► 📊 sonarcloud → Quality Gate SonarCloud
   │       │
   │       └─► 🛡️ security → Snyk (échoue si HIGH ou CRITICAL)
```

### Jobs détaillés
| Job | Dépend de | Artifact uploadé |
|---|---|---|
| `lint` | — | — |
| `test` | `lint` | `coverage-report/` (7 jours) |
| `e2e` | `lint` + `test` | `playwright-report/` (7 jours) |
| `sonarcloud` | `test` | — |
| `security` | `lint` | `snyk-report/` (7 jours) |

---

## 📊 SonarCloud

- **Mode :** CI-based Analysis (Automatic Analysis désactivé)
- **Projet :** `Nathanmar_data-mock` / org `nathanmar`
- **Config :** `sonar-project.properties`
- **Sources :** `src/` | **Tests :** `tests/`
- **Exclusions :** `node_modules`, `dist`, `coverage`, `jest.config.js`, `playwright.config.ts`
- **Coverage :** lit `coverage/lcov.info` (généré par Jest avec reporter `lcov`)
- **Secret GitHub requis :** `SONAR_TOKEN`

---

## 🛡️ Sécurité des dépendances

- **Outil :** Snyk (`snyk/actions/node@master`)
- **Seuil :** Pipeline échoue sur **HIGH** ou **CRITICAL**
- **Secret GitHub requis :** `SNYK_TOKEN`

---

## 🌿 Git & Workflow

### Branches protégées
- `main` : Push direct interdit, PR obligatoire, approbation requise

### Conventional Commits utilisés
| Préfixe | Usage |
|---|---|
| `feat:` | Nouvelles fonctionnalités (Strategy, Builder, Chain, Frontend) |
| `test:` | Ajout/modification de tests |
| `chore:` | Configuration (ESLint, Prettier, Husky, Sonar) |
| `fix:` | Corrections (ex: pre-commit hook) |
| `ci:` | Modifications pipeline (GitHub Actions, Snyk) |

### Historique des PRs mergées
| PR | Branche | Contenu |
|---|---|---|
| #1 | `tests` | Tests unitaires, intégration, E2E + seuils couverture |
| #2 | `lint` | ESLint custom, Prettier, Husky, SonarCloud |
| #3 | `feat/ci-pipeline-sonar` | Pipeline GitHub Actions + Snyk |

---

## 🔑 Secrets GitHub requis

| Secret | Usage |
|---|---|
| `SONAR_TOKEN` | Analyse SonarCloud CI-based |
| `SNYK_TOKEN` | Scan de sécurité des dépendances |
| `GITHUB_TOKEN` | Automatique (fourni par GitHub Actions) |
