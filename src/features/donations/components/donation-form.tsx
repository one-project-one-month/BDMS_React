import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import * as z from "zod";

import {
  storeDonationMutationOptions,
  updateDonationMutationOptions,
  donationKeys,
} from "../queries/donationQueries";
import type {
  Donation,
  StoreDonationPayload,
  UpdateDonationPayload,
} from "../donation.types";
import useAuth from "@/context/auth/useAuth";

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
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { getDonorsQueryOptions } from "@/features/donors/queries";
import { getHospitalsQueryOptions } from "@/features/hospitals/queries";

function formatDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const donationStatusOptions = [
  "pending",
  "cancelled",
  "approved",
  "screening",
  "rejected",
  "completed",
] as const;

function normalizeDonationStatus(value?: string | null) {
  const normalized = value?.toLowerCase();

  return donationStatusOptions.includes(
    normalized as (typeof donationStatusOptions)[number],
  )
    ? (normalized as (typeof donationStatusOptions)[number])
    : "pending";
}

const formSchema = z.object({
  donorId: z.number().min(1, "Donor ID is required."),
  hospitalId: z
    .number()
    .min(1, "Hospital ID is required.")
    .min(0, "Hospital ID cannot be less than 0."),
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
  donationDate: z.string().min(1, "Donation date is required."),
  status: z.enum(donationStatusOptions),
  unitsDonated: z
    .number()
    .min(0, "Units donated cannot be less than 0.")
    .nullable()
    .optional(),
  bloodRequestId: z
    .number()
    .min(0, "Blood Request ID cannot be less than 0.")
    .nullable()
    .optional(),
  remarks: z.string().optional(),
});

interface DonationFormProps {
  initialData?: Donation;
  isEditing?: boolean;
  returnPath?: string;
  donorIdOverride?: number;
}

export default function DonationForm({
  initialData,
  isEditing = false,
  returnPath = "/admin/donations",
  donorIdOverride,
}: DonationFormProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const isDonorLocked = donorIdOverride != null;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      donorId: initialData?.donorId || donorIdOverride || 0,
      hospitalId: initialData?.hospitalId || 0,
      bloodGroup: initialData?.bloodGroup,
      donationDate: initialData?.donationDate
        ? new Date(initialData.donationDate).toISOString().split("T")[0]
        : formatDateInputValue(new Date()),
      status: normalizeDonationStatus(initialData?.status),
      unitsDonated: initialData?.unitsDonated || 1,
      bloodRequestId: initialData?.bloodRequestId || null,
      remarks: initialData?.remarks || "",
    },
  });

  const { data: donors } = useSuspenseQuery(getDonorsQueryOptions);

  const { data: hospitals } = useSuspenseQuery(getHospitalsQueryOptions);

  const selectedDonorId = form.watch("donorId");

  useEffect(() => {
    if (donorIdOverride == null) {
      return;
    }

    form.setValue("donorId", donorIdOverride, { shouldValidate: true });
  }, [donorIdOverride, form]);

  useEffect(() => {
    if (!selectedDonorId) {
      return;
    }

    const donor = donors.find((item) => item.id === selectedDonorId);

    if (!donor) {
      return;
    }

    form.setValue(
      "bloodGroup",
      donor.bloodGroup as z.infer<typeof formSchema>["bloodGroup"],
      { shouldValidate: true },
    );
  }, [donors, form, isEditing, selectedDonorId]);

  const createMutation = useMutation({
    ...storeDonationMutationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: donationKeys.lists() });
      toast.success("Donation record created successfully.", {
        position: "bottom-right",
      });
      navigate(returnPath);
    },
    onError: (error) => {
      console.error(error);
      const message = isAxiosError(error)
        ? ((error.response?.data as any)?.message ??
          "Failed to create donation")
        : "Failed to create donation";
      form.setError("root", { message });
      toast.error("Failed to create donation.", { position: "bottom-right" });
    },
  });

  const updateMutation = useMutation({
    ...updateDonationMutationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: donationKeys.lists() });
      if (initialData?.id) {
        queryClient.invalidateQueries({
          queryKey: donationKeys.detail(initialData.id),
        });
      }
      toast.success("Donation updated successfully.", {
        position: "bottom-right",
      });
      navigate(returnPath);
    },
    onError: (error) => {
      console.error(error);
      const message = isAxiosError(error)
        ? ((error.response?.data as any)?.message ??
          "Failed to update donation")
        : "Failed to update donation";
      form.setError("root", { message });
      toast.error("Failed to update donation.", { position: "bottom-right" });
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user?.userId) {
      const message = "You must be logged in to submit a donation.";
      form.setError("root", { message });
      toast.error(message, { position: "bottom-right" });
      return;
    }

    const payload = {
      ...values,
      donorId: donorIdOverride ?? values.donorId,
      createdBy: user.userId,
    };

    if (isEditing && initialData?.id) {
      updateMutation.mutateAsync({
        ...payload,
        id: initialData.id,
      } as UpdateDonationPayload);
    } else {
      createMutation.mutateAsync(payload as StoreDonationPayload);
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {isEditing && initialData?.donationCode && (
        <FieldGroup className="mb-4">
          <Field>
            <FieldLabel className="text-dark-primary">Donation Code</FieldLabel>
            <Input
              value={initialData.donationCode}
              readOnly
              className="bg-muted font-mono"
            />
          </Field>
        </FieldGroup>
      )}
      <FieldGroup className="grid grid-cols-2 gap-4 mb-4">
        {/* Donor */}
        <Controller
          name="donorId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="text-dark-primary">Donor</FieldLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={field.value ? String(field.value) : undefined}
                disabled={isDonorLocked}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select donor NRC" />
                </SelectTrigger>
                <SelectContent>
                  {donors.map((donor) => (
                    <SelectItem key={donor.id} value={String(donor.id)}>
                      {donor.nicNo || `Donor #${donor.id}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Hospital */}
        <Controller
          name="hospitalId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="text-dark-primary">Hospital</FieldLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={field.value ? String(field.value) : undefined}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select hospital" />
                </SelectTrigger>
                <SelectContent>
                  {hospitals.map((hospital) => (
                    <SelectItem key={hospital.id} value={String(hospital.id)}>
                      {hospital.name || `Hospital #${hospital.id}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Blood Group */}
        <Controller
          name="bloodGroup"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="text-dark-primary">Blood Group</FieldLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Blood Group" />
                </SelectTrigger>
                <SelectContent>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                    (bg) => (
                      <SelectItem key={bg} value={bg}>
                        {bg}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Donation Date */}
        <Controller
          name="donationDate"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="text-dark-primary">
                Donation Date
              </FieldLabel>
              <Input {...field} type="date" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Status */}
        <Controller
          name="status"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="text-dark-primary">Status</FieldLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="screening">Screening</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Blood Request ID */}
        <Controller
          name="bloodRequestId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="text-dark-primary">
                Blood Request ID (Optional)
              </FieldLabel>
              <Input
                {...field}
                type="number"
                placeholder="Request ID"
                min="0"
                value={field.value || ""}
                onChange={(e) =>
                  field.onChange(parseInt(e.target.value) || null)
                }
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Units Donated */}
        <Controller
          name="unitsDonated"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="text-dark-primary">
                Units Donated
              </FieldLabel>
              <Input
                {...field}
                type="number"
                placeholder="Units (e.g. 1)"
                min="0"
                value={field.value ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  field.onChange(val === "" ? null : Number(val));
                }}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      {/* Remarks */}
      <FieldGroup>
        <Controller
          name="remarks"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="text-dark-primary">Remarks</FieldLabel>
              <Input {...field} placeholder="Additional notes..." />
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

      {isEditing && (
        <div className="mt-8 pt-6 border-t border-border space-y-4">
          <Typography
            variant="body"
            className="font-semibold text-muted-foreground uppercase tracking-wider"
          >
            System Information
          </Typography>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm">
            <div className="space-y-1">
              <span className="text-muted-foreground block">Created By</span>
              <span className="font-medium">
                User #{initialData?.createdBy || "System"}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground block">Created At</span>
              <span className="font-medium">
                {initialData?.createdAt
                  ? new Date(initialData.createdAt).toLocaleString()
                  : "N/A"}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-muted-foreground block">Last Updated</span>
              <span className="font-medium">
                {initialData?.updatedAt
                  ? new Date(initialData.updatedAt).toLocaleString()
                  : "N/A"}
              </span>
            </div>
            {initialData?.approvedBy && (
              <div className="space-y-1">
                <span className="text-muted-foreground block">Approved By</span>
                <span className="font-medium">
                  User #{initialData.approvedBy}
                </span>
              </div>
            )}
            {initialData?.approvedAt && (
              <div className="space-y-1">
                <span className="text-muted-foreground block">Approved At</span>
                <span className="font-medium">
                  {new Date(initialData.approvedAt).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      <FieldGroup>
        <div className="flex items-center gap-4 mt-6">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Submitting..." : isEditing ? "Update" : "Submit"}
          </Button>
          <Button variant={"outline"} asChild>
            <Link to={returnPath}>Cancel</Link>
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
