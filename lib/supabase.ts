import { createServerClient } from "@supabase/ssr"
import { createBrowserClient } from "@supabase/ssr"
import { type NextRequest, NextResponse } from "next/server"
import type { Database } from "./database.types"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// ---------- SSR: for middleware & route handlers ----------

export function createRouteClient(request: NextRequest) {
  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: () => {},
    },
  })
}

export function createRouteClientWithResponse(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => {
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        )
      },
    },
  })

  return { supabase, response }
}

// ---------- Browser: for client components ----------

export function createBrowserSupabase() {
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}

// ---------- Admin (service_role): for seed scripts only ----------

let _serviceClient: ReturnType<typeof createClient<Database>> | null = null

export function getServiceClient() {
  if (!_serviceClient) {
    _serviceClient = createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  }
  return _serviceClient
}

// ---------- Session helpers ----------

export function getUserFromSession(request: Request): { userId: string; role: string; name: string } | null {
  const cookie = request.headers.get("cookie") || ""
  const match = cookie.split("; ").find((c) => c.startsWith("session="))
  if (!match) return null
  try {
    return JSON.parse(decodeURIComponent(match.split("=")[1]))
  } catch {
    return null
  }
}
