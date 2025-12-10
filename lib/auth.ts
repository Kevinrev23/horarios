import { createHmac, timingSafeEqual } from "crypto"
import { cookies } from "next/headers"

export type SessionPayload = {
  userId: number
  role: "ADMIN" | "SUPERVISOR"
  name: string
  branchId: number
  exp: number
}

const SESSION_COOKIE = "horarios_session"
const SESSION_DURATION_MS = 1000 * 60 * 60 * 8 // 8 horas

function getSecret() {
  const secret = process.env.AUTH_SECRET

  if (!secret) {
    console.warn("AUTH_SECRET no está definido, usando valor de desarrollo.")
  }

  return secret ?? "development-secret-key"
}

function signPayload(payload: SessionPayload) {
  const base = Buffer.from(JSON.stringify(payload)).toString("base64url")
  const signature = createHmac("sha256", getSecret())
    .update(base)
    .digest("base64url")

  return `${base}.${signature}`
}

function parsePayload(token: string): SessionPayload | null {
  const [encoded, signature] = token.split(".")

  if (!encoded || !signature) return null

  const expectedSignature = createHmac("sha256", getSecret())
    .update(encoded)
    .digest()

  const provided = Buffer.from(signature, "base64url")

  if (
    expectedSignature.length !== provided.length ||
    !timingSafeEqual(expectedSignature, provided)
  ) {
    return null
  }

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString())

    if (payload.exp < Date.now()) return null

    return payload
  } catch (error) {
    console.error("Error al leer el token de sesión", error)
    return null
  }
}

export function createSessionCookie({
  userId,
  role,
  name,
  branchId,
}: Omit<SessionPayload, "exp">) {
  const payload: SessionPayload = {
    userId,
    role,
    name,
    branchId,
    exp: Date.now() + SESSION_DURATION_MS,
  }

  return {
    name: SESSION_COOKIE,
    value: signPayload(payload),
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DURATION_MS / 1000,
  }
}

export function getSession() {
  const token = cookies().get(SESSION_COOKIE)?.value

  if (!token) return null

  return parsePayload(token)
}

export function clearSessionCookie() {
  return {
    name: SESSION_COOKIE,
    value: "",
    expires: new Date(0),
    path: "/",
  }
}

export { SESSION_COOKIE }
