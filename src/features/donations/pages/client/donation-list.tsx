import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { isAxiosError } from "axios";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import useAuth from "@/context/auth/useAuth";
import DonationDataTable from "../../components/donation-data-table";
import DonorRequiredCard from "../../components/donor-required-card";
import { clientDonationColumns } from "../../components/client-donation-columns";
import { getDonationsQueryOptions } from "../../queries";

export default function ClientDonationListPage() {
  const { user } = useAuth();
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [hospitalFilter, setHospitalFilter] = useState("");

  // Without an approved donor profile the API returns 403, so skip the request and show the guard
  const donorId = user?.donor?.id;
  const canView =
    donorId != null &&
    user?.donor?.status !== "pending" &&
    !!user?.permissions?.includes("donations.view");

  const {
    data: donations = [],
    isPending,
    isError,
    error,
  } = useQuery({ ...getDonationsQueryOptions, enabled: canView });

  const clientDonations = useMemo(
    () => donations.filter((donation) => donation.donorId === donorId),
    [donations, donorId],
  );

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

  const isForbidden = isAxiosError(error) && error.response?.status === 403;
  const showGuard = !canView || isForbidden;

  return (
    <Card className="px-8 py-6">
      <header className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Typography as="h1" variant="subtitle">
            My Donations
          </Typography>
          {!showGuard && (
            <Button asChild>
              <Link to="/client/donations/create">Create Donation</Link>
            </Button>
          )}
        </div>
      </header>

      {showGuard ? (
        <DonorRequiredCard />
      ) : (
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

          {isError ? (
            <Typography className="text-destructive">
              {error instanceof Error ? error.message : "Unable to load your donations."}
            </Typography>
          ) : (
            <DonationDataTable
              columns={clientDonationColumns}
              data={filteredDonations}
              isPending={isPending}
            />
          )}
        </section>
      )}
    </Card>
  );
}
