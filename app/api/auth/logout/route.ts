import { NextResponse } from "next/server"
import { ok } from "@/lib/api-types"

export async function POST() {
  const res = NextResponse.json(ok({ message: "Sesión cerrada" }))
  res.cookies.set("session", "", { httpOnly: false, path: "/", maxAge: 0 })
  return res
}
