
import { Typography } from "@/components/ui/typography";
import { BloodStock } from "../components/blood-stock";
import { NextDonation } from "../components/next-donation";
import { TotalBloodDonation } from "../components/total-blood-donation";
import { UpcomingAppointment } from "../components/upcoming-appointment";
import { TotalBloodRequest } from "../components/total-blood-request";

export default function ClientDashboardLayout() {
  return (
    <div>
      <Typography variant="subtitle" className="-mt-5 mb-3">Client Dashboard</Typography>
         <div className="grid gap-6 md:grid-cols-2">
        <BloodStock />
        <NextDonation />
      </div>
      <div className="mt-4 grid gap-6 md:grid-cols-3">
        <TotalBloodDonation/>
        <TotalBloodRequest />
        <UpcomingAppointment />
      </div>
    </div>
  );
}

