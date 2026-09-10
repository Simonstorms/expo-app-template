// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*', '.expo/**', 'expo-env.d.ts', 'supabase/functions/**'],
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'react-hooks/unsupported-syntax': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
]);
