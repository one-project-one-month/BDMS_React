import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Typography } from "@/components/ui/typography";

interface DashboardCardProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  titleClassName?: string;
}

/** White rounded card with the design's pink drop shadow and a title row. */
export function DashboardCard({ title, icon, children, className, titleClassName }: DashboardCardProps) {
  return (
    <section
      className={cn(
        "flex min-h-[200px] flex-col rounded-[10px] bg-white p-6 shadow-[4px_6px_5px_0px_rgba(255,115,125,0.45)]",
        className,
      )}
    >
      <div className="mb-4 flex items-center gap-2">
        {icon}
        <Typography className={cn("text-dark-primary text-sm! font-semibold", titleClassName)}>{title}</Typography>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center text-center">{children}</div>
    </section>
  );
}
