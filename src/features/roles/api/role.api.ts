/** @author Khant Loon Thu */

import api from "@/api/axios-client";
import type { ApiResponse } from "@/features/auth/auth.types";
import type { Role } from "../role.types";
import { ROLE_ENDPOINTS } from "@/api/endpoints/role.endpoints";

/** Get all roles */
export const getRoles = async (): Promise<Role[]> => {
    const { data } = await api.get<ApiResponse<Role[]>>(ROLE_ENDPOINTS.LIST);

    if (!data.isSuccess) throw new Error(data.message || `Failed to fetch ${ROLE_ENDPOINTS.LIST}`);

    return data.data;
}