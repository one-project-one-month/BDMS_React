import type { Donation, DonationStatus } from "../donation.types";
import type { ColumnDef } from "@tanstack/react-table";

import { Edit, Eye, MoreHorizontal, Trash2, CalendarPlus } from "lucide-react";

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

const basePath = "/admin/donations";

type ColumnHandlers = {
    onRequestDelete: (donation: Donation) => void;
    onRequestStatusChange: (donation: Donation, newStatus: DonationStatus) => void;
    onRequestCreateAppointment: (donation: Donation) => void;
};

const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case 'approved': return 'bg-green-500';
        case 'pending': return 'bg-yellow-500';
        case 'completed': return 'bg-blue-500';
        case 'cancelled':
        case 'rejected': return 'bg-destructive';
        case 'screening': return 'bg-purple-500';
        default: return 'bg-secondary';
    }
}

export const buildColumns = ({
    onRequestDelete,
    onRequestStatusChange,
    onRequestCreateAppointment,
}: ColumnHandlers): ColumnDef<Donation>[] => {
    return [
        {
            accessorKey: "donationCode",
            header: "Code",
            cell: ({ row }) => row.original.donationCode || "-",
        },
        {
            id: "donor",
            accessorFn: (row) => row.donor?.username || `Donor #${row.donorId}`,
            header: "Donor",
        },
        {
            id: "hospital",
            accessorFn: (row) => row.hospital?.hospitalName || `Hospital #${row.hospitalId}`,
            header: "Hospital",
        },
        {
            accessorKey: "bloodGroup",
            header: "Blood Group",
            cell: ({ row }) => <Badge variant="outline">{row.original.bloodGroup}</Badge>
        },
        {
            accessorKey: "donationDate",
            header: "Date",
            cell: ({ row }) => {
                const d = new Date(row.original.donationDate);
                return isNaN(d.getTime()) ? "-" : new Intl.DateTimeFormat('en-US').format(d);
            }
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const donation = row.original;
                return (
                    <Badge
                        variant="outline"
                        className={cn("text-white capitalize", getStatusColor(donation.status))}
                    >
                        {donation.status}
                    </Badge>
                );
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const donation = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {donation.status === "approved" && (
                                <>
                                    <DropdownMenuItem onClick={() => onRequestCreateAppointment(donation)} className="cursor-pointer text-primary">
                                        <CalendarPlus className="mr-2 h-4 w-4" />
                                        <span>Create Appointment</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                </>
                            )}

                            <DropdownMenuItem asChild className="cursor-pointer">
                                <Link to={`${basePath}/${donation.id}`} className="flex items-center gap-2">
                                    <Eye className="size-4 shrink-0" />
                                    <span>View Detail</span>
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild className="cursor-pointer">
                                <Link to={`${basePath}/${donation.id}/edit`} className="flex items-center gap-2">
                                    <Edit className="size-4 shrink-0" />
                                    <span>Edit</span>
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger className="cursor-pointer">
                                    <span>Change Status</span>
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent>
                                    <DropdownMenuRadioGroup value={donation.status} onValueChange={(v) => onRequestStatusChange(donation, v as DonationStatus)}>
                                        <DropdownMenuRadioItem value="pending">Pending</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="screening">Screening</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="approved">Approved</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="completed">Completed</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="rejected">Rejected</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value="cancelled">Cancelled</DropdownMenuRadioItem>
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuSubContent>
                            </DropdownMenuSub>

                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="flex items-center text-primary hover:text-secondary! hover:bg-dark-primary! transition-colors duration-200 cursor-pointer"
                                onClick={() => onRequestDelete(donation)}
                            >
                                <Trash2 className="size-4 shrink-0 text-inherit" />
                                <span>Delete</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];
};
