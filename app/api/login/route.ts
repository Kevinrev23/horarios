import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { createSessionCookie } from "@/lib/auth"

export async function POST(request: Request) {
  const { username, password } = await request.json()

  if (!username || !password) {
    return NextResponse.json(
      { error: "Usuario y contraseña son obligatorios" },
      { status: 400 }
    )
  }

  const user = await prisma.user.findUnique({
    where: { username },
  })

  if (!user) {
    return NextResponse.json(
      { error: "Credenciales incorrectas" },
      { status: 401 }
    )
  }

  const isPasswordValid =
    (user.passwordHash?.startsWith("$2") &&
      (await bcrypt.compare(password, user.passwordHash))) ||
    user.passwordHash === password

  if (!isPasswordValid) {
    return NextResponse.json(
      { error: "Credenciales incorrectas" },
      { status: 401 }
    )
  }

  const sessionCookie = createSessionCookie({
    userId: user.id,
    role: user.role,
    name: user.name,
    branchId: user.branchId,
  })

  const response = NextResponse.json({ message: "Autenticación exitosa" })
  response.cookies.set(sessionCookie)

  return response
}
