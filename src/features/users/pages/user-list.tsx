import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

import UserDataTable from "../components/user-data-table";
import { buildColumns } from "../components/user-columns";

import {
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
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const deleteMutation = useMutation({
    ...deleteUserMutationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.list() });
      setDeleteOpen(false);
      setSelectedUser(null);
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

  const columns = useMemo(
    () => buildColumns({ onRequestDelete: handleRequestDelete }),
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
    </Card>
  );
}
