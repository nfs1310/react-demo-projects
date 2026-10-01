# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## Template Branch

This branch is the **centralized template for all projects**. It is not an application of its own — its purpose is to hold shared project configuration, development standards, and tooling in one place.

Configurations established here are intended to be **reusable defaults and a common baseline** for future projects. Centralizing them keeps projects consistent, removes repetitive setup work, and ensures that common development standards are applied the same way everywhere.

### Configuration maintained in this branch

- **ESLint** — `eslint.config.js` (flat config with type-aware TypeScript rules, React hooks/refresh rules, and Prettier integration).
- **Prettier** — `.prettierrc` and `.prettierignore`, enforced through the `prettier/prettier` lint rule.
- **TypeScript** — `tsconfig.json`, `tsconfig.app.json`, and `tsconfig.node.json`.
- **Build and tooling** — `vite.config.ts` (Vite, React plugin, React Compiler) and the `package.json` scripts (`dev`, `build`, `lint`, `preview`).
- **Git and ignore rules** — `.gitignore`.
- **Setup documentation** — [eslint-prettier.md](./eslint-prettier.md) explains how the ESLint and Prettier configuration is wired together.

Other shared configuration (for example editor settings or Git hooks) may be centralized here as it is introduced.

### Working with this branch

- **Use it as a starting point.** New projects should build on this branch — branch from it or copy the configuration files into the new project — instead of rebuilding the same setup from scratch.
- **Prefer centralizing over duplicating.** If a configuration is needed across projects, maintain it in this branch rather than copying and maintaining separate copies in each project.
- **Review shared changes carefully.** Changes here may become the baseline for future projects, so they should be made deliberately.
- **Keep it reusable.** Project-specific functionality should not be added here just because it is useful to one project; this branch is primarily for common, reusable configuration.
- **Changes are not propagated automatically.** Updating this branch does not update existing projects — those projects pull or copy the changes they want.

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.
You can also try [the experimental native React Compiler support in plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md#rust-react-compiler) by using `compiler: true` in the plugin options instead of using the Babel plugin.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

> Note: type-aware lint rules (`tseslint.configs.recommendedTypeChecked`) are already enabled in this branch, so this section is kept for reference and for projects that need stricter or additional rules.

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
