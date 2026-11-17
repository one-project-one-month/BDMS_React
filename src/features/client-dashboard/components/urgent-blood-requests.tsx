import { AlertTriangle } from "lucide-react";
import { Typography } from "@/components/ui/typography";
import { DashboardCard } from "./dashboard-card";

export function UrgentBloodRequests() {
  return (
    <DashboardCard
      title="Urgent Blood Requests"
      icon={<AlertTriangle className="size-5 text-dark-primary" />}
    >
      <Typography className="text-disabled text-sm">No urgent requests</Typography>
    </DashboardCard>
  );
}
