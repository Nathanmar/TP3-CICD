import js from '@eslint/js'
import ts from 'typescript-eslint'
import prettierPlugin from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'

export default ts.config(
  {
    ignores: ['dist', 'coverage', 'node_modules', 'public'],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  prettierConfig,
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error',

      // Interdire l'utilisation du type 'any' pour garantir une sécurité de type maximale et éviter les bugs à l'exécution.
      '@typescript-eslint/no-explicit-any': 'error',

      // Imposer un type de retour explicite sur toutes les fonctions pour rendre les contrats d'API et la logique métier plus lisibles et faciles à maintenir.
      '@typescript-eslint/explicit-function-return-type': 'error',

      // Limiter la complexité cyclomatique à 10 pour forcer le découpage du code en fonctions plus simples et lisibles.
      complexity: ['error', 10],
    },
  },
)
