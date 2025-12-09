"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

type Employee = {
  id: string
  name: string
}

const employees: Employee[] = [
  { id: "1", name: "Martín Duran" },
  { id: "2", name: "Carlos Velez" },
  { id: "3", name: "Nathalia Zapata" },
  { id: "4", name: "Steven Jobs" },
  { id: "5", name: "Laura Gómez" },
  { id: "6", name: "Andrés Pérez" },
  { id: "7", name: "María Torres" },
  { id: "8", name: "Sofía Herrera" },
]

// 06:00 a 23:00 en bloques de 1 hora
const START_MINUTES = 6 * 60 // 06:00
const END_MINUTES = 23 * 60  // 23:00
const SLOT_MINUTES = 60

type TimeSlot = {
  index: number
  label: string
  minutes: number
}

function buildTimeSlots(): TimeSlot[] {
  const slots: TimeSlot[] = []
  let i = 0
  for (let m = START_MINUTES; m < END_MINUTES; m += SLOT_MINUTES) {
    const h = Math.floor(m / 60)
    const min = m % 60
    const label = `${h.toString().padStart(2, "0")}:${min
      .toString()
      .padStart(2, "0")}`
    slots.push({ index: i, label, minutes: m })
    i++
  }
  return slots
}

const timeSlots = buildTimeSlots()

// añadimos licencia y servicio al cliente
type EmployeeDayMode =
  | "none"
  | "shift"
  | "rest"
  | "vacation"
  | "license"
  | "service"

type EmployeeDayState = {
  mode: EmployeeDayMode
  startIndex?: number
  endIndex?: number // exclusivo
  box?: number
}

type DayGrid = Record<string, EmployeeDayState>
type ScheduleState = Record<string, DayGrid>

function getDateKey(date: Date) {
  return date.toISOString().slice(0, 10)
}

function buildEmptyDayGrid(): DayGrid {
  const grid: DayGrid = {}
  for (const emp of employees) {
    grid[emp.id] = { mode: "none" }
  }
  return grid
}

function getCoverageClasses(assigned: number, required: number | undefined) {
  if (!required || required <= 0) {
    return "bg-muted text-muted-foreground"
  }
  if (assigned >= required) {
    return "bg-emerald-500 text-emerald-50"
  }
  const ratio = assigned / required
  if (ratio >= 0.5) {
    return "bg-amber-400 text-amber-950"
  }
  return "bg-red-500 text-red-50"
}

// para ordenar: descanso / vacaciones / licencia al final
function getOffWeight(mode: EmployeeDayMode) {
  if (mode === "rest" || mode === "vacation" || mode === "license") {
    return 1
  }
  return 0
}

export default function DailySchedulePage() {
  const [currentDate, setCurrentDate] = useState(() => new Date())
  const [schedule, setSchedule] = useState<ScheduleState>({})

  // cajeros requeridos por hora
  const [requiredBySlot, setRequiredBySlot] = useState<number[]>(() =>
    new Array(timeSlots.length).fill(3)
  )

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(
    null
  )

  const [formMode, setFormMode] = useState<EmployeeDayMode>("shift")
  const [formStart, setFormStart] = useState<string | undefined>(
    timeSlots[0]?.label
  )
  const [formEnd, setFormEnd] = useState<string | undefined>(
    timeSlots[timeSlots.length - 1]?.label
  )
  const [formBox, setFormBox] = useState<string>("1")

  const dateKey = getDateKey(currentDate)
  const dayGrid: DayGrid = schedule[dateKey] ?? buildEmptyDayGrid()

  // asignados por hora (solo cuenta TURNOS de caja)
  const assignedCounts = timeSlots.map((slot, idx) => {
    let count = 0
    for (const emp of employees) {
      const st = dayGrid[emp.id]
      if (
        st?.mode === "shift" &&
        st.startIndex != null &&
        st.endIndex != null &&
        idx >= st.startIndex &&
        idx < st.endIndex
      ) {
        count++
      }
    }
    return count
  })

  // empleados ordenados: los de descanso/vacaciones/licencia al final SOLO ese día
  const sortedEmployees = [...employees].sort((a, b) => {
    const amode = dayGrid[a.id]?.mode ?? "none"
    const bmode = dayGrid[b.id]?.mode ?? "none"
    const wa = getOffWeight(amode)
    const wb = getOffWeight(bmode)
    return wa - wb
  })

  const goToPrevDay = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev)
      d.setDate(d.getDate() - 1)
      return d
    })
  }

  const goToNextDay = () => {
    setCurrentDate((prev) => {
      const d = new Date(prev)
      d.setDate(d.getDate() + 1)
      return d
    })
  }

  const openModalForEmployee = (employeeId: string) => {
    setSelectedEmployeeId(employeeId)
    const dayState = dayGrid[employeeId] ?? { mode: "none" }

    if (dayState.mode === "shift") {
      const startLabel = timeSlots[dayState.startIndex ?? 0]?.label
      const endLabel =
        timeSlots[
          dayState.endIndex ? dayState.endIndex - 1 : timeSlots.length - 1
        ]?.label

      setFormMode("shift")
      setFormStart(startLabel)
      setFormEnd(endLabel)
      setFormBox((dayState.box ?? 1).toString())
    } else {
      // para descanso, vacaciones, licencia, servicio
      setFormMode(dayState.mode === "none" ? "shift" : dayState.mode)
      setFormStart(timeSlots[0]?.label)
      setFormEnd(timeSlots[timeSlots.length - 1]?.label)
      setFormBox("1")
    }

    setIsDialogOpen(true)
  }

  const handleSave = () => {
    if (!selectedEmployeeId) return

    let newState: EmployeeDayState

    if (formMode === "shift") {
      if (!formStart || !formEnd) return
      const startIndex = timeSlots.findIndex((s) => s.label === formStart)
      const endIndex = timeSlots.findIndex((s) => s.label === formEnd)

      if (startIndex === -1 || endIndex === -1) return
      if (endIndex < startIndex) return

      newState = {
        mode: "shift",
        startIndex,
        endIndex: endIndex + 1,
        box: Number(formBox) || 1,
      }
    } else if (
      formMode === "rest" ||
      formMode === "vacation" ||
      formMode === "license" ||
      formMode === "service"
    ) {
      newState = { mode: formMode }
    } else {
      newState = { mode: "none" }
    }

    setSchedule((prev) => {
      const copy = { ...prev }
      const currentDay = copy[dateKey] ?? buildEmptyDayGrid()
      copy[dateKey] = {
        ...currentDay,
        [selectedEmployeeId]: newState,
      }
      return copy
    })

    setIsDialogOpen(false)
  }

  const handleCycleRequired = (slotIndex: number) => {
    setRequiredBySlot((prev) => {
      const copy = [...prev]
      const current = copy[slotIndex] ?? 0
      const next = (current + 1) % 6 // 0..5
      copy[slotIndex] = next
      return copy
    })
  }

  const formattedDate = currentDate.toLocaleDateString("es-CO", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  const getShiftLabel = (state: EmployeeDayState) => {
    if (state.mode === "shift" && state.startIndex != null && state.endIndex != null) {
      const startLabel = timeSlots[state.startIndex]?.label
      const endLabel = timeSlots[state.endIndex - 1]?.label
      return `${startLabel} - ${endLabel}`
    }
    if (state.mode === "rest") return "Descanso"
    if (state.mode === "vacation") return "Vacaciones"
    if (state.mode === "license") return "Licencia"
    if (state.mode === "service") return "Servicio al cliente"
    return ""
  }

  const getModeLabel = (state: EmployeeDayState): string => {
    if (state.mode === "shift") {
      const box = state.box ?? 1
      return `Turno · Caja ${box}`
    }
    if (state.mode === "rest") return "Descanso"
    if (state.mode === "vacation") return "Vacaciones"
    if (state.mode === "license") return "Licencia"
    if (state.mode === "service") return "Servicio al cliente"
    return "Sin asignar"
  }

  const getSpecialDayDescription = () => {
    if (formMode === "rest")
      return "Este cajero estará en descanso todo el día y no contará como cajero en caja."
    if (formMode === "vacation")
      return "Este cajero estará en vacaciones todo el día y no contará como cajero en caja."
    if (formMode === "license")
      return "Este cajero estará en licencia todo el día y no contará como cajero en caja."
    if (formMode === "service")
      return "Este cajero estará asignado a servicio al cliente todo el día (no caja)."
    return ""
  }

    const selectedEmployee = selectedEmployeeId
    ? employees.find((e) => e.id === selectedEmployeeId)
    : null
  return (
    <>
      <Card className="w-full overflow-hidden">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Horarios diarios</CardTitle>
            <p className="text-sm text-muted-foreground">
              {formattedDate} ({dateKey})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={goToPrevDay}>
              Día anterior
            </Button>
            <Button variant="outline" onClick={goToNextDay}>
              Día siguiente
            </Button>
          </div>
        </CardHeader>

        <CardContent className="overflow-auto">
          <Table className="min-w-max border">
            <TableHeader>
              <TableRow>
                <TableHead className="sticky left-0 z-10 bg-background min-w-[180px] border-r">
                  Empleado
                </TableHead>
                <TableHead className="p-0">
                  <div
                    className="grid border-l"
                    style={{
                      gridTemplateColumns: `repeat(${timeSlots.length}, minmax(60px, 1fr))`,
                    }}
                  >
                    {timeSlots.map((slot, idx) => {
                      const assigned = assignedCounts[idx]
                      const required = requiredBySlot[idx]
                      const coverageClasses = getCoverageClasses(
                        assigned,
                        required
                      )

                      return (
                        <div
                          key={slot.index}
                          className="border-r text-xs px-2 py-1 whitespace-nowrap text-center flex flex-col gap-0.5 items-center"
                        >
                          <span className="font-normal">{slot.label}</span>
                          <button
                            type="button"
                            title="Click para cambiar cajeros requeridos"
                            onClick={() => handleCycleRequired(idx)}
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${coverageClasses}`}
                          >
                            {assigned}/{required ?? 0}
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {sortedEmployees.map((emp) => {
                const state = dayGrid[emp.id] ?? { mode: "none" }
                const barText = getShiftLabel(state)

                // Barra superpuesta
                let hasBar = state.mode !== "none"
                let startIndex = 0
                let endIndex = timeSlots.length

                if (
                  state.mode === "shift" &&
                  state.startIndex != null &&
                  state.endIndex != null
                ) {
                  startIndex = state.startIndex
                  endIndex = state.endIndex
                } else if (
                  state.mode === "rest" ||
                  state.mode === "vacation" ||
                  state.mode === "license" ||
                  state.mode === "service"
                ) {
                  startIndex = 0
                  endIndex = timeSlots.length
                } else {
                  hasBar = false
                }

                const totalSlots = timeSlots.length
                const leftPercent = (startIndex / totalSlots) * 100
                const widthPercent =
                  ((endIndex - startIndex) / totalSlots) * 100

                // color de la barra superpuesta según modo
                let barBg = "bg-primary/60 text-primary-foreground"
                if (
                  state.mode === "rest" ||
                  state.mode === "vacation" ||
                  state.mode === "license"
                ) {
                  barBg = "bg-muted-foreground/30 text-muted-foreground"
                } else if (state.mode === "service") {
                  barBg = "bg-emerald-500/30 text-emerald-900"
                }

                return (
                  <TableRow
                    key={emp.id}
                    className="cursor-pointer hover:bg-muted/60"
                    onClick={() => openModalForEmployee(emp.id)}
                  >
                    <TableCell className="sticky left-0 z-10 bg-background font-medium border-r">
                      <div className="flex flex-col">
                        <span>{emp.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {getModeLabel(state)}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="p-0">
                      <div
                        className="relative grid"
                        style={{
                          gridTemplateColumns: `repeat(${timeSlots.length}, minmax(60px, 1fr))`,
                        }}
                      >
                        {timeSlots.map((slot) => {
                          let isActive = false
                          let isOff = false
                          let isService = false

                          if (
                            state.mode === "shift" &&
                            state.startIndex != null &&
                            state.endIndex != null
                          ) {
                            if (
                              slot.index >= state.startIndex &&
                              slot.index < state.endIndex
                            ) {
                              isActive = true
                            }
                          } else if (
                            state.mode === "rest" ||
                            state.mode === "vacation" ||
                            state.mode === "license"
                          ) {
                            isOff = true
                          } else if (state.mode === "service") {
                            isService = true
                          }

                          let bgClasses = "h-10 border-r border-t text-xs"

                          if (isActive) {
                            bgClasses += " bg-primary/80"
                          } else if (isOff) {
                            bgClasses += " bg-muted"
                          } else if (isService) {
                            bgClasses += " bg-emerald-500/20"
                          } else {
                            bgClasses += " bg-background"
                          }

                          return <div key={slot.index} className={bgClasses} />
                        })}

                        {hasBar && barText && (
                          <div
                            className="pointer-events-none absolute inset-y-0 flex items-center"
                            style={{
                              left: `${leftPercent}%`,
                              width: `${widthPercent}%`,
                            }}
                          >
                            <div
                              className={`w-full text-center text-[11px] font-medium rounded-sm py-0.5 ${barBg}`}
                            >
                              {barText}
                            </div>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal turno / descanso / vacaciones / licencia / servicio */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Configurar horario del cajero
             {selectedEmployee && (
              <p className="text-md text-muted-foreground py-2">
                {selectedEmployee.name}
              </p>
            )}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Tipo de día</Label>
              <Select
                value={formMode}
                onValueChange={(val) => setFormMode(val as EmployeeDayMode)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shift">Turno</SelectItem>
                  <SelectItem value="rest">Descanso</SelectItem>
                  <SelectItem value="vacation">Vacaciones</SelectItem>
                  <SelectItem value="license">Licencia</SelectItem>
                  <SelectItem value="service">Servicio al cliente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formMode === "shift" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Desde</Label>
                    <Select
                      value={formStart}
                      onValueChange={(val) => setFormStart(val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Hora inicio" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((slot) => (
                          <SelectItem key={slot.index} value={slot.label}>
                            {slot.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Hasta</Label>
                    <Select
                      value={formEnd}
                      onValueChange={(val) => setFormEnd(val)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Hora fin" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((slot) => (
                          <SelectItem key={slot.index} value={slot.label}>
                            {slot.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Caja</Label>
                  <Select
                    value={formBox}
                    onValueChange={(val) => setFormBox(val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Caja" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 20 }).map((_, i) => (
                        <SelectItem key={i} value={(i + 1).toString()}>
                          Caja {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {formMode !== "shift" && formMode !== "none" && (
              <p className="text-sm text-muted-foreground">
                {getSpecialDayDescription()}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
