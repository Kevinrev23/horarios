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
  },
  {
    invoice: "Daniela lopez",
  },
  {
    invoice: "Diego martinez",
  },
  {
    invoice: "Juan riascos",
  },
  {
    invoice: "Laura gomez",
  },
  {
    invoice: "Miguel torres",
  },
  {
    invoice: "Sofia navarro",
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
      <TableCaption>Horarios semanales </TableCaption>
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
