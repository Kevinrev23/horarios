import { NextResponse } from "next/server"
import { clearSessionCookie } from "@/lib/auth"

export async function POST() {
  const response = NextResponse.json({ message: "Sesión cerrada" })
  response.cookies.set(clearSessionCookie())
  return response
}
