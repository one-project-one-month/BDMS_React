import { Textarea } from "@/components/ui/textarea";
import { Pencil } from "lucide-react";

export function StyledTextarea(props: React.ComponentProps<typeof Textarea>) {
  return (
    <div className="relative">
      <Textarea
        {...props}
        className="bg-red-50 border border-red-200 text-red-500 placeholder:text-red-300 pr-9 rounded-md focus:border-red-400 focus:ring-red-100 resize-none"
      />
      <Pencil className="absolute right-3 top-3 w-3.5 h-3.5 text-red-400 pointer-events-none" />
    </div>
  );
}