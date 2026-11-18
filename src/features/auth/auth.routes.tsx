import { Navigate, type RouteObject } from "react-router-dom";
import AuthLayout from "@/layouts/auth-layout";
import LoginPage from "./pages/login-page";
import RegisterPage from "./pages/register-page";

export const authRoutes: RouteObject = {
  element: <AuthLayout />,
  children: [
    {
      path: "login",
      element: <LoginPage />,
    },
    {
      path: "admin/login",
      element: <Navigate to="/login" replace />,
    },
    {
      path: "register",
      element: <RegisterPage />,
    },
  ],
};
