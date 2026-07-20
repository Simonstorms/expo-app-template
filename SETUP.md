# Setup

This template is **capability-driven**: every backend feature activates only when its keys are
present in `.env`. With an empty `.env` the app runs as a full UI demo (onboarding → paywall → home
→ settings). Add a key and the matching feature turns on with no code changes.

| Capability | Env keys | Without them |
| --- | --- | --- |
| Supabase auth + data | `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Sign-in buttons just continue the flow; nothing is persisted to a server |
| RevenueCat | `EXPO_PUBLIC_REVENUECAT_IOS_KEY`, `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY` | Paywall is presentation-only |
| Superwall | `EXPO_PUBLIC_SUPERWALL_IOS_KEY`, `EXPO_PUBLIC_SUPERWALL_ANDROID_KEY` | Local paywall screen is used |
| PostHog analytics | `EXPO_PUBLIC_POSTHOG_KEY` (+ `EXPO_PUBLIC_POSTHOG_HOST`) | No analytics, screen tracking, or session replay |

## 1. Install and run

```bash
npm install
cp .env.example .env        # optional — the app runs without any keys
```

Native modules here (Liquid Glass, SF Symbols, native pickers, Supabase auth) are **not** available
in Expo Go, so you need a development build:

```bash
npx expo run:ios            # first build
npx expo start --dev-client # subsequent JS-only iteration
```

## 2. Enable the backend (Supabase)

1. Create a project at supabase.com and copy the **Project URL** and **anon public** key into `.env`:

   ```
   EXPO_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

2. Apply the schema (tables + RLS policies + auto-profile trigger):

   ```bash
   supabase link --project-ref YOUR-PROJECT-REF
   supabase db push
   ```

   Or paste `supabase/migrations/0001_init.sql` into the Supabase SQL editor.

3. Regenerate the typed client (replaces the hand-written `src/types/database.ts`):

   ```bash
   supabase gen types typescript --linked > src/types/database.ts
   ```

## 3. Enable login methods

In the Supabase dashboard under **Authentication → Providers**:

- **Apple** — turn on the provider. On iOS the app uses native Sign in with Apple
  (`usesAppleSignIn` is already set in `app.json`); no client secret needed for the native id-token
  flow.
- **Google** — turn on the provider and paste your Google OAuth client id/secret. The app uses the
  system browser (`signInWithOAuth`) and returns to the `expoapptemplate://` scheme, so no native
  Google SDK is required.
- **Email (one-time code)** — enable the Email provider, then edit **Authentication → Email
  Templates → Magic Link** so the body renders `{{ .Token }}` (a 6-digit code) instead of
  `{{ .ConfirmationURL }}`. The app sends the code with `signInWithEmail` and verifies it with
  `verifyEmailOtp` (`type: 'email'`), so it never uses a magic-link redirect.

Guest/anonymous sign-in is intentionally not offered — the hard gate requires a real account — so
keep "Allow anonymous sign-ins" **disabled**.

For production, protect email sign-in with Supabase Auth CAPTCHA (hCaptcha/Turnstile) and rate limits
to prevent scripted account creation.

Add the app scheme to **Authentication → URL Configuration → Redirect URLs**:
`expoapptemplate://` (used by the Google system-browser flow).

> Real Apple/Google OAuth and in-app purchases require **real bundle identifiers** — replace the
> `com.example.expoapptemplate` placeholders in `app.json` (`ios.bundleIdentifier` / `android.package`)
> before configuring the provider and store dashboards.

## 4. Build

```bash
eas init
eas build --profile development --platform ios
```

`eas.json` already defines `development`, `preview`, and `production` profiles. Set per-environment
values as EAS environment variables (never commit real keys — `.env` is gitignored).

## 5. Enable monetization (RevenueCat + Superwall)

RevenueCat is the entitlement source of truth; Superwall presents the paywall via a placement. Both
activate only when their keys are present.

1. **RevenueCat** — create an app, add public SDK keys and the entitlement id to `.env`:

   ```
   EXPO_PUBLIC_REVENUECAT_IOS_KEY=appl_...
   EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=goog_...
   EXPO_PUBLIC_REVENUECAT_ENTITLEMENT=pro
   ```

   Configure the entitlement (default id `pro`) plus products/offerings in the dashboard. The app
   configures the SDK at startup and syncs the RevenueCat App User ID to the Supabase user on
   sign-in/out. RevenueCat is the **source of truth** for the entitlement.

2. **Superwall** — add public keys and the placement name:

   ```
   EXPO_PUBLIC_SUPERWALL_IOS_KEY=pk_...
   EXPO_PUBLIC_SUPERWALL_ANDROID_KEY=pk_...
   EXPO_PUBLIC_SUPERWALL_PLACEMENT=onboarding_complete
   ```

   Create a campaign triggered by the `onboarding_complete` placement and set its paywall to
   **Gated** — that way the paywall's `feature` callback fires **only** when the user is already
   paying or begins paying, so dismissing without subscribing never advances. When Superwall keys are
   present the paywall route presents it via `registerPlacement`; otherwise the built-in paywall
   screen is shown (dev fallback only — it cannot enforce the gate).

   The app pushes RevenueCat's entitlement into Superwall's subscription status
   (`useSuperwallSync` → `setSubscriptionStatus`), so an already-subscribed user skips the paywall.

   **Purchase controller (already wired):** RevenueCat is the entitlement source of truth, so
   purchases made on the Superwall paywall are routed through RevenueCat via a custom purchase
   controller — `src/lib/revenuecat-purchase-controller.ts`, mounted by
   `CustomPurchaseControllerProvider` wrapping `SuperwallProvider` in `src/app/_layout.tsx`. Superwall
   detects the controller and enables manual purchase management automatically, so a completed
   purchase flips `useEntitlement().isPro` and the hard gate opens. For this to work, the **product
   identifiers on your Superwall paywall must match products that exist in RevenueCat** (mapped to the
   `pro` entitlement). Requires a real StoreKit config / sandbox tester to exercise end to end.

### Hard gate

Access is enforced, not cosmetic. Once onboarding is complete, entering the app (`/(tabs)`) requires
a signed-in Supabase account **and** an active RevenueCat entitlement — the tabs route guard
redirects to `/sign-in` or `/paywall` otherwise, and the splash screen routes returning users the
same way. The guard keys off the capability flags, so with an empty `.env` (no keys) the gate is
inert and the UI demo remains fully reachable.

## 6. Enable analytics (PostHog)

Add your project key (and host — `https://us.i.posthog.com` or `https://eu.i.posthog.com`):

```
EXPO_PUBLIC_POSTHOG_KEY=phc_...
EXPO_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

Once set, PostHog initializes at startup and provides:

- **Autocapture** of touches, plus **screen views** tracked through Expo Router (`ScreenTracker`).
- **Identify / reset** synced to the Supabase user on sign-in and sign-out.
- **App lifecycle** events, plus custom events (`onboarding_completed`, `paywall_viewed`) via
  `captureEvent()`.
- **Feature flags** through the re-exported `useFeatureFlag('flag-key')` hook.

### Session replay (optional)

Off by default. To enable it: turn on session recordings in your PostHog **Project Settings**, set
`EXPO_PUBLIC_POSTHOG_SESSION_REPLAY=true`, and rebuild the dev client. It uses the already-installed
`@posthog/react-native-plugin`. Masking defaults are privacy-safe (`maskAllTextInputs: true`); adjust
`sessionReplayConfig` in `src/lib/analytics.tsx`.

## Where the pieces live

```
src/lib/supabase.ts                 guarded Supabase client (keychain session via expo-secure-store, auto-refresh)
src/constants/config.ts             reads EXPO_PUBLIC_* + capability flags (hasSupabase, ...)
src/features/auth/                  api.ts (Apple/Google/email-OTP/signOut) + useSession hook + email-sign-in component
src/features/onboarding/api.ts      syncs answers to Supabase after sign-in
src/lib/revenuecat.ts               configure + logIn/logOut sync with the Supabase user
src/lib/superwall.ts                api keys + placement name + RC→Superwall status mapping
src/lib/analytics.tsx               PostHog client + provider + screen tracker + identify/capture
src/features/paywall/               api.ts (restore), use-entitlement, use-revenuecat, use-superwall-sync, screens/
src/app/(tabs)/_layout.tsx          hard-gate guard (requires session + entitlement)
supabase/migrations/                schema + RLS
```
