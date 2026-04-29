import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as z from "zod";
import { isAxiosError } from "axios";

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
import { Checkbox } from "@/components/ui/checkbox";
import useAuth from "@/context/auth/useAuth";

const formSchema = z.object({
  email: z
    .email("Please enter a valid email address.")
    .min(5, "Email must be at least 5 characters."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  rememberMe: z.boolean().optional(),
});

type LoginFormProps = {
  mode: "admin" | "user";
};

export default function LoginForm({ mode }: LoginFormProps) {
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });
  const navigate = useNavigate();
  const location = useLocation();

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);

      const session = await login({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe ?? false,
        mode,
        /**
         * * NOTE: backend ဆရာသမားများက Auth အတွက် api နှစ်ခု ထုတ်ပေးလိုက်သည့်အတွက်
         * * admin auth နဲ့ user auth ဖြစ်စေရန် mode('user' | 'admin') သုံးထားပါသည်။
         */
      });

      form.reset();

      const roleDestination =
        session.userInfo.roleName === "admin" ||
        session.userInfo.roleName === "staff"
          ? "/admin"
          : "/client";

      const fromState = location.state as { from?: Location } | null;
      const returnTo = fromState?.from?.pathname
        ? `${fromState.from.pathname}${fromState.from.search ?? ""}`
        : null;

      navigate(returnTo ?? roleDestination);
    } catch (error) {
      console.error(error);
      const message = isAxiosError(error)
        ? ((error.response?.data as { message?: string })?.message ??
          "Invalid email or password")
        : "Invalid email or password";
      form.setError("root", { message });
    } finally {
      setIsSubmitting(false);
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
            Log In
          </Typography>
        </CardTitle>
        <CardDescription>
          <Typography
            as={"p"}
            variant={"body"}
            className="text-sm! font-semibold text-dark-primary text-center"
          >
            You can sign in to your account to manage your Bloodlife donation.
          </Typography>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            {/* Email */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="login-form-email"
                    className="text-dark-primary"
                  >
                    Email
                  </FieldLabel>
                  <Input
                    {...field}
                    id="login-form-email"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your email"
                    autoComplete="email"
                    type="email"
                    className="bg-input"
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
                    htmlFor="login-form-password"
                    className="text-dark-primary"
                  >
                    Password
                  </FieldLabel>
                  <Input
                    {...field}
                    id="login-form-password"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    type="password"
                    className="bg-input"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Remember Me */}
            <Controller
              name="rememberMe"
              control={form.control}
              render={({ field }) => (
                <Field orientation="horizontal" className="items-center">
                  <Checkbox
                    id="login-form-remember-me"
                    checked={field.value}
                    onCheckedChange={(checked) =>
                      field.onChange(Boolean(checked))
                    }
                    className="border-dark-primary"
                  />
                  <FieldLabel
                    className="cursor-pointer text-dark-primary"
                    htmlFor="login-form-remember-me"
                  >
                    Remember me
                  </FieldLabel>
                </Field>
              )}
            />
            {form.formState.errors.root && (
              <Field>
                <FieldError errors={[form.formState.errors.root]} />
              </Field>
            )}
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-y-6">
        <Field orientation="horizontal">
          <Button
            type="submit"
            form="login-form"
            className="w-full shadow flex items-center gap-2"
            disabled={isSubmitting}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="size-5"
              aria-hidden="true"
            >
              <path
                d="M13 5H15C15.5531 5 16 5.44688 16 6V14C16 14.5531 15.5531 15 15 15H13C12.4469 15 12 15.4469 12 16C12 16.5531 12.4469 17 13 17H15C16.6562 17 18 15.6562 18 14V6C18 4.34375 16.6562 3 15 3H13C12.4469 3 12 3.44687 12 4C12 4.55313 12.4469 5 13 5ZM12.7063 10.7063C13.0969 10.3156 13.0969 9.68125 12.7063 9.29062L8.70625 5.29063C8.31563 4.9 7.68125 4.9 7.29063 5.29063C6.9 5.68125 6.9 6.31563 7.29063 6.70625L9.58438 9H3C2.44687 9 2 9.44688 2 10C2 10.5531 2.44687 11 3 11H9.58438L7.29063 13.2937C6.9 13.6844 6.9 14.3188 7.29063 14.7094C7.68125 15.1 8.31563 15.1 8.70625 14.7094L12.7063 10.7094V10.7063Z"
                fill="white"
              />
            </svg>
            <span>{isSubmitting ? "Logging in..." : "Log In"}</span>
          </Button>
        </Field>
        <Field>
          <div className="flex flex-col sm:flex-row items-center justify-center space-x-1">
            <Typography className="text-sm! font-semibold text-dark-primary text-center">
              Don't have an account yet?
            </Typography>
            <Button
              asChild
              variant="link"
              size={"sm"}
              className="ms-2 font-semibold underline"
            >
              <Link to="/register">Register</Link>
            </Button>
          </div>
        </Field>
      </CardFooter>
    </Card>
  );
}
