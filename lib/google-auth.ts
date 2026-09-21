"use client"

import { createBrowserSupabase } from "@/lib/supabase"

export type AuthRole = "patient" | "doctor" | "admin"

interface GoogleAuthCallbacks {
  onSuccess: (role: AuthRole) => void | Promise<void>
  onError: (message: string) => void
}

export async function startGoogleAuth({ onSuccess, onError }: GoogleAuthCallbacks) {
  const popup = window.open(
    "about:blank",
    "tusalud-google-auth",
    "popup,width=500,height=650,left=200,top=100"
  )

  if (!popup) {
    onError("Habilitá las ventanas emergentes para continuar con Google")
    return
  }

  const supabase = createBrowserSupabase()
  const startedAt = Date.now()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      skipBrowserRedirect: true,
      redirectTo: `${window.location.origin}/api/auth/callback?popup=1`,
    },
  })

  if (error) {
    popup.close()
    onError(error.message)
    return
  }

  if (!data.url) {
    popup.close()
    onError("No se pudo iniciar la autenticación con Google")
    return
  }

  let handled = false

  const cleanup = () => {
    window.removeEventListener("message", handleMessage)
    window.removeEventListener("storage", handleStorage)
    window.clearInterval(pollId)
  }

  const finishLogin = async (result: { status?: string; role?: string; timestamp?: number }) => {
    if (handled || (result.timestamp !== undefined && result.timestamp < startedAt)) return

    handled = true
    cleanup()

    if (result.status === "error") {
      onError("No se pudo completar la autenticación con Google")
      return
    }

    const role = result.role
    if (role !== "patient" && role !== "doctor" && role !== "admin") {
      onError("No se pudo determinar el rol del usuario")
      return
    }

    await onSuccess(role)
  }

  const handleMessage = (event: MessageEvent) => {
    if (
      event.origin !== window.location.origin ||
      event.source !== popup ||
      event.data?.type !== "tusalud-google-auth"
    ) {
      return
    }

    void finishLogin(event.data)
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key !== "tusalud-google-auth-result" || !event.newValue) return

    try {
      const result = JSON.parse(event.newValue) as {
        type?: string
        status?: string
        role?: string
        timestamp?: number
      }

      if (result.type === "tusalud-google-auth") void finishLogin(result)
    } catch {
      // Ignore malformed cross-tab messages.
    }
  }

  let checkingSession = false
  const checkServerSession = async () => {
    if (checkingSession || handled) return
    checkingSession = true

    try {
      const response = await fetch("/api/auth/verify", { cache: "no-store" })
      if (!response.ok) return

      const json = await response.json()
      const role = json.data?.role
      if (json.ok && role) {
        void finishLogin({ status: "success", role, timestamp: Date.now() })
      }
    } finally {
      checkingSession = false
    }
  }

  window.addEventListener("message", handleMessage)
  window.addEventListener("storage", handleStorage)
  popup.location.href = data.url

  const pollId = window.setInterval(() => {
    if (popup.closed) {
      cleanup()
      if (!handled) onError("La ventana de Google se cerró antes de terminar")
      return
    }

    void checkServerSession()
  }, 500)
}
