import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, MoreHorizontal, Trash2, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { getAppointmentStatusInfo } from "../appointment-status";
import type { Appointment, AppointmentStatus } from "../appointment.types";

const basePath = "/admin/appointments";

type ColumnHandlers = {
  onRequestDelete: (appointment: Appointment) => void;
  onRequestStatusChange: (
    appointment: Appointment,
    newStatus: AppointmentStatus,
  ) => void;
  onRequestComplete: (appointment: Appointment) => void;
  donorNameByDonationId?: Record<number, string>;
};

const APPOINTMENT_STATUS_OPTIONS: AppointmentStatus[] = [
  "pending",
  "scheduled",
  "confirmed",
  "completed",
  "cancelled",
  "rejected",
];

const formatDateTime = (value: string | null | undefined) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const getDonationLabel = (appointment: Appointment) =>
  appointment.donation?.donationCode ||
  (appointment.donationId != null ? `#${appointment.donationId}` : "-");

const getDonorLabel = (
  appointment: Appointment,
  donorNameByDonationId?: Record<number, string>,
) =>
  (appointment.donationId != null
    ? donorNameByDonationId?.[appointment.donationId]
    : null) ||
  (appointment.donationId != null
    ? `Donation #${appointment.donationId}`
    : "-");

const getHospitalLabel = (appointment: Appointment) =>
  appointment.hospital?.hospitalName ||
  appointment.donation?.hospital?.hospitalName ||
  (appointment.hospitalId != null
    ? `Hospital #${appointment.hospitalId}`
    : appointment.donation?.hospitalId != null
      ? `Hospital #${appointment.donation.hospitalId}`
      : "-");

export const buildColumns = ({
  onRequestDelete,
  onRequestStatusChange,
  onRequestComplete,
  donorNameByDonationId,
}: ColumnHandlers): ColumnDef<Appointment>[] => {
  return [
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
      id: "donor",
      accessorFn: (row) => getDonorLabel(row, donorNameByDonationId),
      header: "Donor",
      cell: ({ row }) => getDonorLabel(row.original, donorNameByDonationId),
    },
    {
      id: "hospital",
      accessorFn: (row) => getHospitalLabel(row),
      header: "Hospital",
      cell: ({ row }) => getHospitalLabel(row.original),
    },
    {
      accessorKey: "appointmentDate",
      header: "Appointment",
      cell: ({ row }) => formatDateTime(row.original.appointmentDate),
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
      accessorKey: "completedAt",
      header: "Completed At",
      cell: ({ row }) => formatDateTime(row.original.completedAt),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const appointment = row.original;
        const statusInfo = getAppointmentStatusInfo(appointment.status);
        const isCompleted = statusInfo.value.toLowerCase() === "completed";

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {!isCompleted && (
                <>
                  <DropdownMenuItem
                    onClick={() => onRequestComplete(appointment)}
                    className="cursor-pointer text-primary"
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    <span>Complete</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}

              <DropdownMenuItem asChild className="cursor-pointer">
                <Link
                  to={`${basePath}/${appointment.id}`}
                  className="flex items-center gap-2"
                >
                  <Eye className="size-4 shrink-0" />
                  <span>View Detail</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="cursor-pointer">
                <Link
                  to={`${basePath}/${appointment.id}/edit`}
                  className="flex items-center gap-2"
                >
                  <Edit className="size-4 shrink-0" />
                  <span>Edit</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="cursor-pointer">
                  <span>Change Status</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={
                      APPOINTMENT_STATUS_OPTIONS.includes(
                        statusInfo.value as AppointmentStatus,
                      )
                        ? statusInfo.value
                        : undefined
                    }
                    onValueChange={(value) =>
                      onRequestStatusChange(
                        appointment,
                        value as AppointmentStatus,
                      )
                    }
                  >
                    {APPOINTMENT_STATUS_OPTIONS.map((status) => (
                      <DropdownMenuRadioItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="flex items-center text-primary hover:text-secondary! hover:bg-dark-primary! transition-colors duration-200 cursor-pointer"
                onClick={() => onRequestDelete(appointment)}
              >
                <Trash2 className="size-4 shrink-0 text-inherit" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};
