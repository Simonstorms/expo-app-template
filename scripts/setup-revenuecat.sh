#!/usr/bin/env bash
set -euo pipefail

: "${RC_SECRET:?Set your RevenueCat v2 secret key first:  export RC_SECRET=sk_...}"

BASE="https://api.revenuecat.com/v2"
AUTH="Authorization: Bearer ${RC_SECRET}"
ENTITLEMENT_KEY="pro"
ENTITLEMENT_NAME="Pro"
OFFERING_KEY="default"
OFFERING_NAME="Default"

command -v curl >/dev/null 2>&1 || { echo "curl is required"; exit 1; }
command -v python3 >/dev/null 2>&1 || { echo "python3 is required"; exit 1; }

req() {
  local method="$1" path="$2" body="${3:-}"
  if [ -n "$body" ]; then
    curl -sS -X "$method" "${BASE}${path}" -H "$AUTH" -H "Content-Type: application/json" -d "$body" -w $'\n%{http_code}'
  else
    curl -sS -X "$method" "${BASE}${path}" -H "$AUTH" -w $'\n%{http_code}'
  fi
}
st() { printf '%s' "${1##*$'\n'}"; }
bd() { printf '%s' "${1%$'\n'*}"; }
list_body() { local r; r="$(req GET "$1")"; [ "$(st "$r")" = "200" ] && bd "$r"; }

top_id() { python3 -c 'import sys,json
d=sys.stdin.read().strip()
print(json.loads(d).get("id","") if d else "")'; }
first_id() { python3 -c 'import sys,json
d=sys.stdin.read().strip()
i=json.loads(d).get("items",[]) if d else []
print(i[0]["id"] if i else "")'; }
count_items() { python3 -c 'import sys,json
d=sys.stdin.read().strip()
print(len(json.loads(d).get("items",[])) if d else 0)'; }
id_by() { python3 -c 'import sys,json
d=sys.stdin.read().strip()
items=json.loads(d).get("items",[]) if d else []
f,v=sys.argv[1],sys.argv[2]
for it in items:
    if str(it.get(f))==v:
        print(it.get("id","")); break' "$1" "$2"; }
print_items() { python3 -c 'import sys,json
d=sys.stdin.read().strip()
for it in (json.loads(d).get("items",[]) if d else []): print("   -",it.get("id",""),"|",it.get("type",it.get("name","")))'; }

echo "==> Resolving project"
resp="$(req GET /projects)"
[ "$(st "$resp")" = "200" ] || { echo "list projects failed ($(st "$resp")): $(bd "$resp")"; exit 1; }
PROJECT_ID="${RC_PROJECT_ID:-}"
if [ -z "$PROJECT_ID" ]; then
  if [ "$(bd "$resp" | count_items)" = "1" ]; then
    PROJECT_ID="$(bd "$resp" | first_id)"
  else
    echo "   Multiple projects visible. Re-run with RC_PROJECT_ID set to the right one:"
    bd "$resp" | print_items
    exit 1
  fi
fi
echo "   project: $PROJECT_ID"

echo "==> Resolving Test Store app"
resp="$(req GET "/projects/$PROJECT_ID/apps")"
[ "$(st "$resp")" = "200" ] || { echo "list apps failed ($(st "$resp")): $(bd "$resp")"; exit 1; }
APP_ID="${RC_APP_ID:-}"
if [ -z "$APP_ID" ]; then
  if [ "$(bd "$resp" | count_items)" = "1" ]; then
    APP_ID="$(bd "$resp" | first_id)"
  else
    echo "   Multiple apps found. Re-run with RC_APP_ID set to the Test Store app id:"
    bd "$resp" | print_items
    exit 1
  fi
fi
echo "   app: $APP_ID"

echo "==> Entitlement '$ENTITLEMENT_KEY'"
resp="$(req POST "/projects/$PROJECT_ID/entitlements" "$(printf '{"lookup_key":"%s","display_name":"%s"}' "$ENTITLEMENT_KEY" "$ENTITLEMENT_NAME")")"
ent_code="$(st "$resp")"
ENT_ID="$(bd "$resp" | top_id)"
if [ -z "$ENT_ID" ]; then
  ENT_ID="$(list_body "/projects/$PROJECT_ID/entitlements" | id_by lookup_key "$ENTITLEMENT_KEY")"
fi
echo "   create HTTP $ent_code, entitlement id: ${ENT_ID:-<none>}"
[ -n "$ENT_ID" ] || { echo "   could not resolve entitlement. body: $(bd "$resp")"; exit 1; }

create_product() {
  local sid="$1" typ="$2" dur="$3" name="$4" body resp code
  if [ -n "$dur" ]; then
    body="$(printf '{"store_identifier":"%s","app_id":"%s","type":"%s","display_name":"%s","title":"%s","subscription":{"duration":"%s"}}' "$sid" "$APP_ID" "$typ" "$name" "$name" "$dur")"
  else
    body="$(printf '{"store_identifier":"%s","app_id":"%s","type":"%s","display_name":"%s","title":"%s"}' "$sid" "$APP_ID" "$typ" "$name" "$name")"
  fi
  resp="$(req POST "/projects/$PROJECT_ID/products" "$body")"; code="$(st "$resp")"
  if [ "$code" = "201" ]; then bd "$resp" | top_id; return 0; fi
  if [ "$code" = "409" ]; then list_body "/projects/$PROJECT_ID/products" | id_by store_identifier "$sid"; return 0; fi
  echo "   ! product '$sid' failed ($code): $(bd "$resp")" >&2
  return 0
}

echo "==> Products (Test Store)"
PID_MONTHLY="$(create_product monthly subscription P1M "Monthly")"
PID_YEARLY="$(create_product yearly subscription P1Y "Yearly")"
PID_LIFETIME="$(create_product lifetime non_consumable "" "Lifetime")"
echo "   monthly=$PID_MONTHLY yearly=$PID_YEARLY lifetime=$PID_LIFETIME"

echo "==> Attaching products to entitlement"
ids="$(python3 -c 'import json,sys;print(json.dumps([x for x in sys.argv[1:] if x]))' "$PID_MONTHLY" "$PID_YEARLY" "$PID_LIFETIME")"
resp="$(req POST "/projects/$PROJECT_ID/entitlements/$ENT_ID/actions/attach_products" "$(printf '{"product_ids":%s}' "$ids")")"
echo "   attach HTTP $(st "$resp")"

echo "==> Offering '$OFFERING_KEY'"
resp="$(req POST "/projects/$PROJECT_ID/offerings" "$(printf '{"lookup_key":"%s","display_name":"%s"}' "$OFFERING_KEY" "$OFFERING_NAME")")"
OFF_ID="$(bd "$resp" | top_id)"
if [ -z "$OFF_ID" ]; then
  OFF_ID="$(list_body "/projects/$PROJECT_ID/offerings" | id_by lookup_key "$OFFERING_KEY")"
fi
echo "   offering id: ${OFF_ID:-<none>}"
[ -n "$OFF_ID" ] || { echo "   could not resolve offering"; exit 1; }

create_package() {
  local lk="$1" name="$2" pid="$3" resp code pkg
  [ -n "$pid" ] || { echo "   skip package $lk (product missing)"; return 0; }
  resp="$(req POST "/projects/$PROJECT_ID/offerings/$OFF_ID/packages" "$(printf '{"lookup_key":"%s","display_name":"%s"}' "$lk" "$name")")"
  code="$(st "$resp")"
  if [ "$code" = "201" ]; then pkg="$(bd "$resp" | top_id)"
  elif [ "$code" = "409" ]; then pkg="$(list_body "/projects/$PROJECT_ID/offerings/$OFF_ID/packages" | id_by lookup_key "$lk")"
  else echo "   ! package $lk failed ($code): $(bd "$resp")"; return 0; fi
  resp="$(req POST "/projects/$PROJECT_ID/packages/$pkg/actions/attach_products" "$(printf '{"products":[{"product_id":"%s","eligibility_criteria":"all"}]}' "$pid")")"
  local acode; acode="$(st "$resp")"
  if [ "$acode" = "200" ]; then
    echo "   package $lk -> product attached"
  elif [ "$acode" = "422" ]; then
    echo "   package $lk -> product already attached (skipping)"
  else
    echo "   package $lk -> attach HTTP $acode"
    echo "      body: $(bd "$resp")"
  fi
}

echo "==> Packages"
create_package '$rc_monthly'  "Monthly"  "$PID_MONTHLY"
create_package '$rc_annual'   "Annual"   "$PID_YEARLY"
create_package '$rc_lifetime' "Lifetime" "$PID_LIFETIME"

echo "==> Marking '$OFFERING_KEY' as the current offering"
resp="$(req POST "/projects/$PROJECT_ID/offerings/$OFF_ID" "$(printf '{"display_name":"%s","is_current":true}' "$OFFERING_NAME")")"
echo "   set-current HTTP $(st "$resp")"

echo ""
echo "Done. Verify in the RevenueCat dashboard:"
echo "  - Entitlement 'pro' with monthly/yearly/lifetime attached"
echo "  - Offering 'default' is the Current offering, with 3 packages"
