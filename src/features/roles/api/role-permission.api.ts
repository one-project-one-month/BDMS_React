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

/** Create a new permission */
export const createPermission = async (payload: { name: string }): Promise<Permission> => {
  const { data } = await api.post<ApiResponse<Permission>>(PERMISSION_ENDPOINTS.CREATE, payload);
  if (!data.isSuccess) {
    throw new Error(data.message || "Failed to create permission");
  }
  return data.data;
};

/** Update an existing permission */
export const updatePermission = async (payload: { id: number; name: string }): Promise<Permission> => {
  const { data } = await api.put<ApiResponse<Permission>>(PERMISSION_ENDPOINTS.UPDATE, payload);
  if (!data.isSuccess) {
    throw new Error(data.message || "Failed to update permission");
  }
  return data.data;
};

/** Delete a permission by id */
export const deletePermission = async (id: number): Promise<boolean> => {
  const { data } = await api.delete<ApiResponse<boolean>>(PERMISSION_ENDPOINTS.DELETE, {
    data: { id },
  });
  if (!data.isSuccess) {
    throw new Error(data.message || "Failed to delete permission");
  }
  return true;
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
