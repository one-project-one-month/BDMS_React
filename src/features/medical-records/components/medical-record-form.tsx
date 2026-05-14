import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Controller, useForm } from "react-hook-form";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as z from "zod";

import useAuth from "@/context/auth/useAuth";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getDonationsQueryOptions } from "@/features/donations/queries";
import { getHospitalsQueryOptions } from "@/features/hospitals/queries";
import {
  createMedicalRecordMutationOptions,
  medicalRecordKeys,
  updateMedicalRecordMutationOptions,
} from "../queries";
import type {
  MedicalRecord,
  StoreMedicalRecordPayload,
  UpdateMedicalRecordPayload,
} from "../medical-records.types";

const resultOptions = [
  { value: 0, label: "Negative" },
  { value: 1, label: "Positive" },
] as const;

const screeningStatusOptions = [
  { value: 0, label: "Pending" },
  { value: 1, label: "Approved" },
  { value: 2, label: "Rejected" },
] as const;

const formSchema = z.object({
  donationId: z.number().min(1, "Please select a donation."),
  hospitalId: z.number().min(1, "Please select a hospital."),
  hemoglobinLevel: z
    .number({ error: "Hemoglobin level must be a number." })
    .min(0, "Hemoglobin level cannot be negative."),
  hivResult: z.number().min(0).max(1),
  hepatitisBResult: z.number().min(0).max(1),
  hepatitisCResult: z.number().min(0).max(1),
  malariaResult: z.number().min(0).max(1),
  syphilisResult: z.number().min(0).max(1),
  screeningStatus: z.number().min(0).max(2),
  screeningNotes: z.string().min(1, "Screening notes are required."),
  screenedBy: z.number().min(1, "Screened by is required."),
  screeningAt: z.string().min(1, "Screening date and time are required."),
});

function formatDateTimeLocal(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

interface MedicalRecordFormProps {
  initialData?: MedicalRecord;
  isEditing?: boolean;
}

export default function MedicalRecordForm({
  initialData,
  isEditing = false,
}: MedicalRecordFormProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      donationId: initialData?.donationId ?? 0,
      hospitalId: initialData?.hospitalId ?? 0,
      hemoglobinLevel: initialData?.hemoglobinLevel ?? 0,
      hivResult: initialData?.hivResult ?? 0,
      hepatitisBResult: initialData?.hepatitisBResult ?? 0,
      hepatitisCResult: initialData?.hepatitisCResult ?? 0,
      malariaResult: initialData?.malariaResult ?? 0,
      syphilisResult: initialData?.syphilisResult ?? 0,
      screeningStatus: initialData?.screeningStatus ?? 0,
      screeningNotes: initialData?.screeningNotes ?? "",
      screenedBy: initialData?.screenedBy ?? user?.userId ?? 0,
      screeningAt: initialData?.screeningAt
        ? formatDateTimeLocal(new Date(initialData.screeningAt))
        : formatDateTimeLocal(new Date()),
    },
  });

  const { data: donations, isPending: isDonationsLoading } = useQuery(
    getDonationsQueryOptions,
  );
  const { data: hospitals, isPending: isHospitalsLoading } = useQuery(
    getHospitalsQueryOptions,
  );

  const screeningDonations = donations?.filter(
    (donation) =>
      donation.status === "screening" || donation.id === initialData?.donationId,
  ) ?? [];
  const selectedDonationId = form.watch("donationId");
  const selectedDonation = screeningDonations.find(
    (donation) => donation.id === selectedDonationId,
  );
  const selectedHospital = hospitals?.find(
    (hospital) => hospital.id === selectedDonation?.hospitalId,
  );

  useEffect(() => {
    if (!initialData) {
      return;
    }

    form.reset({
      donationId: initialData.donationId,
      hospitalId: initialData.hospitalId,
      hemoglobinLevel: initialData.hemoglobinLevel,
      hivResult: initialData.hivResult,
      hepatitisBResult: initialData.hepatitisBResult,
      hepatitisCResult: initialData.hepatitisCResult,
      malariaResult: initialData.malariaResult,
      syphilisResult: initialData.syphilisResult,
      screeningStatus: initialData.screeningStatus,
      screeningNotes: initialData.screeningNotes,
      screenedBy: initialData.screenedBy,
      screeningAt: formatDateTimeLocal(new Date(initialData.screeningAt)),
    });
  }, [form, initialData]);

  useEffect(() => {
    if (!selectedDonation) {
      form.setValue("hospitalId", 0, {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      });
      form.clearErrors("hospitalId");
      return;
    }

    form.setValue("hospitalId", selectedDonation.hospitalId, {
      shouldValidate: true,
    });
  }, [form, selectedDonation]);

  const createMutation = useMutation({
    ...createMedicalRecordMutationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: medicalRecordKeys.list() });
      toast.success("Medical record created successfully.", {
        position: "bottom-right",
      });
      navigate("/admin/medical-records");
    },
    onError: (error) => {
      const message = isAxiosError(error)
        ? ((error.response?.data as { message?: string })?.message ??
          "Failed to create medical record")
        : "Failed to create medical record";

      form.setError("root", { message });
      toast.error("Failed to create medical record.", {
        position: "bottom-right",
      });
    },
  });

  const updateMutation = useMutation({
    ...updateMedicalRecordMutationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: medicalRecordKeys.list() });
      if (initialData?.id) {
        queryClient.invalidateQueries({
          queryKey: medicalRecordKeys.detail(initialData.id),
        });
      }
      toast.success("Medical record updated successfully.", {
        position: "bottom-right",
      });
      navigate("/admin/medical-records");
    },
    onError: (error) => {
      const message = isAxiosError(error)
        ? ((error.response?.data as { message?: string })?.message ??
          "Failed to update medical record")
        : "Failed to update medical record";

      form.setError("root", { message });
      toast.error("Failed to update medical record.", {
        position: "bottom-right",
      });
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user?.userId) {
      const message = `You must be logged in to ${isEditing ? "update" : "create"} a medical record.`;
      form.setError("root", { message });
      toast.error(message, { position: "bottom-right" });
      return;
    }

    const payload = {
      ...values,
      screenedBy: user.userId,
      screeningAt: new Date(values.screeningAt).toISOString(),
    };

    if (isEditing && initialData?.id) {
      updateMutation.mutateAsync({
        ...payload,
        id: initialData.id,
      } as UpdateMedicalRecordPayload);
      return;
    }

    createMutation.mutateAsync({
      id: 0,
      ...payload,
    } as StoreMedicalRecordPayload);
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <form
      id={isEditing ? "medical-record-edit-form" : "medical-record-create-form"}
      className="space-y-6"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Controller
          name="donationId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="text-dark-primary">
                Donation
              </FieldLabel>
              <Select
                value={field.value ? `${field.value}` : ""}
                onValueChange={(value) => field.onChange(Number(value))}
                disabled={isDonationsLoading || isEditing}
              >
                <SelectTrigger aria-invalid={fieldState.invalid}>
                  <SelectValue
                    placeholder={
                      isDonationsLoading
                        ? "Loading donations..."
                        : "Select screening donation"
                    }
                  />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                  <SelectSeparator />
                  {screeningDonations.map((donation) => (
                    <SelectItem key={donation.id} value={`${donation.id}`}>
                      {donation.donationCode
                        ? `${donation.donationCode} (#${donation.id})`
                        : `Donation #${donation.id}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="hospitalId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="text-dark-primary">
                Hospital
              </FieldLabel>
              <Input
                value={
                  isHospitalsLoading
                    ? "Loading hospitals..."
                    : selectedDonation
                      ? `${selectedHospital?.name ?? `Hospital #${selectedDonation.hospitalId}`} (#${selectedDonation.hospitalId})`
                      : ""
                }
                placeholder="Select a donation first"
                readOnly
                disabled
                className="bg-muted"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="hemoglobinLevel"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="text-dark-primary">
                Hemoglobin Level
              </FieldLabel>
              <Input
                {...field}
                type="number"
                step="0.1"
                min="0"
                onChange={(event) =>
                  field.onChange(Number(event.currentTarget.value))
                }
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="screeningStatus"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="text-dark-primary">
                Screening Status
              </FieldLabel>
              <Select
                value={`${field.value}`}
                onValueChange={(value) => field.onChange(Number(value))}
              >
                <SelectTrigger aria-invalid={fieldState.invalid}>
                  <SelectValue placeholder="Select screening status" />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                  <SelectSeparator />
                  {screeningStatusOptions.map((option) => (
                    <SelectItem key={option.value} value={`${option.value}`}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Controller
          name="hivResult"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="text-dark-primary">HIV Result</FieldLabel>
              <Select
                value={`${field.value}`}
                onValueChange={(value) => field.onChange(Number(value))}
              >
                <SelectTrigger aria-invalid={fieldState.invalid}>
                  <SelectValue placeholder="Select HIV result" />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                  <SelectSeparator />
                  {resultOptions.map((option) => (
                    <SelectItem key={option.value} value={`${option.value}`}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="hepatitisBResult"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="text-dark-primary">
                Hepatitis B Result
              </FieldLabel>
              <Select
                value={`${field.value}`}
                onValueChange={(value) => field.onChange(Number(value))}
              >
                <SelectTrigger aria-invalid={fieldState.invalid}>
                  <SelectValue placeholder="Select hepatitis B result" />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                  <SelectSeparator />
                  {resultOptions.map((option) => (
                    <SelectItem key={option.value} value={`${option.value}`}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="hepatitisCResult"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="text-dark-primary">
                Hepatitis C Result
              </FieldLabel>
              <Select
                value={`${field.value}`}
                onValueChange={(value) => field.onChange(Number(value))}
              >
                <SelectTrigger aria-invalid={fieldState.invalid}>
                  <SelectValue placeholder="Select hepatitis C result" />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                  <SelectSeparator />
                  {resultOptions.map((option) => (
                    <SelectItem key={option.value} value={`${option.value}`}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="malariaResult"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="text-dark-primary">
                Malaria Result
              </FieldLabel>
              <Select
                value={`${field.value}`}
                onValueChange={(value) => field.onChange(Number(value))}
              >
                <SelectTrigger aria-invalid={fieldState.invalid}>
                  <SelectValue placeholder="Select malaria result" />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                  <SelectSeparator />
                  {resultOptions.map((option) => (
                    <SelectItem key={option.value} value={`${option.value}`}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="syphilisResult"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="text-dark-primary">
                Syphilis Result
              </FieldLabel>
              <Select
                value={`${field.value}`}
                onValueChange={(value) => field.onChange(Number(value))}
              >
                <SelectTrigger aria-invalid={fieldState.invalid}>
                  <SelectValue placeholder="Select syphilis result" />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                  <SelectSeparator />
                  {resultOptions.map((option) => (
                    <SelectItem key={option.value} value={`${option.value}`}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="screeningAt"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="text-dark-primary">
                Screening Date & Time
              </FieldLabel>
              <Input {...field} type="datetime-local" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <FieldGroup className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Controller
          name="screenedBy"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="text-dark-primary">Screened By</FieldLabel>
              <Input
                value={user?.userName ? `${user.userName} (#${user.userId})` : ""}
                readOnly
                className="bg-muted"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <FieldGroup>
        <Controller
          name="screeningNotes"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="text-dark-primary">
                Screening Notes
              </FieldLabel>
              <Textarea
                {...field}
                rows={5}
                placeholder="Enter screening notes and observations"
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
          <Button type="submit" disabled={isPending}>
            {isPending
              ? isEditing
                ? "Updating..."
                : "Submitting..."
              : isEditing
                ? "Update"
                : "Submit"}
          </Button>
          <Button variant="outline" asChild>
            <Link to="/admin/medical-records">Cancel</Link>
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
