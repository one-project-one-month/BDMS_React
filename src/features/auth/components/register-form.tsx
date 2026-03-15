import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authKeys, registerMutationOptions } from "../queries";

const formSchema = z
  .object({
    userName: z.string().min(2, "Name must be at least 2 characters."),
    email: z.email("Please enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters"),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });

export default function RegisterForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const registerMutation = useMutation(registerMutationOptions);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const user = await registerMutation.mutateAsync({
        userName: data.userName,
        email: data.email,
        password: data.password,
        passwordConfirmation: data.passwordConfirmation,
      });

      queryClient.setQueryData(authKeys.me(), user);

      toast.success("Account created successfully!", {
        position: "bottom-right",
      });

      form.reset();
      const destination =
        user.role === "admin" || user.role === "staff"
          ? "/admin"
          : "/dashboard";

      navigate(destination);
    } catch (error) {
      console.error(error);
      toast.error("Registration failed", {
        position: "bottom-right",
      });
    }
  }

  return (
    <Card className="w-full sm:max-w-md p-4 md:p-6 space-y-4 py-12!">
      <CardHeader>
        <CardTitle>
          <Typography
            as={"h2"}
            variant={"title"}
            className="text-primary text-center"
          >
            Register
          </Typography>
        </CardTitle>
        <CardDescription>
          <Typography
            as={"p"}
            variant={"body"}
            className="text-sm! font-semibold text-dark-primary text-center"
          >
            Create your account to start managing your Bloodlife donations.
          </Typography>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="register-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {/* User Name */}
            <Controller
              name="userName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    className="text-dark-primary"
                    htmlFor="register-form-username"
                  >
                    User Name
                  </FieldLabel>

                  <Input
                    {...field}
                    id="register-form-username"
                    placeholder="Enter your name"
                    className="bg-input"
                    autoComplete="username"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Email */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    className="text-dark-primary"
                    htmlFor="register-form-email"
                  >
                    Email
                  </FieldLabel>

                  <Input
                    {...field}
                    type="email"
                    id="register-form-email"
                    placeholder="Enter your email"
                    className="bg-input"
                    autoComplete="email"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Password */}
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    className="text-dark-primary"
                    htmlFor="register-form-password"
                  >
                    Password
                  </FieldLabel>

                  <Input
                    {...field}
                    type="password"
                    id="register-form-password"
                    placeholder="Enter your password"
                    className="bg-input"
                    autoComplete="new-password"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Confirm Password */}
            <Controller
              name="passwordConfirmation"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    className="text-dark-primary"
                    htmlFor="register-form-password-confirmation"
                  >
                    Confirm Password
                  </FieldLabel>

                  <Input
                    {...field}
                    type="password"
                    id="register-form-password-confirmation"
                    placeholder="Confirm your password"
                    className="bg-input"
                    autoComplete="new-password"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-y-6">
        <Field orientation="horizontal">
          <Button
            type="submit"
            form="register-form"
            className="w-full"
            disabled={registerMutation.isPending}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="size-5"
            >
              <path
                d="M5.5 5.7619C6.775 5.7619 7.80769 4.69643 7.80769 3.38095C7.80769 2.06548 6.775 1 5.5 1C4.225 1 3.19231 2.06548 3.19231 3.38095C3.19231 4.69643 4.225 5.7619 5.5 5.7619ZM4.92885 6.87302C3.03462 6.87302 1.5 8.45635 1.5 10.4107C1.5 10.7361 1.75577 11 2.07115 11H8.92885C9.24423 11 9.5 10.7361 9.5 10.4107C9.5 8.45635 7.96538 6.87302 6.07115 6.87302H4.92885Z"
                fill="white"
              />
              <path
                d="M16.2807 12.1613C16.9541 12.1613 17.5 12.7072 17.5 13.3807C17.5 14.0541 16.9541 14.6 16.2807 14.6H7.71934C7.04592 14.6 6.5 14.0541 6.5 13.3807C6.5 12.7072 7.04592 12.1613 7.71934 12.1613H16.2807ZM12.0055 8C12.7756 8 13.3998 8.62424 13.3998 9.39429V17.6057C13.3998 18.3758 12.7756 19 12.0055 19C11.2355 19 10.6112 18.3758 10.6112 17.6057V9.39429C10.6112 8.62424 11.2355 8 12.0055 8Z"
                fill="white"
              />
            </svg>
            {registerMutation.isPending ? "Creating account..." : "Register"}
          </Button>
        </Field>
        <Field>
          <div className="flex flex-col sm:flex-row items-center justify-center space-x-1">
            <Typography className="text-sm! font-semibold text-dark-primary text-center">
              Already have an account?
            </Typography>
            <Button
              asChild
              size={"sm"}
              variant="link"
              className="ms-2 font-semibold underline"
            >
              <Link to="/login">Login</Link>
            </Button>
          </div>
        </Field>
      </CardFooter>
    </Card>
  );
}
