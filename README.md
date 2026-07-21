# Expo App Template

A production-ready, **feature-based Expo (SDK 57)** starter for consumer mobile apps: a polished
onboarding flow, authentication, a paywall, and a tabbed home + settings shell — wired for
**Supabase**, **RevenueCat**, and **PostHog**, and shipped as a working example (a "quit nicotine
pouches" app) you rebrand into your own.

Built on Expo SDK 57 / React Native 0.86 / React 19 (React Compiler), TypeScript strict, Expo Router
typed routes, TanStack Query + Zustand, and Apple's iOS 26 Liquid Glass design language.

## Capability model — runs with zero config

Every backend integration is **capability-driven**. The app reads `EXPO_PUBLIC_*` at build time and
activates each feature only when its keys are present:

- **Empty `.env`** → the app runs as a full UI demo (onboarding → paywall → home ⇄ settings). Sign-in
  continues the flow, the built-in paywall is shown, nothing hits a server.
- **Add keys** → the same code does real Supabase auth + data, RevenueCat entitlements and paywalls,
  and PostHog analytics. No code changes.

See [`SETUP.md`](./SETUP.md) for the clone-to-running guide.

## Features

- **Onboarding** — a 28-step flow with a Zustand store, a `useFlow` navigation state machine, progress
  chrome, and a content-driven step model.
- **Auth** — Sign in with Apple (native id-token) and Google (system-browser OAuth), both through
  Supabase. Sign-in is required before the paywall.
- **Paywall** — presented via **RevenueCat Paywalls** (`react-native-purchases-ui`), with a built-in
  fallback screen. Access is **hard-gated**: entering the app requires a signed-in account **and** an
  active RevenueCat **entitlement** (never product ids), enforced in the tabs route guard.
- **Home + Settings** — a tabbed shell rendering demo content, ready to wire to your data. TanStack
  Query powers the live session and entitlement queries.
- **Backend** — Supabase client, RLS-correct SQL migrations, and an auto-provisioned profile.
- **Analytics** — PostHog autocapture, Expo Router screen tracking, identify, session replay
  (opt-in), and feature flags.

## Tech stack

| Concern | Choice |
| --- | --- |
| Framework | Expo SDK 57, React Native 0.86, React 19 (React Compiler) |
| Language | TypeScript (strict) |
| Routing | Expo Router (typed routes, `src/app`, route groups) |
| Server state | TanStack Query |
| Client state | Zustand |
| Backend / auth | Supabase (`@supabase/supabase-js`) |
| Subscriptions | RevenueCat (`react-native-purchases`) |
| Paywalls | RevenueCat Paywalls (`react-native-purchases-ui`) |
| Analytics | PostHog (`posthog-react-native`) |
| Design | `expo-glass-effect` (Liquid Glass), `expo-symbols`, `react-native-reanimated`, `react-native-svg` |

## Architecture

Feature-based, not type-based — each feature owns its screens, components, hooks, data access, and state.

```
src/
├── app/              # Expo Router routes ONLY — thin re-exports of feature screens
│   ├── _layout.tsx   # providers: Query, Analytics, safe-area, services
│   ├── (tabs)/       # home + settings
│   └── *.tsx         # onboarding / auth / paywall routes
├── features/         # self-contained: onboarding, auth, paywall, home, settings
│   └── <feature>/    #   screens/, components/, hooks/, api.ts, store.ts
├── components/ui/    # shared design-system primitives
├── hooks/            # cross-feature hooks (analytics identity)
├── lib/              # cross-cutting clients: supabase, revenuecat, analytics, query-client
├── constants/        # theme, config (flags), brand + content (white-label copy)
└── types/            # shared + generated Supabase types
supabase/             # config + RLS migrations
```

**Conventions**

- `app/` holds routes only — every route file is a one-line re-export of a feature screen.
- Cross-feature imports use the `@/` alias; imports within a feature stay relative. No barrel
  `index.ts` files (they break Fast Refresh); the alias resolves through Expo's Metro/Babel preset.
- Server state → TanStack Query (each feature's `api.ts` + a hook); client/UI state → thin Zustand.
  Business logic lives in hooks; components stay presentational.
- Every backend integration is guarded by a capability flag in `src/constants/config.ts`, so an empty
  `.env` runs a pure UI demo.
- Only public values use the `EXPO_PUBLIC_` prefix; real secrets belong behind a Supabase Edge
  Function. Every Supabase table has RLS with per-command policies (`supabase/migrations/`).

## Requirements

Native modules here (Liquid Glass, SF Symbols, native pickers, Supabase/RevenueCat) are
**not** available in Expo Go, so you need a development build.

- Node 20+
- Xcode 26 + an iOS 26 Simulator/device to see real Liquid Glass (older iOS/Android/web fall back to
  solid frosted surfaces)

## Quickstart

```bash
npm install
cp .env.example .env          # optional — the app runs without any keys
npx expo run:ios              # first native build (custom dev client)
npx expo start --dev-client   # subsequent JS-only iteration
```

Then wire the backend, login methods, and monetization in [`SETUP.md`](./SETUP.md).

## Rebranding

Everything specific to the example lives in three places:

- **Identity** — `app.json` (`name`, `slug`, `scheme`, `ios.bundleIdentifier`, `android.package`);
  rename the `com.example.expoapptemplate` placeholder before shipping.
- **Design tokens** — `src/constants/theme.ts` (colors, layout, typography).
- **Brand + copy** — `src/constants/brand.ts` (app name, currency, substance/unit tokens,
  `formatMoney`) and `src/constants/content.ts` (all screen copy + option lists);
  `src/features/onboarding/steps.ts` sets the step order.

## Credits and notices

- The onboarding **design** is adapted from a popular Cal AI-style onboarding flow shared in the
  Mobbin/Figma community, re-themed for a "quit nicotine pouches" example. This repo is an
  independent reimplementation for learning and reuse.
- **Brand logos** (Instagram, TikTok, Facebook, YouTube, Google) are trademarks of their respective
  owners and are included only as small attribution icons in the example's "where did you hear about
  us" step. This project is not affiliated with or endorsed by any of them.
- Built with [Expo](https://expo.dev). Licensed under the [MIT License](./LICENSE).
