import "server-only"

import { getServiceClient } from "@/lib/supabase"

type AuthUser = {
  id: string
  email?: string
  user_metadata?: Record<string, unknown>
}

export async function getAuthProfile(userId: string) {
  const admin = getServiceClient()
  const { data } = await admin
    .from("profiles")
    .select("id, name, role, avatar")
    .eq("id", userId)
    .maybeSingle()

  return data
}

export async function ensureAuthProfile(user: AuthUser) {
  const admin = getServiceClient()
  const { data: existingProfile } = await admin
    .from("profiles")
    .select("id, name, role, avatar")
    .eq("id", user.id)
    .maybeSingle()

  if (existingProfile) {
    if (existingProfile.role === "patient") {
      await admin.from("patients").upsert({ id: user.id })
    }
    return existingProfile
  }

  const metadata = user.user_metadata ?? {}
  const name =
    (typeof metadata.full_name === "string" && metadata.full_name) ||
    (typeof metadata.name === "string" && metadata.name) ||
    user.email?.split("@")[0] ||
    "Usuario"

  const { data: createdProfile } = await admin
    .from("profiles")
    .insert({ id: user.id, name, role: "patient" })
    .select("id, name, role, avatar")
    .single()

  if (createdProfile) {
    await admin.from("patients").upsert({ id: user.id })
    return createdProfile
  }

  // A database trigger may have created the row concurrently. Re-read it
  // before reporting that the OAuth user has no profile.
  const { data: profileAfterRetry } = await admin
    .from("profiles")
    .select("id, name, role, avatar")
    .eq("id", user.id)
    .maybeSingle()

  if (profileAfterRetry?.role === "patient") {
    await admin.from("patients").upsert({ id: user.id })
  }

  return profileAfterRetry
}
