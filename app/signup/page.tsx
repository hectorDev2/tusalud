"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useRedirectIfAuthenticated } from "@/lib/use-session"

export default function SignupPage() {
  useRedirectIfAuthenticated()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!acceptedTerms) return
    setLoading(true)
    setError("")

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: fullName, email, password }),
    })

    const json = await res.json()

    if (!json.ok) {
      setError(json.error || "Error al crear la cuenta")
      setLoading(false)
      return
    }

    localStorage.setItem("user", JSON.stringify(json.data.user))
    router.push("/verify")
  }

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Decorative blurs */}
      <div className="pointer-events-none fixed -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
      <div className="pointer-events-none fixed bottom-0 -left-40 h-[400px] w-[400px] rounded-full bg-tertiary/5 blur-[100px]" />

      {/* Minimal branding header */}
      <header className="relative z-10 flex items-center justify-center px-6 pt-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-2xl">
            medical_services
          </span>
          <span className="text-xl font-bold text-primary font-headline tracking-tight">
            Sanctuary Health
          </span>
        </Link>
      </header>

      <main className="relative z-10 flex items-center justify-center px-6 pt-8 pb-16">
        <div className="w-full max-w-md">
          <div className="rounded-3xl bg-surface-container-lowest p-8 shadow-[0_12px_48px_rgba(25,28,30,0.06)] md:p-10">
            <div className="text-center">
              <h1 className="font-headline text-2xl font-bold md:text-3xl">
                Empieza tu viaje hacia el bienestar.
              </h1>
              <p className="mt-2 text-on-surface-variant">
                Crea tu cuenta y empezá tu viaje de cuidado hoy mismo.
              </p>
            </div>

            {error && (
              <div className="rounded-xl bg-error-container/50 px-4 py-3 text-sm font-medium text-error">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-6"
            >
              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="font-label text-xs font-semibold uppercase tracking-widest text-on-surface-variant"
                >
                  Nombre completo
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="mt-2 block w-full h-14 rounded-t-lg bg-surface-container-low px-4 text-base text-on-surface outline-none border-b-2 border-transparent placeholder:text-on-surface-variant/50 focus:border-primary transition-all"
                />
              </div>

              {/* Email */}
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
                  className="mt-2 block w-full h-14 rounded-t-lg bg-surface-container-low px-4 text-base text-on-surface outline-none border-b-2 border-transparent placeholder:text-on-surface-variant/50 focus:border-primary transition-all"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="font-label text-xs font-semibold uppercase tracking-widest text-on-surface-variant"
                >
                  Contraseña
                </label>
                <div className="relative mt-2">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Crea una contraseña segura"
                    className="block w-full h-14 rounded-t-lg bg-surface-container-low px-4 pr-12 text-base text-on-surface outline-none border-b-2 border-transparent placeholder:text-on-surface-variant/50 focus:border-primary transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    <span className="material-symbols-outlined text-lg">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Terms checkbox */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary transition-colors"
                />
                <span className="text-sm leading-relaxed text-on-surface-variant">
                  Acepto los{" "}
                  <Link
                    href="#"
                    className="font-medium text-primary hover:underline"
                  >
                    Términos de Servicio
                  </Link>{" "}
                  y la{" "}
                  <Link
                    href="#"
                    className="font-medium text-primary hover:underline"
                  >
                    Política de Privacidad
                  </Link>
                  .
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                className="primary-gradient w-full rounded-2xl py-4 font-semibold text-on-primary shadow-xl shadow-primary/15 hover:scale-[1.01] active:scale-[0.99] transition-all text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                disabled={!acceptedTerms || loading}
              >
                {loading ? "Creando cuenta..." : "Crear cuenta"}
              </button>
            </form>

            {/* Log in link */}
            <p className="mt-8 text-center text-sm text-on-surface-variant">
              ¿Ya tienes cuenta?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary hover:underline"
              >
                Iniciar sesión
              </Link>
            </p>
          </div>

          {/* Security badges */}
          <div className="mt-8 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-tertiary">
                verified
              </span>
              <span className="text-xs font-medium text-on-surface-variant">
                Cumplimiento HIPAA
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-tertiary">
                encryption
              </span>
              <span className="text-xs font-medium text-on-surface-variant">
                Encriptado 256-bit
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
