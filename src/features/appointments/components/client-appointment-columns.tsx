import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getAppointmentStatusInfo } from "../appointment-status";
import type { Appointment } from "../appointment.types";

type ClientAppointmentColumnHandlers = {
  onRequestCancel: (appointment: Appointment) => void;
  isCancellingAppointmentId?: number | null;
};

const formatDate = (value: string | null | undefined) => {
  if (!value) {
    return "-";
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(date);
};

const formatTime = (value: string | null | undefined) => {
  if (!value) {
    return "-";
  }

  const [hours, minutes] = value.split(":");
  const parsedHours = Number(hours);
  const parsedMinutes = Number(minutes);

  if (!Number.isFinite(parsedHours) || !Number.isFinite(parsedMinutes)) {
    return value;
  }

  const date = new Date();
  date.setHours(parsedHours, parsedMinutes, 0, 0);

  return new Intl.DateTimeFormat("en-US", {
    timeStyle: "short",
  }).format(date);
};

const getDonationLabel = (appointment: Appointment) =>
  appointment.donation?.donationCode ||
  (appointment.donationId != null ? `#${appointment.donationId}` : "-");

const getHospitalLabel = (appointment: Appointment) =>
  appointment.hospital?.hospitalName ||
  appointment.donation?.hospital?.hospitalName ||
  (appointment.hospitalId != null
    ? `Hospital #${appointment.hospitalId}`
    : appointment.donation?.hospitalId != null
      ? `Hospital #${appointment.donation.hospitalId}`
      : "-");

export const buildClientAppointmentColumns = ({
  onRequestCancel,
  isCancellingAppointmentId,
}: ClientAppointmentColumnHandlers): ColumnDef<Appointment>[] => [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    id: "donation",
    accessorFn: (row) => getDonationLabel(row),
    header: "Donation",
    cell: ({ row }) => getDonationLabel(row.original),
  },
  {
    id: "hospital",
    accessorFn: (row) => getHospitalLabel(row),
    header: "Hospital",
    cell: ({ row }) => getHospitalLabel(row.original),
  },
  {
    accessorKey: "appointmentDate",
    header: "Date",
    cell: ({ row }) => formatDate(row.original.appointmentDate),
  },
  {
    accessorKey: "appointmentTime",
    header: "Time",
    cell: ({ row }) => formatTime(row.original.appointmentTime),
  },
  {
    accessorKey: "remarks",
    header: "Remarks",
    cell: ({ row }) => row.original.remarks || "-",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const statusInfo = getAppointmentStatusInfo(row.original.status);

      return (
        <Badge
          variant="outline"
          className={cn("text-white capitalize", statusInfo.colorClass)}
        >
          {statusInfo.label}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const appointment = row.original;
      const statusValue = getAppointmentStatusInfo(appointment.status).value;
      const isFinalStatus =
        statusValue === "cancelled" ||
        statusValue === "completed" ||
        statusValue === "rejected";
      const isCancelling = isCancellingAppointmentId === appointment.id;

      return (
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={() => onRequestCancel(appointment)}
          disabled={isFinalStatus || isCancelling}
        >
          {isCancelling ? "Cancelling..." : "Cancel"}
        </Button>
      );
    },
  },
];
