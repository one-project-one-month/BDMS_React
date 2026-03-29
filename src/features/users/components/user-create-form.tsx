import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import * as z from "zod";

import { createUserMutationOptions, userKeys } from "../queries";
import { getRolesQueryOptions } from "@/features/roles/queries";

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

const formSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters."),
  email: z.email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  userRoleId: z.number(),
  userHospitalId: z.number().nullable(),
});

export default function UserCreateForm() {
  const [showHospital, setShowHospital] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      userRoleId: 4,
      userHospitalId: null,
    },
  });

  const { data: roles } = useQuery(getRolesQueryOptions);
  const userRoles = roles?.filter((role) => role.id !== 3);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleShowHospital = (value: string) => {
    const roleId = +value;
    setShowHospital(roleId === 2);
  };

  /** create user mutation */
  const createUserMutation = useMutation({
    ...createUserMutationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [userKeys.list()] });
      toast.success("User record created successfully.", {
        position: "bottom-right",
      });
      navigate("/admin/users");
    },
    onError: (error) => {
      console.error(error);
      const message = isAxiosError(error)
        ? ((error.response?.data as { message?: string })?.message ??
          "Failed to create user record")
        : "Failed to create user record";

      form.setError("root", { message });

      toast.error("Failed to create user record.", {
        position: "bottom-right",
      });
    },
  });

  /** form submit handler */
  async function onSubmit(payload: z.infer<typeof formSchema>) {
    createUserMutation.mutateAsync(payload);
  }

  return (
    <form
      id="user-create-form"
      className="space-y-6"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldGroup>
        {/* Username */}
        <Controller
          name="username"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="user-create-form-username"
                className="text-dark-primary"
              >
                Username
              </FieldLabel>
              <Input
                {...field}
                id="user-create-form-username"
                aria-invalid={fieldState.invalid}
                placeholder="Enter your username"
                type="text"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
      <FieldGroup className="grid grid-cols-2 gap-4">
        {/* Email */}
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="user-create-form-email"
                className="text-dark-primary"
              >
                Email
              </FieldLabel>
              <Input
                {...field}
                id="user-create-form-email"
                aria-invalid={fieldState.invalid}
                placeholder="Enter your email"
                autoComplete="email"
                type="email"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* password */}
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="user-create-form-password"
                className="text-dark-primary"
              >
                Password
              </FieldLabel>
              <Input
                {...field}
                id="user-create-form-password"
                aria-invalid={fieldState.invalid}
                placeholder="Enter your password"
                autoComplete="new-password"
                type="password"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* roles */}
        <Controller
          name="userRoleId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="user-create-form-role"
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
                  id="form-rhf-select-language"
                  aria-invalid={fieldState.invalid}
                  className="min-w-30"
                >
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                  <SelectSeparator />
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
          <div>
            {/* hospital select implementation goes here after getting api */}
          </div>
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
          <Button type="submit" disabled={createUserMutation.isPending}>
            {createUserMutation.isPending ? "Submitting..." : "Submit"}
          </Button>
          <Button variant={"outline"} asChild>
            <Link to={"/admin/users"}>Back to Users</Link>
          </Button>
        </div>
      </FieldGroup>
    </form>
  );
}
