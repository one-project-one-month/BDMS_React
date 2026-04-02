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

import DonorDataTable from "../components/donor-data-table";
import { buildColumns } from "../components/donor-columns";

import {
  deleteDonorMutationOptions,
  getDonorsQueryOptions,
} from "../queries/donorQueries";
import { donorKeys } from "../queries";
import type { Donor } from "../donor.types";
import { dummyDonors } from "../donor.dummy";

export default function DonorListPage() {
  const queryClient = useQueryClient();
  //   const { data: donors, isPending } = useQuery(getDonorsQueryOptions);
  //   const safeDonors = donors ?? [];

  const safeDonors = dummyDonors;
  const isPending = false;
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);

  const deleteMutation = useMutation({
    ...deleteDonorMutationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: donorKeys.list() });
      setDeleteOpen(false);
      setSelectedDonor(null);
    },
  });

  const handleRequestDelete = (donor: Donor) => {
    setSelectedDonor(donor);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedDonor || deleteMutation.isPending) return;
    deleteMutation.mutateAsync(selectedDonor);
  };

  const columns = useMemo(
    () => buildColumns({ onRequestDelete: handleRequestDelete }),
    [],
  );

  return (
    <Card className="px-8">
      <header className="flex items-center justify-between mb-6">
        <Typography as={"h1"} variant={"subtitle"}>
          Donor List
        </Typography>
        <Button asChild>
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
    </Card>
  );
}
