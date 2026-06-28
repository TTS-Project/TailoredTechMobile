// Project-level ESLint v9 flat config for Tailored Tech Solutions frontend.
//
// This codifies the rules the project actually enforces so that external
// code-review bots running their own opinionated rulesets are reconciled with
// what we run locally and in CI.
//
// Rules that historically produced false positives on this codebase
// (e.g. "missing dep" on stable module-level constants, array-index keys on
// static lists, refactor-everything cyclomatic-complexity flags) are tuned
// down to match our actual quality bar.

import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import globals from 'globals';

export default [
  {
    ignores: [
      'build/**',
      'node_modules/**',
      'public/**',
      // shadcn UI is generated code — keep linter out of it
      'src/components/ui/**',
    ],
  },

  js.configs.recommended,

  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser, ...globals.node },
    },
    settings: { react: { version: 'detect' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      import: importPlugin,
    },
    rules: {
      // ----- React core -----
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      'react/prop-types': 'off',                // we don't use prop-types
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      // Apostrophes/quotes in JSX text are legible and don't break anything.
      // We accept the typographic inconsistency to keep the codebase quiet.
      'react/no-unescaped-entities': 'warn',

      // ----- React hooks (the rule that actually matters) -----
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // ----- a11y - keep on for accessibility but allow obvious patterns -----
      'jsx-a11y/anchor-is-valid': 'off',         // react-router <Link> wraps <a>
      'jsx-a11y/label-has-associated-control': 'off',
      'jsx-a11y/no-noninteractive-element-interactions': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',

      // ----- General JS hygiene -----
      // React 17+ no longer requires `import React` for JSX — allow it as an
      // unused import without warning.
      'no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^(_|React$)',
      }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'warn',
      'eqeqeq': ['warn', 'smart'],

      // ----- Explicitly disabled noise -----
      // We use array index as key on static, non-reorderable lists (CSS scenes,
      // marquee tiles, etc.) — this is correct for the data and isn't a bug.
      'react/no-array-index-key': 'off',
      // The "complexity" / "max-lines" / "max-lines-per-function" family
      // produces refactor-everything reports without any actual bug. We rely on
      // human code review for legibility instead.
      'complexity': 'off',
      'max-lines': 'off',
      'max-lines-per-function': 'off',
      'max-params': 'off',
      'max-nested-callbacks': 'off',
      'max-depth': 'off',
      // localStorage usage is a deliberate architectural choice (cart contents,
      // Bearer-token fallback). Bots that flag every `localStorage` call as a
      // security issue create noise without action.
      'no-restricted-globals': 'off',
      // Bots sometimes complain about non-empty catch blocks containing only
      // a comment. Ours are intentionally silent (`/* no body */`, `/* ignore */`)
      // and documented.
      'no-empty': ['warn', { allowEmptyCatch: true }],
    },
  },
];
