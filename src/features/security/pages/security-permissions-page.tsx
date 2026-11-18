import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, Lock, Loader2, Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
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

import {
  permissionsQueryOptions,
  rolePermissionsQueryOptions,
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,
} from "@/features/roles/queries/rolePermissionQueries";
import type { Permission } from "@/features/roles/permission.types";

const permissionSchema = z.object({
  name: z
    .string()
    .min(3, "Permission name must be at least 3 characters")
    .max(100)
    .regex(/^[a-z0-9_-]+\.[a-z0-9_-]+$/, "Use format: module.action (e.g. donations.create)"),
});
type PermissionForm = z.infer<typeof permissionSchema>;

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

export default function SecurityPermissionsPage() {
  const { data: permissions, isPending: loadingPerms } = useQuery(permissionsQueryOptions);
  const { data: mappings } = useQuery(rolePermissionsQueryOptions);
  const safePermissions = permissions ?? [];

  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Permission | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Permission | null>(null);

  const createForm = useForm<PermissionForm>({
    resolver: zodResolver(permissionSchema),
    defaultValues: { name: "" },
  });

  const editForm = useForm<PermissionForm>({
    resolver: zodResolver(permissionSchema),
    defaultValues: { name: "" },
  });

  const createMutation = useCreatePermissionMutation();
  const updateMutation = useUpdatePermissionMutation();
  const deleteMutation = useDeletePermissionMutation();

  const onCreateSubmit = (values: PermissionForm) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        toast.success("Permission created successfully.", { position: "bottom-right" });
        setCreateOpen(false);
        createForm.reset();
      },
      onError: (err: Error) => {
        toast.error(err.message || "Failed to create permission.", { position: "bottom-right" });
      },
    });
  };

  const onEditSubmit = (values: PermissionForm) => {
    if (!editTarget) return;
    updateMutation.mutate(
      { id: editTarget.id, name: values.name },
      {
        onSuccess: () => {
          toast.success("Permission updated successfully.", { position: "bottom-right" });
          setEditTarget(null);
          editForm.reset();
        },
        onError: (err: Error) => {
          toast.error(err.message || "Failed to update permission.", { position: "bottom-right" });
        },
      }
    );
  };

  const onDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success("Permission deleted.", { position: "bottom-right" });
        setDeleteTarget(null);
      },
      onError: (err: Error) => {
        toast.error(err.message || "Failed to delete permission.", { position: "bottom-right" });
      },
    });
  };

  const categories = useMemo(() => {
    const set = new Set<string>();
    safePermissions.forEach((p) => set.add(getCategory(p.name)));
    return Array.from(set).sort();
  }, [safePermissions]);

  const filteredPermissions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return safePermissions.filter((p) => {
      const matchesSearch = term ? p.name.toLowerCase().includes(term) : true;
      const matchesCategory =
        activeCategory === "all" ? true : getCategory(p.name) === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [safePermissions, searchTerm, activeCategory]);

  return (
    <Card className="px-4 sm:px-6 md:px-8 py-6 space-y-6">
      {/* Page Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Typography as="h2" variant="subtitle">Permissions</Typography>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage granular capabilities and access control tags for system roles.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="w-full sm:w-auto gap-2">
          <Plus className="size-4" /> New Permission
        </Button>
      </header>

      {/* Search Input Bar */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search permissions by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 h-10 w-full"
        />
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 flex-wrap text-xs">
        <button
          type="button"
          onClick={() => setActiveCategory("all")}
          className={cn(
            "px-3 py-1.5 rounded-full font-medium transition-colors shrink-0",
            activeCategory === "all"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "bg-muted/60 text-muted-foreground hover:bg-muted"
          )}
        >
          All ({safePermissions.length})
        </button>
        {categories.map((cat) => {
          const count = safePermissions.filter((p) => getCategory(p.name) === cat).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-3 py-1.5 rounded-full font-medium transition-colors shrink-0",
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted"
                )}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

      {/* Permissions List */}
      {loadingPerms ? (
        <div className="flex items-center justify-center h-40 text-muted-foreground gap-2">
          <Loader2 className="size-5 animate-spin" />
          <span>Loading permissions...</span>
        </div>
      ) : filteredPermissions.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No permissions found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPermissions.map((perm) => {
            const cat = getCategory(perm.name);
            const roleCount = mappings?.filter((m) => m.permissionId === perm.id).length ?? 0;
            return (
              <div
                key={perm.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-card hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                    <Lock className="size-4 text-primary" />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <p className="text-sm font-semibold text-foreground truncate" title={perm.name}>
                      {perm.name}
                    </p>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Badge variant="outline" className="text-[10px] py-0 px-1.5">
                        {cat}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground font-normal">
                        {roleCount} {roleCount === 1 ? "role" : "roles"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      setEditTarget(perm);
                      editForm.reset({ name: perm.name });
                    }}
                    title="Edit permission"
                  >
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setDeleteTarget(perm)}
                    title="Delete permission"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Permission Dialog */}
      <Dialog
        open={createOpen}
        onOpenChange={(open) => {
          setCreateOpen(open);
          if (!open) createForm.reset();
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Permission</DialogTitle>
            <DialogDescription>
              Enter a unique identifier following the <code className="text-xs font-semibold">module.action</code> convention.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="create-perm-name">Permission Name</Label>
              <Input
                id="create-perm-name"
                placeholder="e.g. inventory.export"
                {...createForm.register("name")}
              />
              {createForm.formState.errors.name && (
                <p className="text-xs text-destructive">{createForm.formState.errors.name.message}</p>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setCreateOpen(false);
                  createForm.reset();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? (
                  <><Loader2 className="size-4 mr-2 animate-spin" /> Creating...</>
                ) : (
                  "Create Permission"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Permission Dialog */}
      <Dialog
        open={!!editTarget}
        onOpenChange={(open) => {
          if (!open) {
            setEditTarget(null);
            editForm.reset();
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Permission</DialogTitle>
            <DialogDescription>
              Update the name identifier for this permission.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="edit-perm-name">Permission Name</Label>
              <Input
                id="edit-perm-name"
                {...editForm.register("name")}
              />
              {editForm.formState.errors.name && (
                <p className="text-xs text-destructive">{editForm.formState.errors.name.message}</p>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditTarget(null);
                  editForm.reset();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? (
                  <><Loader2 className="size-4 mr-2 animate-spin" /> Saving...</>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Permission</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete permission <span className="font-semibold text-foreground">{deleteTarget?.name}</span>?
            </DialogDescription>
          </DialogHeader>
          {deleteTarget && (mappings?.filter((m) => m.permissionId === deleteTarget.id).length ?? 0) > 0 && (
            <div className="rounded-lg bg-destructive/10 p-3 text-xs text-destructive">
              Warning: This permission is currently assigned to system roles. Deleting it may fail or revoke access.
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={onDeleteConfirm}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Permission"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
