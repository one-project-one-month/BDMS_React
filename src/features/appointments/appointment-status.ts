import type { AppointmentStatus } from "./appointment.types";

type AppointmentStatusInfo = {
  value: string;
  label: string;
  colorClass: string;
  code?: number;
};

// Assumption based on the current frontend status order.
// Update these values if the backend confirms a different enum mapping.
const APPOINTMENT_STATUS_CODE_MAP: Partial<Record<number, AppointmentStatus>> = {
  1: "pending",
  2: "scheduled",
  3: "confirmed",
  4: "completed",
  5: "cancelled",
  6: "rejected",
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "confirmed":
      return "bg-green-500";
    case "scheduled":
      return "bg-blue-500";
    case "pending":
      return "bg-yellow-500";
    case "completed":
      return "bg-emerald-700";
    case "cancelled":
    case "rejected":
      return "bg-destructive";
    default:
      return "bg-secondary";
  }
};

const toTitleCase = (value: string) =>
  value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export const getAppointmentStatusInfo = (
  status: AppointmentStatus | unknown,
): AppointmentStatusInfo => {
  if (typeof status === "number") {
    const mappedStatus = APPOINTMENT_STATUS_CODE_MAP[status];

    if (mappedStatus) {
      return {
        value: mappedStatus,
        label: toTitleCase(String(mappedStatus)),
        colorClass: getStatusColor(String(mappedStatus)),
        code: status,
      };
    }

    return {
      value: `code:${status}`,
      label: `Status ${status}`,
      colorClass: getStatusColor("unknown"),
      code: status,
    };
  }

  if (typeof status === "string") {
    return {
      value: status,
      label: toTitleCase(status),
      colorClass: getStatusColor(status),
    };
  }

  return {
    value: "unknown",
    label: "Unknown",
    colorClass: getStatusColor("unknown"),
  };
};

export const getAppointmentStatusFilterValue = (
  status: AppointmentStatus | unknown,
) => getAppointmentStatusInfo(status).label.toLowerCase();
