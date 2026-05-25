"use client"

import { use, useEffect, useRef, useState } from "react"
import { TopAppBar } from "@/components/top-app-bar"
import { BottomNavBar } from "@/components/bottom-nav-bar"
import { usePathname } from "next/navigation"
import { useChat } from "@/lib/use-chat"
import { useSession } from "@/lib/use-session"

export default function PatientConsultationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const pathname = usePathname()
  const { user } = useSession()
  const { messages, loading, sending, sendMessage } = useChat(id, user?.id || "")
  const [input, setInput] = useState("")
  const [doctorName, setDoctorName] = useState("")
  const chatEnd = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch(`/api/patient/consultations/${id}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.ok && json.data?.consultation?.doctor) {
          setDoctorName(json.data.consultation.doctor.name)
        }
      })
  }, [id])

  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || sending) return
    const ok = await sendMessage(input)
    if (ok) setInput("")
    inputRef.current?.focus()
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <TopAppBar showProfile role="patient" />

      <div className="max-w-lg mx-auto px-4 pt-28 pb-4">
        <div className="flex items-center gap-2 mb-4">
          <span className={`w-2.5 h-2.5 rounded-full ${messages.length > 0 ? "bg-tertiary animate-pulse" : "bg-outline"}`} />
          <div>
            <span className="text-sm font-semibold text-on-surface">
              {doctorName || "Consulta"}
            </span>
            <p className="text-xs text-on-surface-variant">
              {loading ? "Cargando..." : `${messages.length} mensajes`}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-[0_12px_48px_rgba(25,28,30,0.06)] overflow-hidden">
          <div className="h-[500px] overflow-y-auto p-5 space-y-4 no-scrollbar bg-surface-container-low/30">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-pulse flex flex-col items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-container-high" />
                  <p className="text-sm text-on-surface-variant">Cargando conversación...</p>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant/30">
                    chat
                  </span>
                  <p className="mt-2 text-sm text-on-surface-variant">
                    Todavía no hay mensajes. Contale al doctor qué te trae hoy.
                  </p>
                </div>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.sender_id === user?.id
                return (
                  <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                        isMe
                          ? "bg-primary text-white rounded-br-sm"
                          : "bg-surface-container-low text-on-surface rounded-bl-sm"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-[10px] mt-1 ${isMe ? "text-white/60" : "text-on-surface-variant/60"}`}>
                        {new Date(msg.created_at).toLocaleTimeString("es-AR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                )
              })
            )}
            <div ref={chatEnd} />
          </div>

          <form onSubmit={handleSend} className="flex items-center gap-3 px-5 py-4 border-t border-outline-variant/30 bg-white">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribí tu mensaje..."
              disabled={sending}
              className="flex-1 bg-surface-container-low rounded-xl px-4 py-2.5 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-on-surface-variant/50 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || sending}
              className="w-10 h-10 rounded-xl primary-gradient flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-transform disabled:opacity-40 disabled:hover:scale-100 shrink-0"
            >
              <span className="material-symbols-outlined text-[20px]">
                {sending ? "hourglass" : "send"}
              </span>
            </button>
          </form>
        </div>
      </div>

      <BottomNavBar
        items={[
          { label: "Inicio", icon: "home", href: "/patient", active: pathname === "/patient" },
          { label: "Consultas", icon: "monitoring", href: "/patient/consultations", active: pathname.startsWith("/patient/consultations") },
          { label: "Mensajes", icon: "chat", href: "/patient/messages", active: false },
          { label: "Cuenta", icon: "account_circle", href: "/patient/profile", active: false },
        ]}
      />
    </div>
  )
}
