"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export const description = "Gráfico de incidencias (ausencias y permisos)"

const chartData = [
  { date: "2024-04-01", ausencias: 2, permisos: 1 },
  { date: "2024-04-02", ausencias: 1, permisos: 3 },
  { date: "2024-04-03", ausencias: 0, permisos: 2 },
  { date: "2024-04-04", ausencias: 3, permisos: 1 },
  { date: "2024-04-05", ausencias: 4, permisos: 2 },
  { date: "2024-04-06", ausencias: 1, permisos: 1 },
  { date: "2024-04-07", ausencias: 0, permisos: 2 },
  { date: "2024-04-08", ausencias: 1, permisos: 2 },
  { date: "2024-04-09", ausencias: 2, permisos: 3 },
  { date: "2024-04-10", ausencias: 0, permisos: 1 },
  { date: "2024-04-11", ausencias: 1, permisos: 2 },
  { date: "2024-04-12", ausencias: 2, permisos: 1 },
  { date: "2024-04-13", ausencias: 3, permisos: 2 },
  { date: "2024-04-14", ausencias: 1, permisos: 3 },
  { date: "2024-04-15", ausencias: 0, permisos: 1 },
  { date: "2024-04-16", ausencias: 2, permisos: 2 },
  { date: "2024-04-17", ausencias: 1, permisos: 1 },
  { date: "2024-04-18", ausencias: 3, permisos: 2 },
  { date: "2024-04-19", ausencias: 2, permisos: 3 },
  { date: "2024-04-20", ausencias: 4, permisos: 2 },
]

const chartConfig = {
  ausencias: {
    label: "Ausencias",
    color: "hsl(var(--chart-1))",
  },
  permisos: {
    label: "Permisos / EPS",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const ranges: Record<string, number> = {
    "90d": 90,
    "30d": 30,
    "7d": 7,
  }

  const filteredData = React.useMemo(() => {
    const limit = ranges[timeRange] ?? 90

    if (chartData.length <= limit) {
      return chartData
    }

    return chartData.slice(chartData.length - limit)
  }, [timeRange])

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Incidencias por día</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Ausencias y permisos en el rango seleccionado
          </span>
          <span className="@[540px]/card:hidden">
            Últimos 3 meses
          </span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={(value) => value && setTimeRange(value)}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">
              Últimos 3 meses
            </ToggleGroupItem>
            <ToggleGroupItem value="30d">
              Últimos 30 días
            </ToggleGroupItem>
            <ToggleGroupItem value="7d">
              Últimos 7 días
            </ToggleGroupItem>
          </ToggleGroup>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Selecciona un rango"
            >
              <SelectValue placeholder="Últimos 3 meses" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Últimos 3 meses
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Últimos 30 días
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Últimos 7 días
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              {/* MISMO TEMA PARA AUSENCIAS */}
              <linearGradient id="fillAusencias" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-ausencias)"
                  stopOpacity={0.9}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-ausencias)"
                  stopOpacity={0.1}
                />
              </linearGradient>

              {/* MISMO TEMA PARA PERMISOS */}
              <linearGradient id="fillPermisos" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-permisos)"
                  stopOpacity={0.9}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-permisos)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("es-ES", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("es-ES", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />

            <Area
              dataKey="permisos"
              type="natural"
              fill="url(#fillPermisos)"
              stroke="var(--color-permisos)"
              stackId="a"
            />

            <Area
              dataKey="ausencias"
              type="natural"
              fill="url(#fillAusencias)"
              stroke="var(--color-ausencias)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
