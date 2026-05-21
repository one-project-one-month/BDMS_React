import { queryOptions } from "@tanstack/react-query";
import { getAdminDashboardData } from "../api/admin-dashboard.api";
import type { AdminDashboardData } from "../admin-dashboard.types";

export const adminDashboardKeys = {
  all: ["adminDashboard"] as const,
  detail: (userId: number) => [...adminDashboardKeys.all, userId] as const,
};

export const getAdminDashboardQueryOptions = (userId: number) =>
  queryOptions<AdminDashboardData>({
    queryKey: adminDashboardKeys.detail(userId),
    queryFn: () => getAdminDashboardData(userId),
    enabled: userId > 0,
  });
