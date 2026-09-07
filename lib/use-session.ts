"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { createBrowserSupabase } from "@/lib/supabase"
import type { Session } from "@supabase/supabase-js"

export interface SessionUser {
  id: string
  email: string
  name: string
  role: "patient" | "doctor" | "admin"
  avatar: string
  token: string
}

async function fetchProfile(session: Session): Promise<SessionUser | null> {
  const supabase = createBrowserSupabase()
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, name, role, avatar")
    .eq("id", session.user.id)
    .single()

  if (!profile) return null

  return {
    id: profile.id,
    email: session.user.email || "",
    name: profile.name,
    role: profile.role,
    avatar: profile.avatar || "",
    token: session.access_token,
  }
}

export function useSession() {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createBrowserSupabase()
    let cancelled = false

    // Supabase Auth is the only source of identity. localStorage must not
    // restore a user when the server-side session is absent or expired.
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (cancelled) return
      if (session) {
        const u = await fetchProfile(session)
        if (!cancelled) {
          setUser(u)
        }
      } else {
        setUser(null)
      }
      if (!cancelled) setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (cancelled) return
        if (session) {
          const u = await fetchProfile(session)
          if (!cancelled) {
            setUser(u)
          }
        } else {
          setUser(null)
        }
      }
    )

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [])

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    const supabase = createBrowserSupabase()
    await supabase.auth.signOut()
    localStorage.removeItem("user")
    localStorage.removeItem("session")
    setUser(null)
  }, [])

  const saveUser = useCallback(async () => {
    const supabase = createBrowserSupabase()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      setUser(null)
      return
    }

    setUser(await fetchProfile(session))
  }, [])

  return { user, loading, logout, saveUser }
}

export function useRedirectIfAuthenticated() {
  const { user, loading } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!user) return

    const dest =
      user.role === "doctor" ? "/doctor"
      : user.role === "admin" ? "/admin"
      : "/patient"
    router.replace(dest)
  }, [user, loading, router])
}

export function useRedirectIfNotAuthenticated() {
  const { user, loading } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.replace("/login")
    }
  }, [user, loading, router])

  return { user, loading }
}
