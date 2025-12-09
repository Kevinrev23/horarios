"use client"

import { useState } from "react"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Check, X } from "lucide-react"

type PermissionStatus = "pending" | "approved" | "rejected"

export interface PermissionRequest {
  id: string
  cashierName: string      // Nombre del cajero
  cashierCode?: string     // Código interno (opcional)
  type: string             // Tipo de permiso (Vacaciones, Licencia, etc.)
  startDate: string        // "2025-11-24"
  endDate: string
  reason: string
  createdAt: string        // Fecha de solicitud
  status: PermissionStatus
}

interface PermissionsInboxProps {
  initialRequests?: PermissionRequest[]   // AHORA ES OPCIONAL
  onDecision?: (id: string, status: PermissionStatus) => void
}

const statusLabels: Record<PermissionStatus, string> = {
  pending: "Pendiente",
  approved: "Aprobado",
  rejected: "Rechazado",
}

const statusBadgeVariant: Record<PermissionStatus, "outline" | "default" | "destructive"> = {
  pending: "outline",
  approved: "default",
  rejected: "destructive",
}

// Util para formatear fecha
function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  if (Number.isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export function PermissionsInbox({
  initialRequests = [],   // VALOR POR DEFECTO ARRAY VACÍO
  onDecision,
}: PermissionsInboxProps) {
  // Nos aseguramos que el estado SIEMPRE sea un array
  const [requests, setRequests] = useState<PermissionRequest[]>(() => initialRequests)

  const [filter, setFilter] = useState<"all" | PermissionStatus>("all")

  function handleDecision(id: string, status: PermissionStatus) {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === id ? { ...req, status } : req
      )
    )

    if (onDecision) {
      onDecision(id, status)
    }
  }

  const filteredRequests =
    filter === "all"
      ? requests
      : requests.filter((r) => r.status === filter)

  const totalPending = requests.filter((r) => r.status === "pending").length
  const totalApproved = requests.filter((r) => r.status === "approved").length
  const totalRejected = requests.filter((r) => r.status === "rejected").length

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 gap-4">
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          <CardTitle className="text-lg">
            Bandeja de permisos de cajeros
          </CardTitle>
        </div>
        <div className="flex flex-col items-end">
          <Label className="text-xs text-muted-foreground">
            Permisos pendientes
          </Label>
          <span className="text-sm font-semibold">{totalPending}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Filtros */}
        <Tabs
          value={filter}
          onValueChange={(val) => setFilter(val as any)}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="pending">
              Pendientes ({totalPending})
            </TabsTrigger>
            <TabsTrigger value="approved">
              Aprobados ({totalApproved})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rechazados ({totalRejected})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <ScrollArea className="h-[360px] rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cajero</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Rango de fechas</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-sm text-muted-foreground py-8"
                  >
                    No hay solicitudes en esta vista.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRequests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="space-y-0.5">
                      <div className="font-medium">{req.cashierName}</div>
                      {req.cashierCode && (
                        <div className="text-xs text-muted-foreground">
                          Código: {req.cashierCode}
                        </div>
                      )}
                      <div className="text-[11px] text-muted-foreground">
                        Solicitado: {formatDate(req.createdAt)}
                      </div>
                    </TableCell>

                    <TableCell>
                      <span className="text-sm">{req.type}</span>
                    </TableCell>

                    <TableCell className="text-sm">
                      {formatDate(req.startDate)} — {formatDate(req.endDate)}
                    </TableCell>

                    <TableCell className="max-w-xs text-sm">
                      <span className="line-clamp-2">{req.reason}</span>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={statusBadgeVariant[req.status]}
                        className="text-xs"
                      >
                        {statusLabels[req.status]}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={req.status !== "pending"}
                          onClick={() => handleDecision(req.id, "approved")}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Aprobar
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={req.status !== "pending"}
                          onClick={() => handleDecision(req.id, "rejected")}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Rechazar
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
