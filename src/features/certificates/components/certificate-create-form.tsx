import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Editor } from "@tinymce/tinymce-react";
import { toast } from "sonner";
import * as z from "zod";

import { generateCertificate } from "../api/certificate-api";
import { certificateKeys, getDonorListQueryOptions } from "../queries";
import { extractApiErrorMessage } from "../utils/errorUtils";

// UI Components
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define the Zod Schema for validation
const formSchema = z.object({
  donorId: z.number().min(1, "Donor ID must be a valid number."),
  certificateTitle: z.string().min(3, "Title must be at least 3 characters."),
  certificateDescription: z.string().min(10, "Description must be at least 10 characters."),
});

export default function CertificateCreateForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: donors } = useSuspenseQuery(getDonorListQueryOptions);

  const donorOptions = donors ?? [];

  // Initialize React Hook Form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      donorId: 0,
      certificateTitle: "",
      certificateDescription: "",
    },
  });

  // Setup the Mutation
  const generateMutation = useMutation({
    mutationFn: generateCertificate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: certificateKeys.listAll() });
      toast.success("Certificate generated successfully.", {
        position: "bottom-right",
      });
      navigate("/admin/certificates");
    },
    onError: (error) => {
      console.error(error);
      const message = extractApiErrorMessage(error) ?? "Failed to generate certificate.";

      form.setError("root", { message });

      toast.error(message, {
        position: "bottom-right",
      });
    },
  });

  // Submit Handler
  function onSubmit(payload: z.infer<typeof formSchema>) {
    generateMutation.mutate(payload);
  }

  return (
    <form
      id="certificate-create-form"
      className="space-y-6"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldGroup>
        {/* Donor */}
        <Controller
          name="donorId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="cert-create-donor-id"
                className="text-dark-primary"
              >
                Select Donor
              </FieldLabel>
              <Select
                name={field.name}
                value={field.value > 0 ? String(field.value) : undefined}
                onValueChange={(value) => field.onChange(Number(value))}
              >
                <SelectTrigger
                  id="cert-create-donor-id"
                  aria-invalid={fieldState.invalid}
                  className="min-w-30"
                >
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  side="bottom"
                  align="start"
                  sideOffset={4}
                  className="max-h-60"
                >
                  {donorOptions.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No donors found
                    </SelectItem>
                  ) : (
                    donorOptions.map((donor) => (
                      <SelectItem
                        key={donor.donorId}
                        value={String(donor.donorId)}
                      >
                        {donor.donorName?.trim() || `Donor #${donor.donorId}`}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <FieldGroup className="grid grid-cols-2 gap-4">
        {/* Certificate Title */}
        <Controller
          name="certificateTitle"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="cert-create-title"
                className="text-dark-primary"
              >
                Certificate Title
              </FieldLabel>
              <Input
                {...field}
                id="cert-create-title"
                aria-invalid={fieldState.invalid}
                placeholder="(e.g., 'Certificate of Appreciation')"
                type="text"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Certificate Description */}
        <Controller
          name="certificateDescription"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="col-span-2">
              <FieldLabel
                htmlFor="cert-create-description"
                className="text-dark-primary"
              >
                Description & Commendation
              </FieldLabel>
              <Editor
                id="cert-create-description"
                apiKey="qagffr3pkuv17a8on1afax661irst1hbr4e6tbv888sz91jc"
                value={field.value}
                onEditorChange={(content) => field.onChange(content)}
                onBlur={field.onBlur}
                init={{
                  height: 260,
                  menubar: false,
                  plugins: ["lists", "link", "autolink", "wordcount"],
                  toolbar:
                    "undo redo | blocks | bold italic underline | bullist numlist | link | removeformat",
                  placeholder: "Enter the official certificate details...",
                }}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      {/* Root API Error Handling */}
      {form.formState.errors.root && (
        <FieldGroup>
          <Field>
            <FieldError errors={[form.formState.errors.root]} />
          </Field>
        </FieldGroup>
      )}

      {/* Submit Actions */}
      <FieldGroup>
        <div className="flex items-center gap-4">
          <Button
            type="submit"
            disabled={generateMutation.isPending || donorOptions.length === 0}
          >
            {generateMutation.isPending ? "Submitting..." : "Submit"}
          </Button>
          <Button variant={"outline"} asChild>
            <Link to="/admin/certificates">Back to Certificates</Link>
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}