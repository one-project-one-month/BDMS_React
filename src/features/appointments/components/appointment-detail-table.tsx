import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { getDonationQueryOptions } from "@/features/donations/queries/donationQueries";
import { getHospitalQueryOptions } from "@/features/hospitals/queries";
import { getUserQueryOptions } from "@/features/users/queries";
import { cn } from "@/lib/utils";
import { getAppointmentStatusInfo } from "../appointment-status";
import { getAppointmentQueryOptions } from "../queries";

const formatDate = (value: string | null | undefined) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
};

const formatDateTime = (value: string | null | undefined) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
};

export default function AppointmentDetailTable({ id }: { id: number }) {
  const appointmentQuery = useQuery(getAppointmentQueryOptions(id));
  const appointment = appointmentQuery.data;
  const donationId = appointment?.donationId ?? null;
  const userId = appointment?.userId ?? null;
  const hospitalId = appointment?.hospitalId ?? null;
  const isDonationEnabled = donationId != null && donationId > 0;
  const isUserEnabled = userId != null && userId > 0;
  const isHospitalEnabled = hospitalId != null && hospitalId > 0;

  const donationQuery = useQuery({
    ...getDonationQueryOptions(donationId ?? 0),
    enabled: isDonationEnabled,
  });

  const userQuery = useQuery({
    ...getUserQueryOptions(userId ?? 0),
    enabled: isUserEnabled,
  });

  const hospitalQuery = useQuery({
    ...getHospitalQueryOptions(hospitalId ?? 0),
    enabled: isHospitalEnabled,
  });

  const isPending =
    appointmentQuery.isPending ||
    (isDonationEnabled && donationQuery.isPending) ||
    (isUserEnabled && userQuery.isPending) ||
    (isHospitalEnabled && hospitalQuery.isPending);

  if (isPending) {
    return (
      <div className="flex min-h-[240px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  if (appointmentQuery.isError || !appointment) {
    return (
      <>
        <div>
          <Button asChild variant="outline">
            <Link to="/admin/appointments">Back to Appointment List</Link>
          </Button>
        </div>
        <div>Unable to load appointment detail.</div>
        <div>
          <Button asChild variant="outline">
            <Link to="/admin/appointments">Back to Appointment List</Link>
          </Button>
        </div>
      </>
    );
  }

  const statusInfo = getAppointmentStatusInfo(appointment.status);

  return (
    <>
      <div className="flex gap-3">
        <Button asChild variant="outline">
          <Link to="/admin/appointments">Back to Appointment List</Link>
        </Button>
        <Button asChild>
          <Link to={`/admin/appointments/${appointment.id}/edit`}>
            Edit Appointment
          </Link>
        </Button>
      </div>
      <div className="overflow-hidden rounded-[10px] border">
        <Table>
          <TableBody>
            <TableRow className="divide-x">
              <TableCell>Appointment ID</TableCell>
              <TableCell>{appointment.id}</TableCell>
            </TableRow>
            <TableRow className="divide-x">
              <TableCell>Donation</TableCell>
              <TableCell>
                {donationQuery.data?.donationCode ||
                  (donationId != null && donationId > 0 ? `#${donationId}` : "-")}
              </TableCell>
            </TableRow>
            <TableRow className="divide-x">
              <TableCell>Donor</TableCell>
              <TableCell>{userQuery.data?.username ?? "-"}</TableCell>
            </TableRow>
            <TableRow className="divide-x">
              <TableCell>User ID</TableCell>
              <TableCell>{appointment.userId ?? "-"}</TableCell>
            </TableRow>
            <TableRow className="divide-x">
              <TableCell>Hospital</TableCell>
              <TableCell>{hospitalQuery.data?.name ?? "-"}</TableCell>
            </TableRow>
            <TableRow className="divide-x">
              <TableCell>Hospital ID</TableCell>
              <TableCell>{appointment.hospitalId ?? "-"}</TableCell>
            </TableRow>
            <TableRow className="divide-x">
              <TableCell>Blood Request ID</TableCell>
              <TableCell>{appointment.bloodRequestId ?? "-"}</TableCell>
            </TableRow>
            <TableRow className="divide-x">
              <TableCell>Appointment Date</TableCell>
              <TableCell>{formatDate(appointment.appointmentDate)}</TableCell>
            </TableRow>
            <TableRow className="divide-x">
              <TableCell>Appointment Time</TableCell>
              <TableCell>{appointment.appointmentTime ?? "-"}</TableCell>
            </TableRow>
            <TableRow className="divide-x">
              <TableCell>Status</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={cn("text-white", statusInfo.colorClass)}
                >
                  {statusInfo.label}
                </Badge>
              </TableCell>
            </TableRow>
            <TableRow className="divide-x">
              <TableCell>Remarks</TableCell>
              <TableCell>{appointment.remarks ?? "-"}</TableCell>
            </TableRow>
            <TableRow className="divide-x">
              <TableCell>Created At</TableCell>
              <TableCell>{formatDateTime(appointment.createdAt)}</TableCell>
            </TableRow>
            <TableRow className="divide-x">
              <TableCell>Updated At</TableCell>
              <TableCell>{formatDateTime(appointment.updatedAt)}</TableCell>
            </TableRow>
            <TableRow className="divide-x">
              <TableCell>Completed At</TableCell>
              <TableCell>{formatDateTime(appointment.completedAt)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div>
        <Button asChild variant="outline">
          <Link to="/admin/appointments">Back to Appointment List</Link>
        </Button>
      </div>
    </>
  );
}
