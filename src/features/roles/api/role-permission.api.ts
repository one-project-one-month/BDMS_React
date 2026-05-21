import api from "@/api/axios-client";
import type { ApiResponse } from "@/features/auth/auth.types";
import { PERMISSION_ENDPOINTS } from "@/api/endpoints/permission.endpoints";
import { ROLE_PERMISSION_ENDPOINTS } from "@/api/endpoints/role-permission.endpoints";
import type { Permission, RolePermission, RolePermissionPayload } from "../permission.types";

/** Get all permissions */
export const getPermissions = async (): Promise<Permission[]> => {
  const { data } = await api.get<ApiResponse<Permission[]>>(PERMISSION_ENDPOINTS.LIST);
  if (!data.isSuccess) {
    throw new Error(data.message || `Failed to fetch permissions`);
  }
  return data.data;
};

/** Get role permission mappings */
export const getRolePermissions = async (): Promise<RolePermission[]> => {
  const { data } = await api.get<ApiResponse<RolePermission[]>>(ROLE_PERMISSION_ENDPOINTS.LIST);
  if (!data.isSuccess) {
    throw new Error(data.message || `Failed to fetch role permissions`);
  }
  return data.data;
};

/** Create role-permission mapping */
export const createRolePermission = async (payload: RolePermissionPayload): Promise<RolePermission> => {
  const { data } = await api.post<ApiResponse<RolePermission>>(ROLE_PERMISSION_ENDPOINTS.CREATE, payload);
  if (!data.isSuccess) {
    throw new Error(data.message || `Failed to create role permission mapping`);
  }
  return data.data;
};

/** Delete/Revoke role-permission mapping */
export const deleteRolePermission = async (payload: RolePermissionPayload): Promise<boolean> => {
  const { data } = await api.delete<ApiResponse<boolean>>(ROLE_PERMISSION_ENDPOINTS.DELETE, {
    data: payload,
  });
  if (!data.isSuccess) {
    throw new Error(data.message || `Failed to delete role permission mapping`);
  }
  return data.data;
};
