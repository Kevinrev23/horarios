import SelectCajas from "@/components/selectCajas"
import SelectHoras from "@/components/selectHoras"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"



const invoices = [
  {
    invoice: "Carlos ramirez",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "Daniela lopez",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "Diego martinez",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "Juan riascos",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "Laura gomez",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "Miguel torres",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "Sofia navarro",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
]

export default function Tablepage() {
  return (
  
<Card className="@container/card  mx-1">
    <CardHeader >
      <CardTitle className="text-lg font-semibold">Borrador de horarios - </CardTitle>
    </CardHeader>

    <CardContent >

    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow className="capitalize">
          <TableHead className="w-[120px]">Empleado</TableHead>
          <TableHead className="w-[120px]">domingo</TableHead>
          <TableHead className="w-[120px]">Lunes</TableHead>
          <TableHead className="w-[120px]">Martes</TableHead>
          <TableHead className="w-[120px]">miercoles</TableHead>
          <TableHead className="w-[120px]">jueves</TableHead>
          <TableHead className="w-[120px]">viernes</TableHead>
          <TableHead className="w-[120px]">sabado</TableHead>
          
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.invoice}>
            <TableCell className="font-medium capitalize">{invoice.invoice}</TableCell>
            <TableCell> <SelectHoras/><SelectCajas/></TableCell>
            <TableCell><SelectHoras/><SelectCajas/></TableCell>
            <TableCell className=""><SelectHoras/><SelectCajas/></TableCell>
            <TableCell><SelectHoras/><SelectCajas/></TableCell>
            <TableCell><SelectHoras/><SelectCajas/></TableCell>
            <TableCell><SelectHoras/><SelectCajas/></TableCell>
            <TableCell><SelectHoras/><SelectCajas/></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </CardContent>
</Card>

  )
}
