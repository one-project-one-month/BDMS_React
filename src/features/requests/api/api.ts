import api from "@/api/axios-client";
import type { ApiResponse, Hospital } from "../requests.types";

export const getHospitals = async (): Promise<Hospital[]> => {
  const { data } = await api.get<ApiResponse<Hospital[]>>("/Hospital/list");

  if (!data.isSuccess || data.isError) {
    throw new Error(data.message || "Failed to fetch hospitals");
  }

  return data.data;
};
