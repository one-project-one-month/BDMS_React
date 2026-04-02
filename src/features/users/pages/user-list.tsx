import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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

import UserDataTable from "../components/table/user-data-table";
import { buildColumns } from "../components/table/user-columns";

import {
  activateUserMutationOptions,
  deactivateUserMutationOptions,
  deleteUserMutationOptions,
  getUsersQueryOptions,
} from "../queries/userQueries";
import { userKeys } from "../queries";
import type { User } from "../user.types";

export default function UserListPage() {
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
      toast.success("User record deleted successfully.", {
        position: "bottom-right",
      });
      setDeleteOpen(false);
      setSelectedUser(null);
    },
  });

  const activateMutation = useMutation({
    ...activateUserMutationOptions,
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: userKeys.list() });
      toast.success(`${user.role.roleName} activated successfully.`, {
        position: "bottom-right",
      });
      setSelectedUser(null);
      setStatusOpen(false);
    },
    onError: () => {
      toast.success("Failed user activation.", {
        position: "bottom-right",
      });
      setSelectedUser(null);
      setStatusOpen(false);
    },
  });

  const deactivateMutation = useMutation({
    ...deactivateUserMutationOptions,
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: userKeys.list() });
      toast.success(`${user.role.roleName} deactivated successfully.`, {
        position: "bottom-right",
      });
      setSelectedUser(null);
      setStatusOpen(false);
    },
    onError: () => {
      toast.success("Failed user deactivation.", {
        position: "bottom-right",
      });
      setSelectedUser(null);
      setStatusOpen(false);
    },
  });

  const handleRequestDelete = (user: User) => {
    setSelectedUser(user);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedUser || deleteMutation.isPending) return;
    deleteMutation.mutateAsync(selectedUser);
  };

  const handleRequestStatus = (user: User) => {
    setSelectedUser(user);
    setStatusOpen(true);
  };

  const handleRequestActivateStatus = () => {
    if (!selectedUser || activateMutation.isPending) return;
    activateMutation.mutateAsync(selectedUser.userId);
  };

  const handleRequestDeactivateStatus = () => {
    if (!selectedUser || deactivateMutation.isPending) return;
    if (selectedUser.role.roleName === "admin") {
      toast.warning("You can not deactivate admin.", {
        position: "bottom-right",
      });
      return;
    }
    deactivateMutation.mutateAsync(selectedUser.userId);
  };

  const columns = useMemo(
    () =>
      buildColumns({
        onRequestDelete: handleRequestDelete,
        onRequestStatus: handleRequestStatus,
      }),
    [],
  );

  return (
    <Card className="px-8">
      <header className="flex items-center justify-between mb-6">
        <Typography as={"h1"} variant={"subtitle"}>
          User List
        </Typography>
        <Button asChild>
          <Link to={"/admin/users/create"}>Create User</Link>
        </Button>
      </header>

      <section>
        <UserDataTable
          columns={columns}
          data={safeUsers}
          isPending={isPending}
        />
      </section>

      {/* Delete dialog box */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Are you sure you want to delete{" "}
              <span className="font-medium">
                {selectedUser?.username ?? "this user"}
              </span>
              ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
              className="hover:bg-dark-primary"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change status dialog box */}
      <Dialog open={statusOpen} onOpenChange={setStatusOpen}>
        {!selectedUser?.isActive ? (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Activate User</DialogTitle>
              <DialogDescription>
                Are you sure you want to activate{" "}
                <span className="font-medium">
                  {selectedUser?.username ?? "this user"}
                </span>
                ?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setStatusOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleRequestActivateStatus}
                disabled={activateMutation.isPending}
                className="bg-green-400 hover:bg-green-500"
              >
                {activateMutation.isPending ? "Activating..." : "Activate"}
              </Button>
            </DialogFooter>
          </DialogContent>
        ) : (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Deactivate User</DialogTitle>
              <DialogDescription>
                Are you sure you want to deactivate{" "}
                <span className="font-medium">
                  {selectedUser?.username ?? "this user"}
                </span>
                ?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setStatusOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleRequestDeactivateStatus}
                disabled={deactivateMutation.isPending}
                className="hover:bg-dark-primary"
              >
                {deactivateMutation.isPending
                  ? "Deactivating..."
                  : "Deactivate"}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </Card>
  );
}
