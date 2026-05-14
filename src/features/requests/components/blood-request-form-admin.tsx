import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import * as z from "zod";

import { useQuery } from "@tanstack/react-query";
import { createBloodRequestAdminMutationOptions } from "../queries";

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
import { getUsersQueryOptions } from "@/features/users/queries";
import { getHospitalsQueryOptions } from "@/features/hospitals/queries";
import { bloodRequestKeys } from "../queries/requestKeys";
import { formatBloodGroup } from "../request.utils";
import { getDonorsQueryOptions } from "@/features/donors/queries";

const BLOOD_GROUP_OPTIONS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const URGENCY_OPTIONS = ["Low", "Medium", "High", "Critical"];

const formSchema = z.object({
  userId: z.number().min(1, "Please select a user."),
  hospitalId: z.number().min(1, "Please select a hospital."),
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

export default function BloodRequestCreateForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: 0,
      hospitalId: 0,
      patientName: "",
      bloodGroup: "",
      unitsRequired: 1,
      contactPhone: "",
      urgency: "",
      requiredDate: "",
      reason: "",
    },
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: users, isPending: isUsersLoading } =
    useQuery(getUsersQueryOptions);
  const { data: hospitals, isPending: isHospitalsLoading } = useQuery(
    getHospitalsQueryOptions,
  );
  const { data: donors } = useSuspenseQuery(getDonorsQueryOptions);

  const createBloodRequestMutation = useMutation({
    ...createBloodRequestAdminMutationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bloodRequestKeys.list() });
      toast.success("Blood request created successfully.", {
        position: "bottom-right",
      });
      navigate("/admin/blood-requests");
    },
    onError: (error) => {
      console.error(error);
      const message = isAxiosError(error)
        ? ((error.response?.data as { message?: string })?.message ??
          "Failed to create blood request")
        : "Failed to create blood request";

      form.setError("root", { message });

      toast.error("Failed to create blood request.", {
        position: "bottom-right",
      });
    },
  });

  async function onSubmit(payload: z.infer<typeof formSchema>) {
    createBloodRequestMutation.mutateAsync(payload);
  }

  return (
    <form
      id="blood-request-create-form"
      className="space-y-6"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      {/* User — selecting email auto-fills patient name */}
      <FieldGroup className="grid grid-cols-2 gap-4">
        <Controller
          name="userId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="blood-request-create-form-userId"
                className="text-dark-primary"
              >
                User Email
              </FieldLabel>
              <Select
                name={field.name}
                value={field.value ? `${field.value}` : ""}
                onValueChange={(value) => {
                  field.onChange(Number(value));
                  const selectedUser = users?.find(
                    (u) => u.userId === Number(value),
                  );
                  const selectedDonor = donors.find(
                    (donor) => donor.userId === selectedUser?.userId,
                  );
                  form.setValue("patientName", selectedUser?.username ?? "", {
                    shouldValidate: true,
                  });
                  form.setValue(
                    "bloodGroup",
                    selectedDonor?.bloodGroup
                      ? formatBloodGroup(selectedDonor.bloodGroup)
                      : "",
                    {
                      shouldValidate: true,
                    },
                  );
                }}
                disabled={isUsersLoading}
              >
                <SelectTrigger
                  id="blood-request-create-form-userId"
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue
                    placeholder={
                      isUsersLoading ? "Loading users..." : "Select user email"
                    }
                  />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                  <SelectSeparator />
                  {/* {users
                    ?.filter(
                      (user) => user.isActive && user.role.roleName === "user",
                    )
                    .map((user) => (
                      <SelectItem key={user.userId} value={`${user.userId}`}>
                        {user.email}
                      </SelectItem>
                    ))} */}
                  {users
                    ?.filter((user) => user.isActive)
                    .map((user) => (
                      <SelectItem key={user.userId} value={`${user.userId}`}>
                        {user.email}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Patient Name — auto-filled and disabled */}
        <Controller
          name="patientName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="blood-request-create-form-patientName"
                className="text-dark-primary"
              >
                Patient Name
              </FieldLabel>
              <Input
                {...field}
                id="blood-request-create-form-patientName"
                aria-invalid={fieldState.invalid}
                placeholder="Auto-filled from selected user"
                type="text"
                disabled
                className="bg-muted text-muted-foreground cursor-not-allowed"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      {/* Hospital */}
      <FieldGroup>
        <Controller
          name="hospitalId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="blood-request-create-form-hospitalId"
                className="text-dark-primary"
              >
                Hospital
              </FieldLabel>
              <Select
                name={field.name}
                value={field.value ? `${field.value}` : ""}
                onValueChange={(value) => field.onChange(Number(value))}
                disabled={isHospitalsLoading}
              >
                <SelectTrigger
                  id="blood-request-create-form-hospitalId"
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue
                    placeholder={
                      isHospitalsLoading
                        ? "Loading hospitals..."
                        : "Select hospital"
                    }
                  />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                  <SelectSeparator />
                  {hospitals?.map((hospital) => (
                    <SelectItem key={hospital.id} value={`${hospital.id}`}>
                      {hospital.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <FieldGroup className="grid grid-cols-2 gap-4">
        {/* Blood Group */}
        <Controller
          name="bloodGroup"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="blood-request-create-form-bloodGroup"
                className="text-dark-primary"
              >
                Blood Group
              </FieldLabel>
              <Select
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
                disabled
              >
                <SelectTrigger
                  id="blood-request-create-form-bloodGroup"
                  aria-invalid={fieldState.invalid}
                  className="bg-muted text-muted-foreground cursor-not-allowed"
                >
                  <SelectValue placeholder="Auto-filled from selected user" />
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

        {/* Units Required */}
        <Controller
          name="unitsRequired"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="blood-request-create-form-unitsRequired"
                className="text-dark-primary"
              >
                Units Required
              </FieldLabel>
              <Input
                {...field}
                id="blood-request-create-form-unitsRequired"
                aria-invalid={fieldState.invalid}
                placeholder="Enter number of units"
                type="number"
                min={1}
                max={20}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
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
              <FieldLabel
                htmlFor="blood-request-create-form-urgency"
                className="text-dark-primary"
              >
                Urgency
              </FieldLabel>
              <Select
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  id="blood-request-create-form-urgency"
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder="Select urgency level" />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                  <SelectSeparator />
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

        {/* Required Date */}
        <Controller
          name="requiredDate"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="blood-request-create-form-requiredDate"
                className="text-dark-primary"
              >
                Required Date
              </FieldLabel>
              <Input
                {...field}
                id="blood-request-create-form-requiredDate"
                aria-invalid={fieldState.invalid}
                type="date"
                min={new Date().toISOString().split("T")[0]}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      {/* Contact Phone */}
      <FieldGroup>
        <Controller
          name="contactPhone"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="blood-request-create-form-contactPhone"
                className="text-dark-primary"
              >
                Contact Phone
              </FieldLabel>
              <Input
                {...field}
                id="blood-request-create-form-contactPhone"
                aria-invalid={fieldState.invalid}
                placeholder="Enter contact phone number"
                type="tel"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      {/* Reason */}
      <FieldGroup>
        <Controller
          name="reason"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="blood-request-create-form-reason"
                className="text-dark-primary"
              >
                Reason
              </FieldLabel>
              <Input
                {...field}
                id="blood-request-create-form-reason"
                aria-invalid={fieldState.invalid}
                placeholder="Enter reason for blood request"
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
          <Button type="submit" disabled={createBloodRequestMutation.isPending}>
            {createBloodRequestMutation.isPending ? "Submitting..." : "Submit"}
          </Button>
          <Button variant="outline" asChild>
            <Link to={"/admin/blood-requests"}>Back to Blood Requests</Link>
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
