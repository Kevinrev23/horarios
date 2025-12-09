import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Card 1: Incidencias del día */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Incidencias de hoy</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            12
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp className="mr-1" />
              +3 vs ayer
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Ausencias, retrasos y salidas <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Revisa el módulo de incidencias para tomar acciones.
          </div>
        </CardFooter>
      </Card>

      {/* Card 2: Permisos pendientes */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Permisos pendientes</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            5
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp className="mr-1" />
              2 nuevos
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Aprobación requerida por supervisión
          </div>
          <div className="text-muted-foreground">
            Ingresa a la bandeja de permisos para aprobar o rechazar.
          </div>
        </CardFooter>
      </Card>

      {/* Card 3: Horas sin cubrir */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Horas sin cubrir (semana)</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            6
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingDown className="mr-1" />
              -4 vs semana pasada
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Mejora en la cobertura de turnos
            <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Ajusta los horarios para eliminar huecos en las franjas críticas.
          </div>
        </CardFooter>
      </Card>

      {/* Card 4: Cumplimiento de horarios */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Cumplimiento de horarios</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            94%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp className="mr-1" />
              +2% esta semana
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Buen nivel de asistencia <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Mantén el seguimiento diario para sostener el cumplimiento.
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
