"use client"

import { TopAppBar } from "@/components/top-app-bar"
import { BottomNavBar } from "@/components/bottom-nav-bar"
import { tokenTransactions } from "@/lib/mock-data"
import { usePathname } from "next/navigation"

function getTransactionIcon(type: string, description: string): string {
  if (description.toLowerCase().includes("reset")) return "autorenew"
  if (description.toLowerCase().includes("consult")) return "videocam"
  if (description.toLowerCase().includes("prescription") || description.toLowerCase().includes("refill"))
    return "medication"
  return "receipt_long"
}

export default function TokenLedger() {
  const pathname = usePathname()

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
          {/* Decorative blur circle */}
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
          <div className="relative z-10">
            <p className="font-body text-sm text-white/80">Saldo actual</p>
            <h2 className="font-headline text-4xl font-bold tracking-tight mt-1">12 Tokens</h2>
            <button className="mt-4 primary-gradient text-white font-label text-sm font-semibold px-5 py-2.5 rounded-xl bg-white/20 backdrop-blur-md border border-white/20 hover:bg-white/30 active:scale-[0.97] transition-all">
              Simular compra
            </button>
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
          <div className="space-y-px">
            {tokenTransactions.map((tx, i) => {
              const isCredit = tx.type === "credit"
              const bgClass =
                i % 2 === 0 ? "bg-surface-container-low" : "bg-surface-container-lowest"
              const amountClass = isCredit ? "text-tertiary" : "text-error"
              const amountSign = isCredit ? "+" : "-"

              return (
                <div
                  key={tx.id}
                  className={`${bgClass} rounded-2xl px-4 py-3 flex items-center gap-3`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isCredit ? "bg-tertiary-fixed/40" : "bg-error-container"
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg text-on-surface-variant">
                      {getTransactionIcon(tx.type, tx.description)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-label text-sm font-semibold text-on-surface">{tx.description}</p>
                    <p className="font-body text-xs text-on-surface-variant mt-0.5">{tx.detail}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`font-headline text-lg font-bold ${amountClass}`}>
                      {amountSign}
                      {tx.amount}
                    </p>
                    <p className="font-body text-[11px] text-on-surface-variant">{tx.status}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Decorative Health Image */}
        <div className="flex justify-center py-4">
          <div className="w-20 h-20 rounded-full bg-primary-fixed/30 flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-primary-fixed-dim">
              favorite
            </span>
          </div>
        </div>
      </main>
      <BottomNavBar items={navItems} />
    </div>
  )
}
