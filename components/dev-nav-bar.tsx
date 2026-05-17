"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const routes = [
  { href: "/", label: "Landing" },
  { href: "/login", label: "Login" },
  { href: "/signup", label: "Signup" },
  { href: "/verify", label: "Verify" },
  { href: "/patient", label: "Patient" },
  { href: "/patient/new", label: "New Patient" },
  { href: "/patient/consultations/c1", label: "Patient Consult" },
  { href: "/patient/tokens", label: "Patient Tokens" },
  { href: "/doctor", label: "Doctor" },
  { href: "/doctor/consultations/c1", label: "Doctor Consult" },
  { href: "/admin", label: "Admin" },
  { href: "/admin/doctor-approvals", label: "Approvals" },
]

export function DevNavBar() {
  const [visible, setVisible] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <button
        onClick={() => setVisible((v) => !v)}
        className="fixed top-[72px] right-4 z-50 px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-yellow-300 bg-gray-900/80 backdrop-blur rounded-full border border-yellow-500/30 hover:bg-gray-800 hover:border-yellow-400/50 transition-all"
      >
        {visible ? "✕" : "Debug"}
      </button>

      {visible && (
        <nav className="fixed top-[72px] left-0 right-0 z-40 overflow-x-auto bg-gray-900/90 backdrop-blur-md border-b border-white/5 shadow-xl">
          <div className="flex items-center gap-1.5 px-3 py-2.5 min-w-max">
            {routes.map((route) => {
              const isActive = pathname === route.href
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  onClick={() => setVisible(false)}
                  className={`shrink-0 px-3 py-1.5 text-xs font-medium rounded-full transition-all ${
                    isActive
                      ? "bg-yellow-400/20 text-yellow-300 border border-yellow-400/30"
                      : "text-gray-300 hover:text-white hover:bg-white/10 border border-transparent"
                  }`}
                >
                  {route.label}
                </Link>
              )
            })}
          </div>
        </nav>
      )}
    </>
  )
}
