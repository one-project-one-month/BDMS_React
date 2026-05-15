import { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import useAuth from "@/context/auth/useAuth";
import { getDonationsQueryOptions } from "@/features/donations/queries/donationQueries";
import type { Appointment } from "@/features/appointments/appointment.types";
import type { Donation } from "@/features/donations/donation.types";
import AppointmentDataTable from "../../components/appointment-data-table";
import { buildClientAppointmentColumns } from "../../components/client-appointment-columns";
import {
  getAppointmentStatusFilterValue,
  getAppointmentStatusInfo,
} from "../../appointment-status";
import {
  appointmentKeys,
  getAppointmentsQueryOptions,
  updateAppointmentStatusMutationOptions,
} from "../../queries";

type DonorReference = {
  donorId?: number;
};

const matchesClientAppointment = (
  appointmentUserId: number | null | undefined,
  currentUserId: number | undefined,
) => appointmentUserId != null && currentUserId != null && appointmentUserId === currentUserId;

const buildDonationLookup = (donations: Donation[]) =>
  new Map(donations.map((donation) => [donation.id, donation]));

const getDonorId = (donor: unknown) => {
  if (
    donor &&
    typeof donor === "object" &&
    "donorId" in donor &&
    typeof (donor as DonorReference).donorId === "number"
  ) {
    return (donor as DonorReference).donorId;
  }

  return undefined;
};

export default function ClientAppointmentListPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const {
    data: appointments = [],
    isPending,
    isError,
    error,
  } = useQuery(getAppointmentsQueryOptions);
  const { data: donations = [] } = useQuery(getDonationsQueryOptions);

  const donationById = useMemo(() => buildDonationLookup(donations), [donations]);
  const currentDonorId = getDonorId(user?.donor);

  const cancelMutation = useMutation({
    ...updateAppointmentStatusMutationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
      toast.success("Appointment cancelled successfully.", {
        position: "bottom-right",
      });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to cancel appointment.", {
        position: "bottom-right",
      });
    },
  });

  const clientAppointments = useMemo(() => {
    const currentUserId = user?.userId;

    return appointments.filter((appointment) => {
      if (matchesClientAppointment(appointment.userId, currentUserId)) {
        return true;
      }

      if (
        currentDonorId != null &&
        appointment.donorId != null &&
        appointment.donorId === currentDonorId
      ) {
        return true;
      }

      if (currentDonorId != null && appointment.donationId != null) {
        const donation = donationById.get(appointment.donationId);

        return donation?.donorId === currentDonorId;
      }

      return false;
    });
  }, [appointments, currentDonorId, donationById, user?.userId]);

  const filteredAppointments = useMemo(() => {
    let items = clientAppointments;

    if (dateFilter) {
      items = items.filter(
        (appointment) => appointment.appointmentDate === dateFilter,
      );
    }

    if (statusFilter.trim()) {
      const statusQuery = statusFilter.trim().toLowerCase();
      items = items.filter((appointment) => {
        const statusInfo = getAppointmentStatusInfo(appointment.status);

        return (
          getAppointmentStatusFilterValue(appointment.status).includes(statusQuery) ||
          statusInfo.value.toLowerCase().includes(statusQuery)
        );
      });
    }

    return items;
  }, [clientAppointments, dateFilter, statusFilter]);

  const handleRequestCancel = useCallback(
    (appointment: Appointment) => {
      cancelMutation.mutate({
        id: appointment.id,
        status: "cancelled",
      });
    },
    [cancelMutation],
  );

  const columns = useMemo(
    () =>
      buildClientAppointmentColumns({
        onRequestCancel: handleRequestCancel,
        isCancellingAppointmentId: cancelMutation.variables?.id ?? null,
      }),
    [cancelMutation.variables?.id, handleRequestCancel],
  );

  const appointmentLoadError =
    error instanceof Error
      ? error.message
      : "Unable to load your appointments.";

  return (
    <Card className="px-8 py-6">
      <header className="mb-6">
        <Typography as="h1" variant="subtitle">
          My Appointments
        </Typography>
      </header>

      <section>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <Input
            type="date"
            value={dateFilter}
            onChange={(event) => setDateFilter(event.target.value)}
            className="w-full max-w-xs"
          />
          <Input
            type="text"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            placeholder="Filter by status"
            className="w-full max-w-xs"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setDateFilter("");
              setStatusFilter("");
            }}
            disabled={!dateFilter && !statusFilter}
          >
            Reset
          </Button>
        </div>

        {isError ? (
          <Typography className="text-destructive">
            {appointmentLoadError}
          </Typography>
        ) : (
          <AppointmentDataTable
            columns={columns}
            data={filteredAppointments}
            isPending={isPending}
          />
        )}
      </section>
    </Card>
  );
}
