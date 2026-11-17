import { useQuery } from "@tanstack/react-query";
import { Typography } from "@/components/ui/typography";
import useAuth from "@/context/auth/useAuth";
import { bloodRequestsQueryOptions } from "@/features/requests/queries";
import { DashboardCard } from "./dashboard-card";

export function TotalBloodRequest() {
  const { user } = useAuth();
  const { data: requests = [] } = useQuery(bloodRequestsQueryOptions);

  const count = requests.filter((r) => r.userId === user?.userId).length;

  return (
    <DashboardCard title="My Requests" titleClassName="font-bold">
      <Typography className="text-primary text-[clamp(3.5rem,7vw,8rem)]! font-black leading-none">{count}</Typography>
    </DashboardCard>
  );
}
