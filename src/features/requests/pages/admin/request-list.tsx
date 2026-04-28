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

import BloodRequestDataTable from "../../components/table/blood-request-data-table";


import { toast } from "sonner";
import { buildColumns } from "../../components/table/blood-request-columns";
import type { BloodRequestAdmin } from "../../request.types";
import {
  deleteBloodRequestMutationOptions,
  getBloodRequestsQueryOptions,
} from "../../queries";
import { bloodRequestKeys } from "../../queries/requestKeys";

export default function BloodRequestListPage() {
  const queryClient = useQueryClient();
  const { data: bloodRequests, isPending } = useQuery(
    getBloodRequestsQueryOptions,
  );
  const safeBloodRequests = bloodRequests ?? [];

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] =
    useState<BloodRequestAdmin | null>(null);
  const [urgencyOpen, setUrgencyOpen] = useState(false);

  const deleteMutation = useMutation({
    ...deleteBloodRequestMutationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bloodRequestKeys.list() });
      toast.success("Blood request deleted successfully.", {
        position: "bottom-right",
      });
      setDeleteOpen(false);
      setSelectedRequest(null);
    },
    onError: () => {
      toast.error("Failed to delete blood request.", {
        position: "bottom-right",
      });
    },
  });

  const handleRequestDelete = (request: BloodRequestAdmin) => {
    setSelectedRequest(request);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedRequest || deleteMutation.isPending) return;
    deleteMutation.mutateAsync(selectedRequest.id);
  };

  const handleRequestStatus = (request: BloodRequestAdmin) => {
    setSelectedRequest(request);
    setUrgencyOpen(true);
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
          Blood Request List
        </Typography>
        <Button asChild>
          <Link to={"/admin/blood-requests/create"}>Add Request</Link>
        </Button>
      </header>

      <section>
        <BloodRequestDataTable
          columns={columns}
          data={safeBloodRequests}
          isPending={isPending}
        />
      </section>

      {/* Delete dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Blood Request</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Are you sure you want to delete the
              request for{" "}
              <span className="font-medium">
                {selectedRequest?.patientName ?? "this patient"}
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

      {/* Urgency detail dialog */}
      <Dialog open={urgencyOpen} onOpenChange={setUrgencyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Urgency</DialogTitle>
            <DialogDescription>
              Blood request for{" "}
              <span className="font-medium">
                {selectedRequest?.patientName ?? "this patient"}
              </span>{" "}
              is currently marked as{" "}
              <span className="font-medium capitalize">
                {selectedRequest?.urgency ?? "—"}
              </span>
              .
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUrgencyOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
