import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import * as z from "zod";

import { createDonorMutationOptions, donorKeys } from "../queries";

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
import { Button } from "@/components/ui/button";
import { useState } from "react";

const formSchema = z.object({
  nicNo: z.string().min(9, "NIC No must be at least 9 characters."),
  dateOfBirth: z.string().min(1, "Date of birth is required."),
  gender: z.string().min(1, "Please select a gender."),
  bloodGroup: z.string().min(1, "Please select a blood group."),
  lastDonationDate: z.string().nullable(),
  remarks: z.string().optional(),
  emergencyContact: z.string().min(1, "Emergency contact name is required."),
  emergencyPhone: z.string().min(9, "Please enter a valid phone number."),
  address: z.string().min(1, "Address is required."),
});

const GENDER_OPTIONS = ["Male", "Female", "Other"];

const BLOOD_GROUP_OPTIONS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function DonorCreateForm() {
  const [hasLastDonation, setHasLastDonation] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nicNo: "",
      dateOfBirth: "",
      gender: "",
      bloodGroup: "",
      lastDonationDate: null,
      remarks: "",
      emergencyContact: "",
      emergencyPhone: "",
      address: "",
    },
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createDonorMutation = useMutation({
    ...createDonorMutationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [donorKeys.list()] });
      toast.success("Donor record created successfully.", {
        position: "bottom-right",
      });
      navigate("/admin/donors");
    },
    onError: (error) => {
      console.error(error);
      const message = isAxiosError(error)
        ? ((error.response?.data as { message?: string })?.message ??
          "Failed to create donor record")
        : "Failed to create donor record";

      form.setError("root", { message });

      toast.error("Failed to create donor record.", {
        position: "bottom-right",
      });
    },
  });

  async function onSubmit(payload: z.infer<typeof formSchema>) {
    // createDonorMutation.mutateAsync(payload);
    console.log("payload", payload);
  }

  return (
    <form
      id="donor-create-form"
      className="space-y-6"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      {/* NIC No */}
      <FieldGroup>
        <Controller
          name="nicNo"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="donor-create-form-nicNo"
                className="text-dark-primary"
              >
                NIC No
              </FieldLabel>
              <Input
                {...field}
                id="donor-create-form-nicNo"
                aria-invalid={fieldState.invalid}
                placeholder="Enter NIC number"
                type="text"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      {/* Date of Birth */}
      <FieldGroup>
        <Controller
          name="dateOfBirth"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="donor-create-form-dob"
                className="text-dark-primary"
              >
                Date of Birth
              </FieldLabel>
              <Input
                {...field}
                id="donor-create-form-dob"
                aria-invalid={fieldState.invalid}
                type="date"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <FieldGroup className="grid grid-cols-2 gap-4">
        {/* Gender */}
        <Controller
          name="gender"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="donor-create-form-gender"
                className="text-dark-primary"
              >
                Gender
              </FieldLabel>
              <Select
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  id="donor-create-form-gender"
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                  <SelectSeparator />
                  {GENDER_OPTIONS.map((gender) => (
                    <SelectItem key={gender} value={gender}>
                      {gender}
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
              <FieldLabel
                htmlFor="donor-create-form-bloodGroup"
                className="text-dark-primary"
              >
                Blood Group
              </FieldLabel>
              <Select
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  id="donor-create-form-bloodGroup"
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder="Select blood group" />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                  <SelectSeparator />
                  {BLOOD_GROUP_OPTIONS.map((group) => (
                    <SelectItem key={group} value={group}>
                      {group}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Emergency Contact */}
        <Controller
          name="emergencyContact"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="donor-create-form-emergencyContact"
                className="text-dark-primary"
              >
                Emergency Contact
              </FieldLabel>
              <Input
                {...field}
                id="donor-create-form-emergencyContact"
                aria-invalid={fieldState.invalid}
                placeholder="Enter contact name"
                type="text"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Emergency Phone */}
        <Controller
          name="emergencyPhone"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="donor-create-form-emergencyPhone"
                className="text-dark-primary"
              >
                Emergency Phone
              </FieldLabel>
              <Input
                {...field}
                id="donor-create-form-emergencyPhone"
                aria-invalid={fieldState.invalid}
                placeholder="Enter phone number"
                type="tel"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      {/* Last Donation Date */}
      <FieldGroup>
        <div className="flex items-center gap-2 mb-3">
          <input
            type="checkbox"
            id="donor-create-form-hasLastDonation"
            checked={hasLastDonation}
            onChange={(e) => {
              setHasLastDonation(e.target.checked);
              if (!e.target.checked) form.setValue("lastDonationDate", null);
            }}
          />
          <label
            htmlFor="donor-create-form-hasLastDonation"
            className="text-sm text-muted-foreground"
          >
            Has previous donation
          </label>
        </div>

        {hasLastDonation && (
          <Controller
            name="lastDonationDate"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="donor-create-form-ldd"
                  className="text-dark-primary"
                >
                  Last Donation Date
                </FieldLabel>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  id="donor-create-form-ldd"
                  aria-invalid={fieldState.invalid}
                  type="date"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        )}
      </FieldGroup>

      {/* Address */}
      <FieldGroup>
        <Controller
          name="address"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="donor-create-form-address"
                className="text-dark-primary"
              >
                Address
              </FieldLabel>
              <Input
                {...field}
                id="donor-create-form-address"
                aria-invalid={fieldState.invalid}
                placeholder="Enter full address"
                type="text"
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
              <FieldLabel
                htmlFor="donor-create-form-remarks"
                className="text-dark-primary"
              >
                Remarks{" "}
                <span className="text-muted-foreground text-sm">
                  (optional)
                </span>
              </FieldLabel>
              <Input
                {...field}
                id="donor-create-form-remarks"
                aria-invalid={fieldState.invalid}
                placeholder="Any additional notes"
                type="text"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      {/* Root error */}
      {form.formState.errors.root && (
        <FieldGroup>
          <Field>
            <FieldError errors={[form.formState.errors.root]} />
          </Field>
        </FieldGroup>
      )}

      {/* Actions */}
      <FieldGroup>
        <div className="flex items-center gap-4">
          <Button type="submit" disabled={createDonorMutation.isPending}>
            {createDonorMutation.isPending ? "Submitting..." : "Submit"}
          </Button>
          <Button variant={"outline"} asChild>
            <Link to={"/admin/donors"}>Back to Donors</Link>
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
