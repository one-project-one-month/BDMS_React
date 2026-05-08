import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { Typography } from "@/components/ui/typography";
import {
  getAppointmentStatusFilterValue,
  getAppointmentStatusInfo,
} from "../../appointment-status";
import type { Appointment, AppointmentStatus } from "../../appointment.types";
import AppointmentDataTable from "../../components/appointment-data-table";
import { buildColumns } from "../../components/appointment-columns";
import {
  appointmentKeys,
  completeAppointmentMutationOptions,
  deleteAppointmentMutationOptions,
  getAppointmentsQueryOptions,
  updateAppointmentStatusMutationOptions,
} from "../../queries";

export default function AppointmentListPage() {
  const queryClient = useQueryClient();
  const { data: appointments, isPending } = useQuery(
    getAppointmentsQueryOptions,
  );

  const [statusFilter, setStatusFilter] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  const safeAppointments = useMemo(() => {
    let items = appointments ?? [];

    if (statusFilter.trim()) {
      items = items.filter(
        (appointment) =>
          getAppointmentStatusFilterValue(appointment.status) ===
          statusFilter.toLowerCase(),
      );
    }

    if (searchFilter.trim()) {
      const query = searchFilter.toLowerCase();
      items = items.filter((appointment) => {
        const donationCode =
          appointment.donation?.donationCode?.toLowerCase() ?? "";
        const donorName = appointment.donor?.username?.toLowerCase() ?? "";
        const hospitalName =
          appointment.hospital?.hospitalName?.toLowerCase() ?? "";

        return (
          String(appointment.id).includes(query) ||
          String(appointment.donationId ?? "").includes(query) ||
          String(appointment.donorId ?? "").includes(query) ||
          donationCode.includes(query) ||
          donorName.includes(query) ||
          hospitalName.includes(query)
        );
      });
    }

    return items;
  }, [appointments, searchFilter, statusFilter]);

  const invalidateAppointments = () =>
    queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });

  const deleteMutation = useMutation({
    ...deleteAppointmentMutationOptions,
    onSuccess: () => {
      invalidateAppointments();
      setDeleteOpen(false);
      setSelectedAppointment(null);
      toast.success("Appointment deleted successfully.", {
        position: "bottom-right",
      });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to delete appointment.", {
        position: "bottom-right",
      });
    },
  });

  const statusMutation = useMutation({
    ...updateAppointmentStatusMutationOptions,
    onSuccess: (data) => {
      invalidateAppointments();
      toast.success(
        `Appointment status updated to ${getAppointmentStatusInfo(data.status).label}.`,
        {
        position: "bottom-right",
        },
      );
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to update appointment status.", {
        position: "bottom-right",
      });
    },
  });

  const completeMutation = useMutation({
    ...completeAppointmentMutationOptions,
    onSuccess: () => {
      invalidateAppointments();
      toast.success("Appointment completed successfully.", {
        position: "bottom-right",
      });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to complete appointment.", {
        position: "bottom-right",
      });
    },
  });

  const handleRequestDelete = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedAppointment || deleteMutation.isPending) {
      return;
    }

    deleteMutation.mutateAsync(selectedAppointment.id);
  };

  const handleRequestStatusChange = (
    appointment: Appointment,
    newStatus: AppointmentStatus,
  ) => {
    statusMutation.mutateAsync({ id: appointment.id, status: newStatus });
  };

  const handleRequestComplete = (appointment: Appointment) => {
    completeMutation.mutateAsync(appointment.id);
  };

  const columns = useMemo(
    () =>
      buildColumns({
        onRequestDelete: handleRequestDelete,
        onRequestStatusChange: handleRequestStatusChange,
        onRequestComplete: handleRequestComplete,
      }),
    [],
  );

  return (
    <Card className="px-8 py-6">
      <header className="mb-6 flex items-center justify-between">
        <Typography as="h1" variant="subtitle">
          Appointments
        </Typography>
      </header>

      <div className="mb-4 flex flex-col gap-4 rounded-lg bg-secondary/10 md:flex-row">
        <div className="flex-1">
          <Label htmlFor="appointmentSearch" className="mb-1 block text-xs">
            Search
          </Label>
          <Input
            id="appointmentSearch"
            type="text"
            value={searchFilter}
            onChange={(event) => setSearchFilter(event.target.value)}
            placeholder="Search by id, donor, donation, or hospital"
          />
        </div>
        <div className="flex-1">
          <Label htmlFor="statusFilter" className="mb-1 block text-xs">
            Status
          </Label>
          <Input
            id="statusFilter"
            type="text"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            placeholder="Filter by status"
          />
        </div>
        <div className="flex items-end">
          <Button
            variant="outline"
            onClick={() => {
              setSearchFilter("");
              setStatusFilter("");
            }}
          >
            Clear
          </Button>
        </div>
      </div>

      <section>
        <AppointmentDataTable
          columns={columns}
          data={safeAppointments}
          isPending={isPending}
        />
      </section>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Appointment</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Are you sure you want to delete
              appointment{" "}
              <span className="font-medium">
                #{selectedAppointment?.id ?? ""}
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
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
