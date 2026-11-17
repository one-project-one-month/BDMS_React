import { isAxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import queryClient from "@/query-client";
import {
  getDonorQueryOptions,
  updateDonorMutationOptions,
  donorKeys,
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

const formSchema = z.object({
  id: z.number(),
  userId: z.number(),
  nicNo: z.string().min(5, "NIC is required"),
  dateOfBirth: z.string(),
  gender: z.string(),
  bloodGroup: z.string(),
  lastDonationDate: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      const date = new Date(val);
      const today = new Date();
      return date <= today;
    }, "Last donation date cannot be in the future.")
    .refine((val) => {
      if (!val) return true;
      const date = new Date(val);
      const today = new Date();
      const diffDays =
        (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
      return diffDays >= 56; // 56 days = 8 weeks minimum between donations
    }, "Minimum 56 days (8 weeks) must have passed since last donation."),
  remarks: z.string().optional(),
  emergencyContact: z.string(),
  emergencyPhone: z.string(),
  address: z.string(),
});

export default function DonorEditForm({ id }: { id: number }) {
  const navigate = useNavigate();

  const { data: donor } = useSuspenseQuery(getDonorQueryOptions(id));

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: donor.id,
      userId: donor.userId,
      nicNo: donor.nicNo,
      dateOfBirth: donor.dateOfBirth,
      gender: donor.gender,
      bloodGroup: donor.bloodGroup,
      lastDonationDate: donor.lastDonationDate ?? "",
      remarks: donor.remarks ?? "",
      emergencyContact: donor.emergencyContact,
      emergencyPhone: donor.emergencyPhone,
      address: donor.address,
    },
  });

  const updateMutation = useMutation({
    ...updateDonorMutationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: donorKeys.list() });
      toast.success("Donor updated successfully", {
        position: "bottom-right",
      });
      navigate("/admin/donors");
    },
    onError: (error) => {
      console.error(error);
      const message = isAxiosError(error)
        ? ((error.response?.data as { message?: string })?.message ??
          "Failed to update donor")
        : "Failed to update donor";

      form.setError("root", { message });

      toast.error("Failed to update donor", {
        position: "bottom-right",
      });
    },
  });

  async function onSubmit(payload: z.infer<typeof formSchema>) {
    await updateMutation.mutateAsync({
      ...payload,
      lastDonationDate: payload.lastDonationDate || "",
      isActive: true,
    });
  }

  return (
    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="grid md:grid-cols-2 gap-6">
        {/* NIC */}
        <Controller
          name="nicNo"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>NIC</FieldLabel>
              <Input {...field} placeholder="Enter NIC" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* DOB */}
        <Controller
          name="dateOfBirth"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Date of Birth</FieldLabel>
              <Input type="date" {...field} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Gender */}
        <Controller
          name="gender"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel>Gender</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          )}
        />

        {/* Blood Group */}
        <Controller
          name="bloodGroup"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel>Blood Group</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select blood group" />
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
            </Field>
          )}
        />

        {/* Last Donation */}
        <Controller
          name="lastDonationDate"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel>Last Donation Date</FieldLabel>
              <Input type="date" {...field} />
            </Field>
          )}
        />

        {/* Emergency Contact */}
        <Controller
          name="emergencyContact"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel>Emergency Contact</FieldLabel>
              <Input {...field} />
            </Field>
          )}
        />

        {/* Emergency Phone */}
        <Controller
          name="emergencyPhone"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel>Emergency Phone</FieldLabel>
              <Input {...field} />
            </Field>
          )}
        />

        {/* Address */}
        <Controller
          name="address"
          control={form.control}
          render={({ field }) => (
            <Field className="md:col-span-2">
              <FieldLabel>Address</FieldLabel>
              <Input {...field} />
            </Field>
          )}
        />

        {/* Remarks */}
        <Controller
          name="remarks"
          control={form.control}
          render={({ field }) => (
            <Field className="md:col-span-2">
              <FieldLabel>Remarks</FieldLabel>
              <Input {...field} />
            </Field>
          )}
        />

        {/* Active */}
        {/* <Controller
          name="isActive"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel>Status</FieldLabel>
              <Select
                value={field.value ? "true" : "false"}
                onValueChange={(v) => field.onChange(v === "true")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          )}
        /> */}
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
            <Link to="/admin/donors">Back</Link>
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
