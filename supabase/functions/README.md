# Edge functions

`secure-call` is the reference pattern for anything the app must not do from the client: hold a paid
API key, sign a request, or talk to a vendor that bills per call. The secret lives in Supabase, never
in the bundle, and the caller has to be a signed-in Supabase user.

Nothing in the app requires these functions. With an empty `.env` the app never calls them.

## Flow

1. Preflight (`OPTIONS`) is answered from `_shared/cors.ts`.
2. The caller's `Authorization: Bearer <access token>` is verified with `supabase.auth.getUser()`.
   No session, no call.
3. The server secret is read from `Deno.env` and the request is rejected if it is missing.
4. The body is parsed and narrowed before use.
5. With no `UPSTREAM_URL` set the function echoes a typed result, so you can wire the client and see
   a real round trip before you have a vendor. Set `UPSTREAM_URL` (or replace `runAction`) and the
   same handler forwards the call with the secret attached.

## Before you ship this

The function verifies the caller and caps the request body at 32 KB, but it does **not** rate limit.
Any signed-in user can drive unlimited billed upstream calls. Add a per-user quota (a counter table
with an RLS-protected upsert is enough) before pointing `UPSTREAM_URL` at anything that costs money.

`Access-Control-Allow-Origin` is `*`. That is fine for a native client, which does not enforce CORS,
but tighten it to your own origin if you also call this function from the web build.

## Deploy

```bash
supabase functions deploy secure-call
supabase secrets set UPSTREAM_API_KEY=your-key
supabase secrets set UPSTREAM_URL=https://api.example.com/v1/do-something
```

## Call it from the app

```ts
const { data, error } = await supabase.functions.invoke('secure-call', {
  body: { action: 'ping', payload: { hello: 'world' } },
});
```
