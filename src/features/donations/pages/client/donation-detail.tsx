import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  Calendar,
  Clock,
  Droplet,
  FileText,
  Hash,
  Home,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import useAuth from "@/context/auth/useAuth";
import { getDonorsQueryOptions } from "@/features/donors/queries";
import { getHospitalQueryOptions } from "@/features/hospitals/queries";
import { cn } from "@/lib/utils";
import { getDonationQueryOptions } from "../../queries";

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

const getStatusConfig = (status: string) => {
  const normalizedStatus = status.toLowerCase();

  switch (normalizedStatus) {
    case "approved":
      return { color: "bg-green-500", icon: Activity };
    case "pending":
      return { color: "bg-yellow-500", icon: Clock };
    case "completed":
      return { color: "bg-blue-500", icon: Activity };
    case "cancelled":
    case "rejected":
      return { color: "bg-destructive", icon: AlertCircle };
    case "screening":
      return { color: "bg-purple-500", icon: Activity };
    default:
      return { color: "bg-secondary", icon: FileText };
  }
};

export default function ClientDonationDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();

  const donationId = useMemo(() => Number(id), [id]);
  const isValidId = Number.isInteger(donationId) && donationId > 0;

  const {
    data: donors = [],
    isPending: isDonorListPending,
    isError: isDonorListError,
  } = useQuery(getDonorsQueryOptions);

  const donorId = useMemo(() => {
    const directDonorId = getDonorIdFromProfile(user?.donor);
    if (directDonorId != null) {
      return directDonorId;
    }

    return donors.find((donor) => donor.userId === user?.userId)?.id;
  }, [donors, user?.donor, user?.userId]);

  const donationQuery = useQuery({
    ...getDonationQueryOptions(donationId),
    enabled: isValidId,
  });

  const hospitalQuery = useQuery({
    ...getHospitalQueryOptions(donationQuery.data?.hospitalId ?? 0),
    enabled: !!donationQuery.data?.hospitalId,
  });

  if (!isValidId) {
    return (
      <Card className="p-8">
        <Typography as="h1" variant="subtitle" className="mb-6">
          Donation Detail
        </Typography>
        <Typography className="mb-4">Invalid donation id.</Typography>
        <Button asChild variant="outline">
          <Link to="/client/donations">Back to Donation List</Link>
        </Button>
      </Card>
    );
  }

  const donation = donationQuery.data;
  const hospital = hospitalQuery.data;

  const isPending =
    isDonorListPending || donationQuery.isPending || hospitalQuery.isPending;

  const isOwnedByCurrentUser =
    donorId != null && donation != null && donation.donorId === donorId;

  if (isPending) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    );
  }

  if (
    isDonorListError ||
    donationQuery.isError ||
    hospitalQuery.isError ||
    donorId == null ||
    !donation ||
    !isOwnedByCurrentUser
  ) {
    return (
      <Card className="mx-auto mt-8 max-w-2xl border-destructive/20 bg-destructive/5 p-12 text-center">
        <Typography variant="subtitle" className="mb-2 text-destructive">
          Unable to Load Donation
        </Typography>
        <Typography variant="body" className="mb-6 text-muted-foreground">
          We couldn't find a donation record for this account.
        </Typography>
        <Button asChild variant="outline">
          <Link to="/client/donations">Back to Donation List</Link>
        </Button>
      </Card>
    );
  }

  const donationDate = new Date(donation.donationDate);
  const isValidDate = !Number.isNaN(donationDate.getTime());
  const statusConfig = getStatusConfig(donation.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        asChild
        className="-ml-2 gap-2 text-muted-foreground hover:text-foreground"
      >
        <Link to="/client/donations">
          <ArrowLeft className="size-4" />
          Back to Donation List
        </Link>
      </Button>

      <Card className="px-8 py-6">
        <header className="flex flex-col items-start justify-between gap-6 border-b bg-secondary/10 px-8 py-10 md:flex-row md:items-center">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <Badge
                className={cn(
                  "gap-1.5 px-3 py-1 text-white capitalize",
                  statusConfig.color,
                )}
              >
                <StatusIcon className="size-3.5" />
                {donation.status}
              </Badge>
              <Badge
                variant="outline"
                className="gap-1.5 border-primary/30 text-primary"
              >
                <Droplet className="size-3.5 fill-current" />
                {donation.bloodGroup}
              </Badge>
            </div>
            <Typography
              as="h1"
              variant="title"
              className="text-3xl font-bold tracking-tight"
            >
              Donation {donation.donationCode || `#${donation.id}`}
            </Typography>
          </div>
          <div className="flex flex-col items-end">
            <Typography
              variant="body"
              className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground"
            >
              Donation Code
            </Typography>
            <div className="flex items-center gap-2 font-mono text-xl font-bold text-primary">
              <Hash className="size-5" />
              {donation.donationCode || "PENDING"}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-10 p-8 md:grid-cols-3">
          <div className="space-y-8 md:col-span-2">
            <section>
              <Typography
                variant="subtitle"
                className="mb-4 flex items-center gap-2 text-primary"
              >
                <Activity className="size-5" />
                Donation Overview
              </Typography>
              <div className="grid grid-cols-1 gap-6 rounded-xl border border-secondary/20 bg-secondary/5 p-6 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Hospital
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
                      <Home className="size-5" />
                    </div>
                    <div>
                      <Typography variant="body" className="font-medium">
                        {hospital?.name || `Hospital #${donation.hospitalId}`}
                      </Typography>
                      <Typography
                        variant="body"
                        className="text-xs text-muted-foreground"
                      >
                        ID: {donation.hospitalId}
                      </Typography>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Blood Group
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                      <Droplet className="size-5 fill-current" />
                    </div>
                    <div>
                      <Typography variant="body" className="text-lg font-bold">
                        {donation.bloodGroup}
                      </Typography>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Units Donated
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
                      <Droplet className="size-5" />
                    </div>
                    <div>
                      <Typography variant="body" className="text-lg font-bold">
                        {donation.unitsDonated || "0"} Units
                      </Typography>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Blood Request
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Hash className="size-5" />
                    </div>
                    <div>
                      <Typography variant="body" className="font-medium">
                        {donation.bloodRequestId
                          ? `#${donation.bloodRequestId}`
                          : "-"}
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <Typography
                variant="subtitle"
                className="mb-4 flex items-center gap-2 text-primary"
              >
                <FileText className="size-5" />
                Additional Remarks
              </Typography>
              <div className="min-h-[120px] rounded-xl border border-secondary/20 bg-secondary/5 p-6">
                <Typography className="whitespace-pre-wrap italic leading-relaxed text-muted-foreground">
                  {donation.remarks ||
                    "No additional information provided for this donation record."}
                </Typography>
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-primary/10 bg-primary/5 p-6">
              <Typography
                variant="subtitle"
                className="mb-6 flex items-center gap-2 border-b pb-2 text-sm font-bold uppercase tracking-widest"
              >
                <Calendar className="size-4" />
                Timeline
              </Typography>
              <div className="space-y-6">
                <div className="relative space-y-1 border-l-2 border-primary/20 pl-6">
                  <div className="absolute -left-[9px] top-1 size-4 rounded-full border-2 border-background bg-primary" />
                  <label className="text-[10px] font-bold uppercase tracking-tighter text-primary">
                    Donation Date
                  </label>
                  <Typography variant="body" className="text-sm font-medium">
                    {isValidDate
                      ? new Intl.DateTimeFormat("en-US", {
                          dateStyle: "long",
                        }).format(donationDate)
                      : "Not available"}
                  </Typography>
                </div>
                <div className="relative space-y-1 border-l-2 border-secondary/20 pl-6">
                  <div className="absolute -left-[9px] top-1 size-4 rounded-full border-2 border-background bg-secondary" />
                  <label className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">
                    Created At
                  </label>
                  <Typography
                    variant="body"
                    className="text-sm text-muted-foreground"
                  >
                    {new Date(donation.createdAt).toLocaleString()}
                  </Typography>
                </div>
                <div className="relative space-y-1 border-l-2 border-secondary/20 pl-6">
                  <div className="absolute -left-[9px] top-1 size-4 rounded-full border-2 border-background bg-secondary" />
                  <label className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">
                    Last Updated
                  </label>
                  <Typography
                    variant="body"
                    className="text-sm text-muted-foreground"
                  >
                    {new Date(donation.updatedAt).toLocaleString()}
                  </Typography>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-secondary/10 p-4">
              <AlertCircle className="size-5 text-muted-foreground" />
              <Typography
                variant="body"
                className="text-xs leading-tight text-muted-foreground"
              >
                Contact staff if any donation details look incorrect.
              </Typography>
            </div>
          </aside>
        </div>
      </Card>
    </div>
  );
}
