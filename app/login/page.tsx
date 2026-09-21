"use client"

import { useState } from "react"
import Link from "next/link"
import { TopAppBar } from "@/components/top-app-bar"
import { useSession, useRedirectIfAuthenticated } from "@/lib/use-session"
import { useToast } from "@/components/toast"
import { GoogleAuthButton } from "@/components/google-auth-button"

const DEMO_PROFILES = [
  { label: "Paciente", icon: "person", email: "patient@test.com", password: "123", color: "bg-tertiary-fixed/30 text-tertiary hover:bg-tertiary-fixed/50" },
  { label: "Médico", icon: "stethoscope", email: "doctor@test.com", password: "123", color: "bg-primary-fixed/30 text-primary hover:bg-primary-fixed/50" },
  { label: "Admin", icon: "admin_panel_settings", email: "admin@admin.com", password: "admin", color: "bg-secondary-container text-secondary hover:bg-secondary-container/70" },
]

export default function LoginPage() {
  useRedirectIfAuthenticated()
  const { saveUser } = useSession()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()

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
    console.log("Login response:", json)

    if (!json.ok) {
      setError(json.error || "Error al iniciar sesión")
      toast(json.error || "Error al iniciar sesión", "error")
      setLoading(false)
      return
    }

    const userData = json.data.user
    console.log("User data:", userData)

    // Refresh the client state from the Supabase session, never from the
    // response body or localStorage.
    await saveUser()

    const role = userData.role
    console.log("Redirecting to:", role)

    // Force a full page reload to bypass Next.js router
    window.location.replace("/" + role)
  }

  function handleGoogleAuthSuccess(role: "patient" | "doctor" | "admin") {
    window.location.replace(`/${role}`)
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

            {/* Demo profiles */}
            <div className="mt-6">
              <p className="mb-2 text-center text-xs font-medium uppercase tracking-widest text-on-surface-variant">
                Acceso rápido — demo
              </p>
              <div className="flex gap-2">
                {DEMO_PROFILES.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => {
                      setEmail(p.email)
                      setPassword(p.password)
                    }}
                    className={`flex flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-3 text-xs font-semibold transition-colors ${p.color}`}
                  >
                    <span className="material-symbols-outlined text-xl">{p.icon}</span>
                    {p.label}
                  </button>
                ))}
              </div>
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
                    placeholder="Ingresa tu contraseña"
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

            {/* Social login */}
            <GoogleAuthButton
              onError={(message) => {
                setError(message)
                toast(message, "error")
              }}
              onSuccess={handleGoogleAuthSuccess}
            />

            {/* Sign up link */}
              <p className="mt-8 text-center text-sm text-on-surface-variant">
              ¿No tienes cuenta?{" "}
              <Link
                href="/signup"
                className="font-semibold text-primary hover:underline"
              >
                Regístrate
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
