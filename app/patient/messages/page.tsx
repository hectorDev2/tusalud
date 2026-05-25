"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { TopAppBar } from "@/components/top-app-bar"
import { BottomNavBar } from "@/components/bottom-nav-bar"
import { ListSkeleton } from "@/components/skeleton"

interface Thread {
  id: string
  fromName: string
  fromInitials: string
  preview: string
  time: string
  unread: boolean
  threadId: string
}

const avatarColors = [
  "bg-primary-fixed text-primary",
  "bg-tertiary-fixed text-tertiary",
  "bg-secondary-container text-secondary",
  "bg-error-container text-error",
]

function getInitials(name: string): string {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2)
}

export default function MessagesPage() {
  const pathname = usePathname()
  const [messages, setMessages] = useState<Thread[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/patient/messages")
      .then((r) => r.json())
      .then((json) => {
        if (json.ok) setMessages(json.data?.messages || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

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
        <section>
          <h1 className="font-headline text-2xl font-bold text-on-surface tracking-tight">Mensajes</h1>
          <p className="font-body text-sm text-on-surface-variant mt-1">Comunicate con tu equipo de cuidado.</p>
        </section>

        <div className="bg-surface-container-lowest rounded-2xl px-4 py-3 flex items-center gap-3 shadow-[0_2px_8px_rgba(25,28,30,0.04)]">
          <span className="material-symbols-outlined text-on-surface-variant text-xl flex-shrink-0">search</span>
          <input type="text" placeholder="Busca mensajes o doctores..." className="flex-1 bg-transparent font-body text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none" />
        </div>

        {loading ? (
          <ListSkeleton count={4} />
        ) : messages.length > 0 ? (
          <section className="space-y-2">
            {messages.map((thread, i) => {
              const isSystem = thread.fromName === "Sanctuary Health"
              const href = thread.threadId === "tokens" ? "/patient/tokens" : `/patient/consultations/${thread.threadId}`
              return (
                <Link key={thread.id} href={href}
                  className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-[0_4px_16px_rgba(25,28,30,0.04)] hover:bg-surface-container-low transition-colors block"
                >
                  {isSystem ? (
                    <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-primary text-xl">health_and_safety</span>
                    </div>
                  ) : (
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-label font-bold text-sm flex-shrink-0 ${avatarColors[i % avatarColors.length]}`}>
                      {thread.fromInitials || getInitials(thread.fromName)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-label text-sm font-semibold text-on-surface truncate">{thread.fromName}</p>
                      {thread.unread ? <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" /> : <span className="material-symbols-outlined text-on-surface-variant text-base flex-shrink-0">done</span>}
                    </div>
                    <p className="font-body text-sm text-on-surface-variant mt-1 truncate">{thread.preview}</p>
                  </div>
                  <span className="font-body text-[11px] text-on-surface-variant flex-shrink-0 self-start mt-1">{thread.time}</span>
                </Link>
              )
            })}
          </section>
        ) : (
          <div className="bg-surface-container-low rounded-2xl p-8 text-center">
            <span className="material-symbols-outlined text-3xl text-on-surface-variant">chat</span>
            <p className="font-body text-sm text-on-surface-variant mt-2">No tenés mensajes todavía</p>
          </div>
        )}
      </main>
      <BottomNavBar items={navItems} />
    </div>
  )
}
