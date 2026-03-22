import { createClient } from '@supabase/supabase-js'

/**
 * Supabase admin client using service_role key.
 * Bypasses RLS — use only in server-side API routes for trusted operations.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}
