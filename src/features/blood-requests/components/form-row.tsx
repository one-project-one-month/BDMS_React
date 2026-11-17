import { Field, FieldLabel, FieldError } from "@/components/ui/field";

export function FormRow({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <Field className="grid gap-2 px-1 md:grid-cols-[11rem_1fr] md:items-start">
      <FieldLabel className="pt-2 text-sm font-semibold tracking-tight text-gray-700 md:text-base">
        {label}:
      </FieldLabel>
      <div className="flex flex-col gap-1">
        {children}
        {error && <FieldError errors={[{ message: error }]} />}
      </div>
    </Field>
  );
}
