import { CalendarIcon, ChevronDownIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { DateRange } from "react-day-picker";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { id as localeId } from "date-fns/locale";
import { format } from "date-fns";

function formatDateId(date: Date): string {
  return format(date, "dd/MM/yyyy", { locale: localeId });
}

export function RangeDatePicker({ value, onChange }: { value?: DateRange; onChange: (value: DateRange | undefined) => void }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value?.from ? (value.to ? `${formatDateId(value.from)} - ${formatDateId(value.to)}` : formatDateId(value.from)) : "Pilih rentang tanggal"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="range" locale={localeId} selected={value} onSelect={onChange} numberOfMonths={2} />
      </PopoverContent>
    </Popover>
  );
}

export function SingleDatePicker({ value, onChange }: { value?: Date; onChange: (date: Date | undefined) => void }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {value ? formatDateId(value) : "Pilih tanggal"}
          <ChevronDownIcon size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Calendar mode="single" locale={localeId} selected={value} onSelect={onChange} />
      </PopoverContent>
    </Popover>
  );
}
