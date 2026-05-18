"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { TopAppBar } from "@/components/top-app-bar"
import { useSession, useRedirectIfAuthenticated } from "@/lib/use-session"

type LoginMethod = "password" | "magic-link"

export default function LoginPage() {
  useRedirectIfAuthenticated()
  const { saveUser } = useSession()
  const router = useRouter()
  const [method, setMethod] = useState<LoginMethod>("password")
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const json = await res.json()

    if (!json.ok) {
      setError(json.error || "Error al iniciar sesión")
      setLoading(false)
      return
    }

    saveUser(json.data.user)

    const role = json.data.user.role
    if (role === "doctor") router.push("/doctor")
    else if (role === "admin") router.push("/admin")
    else router.push("/patient")
  }

  return (
    <div className="relative min-h-screen bg-background">
      <TopAppBar role="public" />

      {/* Decorative blurs */}
      <div className="pointer-events-none fixed top-0 right-0 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[120px]" />
      <div className="pointer-events-none fixed bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-tertiary/5 blur-[100px]" />

      <main className="flex min-h-screen items-center justify-center px-6 pt-24 pb-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="rounded-3xl bg-surface-container-lowest p-8 shadow-[0_12px_48px_rgba(25,28,30,0.06)] md:p-10">
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-fixed/30 text-primary">
                <span className="material-symbols-outlined text-2xl">
                  psychiatry
                </span>
              </div>
              <h1 className="mt-5 font-headline text-2xl font-bold md:text-3xl">
                Bienvenido de vuelta a tu santuario.
              </h1>
              <p className="mt-2 text-on-surface-variant">
                Acceso seguro e instantáneo a tu cuidado.
              </p>
            </div>

            {/* Toggle */}
            <div className="mt-8 flex rounded-xl bg-surface-container-low p-1">
              <button
                onClick={() => setMethod("password")}
                className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
                  method === "password"
                    ? "bg-surface-container-lowest text-on-surface shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Correo y Contraseña
              </button>
              <button
                onClick={() => setMethod("magic-link")}
                className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
                  method === "magic-link"
                    ? "bg-surface-container-lowest text-on-surface shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Magic Link
              </button>
            </div>

            {/* Form */}
            {error && (
              <div className="mt-6 rounded-xl bg-error-container/50 px-4 py-3 text-sm font-medium text-error">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-6"
            >
              <div>
                <label
                  htmlFor="email"
                  className="font-label text-xs font-semibold uppercase tracking-widest text-on-surface-variant"
                >
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@ejemplo.com"
                  className="mt-2 block w-full h-14 border-b border-outline-variant bg-transparent px-0 text-base text-on-surface outline-none placeholder:text-on-surface-variant/50 focus:border-primary transition-colors"
                />
              </div>

              {method === "password" && (
                <div>
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="font-label text-xs font-semibold uppercase tracking-widest text-on-surface-variant"
                    >
                      Contraseña
                    </label>
                    <Link
                      href="#"
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      ¿Olvidaste?
                    </Link>
                  </div>
                  <div className="relative mt-2">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Ingresá tu contraseña"
                      className="block w-full h-14 border-b border-outline-variant bg-transparent px-0 pr-10 text-base text-on-surface outline-none placeholder:text-on-surface-variant/50 focus:border-primary transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      <span className="material-symbols-outlined text-lg">
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="primary-gradient w-full rounded-2xl py-4 font-semibold text-on-primary shadow-xl shadow-primary/15 hover:scale-[1.01] active:scale-[0.99] transition-all text-base disabled:opacity-60 disabled:hover:scale-100"
              >
                {loading ? "Ingresando..." : "Continuar"}
              </button>
            </form>

            {/* Divider */}
            <div className="mt-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-outline-variant/50" />
              <span className="text-xs font-medium text-on-surface-variant uppercase tracking-widest">
                o continuá con
              </span>
              <div className="h-px flex-1 bg-outline-variant/50" />
            </div>

            {/* Social buttons */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2.5 rounded-xl border border-outline-variant py-3.5 text-sm font-medium text-on-surface hover:bg-surface-container-low transition-all">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </button>
              <button className="flex items-center justify-center gap-2.5 rounded-xl border border-outline-variant py-3.5 text-sm font-medium text-on-surface hover:bg-surface-container-low transition-all">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
                    fill="currentColor"
                  />
                </svg>
                Apple
              </button>
            </div>

            {/* Sign up link */}
              <p className="mt-8 text-center text-sm text-on-surface-variant">
              ¿No tenés cuenta?{" "}
              <Link
                href="/signup"
                className="font-semibold text-primary hover:underline"
              >
                Registrate
              </Link>
            </p>
          </div>

          {/* Policy links */}
          <p className="mt-8 text-center text-xs text-on-surface-variant">
            Al continuar, aceptás nuestros{" "}
            <Link href="#" className="underline hover:text-primary transition-colors">
              Términos de Servicio
            </Link>{" "}
            y nuestra{" "}
            <Link href="#" className="underline hover:text-primary transition-colors">
              Política de Privacidad
            </Link>
            .
          </p>
        </div>
      </main>
    </div>
  )
}
