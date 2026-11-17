import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";
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

import type { MedicalRecord } from "../../medical-records.types";

const basePath = "/admin/medical-records";

type ColumnHandlers = {
  onRequestDelete: (record: MedicalRecord) => void;
};

const getScreeningStatusLabel = (status: number) => {
  switch (status) {
    case 0:
      return "Pending";
    case 1:
      return "Approved";
    case 2:
      return "Rejected";
    default:
      return `Status ${status}`;
  }
};

const getScreeningStatusVariant = (status: number) => {
  switch (status) {
    case 1:
      return "default" as const;
    case 2:
      return "destructive" as const;
    default:
      return "secondary" as const;
  }
};

const getResultLabel = (value: number) => {
  switch (value) {
    case 0:
      return "Negative";
    case 1:
      return "Positive";
    default:
      return `Result ${value}`;
  }
};

const formatDateTime = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
};

export const buildColumns = ({
  onRequestDelete,
}: ColumnHandlers): ColumnDef<MedicalRecord>[] => {
  return [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <span className="font-medium">{row.original.id}</span>,
    },
    {
      accessorKey: "donationId",
      header: "Donation",
      cell: ({ row }) => <span>#{row.original.donationId}</span>,
    },
    {
      accessorKey: "hospitalId",
      header: "Hospital",
      cell: ({ row }) => <span>#{row.original.hospitalId}</span>,
    },
    {
      accessorKey: "hemoglobinLevel",
      header: "Hemoglobin",
      cell: ({ row }) => <span>{row.original.hemoglobinLevel.toFixed(1)}</span>,
    },
    {
      id: "labResults",
      header: "Lab Results",
      cell: ({ row }) => {
        const record = row.original;

        return (
          <div className="flex flex-wrap gap-1">
            <Badge variant="outline">HIV: {getResultLabel(record.hivResult)}</Badge>
            <Badge variant="outline">
              HBV: {getResultLabel(record.hepatitisBResult)}
            </Badge>
            <Badge variant="outline">
              HCV: {getResultLabel(record.hepatitisCResult)}
            </Badge>
            <Badge variant="outline">
              Malaria: {getResultLabel(record.malariaResult)}
            </Badge>
            <Badge variant="outline">
              Syphilis: {getResultLabel(record.syphilisResult)}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "screeningNotes",
      header: "Notes",
      cell: ({ row }) => {
        const notes = row.original.screeningNotes || "-";

        return (
          <div className="max-w-[280px] truncate" title={notes}>
            {notes}
          </div>
        );
      },
    },
    {
      accessorKey: "screenedBy",
      header: "Screened By",
      cell: ({ row }) => <span>#{row.original.screenedBy}</span>,
    },
    {
      accessorKey: "screeningAt",
      header: "Screened At",
      cell: ({ row }) => <span>{formatDateTime(row.original.screeningAt)}</span>,
    },
    {
      accessorKey: "screeningStatus",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.screeningStatus;

        return (
          <Badge variant={getScreeningStatusVariant(status)}>
            {getScreeningStatusLabel(status)}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const record = row.original;

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
                  to={`${basePath}/${record.id}`}
                  className="flex items-center gap-2"
                >
                  <Eye className="size-4 shrink-0" />
                  <span>View Detail</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="cursor-pointer">
                <Link
                  to={`${basePath}/${record.id}/edit`}
                  className="flex items-center gap-2"
                >
                  <Edit className="size-4 shrink-0" />
                  <span>Edit Record</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="flex cursor-pointer items-center text-primary transition-colors duration-200 hover:bg-dark-primary! hover:text-secondary!"
                onClick={() => onRequestDelete(record)}
              >
                <Trash2 className="size-4 shrink-0 text-inherit" />
                <span>Delete Record</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};
