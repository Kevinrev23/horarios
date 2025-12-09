"use client"

import * as React from "react"
import { v4 as uuidv4 } from "uuid"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

// Si no quieres instalar uuid, puedes reemplazar uuidv4() por Date.now().toString()

type TipoIncidencia = "ausencia" | "eps" | "llegada-tarde" | "otro"

interface ReporteIncidencia {
  id: string
  cajero: string
  fecha: string // yyyy-mm-dd del input
  tipo: TipoIncidencia
  detalle: string
  creadoPor: string
  creadoEn: string // ISO
}

const INCIDENTE_LABEL: Record<TipoIncidencia, string> = {
  ausencia: "Ausencia completa",
  eps: "Salida a EPS / enfermo",
  "llegada-tarde": "Llegada tarde",
  otro: "Otro",
}

function formatearFecha(fechaISO: string) {
  const d = new Date(fechaISO)
  return d.toLocaleString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatearSoloFecha(fecha: string) {
  // fecha viene como "yyyy-mm-dd" del input
  const d = new Date(fecha + "T00:00:00")
  return d.toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export function ReporteIncidencias() {
  const [tipo, setTipo] = React.useState<TipoIncidencia | "">("")
  const [cajero, setCajero] = React.useState("")
  const [fecha, setFecha] = React.useState("")
  const [detalle, setDetalle] = React.useState("")
  const [creadoPor, setCreadoPor] = React.useState("Supervisor turno")

  const [reportes, setReportes] = React.useState<ReporteIncidencia[]>([
    {
      id: "1",
      cajero: "Caja 03 - Ana López",
      fecha: "2025-11-17",
      tipo: "eps",
      detalle:
        "La colaboradora reporta malestar fuerte de garganta y fiebre. Se autoriza salida a EPS a las 10:30 am.",
      creadoPor: "Supervisor: Kevin",
      creadoEn: new Date("2025-11-17T10:45:00").toISOString(),
    },
    {
      id: "2",
      cajero: "Caja 07 - Juan Pérez",
      fecha: "2025-11-16",
      tipo: "ausencia",
      detalle:
        "Ausencia completa del turno de la mañana. No presentó excusa previa. Se solicita soporte para legalizar la novedad.",
      creadoPor: "Supervisor: Laura",
      creadoEn: new Date("2025-11-16T08:15:00").toISOString(),
    },
    {
      id: "3",
      cajero: "Caja 02 - María Gómez",
      fecha: "2025-11-15",
      tipo: "llegada-tarde",
      detalle:
        "Llegada 25 minutos tarde por congestión en transporte público. Se registra el caso como primera vez en el mes.",
      creadoPor: "Supervisor: Andrés",
      creadoEn: new Date("2025-11-15T07:35:00").toISOString(),
    },
  ])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!tipo || !cajero.trim() || !fecha || !detalle.trim()) {
      // Aquí podrías usar un toast de shadcn si ya lo tienes
      alert("Por favor completa todos los campos.")
      return
    }

    const nuevo: ReporteIncidencia = {
      id: uuidv4(),
      cajero: cajero.trim(),
      fecha,
      tipo,
      detalle: detalle.trim(),
      creadoPor: creadoPor.trim() || "Supervisor turno",
      creadoEn: new Date().toISOString(),
    }

    // Lo agregamos al inicio para que se vea primero el más reciente
    setReportes((prev) => [nuevo, ...prev])

    // Limpiamos formulario
    setTipo("")
    setCajero("")
    setFecha("")
    setDetalle("")
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Formulario de creación */}
      <Card>
        <CardHeader>
          <CardTitle>Reporte de incidencias de cajeros</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="cajero">Cajero / Caja</Label>
                <Input
                  id="cajero"
                  placeholder="Ej: Caja 05 - Pedro Rodríguez"
                  value={cajero}
                  onChange={(e) => setCajero(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fecha">Fecha del incidente</Label>
                <Input
                  id="fecha"
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Tipo de incidencia</Label>
                <Select value={tipo} onValueChange={(value: TipoIncidencia) => setTipo(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ausencia">Ausencia completa</SelectItem>
                    <SelectItem value="eps">Salida a EPS / enfermo</SelectItem>
                    <SelectItem value="llegada-tarde">Llegada tarde</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="creadoPor">Registrado por</Label>
                <Input
                  id="creadoPor"
                  placeholder="Ej: Supervisor: Kevin"
                  value={creadoPor}
                  onChange={(e) => setCreadoPor(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="detalle">Detalle de la incidencia</Label>
              <Textarea
                id="detalle"
                placeholder="Ej: Se retira del turno por malestar y se dirige a la EPS..."
                value={detalle}
                onChange={(e) => setDetalle(e.target.value)}
                rows={4}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit">Crear reporte</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Lista de reportes */}
      <Card>
        <CardHeader>
          <CardTitle>Incidencias registradas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {reportes.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aún no hay incidencias registradas.
            </p>
          ) : (
            <div className="space-y-3">
              {reportes.map((reporte) => (
                <div
                  key={reporte.id}
                  className="rounded-lg border p-3 md:p-4 flex flex-col gap-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{reporte.cajero}</span>
                      <span className="text-xs text-muted-foreground">
                        Incidencia del {formatearSoloFecha(reporte.fecha)}
                      </span>
                    </div>
                    <Badge>
                      {INCIDENTE_LABEL[reporte.tipo]}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {reporte.detalle}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                    <span>{reporte.creadoPor}</span>
                    <span>Registrado: {formatearFecha(reporte.creadoEn)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
