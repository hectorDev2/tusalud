/**
 * Edge Function: weekly-token-grant
 * Scheduled: every Monday at 00:00 America/Lima
 * Cron (UTC-5): "0 5 * * 1"
 *
 * Assigns 3 free tokens to every patient who hasn't received a grant this week.
 * Idempotent: safe to re-run.
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const { data: affected, error } = await supabase.rpc("weekly_token_grant")

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }

  return new Response(
    JSON.stringify({ ok: true, patients_granted: affected }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  )
})
