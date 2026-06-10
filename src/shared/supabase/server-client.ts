import { createHmac } from 'crypto';
import { createClient } from '@supabase/supabase-js';
import type { DecodedIdToken } from 'firebase-admin/auth';

function base64url(buf: Buffer): string {
  return buf.toString('base64url');
}

function mintSupabaseJwt(decoded: DecodedIdToken): string {
  const secret = process.env.SUPABASE_JWT_SECRET;
  if (!secret) throw new Error('Missing SUPABASE_JWT_SECRET env var');

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    aud: 'authenticated',
    exp: now + 3600,
    iat: now,
    sub: decoded.uid,
    email: decoded.email || '',
    role: 'authenticated',
    iss: 'supabase',
  };

  const header = { alg: 'HS256', typ: 'JWT' };
  const headerB64 = base64url(Buffer.from(JSON.stringify(header)));
  const payloadB64 = base64url(Buffer.from(JSON.stringify(payload)));
  const signature = createHmac('sha256', secret)
    .update(`${headerB64}.${payloadB64}`)
    .digest('base64url');

  return `${headerB64}.${payloadB64}.${signature}`;
}

export function createAuthenticatedClient(decoded: DecodedIdToken) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase env vars');
  }

  const jwt = mintSupabaseJwt(decoded);
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${jwt}` } },
    auth: { persistSession: false },
  });
}
