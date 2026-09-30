import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  //CHANGES MADE IN REFERENCE TO 
  // Set up a new React project: Vite, TypeScript, ESLint, Prettier and pre-commit hooks
  // https://dev.to/denivladislav/set-up-a-new-react-project-vite-typescript-eslint-prettier-and-pre-commit-hooks-3abn
  // CHANGES ARE DENOTED AS "//REF"
  
  globalIgnores(['dist', 'recommended-type-checked.ts']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,

      //REF
      tseslint.configs.recommended,
      // ...tseslint.configs.recommendedTypeChecked,
      
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
