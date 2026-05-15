import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import useAuth from "@/context/auth/useAuth";
import { getDonorsQueryOptions } from "@/features/donors/queries";
import DonationForm from "@/features/donations/components/donation-form";

type DonorProfileRecord = Record<string, unknown>;

const getNestedRecord = (value: unknown, key: string) => {
  if (!value || typeof value !== "object" || !(key in value)) {
    return undefined;
  }

  const nested = (value as DonorProfileRecord)[key];
  return nested && typeof nested === "object"
    ? (nested as DonorProfileRecord)
    : undefined;
};

const getPositiveNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
};

const getDonorIdFromProfile = (profile: unknown) => {
  if (!profile || typeof profile !== "object") {
    return undefined;
  }

  const record = profile as DonorProfileRecord;
  const nestedDonor = getNestedRecord(record, "donor");

  return (
    getPositiveNumber(record.donorId) ??
    getPositiveNumber(record.donorID) ??
    getPositiveNumber(record.donorProfileId) ??
    getPositiveNumber(record.id) ??
    getPositiveNumber(nestedDonor?.donorId) ??
    getPositiveNumber(nestedDonor?.donorID) ??
    getPositiveNumber(nestedDonor?.id)
  );
};

export default function ClientDonationCreatePage() {
  const { user } = useAuth();
  const { data: donors = [], isPending } = useQuery(getDonorsQueryOptions);

  const donorId = useMemo(() => {
    const directDonorId = getDonorIdFromProfile(user?.donor);
    if (directDonorId != null) {
      return directDonorId;
    }

    return donors.find((donor) => donor.userId === user?.userId)?.id;
  }, [donors, user?.donor, user?.userId]);

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
        {isPending ? (
          <Typography>Loading donor profile...</Typography>
        ) : donorId == null ? (
          <Typography className="text-muted-foreground">
            No donor profile was found for this account yet.
          </Typography>
        ) : (
          <DonationForm
            donorIdOverride={donorId}
            returnPath="/client/donations"
          />
        )}
      </section>
    </Card>
  );
}
