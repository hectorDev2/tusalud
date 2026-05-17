"use client"

import Link from "next/link"

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
  return (
    <aside className="hidden md:flex flex-col h-full w-80 fixed left-0 top-0 z-[60] bg-surface-container-lowest rounded-r-3xl shadow-lg">
      <div className="px-8 py-10 flex flex-col items-start">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-12 h-12 rounded-2xl primary-gradient flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined text-2xl">
              medical_services
            </span>
          </div>
          <div>
            <h2 className="font-headline font-bold text-primary text-xl">
              Sanctuary Health
            </h2>
            <p className="font-headline font-medium text-xs text-on-surface-variant uppercase tracking-tighter">
              {title}
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
    </aside>
  )
}
