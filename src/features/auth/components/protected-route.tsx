import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "@/context/auth/useAuth";
import type { Role } from "@/features/auth/auth.types";
import { DashboardSidebar } from "@/layouts/dashboard-sidebar";
import { DashboardTopNavbar } from "@/layouts/dashboard-nav";
import { Skeleton } from "@/components/ui/skeleton";

interface ProtectedRouteProps {
  allowed: Role[];
  children: ReactNode;
}

function DashboardInitSkeleton() {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar isOpen={false} onClose={() => {}} />

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopNavbar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="space-y-6">
            <Skeleton className="h-8 w-48" />
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-28 w-full" />
            </div>
            <Skeleton className="h-72 w-full" />
          </div>
        </main>
      </div>
    </div>
  );
}

export default function ProtectedRoute({
  allowed,
  children,
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isInitializing } = useAuth();
  const location = useLocation();

  if (isInitializing) {
    return <DashboardInitSkeleton />;
  }

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
