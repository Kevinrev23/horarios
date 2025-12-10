import { createHmac, timingSafeEqual } from "crypto"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { SESSION_COOKIE } from "./lib/auth"

function verifySessionCookie(cookieValue?: string) {
  if (!cookieValue) return null

  const [encoded, signature] = cookieValue.split(".")
  if (!encoded || !signature) return null

  const secret = process.env.AUTH_SECRET ?? "development-secret-key"
  const expectedSignature = createHmac("sha256", secret).update(encoded).digest()
  const provided = Buffer.from(signature, "base64url")

  if (expectedSignature.length !== provided.length) return null

  if (!timingSafeEqual(expectedSignature, provided)) return null

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString())

    if (payload.exp < Date.now()) return null

    return payload
  } catch (error) {
    console.error("Error reading session in middleware", error)
    return null
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith("/horarios")) {
    return NextResponse.next()
  }

  const sessionCookie = request.cookies.get(SESSION_COOKIE)?.value
  const session = verifySessionCookie(sessionCookie)

  if (!session) {
    const url = new URL("/", request.url)
    url.searchParams.set("error", "signin")
    url.searchParams.set("redirect", pathname)
    return NextResponse.redirect(url)
  }

  if (session.role !== "SUPERVISOR") {
    const url = new URL("/", request.url)
    url.searchParams.set("error", "unauthorized")
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/horarios/:path*"],
}
