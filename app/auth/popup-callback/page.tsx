"use client"

import { useEffect } from "react"

export default function GooglePopupCallbackPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const callbackHasError = Boolean(params.get("error"))
    const role = params.get("role")
    const result = {
      type: "tusalud-google-auth",
      status: callbackHasError ? "error" : "success",
      role,
      timestamp: Date.now(),
    }

    window.localStorage.setItem("tusalud-google-auth-result", JSON.stringify(result))

    if (window.opener && !window.opener.closed) {
      window.opener.postMessage(result, window.location.origin)

      // Keep a direct navigation fallback for browsers that isolate or drop
      // the opener after returning from Google's origin.
      if (!callbackHasError && (role === "patient" || role === "doctor" || role === "admin")) {
        window.opener.location.replace(`/${role}`)
      }

      window.close()
    }
  }, [])

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
      <div>
        <p className="text-lg font-semibold text-on-surface">
          Autenticación con Google
        </p>
        <p className="mt-2 text-sm text-on-surface-variant">
          {"Procesando la autenticación… Ya podés cerrar esta ventana."}
        </p>
      </div>
    </main>
  )
}
