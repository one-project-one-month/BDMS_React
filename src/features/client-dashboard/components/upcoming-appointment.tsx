import { Typography } from "@/components/ui/typography";
import { DashboardCard } from "./dashboard-card";

/** Appointments are not wired to this card yet, so it shows the empty state from the design. */
export function UpcomingAppointment() {
  return (
    <DashboardCard title="Upcoming Appointments">
      <Typography className="text-disabled text-sm">No upcoming appointments</Typography>
    </DashboardCard>
  );
}
