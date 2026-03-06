import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const dividerVariants = cva("relative w-full", {
  variants: {
    variant: {
      default: "bg-muted-foreground/50",
      dashed: `
        before:content-['']
        before:absolute
        before:left-0
        before:top-0
        before:w-full
        before:h-px
        before:pointer-events-none
        before:bg-[repeating-linear-gradient(90deg,color-mix(in_oklch,var(--muted-foreground)_50%,transparent)_0_5px,transparent_5px_12px)]
      `,
    },
    orientation: {
      horizontal: "h-px",
      vertical: "w-px h-full",
    },
  },
  defaultVariants: {
    variant: "default",
    orientation: "horizontal",
  },
});

function Divider({
  className,
  variant,
  orientation,
  ...props
}: React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof dividerVariants>) {
  return (
    <div
      data-slot="divider"
      data-variant={variant}
      data-orientation={orientation}
      className={cn(dividerVariants({ variant, orientation }), className)}
      {...props}
    />
  );
}

export { Divider, dividerVariants };
