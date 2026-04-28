import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  User,
  Home,
  Droplet,
  Hash,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowLeft,
  Edit3,
  Activity,
  FileText,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDonationQueryOptions } from "@/features/donations/queries/donationQueries";
import { cn } from "@/lib/utils";
import { getDonorQueryOptions } from "@/features/donors/queries";
import { getUserQueryOptions } from "@/features/users/queries";
import { getHospitalQueryOptions } from "@/features/hospitals/queries";

const getStatusConfig = (status: string) => {
  const s = status.toLowerCase();
  switch (s) {
    case "approved":
      return { color: "bg-green-500", icon: CheckCircle2 };
    case "pending":
      return { color: "bg-yellow-500", icon: Clock };
    case "completed":
      return { color: "bg-blue-500", icon: CheckCircle2 };
    case "cancelled":
    case "rejected":
      return { color: "bg-destructive", icon: AlertCircle };
    case "screening":
      return { color: "bg-purple-500", icon: Activity };
    default:
      return { color: "bg-secondary", icon: FileText };
  }
};

export default function DonationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const donationId = Number(id);

  const donationQuery = useQuery(getDonationQueryOptions(donationId));

  const donorQuery = useQuery({
    ...getDonorQueryOptions(donationQuery.data?.donorId ?? 0),
    enabled: !!donationQuery.data?.donorId,
  });

  const userQuery = useQuery({
    ...getUserQueryOptions(donorQuery.data?.userId ?? 0),
    enabled: !!donorQuery.data?.userId,
  });

  const hospitalQuery = useQuery({
    ...getHospitalQueryOptions(donationQuery.data?.hospitalId ?? 0),
    enabled: !!donationQuery?.data?.hospitalId,
  });

  const donation = donationQuery.data;
  //   const donor = donorQuery.data;
  const user = userQuery.data;
  const hospital = hospitalQuery.data;

  const isPending =
    donationQuery.isPending || donorQuery.isPending || userQuery.isPending;
  const isError =
    donationQuery.isError || donorQuery.isError || userQuery.isError;

  if (isPending)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );

  if (isError || !donation)
    return (
      <Card className="p-12 text-center max-w-2xl mx-auto mt-8 border-destructive/20 bg-destructive/5">
        <Typography variant="subtitle" className="text-destructive mb-2">
          Error Loading Data
        </Typography>
        <Typography variant="body" className="text-muted-foreground mb-6">
          We couldn't find the donation record you're looking for.
        </Typography>
        <Button asChild variant="outline">
          <Link to="/admin/donations">Back to List</Link>
        </Button>
      </Card>
    );

  const donationDateStr = new Date(donation.donationDate);
  const isValidDate = !isNaN(donationDateStr.getTime());
  const statusConfig = getStatusConfig(donation.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          asChild
          className="gap-2 -ml-2 text-muted-foreground hover:text-foreground"
        >
          <Link to="/admin/donations">
            <ArrowLeft className="size-4" />
            Back to List
          </Link>
        </Button>
        <Button asChild className="gap-2">
          <Link to={`/admin/donations/${donation.id}/edit`}>
            <Edit3 className="size-4" />
            Edit Record
          </Link>
        </Button>
      </div>

      <Card className="px-8 py-6">
        <header className="px-8 py-10 border-b bg-secondary/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge
                className={cn(
                  "text-white capitalize px-3 py-1 gap-1.5",
                  statusConfig.color,
                )}
              >
                <StatusIcon className="size-3.5" />
                {donation.status}
              </Badge>
              {donation.bloodGroup && (
                <Badge
                  variant="outline"
                  className="gap-1.5 border-primary/30 text-primary"
                >
                  <Droplet className="size-3.5 fill-current" />
                  {donation.bloodGroup}
                </Badge>
              )}
            </div>
            <Typography
              as={"h1"}
              variant={"title"}
              className="font-bold tracking-tight text-3xl"
            >
              Donation {donation.donationCode || `#${donation.id}`}
            </Typography>
          </div>
          <div className="flex flex-col items-end">
            <Typography
              variant="body"
              className="text-muted-foreground uppercase tracking-widest font-semibold mb-1 text-xs"
            >
              Donation Code
            </Typography>
            <div className="flex items-center gap-2 text-xl font-mono font-bold text-primary">
              <Hash className="size-5" />
              {donation.donationCode || "PENDING"}
            </div>
          </div>
        </header>

        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-8 col-span-1 md:col-span-2">
            <section>
              <Typography
                variant="subtitle"
                className="flex items-center gap-2 mb-4 text-primary"
              >
                <Activity className="size-5" />
                Donation Overview
              </Typography>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-secondary/5 rounded-xl p-6 border border-secondary/20">
                <div>
                  <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-1.5 block">
                    Donor Information
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <User className="size-5" />
                    </div>
                    <div>
                      <Typography variant="body" className="font-medium">
                        {user?.username || "Unknown Donor"}
                      </Typography>
                      <Typography
                        variant="body"
                        className="text-muted-foreground text-xs"
                      >
                        ID: {donation.donorId}
                      </Typography>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-1.5 block">
                    Hospital Entity
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                      <Home className="size-5" />
                    </div>
                    <div>
                      <Typography variant="body" className="font-medium">
                        {hospital?.name || "Partner Hospital"}
                      </Typography>
                      <Typography
                        variant="body"
                        className="text-muted-foreground text-xs"
                      >
                        ID: {donation.hospitalId}
                      </Typography>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-1.5 block">
                    Blood Group Type
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                      <Droplet className="size-5 fill-current" />
                    </div>
                    <div>
                      <Typography variant="body" className="font-bold text-lg">
                        {donation.bloodGroup}
                      </Typography>
                      <Typography
                        variant="body"
                        className="text-muted-foreground text-xs"
                      >
                        Compatible Types
                      </Typography>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-muted-foreground tracking-wider mb-1.5 block">
                    Units Contributed
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                      <Droplet className="size-5" />
                    </div>
                    <div>
                      <Typography variant="body" className="font-bold text-lg">
                        {donation.unitsDonated || "0"} Units
                      </Typography>
                      <Typography
                        variant="body"
                        className="text-muted-foreground text-xs"
                      >
                        Volume measurement
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <Typography
                variant="subtitle"
                className="flex items-center gap-2 mb-4 text-primary"
              >
                <FileText className="size-5" />
                Additional Remarks
              </Typography>
              <div className="bg-secondary/5 rounded-xl p-6 border border-secondary/20 min-h-[120px]">
                <Typography className="text-muted-foreground italic leading-relaxed whitespace-pre-wrap">
                  {donation.remarks ||
                    "No additional information provided for this donation record."}
                </Typography>
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
              <Typography
                variant="subtitle"
                className="text-sm font-bold uppercase tracking-widest mb-6 border-b pb-2 flex items-center gap-2"
              >
                <Calendar className="size-4" />
                Event Lifecycle
              </Typography>
              <div className="space-y-6">
                <div className="relative pl-6 border-l-2 border-primary/20 space-y-1">
                  <div className="absolute -left-[9px] top-1 size-4 rounded-full bg-primary border-2 border-background" />
                  <label className="text-[10px] font-bold text-primary uppercase tracking-tighter">
                    Scheduled Date
                  </label>
                  <Typography variant="body" className="font-medium text-sm">
                    {isValidDate
                      ? new Intl.DateTimeFormat("en-US", {
                          dateStyle: "long",
                        }).format(donationDateStr)
                      : "Not Scheduled"}
                  </Typography>
                </div>
                <div className="relative pl-6 border-l-2 border-secondary/20 space-y-1">
                  <div className="absolute -left-[9px] top-1 size-4 rounded-full bg-secondary border-2 border-background" />
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                    System Entry
                  </label>
                  <Typography
                    variant="body"
                    className="text-muted-foreground text-sm"
                  >
                    {new Date(donation.createdAt).toLocaleString()}
                  </Typography>
                </div>
                <div className="relative pl-6 border-l-2 border-secondary/20 space-y-1">
                  <div className="absolute -left-[9px] top-1 size-4 rounded-full bg-secondary border-2 border-background" />
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                    Last Modified
                  </label>
                  <Typography
                    variant="body"
                    className="text-muted-foreground text-sm"
                  >
                    {new Date(donation.updatedAt).toLocaleString()}
                  </Typography>
                </div>
              </div>
            </div>

            <div className="bg-secondary/10 rounded-xl p-4 flex items-center gap-3">
              <AlertCircle className="size-5 text-muted-foreground" />
              <Typography
                variant="body"
                className="text-muted-foreground leading-tight text-xs"
              >
                Records are immutable except for administrative corrections.
              </Typography>
            </div>
          </aside>
        </div>
      </Card>
    </div>
  );
}
