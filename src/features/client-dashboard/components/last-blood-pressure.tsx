import { Typography } from "@/components/ui/typography";
import { DashboardCard } from "./dashboard-card";

/** Blood pressure readings are not tracked by the API yet, so this card shows an empty state. */
export function LastBloodPressure() {
  return (
    <DashboardCard title="Last Blood Pressure" titleClassName="font-bold">
      <Typography className="text-primary text-[clamp(2.5rem,4vw,3.5rem)]! font-black leading-none">-/-</Typography>
      <Typography className="text-primary text-sm">mmHg</Typography>
    </DashboardCard>
  );
}
