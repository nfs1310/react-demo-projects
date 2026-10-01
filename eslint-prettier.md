# ESLint and Prettier Setup

This document explains how ESLint and Prettier are installed, configured, and integrated in this
project. It is written as a factual reference: everything described here was read from the files
currently in the repository, and anything that is _not_ configured is called out explicitly.

The short version: ESLint answers "is this code correct?", Prettier answers "does this code look
the same everywhere?", and `eslint-plugin-prettier` runs Prettier as part of the ESLint run so the
developer only has to run one command.

---

## 1. Why ESLint and Prettier?

### ESLint

ESLint reads the code as an Abstract Syntax Tree (AST) rather than as text, which means it can
reason about meaning, not just appearance. In this project it is used to:

- Catch likely bugs: a promise that is created and never awaited, a value used before it is
  defined, an accidental `any` that defeats the type system.
- Detect problematic patterns: mutating React state directly, calling hooks outside a component,
  violating the rules of hooks.
- Enforce TypeScript best practices: unused locals, unnecessary type assertions, empty object
  types that silently widen from `{}`.
- Enforce React-specific correctness: hook dependency arrays, components that export more than a
  component (which breaks Fast Refresh).
- Keep behaviour consistent across the team without anyone having to review style by hand.

### Prettier

Prettier has no opinion about code quality. It is a deterministic formatter: given the same input
and the same options, it always produces byte-identical output. It handles:

- Indentation and alignment.
- Quotes (`'` vs `"`).
- Line width and wrapping.
- Trailing commas.
- Semicolons.
- Line endings.
- Trailing whitespace and final newlines.

The practical value is that formatting stops being a topic of code review. Reviewers discuss
logic; the formatter handles the layout.

> **ESLint primarily analyzes code quality and coding rules, while Prettier primarily handles code
> formatting.**

### Why use both

Historically the two tools overlapped: ESLint shipped stylistic rules (`indent`, `quotes`,
`semi`) that competed with Prettier and frequently disagreed with it. Running both naively
produced contradictory errors on the same line. Modern practice separates the concerns — ESLint
for semantics, Prettier for layout — and then wires them together so there is a single command and
a single source of truth. That is exactly the arrangement used here, described in
[Section 9](#9-eslint-and-prettier-integration).

---

## 2. Project Environment

Versions below are the ranges declared in `package.json` and the exact versions currently resolved
in `node_modules`.

| Item                          | Declared in `package.json` | Currently installed |
| ----------------------------- | -------------------------- | ------------------- |
| React                         | `^19.2.8`                  | 19.3.0              |
| react-dom                     | `^19.2.8`                  | 19.3.0              |
| TypeScript                    | `~6.0.2`                   | 6.0.3               |
| Node.js (local machine)       | not pinned                 | v24.21.0            |
| npm (local machine)           | not pinned                 | 11.19.0             |
| Package manager               | npm                        | `package-lock.json` |
| Vite                          | `^8.3.0`                   | 8.3.1               |
| ESLint                        | `^10.10.0`                 | 10.11.0             |
| `@eslint/js`                  | `^10.0.1`                  | 10.0.1              |
| `typescript-eslint`           | `^8.69.0`                  | 8.71.0              |
| `eslint-plugin-react-hooks`   | `^7.1.1`                   | 7.1.1               |
| `eslint-plugin-react-refresh` | `^0.5.6`                   | 0.5.7               |
| `eslint-config-prettier`      | `^10.1.8`                  | 10.1.8              |
| `eslint-plugin-prettier`      | `^5.5.6`                   | 5.5.6               |
| `prettier`                    | `^3.9.9`                   | 3.9.9               |
| `globals`                     | `^17.12.0`                 | 17.12.0             |

Other relevant facts:

- Language: **TypeScript + JSX** (`.ts` / `.tsx`). There is no JavaScript application code.
- Module system: **ESM**. `package.json` sets `"type": "module"`, which is why `eslint.config.js`
  uses `import` / `export default` instead of `require` / `module.exports`.
- Bundler: **Vite 8**, with `@vitejs/plugin-react` and `babel-plugin-react-compiler` (the React
  Compiler is enabled in `vite.config.ts`).
- Source directory: `src/`. `src/App.tsx` and `src/main.tsx` are the only application files.
- `tsconfig.json` is a solution-style file that references `tsconfig.app.json` (covers `src`) and
  `tsconfig.node.json` (covers `vite.config.ts`).

---

## 3. Installing ESLint

ESLint is **already installed**. Nothing needs to be installed to run the linter today. This
section documents the packages that are present and what each one contributes.

```bash
npm install -D eslint @eslint/js typescript-eslint eslint-plugin-react-hooks eslint-plugin-react-refresh globals
```

- `eslint` — the linter engine and flat-config loader.
- `@eslint/js` — the official JavaScript recommended rule set (`js.configs.recommended`).
- `typescript-eslint` — the TypeScript ESLint meta-package. It supplies the parser plus the
  recommended, type-checked, and stylistic rule sets.
- `eslint-plugin-react-hooks` — React Hooks correctness rules.
- `eslint-plugin-react-refresh` — keeps modules compatible with Vite Fast Refresh.
- `globals` — a lookup table of environment globals (`browser`, `node`, etc.) so that `window`,
  `document`, and `process` are not reported as undefined.

### Why the type-aware rule set

The project's history is worth noting because it explains the current configuration. The initial
setup used `tseslint.configs.recommended` (non-type-aware). It was changed to
`tseslint.configs.recommendedTypeChecked` in commit `05644ff` ("ESLint (for catching bugs)
configured"), following the approach described in the
[dev.to article referenced in `eslint.config.js`](https://dev.to/denivladislav/set-up-a-new-react-project-vite-typescript-eslint-prettier-and-pre-commit-hooks-3abn).
The change was kept in commit `106711c`, which added the `parserOptions.project` entries that
type-aware rules require.

The difference matters: type-aware rules can follow a value's declared type, so they catch problems
that a purely syntactic rule cannot — for example
`@typescript-eslint/no-floating-promises`, which is enabled in this project and only works with
type information.

The cost of type-aware linting is that every linted file must be included in a `tsconfig.json`
referenced by `parserOptions.project`. That is why `vite.config.ts` is included even though it is
not application code — excluding it would produce a parsing error.

---

## 4. Configuring ESLint

### Format and location

The project uses **ESLint Flat Config**, located at `eslint.config.js` in the repository root.

Flat Config is an array of configuration objects. Objects later in the array override earlier ones
for the files they match. There is no `.eslintrc*` file and no `root: true` concept; `.eslintrc`
format is not used anywhere in this repository.

Because `"type": "module"` is set in `package.json`, the config file is loaded as ESM, which is why
it uses `import` statements and `export default`.

### The complete config file

```js
// eslint.config.js
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
```

### Section by section

#### `globalIgnores(['dist'])`

`dist` is the Vite build output. It is generated, minified, and not meant to be edited. Linting it
would produce noise, not signal, and formatting it would be pointless because it is overwritten on
every build. `globalIgnores` applies to every other config object in the array, so nothing in the
file needs to repeat it.

Commit `99bdbb5` removed a duplicate `ignores: [dist]` entry that had been added inside the
TypeScript block in commit `05644ff`. That entry used the bare identifier `dist` instead of the
string `'dist'`, which crashed the config loader before linting began.

ESLint also ignores `**/node_modules/` and `.git/` by default; those defaults are not restated here.

#### The TypeScript/React block — `files: ['**/*.{ts,tsx}']`

This block applies only to `.ts` and `.tsx` files. The `extends` array is expanded in order, so
later presets layer on top of earlier ones:

| Extends                                   | Contributes                                                               |
| ----------------------------------------- | ------------------------------------------------------------------------- |
| `js.configs.recommended`                  | Core correctness rules for JavaScript syntax that also applies to TS/TSX. |
| `tseslint.configs.recommendedTypeChecked` | Type-aware TypeScript rules. Requires `parserOptions.project`.            |
| `reactHooks.configs.flat.recommended`     | React Hooks rules (see [Section 5](#5-eslint-rules)).                     |
| `reactRefresh.configs.vite`               | Fast Refresh compatibility rules.                                         |

`languageOptions.globals: globals.browser` declares browser globals (`window`, `document`,
`fetch`, …) so that `no-undef`-style checks do not flag them. Note that this block is scoped to
`.ts`/`.tsx`, so `eslint.config.js` itself is not linted with these globals — which is why
`eslint.config.js` receives no browser globals and would not be checked against them.

`parserOptions.project` lists both `tsconfig.node.json` and `tsconfig.app.json`. Type-aware rules
need a type program, and the type program only covers files included by those configs. `src/` is
covered by `tsconfig.app.json`; `vite.config.ts` is covered by `tsconfig.node.json`.

`tsconfigRootDir: import.meta.dirname` tells the type-aware parser where those relative paths
resolve from — the directory containing `eslint.config.js`. Without it, type-aware rules fail when
the linter is invoked from a different working directory.

#### The Prettier block — must stay last

This object has no `files` key, so it applies to every linted file, including `.js` files.

- `...eslintConfigPrettier.rules` spreads in all the stylistic ESLint rules that conflict with
  Prettier, set to `off`. See [Section 9](#9-eslint-and-prettier-integration).
- `'prettier/prettier': 'error'` runs Prettier as an ESLint rule.
- `'arrow-body-style': 'off'` and `'prefer-arrow-callback': 'off'` are set explicitly. These are
  already disabled by `eslint-config-prettier`, so the two lines are explicit rather than strictly
  necessary; they document intent and protect against the ordering changing.

**Ordering matters.** Flat Config merges later objects over earlier ones. If any config appeared
after this one and re-enabled a formatting rule such as `semi` or `quotes`, the two tools would
start reporting conflicting errors on the same line. Keep this block last.

### Why the Prettier config is inlined

Commit `99bdbb5` explains this. `eslint-plugin-prettier` ships a `configs.recommended` object that
uses the legacy string form `plugins: ["prettier"]`. That form was valid in the old `.eslintrc`
system but is rejected by the flat config loader. The plugin's contents are therefore inlined as a
plain flat config object. The alternative — importing `eslint-plugin-prettier/recommended`, which
is flat-config compatible — is currently unused in this project.

### Files included and ignored

Running `npm run lint` currently lints exactly four files:

```text
eslint.config.js
src/App.tsx
src/main.tsx
vite.config.ts
```

`eslint.config.js` is included because ESLint's default glob covers `**/*.js`. It receives the
Prettier rules but not the TypeScript block, so only `prettier/prettier` is active for it — its
printed config has one active rule, versus 495 total resolved rules for `src/App.tsx`.

Ignored: `dist` (explicit), plus `node_modules` and `.git` (ESLint defaults). There is no
`.eslintignore` file; `.eslintignore` is not supported in flat config.

---

## 5. ESLint Rules

The following are the rules that shape day-to-day development. Rules inherited from large
third-party presets are summarised rather than listed individually — `src/App.tsx` resolves to 495
configured rules in total, and only a fraction of them are ever triggered.

### Rules resolved for `src/App.tsx`

Verified with `npx eslint --print-config src/App.tsx`. Values are shown as ESLint's own severity
numbers: `2` = `error`, `1` = `warn`, `0` = `off`.

| Rule                                      | Severity | Purpose                                                                                                                                                                 |
| ----------------------------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `prettier/prettier`                       | error    | Reports any deviation from the Prettier configuration.                                                                                                                  |
| `@typescript-eslint/no-floating-promises` | error    | A promise is created but not awaited or returned. Type-aware.                                                                                                           |
| `@typescript-eslint/no-unused-vars`       | error    | Unused variables, including type-only imports.                                                                                                                          |
| `@typescript-eslint/no-explicit-any`      | error    | Explicit `any` erases type safety.                                                                                                                                      |
| `@typescript-eslint/no-empty-object-type` | error    | `{}` types accept almost anything and should be `object` or `unknown`.                                                                                                  |
| `react-hooks/rules-of-hooks`              | error    | Hooks may only be called from React functions, at the top level.                                                                                                        |
| `react-hooks/set-state-in-render`         | error    | Setting state during render causes an infinite loop.                                                                                                                    |
| `react-hooks/set-state-in-effect`         | error    | Synchronous `setState` in an effect; prefer deriving during render.                                                                                                     |
| `react-hooks/exhaustive-deps`             | warn     | The dependency array of `useEffect` / `useMemo` / `useCallback` is incomplete.                                                                                          |
| `react-hooks/immutability`                | error    | Mutating a value React considers immutable.                                                                                                                             |
| `react-hooks/purity`                      | error    | Side effects inside render or other pure functions.                                                                                                                     |
| `react-hooks/static-components`           | error    | A component is redefined on every render, defeating memoization.                                                                                                        |
| `react-hooks/use-memo`                    | error    | Incorrect manual memoization.                                                                                                                                           |
| `react-hooks/preserve-manual-memoization` | error    | Manual memoization the compiler cannot preserve.                                                                                                                        |
| `react-hooks/refs`                        | error    | Reading or writing `ref.current` during render.                                                                                                                         |
| `react-hooks/error-boundaries`            | error    | `try`/`catch` around hooks and renders.                                                                                                                                 |
| `react-hooks/globals`                     | error    | Mutating a global during render.                                                                                                                                        |
| `react-hooks/incompatible-library`        | warn     | A known-incompatible library usage pattern.                                                                                                                             |
| `react-hooks/config`                      | error    | Component or hook is configured incorrectly.                                                                                                                            |
| `react-hooks/unsupported-syntax`          | warn     | Syntax the compiler cannot handle.                                                                                                                                      |
| `react-refresh/only-export-components`    | error    | A module exporting a component also exports something else, which breaks Fast Refresh. Configured with `allowConstantExport: true` and `allowCompoundComponents: true`. |
| `indent`                                  | off      | Disabled by `eslint-config-prettier`; Prettier owns indentation.                                                                                                        |
| `quotes`                                  | off      | Disabled by `eslint-config-prettier`; Prettier owns quotes.                                                                                                             |
| `no-unused-vars` (core)                   | off      | Superseded by the TypeScript-aware version.                                                                                                                             |

Two observations from that list:

- `react-hooks/exhaustive-deps` is a **warning**, not an error. It is often a false positive when a
  value is intentionally not a dependency, so downgrading it to `warn` lets the developer notice
  it without blocking a commit.
- The core `no-unused-vars` is off and the TypeScript-aware replacement is on. This is deliberate;
  the TypeScript version understands type-only imports and `erasableSyntaxOnly`.

### Rules explicitly disabled by this project

| Rule                    | Why it is off                                                                                     |
| ----------------------- | ------------------------------------------------------------------------------------------------- |
| `arrow-body-style`      | Set to `off` in the Prettier block. Prettier removes redundant arrow function bodies itself.      |
| `prefer-arrow-callback` | Set to `off` in the Prettier block. A function declaration is not inherently worse for callbacks. |

---

## 6. Installing Prettier

Prettier is **already installed**, along with the two packages that connect it to ESLint.

```bash
npm install -D prettier eslint-config-prettier eslint-plugin-prettier
```

- `prettier` — the formatter itself.
- `eslint-config-prettier` — a **config**, not a plugin. It contains no rules of its own; it is a
  list of ESLint stylistic rules that are turned **off** because Prettier already owns that
  decision. Both are present in this project.
- `eslint-plugin-prettier` — a **plugin** exposing Prettier as the ESLint rule
  `prettier/prettier`, so formatting shows up as ordinary lint errors and is auto-fixable with
  `eslint --fix`.

---

## 7. Configuring Prettier

### The complete configuration file

```json
{
  "arrowParens": "always",
  "printWidth": 120,
  "endOfLine": "auto",
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all"
}
```

This is the file `.prettierrc` in the repository root. It uses Prettier's JSON format for the
config itself, so it is valid JSON and needs no JavaScript wrapper.

### What each setting does and why this project picked it

| Setting         | Value    | What it controls                                                                     | Why this value                                                                                                                                                             |
| --------------- | -------- | ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `arrowParens`   | `always` | Wraps a single arrow-function parameter in parentheses: `(x) => ...`                 | Consistent and diff-friendly. It is also what Prettier has defaulted to since v2, so keeping it explicit documents the intent.                                             |
| `printWidth`    | `120`    | The column at which Prettier tries to wrap lines                                     | Wider than the default 80. React JSX nests deeply, and 80 characters forces JSX attributes onto many lines. 120 keeps JSX readable while still preventing very long lines. |
| `endOfLine`     | `auto`   | Which line ending to emit                                                            | Uses the line ending already dominant in the file. Prevents a mass line-ending diff when a Windows developer and a Unix developer both touch the file.                     |
| `semi`          | `true`   | Always terminate statements with `;`                                                 | Removes a class of ASI-related ambiguity and matches the style shipped in the Vite React TypeScript template.                                                              |
| `singleQuote`   | `true`   | Prefer `'` over `"` for strings                                                      | JSX attributes must use `"` regardless, so single quotes visually separate the two contexts. Also produces fewer escapes when a string contains a double quote.            |
| `tabWidth`      | `2`      | Spaces per indentation level                                                         | Matches the Vite template, ESLint's own style, and most of the React ecosystem.                                                                                            |
| `trailingComma` | `all`    | Add trailing commas to multiline arrays, objects, function arguments, and parameters | Produces smaller diffs — adding an item touches one line instead of two. Also valid in modern TypeScript and JavaScript.                                                   |

### Location

Commit `99bdbb5` moved `.prettierrc` and `.prettierignore` from `src/` to the project root. While
they lived in `src/`, Prettier only picked them up for files under `src/`, so `eslint.config.js`
and `vite.config.ts` were formatted with Prettier's defaults instead of the project's settings.

### Current state

Running `npx prettier --check .` reports 5 files that do not match the current configuration:

```text
.prettierrc
README.md
src/App.css
src/index.css
tsconfig.json
```

These are all files ESLint does not lint, and there is no `format:check` script wired into
`package.json`, so nothing currently fails in CI or in a lint run for these files. See
[Section 18](#18-current-gaps).

---

## 8. Prettier ignore rules

`.prettierignore` lives in the repository root:

```text
node_modules
.next
.vercel
public
dist

# Ignore dependency locks
package-lock.json
```

| Entry               | Why it is ignored                                                                                                       |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `node_modules`      | Third-party source. Reformatting it has no effect on this project's output and would create noise.                      |
| `.next`             | Framework build output. This project uses Vite, not Next.js, so the entry is currently inert but harmless.              |
| `.vercel`           | Deployment platform build output.                                                                                       |
| `public`            | Static assets served verbatim (`favicon.svg`, `icons.svg`). They are copied as-is, so formatting them achieves nothing. |
| `dist`              | Vite production build output.                                                                                           |
| `package-lock.json` | Generated by npm. Reformatting it would produce a huge, meaningless diff and risks lockfile churn.                      |

The general principle: ignore anything generated. Both `node_modules` and `dist` are generated by
a tool, not written by a human, so linting or formatting them produces noise rather than signal.
The same pattern appears in `.gitignore` (`node_modules`, `dist`, `dist-ssr`), and in the ESLint
config (`globalIgnores(['dist'])`).

`.gitignore` additionally ignores `.vscode/*` while explicitly keeping `.vscode/extensions.json`
via a `!.vscode/extensions.json` negation. So a future VS Code setup could commit its recommended
extensions but not personal settings.

---

## 9. ESLint and Prettier Integration

This project uses **both** integration packages, not one or the other.

### `eslint-config-prettier` — turn off conflicts

```js
rules: {
  ...eslintConfigPrettier.rules,
}
```

`eslint-config-prettier` is a list of ESLint rules set to `off`. It does not add any behaviour; it
removes behaviour. It disables stylistic core rules (`indent`, `quotes`, `semi`, `comma-dangle`,
`max-len`, …) and any TypeScript or plugin rules whose opinion conflicts with Prettier's output.

Without this step, a file that Prettier has formatted perfectly could still be reported by ESLint
for a stylistic disagreement, and `--fix` would make the two tools fight.

The current state of this in the project: `npx eslint --print-config src/App.tsx` shows `indent`,
`quotes`, and the core `no-unused-vars` all resolved to `0` (off).

### `eslint-plugin-prettier` — run Prettier as a lint rule

```js
{
  plugins: { prettier: eslintPluginPrettier },
  rules: {
    'prettier/prettier': 'error',
  },
}
```

The plugin registers Prettier as an ESLint rule. When ESLint lints a file, the plugin formats the
file in memory and compares the result to the actual source. If they differ, it reports a
`prettier/prettier` error and attaches a fix that rewrites the offending range.

This has a few consequences worth being aware of:

- Formatting violations appear in ESLint output with a file and line number, alongside code
  quality violations.
- `eslint --fix` fixes formatting too, because the rule is marked `fixable: "code"`.
- Prettier is read from `.prettierrc` automatically. The rule's default is `usePrettierrc: true`,
  so there is no duplicated formatting configuration inside `eslint.config.js`.
- It is slower than running the tools separately, because formatting happens inside the lint run.
  On a small project like this one the cost is negligible.

Verified behaviour in this repository: a deliberately mis-formatted temporary `.tsx` file produced
exactly one error —

```text
1:25  error  Replace `·{const·x·=·1;return·<div>{x}</div}` with `{⏎··const·x·=·1;⏎··return·<div>{x}</div>;⏎`  prettier/prettier
```

— and ESLint reported it as `1 error and 0 warnings potentially fixable with the --fix option`.

### Resulting workflow

```text
Developer writes code
        ↓
eslint . runs (npm run lint)
        ↓
prettier/prettier rule reformats in memory, reports differences   ─┐
typescript-eslint rules report type-aware problems                ─┤ together,
react-hooks rules report hook problems                           ─┤ one output
eslint-config-prettier keeps stylistic rules out of the way     ─┘
        ↓
Developer runs eslint . --fix
        ↓
Formatting and fixable rule problems are repaired automatically
        ↓
Remaining problems (e.g. exhaustive-deps warnings) are fixed by hand
```

Prettier is not run as a separate step. It runs _inside_ ESLint. `prettier --check .` exists as an
independent check but is not wired into any `package.json` script.

---

## 10. `package.json` Scripts

The complete `scripts` block in `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

| Command           | Purpose                                                                                                                                                                    |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run lint`    | Runs ESLint over the whole project. Checks code quality **and**, because of `prettier/prettier`, formatting. Currently exits clean.                                        |
| `npm run dev`     | Starts the Vite dev server. Not lint-related.                                                                                                                              |
| `npm run build`   | Runs `tsc -b` (TypeScript project build) then `vite build`. `tsc -b` catches type errors before bundling. Not lint-related, but it is the other automated type safety net. |
| `npm run preview` | Serves the contents of `dist` locally to check the production build. Not lint-related.                                                                                     |

### Scripts that do not exist

Be aware of what is **absent**:

- There is no `lint:fix` script. Use `npx eslint . --fix`.
- There is no `format` script. Use `npx prettier --write .`.
- There is no `format:check` script. Use `npx prettier --check .`.

These commands work and are verified in this repository, they are just not aliased in
`package.json`.

---

## 11. VS Code Integration

**No VS Code configuration exists in this repository.**

- There is no `.vscode/` directory.
- There is no `.vscode/settings.json`.
- There is no `.vscode/extensions.json`.

Consequences, stated plainly so nothing is assumed:

- Format-on-save is **not** enabled by this project. Whether VS Code formats on save depends on
  the developer's personal settings or on the Prettier extension's own default behaviour.
- The default formatter is **not** set to Prettier by this project.
- ESLint fix-on-save is **not** enabled by this project.
- No extensions are recommended.

`.gitignore` ignores `.vscode/*` but keeps `.vscode/extensions.json` through the
`!.vscode/extensions.json` negation. So adding a `.vscode/extensions.json` with recommended
extensions would be committed, while adding `.vscode/settings.json` would be local-only and would
need a `.gitignore` change to be shared with the team.

---

## 12. Developer Workflow

The actual workflow for this project:

```text
1. Write code in src/
2. Run npm run lint
3. Run npx eslint . --fix to repair formatting and any auto-fixable rules
4. Fix remaining problems by hand
   (exhaustive-deps warnings and other non-fixable errors)
5. Optionally run npx prettier --write . for files ESLint does not lint
   (Markdown, CSS, JSON)
6. Commit
```

Since there are no git hooks and no lint-staged, step 2 is entirely manual. Nothing enforces it.

If VS Code is used, the fastest manual equivalent is to enable the following in **Settings →
Workspace** (not user settings, so the whole team shares it). These are _recommendations_, not
current project configuration:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

Note the interaction: with `prettier/prettier` active as an ESLint rule, enabling both
`formatOnSave` with Prettier and `source.fixAll.eslint` can produce a save-time loop on a file with
a formatting difference, because the ESLint fix rewrites the file and the Prettier extension then
re-formats it. If that happens, pick one. Running Prettier on save and leaving ESLint fixes to the
explicit `npm run lint` step avoids the loop.

---

## 13. Common Commands

```bash
# Check ESLint (code quality + formatting, because of prettier/prettier)
npm run lint

# Automatically fix ESLint issues, including formatting
npx eslint . --fix

# Inspect what rules actually apply to a file
npx eslint --print-config src/App.tsx

# Lint a single file
npx eslint src/App.tsx

# Format all supported files
npx prettier --write .

# Check formatting without writing
npx prettier --check .

# Format a single file
npx prettier --write src/App.tsx

# Type check (the build's first step)
npx tsc -b
```

`npx eslint . --fix` and `npx prettier --write .` are the equivalents of the `lint:fix` and
`format` scripts that are not defined. All of these were run against this repository while writing
this document.

---

## 14. Common Problems and Solutions

### ESLint and Prettier report the same line differently

**Symptom:** a file is formatted, yet ESLint still complains about quotes, semicolons, or
indentation.

**Cause:** a stylistic ESLint rule is active alongside `prettier/prettier`. The two tools disagree
about the same construct.

**Fix in this project:** `eslint-config-prettier` is already spread into the last config block, so
`indent`, `quotes`, and `semi` resolve to `off`. Verify with:

```bash
npx eslint --print-config src/App.tsx
```

If a formatting conflict reappears, check whether the Prettier block is still the **last** entry in
the array in `eslint.config.js`. A config added after it can re-enable conflicting rules.

### Code is formatted but ESLint still reports errors

These are different categories and both are expected to work.

- `prettier/prettier` errors mean the layout does not match `.prettierrc`. Auto-fixable.
- `@typescript-eslint/*`, `react-hooks/*`, and `react-refresh/*` errors mean the code does something
  wrong or unsafe. **Not** fixable by a formatter — a human has to change the logic.

`npx eslint . --fix` clears the first group and leaves the second group untouched. That is the
intended behaviour: a formatter should never rewrite your logic.

### `Parsing error` / "file does not match your project" on lint

**Cause:** type-aware rules (`recommendedTypeChecked`) require every linted file to be part of a
`tsconfig.json` listed in `parserOptions.project`.

**Fix:** confirm the file is inside `src` (covered by `tsconfig.app.json`) or is
`tsconfig.node.json`'s `vite.config.ts`. If a new top-level file needs linting, add it to
`include` in the appropriate tsconfig, or add that tsconfig to `parserOptions.project`.

### ESLint fails immediately with a config error

**Cause:** a malformed config object. This happened in commit `05644ff`, where `ignores: [dist]`
referenced a bare identifier instead of the string `'dist'`, crashing the loader before linting
began.

**Fix:** run `npx eslint . --debug` for the full trace, and check that config values are strings or
arrays of strings.

### `eslint-plugin-prettier` errors about a string plugin

**Cause:** using `eslintPluginPrettier.configs.recommended` in a flat config. That object uses the
legacy `plugins: ["prettier"]` string form, which flat config rejects.

**Fix:** this project already inlines the equivalent flat config block at the end of
`eslint.config.js`. Keep using that block. (The package also ships a flat-compatible
`eslint-plugin-prettier/recommended` subpath export, which is currently not used here.)

### VS Code does not format on save

Not applicable as a project bug — there is no `.vscode` folder in this repository. If a developer
expects format-on-save, it must be configured in their own settings. Things to check in order:
whether the Prettier extension is installed and enabled, whether `editor.formatOnSave` is true,
whether `editor.defaultFormatter` is set to `esbenp.prettier-vscode`, whether the file's language
mode is one Prettier supports, and whether the file is excluded by `.prettierignore` (for example
anything under `public/`).

### Files under `public/` or `dist/` are not being linted or formatted

That is intentional. Both are ignored. See [Section 8](#8-prettier-ignore-rules).

---

## 15. How to Add or Modify ESLint Rules

### Where rules go

Add project-specific rule overrides in the **last** config object in `eslint.config.js` — the one
that already contains `'prettier/prettier': 'error'`. Putting them there keeps them after
`eslint-config-prettier` and prevents a later config from silently reverting them.

```js
{
  plugins: { prettier: eslintPluginPrettier },
  rules: {
    ...eslintConfigPrettier.rules,
    'prettier/prettier': 'error',
    'arrow-body-style': 'off',
    'prefer-arrow-callback': 'off',

    // Add project-specific rules here.
  },
}
```

If a rule only makes sense for application code, add it to the TypeScript block and scope it with
`files: ['**/*.{ts,tsx}']` instead.

### How to test a change

1. Run `npx eslint --print-config src/App.tsx` and confirm the rule's resolved value matches what
   you intended.
2. Run `npm run lint` and confirm nothing broke.
3. Temporarily write code that violates the rule and confirm ESLint reports it. (This is how the
   `prettier/prettier` behaviour documented in [Section 9](#9-eslint-and-prettier-integration) was
   verified.)
4. Commit the config change and the code change together, so the history shows why.

### `warn` versus `error`

- `error` — the rule is non-negotiable and blocks the lint run. Use it for correctness and safety
  (for example `no-floating-promises`).
- `warn` — the rule is advisory. Use it when the rule has a meaningful false-positive rate and the
  team wants visibility without being blocked.

This project already makes that distinction: `react-hooks/exhaustive-deps` and
`react-hooks/incompatible-library` are warnings, while the other React Compiler rules are errors.

### Prefer disabling a preset over disabling a rule

Instead of turning off `recommendedTypeChecked` wholesale to silence one annoying rule, turn off
that one rule and leave the rest of the preset active. That keeps the value of the preset.

### On disabling rules

Every `// eslint-disable-next-line` is a statement that the linter is wrong here. Before adding
one, check whether the rule can be satisfied with a small refactor instead. This project currently
contains **no** inline disable directives — a useful property to preserve.

---

## 16. How to Modify Prettier Configuration

All formatting settings live in `.prettierrc` at the project root. Nothing formatting-related
should be added to `eslint.config.js`, because `eslint-config-prettier` turns the equivalent ESLint
rules off and Prettier's own rules would be re-disabled immediately.

Practical guidance:

- Change one setting at a time and run `npx prettier --check .` to see the blast radius before
  committing.
- `prettier --write .` after a `printWidth` change will rewrap many files. That is expected; review
  the diff for logic damage, even though the formatter should not introduce any.
- Do not add editor-specific formatting options to VS Code settings that contradict `.prettierrc`
  (`editor.tabSize`, `editor.insertSpaces`, `editor.formatOnPaste`, and similar). If two formatters
  disagree, the developer blames the project.

---

## 17. Current State vs. Recommendations

### Current project behaviour (verified)

- ESLint flat config at `eslint.config.js` using type-aware TypeScript rules.
- Prettier config at `.prettierrc`, enforced through ESLint via `prettier/prettier`.
- `eslint-config-prettier` disables stylistic ESLint conflicts.
- `npm run lint` is the only lint-related script, and it passes cleanly.
- No git hooks, no lint-staged, no CI configuration.
- No `.vscode` folder.
- No `lint:fix`, `format`, or `format:check` aliases.

### Recommended practices (not currently enforced)

- Run `npm run lint` before every commit and every pull request.
- Prefer `npx eslint . --fix` over hand-fixing formatting.
- Review config changes (`eslint.config.js`, `.prettierrc`) with the same care as application code;
  a rule change is as impactful as a refactor.
- Keep generated output (`dist`, `public`, `node_modules`) excluded, as it already is.
- Keep the Prettier block last in the flat config array.
- Add `.vscode/extensions.json` recommending the ESLint and Prettier extensions so new developers
  get a working setup without instructions.

### Possible future improvements

None of these are implemented. They are suggestions:

- **`lint:fix` and `format` scripts** — add `"lint:fix": "eslint . --fix"` and
  `"format": "prettier --write ."` to `package.json` so the common operations are memorable.
- **`format:check`** — add `"format:check": "prettier --check ."` so files ESLint does not lint
  (Markdown, CSS, JSON) can be verified.
- **Husky + lint-staged** — run ESLint only on staged files at commit time. Faster than linting the
  whole repo and guarantees the check happens.
- **CI checks** — a GitHub Actions workflow (or equivalent) running `npm run lint`, `npm run build`,
  and `npx prettier --check .` on every pull request. There is currently no `.github/` directory.
  Adding the Prettier check would close the gap described in
  [Section 18](#18-current-gaps).
- **`.vscode/settings.json`** committed to the workspace so format-on-save and ESLint fix-on-save
  behave the same for everyone.
- **Consider dropping `eslint-plugin-prettier`** once editor-side formatting is standardised. If
  Prettier runs in the editor and a separate `format:check` guards CI, the lint run gets faster and
  formatting stops being reported as lint errors. This is a trade-off, not a strict improvement —
  the current arrangement's advantage is that a single command catches everything.

---

## 18. Current Gaps

Documented explicitly so they are not mistaken for configuration.

1. **Files ESLint does not lint are also not format-checked.** `npx prettier --check .` reports
   `.prettierrc`, `README.md`, `src/App.css`, `src/index.css`, and `tsconfig.json` as not matching
   the project's Prettier settings. Because there is no `format:check` script and no CI, nothing
   enforces this. ESLint does not catch them either: `.css` and `.md` are outside the lint glob, and
   `.prettierrc` / `tsconfig.json` are JSON, not `.ts` / `.tsx`.
2. **Formatting can only be fixed through ESLint for linted files.** Since `prettier/prettier` is
   the only formatting enforcement wired into a script, CSS and Markdown have no automated path
   today.
3. **`eslint .` also lints `eslint.config.js` itself**, but only with the Prettier rule. Its
   resolved config has one active rule, so the config file is formatting-checked but not
   quality-checked.
4. **No `.eslintignore` exists**, which is correct for flat config — ignores live in
   `globalIgnores`. This is not a gap, but it is a common point of confusion.
5. **Lint and type check are separate concerns.** `npm run lint` catches type-aware lint problems;
   `npm run build` runs `tsc -b` and catches type errors. Neither substitutes for the other.
6. **No `eslint-plugin-react-x` / `eslint-plugin-react-dom`.** The `README.md` suggests these for
   additional React-specific rules, but neither package is installed.

---

## 19. Files Inspected

| File                                                       | Relevance                                                                                                    |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `package.json`                                             | Scripts, dependency versions, `"type": "module"`                                                             |
| `eslint.config.js`                                         | The entire flat config                                                                                       |
| `.prettierrc`                                              | Formatting settings                                                                                          |
| `.prettierignore`                                          | Formatter exclusions                                                                                         |
| `.gitignore`                                               | Generated-file and `.vscode` handling                                                                        |
| `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json` | Type programs referenced by `parserOptions.project`; linting-related compiler flags such as `noUnusedLocals` |
| `vite.config.ts`                                           | A linted non-`src` file; explains why `tsconfig.node.json` is in `parserOptions.project`                     |
| `src/App.tsx`, `src/main.tsx`                              | Actual code style observed: single quotes, semicolons, 2-space indent                                        |
| `README.md`                                                | Template README, including suggestions for further ESLint expansion                                          |
| `.vscode/`                                                 | Confirmed absent                                                                                             |

Runtime verification performed:

```bash
npm run lint                                  # clean, exit 0
npx prettier --check .                        # 5 files reported
npx eslint --print-config src/App.tsx         # 495 rules resolved; key severities verified
npx eslint --print-config eslint.config.js    # 1 active rule (prettier/prettier)
npx eslint . --debug                          # 4 files linted
```

Git history consulted to explain why the configuration looks the way it does:

| Commit    | What it changed                                                                                                                                                                                                                                                             |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `c7a6713` | Initial commit.                                                                                                                                                                                                                                                             |
| `c2a5d42` | Created the Vite React TypeScript template (with React Compiler).                                                                                                                                                                                                           |
| `05644ff` | ESLint configured: switched `tseslint.configs.recommended` to `recommendedTypeChecked`, added `parserOptions.project`, added an invalid `ignores: [dist]` entry.                                                                                                            |
| `106711c` | Fixed the lint error caused by the type-aware switch by wiring up the tsconfig projects.                                                                                                                                                                                    |
| `99bdbb5` | Removed the invalid `ignores` entry, inlined the flat-config-broken `eslint-plugin-prettier` recommended config, moved `.prettierrc` and `.prettierignore` to the project root, deleted a stray `recommended-type-checked.ts` artifact, and reformatted three source files. |

---

## 20. Blog Notes

Factual notes for turning this into a technical post.

**Why ESLint was introduced.** The project started from the standard Vite React TypeScript template,
whose default ESLint setup is deliberately minimal. It was strengthened to type-aware rules so it
could catch actual bugs rather than just style and syntax problems. The stated goal in the commit
message was ESLint "for catching bugs".

**Why Prettier was introduced.** Formatting had been inconsistent between files and root-level
config files were not being formatted at all.

**How the two tools differ.** ESLint parses code into an AST and reasons about behaviour, types,
and correctness. Prettier treats code as text and rewrites layout deterministically. The
overlap — ESLint's stylistic rules — is what causes conflicts, and that overlap is switched off
here.

**How they were installed.** As dev dependencies via npm: `eslint`, `@eslint/js`,
`typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `globals`,
`prettier`, `eslint-config-prettier`, `eslint-plugin-prettier`.

**How they were configured.** A single flat config array, `eslint.config.js`, extending
`js.configs.recommended`, `tseslint.configs.recommendedTypeChecked`,
`reactHooks.configs.flat.recommended`, and `reactRefresh.configs.vite` for `.ts`/`.tsx`; plus a
Prettier block that applies to all files. Formatting settings in a root `.prettierrc` with
`printWidth: 120`, `singleQuote: true`, `semi: true`, `tabWidth: 2`, `trailingComma: "all"`,
`arrowParens: "always"`, `endOfLine: "auto"`.

**How they integrate.** Two packages with different jobs. `eslint-config-prettier` is a list of
stylistic ESLint rules set to `off`. `eslint-plugin-prettier` registers Prettier as the ESLint
rule `prettier/prettier`, so formatting appears as an auto-fixable lint error. Result: one
command, `npm run lint`, reports both formatting and correctness problems.

**How developers use them.** `npm run lint` before committing. `npx eslint . --fix` for
auto-fixable issues, including formatting.

**Important configuration decisions.**

1. Type-aware rules were chosen over syntax-only rules — stronger bug detection, at the cost of
   requiring every linted file to belong to a referenced tsconfig.
2. The Prettier block must remain last in the array, or conflicting rules get re-enabled.
3. `eslint-plugin-prettier`'s own `configs.recommended` is unusable with flat config, so its
   contents were inlined manually.
4. `.prettierrc` and `.prettierignore` were moved from `src/` to the root so they apply to all
   files.
5. `printWidth: 120` rather than the default 80, because JSX nests deeply.
6. `react-hooks/exhaustive-deps` is a warning, not an error, because of its false-positive rate.

**Lessons learned.**

- Flat config is order-sensitive; ordering mistakes produce subtle rule resurrection.
- Legacy config shapes (`plugins: ["name"]` strings) break under flat config.
- Config file location matters as much as its content — a `.prettierrc` in `src/` silently fails
  to apply to root files.
- Preset switch-ups (`recommended` → `recommendedTypeChecked`) almost always require additional
  wiring, in this case `parserOptions.project`.
- `eslint --print-config <file>` is the fastest way to know what actually applies to a file.

**Possible improvements.** Hooks or lint-staged for automatic pre-commit checks; CI running lint
and build; `format:check` scripts; committed VS Code settings; resolving the five files that
`prettier --check` currently flags. None of these are implemented today.
