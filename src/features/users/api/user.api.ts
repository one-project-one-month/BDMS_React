/** @author Khant Loon Thu */

import api from "@/api/axios-client";
import type { ApiResponse } from "@/features/auth/auth.types";
import type { StoreUserPayload, UpdateUserPayload, User } from "../user.types";
import { USER_ENDPOINTS } from "@/api/endpoints/user.endpoints";

/** Get all users */
export const getUsers = async (): Promise<User[]> => {
    const { data } = await api.get<ApiResponse<User[]>>(USER_ENDPOINTS.LIST);

    if (!data.isSuccess) throw new Error(data.message || `Failed to fetch ${USER_ENDPOINTS.LIST}`);

    return data.data;
}

/** Get a specific user */
export const getUser = async (id: number): Promise<User> => {
    const { data } = await api.get<ApiResponse<User>>(USER_ENDPOINTS.GET_BY_ID(id));

    if (!data.isSuccess) throw new Error(data.message || `Failed to fetch ${USER_ENDPOINTS.GET_BY_ID(id)}`);

    return data.data;
}

/** Store a user record */
export const storeUser = async (payload: StoreUserPayload): Promise<User> => {
    const { data } = await api.post<ApiResponse<User>>(USER_ENDPOINTS.CREATE, payload);

    if (!data.isSuccess) throw new Error(data.message || `Failed to store ${USER_ENDPOINTS.CREATE}`);

    return data.data;
}

/** Update a specific user */
export const updateUser = async (payload: UpdateUserPayload): Promise<User> => {
    const { data } = await api.put<ApiResponse<User>>(USER_ENDPOINTS.UPDATE, payload);

    if (!data.isSuccess) throw new Error(data.message || `Failed to update ${USER_ENDPOINTS.UPDATE}`);

    return data.data;
}

/** Delete a specific user */
export const deleteUser = async (userId: number): Promise<boolean> => {
    const { data } = await api.delete<ApiResponse<null>>(
        USER_ENDPOINTS.DELETE(userId),
    );

    if (!data.isSuccess) throw new Error(data.message || `Failed to delete ${USER_ENDPOINTS.DELETE(userId)}`);

    return true;
}

/** Update a specific user's status (isActive) */
const updateUserStatus = async (id: number, isActive: boolean): Promise<User> => {
    const { data } = await api.patch<ApiResponse<User>>(USER_ENDPOINTS.UPDATE_STATUS(id), { isActive });

    if (!data.isSuccess) throw new Error(data.message || `Failed to update status for user ${USER_ENDPOINTS.UPDATE_STATUS(id)}`);

    return data.data;
}

/** Activate a specific user */
export const activateUser = (id: number) =>
    updateUserStatus(id, true);

/** Deactivate a specific user */
export const deactivateUser = (id: number) =>
    updateUserStatus(id, false);