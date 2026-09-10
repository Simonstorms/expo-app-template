import { defineConfig } from 'oxlint';
import core from 'ultracite/oxlint/core';
import jsPlugins from 'ultracite/oxlint/js-plugins';
import react from 'ultracite/oxlint/react';

const reactDoctorRules = Object.fromEntries(
  Object.entries(jsPlugins.rules ?? {}).filter(([rule]) => rule.startsWith('react-doctor/')),
);

const reactCompilerPortsOff = Object.fromEntries(
  [
    'rules-of-hooks',
    'exhaustive-deps',
    'hooks',
    'immutability',
    'refs',
    'purity',
    'set-state-in-effect',
    'set-state-in-render',
    'globals',
    'static-components',
    'use-memo',
    'void-use-memo',
    'preserve-manual-memoization',
    'incompatible-library',
    'error-boundaries',
    'unsupported-syntax',
    'invariant',
    'syntax',
    'todo',
    'rule-suppression',
    'memo-dependencies',
    'capitalized-calls',
  ].map((rule) => [`react/${rule}`, 'off']),
);

const reactCompilerRules = Object.fromEntries(
  [
    'rules-of-hooks',
    'exhaustive-deps',
    'static-components',
    'use-memo',
    'void-use-memo',
    'preserve-manual-memoization',
    'incompatible-library',
    'immutability',
    'globals',
    'refs',
    'set-state-in-effect',
    'error-boundaries',
    'purity',
    'set-state-in-render',
    'unsupported-syntax',
    'config',
    'gating',
  ].map((rule) => [`react-hooks-js/${rule}`, 'error']),
);

const reactNativeA11yRules = Object.fromEntries(
  [
    'has-accessibility-props',
    'has-valid-accessibility-actions',
    'has-valid-accessibility-component-type',
    'has-valid-accessibility-descriptors',
    'has-valid-accessibility-ignores-invert-colors',
    'has-valid-accessibility-live-region',
    'has-valid-accessibility-role',
    'has-valid-accessibility-state',
    'has-valid-accessibility-states',
    'has-valid-accessibility-traits',
    'has-valid-accessibility-value',
    'has-valid-important-for-accessibility',
    'no-nested-touchables',
  ].map((rule) => [`react-native-a11y/${rule}`, 'error']),
);

export default defineConfig({
  extends: [core, react],
  ignorePatterns: [
    ...core.ignorePatterns,
    '**/.expo',
    'ios',
    'android',
    'supabase/functions',
    'src/types/database.ts',
    'expo-env.d.ts',
  ],
  jsPlugins: [
    { name: 'expo', specifier: 'eslint-plugin-expo' },
    { name: 'react-hooks-js', specifier: 'eslint-plugin-react-hooks' },
    { name: 'react-native', specifier: 'eslint-plugin-react-native' },
    { name: 'react-native-a11y', specifier: 'eslint-plugin-react-native-a11y' },
    { name: 'react-doctor', specifier: 'oxlint-plugin-react-doctor' },
  ],
  settings: {
    'react-doctor': {
      portedRuleMode: 'curated',
    },
  },
  overrides: [
    {
      files: ['*.js', 'plugins/**/*.js'],
      env: { node: true },
      rules: {
        'no-implicit-globals': 'off',
        'node/global-require': 'off',
        'typescript/no-unsafe-argument': 'off',
        'typescript/no-unsafe-assignment': 'off',
        'typescript/no-unsafe-call': 'off',
        'typescript/no-unsafe-member-access': 'off',
        'typescript/no-unsafe-return': 'off',
        'unicorn/prefer-module': 'off',
      },
    },
  ],
  rules: {
    'no-use-before-define': ['error', { functions: false, classes: true, variables: false }],
    'func-style': ['error', 'declaration', { allowArrowFunctions: true }],
    'sort-keys': 'off',
    'typescript/consistent-type-definitions': ['error', 'type'],
    'typescript/no-confusing-void-expression': 'off',
    'typescript/promise-function-async': 'off',
    'typescript/strict-boolean-expressions': 'off',
    'react/function-component-definition': [
      'error',
      { namedComponents: 'function-declaration', unnamedComponents: 'arrow-function' },
    ],
    'react/no-unstable-nested-components': ['error', { allowAsProps: true }],
    'react/style-prop-object': 'off',
    ...reactCompilerPortsOff,
    ...reactCompilerRules,
    'expo/no-dynamic-env-var': 'error',
    'expo/no-env-var-destructuring': 'error',
    'expo/prefer-box-shadow': 'error',
    'expo/use-dom-exports': 'error',
    'react-native/no-color-literals': 'error',
    'react-native/no-inline-styles': 'error',
    'react-native/no-single-element-style-arrays': 'error',
    'react-native/no-unused-styles': 'error',
    'react-native/split-platform-components': 'error',
    ...reactNativeA11yRules,
    ...reactDoctorRules,
    'react-doctor/only-export-components': 'off',
  },
});
