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

import DonorDataTable from "../components/table/donor-data-table";

import {
  deleteDonorMutationOptions,
  getDonorsQueryOptions,
  activateDonorMutationOptions,
  deactivateDonorMutationOptions,
} from "../queries/donorQueries";
import { donorKeys } from "../queries";
import type { Donor } from "../donor.types";
import { buildColumns } from "../components/table/donor-columns";
import { toast } from "sonner";

export default function DonorListPage() {
  const queryClient = useQueryClient();
  const { data: donors, isPending } = useQuery(getDonorsQueryOptions);
  const safeDonors = donors ?? [];

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [statusOpen, setStatusOpen] = useState(false);

  const deleteMutation = useMutation({
    ...deleteDonorMutationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: donorKeys.list() });
      toast.success("Donor record deleted successfully.", {
        position: "bottom-right",
      });
      setDeleteOpen(false);
      setSelectedDonor(null);
    },
  });

  const activateMutation = useMutation({
    ...activateDonorMutationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: donorKeys.list() });
      toast.success("Donor activated successfully.", {
        position: "bottom-right",
      });
      setSelectedDonor(null);
      setStatusOpen(false);
    },
    onError: () => {
      toast.error("Failed donor activation.", {
        position: "bottom-right",
      });
    },
  });

  const deactivateMutation = useMutation({
    ...deactivateDonorMutationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: donorKeys.list() });
      toast.success("Donor deactivated successfully.", {
        position: "bottom-right",
      });
      setSelectedDonor(null);
      setStatusOpen(false);
    },
    onError: () => {
      toast.error("Failed donor deactivation.", {
        position: "bottom-right",
      });
    },
  });

  const handleRequestDelete = (donor: Donor) => {
    setSelectedDonor(donor);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedDonor || deleteMutation.isPending) return;
    deleteMutation.mutateAsync(selectedDonor.id);
  };

  const handleRequestStatus = (donor: Donor) => {
    setSelectedDonor(donor);
    setStatusOpen(true);
  };

  const handleActivate = () => {
    if (!selectedDonor || activateMutation.isPending) return;
    activateMutation.mutateAsync(selectedDonor.id);
  };

  const handleDeactivate = () => {
    if (!selectedDonor || deactivateMutation.isPending) return;
    deactivateMutation.mutateAsync(selectedDonor.id);
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
    <Card className="px-4 sm:px-6 md:px-8 py-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <Typography as={"h1"} variant={"subtitle"}>
          Donor List
        </Typography>
        <Button asChild className="w-full sm:w-auto text-center justify-center">
          <Link to={"/admin/donors/create"}>Add Donor</Link>
        </Button>
      </header>

      <section>
        <DonorDataTable
          columns={columns}
          data={safeDonors}
          isPending={isPending}
        />
      </section>

      {/* Delete dialog box */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Donor</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Are you sure you want to delete{" "}
              <span className="font-medium">
                {selectedDonor?.nicNo ?? "this donor"}
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

      {/* Status dialog */}
      <Dialog open={statusOpen} onOpenChange={setStatusOpen}>
        {!selectedDonor?.isActive ? (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Activate Donor</DialogTitle>
              <DialogDescription>
                Are you sure you want to activate{" "}
                <span className="font-medium">
                  {selectedDonor?.nicNo ?? "this donor"}
                </span>
                ?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setStatusOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleActivate}
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
              <DialogTitle>Deactivate Donor</DialogTitle>
              <DialogDescription>
                Are you sure you want to deactivate{" "}
                <span className="font-medium">
                  {selectedDonor?.nicNo ?? "this donor"}
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
                onClick={handleDeactivate}
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
