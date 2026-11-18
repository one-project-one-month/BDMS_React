import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, KeyRound, Loader2, Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import { getRolesQueryOptions } from "@/features/roles/queries/roleQueries";
import { roleKeys } from "@/features/roles/queries";
import {
  permissionsQueryOptions,
  rolePermissionsQueryOptions,
  rolePermissionKeys,
} from "@/features/roles/queries/rolePermissionQueries";
import { createRole, updateRole, deleteRole } from "@/features/roles/api/role.api";
import type { Role } from "@/features/roles/role.types";
import type { Permission } from "@/features/roles/permission.types";

const roleSchema = z.object({
  name: z.string().min(2, "Role name must be at least 2 characters").max(50),
});
type RoleForm = z.infer<typeof roleSchema>;

const getCategory = (name: string): string => {
  if (name.startsWith("users.")) return "Users";
  if (name.startsWith("donors.")) return "Donors";
  if (name.startsWith("hospitals.")) return "Hospitals";
  if (name.startsWith("blood_requests.")) return "Blood Requests";
  if (name.startsWith("donations.")) return "Donations";
  if (name.startsWith("appointments.")) return "Appointments";
  if (name.startsWith("medical_records.")) return "Medical Records";
  if (name.startsWith("blood_inventories.")) return "Blood Inventories";
  if (name.startsWith("announcements.")) return "Announcements";
  if (name.startsWith("certificates.")) return "Certificates";
  if (name.startsWith("roles.") || name.startsWith("permissions.")) return "Security";
  return "Other";
};

export default function SecurityRolesPage() {
  const queryClient = useQueryClient();
  const { data: roles, isPending: loadingRoles } = useQuery(getRolesQueryOptions);
  const { data: permissions, isPending: loadingPerms } = useQuery(permissionsQueryOptions);
  const { data: mappings } = useQuery(rolePermissionsQueryOptions);
  const safeRoles = roles ?? [];

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Role | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null);

  const [createSelectedPermissionIds, setCreateSelectedPermissionIds] = useState<number[]>([]);
  const [createPermissionSearch, setCreatePermissionSearch] = useState("");

  const [editSelectedPermissionIds, setEditSelectedPermissionIds] = useState<number[]>([]);
  const [editPermissionSearch, setEditPermissionSearch] = useState("");

  const createForm = useForm<RoleForm>({
    resolver: zodResolver(roleSchema),
    defaultValues: { name: "" },
  });

  const editForm = useForm<RoleForm>({
    resolver: zodResolver(roleSchema),
    defaultValues: { name: "" },
  });

  const createMutation = useMutation({
    mutationFn: createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.list() });
      queryClient.invalidateQueries({ queryKey: rolePermissionKeys.all });
      queryClient.invalidateQueries({ queryKey: rolePermissionKeys.mappingsList() });
      toast.success("Role created successfully.", { position: "bottom-right" });
      setCreateOpen(false);
      createForm.reset();
      setCreateSelectedPermissionIds([]);
      setCreatePermissionSearch("");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to create role.", { position: "bottom-right" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.list() });
      queryClient.invalidateQueries({ queryKey: rolePermissionKeys.all });
      queryClient.invalidateQueries({ queryKey: rolePermissionKeys.mappingsList() });
      toast.success("Role updated successfully.", { position: "bottom-right" });
      setEditTarget(null);
      editForm.reset();
      setEditSelectedPermissionIds([]);
      setEditPermissionSearch("");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update role.", { position: "bottom-right" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.list() });
      queryClient.invalidateQueries({ queryKey: rolePermissionKeys.all });
      queryClient.invalidateQueries({ queryKey: rolePermissionKeys.mappingsList() });
      toast.success("Role deleted.", { position: "bottom-right" });
      setDeleteTarget(null);
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete role.", { position: "bottom-right" });
      setDeleteTarget(null);
    },
  });

  const handleOpenEdit = (role: Role) => {
    setEditTarget(role);
    editForm.reset({ name: role.name });
    const currentPerms = mappings?.filter((m) => m.roleId === role.id).map((m) => m.permissionId) ?? [];
    setEditSelectedPermissionIds(currentPerms);
    setEditPermissionSearch("");
  };

  const onCreateSubmit = (values: RoleForm) => {
    createMutation.mutate({
      name: values.name,
      permissionIds: createSelectedPermissionIds,
    });
  };

  const onEditSubmit = (values: RoleForm) => {
    if (!editTarget) return;
    updateMutation.mutate({
      id: editTarget.id,
      name: values.name,
      permissionIds: editSelectedPermissionIds,
    });
  };

  // Create toggles
  const handleToggleCreatePermission = (id: number) => {
    setCreateSelectedPermissionIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleToggleCreateCategory = (catPerms: Permission[]) => {
    const catIds = catPerms.map((p) => p.id);
    const allSelected = catIds.every((id) => createSelectedPermissionIds.includes(id));
    if (allSelected) {
      setCreateSelectedPermissionIds((prev) => prev.filter((id) => !catIds.includes(id)));
    } else {
      setCreateSelectedPermissionIds((prev) => Array.from(new Set([...prev, ...catIds])));
    }
  };

  // Edit toggles
  const handleToggleEditPermission = (id: number) => {
    setEditSelectedPermissionIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleToggleEditCategory = (catPerms: Permission[]) => {
    const catIds = catPerms.map((p) => p.id);
    const allSelected = catIds.every((id) => editSelectedPermissionIds.includes(id));
    if (allSelected) {
      setEditSelectedPermissionIds((prev) => prev.filter((id) => !catIds.includes(id)));
    } else {
      setEditSelectedPermissionIds((prev) => Array.from(new Set([...prev, ...catIds])));
    }
  };

  // Group filtered permissions for Create
  const filteredCreateCategories = useMemo(() => {
    if (!permissions) return [];
    const term = createPermissionSearch.trim().toLowerCase();
    const matched = term
      ? permissions.filter((p) => p.name.toLowerCase().includes(term))
      : permissions;

    const map = new Map<string, Permission[]>();
    for (const perm of matched) {
      const cat = getCategory(perm.name);
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(perm);
    }
    return Array.from(map.entries());
  }, [permissions, createPermissionSearch]);

  // Group filtered permissions for Edit
  const filteredEditCategories = useMemo(() => {
    if (!permissions) return [];
    const term = editPermissionSearch.trim().toLowerCase();
    const matched = term
      ? permissions.filter((p) => p.name.toLowerCase().includes(term))
      : permissions;

    const map = new Map<string, Permission[]>();
    for (const perm of matched) {
      const cat = getCategory(perm.name);
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(perm);
    }
    return Array.from(map.entries());
  }, [permissions, editPermissionSearch]);

  const PROTECTED_ROLES = ["admin", "staff", "user"];

  return (
    <Card className="px-4 sm:px-6 md:px-8 py-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <Typography as="h2" variant="subtitle">Roles</Typography>
          <p className="text-sm text-muted-foreground mt-0.5">
            Define system roles and configure their assigned capabilities.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="w-full sm:w-auto gap-2">
          <Plus className="size-4" /> New Role
        </Button>
      </header>

      {loadingRoles ? (
        <div className="flex items-center justify-center h-32 text-muted-foreground gap-2">
          <Loader2 className="size-5 animate-spin" />
          <span>Loading roles...</span>
        </div>
      ) : (
        <div className="grid gap-3">
          {safeRoles.map((role) => {
            const rolePermCount = mappings?.filter((m) => m.roleId === role.id).length ?? 0;
            return (
              <div
                key={role.id}
                className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <KeyRound className="size-4 text-primary" />
                  </div>
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="font-semibold capitalize text-foreground">{role.name}</span>
                    {PROTECTED_ROLES.includes(role.name) && (
                      <Badge variant="outline" className="text-xs">System</Badge>
                    )}
                    <Badge variant="secondary" className="text-xs font-normal">
                      {rolePermCount} {rolePermCount === 1 ? "permission" : "permissions"}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground hover:text-foreground"
                    onClick={() => handleOpenEdit(role)}
                    title="Edit role & permissions"
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    disabled={PROTECTED_ROLES.includes(role.name)}
                    onClick={() => setDeleteTarget(role)}
                    title={PROTECTED_ROLES.includes(role.name) ? "System roles cannot be deleted" : "Delete role"}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            );
          })}
          {safeRoles.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No roles found.</p>
          )}
        </div>
      )}

      {/* Create Role Dialog */}
      <Dialog
        open={createOpen}
        onOpenChange={(open) => {
          setCreateOpen(open);
          if (!open) {
            createForm.reset();
            setCreateSelectedPermissionIds([]);
            setCreatePermissionSearch("");
          }
        }}
      >
        <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-6">
          <DialogHeader>
            <DialogTitle>Create New Role</DialogTitle>
            <DialogDescription>
              Enter a unique name for the new role and select its assigned permissions.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="flex flex-col flex-1 min-h-0 space-y-4">
            <div className="space-y-1.5 shrink-0">
              <Label htmlFor="create-role-name">Role Name</Label>
              <Input
                id="create-role-name"
                placeholder="e.g. moderator"
                {...createForm.register("name")}
              />
              {createForm.formState.errors.name && (
                <p className="text-xs text-destructive">{createForm.formState.errors.name.message}</p>
              )}
            </div>

            {/* Permissions Selection */}
            <div className="flex flex-col flex-1 min-h-0 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-semibold">Assign Permissions</Label>
                  <span className="text-xs text-muted-foreground font-medium">
                    ({createSelectedPermissionIds.length} of {permissions?.length ?? 0} selected)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs px-2"
                    onClick={() => permissions && setCreateSelectedPermissionIds(permissions.map((p) => p.id))}
                  >
                    Select All
                  </Button>
                  <span className="text-muted-foreground">|</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs px-2"
                    onClick={() => setCreateSelectedPermissionIds([])}
                  >
                    Clear All
                  </Button>
                </div>
              </div>

              {/* Permission search filter */}
              <div className="relative shrink-0">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Filter permissions..."
                  value={createPermissionSearch}
                  onChange={(e) => setCreatePermissionSearch(e.target.value)}
                  className="pl-8 h-9 text-xs"
                />
              </div>

              {/* Categorized Permission Checkbox List */}
              <div className="flex-1 min-h-[180px] max-h-[300px] overflow-y-auto border border-border rounded-lg p-3 space-y-4 bg-muted/10">
                {loadingPerms ? (
                  <div className="flex items-center justify-center h-28 text-muted-foreground gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    <span className="text-xs">Loading permissions...</span>
                  </div>
                ) : filteredCreateCategories.length === 0 ? (
                  <p className="text-center text-xs text-muted-foreground py-6">
                    No permissions match your filter.
                  </p>
                ) : (
                  filteredCreateCategories.map(([category, perms]) => {
                    const allCatSelected = perms.every((p) => createSelectedPermissionIds.includes(p.id));
                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex items-center justify-between pb-1 border-b border-border/60">
                          <span className="text-xs font-bold text-foreground tracking-wide uppercase">
                            {category}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleToggleCreateCategory(perms)}
                            className="text-[11px] text-primary hover:underline font-medium"
                          >
                            {allCatSelected ? "Deselect category" : "Select category"}
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {perms.map((p) => {
                            const isChecked = createSelectedPermissionIds.includes(p.id);
                            return (
                              <label
                                key={p.id}
                                className={cn(
                                  "flex items-center gap-2.5 p-2 rounded-md border text-xs cursor-pointer transition-colors",
                                  isChecked
                                    ? "border-primary/40 bg-primary/5 text-foreground font-medium"
                                    : "border-border/70 hover:bg-muted/40 text-muted-foreground"
                                )}
                              >
                                <Checkbox
                                  checked={isChecked}
                                  onCheckedChange={() => handleToggleCreatePermission(p.id)}
                                />
                                <span className="truncate" title={p.name}>
                                  {p.name}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <DialogFooter className="shrink-0 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setCreateOpen(false);
                  createForm.reset();
                  setCreateSelectedPermissionIds([]);
                  setCreatePermissionSearch("");
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? (
                  <><Loader2 className="size-4 mr-2 animate-spin" /> Creating...</>
                ) : "Create Role"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog
        open={!!editTarget}
        onOpenChange={(open) => {
          if (!open) {
            setEditTarget(null);
            editForm.reset();
            setEditSelectedPermissionIds([]);
            setEditPermissionSearch("");
          }
        }}
      >
        <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-6">
          <DialogHeader>
            <DialogTitle>Edit Role: <span className="capitalize">{editTarget?.name}</span></DialogTitle>
            <DialogDescription>
              Configure the role name and adjust its assigned permissions.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="flex flex-col flex-1 min-h-0 space-y-4">
            <div className="space-y-1.5 shrink-0">
              <Label htmlFor="edit-role-name">Role Name</Label>
              <Input
                id="edit-role-name"
                disabled={editTarget ? PROTECTED_ROLES.includes(editTarget.name) : false}
                {...editForm.register("name")}
              />
              {editTarget && PROTECTED_ROLES.includes(editTarget.name) && (
                <p className="text-xs text-muted-foreground">System role names cannot be renamed, but their permissions can be configured.</p>
              )}
              {editForm.formState.errors.name && (
                <p className="text-xs text-destructive">{editForm.formState.errors.name.message}</p>
              )}
            </div>

            {/* Permissions Selection */}
            <div className="flex flex-col flex-1 min-h-0 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
                <div className="flex items-center gap-2">
                  <Label className="text-sm font-semibold">Assigned Permissions</Label>
                  <span className="text-xs text-muted-foreground font-medium">
                    ({editSelectedPermissionIds.length} of {permissions?.length ?? 0} selected)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs px-2"
                    onClick={() => permissions && setEditSelectedPermissionIds(permissions.map((p) => p.id))}
                  >
                    Select All
                  </Button>
                  <span className="text-muted-foreground">|</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs px-2"
                    onClick={() => setEditSelectedPermissionIds([])}
                  >
                    Clear All
                  </Button>
                </div>
              </div>

              {/* Permission search filter */}
              <div className="relative shrink-0">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Filter permissions..."
                  value={editPermissionSearch}
                  onChange={(e) => setEditPermissionSearch(e.target.value)}
                  className="pl-8 h-9 text-xs"
                />
              </div>

              {/* Categorized Permission Checkbox List */}
              <div className="flex-1 min-h-[180px] max-h-[300px] overflow-y-auto border border-border rounded-lg p-3 space-y-4 bg-muted/10">
                {loadingPerms ? (
                  <div className="flex items-center justify-center h-28 text-muted-foreground gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    <span className="text-xs">Loading permissions...</span>
                  </div>
                ) : filteredEditCategories.length === 0 ? (
                  <p className="text-center text-xs text-muted-foreground py-6">
                    No permissions match your filter.
                  </p>
                ) : (
                  filteredEditCategories.map(([category, perms]) => {
                    const allCatSelected = perms.every((p) => editSelectedPermissionIds.includes(p.id));
                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex items-center justify-between pb-1 border-b border-border/60">
                          <span className="text-xs font-bold text-foreground tracking-wide uppercase">
                            {category}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleToggleEditCategory(perms)}
                            className="text-[11px] text-primary hover:underline font-medium"
                          >
                            {allCatSelected ? "Deselect category" : "Select category"}
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {perms.map((p) => {
                            const isChecked = editSelectedPermissionIds.includes(p.id);
                            return (
                              <label
                                key={p.id}
                                className={cn(
                                  "flex items-center gap-2.5 p-2 rounded-md border text-xs cursor-pointer transition-colors",
                                  isChecked
                                    ? "border-primary/40 bg-primary/5 text-foreground font-medium"
                                    : "border-border/70 hover:bg-muted/40 text-muted-foreground"
                                )}
                              >
                                <Checkbox
                                  checked={isChecked}
                                  onCheckedChange={() => handleToggleEditPermission(p.id)}
                                />
                                <span className="truncate" title={p.name}>
                                  {p.name}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <DialogFooter className="shrink-0 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditTarget(null);
                  editForm.reset();
                  setEditSelectedPermissionIds([]);
                  setEditPermissionSearch("");
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? (
                  <><Loader2 className="size-4 mr-2 animate-spin" /> Saving...</>
                ) : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Role</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the <span className="font-medium capitalize">{deleteTarget?.name}</span> role?
              This will remove all permission assignments for this role.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
