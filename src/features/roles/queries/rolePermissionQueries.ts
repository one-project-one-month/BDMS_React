import { queryOptions, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPermissions,
  getRolePermissions,
  createRolePermission,
  deleteRolePermission,
} from "../api/role-permission.api";
import type { Permission, RolePermission, RolePermissionPayload } from "../permission.types";

export const rolePermissionKeys = {
  all: ["rolePermissions"] as const,
  permissionsList: () => [...rolePermissionKeys.all, "permissions"] as const,
  mappingsList: () => [...rolePermissionKeys.all, "mappings"] as const,
};

/**
 * Query options to fetch all granular permissions
 */
export const permissionsQueryOptions = queryOptions<Permission[]>({
  queryKey: rolePermissionKeys.permissionsList(),
  queryFn: getPermissions,
});

/**
 * Query options to fetch role-permission matrix mappings
 */
export const rolePermissionsQueryOptions = queryOptions<RolePermission[]>({
  queryKey: rolePermissionKeys.mappingsList(),
  queryFn: getRolePermissions,
});

/**
 * Mutation: Create a role-permission mapping
 */
export const useCreateRolePermissionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<RolePermission, Error, RolePermissionPayload>({
    mutationFn: createRolePermission,
    onSuccess: () => {
      // Invalidate the matrix list to refresh UI
      queryClient.invalidateQueries({ queryKey: rolePermissionKeys.mappingsList() });
    },
  });
};

/**
 * Mutation: Revoke a role-permission mapping
 */
export const useDeleteRolePermissionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, RolePermissionPayload>({
    mutationFn: deleteRolePermission,
    onSuccess: () => {
      // Invalidate the matrix list to refresh UI
      queryClient.invalidateQueries({ queryKey: rolePermissionKeys.mappingsList() });
    },
  });
};
