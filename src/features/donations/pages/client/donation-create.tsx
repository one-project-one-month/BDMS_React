import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import useAuth from "@/context/auth/useAuth";
import DonationForm from "@/features/donations/components/donation-form";
import DonorRequiredCard from "@/features/donations/components/donor-required-card";

export default function ClientDonationCreatePage() {
  const { user } = useAuth();
  const donorId = user?.donor?.id;
  // Pending or missing donor profiles get the guard without any request
  const canCreate = donorId != null && user?.donor?.status !== "pending";

  return (
    <Card className="px-8 py-6">
      <header className="mb-6">
        <Typography as={"h1"} variant={"subtitle"}>
          Create Donation
        </Typography>
        <Typography variant={"body"}>
          Fill in the details below to add your donation record.
        </Typography>
      </header>
      <section>
        {canCreate ? (
          <DonationForm donorIdOverride={donorId} returnPath="/client/donations" />
        ) : (
          <DonorRequiredCard />
        )}
      </section>
    </Card>
  );
}
