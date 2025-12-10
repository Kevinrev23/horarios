import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { SESSION_COOKIE } from "./lib/auth"

const encoder = new TextEncoder()
const decoder = new TextDecoder()

function base64UrlToUint8Array(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/")
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=")
  const binary = atob(padded)

  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i)
  }

  return bytes
}

async function createSignature(input: string) {
  const secret = process.env.AUTH_SECRET ?? "development-secret-key"
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    {
      name: "HMAC",
      hash: "SHA-256",
    },
    false,
    ["sign"],
  )

  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(input))
  return new Uint8Array(signature)
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array) {
  if (a.length !== b.length) return false

  let mismatch = 0
  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a[i] ^ b[i]
  }

  return mismatch === 0
}

async function verifySessionCookie(cookieValue?: string) {
  if (!cookieValue) return null

  const [encoded, signature] = cookieValue.split(".")
  if (!encoded || !signature) return null

  const [expectedSignature, provided] = await Promise.all([
    createSignature(encoded),
    Promise.resolve(base64UrlToUint8Array(signature)),
  ])

  if (!timingSafeEqual(expectedSignature, provided)) return null

  try {
    const payload = JSON.parse(decoder.decode(base64UrlToUint8Array(encoded)))

    if (payload.exp < Date.now()) return null

    return payload
  } catch (error) {
    console.error("Error reading session in middleware", error)
    return null
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith("/horarios")) {
    return NextResponse.next()
  }

  const sessionCookie = request.cookies.get(SESSION_COOKIE)?.value
  const session = await verifySessionCookie(sessionCookie)

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
