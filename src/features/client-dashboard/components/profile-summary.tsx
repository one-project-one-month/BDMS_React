import { UserRound } from "lucide-react";
import { Typography } from "@/components/ui/typography";
import useAuth from "@/context/auth/useAuth";
import { DashboardCard } from "./dashboard-card";

export function ProfileSummary() {
  const { user } = useAuth();
  const donor = user?.donor;

  const lastDonation = donor?.lastDonationDate
    ? new Date(donor.lastDonationDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";

  return (
    <DashboardCard
      title="Profile Summary"
      icon={<UserRound className="size-5 text-dark-primary" />}
    >
      <div className="flex size-24 items-center justify-center rounded-full bg-primary/15 text-3xl font-bold text-primary">
        {user?.userName?.charAt(0).toUpperCase() ?? "?"}
      </div>
      <Typography className="mt-4 text-xl font-bold text-dark-primary">
        {user?.userName ?? "-"}
      </Typography>
      <Typography className="text-disabled text-sm">User ID : {user?.userId ?? "-"}</Typography>
      <Typography className="text-disabled text-sm">Blood type : {donor?.bloodGroup ?? "-"}</Typography>
      <Typography className="text-disabled text-sm">Last donation : {lastDonation}</Typography>
    </DashboardCard>
  );
}
