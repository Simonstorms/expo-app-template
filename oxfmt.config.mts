import { defineConfig } from 'oxfmt';
import ultracite from 'ultracite/oxfmt';

export default defineConfig({
  ...ultracite,
  ignorePatterns: [
    ...(ultracite.ignorePatterns ?? []),
    '**/.expo',
    'ios',
    'android',
    'bun.lock',
    'src/types/database.ts',
  ],
  printWidth: 100,
  proseWrap: 'preserve',
  singleQuote: true,
  trailingComma: 'all',
});
