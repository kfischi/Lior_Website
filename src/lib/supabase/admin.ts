import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';

/**
 * Server-only Supabase admin client (service-role). Returns null when env is
 * not configured, so every caller MUST handle the null case — this is the
 * graceful fallback that lets the site run without a database.
 */
let cached: SupabaseClient<Database> | null | undefined;

export function getSupabaseAdmin(): SupabaseClient<Database> | null {
  if (cached !== undefined) return cached;

  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    cached = null;
    return cached;
  }

  cached = createClient<Database>(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}

/** True when the database layer is available. */
export function isDbEnabled(): boolean {
  return getSupabaseAdmin() !== null;
}
