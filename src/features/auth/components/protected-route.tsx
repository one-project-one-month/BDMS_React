import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "@/context/auth/useAuth";
import type { Role } from "@/features/auth/auth.types";

interface ProtectedRouteProps {
  allowed: Role[];
  children: ReactNode;
}

export default function ProtectedRoute({
  allowed,
  children,
}: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    const requiresAdmin =
      allowed.includes("admin") || allowed.includes("staff");
    const loginPath = requiresAdmin ? "/admin/login" : "/login";
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (user?.roleName && !allowed.includes(user.roleName)) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return children;
}
