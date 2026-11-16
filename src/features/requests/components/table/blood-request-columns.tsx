import { Edit, Eye, MoreHorizontal } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { BloodRequest, BloodRequestStatus } from "../../request.types";

const basePath = "/admin/blood-requests";

const statusTone: Record<BloodRequestStatus, string> = {
  pending: "bg-yellow-500 text-white",
  approved: "bg-green-500 text-white",
  cancelled: "bg-destructive text-white",
  rejected: "bg-destructive text-white",
  fulfilled: "bg-purple-500 text-white",
};

export const buildColumns = (
  onRequestStatusChange: (request: BloodRequest, status: BloodRequestStatus) => void,
): ColumnDef<BloodRequest>[] => [
  { accessorKey: "bloodRequestCode", header: "Request" },
  { accessorKey: "patientName", header: "Patient" },
  { accessorKey: "hospitalName", header: "Hospital" },
  {
    accessorKey: "bloodGroup",
    header: "Blood Group",
    cell: ({ row }) => row.original.bloodGroup.replace("positive", "+").replace("negative", "-"),
  },
  { accessorKey: "unitsRequired", header: "Units" },
  { accessorKey: "requiredDate", header: "Required Date" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge className={cn("capitalize", statusTone[row.original.status])}>
        {row.original.status}
      </Badge>
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
            <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Open request actions">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to={`${basePath}/${request.id}`}><Eye className="mr-2 h-4 w-4" />View details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={`${basePath}/${request.id}/edit`}><Edit className="mr-2 h-4 w-4" />Edit request</Link>
            </DropdownMenuItem>
            {request.status === "pending" && <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onRequestStatusChange(request, "approved")}>
                Approve (creates appointment)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onRequestStatusChange(request, "rejected")}>
                Reject request
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onRequestStatusChange(request, "cancelled")}>
                Cancel request
              </DropdownMenuItem>
            </>}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
