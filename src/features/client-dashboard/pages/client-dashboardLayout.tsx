import { LastBloodPressure } from "../components/last-blood-pressure";
import { NextDonation } from "../components/next-donation";
import { ProfileSummary } from "../components/profile-summary";
import { TotalBloodDonation } from "../components/total-blood-donation";
import { TotalBloodRequest } from "../components/total-blood-request";
import { UpcomingAppointment } from "../components/upcoming-appointment";
import { UrgentBloodRequests } from "../components/urgent-blood-requests";

export default function ClientDashboardLayout() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <UrgentBloodRequests />
        <NextDonation />
        <ProfileSummary />
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <TotalBloodDonation />
        <TotalBloodRequest />
        <LastBloodPressure />
        <UpcomingAppointment />
      </div>
    </div>
  );
}
