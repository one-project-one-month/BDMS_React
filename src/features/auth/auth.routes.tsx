import type { RouteObject } from "react-router-dom";
import AuthLayout from "@/layouts/auth-layout";
import LoginPage from "./pages/login-page";
import RegisterPage from "./pages/register-page";

export const authRoutes: RouteObject = {
  element: <AuthLayout />,
  children: [
    {
      path: "login",
      element: <LoginPage mode="user" />,
    },
    {
      path: "admin/login",
      element: <LoginPage mode="admin" />,
    },
    {
      path: "register",
      element: <RegisterPage />,
    },
  ],
};
