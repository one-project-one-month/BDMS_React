import api from "@/api/axios-client";
import type { AdminDashboardData } from "../admin-dashboard.types";

/** Get Admin Dashboard Analytics */
export const getAdminDashboardData = async (userId: number): Promise<AdminDashboardData> => {
  // The API directly returns the JSON dashboard string as Content with 200 OK or 400 Bad Request
  const { data } = await api.get<AdminDashboardData>(`/Dashboard/${userId}`);
  return data;
};
