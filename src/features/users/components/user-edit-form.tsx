import { isAxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import queryClient from "@/query-client";
import {
  getUserQueryOptions,
  updateUserMutationOptions,
  userKeys,
} from "../queries";
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
import { getRolesQueryOptions } from "@/features/roles/queries";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getHospitalsQueryOptions } from "@/features/hospitals/queries";

const formSchema = z
  .object({
    userId: z.number(),
    username: z.string().min(2, "Username must be at least 2 characters."),
    email: z.email("Please enter a valid email address."),
    userRoleId: z.number(),
    userHospitalId: z.number().nullable().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.userRoleId === 2 && data.userHospitalId == null) {
      ctx.addIssue({
        path: ["userHospitalId"],
        code: z.ZodIssueCode.custom,
        message: "Hospital is required for staff.",
      });
    }
  });

export default function UserEditForm({ id }: { id: number }) {
  const [showHospital, setShowHospital] = useState(false);
  const navigate = useNavigate();

  const { data: user } = useSuspenseQuery(getUserQueryOptions(id));

  const { data: roles } = useSuspenseQuery(getRolesQueryOptions);
  const userRoles = roles?.filter((role) => role.id !== 3);

  const { data: hospitals } = useSuspenseQuery(getHospitalsQueryOptions);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: user.userId,
      username: user.username,
      email: user.email,
      userRoleId: user.role.roleId,
      userHospitalId: user.hospital?.hospitalId ?? null,
    },
  });

  useEffect(() => {
    const changeShowHospitalStatus = async () => {
      if (user.role.roleId === 2) {
        setShowHospital(true);
      }
    };
    changeShowHospitalStatus();
  }, [user]);

  const updateUserMutation = useMutation({
    ...updateUserMutationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.list() });
      toast.success("User record updated successfully.", {
        position: "bottom-right",
      });
      navigate("/admin/users");
    },
    onError: (error) => {
      console.error(error);
      const message = isAxiosError(error)
        ? ((error.response?.data as { message?: string })?.message ??
          "Failed to update user record")
        : "Failed to update user record";

      form.setError("root", { message });

      toast.error("Failed to update user record.", {
        position: "bottom-right",
      });
    },
  });

  const handleShowHospital = (value: string) => {
    const roleId = +value;
    const isStaff = roleId === 2;

    setShowHospital(isStaff);

    if (!isStaff) {
      form.setValue("userHospitalId", null);
      form.clearErrors("userHospitalId");
    }
  };

  async function onSubmit(payload: z.infer<typeof formSchema>) {
    updateUserMutation.mutateAsync({
      ...payload,
      userHospitalId: payload.userHospitalId ?? null,
    });
  }

  return (
    <form
      id="user-edit-form"
      className="space-y-6"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldGroup className="grid md:grid-cols-2 gap-6">
        {/* username */}
        <Controller
          name="username"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="user-edit-form-username"
                className="text-dark-primary"
              >
                Username
              </FieldLabel>
              <Input
                {...field}
                id="user-edit-form-username"
                aria-invalid={fieldState.invalid}
                placeholder="Enter your username"
                type="text"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* email */}
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="user-edit-form-email"
                className="text-dark-primary"
              >
                Email
              </FieldLabel>
              <Input
                {...field}
                id="user-edit-form-email"
                aria-invalid={fieldState.invalid}
                placeholder="Enter your email"
                autoComplete="email"
                type="email"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* role */}
        <Controller
          name="userRoleId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="user-edit-form-select-role"
                className="text-dark-primary"
              >
                Role
              </FieldLabel>
              <Select
                name={field.name}
                value={`${field.value}`}
                onValueChange={(value) => {
                  field.onChange(Number(value));
                  handleShowHospital(value);
                }}
              >
                <SelectTrigger
                  id="user-edit-form-select-role"
                  aria-invalid={fieldState.invalid}
                  className="min-w-30"
                >
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                  {userRoles?.map((role) => (
                    <SelectItem key={role.id} value={`${role.id}`}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* hospital */}
        {showHospital && (
          <Controller
            name="userHospitalId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="user-edit-form-select-hospital"
                  className="text-dark-primary"
                >
                  Hospital
                </FieldLabel>
                <Select
                  name={field.name}
                  value={field.value == null ? "" : String(field.value)}
                  onValueChange={(value) => {
                    field.onChange(Number(value));
                  }}
                >
                  <SelectTrigger
                    id="user-edit-form-select-hospital"
                    aria-invalid={fieldState.invalid}
                    className="min-w-30"
                  >
                    <SelectValue placeholder="Please select hospital" />
                  </SelectTrigger>
                  <SelectContent position="item-aligned">
                    {hospitals?.map((hospital) => (
                      <SelectItem key={hospital.id} value={`${hospital.id}`}>
                        {hospital.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        )}
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
          <Button type="submit" disabled={updateUserMutation.isPending}>
            {updateUserMutation.isPending ? "Updating..." : "Update"}
          </Button>
          <Button variant={"outline"} asChild>
            <Link to={"/admin/users"}>Back to Users</Link>
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
