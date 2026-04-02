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
    <Field className="px-4 flex flex-row items-start">
      <FieldLabel className="text-lg font-bold tracking-tight text-gray-700">
        {label} : 
      </FieldLabel>
      <div className="flex flex-col gap-1">
        {children}
        {error && <FieldError errors={[{ message: error }]} />}
      </div>
    </Field>
  );
}
