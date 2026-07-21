#!/usr/bin/env bash
set -euo pipefail

# Pushes the EXPO_PUBLIC_* client config from your local .env into EAS-managed
# environment variables (plaintext visibility) for the `preview` and
# `production` environments. This is the documented way to feed config to EAS
# cloud builds without committing keys to git:
#   https://docs.expo.dev/eas/environment-variables/
#
# All EXPO_PUBLIC_* values are embedded in the client bundle and are therefore
# public by design, so `plaintext` visibility is correct (never `secret`).
#
# Prerequisites (run once, interactively):
#   npm i -g eas-cli        # or use the bundled npx eas-cli
#   eas login
#   eas init                # links this repo to an EAS project (writes projectId)
#
# Then:
#   ./scripts/setup-eas-env.sh
#
# Notes:
#   - EXPO_PUBLIC_ENV is intentionally skipped: it is set per build profile in
#     eas.json, not as a shared managed variable.
#   - Empty values in .env are skipped, so unused providers are left alone.

ENV_FILE="${ENV_FILE:-.env}"
ENVIRONMENTS=(${EAS_ENVIRONMENTS:-preview production})

VARS=(
  EXPO_PUBLIC_SUPABASE_URL
  EXPO_PUBLIC_SUPABASE_ANON_KEY
  EXPO_PUBLIC_REVENUECAT_IOS_KEY
  EXPO_PUBLIC_REVENUECAT_ANDROID_KEY
  EXPO_PUBLIC_REVENUECAT_ENTITLEMENT
  EXPO_PUBLIC_SUPERWALL_IOS_KEY
  EXPO_PUBLIC_SUPERWALL_ANDROID_KEY
  EXPO_PUBLIC_SUPERWALL_PLACEMENT
  EXPO_PUBLIC_POSTHOG_KEY
  EXPO_PUBLIC_POSTHOG_HOST
  EXPO_PUBLIC_POSTHOG_SESSION_REPLAY
)

# Resolve the eas binary (global install preferred, else npx).
if command -v eas >/dev/null 2>&1; then
  EAS=(eas)
else
  EAS=(npx --yes eas-cli)
fi

[ -f "$ENV_FILE" ] || { echo "error: $ENV_FILE not found (run from the repo root)"; exit 1; }

echo "==> Checking EAS auth"
"${EAS[@]}" whoami >/dev/null 2>&1 || { echo "   not logged in. Run: eas login"; exit 1; }

echo "==> Checking project link"
"${EAS[@]}" project:info >/dev/null 2>&1 || {
  echo "   this repo is not linked to an EAS project. Run: eas init"; exit 1;
}

val() { grep -E "^$1=" "$ENV_FILE" | head -n1 | cut -d= -f2- ; }

upsert() {
  local name="$1" value="$2" env="$3"
  if "${EAS[@]}" env:create --name "$name" --value "$value" \
      --environment "$env" --visibility plaintext --non-interactive >/dev/null 2>&1; then
    echo "   created $name ($env)"
  elif "${EAS[@]}" env:update --name "$name" --value "$value" \
      --environment "$env" --visibility plaintext --non-interactive >/dev/null 2>&1; then
    echo "   updated $name ($env)"
  else
    echo "   FAILED  $name ($env) — check: eas env:list --environment $env"
  fi
}

for env in "${ENVIRONMENTS[@]}"; do
  echo "==> Environment: $env"
  for name in "${VARS[@]}"; do
    value="$(val "$name")"
    if [ -z "$value" ]; then
      echo "   skip    $name (empty in $ENV_FILE)"
      continue
    fi
    upsert "$name" "$value" "$env"
  done
done

echo "==> Done. Verify with: eas env:list --environment production"
