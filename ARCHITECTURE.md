# Architecture

This template is **feature-based**: code is organized by product capability, not by file type. A
feature owns its screens, components, hooks, data access, and state.

## Layers

```
src/
├── app/            Expo Router routes ONLY. Thin files that re-export a screen from a feature.
│                   No business logic, no UI. Route groups: (tabs) for the main app.
├── features/       One self-contained folder per feature.
│   └── <feature>/
│       ├── screens/     screen components (default export)
│       ├── components/  feature-only components
│       ├── hooks/       business logic (components stay presentation-only)
│       ├── api.ts       server reads/writes (TanStack Query queries + mutations)
│       ├── store.ts     client/UI state (thin Zustand, no side effects)
│       └── types.ts
├── components/ui/  Shared design-system primitives, reused by 2+ features.
├── lib/            Cross-cutting infra clients: supabase, revenuecat, superwall, query-client.
├── constants/      theme (design tokens) + config (env-derived capability flags).
└── types/          Shared and generated types (e.g. Supabase database types).
```

## Conventions

1. **`app/` is routes only.** Every route file is a one-line re-export of a feature screen.
2. **Imports.** Cross-feature and cross-layer imports use the `@/` alias (`@/features/...`,
   `@/components/ui/...`, `@/lib/...`). Imports **within the same feature stay relative**
   (`./store`, `../hooks/use-flow`). No barrel `index.ts` re-export files (they break Fast Refresh).
   The `@/` alias resolves through Expo's Metro/Babel preset — no `babel-plugin-module-resolver`.
3. **State.** Server state → **TanStack Query** (in each feature's `api.ts` + a hook). Client/UI state
   → **thin Zustand** stores with simple setters and no side effects. Business logic lives in hooks;
   components are presentation-only.
4. **Typed routes.** `experiments.typedRoutes` is enabled.

## Capability model

`src/constants/config.ts` reads `EXPO_PUBLIC_*` and exposes booleans — `hasSupabase`,
`hasRevenueCat`, `hasSuperwall`, `hasPostHog`. Every integration is guarded by its flag, so an
unconfigured app runs as a UI demo and each feature activates when its keys are added, with no code
changes.

- `lib/supabase.ts` — client is constructed always but only used behind `hasSupabase`; sessions are
  stored in the OS keychain via an `expo-secure-store` adapter, with PKCE OAuth.
- `lib/revenuecat.ts` — `configureRevenueCat()` / `identifyRevenueCatUser()` / `resetRevenueCatUser()`
  no-op until configured; the RevenueCat App User ID is synced to the Supabase user.
- `lib/superwall.ts` + `app/_layout.tsx` — `SuperwallProvider` is only mounted when configured; the
  paywall route branches to the built-in screen otherwise.
- `lib/analytics.tsx` — the PostHog client + provider are only mounted when `hasPostHog`; identify /
  reset sync to the Supabase user and screen views are tracked through Expo Router.

## Security

- Only public values use the `EXPO_PUBLIC_` prefix (Supabase anon key, RevenueCat/Superwall public
  keys). Real secrets (service-role keys, LLM keys) belong behind a Supabase Edge Function, never in
  the bundle.
- Every Supabase table has RLS enabled with per-command policies (`WITH CHECK` on writes),
  `(select auth.uid())`, `TO authenticated`, and an index on every policy-referenced column. See
  `supabase/migrations/`.
