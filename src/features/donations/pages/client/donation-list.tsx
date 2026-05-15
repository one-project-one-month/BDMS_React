import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import useAuth from "@/context/auth/useAuth";
import { getDonorsQueryOptions } from "@/features/donors/queries";
import DonationDataTable from "../../components/donation-data-table";
import { clientDonationColumns } from "../../components/client-donation-columns";
import { getDonationsQueryOptions } from "../../queries";

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

export default function ClientDonationListPage() {
  const { user } = useAuth();
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [hospitalFilter, setHospitalFilter] = useState("");

  const {
    data: donors = [],
    isPending: isDonorListPending,
    isError: isDonorListError,
    error: donorListError,
  } = useQuery(getDonorsQueryOptions);

  const donorId = useMemo(() => {
    const directDonorId = getDonorIdFromProfile(user?.donor);
    if (directDonorId != null) {
      return directDonorId;
    }

    return donors.find((donor) => donor.userId === user?.userId)?.id;
  }, [donors, user?.donor, user?.userId]);

  const {
    data: donations = [],
    isPending: isDonationsPending,
    isError: isDonationsError,
    error: donationsError,
  } = useQuery(getDonationsQueryOptions);

  const clientDonations = useMemo(() => {
    if (donorId == null) {
      return [];
    }

    return donations.filter((donation) => donation.donorId === donorId);
  }, [donations, donorId]);

  const filteredDonations = useMemo(() => {
    let items = clientDonations;

    if (dateFilter) {
      items = items.filter((donation) => donation.donationDate.includes(dateFilter));
    }

    if (statusFilter.trim()) {
      const query = statusFilter.trim().toLowerCase();
      items = items.filter((donation) =>
        donation.status.toLowerCase().includes(query),
      );
    }

    if (hospitalFilter.trim()) {
      const query = hospitalFilter.trim().toLowerCase();
      items = items.filter((donation) => {
        const hospitalName = donation.hospital?.hospitalName?.toLowerCase() || "";

        return (
          hospitalName.includes(query) ||
          donation.hospitalId.toString().includes(query)
        );
      });
    }

    return items;
  }, [clientDonations, dateFilter, hospitalFilter, statusFilter]);

  const loadError = donorListError ?? donationsError;
  const donationLoadError =
    loadError instanceof Error
      ? loadError.message
      : "Unable to load your donations.";

  return (
    <Card className="px-8 py-6">
      <header className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Typography as="h1" variant="subtitle">
            My Donations
          </Typography>
          <Button asChild>
            <Link to="/client/donations/create">Create Donation</Link>
          </Button>
        </div>
      </header>

      <section>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <Input
            type="date"
            value={dateFilter}
            onChange={(event) => setDateFilter(event.target.value)}
            className="w-full max-w-xs"
          />
          <Input
            type="text"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            placeholder="Filter by status"
            className="w-full max-w-xs"
          />
          <Input
            type="text"
            value={hospitalFilter}
            onChange={(event) => setHospitalFilter(event.target.value)}
            placeholder="Filter by hospital"
            className="w-full max-w-xs"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setDateFilter("");
              setStatusFilter("");
              setHospitalFilter("");
            }}
            disabled={!dateFilter && !statusFilter && !hospitalFilter}
          >
            Reset
          </Button>
        </div>

        {isDonorListError || isDonationsError ? (
          <Typography className="text-destructive">
            {donationLoadError}
          </Typography>
        ) : donorId == null && !isDonorListPending ? (
          <Typography className="text-muted-foreground">
            No donor profile was found for this account yet.
          </Typography>
        ) : (
          <DonationDataTable
            columns={clientDonationColumns}
            data={filteredDonations}
            isPending={isDonorListPending || isDonationsPending}
          />
        )}
      </section>
    </Card>
  );
}
