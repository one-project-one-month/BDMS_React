import { isAxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import queryClient from "@/query-client";
import {
  bloodRequestDetailQueryOptions,
  updateBloodRequestMutationOptions,
} from "../queries";

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
import { bloodRequestKeys } from "../queries/requestKeys";
import type { BloodRequest } from "../request.types";

const BLOOD_GROUP_OPTIONS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const URGENCY_OPTIONS = ["Low", "Medium", "High", "Critical"];

const bloodGroupToDisplay = (value: string): string => {
  return value.replace("positive", "+").replace("negative", "-").toUpperCase();
};

const bloodGroupToStore = (value: string): string => {
  return value.replace("+", "positive").replace("-", "negative").toLowerCase();
};

const formSchema = z.object({
  id: z.number(),
  userId: z.number(),
  hospitalId: z.number(),
  patientName: z.string().min(1, "Patient name is required."),
  bloodGroup: z.string().min(1, "Please select a blood group."),
  unitsRequired: z
    .number({ error: "Units required must be a number." })
    .min(1, "At least 1 unit is required.")
    .max(20, "Cannot exceed 20 units."),
  contactPhone: z.string().min(9, "Please enter a valid phone number."),
  urgency: z.string().min(1, "Please select an urgency level."),
  requiredDate: z
    .string()
    .min(1, "Required date is required.")
    .refine((val) => {
      const date = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date >= today;
    }, "Required date cannot be in the past."),
  reason: z.string().min(1, "Reason is required."),
});

export default function BloodRequestEditForm({ id }: { id: number }) {
  const navigate = useNavigate();

  const request = useSuspenseQuery(bloodRequestDetailQueryOptions(id)).data as BloodRequest;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: request.id,
      userId: request.userId,
      hospitalId: request.hospitalId,
      patientName: request.patientName,
      bloodGroup: bloodGroupToDisplay(request.bloodGroup),
      unitsRequired: request.unitsRequired,
      contactPhone: request.contactPhone,
      urgency: request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1),
      requiredDate: request.requiredDate.split("T")[0],
      reason: request.reason,
    },
  });

  const updateMutation = useMutation({
    ...updateBloodRequestMutationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bloodRequestKeys.list() });
      toast.success("Blood request updated successfully.", {
        position: "bottom-right",
      });
      navigate("/admin/blood-requests");
    },
    onError: (error) => {
      console.error(error);
      const message = isAxiosError(error)
        ? ((error.response?.data as { message?: string })?.message ??
          "Failed to update blood request")
        : "Failed to update blood request";

      form.setError("root", { message });

      toast.error("Failed to update blood request.", {
        position: "bottom-right",
      });
    },
  });

  async function onSubmit(payload: z.infer<typeof formSchema>) {
    await updateMutation.mutateAsync({
      id: payload.id,
      userId: payload.userId,
      values: {
        patientName: payload.patientName,
        bloodGroup: bloodGroupToStore(payload.bloodGroup) as any,
        hospitalId: payload.hospitalId,
        hospitalAddress: "",
        unitsRequired: payload.unitsRequired,
        requiredDate: new Date(payload.requiredDate),
        requestType: (payload.urgency.toLowerCase() === "critical" || payload.urgency.toLowerCase() === "high" ? "emergency" : "pre-booked") as any,
        relationshipToPatient: "other",
        contactPhone: payload.contactPhone,
        reason: payload.reason,
        additionalNotes: "",
        urgency: payload.urgency.toLowerCase() as any,
      } as any,
    });
  }

  return (
    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="grid md:grid-cols-2 gap-6">
        {/* Patient Name */}
        <Controller
          name="patientName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Patient Name</FieldLabel>
              <Input {...field} disabled placeholder="Enter patient name" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Contact Phone */}
        <Controller
          name="contactPhone"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Contact Phone</FieldLabel>
              <Input {...field} type="tel" placeholder="Enter contact phone" />
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
              <FieldLabel>Blood Group</FieldLabel>
              <Select
                value={field.value}
                onValueChange={(val) => field.onChange(bloodGroupToStore(val))}
                disabled
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select blood group" />
                </SelectTrigger>
                <SelectContent>
                  {BLOOD_GROUP_OPTIONS.map((bg) => (
                    <SelectItem key={bg} value={bg}>
                      {bg}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Urgency */}
        <Controller
          name="urgency"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Urgency</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select urgency level" />
                </SelectTrigger>
                <SelectContent>
                  {URGENCY_OPTIONS.map((level) => (
                    <SelectItem key={level} value={level.toLowerCase()}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Units Required */}
        <Controller
          name="unitsRequired"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Units Required</FieldLabel>
              <Input
                {...field}
                type="number"
                min={1}
                max={20}
                placeholder="Enter number of units"
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Required Date */}
        <Controller
          name="requiredDate"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Required Date</FieldLabel>
              <Input
                {...field}
                type="date"
                min={new Date().toISOString().split("T")[0]}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Reason */}
        <Controller
          name="reason"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field className="md:col-span-2" data-invalid={fieldState.invalid}>
              <FieldLabel>Reason</FieldLabel>
              <Input {...field} placeholder="Enter reason for blood request" />
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
        <div className="flex gap-4">
          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? "Updating..." : "Update"}
          </Button>
          <Button variant="outline" asChild>
            <Link to="/admin/blood-requests">Back</Link>
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
