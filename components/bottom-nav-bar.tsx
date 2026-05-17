"use client"

import Link from "next/link"

interface NavItem {
  label: string
  icon: string
  href: string
  active?: boolean
}

interface BottomNavBarProps {
  items: NavItem[]
}

export function BottomNavBar({ items }: BottomNavBarProps) {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-8 pt-3 bg-white/85 backdrop-blur-2xl rounded-t-[2.5rem] shadow-[0_-12px_48px_rgba(0,0,0,0.06)]">
      {items.map((item) => (
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
  )
}
