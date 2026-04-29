import api from "@/api/axios-client";
import type { Hospital } from "../hospital.types";
import { HOSPITAL_ENDPOINTS } from "@/api/endpoints/hospital.endpoints";
import type { ApiResponse } from "@/features/auth/auth.types";

/** Get all hospitals */
export const getHospitals = async (): Promise<Hospital[]> => {
    const { data } = await api.get<ApiResponse<Hospital[]>>(HOSPITAL_ENDPOINTS.LIST);

    if (!data.isSuccess) throw new Error(data.message || `Failed to fetch ${HOSPITAL_ENDPOINTS.LIST}`);

    return data.data;
}

/** Get a specific hospital by id */
export const getHospital = async (id: number): Promise<Hospital> => {
    const { data } = await api.get<ApiResponse<Hospital>>(HOSPITAL_ENDPOINTS.GET_BY_ID(id));

    if (!data.isSuccess) throw new Error(data.message || `Failed to fetch ${HOSPITAL_ENDPOINTS.GET_BY_ID(id)}`);

    return data.data;
}