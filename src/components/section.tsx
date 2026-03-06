import { type ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
}

/**
 * Section component
 * Provides consistent vertical spacing
 * between page sections.
 */
export default function Section({ children, className = "" }: SectionProps) {
  return (
    <section className={`py-12 lg:py-16 ${className}`}>{children}</section>
  );
}
