import type { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Donation } from "../donation.types";

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "approved":
      return "bg-green-500";
    case "pending":
      return "bg-yellow-500";
    case "completed":
      return "bg-blue-500";
    case "cancelled":
    case "rejected":
      return "bg-destructive";
    case "screening":
      return "bg-purple-500";
    default:
      return "bg-secondary";
  }
};

const formatDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
  }).format(date);
};

export const clientDonationColumns: ColumnDef<Donation>[] = [
  {
    accessorKey: "donationCode",
    header: "Code",
    cell: ({ row }) => row.original.donationCode || "-",
  },
  {
    id: "hospital",
    accessorFn: (row) =>
      row.hospital?.hospitalName || `Hospital #${row.hospitalId}`,
    header: "Hospital",
    cell: ({ row }) =>
      row.original.hospital?.hospitalName || `Hospital #${row.original.hospitalId}`,
  },
  {
    accessorKey: "bloodGroup",
    header: "Blood Group",
    cell: ({ row }) => (
      <Badge variant="outline">{row.original.bloodGroup}</Badge>
    ),
  },
  {
    accessorKey: "unitsDonated",
    header: "Units",
    cell: ({ row }) => row.original.unitsDonated ?? "-",
  },
  {
    accessorKey: "donationDate",
    header: "Date",
    cell: ({ row }) => formatDate(row.original.donationDate),
  },
  {
    accessorKey: "remarks",
    header: "Remarks",
    cell: ({ row }) => row.original.remarks || "-",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={cn(
          "text-white capitalize",
          getStatusColor(row.original.status),
        )}
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Button asChild variant="outline" size="sm">
        <Link to={`/client/donations/${row.original.id}`}>
          <Eye className="size-4" />
          View Detail
        </Link>
      </Button>
    ),
  },
];
