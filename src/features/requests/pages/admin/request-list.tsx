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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import BloodRequestDataTable from "../../components/table/blood-request-data-table";

import { toast } from "sonner";
import { buildColumns } from "../../components/table/blood-request-columns";
import type {
  BloodRequestAdmin,
  BloodRequestStatus,
  BloodRequestStatusAdmin,
} from "../../request.types";
import {
  createBloodRequestAppointmentMutationOptions,
  deleteBloodRequestMutationOptions,
  getBloodRequestsQueryOptions,
  updateBloodRequestStatusAdminMutationOptions,
  // updateBloodRequestStatusMutationOptions,
  // createBloodRequestAppointmentMutationOptions,
} from "../../queries";
import { bloodRequestKeys } from "../../queries/requestKeys";

export default function BloodRequestListPage() {
  const queryClient = useQueryClient();
  const { data: bloodRequests, isPending } = useQuery(
    getBloodRequestsQueryOptions,
  );

  // --- Filter state ---
  const [dateFilter, setDateFilter] = useState("");

  // --- Filtered data ---
  const safeBloodRequests = useMemo(() => {
    let items = bloodRequests ?? [];
    if (dateFilter) {
      items = items.filter((r) => r.requiredDate?.includes(dateFilter));
    }
    return items;
  }, [bloodRequests, dateFilter]);

  // --- Dialog state ---
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] =
    useState<BloodRequestAdmin | null>(null);
  const [urgencyOpen, setUrgencyOpen] = useState(false);
  const [appointmentOpen, setAppointmentOpen] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState("");

  // --- Mutations ---
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

  const statusMutation = useMutation({
    ...updateBloodRequestStatusAdminMutationOptions,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: bloodRequestKeys.list() });
      toast.success(`Blood request status updated to ${data.status}.`, {
        position: "bottom-right",
      });
    },
    onError: () => {
      toast.error("Failed to update blood request status.", {
        position: "bottom-right",
      });
    },
  });

  const appointmentMutation = useMutation({
    ...createBloodRequestAppointmentMutationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bloodRequestKeys.list() });
      toast.success("Appointment created successfully.", {
        position: "bottom-right",
      });
      setAppointmentOpen(false);
      setSelectedRequest(null);
      setAppointmentDate("");
    },
    onError: () => {
      toast.error("Failed to create appointment.", {
        position: "bottom-right",
      });
    },
  });

  // --- Handlers ---
  const handleRequestDelete = (request: BloodRequestAdmin) => {
    setSelectedRequest(request);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedRequest || deleteMutation.isPending) return;
    deleteMutation.mutateAsync(selectedRequest.id);
  };

  const handleRequestStatus = (
    request: BloodRequestAdmin,
    newStatus: BloodRequestStatus,
  ) => {
    statusMutation.mutateAsync({ id: request.id, status: newStatus });
  };

  const handleRequestCreateAppointment = (request: BloodRequestAdmin) => {
    setSelectedRequest(request);
    setAppointmentOpen(true);
  };

  const handleConfirmAppointment = () => {
    if (!selectedRequest || !appointmentDate || appointmentMutation.isPending)
      return;
    appointmentMutation.mutateAsync({
      id: selectedRequest.id,
      date: appointmentDate,
    });
  };

  const columns = useMemo(
    () =>
      buildColumns({
        onRequestDelete: handleRequestDelete,
        onRequestStatusChange: handleRequestStatus,
        onRequestCreateAppointment: handleRequestCreateAppointment,
      }),
    [],
  );

  return (
    <Card className="px-8 py-6">
      <header className="flex items-center justify-between mb-6">
        <Typography as={"h1"} variant={"subtitle"}>
          Blood Request List
        </Typography>
        <Button asChild>
          <Link to={"/admin/blood-requests/create"}>Add Request</Link>
        </Button>
      </header>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-4 bg-secondary/10 rounded-lg">
        <div className="flex-1">
          <Label htmlFor="dateFilter" className="text-xs mb-1 block">
            Date
          </Label>
          <Input
            className="max-w-[300px]"
            id="dateFilter"
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            placeholder="Filter by date..."
          />
        </div>
        <div className="flex items-end">
          <Button variant="outline" onClick={() => setDateFilter("")}>
            Clear
          </Button>
        </div>
      </div>

      <section>
        <BloodRequestDataTable
          columns={columns}
          data={safeBloodRequests}
          isPending={isPending}
        />
      </section>

      {/* Delete Dialog */}
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

      {/* Urgency Detail Dialog */}
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

      {/* Create Appointment Dialog */}
      <Dialog open={appointmentOpen} onOpenChange={setAppointmentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Appointment</DialogTitle>
            <DialogDescription>
              Schedule an appointment for{" "}
              <span className="font-medium">
                {selectedRequest?.patientName ?? "this patient"}
              </span>
              .
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="appointmentDate">Appointment Date & Time</Label>
            <Input
              id="appointmentDate"
              type="datetime-local"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAppointmentOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirmAppointment}
              disabled={appointmentMutation.isPending || !appointmentDate}
              className="bg-primary text-white"
            >
              {appointmentMutation.isPending
                ? "Creating..."
                : "Confirm Appointment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
