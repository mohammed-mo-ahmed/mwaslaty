import {createClient} from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client: ReturnType<typeof createClient> | null = null;

export function getSupabase() {
  if (client) return client;
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase env vars missing — Supabase features disabled');
    return null;
  }
  client = createClient(supabaseUrl, supabaseAnonKey);
  return client;
}
