import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { CalculatorIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";
import { Button } from "./ui/button";

const DatePickerWithRange = ({ className, from, to, setDate }) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleOnSelect = () => {
    setDate({ from, to });
    setIsPopoverOpen(false);
  };

  const handleCancel = () => {
    setDate({ from: null, to: null });
    setIsPopoverOpen(false);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "justify-start text-left font-normal",
              !from && !to && "text-muted-foreground"
            )}
          >
            <CalculatorIcon className="mr-2 h-4 w-4" />
            {from ? (
              to ? (
                <>
                  {format(from, "yyyy-LL-dd")} ~ {format(to, "yyyy-LL-dd")}
                </>
              ) : (
                format(from, "yyyy-LL-dd")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={from}
            selected={{ from, to }}
            onSelect={setDate}
            numberOfMonths={2}
          />
          <div className="w-full space-x-2 text-center border-t py-2">
            <Button variant="outline" size="sm" onClick={handleOnSelect}>
              선택
            </Button>
            <Button variant="outline" size="sm" onClick={handleCancel}>
              취소
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DatePickerWithRange;
