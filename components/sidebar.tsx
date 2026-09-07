"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "./theme-toggle"
import { useSession } from "@/lib/use-session"

interface SidebarItem {
  label: string
  icon: string
  href: string
  active?: boolean
}

interface SidebarProps {
  title: string
  subtitle: string
  items: SidebarItem[]
}

export function Sidebar({ title, subtitle, items }: SidebarProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const { logout } = useSession()

  async function handleLogout() {
    await logout()
    router.push("/login")
  }

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-[80] md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/30 text-on-surface-variant hover:text-primary transition-colors"
        aria-label="Abrir menú"
      >
        <span className="material-symbols-outlined">menu</span>
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[65] bg-black/30 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed top-0 left-0 z-[70] h-full w-72 bg-surface-container-lowest shadow-2xl transition-transform duration-300 md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-6 py-8 flex flex-col h-full">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl primary-gradient flex items-center justify-center text-on-primary">
                <span className="material-symbols-outlined text-xl">
                  medical_services
                </span>
              </div>
              <div>
                <h2 className="font-headline font-bold text-primary text-base">
                  TuSalud
                </h2>
                <p className="font-headline text-[10px] text-on-surface-variant uppercase tracking-tighter">
                  {title}
                </p>
                <p className="font-body text-[9px] text-on-surface-variant/70">
                  {subtitle}
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
          <nav className="flex-1 space-y-1">
            {items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`w-full rounded-xl px-4 py-3 flex items-center gap-3 transition-all font-headline font-medium text-sm ${
                  item.active
                    ? "bg-primary-fixed/30 text-primary"
                    : "text-on-surface-variant hover:bg-surface-container-low"
                }`}
              >
                <span className="material-symbols-outlined text-lg">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="pt-4 border-t border-outline-variant/20 space-y-3">
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-headline font-medium text-sm text-error hover:bg-error-container/40 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
              Cerrar sesión
            </button>
          </div>
        </div>
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col h-full w-80 fixed left-0 top-0 z-[60] bg-surface-container-lowest rounded-r-3xl shadow-lg">
        <div className="px-8 py-10 flex flex-col items-start flex-1">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-2xl primary-gradient flex items-center justify-center text-on-primary">
              <span className="material-symbols-outlined text-2xl">
                medical_services
              </span>
            </div>
            <div>
              <h2 className="font-headline font-bold text-primary text-xl">
                TuSalud
              </h2>
              <p className="font-headline font-medium text-xs text-on-surface-variant uppercase tracking-tighter">
                {title}
              </p>
              <p className="font-body text-[10px] text-on-surface-variant/70">
                {subtitle}
              </p>
            </div>
          </div>
          <nav className="w-full space-y-1">
            {items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`w-full rounded-xl px-4 py-3 flex items-center gap-3 transition-all duration-400 font-headline font-medium text-sm ${
                  item.active
                    ? "bg-primary-fixed/30 text-primary"
                    : "text-on-surface-variant hover:bg-surface-container-low"
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="px-8 pb-6 space-y-3">
          <ThemeToggle />
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-headline font-medium text-sm text-error hover:bg-error-container/40 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">logout</span>
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  )
}
