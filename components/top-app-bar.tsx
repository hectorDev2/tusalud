"use client"

import Link from "next/link"

interface TopAppBarProps {
  showProfile?: boolean
  profileSrc?: string
  profileAlt?: string
  role?: "patient" | "doctor" | "admin" | "public"
}

const roleLinks: Record<string, { href: string; label: string }[]> = {
  patient: [
    { href: "/patient", label: "Home" },
    { href: "/patient/tokens", label: "Tokens" },
    { href: "/patient", label: "Consults" },
  ],
  doctor: [
    { href: "/doctor", label: "Dashboard" },
    { href: "/doctor", label: "Consults" },
  ],
  admin: [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/doctor-approvals", label: "Approvals" },
  ],
  public: [],
}

export function TopAppBar({
  showProfile,
  profileSrc,
  role = "public",
}: TopAppBarProps) {
  return (
    <header className="flex justify-between items-center px-6 py-4 w-full fixed top-0 z-50 bg-[#f7f9fb]/85 backdrop-blur-xl">
      <Link href="/" className="flex items-center gap-3">
        <span className="material-symbols-outlined text-primary">
          medical_services
        </span>
        <span className="text-xl font-bold text-primary font-headline tracking-tight">
          Sanctuary Health
        </span>
      </Link>
      <div className="flex items-center gap-4">
        {role !== "public" && (
          <nav className="hidden md:flex gap-4 mr-4">
            {roleLinks[role].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
        {role === "public" && (
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="primary-gradient text-on-primary px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-primary/10 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm"
            >
              Join for Free
            </Link>
          </div>
        )}
        {showProfile && (
          <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-high shadow-sm flex items-center justify-center">
            {profileSrc ? (
              <img
                src={profileSrc}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="material-symbols-outlined text-on-surface-variant">
                person
              </span>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
