import { createClient } from 'npm:@supabase/supabase-js@2';

import { errorResponse, jsonResponse, preflightResponse } from '../_shared/cors.ts';

type SecureCallRequest = {
  action: string;
  payload: Record<string, unknown>;
};

type SecureCallResponse = {
  ok: true;
  source: 'echo' | 'upstream';
  action: string;
  result: Record<string, unknown>;
  userId: string;
  receivedAt: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseRequestBody(value: unknown): SecureCallRequest | null {
  if (!isRecord(value)) return null;
  if (typeof value.action !== 'string' || value.action.length === 0) return null;
  if (value.payload !== undefined && !isRecord(value.payload)) return null;
  return { action: value.action, payload: isRecord(value.payload) ? value.payload : {} };
}

async function runAction(
  body: SecureCallRequest,
  apiKey: string,
  userId: string,
): Promise<SecureCallResponse> {
  const receivedAt = new Date().toISOString();
  const upstreamUrl = Deno.env.get('UPSTREAM_URL');

  if (!upstreamUrl) {
    return {
      ok: true,
      source: 'echo',
      action: body.action,
      result: body.payload,
      userId,
      receivedAt,
    };
  }

  const response = await fetch(upstreamUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ action: body.action, payload: body.payload }),
  });

  if (!response.ok) {
    throw new Error(`upstream responded ${response.status}`);
  }

  const data: unknown = await response.json();
  return {
    ok: true,
    source: 'upstream',
    action: body.action,
    result: isRecord(data) ? data : { data },
    userId,
    receivedAt,
  };
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return preflightResponse();
  }
  if (request.method !== 'POST') {
    return errorResponse('method not allowed', 405);
  }

  const authorization = request.headers.get('Authorization') ?? '';
  if (authorization.length === 0) {
    return errorResponse('unauthorized', 401);
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: authorization } } },
  );

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) {
    return errorResponse('unauthorized', 401);
  }

  const apiKey = Deno.env.get('UPSTREAM_API_KEY');
  if (!apiKey) {
    return errorResponse('UPSTREAM_API_KEY not set', 500);
  }

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return errorResponse('bad request', 400);
  }

  const body = parseRequestBody(rawBody);
  if (!body) {
    return errorResponse('bad request', 400);
  }

  try {
    return jsonResponse(await runAction(body, apiKey, user.id));
  } catch (error) {
    console.error('secure-call failed', error);
    return errorResponse('upstream failed', 502);
  }
});
