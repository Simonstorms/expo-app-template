# Performance and size playbook

How to measure bundle size and startup cost on an Expo SDK 57 / RN 0.86 / Hermes app without
fooling yourself, and the findings that keep recurring on apps built from this template.

This is a method, not a report. Every number you read anywhere (including here) is from some other
app on some other day. Re-measure on yours.

## Rule zero: measure the artifact you ship

Most size "wins" evaporate under measurement because the tool you used reports a different number
than the one users download. Three traps, in order of how often they catch people.

### Expo Atlas reports pre-minification bytes

```bash
bun run analyze     # EXPO_ATLAS=1 expo export --platform ios
```

This writes `.expo/atlas.jsonl`, and it is the right tool for **finding** which modules are in the
graph and who pulled them in. It is the wrong tool for deciding how many bytes a deletion saves.

The ratio from graph bytes to shipped bytecode is not a constant and is **not per-module**. On a
comparable app the whole graph minified to roughly 45% of its Atlas size, and the Hermes bytecode
came out around 1.5 times the minified bytes. But vendors that ship pre-minified `dist` files
(RevenueCat, Supabase) barely shrink at all, while hand-written TypeScript sources (Reanimated) shrink
a lot. So `atlas_kb * some_factor = bytecode_kb` is wrong for any individual module.

Use Atlas to rank candidates, then measure the bytecode delta per change.

### Measure the `.hbc`, with the optimising flags on

```bash
bun run export:size
# EXPO_UNSTABLE_METRO_OPTIMIZE_GRAPH=1 EXPO_UNSTABLE_TREE_SHAKING=1 expo export --platform ios
```

Then measure the emitted Hermes bytecode:

```bash
find dist/_expo/static/js/ios -name '*.hbc' -exec ls -l {} +
du -sk dist
```

Record the number before your change, make exactly one change, export again, diff. Anything else is
guessing. Note that the two flags are worth having on for their own sake (they removed a couple of
hundred KB of bytecode on a comparable app for zero code change), and they **stack** with dead-module
deletions rather than replacing them: tree shaking does not remove a module's strings from the
bytecode string table, so a module that is unreachable but still resolved still costs you.

### Never measure native size from `node_modules` or a Debug build

A pod's directory size in `node_modules`, and the size of a Debug `.xcarchive`, both overstate
release cost by a wide margin, and the Debug-to-Release ratio is not stable across Swift static
archives. If a finding says "this dependency is 48 MB", that number came from a Debug archive and
means nothing about the IPA.

To get a real number: build a Release archive (or an `eas build --profile production`), then compare
two archives that differ only in the dependency you are questioning. `Assets.car` is worth inspecting
separately with `assetutil --info`, because oversized icon and splash source images get compiled once
per appearance variant and can quietly become the largest single thing in the binary.

## `EXPO_USE_PRECOMPILED_MODULES`

Expo can ship precompiled React Native modules instead of compiling them from source. The tradeoff:

- **On** (the default): much faster native builds, because ~40 pods do not compile. But the modules
  arrive as dynamic frameworks, and dynamic frameworks cannot be dead-stripped, which added roughly
  12 MB to a comparable app's install size.
- **Off** (`EXPO_USE_PRECOMPILED_MODULES=0`): slow from-source build, smaller binary.

`eas.json` in this template therefore sets it to `"0"` on **`preview` and `production` only**. The
`development` and `development-device` profiles leave it at the default, because paying a full
from-source compile of every pod on every dev-client build buys a dev build nothing. If you ever add
this variable, keep that split: release profiles off, dev profiles untouched.

## Excluding unused transitive native modules from autolinking

Native modules autolink transitively. A dependency of a dependency can pull in a pod and a framework
you never call from JS. The lever is an autolinking exclude in `package.json`:

```json
"expo": {
  "autolinking": {
    "apple": { "exclude": ["@some-org/some-unused-module"] }
  }
}
```

This template ships **no** excludes, because nothing in it has been proven dead on a Release archive.
The technique is here so you can apply it when your own dependency tree grows one.

How to qualify a candidate honestly:

1. Confirm zero modules from it appear in the production sourcemap or the Atlas graph.
2. Confirm every JS reference to it is platform-gated to a platform you do not ship, or lives inside
   a function body that is never reached.
3. Exclude it, rebuild, and confirm the app still launches and the feature that transitively depends
   on it still works.
4. Measure a Release archive before and after.

> Do **not** exclude `@expo/dom-webview`. It renders the dev-client redbox via `@expo/log-box`'s
> `'use dom'` component. Excluding it looks like a free win in an archive listing and costs you the
> error overlay in development, which is a terrible trade.

## `react-native-purchases-ui`: what it weighs versus what it buys

`react-native-purchases-ui` is a large native dependency, separate from `react-native-purchases`
(which is what actually processes purchases and owns entitlements). Removing it does not touch
purchasing.

In this template it buys exactly two things:

- `src/features/paywall/screens/revenuecat-paywall-screen.tsx`, the RevenueCat-hosted paywall, which
  is **off by default** (`USE_REVENUECAT_HOSTED_PAYWALL = false` in `paywall-route.tsx`).
- `presentCustomerCenter()` in `src/lib/revenuecat-ui.ts`, one row in Settings.

So if you keep the custom paywall (the default) and you do not need the Customer Center, the whole
dependency can go. Replacements for the Customer Center row, in order of preference:

- `Purchases.showManageSubscriptions()` from `react-native-purchases`
- `Linking.openURL('https://apps.apple.com/account/subscriptions')`

If you drop it, replace **both** `src/lib/revenuecat-ui.ts` and `src/lib/revenuecat-ui.web.ts`, and
delete the hosted paywall screen and its `.web.tsx` sibling. Measure a Release archive before
believing any MB figure you read about this package; the widely quoted numbers come from Debug
archives.

## React Compiler bails out silently

`app.json` sets `experiments.reactCompiler: true`, so components are auto-memoized. The compiler
skips any component it cannot compile, **without failing the build**, and the most common cause is a
`try { ... } finally { ... }` in the component body. On a comparable app that silently left the two
hottest screens with zero memo slots each while every other screen got over a hundred.

- Detection without a rebuild: run `babel-plugin-react-compiler` over `src/` and look for bailouts,
  or check for `finally` in component bodies (`grep -rn finally src/`). At the time of writing this
  template has none.
- Prevention: `eslint-plugin-react-hooks` ships an `unsupported-syntax` rule that reports exactly
  this. `eslint-config-expo/flat` already enables it, but at `warn`, and a warning does not fail
  `bun run lint`. This template now raises it to `error` in `eslint.config.js`, which is what makes
  it a guarantee rather than a note in the output.
- The fix is to hoist the `try`/`catch`/`finally` out of the component body into a plain async
  function or a hook, not to delete the `finally`.
- Sequencing warning: fixing a bailout memoizes that screen for the first time, which is exactly
  when latent Rules-of-React violations surface as stale UI. Review the screen's ref mutations and
  async reads in the same change.

## Reanimated rules

Two rules cover most animation problems in practice.

**Never call an animation function inside a reactive worklet.** A `useAnimatedStyle` worklet
re-evaluates whenever any of its dependencies change, and a `withTiming` inside it **restarts** from
the current value each time instead of continuing. It looks correct when the dependency is a boolean
that flips once per animation, and it breaks the moment that dependency becomes something that
changes continuously (a slider fraction, a keyboard offset, a scroll position).

Drive a shared value in a callback and read it plainly in the style:

```ts
const progress = useSharedValue(0);
const onToggle = () => {
  progress.set(withTiming(done ? 1 : 0, timing));
};
const style = useAnimatedStyle(() => ({ opacity: progress.get() }));
```

Eight places in this template still inline the animation in the style worklet:

- `src/components/ui/selection-row.tsx`, plus byte-for-byte copies of the same selection scale in
  `usage-screen.tsx`, `obstacles-screen.tsx`, `source-screen.tsx` and `tried-before-screen.tsx`
- `src/components/ui/frost-toggle.tsx` (knob style) and `habits-screen.tsx` (the same toggle)
- `src/features/onboarding/components/step-check.tsx`, which inlines `withTiming` inside
  `useAnimatedStyle` rather than `useDerivedValue`

All are driven by a boolean prop today, so they behave. The four duplicated selection rows should
collapse onto `SelectionRow` first; that turns eight sites into four and removes four copies of the
same spring. Fix the rest before any of them starts being driven by a continuous value.

**Animate transforms and opacity, not layout.** Animating `width`, `height`, `margin` or `padding`
runs a full Yoga layout pass plus a mount-instruction diff every frame. Use `scaleX`/`scaleY` and
`translate` instead, and pair a progress-bar animation with a single `setTimeout` for the completion
callback rather than a 1 Hz interval that re-renders text nobody is looking at. Long-running
animations are the worst offenders: a bar that animates `width` for the duration of a multi-minute
timer costs orders of magnitude more than any mount animation.

## Recurring findings worth checking on your app

Cheap, independent, and each one has bitten a real build.

- **Splash and icon source images.** iOS decodes the splash image during the native launch phase,
  before any JS runs, so an oversized source is literally first on the time-to-interactive path.
  Generate it near the rendered size (`imageWidth` in the `expo-splash-screen` plugin options is 76
  here). The app icon source is compiled once per appearance variant, so one unoptimised 1024x1024
  PNG can become several MB of `Assets.car`.
- **Images and fonts dominate download size** on an app this size, well ahead of JS. Convert large
  PNGs to WebP (the deployment target is far above the iOS 14 ImageIO WebP floor) and resize anything
  whose pixel dimensions exceed its rendered size by more than 2x. If you add a custom font family,
  import the specific weights, never the package barrel: a Google Fonts barrel `require`s every
  weight it ships, and you probably use four. Be careful with font subsetting: a Latin-only subset
  renders tofu the moment non-Latin text reaches that `Text`, and Apple's own fonts have licence
  terms that restrict modification.
- **First-run delays.** Deliberate splash dwell timers belong on the first run only. Check
  `HERO_DELAY_MS` in `src/features/onboarding/screens/splash-screen.tsx` is scoped that way, and that
  the cost is a product decision rather than an accident.
- **Session and entitlement queries gate the first paint.** Everything that decides where a returning
  user lands reads `useSession` and `useEntitlement`, so a missing `gcTime` or `initialData` shows up
  as a blank frame. Both hooks here already set `gcTime: Infinity` and short-circuit with
  `initialData` when the capability flag is off. Keep it that way.
- **Prefer `getSession()` over `getUser()`** anywhere you only need to know who is signed in.
  `getUser()` is a network round trip; `getSession()` is local. A background sweep that calls
  `getUser()` per item turns into a round trip per item.
- **`retry: 2` is the default** in `src/lib/query-client.ts`. Set `retry: false` on any query whose
  failure is permanent rather than transient, for example a remote lookup for a resource that simply
  does not exist.
- **Shadows without an opaque background** make iOS render an offscreen alpha mask (`shadowPath` is
  nil), which is a classic UI-thread stutter in a scrolling list. Give shadowed surfaces an opaque
  `backgroundColor` and set `borderCurve`.
- **Batch your writes.** A stepper or slider that persists to AsyncStorage on every tick will write
  dozens of times per editing session. Debounce, or flush once on teardown, and remember that
  swipe-back is an exit path too.
- **Analytics starts before your root layout.** `new PostHog(...)` runs at module scope in
  `src/lib/analytics.tsx`, so remote config and replay init begin before the first render. That is
  why `preloadFeatureFlags` is `false` by default; turning it on adds two network requests and an
  AsyncStorage write to every launch, and is only worth it if you actually read a flag.
- **Blur is not free on scroll paths.** `GlassSurface` is real blur; `FrostCard` is a gradient. The
  scrolling screens use the gradient deliberately. Do not swap one for the other without profiling.
- **Route layouts are eagerly evaluated.** Expo Router does not eagerly evaluate route screens in
  production, but it does evaluate `_layout.tsx` modules, and `src/app/(tabs)/_layout.tsx` imports
  the session and entitlement hooks. Supabase and RevenueCat are therefore on the pre-first-paint
  path no matter how you arrange the service hooks in the root layout.
- **Things that are already right, do not "fix" them.** `staleTime: 30_000` and
  `refetchOnWindowFocus: false` in the query client, the AppState gate on Supabase auth refresh in
  `src/lib/supabase.ts`, `<ReducedMotionConfig mode={ReduceMotion.System} />` in the root layout,
  native navigation throughout with no JS navigator, and no barrel exports in `src/`.

## Things not worth doing

- **Code splitting, `React.lazy`, Re.Pack.** Counterproductive with Hermes, which already memory-maps
  the bytecode.
- **Adding an image library for local assets.** A fixed-size `require()`d asset gains nothing from
  one, and you pay megabytes of native framework. For remote images, `Image.prefetch` covers the case
  without a new dependency.
- **Removing `react-dom` and `react-native-web`.** `web.output: 'static'` and the `.web.ts` platform
  files make web a live target here, and neither package carries a native pod.
- **Micro-optimising bounded lists.** Virtualisation earns nothing over a `.map()` across a handful
  of items. Spend the effort on the animation and image work instead.

## Regression gates worth adding to CI

CI here (`.github/workflows/ci.yml`) runs `typecheck`, `lint` and `format:check` on bun. The template
deliberately ships the **measurement** scripts (`bun run analyze`, `bun run export:size`) and **no
hard size gate**, because a byte budget that is not tuned to a specific app is either meaningless or
a daily false alarm. Add gates once you have your own baseline:

- A job that runs `bun run export:size`, records the `.hbc` byte count and total `dist` bytes, and
  comments the delta on the pull request. Report first, fail later, once you know the normal noise.
- A budget check that fails only on a large jump (for example more than 3% bytecode growth in one
  pull request), not on every increase.
- `eslint-plugin-react-hooks`' `unsupported-syntax` rule at `error` (already wired in
  `eslint.config.js`), so a `try`/`finally` can never silently un-memoize a screen again.
- Runtime budgets, once you have numbers from the oldest device you support: cold start to first
  render, navigation p95, and no memory drift across repeated runs of your core loop.
