# Commandes Utiles - Data Mock Tool

Voici les commandes pour lancer, tester et valider le projet.

## 🚀 Développement
Lancer le projet avec rechargement automatique :
```bash
npm run dev
```
Accéder à l'interface : [http://localhost:3000](http://localhost:3000)

## 🧪 Tests Unitaires & Intégration (Jest)
Lancer la suite de tests complète :
```bash
npm test
```
Lancer les tests avec rapport de couverture (Coverage) :
```bash
npm run test:ci
```
*Le résultat s'affiche directement dans ton terminal.*

*Note : Le seuil de couverture est fixé à **70%**.*

## 🎭 Tests E2E (Playwright)
Lancer les scénarios de parcours utilisateur :
```bash
npx playwright test
```
**Pour voir le rapport Playwright (sur http://localhost:9323) :**
```bash
npx playwright show-report
```

## 🧹 Qualité & Build
Vérifier le code avec ESLint :
```bash
npm run lint
```
Compiler le projet pour la production :
```bash
npm run build
```
