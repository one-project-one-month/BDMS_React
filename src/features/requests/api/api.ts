import api from "@/api/axios-client";
import type { ApiResponse, Hospital } from "../requests.types";
import { HOSPITAL_ENDPOINTS } from "@/api/endpoints/hospital.endpoint";

export const getHospitals = async (): Promise<Hospital[]> => {
  const { data } = await api.get<ApiResponse<Hospital[]>>(
    HOSPITAL_ENDPOINTS.LIST,
  );

  if (!data.isSuccess || data.isError) {
    throw new Error(data.message || "Failed to fetch hospitals");
  }

  return data.data;
};
