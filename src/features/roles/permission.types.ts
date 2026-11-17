export interface Permission {
  id: number;
  name: string;
}

export interface RolePermission {
  roleId: number;
  permissionId: number;
}

export interface RolePermissionPayload {
  roleId: number;
  permissionId: number;
}
