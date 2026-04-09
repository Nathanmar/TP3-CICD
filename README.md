# Data Mock API - TP3 CICD

Ce projet est une API REST de génération de données de test (Mock Data) développée en **Node.js** avec **TypeScript**. Il suit les principes de la **Clean Architecture** et utilise plusieurs patrons de conception (Design Patterns) pour assurer la flexibilité et la maintenabilité.

## 🚀 Fonctionnalités
- Génération de données variées (noms, UUID, nombres, textes) via **Faker.js**.
- Validation extensible des requêtes de génération.
- Structure modulaire respectant la séparation des préoccupations.

## 🏗️ Architecture & Patterns

### Clean Architecture
Le projet est découpé en couches :
1. **Domain** : Contient la logique métier pure (entités, stratégies de génération).
2. **Application** : Contient la logique applicative (validation des schémas, cas d'utilisation).
3. **Infrastructure** : Détails techniques (base de données, services externes, config).
4. **Presentation** : Points d'entrée de l'API (contrôleurs Express, routes).

### Design Patterns
- **Strategy Pattern** : Utilisé pour les différents types de générateurs de données (`StringGenerator`, `NumberGenerator`, etc.). Chaque type implémente une interface `DataGeneratorStrategy`.
- **Builder Pattern** : La classe `MockDataBuilder` permet d'assembler dynamiquement des objets complexes en fonction d'un schéma fourni.
- **Chain of Responsibility** : Utilisé pour la validation des requêtes (`ValidationHandler`). Chaque maillon vérifie un aspect spécifique (format du JSON, limites de quantité, types supportés).

## 🛠️ Installation & Utilisation

### Pré-requis
- Node.js (v18+)
- npm

### Installation
```bash
npm install
```

### Compilation
Pour transformer le TypeScript en JavaScript (dans le dossier `dist/`) :
```bash
npm run build
```

### Développement
Pour lancer le projet en mode watch (rechargement automatique) :
```bash
npm run dev
```

## 📜 Scripts disponibles
- `npm run build` : Compile le code source.
- `npm run dev` : Lance le serveur de développement.
- `npm start` : Lance l'application compilée.
- `npm run lint` : Vérifie la qualité du code.
