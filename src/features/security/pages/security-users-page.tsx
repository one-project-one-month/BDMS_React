import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import UserDataTable from "@/features/users/components/table/user-data-table";
import { buildColumns } from "@/features/users/components/table/user-columns";

import {
  activateUserMutationOptions,
  deactivateUserMutationOptions,
  deleteUserMutationOptions,
  getUsersQueryOptions,
} from "@/features/users/queries/userQueries";
import { userKeys } from "@/features/users/queries";
import type { User } from "@/features/users/user.types";

export default function SecurityUsersPage() {
  const queryClient = useQueryClient();
  const { data: users, isPending } = useQuery(getUsersQueryOptions);
  const safeUsers = users ?? [];

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const deleteMutation = useMutation({
    ...deleteUserMutationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.list() });
      toast.success("User deleted successfully.", { position: "bottom-right" });
      setDeleteOpen(false);
      setSelectedUser(null);
    },
  });

  const activateMutation = useMutation({
    ...activateUserMutationOptions,
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: userKeys.list() });
      toast.success(`${user.username} activated.`, { position: "bottom-right" });
      setStatusOpen(false);
      setSelectedUser(null);
    },
  });

  const deactivateMutation = useMutation({
    ...deactivateUserMutationOptions,
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: userKeys.list() });
      toast.success(`${user.username} deactivated.`, { position: "bottom-right" });
      setStatusOpen(false);
      setSelectedUser(null);
    },
  });

  const handleRequestDelete = (user: User) => { setSelectedUser(user); setDeleteOpen(true); };
  const handleRequestStatus = (user: User) => { setSelectedUser(user); setStatusOpen(true); };

  const handleConfirmDelete = () => {
    if (!selectedUser || deleteMutation.isPending) return;
    if (selectedUser.userId === 1) {
      toast.warning("Cannot delete super admin.", { position: "bottom-right" });
      return;
    }
    deleteMutation.mutateAsync(selectedUser.userId);
  };

  const handleActivate = () => {
    if (!selectedUser || activateMutation.isPending) return;
    activateMutation.mutateAsync(selectedUser.userId);
  };

  const handleDeactivate = () => {
    if (!selectedUser || deactivateMutation.isPending) return;
    if (selectedUser.role.roleName === "admin") {
      toast.warning("Cannot deactivate admin.", { position: "bottom-right" });
      return;
    }
    deactivateMutation.mutateAsync(selectedUser.userId);
  };

  const columns = useMemo(
    () => buildColumns({ onRequestDelete: handleRequestDelete, onRequestStatus: handleRequestStatus }),
    [],
  );

  return (
    <Card className="px-4 sm:px-6 md:px-8 py-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <Typography as="h2" variant="subtitle">Users</Typography>
          <p className="text-sm text-muted-foreground mt-0.5">Manage system user accounts and access status.</p>
        </div>
        <Button asChild className="w-full sm:w-auto text-center justify-center gap-2">
          <Link to="/admin/users/create">
            <UserPlus className="size-4" />
            Create User
          </Link>
        </Button>
      </header>

      <section>
        <UserDataTable columns={columns} data={safeUsers} isPending={isPending} />
      </section>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Are you sure you want to delete{" "}
              <span className="font-medium">{selectedUser?.username ?? "this user"}</span>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Dialog */}
      <Dialog open={statusOpen} onOpenChange={setStatusOpen}>
        {!selectedUser?.isActive ? (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Activate User</DialogTitle>
              <DialogDescription>
                Activate <span className="font-medium">{selectedUser?.username}</span>?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setStatusOpen(false)}>Cancel</Button>
              <Button className="bg-green-500 hover:bg-green-600 text-white" onClick={handleActivate} disabled={activateMutation.isPending}>
                {activateMutation.isPending ? "Activating..." : "Activate"}
              </Button>
            </DialogFooter>
          </DialogContent>
        ) : (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Deactivate User</DialogTitle>
              <DialogDescription>
                Deactivate <span className="font-medium">{selectedUser?.username}</span>?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setStatusOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDeactivate} disabled={deactivateMutation.isPending}>
                {deactivateMutation.isPending ? "Deactivating..." : "Deactivate"}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </Card>
  );
}
