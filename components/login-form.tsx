"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectPath = searchParams.get("redirect") ?? "/horarios/dashboard"
  const urlError = searchParams.get("error")

  const [error, setError] = useState<string | null>(() => {
    if (urlError === "unauthorized") {
      return "Tu usuario no tiene permisos de supervisor."
    }

    if (urlError === "signin") {
      return "Inicia sesión para continuar."
    }

    return null
  })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const username = String(formData.get("username") ?? "").trim()
    const password = String(formData.get("password") ?? "")

    if (!username || !password) {
      setError("Completa usuario y contraseña para continuar.")
      setLoading(false)
      return
    }

    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })

    if (response.ok) {
      router.push(redirectPath)
      router.refresh()
      return
    }

    const data = await response.json().catch(() => null)
    setError(data?.error ?? "No se pudo iniciar sesión.")
    setLoading(false)
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">MercaHorarios</h1>
                <p className="text-muted-foreground text-balance">
                  Ingresa a tu cuenta para continuar
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="username">Usuario</FieldLabel>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="super_plaza"
                  required
                  autoComplete="username"
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Olvidaste tu contraseña?
                  </a>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </Field>
              {error ? (
                <FieldDescription className="text-destructive" role="alert">
                  {error}
                </FieldDescription>
              ) : null}
              <Field>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Ingresando..." : "Login"}
                </Button>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>

              <FieldDescription className="text-center">
                Don&apos;t have an account? <a href="#">Sign up</a>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="bg-muted relative hidden md:block">
            <Image
              src="/placeholder.svg"
              alt="Imagen decorativa"
              fill
              className="object-cover dark:brightness-[0.2] dark:grayscale"
              sizes="(min-width: 768px) 50vw, 100vw"
              priority
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
         Forma de gestionar tus horarios
      </FieldDescription>
    </div>
  )
}
