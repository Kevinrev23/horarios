
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function SelectCajas() {
  return (
    <Select>
      <SelectTrigger className="w-[60px]">
        <SelectValue placeholder="0" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Numero de Caja</SelectLabel>
          <SelectItem value="1">1</SelectItem>
          <SelectItem value="2">2</SelectItem>
          <SelectItem value="3">3</SelectItem>
          <SelectItem value="4">4</SelectItem>
          <SelectItem value="5">5</SelectItem>
          <SelectItem value="6">6</SelectItem>
          <SelectItem value="7">7</SelectItem>
          <SelectItem value="8">8</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
    
  )
}
