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
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role && !allowed.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
