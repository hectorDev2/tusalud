"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export interface SessionUser {
  id: string
  email: string
  name: string
  role: "patient" | "doctor" | "admin"
  avatar: string
  token: string
}

export function useSession() {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user")
      if (raw) setUser(JSON.parse(raw))
    } catch {
      localStorage.removeItem("user")
    }
    setLoading(false)
  }, [])

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    localStorage.removeItem("user")
    setUser(null)
  }

  const saveUser = (u: SessionUser) => {
    localStorage.setItem("user", JSON.stringify(u))
    setUser(u)
  }

  return { user, loading, logout, saveUser }
}

function hasSessionCookie(): boolean {
  return document.cookie.split("; ").some((c) => c.startsWith("session="))
}

export function useRedirectIfAuthenticated() {
  const { user, loading } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (user && hasSessionCookie()) {
      const dest = user.role === "doctor" ? "/doctor" : user.role === "admin" ? "/admin" : "/patient"
      router.replace(dest)
    }
    if (user && !hasSessionCookie()) {
      localStorage.removeItem("user")
    }
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
