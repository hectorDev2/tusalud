import Link from "next/link"

const navLinks = [
  { href: "/login", label: "Iniciar sesión" },
  { href: "/signup", label: "Registrate gratis", primary: true },
]

const platformLinks = [
  { href: "#", label: "Encontrá un Doctor" },
  { href: "#", label: "Consultas" },
  { href: "#", label: "Tokens" },
  { href: "#", label: "App Móvil" },
]

const supportLinks = [
  { href: "#", label: "Centro de Ayuda" },
  { href: "#", label: "Seguridad y Privacidad" },
  { href: "#", label: "Estado" },
  { href: "#", label: "Contacto" },
]

const legalLinks = [
  { href: "#", label: "Política de Privacidad" },
  { href: "#", label: "Términos de Servicio" },
  { href: "#", label: "Aviso HIPAA" },
]

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Decorative blurs */}
      <div className="pointer-events-none absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/3 -left-60 h-[400px] w-[400px] rounded-full bg-tertiary/5 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-[300px] w-[300px] rounded-full bg-primary-fixed/10 blur-[80px]" />

      {/* Nav */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 md:px-12 lg:px-24">
        <Link href="/" className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-2xl">
            medical_services
          </span>
          <span className="text-xl font-bold text-primary font-headline tracking-tight">
            Sanctuary Health
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) =>
            link.primary ? (
              <Link
                key={link.label}
                href={link.href}
                className="primary-gradient text-on-primary px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm"
              >
                {link.label}
              </Link>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ),
          )}
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="relative z-10 px-6 pt-20 pb-16 md:px-12 md:pt-28 lg:px-24 lg:pt-36">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:gap-20">
              <div className="flex-1">
                <h1 className="font-headline text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
                  Atención clínica{" "}
                  <span className="text-gradient">reimaginada</span>
                </h1>
                <p className="mt-6 max-w-lg text-lg leading-relaxed text-on-surface-variant md:text-xl">
                  Viví un santuario para tu salud. Telemedicina segura
                  y centrada en las personas que prioriza tu tranquilidad.
                </p>
                <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                  <Link
                    href="/signup"
                    className="primary-gradient text-on-primary px-8 py-4 rounded-2xl font-semibold shadow-xl shadow-primary/15 hover:scale-[1.02] active:scale-[0.98] transition-all text-center text-base"
                  >
                    Empezar consulta gratis
                  </Link>
                  <Link
                    href="#features"
                    className="rounded-2xl border border-outline-variant px-8 py-4 font-semibold text-on-surface-variant hover:bg-surface-container-low hover:border-outline transition-all text-center text-base"
                  >
                    Cómo funciona
                  </Link>
                </div>
              </div>

              {/* Decorative floating card */}
              <div className="mt-16 lg:mt-0 flex-shrink-0">
                <div className="relative">
                  <div className="h-72 w-72 rounded-3xl bg-surface-container-lowest shadow-[0_12px_48px_rgba(25,28,30,0.06)] flex flex-col items-center justify-center p-8 md:h-80 md:w-80">
                    <span className="material-symbols-outlined text-5xl text-primary">
                      verified
                    </span>
                    <p className="mt-4 text-center font-headline text-lg font-semibold text-on-surface">
                      Confiá en miles
                    </p>
                    <p className="mt-1 text-center text-sm text-on-surface-variant">
                      de pacientes alrededor del mundo
                    </p>
                    <div className="mt-6 flex -space-x-2">
                      {["#00647c", "#00685c", "#007f9d", "#62fae3"].map(
                        (color, i) => (
                          <div
                            key={i}
                            className="h-8 w-8 rounded-full border-2 border-surface-container-lowest"
                            style={{ backgroundColor: color }}
                          />
                        ),
                      )}
                    </div>
                  </div>
                  <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-primary/5 blur-2xl" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section
          id="features"
          className="relative z-10 px-6 py-20 md:px-12 lg:px-24"
        >
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <h2 className="font-headline text-3xl font-bold md:text-4xl">
                Todo lo que necesitás para sanar
              </h2>
              <p className="mt-4 text-on-surface-variant text-lg max-w-xl mx-auto">
                Atención compasiva diseñada alrededor de tu vida, no al revés.
              </p>
            </div>
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {/* Card 1 */}
              <div className="rounded-3xl bg-surface-container-lowest p-8 shadow-[0_12px_48px_rgba(25,28,30,0.06)]">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-fixed/30 text-primary">
                  <span className="material-symbols-outlined text-2xl">
                    schedule
                  </span>
                </div>
                <h3 className="mt-6 font-headline text-xl font-bold">
                  Atención bajo demanda
                </h3>
                <p className="mt-3 leading-relaxed text-on-surface-variant">
                  Conectate con un profesional autorizado en minutos. Sin turnos,
                  sin salas de espera.
                </p>
              </div>

              {/* Card 2 — highlighted */}
              <div className="rounded-3xl primary-gradient p-8 shadow-[0_12px_48px_rgba(0,100,124,0.15)] text-on-primary">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-on-primary">
                  <span className="material-symbols-outlined text-2xl">
                    stethoscope
                  </span>
                </div>
                <h3 className="mt-6 font-headline text-xl font-bold">
                  Doctores Expertos
                </h3>
                <p className="mt-3 leading-relaxed text-on-primary/80">
                  Médicos certificados de las mejores instituciones, evaluados
                  por su excelencia.
                </p>
              </div>

              {/* Card 3 */}
              <div className="rounded-3xl bg-surface-container-lowest p-8 shadow-[0_12px_48px_rgba(25,28,30,0.06)]">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-tertiary-fixed/30 text-tertiary">
                  <span className="material-symbols-outlined text-2xl">
                    lock
                  </span>
                </div>
                <h3 className="mt-6 font-headline text-xl font-bold">
                  Seguro y Privado
                </h3>
                <p className="mt-3 leading-relaxed text-on-surface-variant">
                  Cumplimiento HIPAA con encriptación de extremo a extremo. Tus
                  datos te pertenecen.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Token Value Prop */}
        <section className="relative z-10 px-6 py-20 md:px-12 lg:px-24">
          <div className="mx-auto max-w-6xl">
            <div className="rounded-3xl bg-surface-container-low p-12 md:p-16 lg:p-20">
              <div className="flex flex-col lg:flex-row lg:items-center lg:gap-16">
                <div className="flex-1">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-fixed/30 text-primary">
                    <span className="material-symbols-outlined text-2xl">
                      token
                    </span>
                  </div>
                  <h2 className="mt-6 font-headline text-3xl font-bold md:text-4xl">
                    El Libro de Tokens Semanal
                  </h2>
                  <p className="mt-4 max-w-lg text-lg leading-relaxed text-on-surface-variant">
                    Recibís <strong className="text-primary">3 tokens gratis</strong>{" "}
                    cada semana para gastar en consultas, recetas o
                    derivaciones a especialistas. Usalos o guardalos — tu cuidado,
                    tu ritmo.
                  </p>
                  <ul className="mt-8 space-y-4">
                    {[
                      "Sin cargos ocultos, sin facturas sorpresa",
                      "Acumulá tokens no usados (hasta 12)",
                      "Compartí tokens con familiares",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-primary text-sm mt-0.5">
                          check_circle
                        </span>
                        <span className="text-on-surface-variant">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-10 lg:mt-0 flex-shrink-0">
                  <div className="h-56 w-56 rounded-3xl bg-surface-container-lowest shadow-[0_12px_48px_rgba(25,28,30,0.06)] flex flex-col items-center justify-center p-6 md:h-64 md:w-64">
                    <span className="text-6xl font-headline font-bold text-primary">
                      3
                    </span>
                    <span className="mt-1 text-sm font-medium text-on-surface-variant uppercase tracking-wider">
                      Tokens Gratis
                    </span>
                    <span className="mt-1 text-xs text-on-surface-variant">
                      se renuevan cada lunes
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative z-10 px-6 py-20 md:px-12 lg:px-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-headline text-3xl font-bold md:text-4xl">
              ¿Listo para una mejor experiencia?
            </h2>
            <p className="mt-4 text-lg text-on-surface-variant">
              Sumate a miles de pacientes que encontraron su santuario.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/signup"
                className="primary-gradient text-on-primary px-10 py-4 rounded-2xl font-semibold shadow-xl shadow-primary/15 hover:scale-[1.02] active:scale-[0.98] transition-all text-base"
              >
                Empezá gratis
              </Link>
              <Link
                href="/login"
                className="rounded-2xl border border-outline-variant px-10 py-4 font-semibold text-on-surface-variant hover:bg-surface-container-low hover:border-outline transition-all text-base"
              >
                Iniciar sesión
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-outline-variant/40 px-6 py-16 md:px-12 lg:px-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 md:grid-cols-4">
            <div className="md:col-span-1">
              <Link href="/" className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-xl">
                  medical_services
                </span>
                <span className="text-lg font-bold text-primary font-headline tracking-tight">
                  Sanctuary Health
                </span>
              </Link>
              <p className="mt-4 text-sm leading-relaxed text-on-surface-variant max-w-xs">
                Tu santuario para una telemedicina segura y compasiva.
              </p>
            </div>
            <div>
              <h4 className="font-label text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                Plataforma
              </h4>
              <ul className="mt-5 space-y-3">
                {platformLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-on-surface-variant hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-label text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                Soporte
              </h4>
              <ul className="mt-5 space-y-3">
                {supportLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-on-surface-variant hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-label text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                Legal
              </h4>
              <ul className="mt-5 space-y-3">
                {legalLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-on-surface-variant hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-14 border-t border-outline-variant/30 pt-8 text-center text-sm text-on-surface-variant">
            &copy; {new Date().getFullYear()} Sanctuary Health. Todos los
            derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  )
}
