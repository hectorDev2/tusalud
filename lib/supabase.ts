import { createServerClient } from "@supabase/ssr"
import { createBrowserClient } from "@supabase/ssr"
import { type NextRequest, NextResponse } from "next/server"
import type { Database } from "./database.types"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// ---------- SSR: for middleware & route handlers ----------

export function createRouteClient(request: NextRequest, response?: NextResponse) {
  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) => {
          response?.cookies.set(name, value, options)
        })
      },
    },
  })
}

export function createRouteClientWithResponse(request: NextRequest) {
  // Use a single stable response object so setAll mutates it in place.
  // Creating a new NextResponse inside setAll was a bug: the returned
  // `response` reference pointed to the original empty object.
  const response = NextResponse.next({ request })

  const supabase = createRouteClient(request, response)

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
