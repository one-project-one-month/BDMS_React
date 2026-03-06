import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const typographyVariants = cva("", {
  variants: {
    variant: {
      title:
        "text-3xl md:text-4xl lg:text-5xl xl:text-[56px] md:leading-[1.1] font-bold leading-tight",
      subtitle:
        "text-lg md:text-xl xl:text-[24px] md:leading-[1.3] font-medium leading-snug",
      body: "text-base md:text-[17px] md:leading-[1.6] font-normal leading-relaxed",
    },
  },
  defaultVariants: {
    variant: "body",
  },
});

type TypographyProps = React.HTMLAttributes<HTMLElement> &
  VariantProps<typeof typographyVariants> & {
    as?: React.ElementType;
  };

export function Typography({
  className,
  variant = "body",
  as: Comp = "p",
  ...props
}: TypographyProps) {
  return (
    <Comp
      className={cn(typographyVariants({ variant }), className)}
      {...props}
    />
  );
}
