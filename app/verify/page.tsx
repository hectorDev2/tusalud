"use client"

import { useState } from "react"
import Link from "next/link"

export default function VerifyPage() {
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)

  const handleResend = async () => {
    setResending(true)
    const email = JSON.parse(localStorage.getItem("user") || "{}").email || ""
    await fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
    setResending(false)
    setResent(true)
    setTimeout(() => setResent(false), 4000)
  }

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Decorative blurs */}
      <div className="pointer-events-none fixed top-1/3 -left-40 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[120px]" />
      <div className="pointer-events-none fixed bottom-0 right-0 h-[350px] w-[350px] rounded-full bg-tertiary/5 blur-[100px]" />

      <main className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-3xl bg-surface-container-lowest p-8 shadow-[0_12px_48px_rgba(25,28,30,0.06)] md:p-10">
            {/* Success toast */}
            <div className="mb-8 flex items-center gap-3 rounded-2xl bg-tertiary-fixed/20 px-5 py-4">
              <span className="material-symbols-outlined text-tertiary">
                verified
              </span>
              <span className="text-sm font-medium text-tertiary">
                Link seguro enviado
              </span>
            </div>

            {/* Illustration area */}
            <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-3xl bg-surface-container-low md:h-56 md:w-56">
              <div className="relative">
                <span className="material-symbols-outlined text-7xl text-primary/30">
                  mail
                </span>
                <span className="material-symbols-outlined absolute -bottom-2 -right-2 text-2xl text-primary">
                  shield
                </span>
              </div>
            </div>

            <div className="mt-8 text-center">
              <h1 className="font-headline text-2xl font-bold md:text-3xl">
                Revisa tu correo
              </h1>
              <p className="mt-3 leading-relaxed text-on-surface-variant">
                Te enviamos un link seguro a tu correo electrónico. Haz
                clic en el link para verificar tu cuenta y continuar a tu santuario.
              </p>
            </div>

            <div className="mt-8 space-y-4">
              <Link
                href="/patient"
                className="primary-gradient flex items-center justify-center gap-2 w-full rounded-2xl py-4 font-semibold text-on-primary shadow-xl shadow-primary/15 hover:scale-[1.01] active:scale-[0.99] transition-all text-base"
              >
                <span className="material-symbols-outlined text-lg">
                  check_circle
                </span>
                Ya verifiqué mi email — Ir al Dashboard
              </Link>

              <div className="text-center">
                {resent ? (
                  <p className="text-sm text-tertiary font-medium">
                    ¡Link reenviado! Revisa tu bandeja de entrada.
                  </p>
                ) : (
                  <button
                    onClick={handleResend}
                    disabled={resending}
                    className="text-sm font-medium text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
                  >
                    {resending ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        Reenviando...
                      </span>
                    ) : (
                      "¿No recibiste el correo? Reenviar link"
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Back to login */}
          <p className="mt-8 text-center text-sm text-on-surface-variant">
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Volver a Iniciar sesión
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
