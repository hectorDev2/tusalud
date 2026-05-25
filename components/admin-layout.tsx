"use client"

import Link from "next/link"
import { Sidebar } from "./sidebar"

interface AdminLayoutProps {
  title: string
  subtitle: string
  sidebarItems: { label: string; icon: string; href: string; active?: boolean }[]
  bottomNavItems: { label: string; icon: string; href: string; active?: boolean }[]
  children: React.ReactNode
}

export function AdminLayout({ title, subtitle, sidebarItems, bottomNavItems, children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar title={title} subtitle={subtitle} items={sidebarItems} />

      {/* Header */}
      <header className="fixed top-0 z-50 left-0 md:left-80 right-0 bg-background/85 backdrop-blur-xl border-b border-surface-container">
        <div className="flex items-center justify-between h-16 pl-14 md:pl-6 pr-6">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary">medical_services</span>
            <span className="text-xl font-bold text-primary font-headline tracking-tight">
              Sanctuary Health
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="md:hidden">{/* ThemeToggle is in the nav bar area */}</div>
            <button className="relative p-2 rounded-xl hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full ring-2 ring-background" />
            </button>
            <div className="w-9 h-9 rounded-full overflow-hidden bg-surface-container-high shadow-sm flex items-center justify-center ring-2 ring-white">
              <span className="material-symbols-outlined text-on-surface-variant text-lg">person</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="md:pl-80 pt-16 px-6 pb-24 md:pb-8">
        {children}
      </main>

      {/* Bottom nav — mobile only */}
      <div className="md:hidden">
        <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-8 pt-3 bg-white/85 backdrop-blur-2xl rounded-t-[2.5rem] shadow-[0_-12px_48px_rgba(0,0,0,0.06)]">
          {bottomNavItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center px-5 py-2 scale-95 active:scale-90 transition-transform duration-200 ${
                item.active
                  ? "bg-primary-fixed/30 text-primary rounded-2xl"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={item.active ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {item.icon}
              </span>
              <span className="font-label text-[10px] font-medium uppercase tracking-widest mt-1">
                {item.label}
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
