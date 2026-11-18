/** @author Khant Loon Thu */

import api from "@/api/axios-client";
import type { ApiResponse } from "@/features/auth/auth.types";
import type { Role } from "../role.types";
import { ROLE_ENDPOINTS } from "@/api/endpoints/role.endpoints";
import { createRolePermission, deleteRolePermission, getRolePermissions } from "./role-permission.api";

export interface CreateRolePayload {
    name: string;
    permissionIds?: number[];
}

export interface UpdateRolePayload {
    id: number;
    name: string;
    permissionIds?: number[];
}

/** Get all roles */
export const getRoles = async (): Promise<Role[]> => {
    const { data } = await api.get<ApiResponse<Role[]>>(ROLE_ENDPOINTS.LIST);
    if (!data.isSuccess) throw new Error(data.message || `Failed to fetch ${ROLE_ENDPOINTS.LIST}`);
    return data.data;
};

/** Create a new role with optional permission assignment */
export const createRole = async (payload: CreateRolePayload): Promise<Role> => {
    const { data } = await api.post<ApiResponse<Role>>(ROLE_ENDPOINTS.CREATE, payload);
    if (!data.isSuccess) throw new Error(data.message || "Failed to create role");
    const createdRole = data.data;

    // Ensure permissions are assigned if permissionIds were passed
    if (payload.permissionIds && payload.permissionIds.length > 0 && createdRole?.id) {
        try {
            const existingMappings = await getRolePermissions();
            const existingIds = new Set(
                existingMappings
                    .filter((m) => m.roleId === createdRole.id)
                    .map((m) => m.permissionId)
            );
            const toAssign = payload.permissionIds.filter((id) => !existingIds.has(id));
            if (toAssign.length > 0) {
                await Promise.all(
                    toAssign.map((permissionId) =>
                        createRolePermission({ roleId: createdRole.id, permissionId })
                    )
                );
            }
        } catch (error) {
            console.warn("Failed to assign initial permissions to role:", error);
        }
    }

    return createdRole;
};

/** Update a role and sync its assigned permissions */
export const updateRole = async (payload: UpdateRolePayload): Promise<Role> => {
    const { data } = await api.put<ApiResponse<Role>>(ROLE_ENDPOINTS.UPDATE, payload);
    if (!data.isSuccess) throw new Error(data.message || "Failed to update role");
    const updatedRole = data.data;

    // Resilient fallback in case backend wasn't rebuilt yet: sync permissions via role-permission API
    if (payload.permissionIds !== undefined) {
        try {
            const allMappings = await getRolePermissions();
            const currentRolePermIds = new Set(
                allMappings.filter((m) => m.roleId === payload.id).map((m) => m.permissionId)
            );
            const targetPermIds = new Set(payload.permissionIds);

            // Add newly selected permissions
            const toAdd = payload.permissionIds.filter((pid) => !currentRolePermIds.has(pid));
            // Remove unselected permissions
            const toRemove = Array.from(currentRolePermIds).filter((pid) => !targetPermIds.has(pid));

            await Promise.all([
                ...toAdd.map((permissionId) => createRolePermission({ roleId: payload.id, permissionId })),
                ...toRemove.map((permissionId) => deleteRolePermission({ roleId: payload.id, permissionId })),
            ]);
        } catch (error) {
            console.warn("Failed to sync permissions for role:", error);
        }
    }

    return updatedRole;
};

/** Delete a role by id */
export const deleteRole = async (id: number): Promise<boolean> => {
    const { data } = await api.delete<ApiResponse<boolean>>(ROLE_ENDPOINTS.DELETE, {
        data: { id },
    });
    if (!data.isSuccess) throw new Error(data.message || "Failed to delete role");
    return true;
};
