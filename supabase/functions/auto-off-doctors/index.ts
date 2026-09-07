/**
 * Edge Function: auto-off-doctors
 * Scheduled: every 5 minutes via Supabase Dashboard.
 *
 * Sets available=false for doctors who haven't sent a heartbeat in >15 minutes.
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const { data: affected, error } = await supabase.rpc("auto_off_inactive_doctors")

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }

  return new Response(
    JSON.stringify({ ok: true, doctors_deactivated: affected }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  )
})
