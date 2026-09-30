import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';

export default defineConfig([
  //CHANGES MADE IN REFERENCE TO
  // Set up a new React project: Vite, TypeScript, ESLint, Prettier and pre-commit hooks
  // https://dev.to/denivladislav/set-up-a-new-react-project-vite-typescript-eslint-prettier-and-pre-commit-hooks-3abn
  // CHANGES ARE DENOTED AS "//REF"

  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,

      // tseslint.configs.recommended,
      //REF
      tseslint.configs.recommendedTypeChecked,

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
  //REF
  // eslint-plugin-prettier's own `configs.recommended` is broken for flat config
  // (it uses the legacy `plugins: ["prettier"]` string form), so its contents are
  // inlined here instead. Must stay last: eslint-config-prettier disables rules
  // that conflict with Prettier, so a config after this would re-enable them.
  {
    plugins: { prettier: eslintPluginPrettier },
    rules: {
      ...eslintConfigPrettier.rules,
      'prettier/prettier': 'error',
      'arrow-body-style': 'off',
      'prefer-arrow-callback': 'off',
    },
  },
]);
