# Expo App Template

A production-ready, **feature-based Expo (SDK 57)** starter for consumer mobile apps: a polished
onboarding flow, authentication, a paywall, and a tabbed home + settings shell, wired for
**Supabase**, **RevenueCat** and **PostHog**, and shipped as a working example (a "quit nicotine
pouches" app) you rebrand into your own.

Built on Expo SDK 57 / React Native 0.86 / React 19 (React Compiler), TypeScript strict, Expo Router
typed routes, TanStack Query + Zustand, and Apple's iOS 26 Liquid Glass design language.

The package manager is **bun**. Every command below uses it.

## Capability model: runs with zero config

Every backend integration is **capability-driven**. `src/constants/config.ts` reads `EXPO_PUBLIC_*`
at build time and exports a flag per service; nothing hard-requires a key.

- **Empty `.env`** gives you a full UI demo (onboarding, sign-in, paywall, home and settings). Sign-in
  continues the flow, the built-in paywall is shown, nothing hits a server, nothing crashes.
- **Add keys** and the same code does real Supabase auth and data, RevenueCat entitlements and
  purchases, and PostHog analytics. No code changes.

| Capability              | Env keys                                                                                                     | Flag            | Without them                                                                                             |
| ----------------------- | ------------------------------------------------------------------------------------------------------------ | --------------- | -------------------------------------------------------------------------------------------------------- |
| Supabase auth + data    | `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`                                                  | `hasSupabase`   | Sign-in buttons just continue the flow, nothing is persisted server-side, the sign-in gate is inert      |
| RevenueCat entitlements | `EXPO_PUBLIC_REVENUECAT_IOS_KEY`, `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY`, `EXPO_PUBLIC_REVENUECAT_ENTITLEMENT` | `hasRevenueCat` | The paywall renders with placeholder pricing from `brand.ts`, the entitlement gate is inert              |
| PostHog analytics       | `EXPO_PUBLIC_POSTHOG_KEY`, `EXPO_PUBLIC_POSTHOG_HOST`                                                        | `hasPostHog`    | No analytics, screen tracking, error autocapture or session replay. Every `captureEvent` call is a no-op |
| Server-side secret demo | `DEV_API_KEY` (local only, injected via `app.config.js` `extra`)                                             | `hasDevApiKey`  | The `secure-call` edge function path is not exercised                                                    |

`hasRevenueCat` also requires `Device.isDevice`, so purchases stay inert on a simulator even with
keys set.

`assertProductionServicesConfigured()` runs at the top of `src/app/_layout.tsx`. Out of the box its
required-service list is empty, so it never throws. Fill
`requiredProductionServices` in `src/constants/config.ts` once your app genuinely cannot ship
without a service, and a misconfigured production build fails loudly at launch instead of reaching
review silently.

## Features

- **Onboarding**: a 28-step flow (`src/features/onboarding/steps.ts`) with a persisted Zustand store,
  a `useFlow` navigation state machine that also emits analytics and syncs answers, staged progress
  animations, and a projection model driving the graph and savings screens.
- **Auth**: Sign in with Apple (native id-token, via Apple's own `AppleAuthenticationButton`) and
  Google (system-browser OAuth), both through Supabase. Cancellation is distinguished from real
  failure. Account deletion runs a `delete_current_user` RPC.
- **Paywall**: a custom two-view paywall (plan selector plus a welcome-offer view) is the default.
  RevenueCat is the entitlement source of truth; access is hard-gated on a signed-in account **and**
  an active entitlement (never product ids), enforced in the tabs route guard. Restore, offline
  grace and account deletion are all reachable from the paywall itself.
- **Home + Settings**: a tabbed shell rendering demo content, ready to wire to your data. Settings
  covers subscription status, RevenueCat Customer Center, restore, legal links, an analytics opt-out
  switch and account deletion.
- **Backend**: guarded Supabase client with a chunked keychain session store, RLS-correct migrations,
  an auto-provisioned profile, and a `secure-call` edge function as the reference pattern for
  anything that must hold a secret.
- **Analytics**: PostHog autocapture, Expo Router screen tracking, identify/reset, a typed event map,
  super properties, error autocapture, opt-out, and opt-in session replay.
- **Notifications**: local trial-reminder scheduling plus deep-link routing from a tapped
  notification.

## Tech stack

| Concern                   | Choice                                                                                                                    |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Framework                 | Expo SDK 57, React Native 0.86, React 19 (React Compiler)                                                                 |
| Language                  | TypeScript (strict)                                                                                                       |
| Routing                   | Expo Router (typed routes, `src/app`, route groups)                                                                       |
| Server state              | TanStack Query                                                                                                            |
| Client state              | Zustand (`persist` for onboarding)                                                                                        |
| Backend / auth            | Supabase (`@supabase/supabase-js`)                                                                                        |
| Subscriptions             | RevenueCat (`react-native-purchases`)                                                                                     |
| Hosted paywall (optional) | RevenueCat Paywalls (`react-native-purchases-ui`)                                                                         |
| Analytics                 | PostHog (`posthog-react-native`)                                                                                          |
| OTA updates               | `expo-updates`                                                                                                            |
| Design                    | `expo-glass-effect` (Liquid Glass), `expo-symbols`, `react-native-reanimated`, `react-native-svg`, `expo-linear-gradient` |

### Packages that run ahead of the SDK

`expo.install.exclude` in `package.json` exempts eight packages from `expo install --check`. Six are
harmless patch drift. Two are a full major ahead of what SDK 57 bundles and are excluded on purpose:
`@react-native-async-storage/async-storage` 3.x (SDK pins 2.2.0) and `react-native-gesture-handler`
3.x (SDK pins 2.32). Both are autolinked native modules, so re-verify them on every SDK upgrade and
drop the exclusion once the SDK catches up. Everything else in the list should be removed the next
time it stops being needed, not left there by habit.

## Architecture

Feature-based, not type-based. Each feature owns its screens, components, hooks, data access and
state.

```
src/
├── app/              # Expo Router routes ONLY, thin re-exports of feature screens
│   ├── _layout.tsx   # providers: Query, Analytics, safe-area, services
│   ├── (tabs)/       # home + settings, with the hard-gate guard
│   ├── +native-intent.tsx
│   └── *.tsx         # onboarding / auth / paywall routes
├── features/         # self-contained: onboarding, auth, paywall, home, settings
│   └── <feature>/    #   screens/, components/, hooks/, api.ts, store.ts
├── components/ui/    # shared design-system primitives
├── hooks/            # cross-feature hooks (analytics identity, super properties,
│                     #   notification intent, persist hydration)
├── lib/              # cross-cutting: supabase, revenuecat, analytics, notifications,
│                     #   storage, secure-storage, query-client
├── constants/        # theme, motion, config (flags), brand + content (white-label copy)
└── types/            # shared + generated Supabase types
plugins/              # config plugins (pod warnings, script sandboxing, iOS scene lifecycle)
scripts/              # EAS env + RevenueCat provisioning helpers
supabase/             # config, RLS migrations, edge functions
```

**Conventions**

- `app/` holds routes only. Every route file is a one-line re-export of a feature screen.
- Cross-feature imports use the `@/` alias; imports inside a feature stay relative. No barrel
  `index.ts` files (they break Fast Refresh).
- Server state goes through TanStack Query (a feature's `api.ts` plus a hook); client and UI state
  goes in a thin Zustand store. Logic lives in hooks, components stay presentational.
- Only public values carry the `EXPO_PUBLIC_` prefix. Real secrets belong behind a Supabase edge
  function. Every table has RLS with per-command policies.
- House rules: no code comments, no `any`, avoid `useEffect`, no em dashes in copy, no coloured
  accent left borders. See [`CLAUDE.md`](./CLAUDE.md).

## Requirements

Native modules here (Liquid Glass, SF Symbols, native pickers, Supabase, RevenueCat) are **not**
available in Expo Go, so you need a development build.

- Node 20+ and bun
- Xcode 26 with an iOS simulator for everyday work
- A physical iOS 26+ device to see real Liquid Glass and to exercise RevenueCat; on a simulator
  `src/components/ui/glass.tsx` falls back to solid frosted surfaces and `hasRevenueCat` is false

## Quickstart

```bash
bun install
cp .env.example .env                       # optional, the app runs without any keys
bun run ios -- --device "iPhone 17 Pro"    # first native build (custom dev client)
bun run dev                                # subsequent JS-only iteration
```

Build native once, then iterate over Metro. See [`CLAUDE.md`](./CLAUDE.md) for the full build
runbook, when a rebuild is actually required, and the recurring toolchain failures.

Scripts:

| Script                                    | What it does                                                             |
| ----------------------------------------- | ------------------------------------------------------------------------ |
| `bun run dev`                             | `expo start --dev-client`                                                |
| `bun run ios` / `bun run android`         | native build, install, launch                                            |
| `bun run typecheck`                       | `tsc --noEmit`                                                           |
| `bun run lint`                            | `expo lint`                                                              |
| `bun run format` / `bun run format:check` | Prettier                                                                 |
| `bun run analyze`                         | `EXPO_ATLAS=1 expo export --platform ios`, module graph for Expo Atlas   |
| `bun run export:size`                     | export with tree shaking and graph optimisation, for honest size numbers |

CI (`.github/workflows/ci.yml`) runs typecheck, lint and format:check on bun.

## Enable the backend (Supabase)

1. Create a project at supabase.com and copy the **Project URL** and **anon public** key into `.env`:

   ```
   EXPO_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

2. Apply the schema (tables, RLS policies, auto-profile trigger, `delete_current_user`, and an
   `rls_auto_enable` event trigger that turns RLS on for any future table):

   ```bash
   bunx supabase link --project-ref YOUR-PROJECT-REF
   bunx supabase db push
   ```

   Or paste the files in `supabase/migrations/` into the SQL editor in order.

3. Regenerate the typed client (replaces the hand-written `src/types/database.ts`):

   ```bash
   bunx supabase gen types typescript --linked > src/types/database.ts
   ```

The session is stored through `src/lib/secure-storage.ts`: a chunked, generation-tagged,
per-key-serialised `expo-secure-store` wrapper, because Supabase sessions exceed the keychain item
size limit. It falls back to AsyncStorage on web and no-ops during server rendering.

### Login methods

In the Supabase dashboard under **Authentication, Providers**:

- **Apple**: turn on the provider. On iOS the app uses native Sign in with Apple (`usesAppleSignIn`
  is already set in `app.json`), so the native id-token flow needs no client secret.
- **Google**: turn on the provider and paste your Google OAuth client id and secret. The app uses the
  system browser (`signInWithOAuth`) and returns to the app scheme, so no native Google SDK is
  required.

Guest and anonymous sign-in are intentionally not offered, so keep "Allow anonymous sign-ins"
disabled. `supabase/config.toml` already sets `enable_anonymous_sign_ins = false`.

Add the app scheme to **Authentication, URL Configuration, Redirect URLs**. It must match the
`scheme` in `app.json` and the values in `supabase/config.toml`.

Real Apple and Google OAuth (and in-app purchases) require **real bundle identifiers**, so replace
the `com.example.expoapptemplate` placeholders before configuring any dashboard.

### Edge functions

`supabase/functions/secure-call` is the reference pattern for anything the client must not do: hold
a paid API key, sign a request, or talk to a vendor that bills per call. It verifies the caller's
access token, reads the secret from `Deno.env`, and echoes a typed result until you set
`UPSTREAM_URL`. Nothing in the app requires it; with an empty `.env` it is never called. See
`supabase/functions/README.md`.

## Enable monetization (RevenueCat)

RevenueCat is the entitlement source of truth. Add the public SDK keys and the entitlement id:

```
EXPO_PUBLIC_REVENUECAT_IOS_KEY=appl_...
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=goog_...
EXPO_PUBLIC_REVENUECAT_ENTITLEMENT=pro
```

Configure the entitlement, products and an offering in the dashboard.
`scripts/setup-revenuecat.sh` provisions the `pro` entitlement and a `default` offering through the
RevenueCat v2 API if you would rather not click through it.

The SDK is configured at startup, and the RevenueCat App User ID is synced to the Supabase user on
sign-in and sign-out so entitlements follow the account. The PostHog distinct id is pushed as the
`$posthogUserId` subscriber attribute, which is what links revenue to analytics.

### The custom paywall is the default

`src/features/paywall/screens/paywall-route.tsx` decides which paywall renders:

```ts
const USE_REVENUECAT_HOSTED_PAYWALL = false;
```

- **`false` (default)**: the custom `paywall-screen.tsx` renders. It has a plan selector and a
  second welcome-offer view, reads real StoreKit prices when RevenueCat is configured, falls back to
  the placeholder prices in `brand.ts` when it is not, shows subscription disclosure and legal links
  next to both CTAs, and offers a **Try again** path if `getOfferings()` fails rather than
  dead-ending on a spinner. This is the one you brand.
- **`true`**: the RevenueCat-hosted paywall (`react-native-purchases-ui`) renders instead whenever
  `hasRevenueCat` is true, and the dashboard owns the design. Flip the one constant.

Either way, `react-native-purchases-ui` also backs the Customer Center row in Settings
(`src/lib/revenuecat-ui.ts`).

### Hard gate

Access is enforced, not cosmetic. Once onboarding is complete, entering `(tabs)` requires a
signed-in Supabase account **and** an active entitlement; the guard in `src/app/(tabs)/_layout.tsx`
redirects to `/sign-in` or `/paywall` otherwise, and the splash screen routes returning users the
same way. The guard keys off the capability flags, so with an empty `.env` the gate is inert and the
UI demo stays fully reachable.

Two things keep the gate from trapping real users: the paywall carries a **Delete account** link
whenever a session exists (App Store guideline 5.1.1(v), since sign-in sits before the paywall), and
`src/lib/storage.ts` persists the last entitlement answer RevenueCat actually gave with a 72 hour
grace window, so a failed `getCustomerInfo()` while offline does not read as "not subscribed". That
value is cleared on RevenueCat logout so it cannot leak across accounts.

## Enable analytics (PostHog)

```
EXPO_PUBLIC_POSTHOG_KEY=phc_...
EXPO_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

With a key present, `src/lib/analytics.tsx` gives you autocapture of touches, screen views tracked
through Expo Router (`ScreenTracker`), app lifecycle events, identify and reset synced to the
Supabase user, error autocapture (uncaught exceptions, unhandled rejections, native crashes),
`personProfiles: 'identified_only'`, and super properties (`env`, `is_pro`,
`onboarding_completed`) registered by `src/hooks/use-analytics-super-properties.ts`.

With no key, `posthog` is `null` and every exported function is a no-op. Nothing branches on the
flag at a call site.

### The typed event map

Event names and their property shapes live in one place, `src/lib/analytics-events.ts`:

```ts
export type AnalyticsEvents = {
  onboarding_completed: { steps_total?: number };
  sign_in_succeeded: { provider: string; context?: string };
  signed_out: undefined;
  // ...
};
```

`captureEvent` is generic over that map, so an unknown event name or a wrong property type is a
compile error, and events whose properties are all optional (or `undefined`) can be called with no
second argument. To add an event: add one entry to `AnalyticsEvents`, then call
`captureEvent('your_event', { ... })`. Naming is snake_case, past tense. `captureEventAt` backdates
an event, which is how the trial reminder records at its scheduled time.

Users can opt out from Settings; `setAnalyticsOptOut` flushes before opting out so the toggle event
itself is not lost.

### Feature flags

Flag preloading is **off** by default (`preloadFeatureFlags: false`), because a template that reads
no flags should not pay two network requests and an AsyncStorage write on every launch. To opt in,
change that one line in `src/lib/analytics.tsx` to `true`. Either way,
`useFeatureFlag('your-flag')` is re-exported from the same module and works on demand.

### Session replay (optional)

Off by default. To enable: turn on session recordings in your PostHog project settings, set
`EXPO_PUBLIC_POSTHOG_SESSION_REPLAY=true`, and rebuild. Masking defaults are privacy-safe
(`maskAllTextInputs`, `maskAllImages`, no log capture). Replay snapshots the screen about once a
second on the main thread, so it is the single largest continuous CPU, battery and data cost you can
switch on, and App Store guideline 2.5.14 expects your privacy policy to disclose it.

## UI primitives

`src/components/ui/` is the shared design system. It reads only from `src/constants/theme.ts` and
`src/constants/motion.ts`, so retheming is a constants change.

| Primitive                                                                            | What it is                                                                                                                  |
| ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| `glass.tsx`                                                                          | `GlassSurface`, real Liquid Glass on capable hardware, solid fallback elsewhere. Capability is resolved once at module load |
| `frost.tsx`                                                                          | Gradient frosted cards for scrolling surfaces, no blur, so no per-frame cost in lists                                       |
| `frost-toggle.tsx`                                                                   | Reanimated switch driven by a derived shared value and `interpolateColor`                                                   |
| `pressable-scale.tsx`                                                                | Press feedback with the shared `motion` timings, transform only                                                             |
| `glass-icon-button.tsx`                                                              | Circular glass icon button built on `PressableScale`                                                                        |
| `primary-cta.tsx`, `selection-row.tsx`, `choice-pair-buttons.tsx`, `title-block.tsx` | Onboarding building blocks                                                                                                  |
| `phone-mockup.tsx`                                                                   | Brand-neutral device frame, ratio-derived bezel and corner radius, no image asset                                           |
| `notification-preview.tsx`                                                           | Fake iOS notification banner for the permission-priming step                                                                |
| `trial-timeline.tsx`                                                                 | Vertical "what happens when" trial timeline                                                                                 |
| `confetti.tsx`                                                                       | Bounded celebration burst, unmounts itself when finished                                                                    |
| `gradient-ring.tsx`, `screen-background.tsx`, `icon.tsx`, `brand-logos.tsx`          | Backgrounds, SF Symbols wrapper, attribution glyphs                                                                         |

Feature-level pieces worth knowing: `onboarding-scaffold.tsx` (header, progress, footer for every
step), `count-up-text.tsx`, `step-check.tsx`, `system-dialog-preview.tsx`, and
`use-staged-progress.ts` for multi-stage progress animation.

## Onboarding store and hydration gate

`src/features/onboarding/store.ts` is a Zustand store wrapped in `persist` with
`createJSONStorage(() => AsyncStorage)`. `partialize` strips the actions, so only answers are
written. Answers survive a force-quit mid-flow.

Persistence is asynchronous, which means the first frame can render before the stored answers are
back. `src/hooks/use-persist-hydrated.ts` subscribes to the store's hydration state with
`useSyncExternalStore` (no `useEffect`, no local mirror state):

```ts
const hydrated = usePersistHydrated(useOnboarding);
```

The splash screen holds a blank frame until `hydrated` is true and the onboarding-complete flag has
been read, then routes once: to `/welcome`, `/sign-in` or `/home`. Without that gate a returning user
would flash the first onboarding screen before being redirected.

## OTA updates

`expo-updates` is installed and `app.json` sets `runtimeVersion: { policy: 'appVersion' }`, so the
runtime version tracks `expo.version` and a JS-only change ships over the air only to builds with a
matching app version. Anything that changes native code (a native dependency, a plugin, an
entitlement) requires bumping `version` and shipping a new binary; that is the point of the policy.

`eas.json` pins one channel per profile (`development`, `preview`, `production`), so
`eas update --channel preview` reaches preview builds only. Run `eas init` once to link the project
and write the EAS project id, then publish with `eas update`.

## Deploying with EAS

```bash
eas init
eas build --profile development --platform ios
```

`eas.json` defines `development` (simulator dev-client), `development-device` (physical iPhone
dev-client), `preview` and `production`. Set per-environment values as EAS environment variables,
never in git; `.env` is gitignored. `scripts/setup-eas-env.sh` pushes the `EXPO_PUBLIC_*` values
from your local `.env` into the EAS `preview` and `production` environments with plaintext
visibility, which is correct because every `EXPO_PUBLIC_*` value is embedded in the client bundle
anyway.

`app.config.js` refuses to embed `DEV_API_KEY` when `EXPO_PUBLIC_ENV=production`, so a local dev
secret cannot leak into a store build even if the EAS environment is misconfigured.

Before submitting, work through [`STORE-READINESS.md`](./STORE-READINESS.md). For size and startup
work, see [`docs/perf-playbook.md`](./docs/perf-playbook.md).

## Rebranding checklist

Work through all of it. The scheme in particular appears in three places and must match everywhere,
or Google OAuth silently fails to return to the app.

1. **`app.json`**
   - `name`, `slug`
   - `scheme` (currently `expoapptemplate`)
   - `ios.bundleIdentifier` and `android.package` (currently `com.example.expoapptemplate`)
   - `version` (the OTA runtime version derives from it)
   - icons: `icon`, `ios.icon`, `android.adaptiveIcon.*`, `web.favicon`, and the splash image in the
     `expo-splash-screen` plugin options
2. **`supabase/config.toml`**: `project_id`, `site_url` and `additional_redirect_urls`. Replace
   `expoapptemplate://` with your scheme (both the bare form and the `**` wildcard).
3. **Supabase dashboard**: add the same scheme under Authentication, URL Configuration, Redirect
   URLs. Local config does not configure a hosted project.
4. **`src/constants/brand.ts`**: `appName`, `wordmark`, `version`, `proName`, `tagline`, the
   `substance` / `unit` vocabulary, `currency`, `trial.days`, the placeholder `pricing` values, and
   `legal` (`privacyUrl`, `termsUrl`, `supportEmail`, `appStoreUrl`). Point the legal URLs at pages
   you actually host.
5. **`src/constants/theme.ts`**: colours, gradients, layout metrics, `font` (currently the system
   face), and the type scale.
6. **`src/constants/content.ts`**: all screen copy and option lists. Add or remove steps in
   `src/features/onboarding/steps.ts`, and delete the route file plus feature screen for any step
   you drop.
7. **`package.json`**: `name`, `description`. **`app.config.js`**: rename `devApiKey` if you keep it.
8. **`.env.example`**: keep it key-only with empty values, so cloning still runs with zero config.
9. Replace the example-specific pieces: `src/features/onboarding/projection.ts` (the "quit" maths),
   the graph and savings screens that consume it, and `src/features/home/api.ts` (a stub returning an
   empty list).

Scheme checklist, all three must agree: `app.json` `scheme`, `supabase/config.toml`
(`site_url` + `additional_redirect_urls`), Supabase dashboard redirect URLs.

## Credits and notices

- The onboarding **design** is adapted from a popular Cal AI-style onboarding flow shared in the
  Mobbin/Figma community, re-themed for a "quit nicotine pouches" example. This repo is an
  independent reimplementation for learning and reuse.
- **Brand logos** (Instagram, TikTok, Facebook, YouTube, Google) are trademarks of their respective
  owners and are included only as small attribution icons in the example's "where did you hear about
  us" step. This project is not affiliated with or endorsed by any of them.
- Built with [Expo](https://expo.dev). Licensed under the [MIT License](./LICENSE).
