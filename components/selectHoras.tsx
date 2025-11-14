import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function SelectHoras() {
  return (
    <Select>
      <SelectTrigger className="w-[110px]">
        <SelectValue placeholder="Asignar" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Horarios</SelectLabel>
          <SelectItem value="1">7am-2pm</SelectItem>
          <SelectItem value="2">8am-3pm 4pm-9m</SelectItem>
          <SelectItem value="3">11am-5pm</SelectItem>
          <SelectItem value="4">4pm-9pm</SelectItem>
          <SelectItem value="5">12am-8pm</SelectItem>
          <SelectItem value="6">Descanso</SelectItem>
          <SelectItem value="7">Incapacidad</SelectItem>
          <SelectItem value="8">Vacaciones</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
    
  )
}
