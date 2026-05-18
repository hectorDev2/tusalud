export interface Session {
  userId: string
  role: "patient" | "doctor" | "admin"
  name: string
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null
  try {
    const raw = document.cookie
      .split("; ")
      .find((c) => c.startsWith("session="))
    if (!raw) return null
    const value = decodeURIComponent(raw.split("=")[1])
    return JSON.parse(value)
  } catch {
    return null
  }
}

export function clearSession() {
  document.cookie = "session=; path=/; max-age=0"
}

export function getRedirectPath(role: string): string {
  if (role === "doctor") return "/doctor"
  if (role === "admin") return "/admin"
  return "/patient"
}
