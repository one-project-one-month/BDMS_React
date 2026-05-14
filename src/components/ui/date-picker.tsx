import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const DatePicker = React.forwardRef<
  React.ComponentRef<"input">,
  Omit<React.ComponentPropsWithoutRef<"input">, "onChange" | "value"> & {
    value?: Date | undefined;
    onChange?: (date: Date | undefined) => void;
    placeholder?: string;
    disabled?: boolean;
    "aria-invalid"?: boolean;
  }
>(({ value, onChange, placeholder, disabled, className, "aria-invalid": ariaInvalid, id, ...props }, ref) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Date | undefined>(value);
  const [viewDate, setViewDate] = React.useState<Date>(value || new Date());
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setSelected(value);
    if (value) {
      setViewDate(value);
    }
  }, [value]);

  const handleSelect = (date: Date | undefined) => {
    setSelected(date);
    onChange?.(date);
    setIsOpen(false);
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days: (Date | null)[] = [];
    
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const isDisabled = (date: Date) => {
    if (!disabled) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date < today;
    }
    return true;
  };

  const isSameDay = (d1: Date | null, d2: Date | undefined) => {
    if (!d1 || !d2) return false;
    return d1.toDateString() === d2.toDateString();
  };

  const days = getDaysInMonth(viewDate);
  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const prevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        ref={ref}
        id={id}
        value={selected ? format(selected, "PPP") : ""}
        readOnly
        disabled={disabled}
        placeholder={placeholder}
        aria-invalid={ariaInvalid}
        onClick={() => !disabled && setIsOpen(true)}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
          className
        )}
        {...props}
      />
      {isOpen && (
        <div className="absolute top-full left-0 z-50 mt-2 rounded-md border bg-background shadow-lg p-3">
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={prevMonth}
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon-sm" }),
                "h-7 w-7"
              )}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium">
              {format(viewDate, "MMMM yyyy")}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon-sm" }),
                "h-7 w-7"
              )}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-muted-foreground text-xs font-medium w-8 h-8 flex items-center justify-center"
              >
                {day}
              </div>
            ))}
            {days.map((day, index) => {
              if (!day) {
                return <div key={`empty-${index}`} className="w-8 h-8" />;
              }
              
              const disabledDay = isDisabled(day);
              const isSelected = isSameDay(day, selected);
              
              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  onClick={() => !disabledDay && handleSelect(day)}
                  disabled={disabledDay}
                  className={cn(
                    "w-8 h-8 text-sm rounded-md flex items-center justify-center",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : disabledDay
                      ? "text-muted-foreground opacity-50 cursor-not-allowed"
                      : "hover:bg-accent cursor-pointer"
                  )}
                >
                  {day.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
});

DatePicker.displayName = "DatePicker";

export { DatePicker };
