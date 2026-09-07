"use client"

import { useState, useEffect } from "react"
import { TopAppBar } from "@/components/top-app-bar"
import { BottomNavBar } from "@/components/bottom-nav-bar"
import { ListSkeleton } from "@/components/skeleton"

interface Transaction {
  id: string
  type: "credit" | "debit"
  amount: number
  description: string
  detail: string
  date: string
  status: string
}

function getTransactionIcon(description: string): string {
  if (description.toLowerCase().includes("reset") || description.toLowerCase().includes("reinicio")) return "autorenew"
  if (description.toLowerCase().includes("consult")) return "videocam"
  if (description.toLowerCase().includes("prescription") || description.toLowerCase().includes("receta")) return "medication"
  return "receipt_long"
}

export default function TokenLedger() {
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/patient/tokens")
      .then((r) => r.json())
      .then((json) => {
        if (json.ok) {
          setBalance(json.data?.balance || 0)
          setTransactions(json.data?.transactions || [])
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const navItems = [
    { label: "Inicio", icon: "home", href: "/patient" },
    { label: "Consultas", icon: "monitoring", href: "/patient/consultations" },
    { label: "Mensajes", icon: "chat", href: "/patient/messages" },
    { label: "Cuenta", icon: "account_circle", href: "/patient/tokens", active: true },
  ]

  return (
    <div className="min-h-screen bg-background pb-28">
      <TopAppBar showProfile role="patient" />
      <main className="px-4 pt-24 space-y-6 max-w-lg mx-auto">
        {/* Hero Balance Card */}
        <section className="primary-gradient rounded-3xl p-6 text-white shadow-[0_12px_48px_rgba(0,100,124,0.2)] relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
          <div className="relative z-10">
            <p className="font-body text-sm text-white/80">Saldo actual</p>
            <h2 className="font-headline text-4xl font-bold tracking-tight mt-1">
              {loading ? "..." : `${balance} Tokens`}
            </h2>
          </div>
        </section>

        {/* Info Notice */}
        <div className="bg-surface-container-low rounded-2xl px-4 py-3 flex items-center gap-3">
          <span className="material-symbols-outlined text-on-surface-variant text-xl">info</span>
          <p className="font-body text-xs text-on-surface-variant">
            Los tokens se reinician cada lunes a las 00:00
          </p>
        </div>

        {/* Transaction History */}
        <section>
          <h3 className="font-headline text-lg font-semibold text-on-surface mb-3">
            Historial de transacciones
          </h3>
          {loading ? (
            <ListSkeleton count={4} />
          ) : transactions.length > 0 ? (
            <div className="space-y-px">
              {transactions.map((tx, i) => {
                const isCredit = tx.type === "credit"
                const bgClass = i % 2 === 0 ? "bg-surface-container-low" : "bg-surface-container-lowest"
                const amountClass = isCredit ? "text-tertiary" : "text-error"
                const amountSign = isCredit ? "+" : "-"
                return (
                  <div key={tx.id} className={`${bgClass} rounded-2xl px-4 py-3 flex items-center gap-3`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isCredit ? "bg-tertiary-fixed/40" : "bg-error-container"}`}>
                      <span className="material-symbols-outlined text-lg text-on-surface-variant">
                        {getTransactionIcon(tx.description)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-label text-sm font-semibold text-on-surface">{tx.description}</p>
                      <p className="font-body text-xs text-on-surface-variant mt-0.5">{tx.detail}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`font-headline text-lg font-bold ${amountClass}`}>
                        {amountSign}{tx.amount}
                      </p>
                      <p className="font-body text-[11px] text-on-surface-variant">{tx.status}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="bg-surface-container-low rounded-2xl p-8 text-center">
              <span className="material-symbols-outlined text-3xl text-on-surface-variant">receipt_long</span>
              <p className="font-body text-sm text-on-surface-variant mt-2">Sin transacciones todavía</p>
            </div>
          )}
        </section>
      </main>
      <BottomNavBar items={navItems} />
    </div>
  )
}
