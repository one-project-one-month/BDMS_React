import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import * as z from "zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { becomeDonorMutationOptions, donorKeys } from "../queries";

const formSchema = z.object({
  nicNo: z.string().min(9, "NIC No must be at least 9 characters."),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required.")
    .refine((val) => new Date(val) < new Date(), "Date of birth cannot be in the future.")
    .refine((val) => {
      const age = new Date().getFullYear() - new Date(val).getFullYear();
      return age >= 18;
    }, "Donor must be at least 18 years old.")
    .refine((val) => {
      const age = new Date().getFullYear() - new Date(val).getFullYear();
      return age <= 65;
    }, "Donor must be under 65 years old."),
  gender: z.string().min(1, "Please select a gender."),
  bloodGroup: z.string().min(1, "Please select a blood group."),
  lastDonationDate: z
    .string()
    .nullable()
    .refine((val) => !val || new Date(val) <= new Date(), "Last donation date cannot be in the future.")
    .refine((val) => {
      if (!val) return true;
      const diffDays =
        (new Date().getTime() - new Date(val).getTime()) / (1000 * 60 * 60 * 24);
      return diffDays >= 56;
    }, "Minimum 56 days (8 weeks) must have passed since last donation."),
  remarks: z.string().optional(),
  emergencyContact: z.string().min(1, "Emergency contact name is required."),
  emergencyPhone: z.string().min(9, "Please enter a valid phone number."),
  address: z.string().min(1, "Address is required."),
});

const GENDER_OPTIONS = ["Male", "Female"];
const BLOOD_GROUP_OPTIONS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

interface BecomeDonorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function BecomeDonorDialog({
  open,
  onOpenChange,
}: BecomeDonorDialogProps) {
  const [hasLastDonation, setHasLastDonation] = useState(false);
  const queryClient = useQueryClient();

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

  const becomeMutation = useMutation({
    ...becomeDonorMutationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: donorKeys.list() });
      toast.success("Donor application submitted. Awaiting approval.", {
        position: "bottom-right",
      });
      form.reset();
      setHasLastDonation(false);
      onOpenChange(false);
    },
    onError: (error) => {
      const message = isAxiosError(error)
        ? typeof error.response?.data === "string"
          ? error.response.data
          : ((error.response?.data as { message?: string })?.message ??
            "Failed to submit application")
        : "Failed to submit application";

      form.setError("root", { message });
      toast.error(message, { position: "bottom-right" });
    },
  });

  function onSubmit(payload: z.infer<typeof formSchema>) {
    becomeMutation.mutate(payload);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Become a Donor</DialogTitle>
          <DialogDescription>
            Fill in your details to apply. Your application will be reviewed and
            approved by our admin/staff team before you become an active donor.
          </DialogDescription>
        </DialogHeader>

        <form
          id="become-donor-form"
          className="space-y-5"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {/* NIC No */}
          <FieldGroup>
            <Controller
              name="nicNo"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="become-donor-nicNo">
                    NIC No
                  </FieldLabel>
                  <Input
                    {...field}
                    id="become-donor-nicNo"
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
                  <FieldLabel htmlFor="become-donor-dob">
                    Date of Birth
                  </FieldLabel>
                  <Input
                    {...field}
                    id="become-donor-dob"
                    aria-invalid={fieldState.invalid}
                    type="date"
                    max={new Date().toISOString().split("T")[0]}
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
                  <FieldLabel htmlFor="become-donor-gender">Gender</FieldLabel>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="become-donor-gender"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                      <SelectSeparator />
                      {GENDER_OPTIONS.map((gender) => (
                        <SelectItem key={gender} value={gender.toLowerCase()}>
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
                  <FieldLabel htmlFor="become-donor-bloodGroup">
                    Blood Group
                  </FieldLabel>
                  <Select
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="become-donor-bloodGroup"
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
                  <FieldLabel htmlFor="become-donor-emergencyContact">
                    Emergency Contact
                  </FieldLabel>
                  <Input
                    {...field}
                    id="become-donor-emergencyContact"
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
                  <FieldLabel htmlFor="become-donor-emergencyPhone">
                    Emergency Phone
                  </FieldLabel>
                  <Input
                    {...field}
                    id="become-donor-emergencyPhone"
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
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="become-donor-hasLastDonation"
                checked={hasLastDonation}
                onChange={(e) => {
                  setHasLastDonation(e.target.checked);
                  if (!e.target.checked) form.setValue("lastDonationDate", null);
                }}
              />
              <label
                htmlFor="become-donor-hasLastDonation"
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
                    <FieldLabel htmlFor="become-donor-ldd">
                      Last Donation Date
                    </FieldLabel>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      id="become-donor-ldd"
                      aria-invalid={fieldState.invalid}
                      type="date"
                      max={new Date().toISOString().split("T")[0]}
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
                  <FieldLabel htmlFor="become-donor-address">Address</FieldLabel>
                  <Input
                    {...field}
                    id="become-donor-address"
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
                  <FieldLabel htmlFor="become-donor-remarks">
                    Remarks{" "}
                    <span className="text-muted-foreground text-sm">
                      (optional)
                    </span>
                  </FieldLabel>
                  <Input
                    {...field}
                    id="become-donor-remarks"
                    aria-invalid={fieldState.invalid}
                    placeholder="Any additional notes"
                    type="text"
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
              <Button
                type="submit"
                disabled={becomeMutation.isPending}
                className="flex-1"
              >
                {becomeMutation.isPending ? "Submitting..." : "Submit Application"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={becomeMutation.isPending}
              >
                Cancel
              </Button>
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
