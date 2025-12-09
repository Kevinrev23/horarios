// app/horarios/report/page.tsx

import { PermissionsInbox, type PermissionRequest } from "@/components/permissionInbox"




const mockRequests: PermissionRequest[] = [
  {
    id: "1",
    cashierName: "Juan Pérez",
    cashierCode: "C001",
    type: "Vacaciones",
    startDate: "2025-11-24",
    endDate: "2025-11-30",
    reason: "Vacaciones programadas.",
    createdAt: "2025-11-10",
    status: "pending",
  },
]

export default function ReportPage() {
  return (
    <div className="max-w-6xl mx-auto p-4">
      <PermissionsInbox initialRequests={mockRequests} />
    </div>
  )
}