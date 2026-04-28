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
import type { BloodRequestAdmin } from "../../request.types";

const basePath = "/admin/blood-requests"; 

type ColumnHandlers = {
  onRequestDelete: (request: BloodRequestAdmin) => void;
  onRequestStatus: (request: BloodRequestAdmin) => void;
};

const URGENCY_STYLES: Record<string, string> = {
  critical: "bg-red-600 text-white",
  high: "bg-orange-500 text-white",
  medium: "bg-yellow-400 text-yellow-900",
  low: "bg-green-400 text-green-900",
};

const formatBloodGroup = (bloodGroup: string): string => {
  return bloodGroup.replace("negative", "-").replace("positive", "+");
};

export const buildColumns = ({
  onRequestDelete,
  onRequestStatus,
}: ColumnHandlers): ColumnDef<BloodRequestAdmin>[] => {
  return [
    {
      accessorKey: "patientName",
      header: "Patient Name",
    },
    {
      accessorKey: "bloodGroup",
      header: "Blood Group",
      cell: ({ row }) => (
        <Badge className="bg-red-500 text-white hover:bg-red-600 capitalize">
          {formatBloodGroup(row.original.bloodGroup)}{" "}
        </Badge>
      ),
    },
    {
      accessorKey: "unitsRequired",
      header: "Units Required",
      cell: ({ row }) => (
        <span className="font-medium">
          {row.original.unitsRequired} unit(s)
        </span>
      ),
    },
    {
      accessorKey: "urgency",
      header: "Urgency",
      cell: ({ row }) => {
        const urgency = row.original.urgency?.toLowerCase();
        return (
          <Badge
            className={cn(
              "capitalize cursor-pointer",
              URGENCY_STYLES[urgency] ?? "bg-gray-300 text-gray-800",
            )}
            onClick={() => onRequestStatus(row.original)}
          >
            {row.original.urgency}
          </Badge>
        );
      },
    },
    {
      accessorKey: "requiredDate",
      header: "Required Date",
      cell: ({ row }) => <span>{row.original.requiredDate ?? "—"}</span>,
    },
    {
      accessorKey: "contactPhone",
      header: "Contact Phone",
    },
    {
      accessorKey: "reason",
      header: "Reason",
      cell: ({ row }) => (
        <span
          className="max-w-[180px] truncate block"
          title={row.original.reason}
        >
          {row.original.reason ?? "—"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const request = row.original;
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
                  to={`${basePath}/${request.id}`}
                  className="flex items-center gap-2"
                >
                  <Eye className="size-4 shrink-0" />
                  <span>View Detail</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link
                  to={`${basePath}/${request.id}/edit`}
                  className="flex items-center gap-2"
                >
                  <Edit className="size-4 shrink-0" />
                  <span>Edit Request</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="flex items-center text-primary hover:text-secondary! hover:bg-dark-primary! transition-colors duration-200 cursor-pointer"
                onClick={() => onRequestDelete(request)}
              >
                <Trash2 className="size-4 shrink-0 text-inherit" />
                <span>Delete Request</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};
