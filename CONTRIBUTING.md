# Contributing

Thanks for your interest in improving this template.

## Getting started

```bash
npm install
npx expo run:ios
```

See [`SETUP.md`](./SETUP.md) for configuring the backend, auth, and monetization.

## Before opening a pull request

Both must pass (CI runs them):

```bash
npx tsc --noEmit
npx expo lint
```

## Guidelines

- Follow the [architecture conventions](./ARCHITECTURE.md): keep `app/` route files thin, put logic
  in feature hooks, use TanStack Query for server state and Zustand for client state, and keep
  same-feature imports relative.
- Keep new integrations behind a capability flag in `src/constants/config.ts` so the template still
  runs with an empty `.env`.
- Avoid committing anything secret. `.env` is gitignored; only `.env.example` (with empty
  placeholders) is tracked.
- Prefer small, focused pull requests with a clear description.
