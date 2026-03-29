/** @author Khant Loon Thu */

import api from "@/api/axios-client";
import type { ApiResponse } from "@/features/auth/auth.types";
import type { Role } from "../role.types";
import { ROLE_ENDPOINTS } from "@/api/endpoints/role.endpoints";

/** Get all roles */
export const getRoles = async (): Promise<Role[] | null> => {
    try {
        const { data } = await api.get<ApiResponse<Role[]>>(ROLE_ENDPOINTS.LIST);
        if (!data.isSuccess || data.isError) {
            return null
        }
        return data.data;
    } catch (error) {
        console.warn(`Failed to fetch ${ROLE_ENDPOINTS.LIST}: ${error}`);
        return null;
    }
}