# Store readiness checklist

An empty checklist to fill in per app. Nothing here can be done from the codebase alone: these are
the external steps (hosting, dashboards, tax details, review metadata) that decide whether a build
is approved. Ordered roughly by lead time, so start at the top.

Copy this file into your app, work down it, and record decisions inline. If an item does not apply
(no subscription, no analytics), write "n/a" and why, rather than deleting the row; the next person
will ask.

## 1. Legal pages to host

Three pages must be reachable at real URLs before you can fill in App Store Connect. A single static
site is enough.

| Page           | Needed for                                                                                                                  | Status |
| -------------- | --------------------------------------------------------------------------------------------------------------------------- | ------ |
| Privacy policy | ASC **Privacy Policy URL** (required), and the paywall legal row                                                            | [ ]    |
| Terms of use   | Auto-renewable subscription terms. Either link Apple's standard EULA or host your own that layers subscription terms on top | [ ]    |
| Support page   | ASC **Support URL** (required). Needs a working contact route, not just an address                                          | [ ]    |
| Marketing page | ASC **Marketing URL** (optional)                                                                                            | [ ]    |

Then wire them up:

- [ ] `src/constants/brand.ts`: `legal.privacyUrl`, `legal.termsUrl`, `legal.supportEmail`.
- [ ] App Store Connect: Privacy Policy URL, Support URL, Marketing URL.
- [ ] RevenueCat dashboard: if you enabled the hosted paywall
      (`USE_REVENUECAT_HOSTED_PAYWALL` in `src/features/paywall/screens/paywall-route.tsx`), the
      paywall template renders its own Terms and Privacy links and needs the URLs set there too.
- [ ] The privacy policy must name every third party that receives data (analytics vendor,
      subscription vendor, backend host) and, **if you turned session replay on**, must explicitly
      disclose session recording. Guideline 2.5.14 hinges on that sentence.

## 2. EAS production environment variables

`.env` is gitignored and local. Cloud builds read EAS environment variables, so anything the app
needs in production must be set for the `production` environment (and `preview`, if you use it).
`scripts/setup-eas-env.sh` pushes the `EXPO_PUBLIC_*` values from your local `.env` for you.

- [ ] `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `EXPO_PUBLIC_REVENUECAT_IOS_KEY` (and `EXPO_PUBLIC_REVENUECAT_ANDROID_KEY` if shipping Android)
- [ ] `EXPO_PUBLIC_REVENUECAT_ENTITLEMENT` (defaults to `pro`)
- [ ] `EXPO_PUBLIC_POSTHOG_KEY`, `EXPO_PUBLIC_POSTHOG_HOST` (optional)
- [ ] `EXPO_PUBLIC_POSTHOG_SESSION_REPLAY`: leave `false` in production unless the hosted privacy
      policy discloses session recording
- [ ] `EXPO_PUBLIC_ENV=production` is already set by the `production` build profile in `eas.json`
- [ ] Server-only secrets stay server-only. `DEV_API_KEY` is a local dev convenience;
      `app.config.js` refuses to embed it when `EXPO_PUBLIC_ENV=production`. Do not set it in EAS.
      Real secrets go in Supabase (`bunx supabase secrets set ...`) and are read by an edge function.

Decide whether a misconfigured production build should fail loudly: fill
`requiredProductionServices` in `src/constants/config.ts` and
`assertProductionServicesConfigured()` will throw at launch instead of shipping a silently inert
app. If you do that, **open the TestFlight build once** to prove it launches.

- [ ] Open the production/TestFlight build and confirm it launches and reaches the paywall.

## 3. App Store Connect: App Privacy labels

The labels must be **published**, not just drafted; an unpublished App Privacy section blocks
submission on its own.

- [ ] Answer the App Privacy questionnaire for every data type the app actually collects
- [ ] Publish it
- [ ] Confirm the labels and the privacy manifest in `app.json` agree exactly (see below)

### The `ios.privacyManifests` block

`app.json` in this template does **not** ship a privacy manifest, because the template does not know
which capabilities you enabled. Add one for the data your app actually collects, and nothing more.
A manifest that declares less than your ASC labels is a review flag, and so is one that declares
more. Match them in both directions.

Paste into `app.json` under `expo.ios`, then delete every entry that does not apply:

```json
"privacyManifests": {
  "NSPrivacyTracking": false,
  "NSPrivacyCollectedDataTypes": [
    {
      "NSPrivacyCollectedDataType": "NSPrivacyCollectedDataTypeEmailAddress",
      "NSPrivacyCollectedDataTypeLinked": true,
      "NSPrivacyCollectedDataTypeTracking": false,
      "NSPrivacyCollectedDataTypePurposes": [
        "NSPrivacyCollectedDataTypePurposeAppFunctionality",
        "NSPrivacyCollectedDataTypePurposeAnalytics"
      ]
    },
    {
      "NSPrivacyCollectedDataType": "NSPrivacyCollectedDataTypeUserID",
      "NSPrivacyCollectedDataTypeLinked": true,
      "NSPrivacyCollectedDataTypeTracking": false,
      "NSPrivacyCollectedDataTypePurposes": [
        "NSPrivacyCollectedDataTypePurposeAppFunctionality",
        "NSPrivacyCollectedDataTypePurposeAnalytics"
      ]
    },
    {
      "NSPrivacyCollectedDataType": "NSPrivacyCollectedDataTypePurchaseHistory",
      "NSPrivacyCollectedDataTypeLinked": true,
      "NSPrivacyCollectedDataTypeTracking": false,
      "NSPrivacyCollectedDataTypePurposes": [
        "NSPrivacyCollectedDataTypePurposeAppFunctionality",
        "NSPrivacyCollectedDataTypePurposeAnalytics"
      ]
    },
    {
      "NSPrivacyCollectedDataType": "NSPrivacyCollectedDataTypeProductInteraction",
      "NSPrivacyCollectedDataTypeLinked": true,
      "NSPrivacyCollectedDataTypeTracking": false,
      "NSPrivacyCollectedDataTypePurposes": ["NSPrivacyCollectedDataTypePurposeAnalytics"]
    },
    {
      "NSPrivacyCollectedDataType": "NSPrivacyCollectedDataTypeCrashData",
      "NSPrivacyCollectedDataTypeLinked": true,
      "NSPrivacyCollectedDataTypeTracking": false,
      "NSPrivacyCollectedDataTypePurposes": ["NSPrivacyCollectedDataTypePurposeAnalytics"]
    },
    {
      "NSPrivacyCollectedDataType": "NSPrivacyCollectedDataTypeDeviceID",
      "NSPrivacyCollectedDataTypeLinked": true,
      "NSPrivacyCollectedDataTypeTracking": false,
      "NSPrivacyCollectedDataTypePurposes": ["NSPrivacyCollectedDataTypePurposeAppFunctionality"]
    },
    {
      "NSPrivacyCollectedDataType": "NSPrivacyCollectedDataTypeCoarseLocation",
      "NSPrivacyCollectedDataTypeLinked": true,
      "NSPrivacyCollectedDataTypeTracking": false,
      "NSPrivacyCollectedDataTypePurposes": ["NSPrivacyCollectedDataTypePurposeAnalytics"]
    },
    {
      "NSPrivacyCollectedDataType": "NSPrivacyCollectedDataTypeOtherDataTypes",
      "NSPrivacyCollectedDataTypeLinked": true,
      "NSPrivacyCollectedDataTypeTracking": false,
      "NSPrivacyCollectedDataTypePurposes": [
        "NSPrivacyCollectedDataTypePurposeAppFunctionality",
        "NSPrivacyCollectedDataTypePurposeAnalytics"
      ]
    }
  ]
}
```

Which entry belongs to which capability:

| Manifest entry       | Caused by                                                                                                                                                         | Keep it when                                            |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `EmailAddress`       | Supabase auth (Apple or Google sign-in returns an email; set as a PostHog person property if analytics is on, which is why it also carries the Analytics purpose) | You have any sign-in                                    |
| `UserID`             | Supabase user id, reused as the RevenueCat App User ID and the PostHog distinct id                                                                                | You have any sign-in                                    |
| `PurchaseHistory`    | RevenueCat (entitlement and transaction state; also reaches analytics via the `is_pro` super property)                                                            | You sell a subscription or IAP                          |
| `ProductInteraction` | PostHog autocapture, screen views and your typed events                                                                                                           | Analytics is on                                         |
| `CrashData`          | PostHog error autocapture (`uncaughtExceptions`, `unhandledRejections`, `nativeCrashes` in `src/lib/analytics.tsx`)                                               | Analytics is on and you leave error autocapture enabled |
| `DeviceID`           | The PostHog SDK's device identifier                                                                                                                               | Analytics is on                                         |
| `CoarseLocation`     | PostHog server-side GeoIP. No location permission and no location API call is involved, but Apple still counts it as collected                                    | Analytics is on                                         |
| `OtherDataTypes`     | Your own domain data: onboarding answers synced to Supabase, and anything you set as a person property                                                            | You persist user answers or custom person properties    |

Notes:

- Set `NSPrivacyCollectedDataTypeTracking` to `true` and add `NSPrivacyTracking: true` only if you
  actually track across apps or share with data brokers. Neither Supabase, RevenueCat nor PostHog
  requires it in a default setup, and turning it on drags in App Tracking Transparency.
- Adding or editing this block is a **native change**: run `bunx expo prebuild` and rebuild, and
  verify the generated `ios/<App>/PrivacyInfo.xcprivacy` contains what you wrote.
- If a third-party SDK requires `NSPrivacyAccessedAPITypes` reasons, add them here too.

## 4. Subscriptions and sandbox testers

- [ ] Create the auto-renewable subscription(s) in App Store Connect, with localised display names,
      review screenshots and pricing in every region you sell in
- [ ] Add an introductory offer (free trial) if your paywall copy promises one. If only the yearly
      product has a trial, the paywall must not show trial copy for monthly. Check both plans
- [ ] Attach the products to a RevenueCat offering and to the entitlement id from
      `EXPO_PUBLIC_REVENUECAT_ENTITLEMENT`
- [ ] **Add every product you actually sell to the version's draft submission.** Products left in
      "Prepare for Submission" are not reviewed with the version, and a paywall that offers them
      will fail
- [ ] Create a **sandbox tester** account, note the credentials, and buy through the paywall end to
      end on a real device: purchase, restore, and re-launch to confirm the entitlement persists
- [ ] Verify the offline path: kill the network after purchasing and confirm the app still lets you
      in (`src/lib/storage.ts` keeps the last known entitlement for 72 hours)

With a hard paywall this section decides approval. If the reviewer's purchase fails, the paywall is
the only screen they ever see.

## 5. App Review notes

Write notes that let a reviewer reach the core of the app in under a minute. Fill in the brackets:

> [What the app does, in two sentences.]
>
> [Any hardware requirement, and what does not work on a simulator.]
>
> Sign-in: [which button, and whether it self-provisions an account. If you require an account, say
> so and say why]. [Demo credentials, or "Sign in with Apple self-provisions an account, so no demo
> login is needed".]
>
> Testing the core flow: [numbered steps from launch to the main feature].
>
> Subscription: [trial length and terms], via RevenueCat / StoreKit. Restore: [where the Restore
> control is].
>
> Account deletion: [exact path].
>
> Sandbox tester for IAP: [username / password].

- [ ] No placeholders left. Search the notes for `<`, `TODO` and `FILL IN` before submitting
- [ ] "Sign-in required" checkbox on the version matches reality. If the app has no password login
      and Sign in with Apple self-provisions, leave it unchecked and explain that in the notes
- [ ] Contact Information on the version (first name, last name, phone, email) is filled in. The
      page will not save without the phone number
- [ ] Age rating questionnaire answered truthfully. If the app generates content with an LLM or
      shows user-to-user messaging, that changes the answers
- [ ] If any user-visible text is AI-generated, there is an in-app way to report an objectionable
      response, and the notes say where it is

## 6. Account deletion under a hard paywall (5.1.1(v))

If your app creates an account, guideline 5.1.1(v) requires an in-app way to delete it. The trap is
ordering: sign-in sits **before** the paywall in `src/features/onboarding/steps.ts`, while Settings
sits **behind** the entitlement gate in `src/app/(tabs)/_layout.tsx`. A signed-in non-subscriber can
therefore never reach a Delete account row that only exists in Settings.

This template already handles it: the paywall renders a **Delete account** link in its legal row
whenever a Supabase session exists, running the same confirm dialog and `delete_current_user` RPC as
Settings and returning to `/` afterwards.

- [ ] Verify by hand: sign in, do not subscribe, and delete the account from the paywall
- [ ] Confirm `delete_current_user` really removes the row and the auth user (see
      `supabase/migrations/0001_init.sql`), and that dependent rows cascade
- [ ] If you move or restyle the paywall legal row, do not drop that link
- [ ] Keep the paywall dismissible or otherwise non-dead-ending: if fetching offerings fails, the
      user must get an error and a retry, never an infinite spinner behind a disabled CTA

## 7. Export compliance

`app.json` sets:

```json
"ios": { "infoPlist": { "ITSAppUsesNonExemptEncryption": false } }
```

That skips the export-compliance questionnaire on every upload. It is correct for an app that only
uses HTTPS and the platform's own crypto, which is the case for the template as shipped (Supabase,
RevenueCat and PostHog all talk HTTPS; `expo-secure-store` and `expo-crypto` use Apple's
frameworks).

- [ ] Still true for your app? If you add your own encryption, a bundled crypto library, or a VPN or
      proxy feature, remove the key or set it to `true` and answer the questionnaire. Declaring
      falsely is a legal problem, not just a review problem
- [ ] Changing this key is a native change: prebuild and rebuild

## 8. Before every submission

```bash
bun run typecheck
bun run lint
bun run format:check
```

- [ ] Rebuild native if anything in `app.json`, `plugins/`, entitlements or the icons changed:
      `bunx expo prebuild -p ios && bun run ios -- --device "<your simulator>"`
- [ ] Verify end to end on a physical device with
      `eas build -p ios --profile development-device`: onboarding, sign-in, purchase, restore,
      deletion, and any hardware-only feature
- [ ] Bump `version` in `app.json`. `runtimeVersion` follows `appVersion`, so a native change without
      a version bump will hand OTA updates to a binary that cannot run them
- [ ] Confirm the production (non dev-client) build has no dev-only Info.plist keys, for example
      `NSLocalNetworkUsageDescription` and the `_expo._tcp` Bonjour service
- [ ] Screenshots contain no third-party trademarks or app icons you do not own
- [ ] DAC7 / tax and banking information is complete in App Store Connect. Apple warns that a
      missing DAC7 submission can block a new app's release and payments
- [ ] Optional: add an App Store Connect API key to the `production` submit profile in `eas.json` so
      `eas submit` is repeatable from CI
