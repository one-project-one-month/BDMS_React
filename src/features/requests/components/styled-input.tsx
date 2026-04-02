import { Input } from "@/components/ui/input";
import { SquarePen } from "lucide-react";

// Input styled to match the design: light pink bg, red border on focus, red text, edit icon
export function StyledInput(props: React.ComponentProps<typeof Input>) {
  return (
    <div className="relative">
      <Input
        {...props}
        className=""
      />
      <SquarePen className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-red-400 pointer-events-none" />
    </div>
  );
}