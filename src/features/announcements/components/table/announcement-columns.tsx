import type { ColumnDef } from "@tanstack/react-table";
import type { Announcement } from "../../announcement.types";

import { Edit, MoreHorizontal, Trash2 } from "lucide-react";
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

const basePath = "/admin/announcements";

type ColumnHandlers = {
  onRequestDelete: (announcement: Announcement) => void;
};

const formatExpiredAt = (expiredAt: Announcement["expiredAt"]) => {
  const date = new Date(expiredAt.year, expiredAt.month - 1, expiredAt.day);

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

export const buildColumns = ({
  onRequestDelete,
}: ColumnHandlers): ColumnDef<Announcement>[] => {
  return [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <p className="max-w-[240px] truncate font-medium">
          {row.original.title}
        </p>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.original.category}
        </Badge>
      ),
    },
    {
      accessorKey: "content",
      header: "Content",
      cell: ({ row }) => (
        <p className="max-w-[360px] truncate">{row.original.content}</p>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const announcement = row.original;

        return (
          <Badge
            variant="outline"
            className={cn(
              "text-secondary",
              announcement.isActive ? "bg-green-400" : "bg-destructive",
            )}
          >
            {announcement.isActive ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "expiredAt",
      header: "Expiry Date",
      cell: ({ row }) => formatExpiredAt(row.original.expiredAt),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const announcement = row.original;

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
                  to={`${basePath}/${announcement.id}/edit`}
                  className="flex items-center gap-2"
                >
                  <Edit className="size-4 shrink-0" />
                  <span>Edit Announcement</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="flex items-center text-primary hover:text-secondary! hover:bg-dark-primary! transition-colors duration-200 cursor-pointer"
                onClick={() => onRequestDelete(announcement)}
              >
                <Trash2 className="size-4 shrink-0 text-inherit" />
                <span>Delete Announcement</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};
