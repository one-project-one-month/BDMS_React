import type { Donor } from "../donor.types";
import type { ColumnDef } from "@tanstack/react-table";

import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const basePath = "/admin/donors";

type ColumnHandlers = {
  onRequestDelete: (donor: Donor) => void;
};

export const buildColumns = ({
  onRequestDelete,
}: ColumnHandlers): ColumnDef<Donor>[] => {
  return [
    {
      accessorKey: "nicNo",
      header: "NIC No",
    },
    {
      accessorKey: "dateOfBirth",
      header: "Date of Birth",
      cell: ({ row }) => {
        const donor = row.original;
        return <span>{donor.dateOfBirth}</span>;
      },
    },
    {
      accessorKey: "gender",
      header: "Gender",
      cell: ({ row }) => {
        const donor = row.original;
        return (
          <Badge variant="outline" className="capitalize">
            {donor.gender}
          </Badge>
        );
      },
    },
    {
      accessorKey: "bloodGroup",
      header: "Blood Group",
      cell: ({ row }) => {
        const donor = row.original;
        return (
          <Badge className="bg-red-500 text-white hover:bg-red-600">
            {donor.bloodGroup}
          </Badge>
        );
      },
    },
    {
      accessorKey: "lastDonationDate",
      header: "Last Donation",
      cell: ({ row }) => {
        const donor = row.original;
        return (
          <span>{donor.lastDonationDate ? donor.lastDonationDate : "—"}</span>
        );
      },
    },
    {
      accessorKey: "emergencyContact",
      header: "Emergency Contact",
    },
    {
      accessorKey: "emergencyPhone",
      header: "Emergency Phone",
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const donor = row.original;
        return (
          <Badge
            variant="outline"
            className={cn(
              "cursor-pointer text-secondary",
              donor.isActive ? "bg-green-400" : "bg-destructive",
            )}
          >
            {donor.isActive ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const donor = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link
                  to={`${basePath}/${donor.id}`}
                  className="flex items-center gap-2"
                >
                  <Eye className="size-4 shrink-0" />
                  <span>View Detail</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="cursor-pointer">
                <Link
                  to={`${basePath}/${donor.id}/edit`}
                  className="flex items-center gap-2"
                >
                  <Edit className="size-4 shrink-0" />
                  <span>Edit Donor</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="flex items-center text-primary hover:text-secondary! hover:bg-dark-primary! transition-colors duration-200 cursor-pointer"
                onClick={() => onRequestDelete(donor)}
              >
                <Trash2 className="size-4 shrink-0 text-inherit" />
                <span>Delete Donor</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};
