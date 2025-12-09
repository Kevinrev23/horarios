"use client"

import * as React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button" // 🔹 IMPORTANTE

/**
 * Helpers de fechas
 */

// Obtener el lunes de la semana de una fecha dada
function getMonday(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay() // 0 domingo, 1 lunes, ...
  const diff = (day + 6) % 7 // convierte lunes en 0, martes en 1, ..., domingo en 6
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - diff)
  return d
}

function addDays(date: Date, amount: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + amount)
  return d
}

// Ej: "24 de noviembre"
function formatShortEs(date: Date): string {
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
  })
}

// Ej: "lunes 24 de noviembre"
function formatLongEs(date: Date): string {
  return date.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  })
}

export type WeekRange = {
  id: string
  start: Date
  end: Date
  label: string
  description: string
}

function generateUpcomingWeeks(baseDate: Date, count = 4): WeekRange[] {
  const mondayThisWeek = getMonday(baseDate)

  const weeks: WeekRange[] = []

  for (let i = 0; i < count; i++) {
    const start = addDays(mondayThisWeek, i * 7)
    const end = addDays(start, 6)

    const label = `Del ${formatShortEs(start)} al ${formatShortEs(end)}`
    const description =
      i === 0
        ? `Semana actual (${label})`
        : `Semana ${i + 1} (${label})`

    weeks.push({
      id: start.toISOString().slice(0, 10), // YYYY-MM-DD del lunes
      start,
      end,
      label,
      description,
    })
  }

  return weeks
}

type WeeklyScheduleSelectorProps = {
  // 🔹 Callback opcional para "crear" la semana seleccionada
  onCreateWeek?: (week: WeekRange) => void
}

export function WeeklyScheduleSelector({
  onCreateWeek,
}: WeeklyScheduleSelectorProps) {
  const weeks = React.useMemo(
    () => generateUpcomingWeeks(new Date(), 4),
    []
  )

  const [selectedWeekId, setSelectedWeekId] = React.useState(
    weeks[0]?.id ?? ""
  )

  const selectedWeek =
    weeks.find((w) => w.id === selectedWeekId) ?? weeks[0]

  const handleCreateWeek = () => {
    if (!selectedWeek) return

    // Aquí llamas lo que necesites: crear registro, abrir modal, etc.
    if (onCreateWeek) {
      onCreateWeek(selectedWeek)
    } else {
      // Por ahora, solo para ver que funciona
      console.log("Semana creada para horarios:", selectedWeek)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Configuración de semana de horarios
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* SELECTOR DE SEMANA */}
        <div className="space-y-2">
          <Label htmlFor="week-select">
            Selecciona la semana para crear los horarios
          </Label>
          <Select
            value={selectedWeekId}
            onValueChange={(value) => setSelectedWeekId(value)}
          >
            <SelectTrigger id="week-select" className="w-full max-w-md">
              <SelectValue placeholder="Selecciona una semana" />
            </SelectTrigger>
            <SelectContent>
              {weeks.map((week, index) => (
                <SelectItem key={week.id} value={week.id}>
                  {index === 0 ? "Semana actual" : `Semana ${index + 1}`} –{" "}
                  {week.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* RESUMEN DE LA SEMANA SELECCIONADA */}
        {selectedWeek && (
          <div className="rounded-md border p-4 bg-muted/40">
            <p className="text-sm text-muted-foreground mb-1">
              Semana seleccionada:
            </p>
            <p className="font-medium">
              Se van a crear los horarios desde{" "}
              <span className="font-semibold">
                {formatLongEs(selectedWeek.start)}
              </span>{" "}
              hasta{" "}
              <span className="font-semibold">
                {formatLongEs(selectedWeek.end)}
              </span>
              .
            </p>
          </div>
        )}

        {/* 🔹 BOTÓN PARA CREAR LA SEMANA Y PASAR A USUARIOS */}
        <div className="pt-2">
          <Button
            className="w-full max-w-md"
            onClick={handleCreateWeek}
            disabled={!selectedWeek}
          >
            Crear semana 
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default WeeklyScheduleSelector
