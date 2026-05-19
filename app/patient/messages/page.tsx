"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { TopAppBar } from "@/components/top-app-bar"
import { BottomNavBar } from "@/components/bottom-nav-bar"

interface Thread {
  id: string
  name: string
  preview: string
  time: string
  unread: boolean
  href: string
  isSystem?: boolean
}

const threads: Thread[] = [
  {
    id: "t1",
    name: "Dr. Sarah Miller",
    preview: "Tu receta fue enviada a la farmacia. Saludos, Dra. Miller",
    time: "Hace 2h",
    unread: true,
    href: "/patient/consultations/c1",
  },
  {
    id: "t2",
    name: "Dr. James Chen",
    preview: "Los resultados de laboratorio están listos. Podés...",
    time: "Ayer",
    unread: false,
    href: "/patient/consultations/c2",
  },
  {
    id: "t3",
    name: "Dr. Elena Vance",
    preview: "Recordatorio: tienes consulta mañana a las 9:00 AM",
    time: "15 Oct",
    unread: false,
    href: "/patient/consultations/c3",
  },
  {
    id: "t4",
    name: "Dr. Marcus Thorne",
    preview: "Tu presión arterial está estable. Seguí con...",
    time: "10 Oct",
    unread: false,
    href: "/patient/consultations/c4",
  },
  {
    id: "t5",
    name: "Sanctuary Health",
    preview: "Tus 3 tokens semanales fueron acreditados",
    time: "8 Oct",
    unread: true,
    href: "/patient/tokens",
    isSystem: true,
  },
]

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
}

const avatarColors = [
  "bg-primary-fixed text-primary",
  "bg-tertiary-fixed text-tertiary",
  "bg-secondary-container text-secondary",
  "bg-error-container text-error",
]

export default function MessagesPage() {
  const pathname = usePathname()

  const navItems = [
    { label: "Inicio", icon: "home", href: "/patient", active: pathname === "/patient" },
    { label: "Consultas", icon: "monitoring", href: "/patient/consultations", active: pathname.startsWith("/patient/consultations") },
    { label: "Mensajes", icon: "chat", href: "/patient/messages", active: pathname === "/patient/messages" },
    { label: "Cuenta", icon: "account_circle", href: "/patient/tokens", active: pathname === "/patient/tokens" },
  ]

  return (
    <div className="min-h-screen bg-background pb-28">
      <TopAppBar showProfile role="patient" />
      <main className="px-4 pt-24 space-y-6 max-w-lg mx-auto">
        {/* Header */}
        <section>
          <h1 className="font-headline text-2xl font-bold text-on-surface tracking-tight">
            Mensajes
          </h1>
          <p className="font-body text-sm text-on-surface-variant mt-1">
            Comunicate con tu equipo de cuidado.
          </p>
        </section>

        {/* Search Bar */}
        <div className="bg-surface-container-lowest rounded-2xl px-4 py-3 flex items-center gap-3 shadow-[0_2px_8px_rgba(25,28,30,0.04)]">
          <span className="material-symbols-outlined text-on-surface-variant text-xl flex-shrink-0">
            search
          </span>
          <input
            type="text"
            placeholder="Busca mensajes o doctores..."
            className="flex-1 bg-transparent font-body text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none"
          />
        </div>

        {/* Threads List */}
        <section className="space-y-2">
          {threads.map((thread, i) => (
            <Link
              key={thread.id}
              href={thread.href}
              className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-[0_4px_16px_rgba(25,28,30,0.04)] hover:bg-surface-container-low transition-colors block"
            >
              {thread.isSystem ? (
                <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary text-xl">
                    health_and_safety
                  </span>
                </div>
              ) : (
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-label font-bold text-sm flex-shrink-0 ${avatarColors[i % avatarColors.length]}`}
                >
                  {getInitials(thread.name)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-label text-sm font-semibold text-on-surface truncate">
                    {thread.name}
                  </p>
                  {thread.unread ? (
                    <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                  ) : (
                    <span className="material-symbols-outlined text-on-surface-variant text-base flex-shrink-0">
                      done
                    </span>
                  )}
                </div>
                <p className="font-body text-sm text-on-surface-variant mt-1 truncate">
                  {thread.preview}
                </p>
              </div>
              <span className="font-body text-[11px] text-on-surface-variant flex-shrink-0 self-start mt-1">
                {thread.time}
              </span>
            </Link>
          ))}
        </section>
      </main>
      <BottomNavBar items={navItems} />
    </div>
  )
}
