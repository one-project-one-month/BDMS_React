import { useQuery } from "@tanstack/react-query";
import { Typography } from "@/components/ui/typography";
import useAuth from "@/context/auth/useAuth";
import { getDonationsQueryOptions } from "@/features/donations/queries";
import { DashboardCard } from "./dashboard-card";

export function TotalBloodDonation() {
  const { user } = useAuth();
  const { data: donations = [] } = useQuery(getDonationsQueryOptions);

  const donorId = user?.donor?.id;
  const count = donorId == null ? 0 : donations.filter((d) => d.donorId === donorId).length;

  return (
    <DashboardCard title="My Donations" titleClassName="font-bold">
      <Typography className="text-primary text-[clamp(3.5rem,7vw,8rem)]! font-black leading-none">{count}</Typography>
    </DashboardCard>
  );
}
