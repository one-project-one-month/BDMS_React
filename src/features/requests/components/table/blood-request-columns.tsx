import { Edit, Eye, MoreHorizontal, Trash2, CalendarPlus } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import type {
  BloodRequestAdmin,
  BloodRequestStatusAdmin,
} from "../../request.types";

const basePath = "/admin/blood-requests";

type ColumnHandlers = {
  onRequestDelete: (request: BloodRequestAdmin) => void;
  onRequestStatusChange: (
    request: BloodRequestAdmin,
    newStatus: BloodRequestStatusAdmin,
  ) => void;
  onRequestCreateAppointment: (request: BloodRequestAdmin) => void;
};

const URGENCY_STYLES: Record<string, string> = {
  critical: "bg-red-600 text-white",
  high: "bg-orange-500 text-white",
  medium: "bg-yellow-400 text-yellow-900",
  low: "bg-green-400 text-green-900",
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "approved":
      return "bg-green-500";
    case "pending":
      return "bg-yellow-500";

    case "cancelled":
    case "rejected":
      return "bg-destructive";
    case "fulfilled":
      return "bg-purple-500";
    default:
      return "bg-secondary";
  }
};

const formatBloodGroup = (bloodGroup: string): string => {
  return bloodGroup.replace("negative", "-").replace("positive", "+");
};

export const buildColumns = ({
  onRequestDelete,
  onRequestStatusChange,
  onRequestCreateAppointment,
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
          {formatBloodGroup(row.original.bloodGroup)}
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
              "capitalize",
              URGENCY_STYLES[urgency] ?? "bg-gray-300 text-gray-800",
            )}
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
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const request = row.original;
        return (
          <Badge
            variant="outline"
            className={cn(
              "text-white capitalize",
              getStatusColor(request.status),
            )}
          >
            {request.status}
          </Badge>
        );
      },
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
              {request.status === "approved" && (
                <>
                  <DropdownMenuItem
                    onClick={() => onRequestCreateAppointment(request)}
                    className="cursor-pointer text-primary"
                  >
                    <CalendarPlus className="mr-2 h-4 w-4" />
                    <span>Create Appointment</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}

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

              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="cursor-pointer">
                  <span>Change Status</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={request.status}
                    onValueChange={(v) =>
                      onRequestStatusChange(
                        request,
                        v as BloodRequestStatusAdmin,
                      )
                    }
                  >
                    <DropdownMenuRadioItem value="pending">
                      Pending
                    </DropdownMenuRadioItem>

                    <DropdownMenuRadioItem value="approved">
                      Approved
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="fulfilled">
                      Fulfilled
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="rejected">
                      Rejected
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="cancelled">
                      Cancelled
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

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
