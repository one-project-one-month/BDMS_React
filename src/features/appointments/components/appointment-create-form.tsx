import { zodResolver } from "@hookform/resolvers/zod";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getDonationsQueryOptions } from "@/features/donations/queries/donationQueries";
import {
  appointmentKeys,
  createAppointmentFromDonationMutationOptions,
} from "../queries";

const appointmentCreateSchema = z.object({
  donationId: z
    .number({ error: "Donation ID is required." })
    .int("Donation ID must be a whole number.")
    .positive("Donation ID must be greater than 0."),
  remarks: z
    .string()
    .max(500, "Remarks must be 500 characters or fewer.")
    .optional(),
});

type AppointmentCreateValues = z.infer<typeof appointmentCreateSchema>;

export default function AppointmentCreateForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: donations, isPending: isDonationsPending } = useQuery(
    getDonationsQueryOptions,
  );

  const form = useForm<AppointmentCreateValues>({
    resolver: zodResolver(appointmentCreateSchema),
    defaultValues: {
      donationId: 0,
      remarks: "",
    },
  });

  const donationOptions =
    donations
      ?.filter(
        (donation) => donation.status.toLowerCase() === "approved",
      )
      .map((donation) => ({
        value: String(donation.id),
        label: `#${donation.id} - ${donation.donationCode || `Donation ${donation.id}`}`,
      })) ?? [];

  const createAppointmentMutation = useMutation({
    ...createAppointmentFromDonationMutationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
      toast.success("Appointment created successfully.", {
        position: "bottom-right",
      });
      navigate("/admin/appointments");
    },
    onError: (error) => {
      console.error(error);
      const message =
        error instanceof Error
          ? error.message
          : "Failed to create appointment.";

      form.setError("root", { message });
      toast.error("Failed to create appointment.", {
        position: "bottom-right",
      });
    },
  });

  const onSubmit = async (values: AppointmentCreateValues) => {
    await createAppointmentMutation.mutateAsync({
      donationId: values.donationId,
      payload: {
        remarks: values.remarks?.trim() || undefined,
      },
    });
  };

  return (
    <form
      id="appointment-create-form"
      className="space-y-6"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldGroup>
        <Controller
          name="donationId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="appointment-create-donation-id"
                className="text-dark-primary"
              >
                Donation
              </FieldLabel>
              <Select
                value={field.value > 0 ? String(field.value) : ""}
                onValueChange={(value) => field.onChange(Number(value))}
                disabled={isDonationsPending || donationOptions.length === 0}
              >
                <SelectTrigger
                  id="appointment-create-donation-id"
                  aria-invalid={fieldState.invalid}
                  className="w-full"
                >
                  <SelectValue
                    placeholder={
                      isDonationsPending
                        ? "Loading donations..."
                        : donationOptions.length > 0
                          ? "Select an approved donation"
                          : "No approved donations available"
                    }
                  />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                  {donationOptions.map((donation) => (
                    <SelectItem key={donation.value} value={donation.value}>
                      {donation.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldDescription>
                Only approved donations can be used to create an appointment.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="remarks"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="appointment-create-remarks"
                className="text-dark-primary"
              >
                Remarks
              </FieldLabel>
              <Textarea
                {...field}
                id="appointment-create-remarks"
                value={field.value ?? ""}
                aria-invalid={fieldState.invalid}
                placeholder="Optional appointment remarks"
                rows={5}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      {form.formState.errors.root && (
        <FieldGroup>
          <Field>
            <FieldError errors={[form.formState.errors.root]} />
          </Field>
        </FieldGroup>
      )}

      <FieldGroup>
        <div className="flex items-center gap-4">
          <Button type="submit" disabled={createAppointmentMutation.isPending}>
            {createAppointmentMutation.isPending ? "Creating..." : "Create"}
          </Button>
          <Button variant="outline" asChild>
            <Link to="/admin/appointments">Back to Appointments</Link>
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
