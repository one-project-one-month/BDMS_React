import type { Certificate } from "../../certificate.types";
import type { ColumnDef } from "@tanstack/react-table";

import { Eye, MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type BuildColumnsOptions = {
  basePath?: string;
};

const formatIssuedDate = (value: string | undefined) => {
  if (!value) {
    return "-";
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(parsed);
};

export const buildColumns = ({
  basePath = "/admin/certificates",
}: BuildColumnsOptions = {}): ColumnDef<Certificate>[] => {
  return [
    {
      accessorKey: "certificateTitle",
      header: "Title",
    },
    {
      id: "issuedAt",
      header: "Date Issued",
      cell: ({ row }) =>
        formatIssuedDate(row.original.createdAt ?? row.original.issuedAt),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const certificate = row.original;

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
                  to={`${basePath}/${certificate.id}`}
                  className="flex items-center gap-2"
                >
                  <Eye className="size-4 shrink-0" />
                  <span>View Detail</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};
