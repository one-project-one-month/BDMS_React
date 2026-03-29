import type { User } from "../user.types";
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

const basePath = "/admin/users";

type ColumnHandlers = {
  onRequestDelete: (user: User) => void;
};

export const buildColumns = ({
  onRequestDelete,
}: ColumnHandlers): ColumnDef<User>[] => {
  return [
    {
      accessorKey: "username",
      header: "User Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role.roleName",
      header: "Role",
      cell: ({ row }) => {
        const user = row.original;
        return <Badge variant="outline">{user.role.roleName}</Badge>;
      },
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <Badge
            variant="outline"
            className={cn(
              "cursor-pointer text-secondary",
              user.isActive ? "bg-green-400" : "bg-destructive",
            )}
          >
            {user.isActive ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const user = row.original;
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
                  to={`${basePath}/${user.userId}`}
                  className="flex items-center gap-2"
                >
                  <Eye className="size-4 shrink-0" />
                  <span>View Detail</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="cursor-pointer">
                <Link
                  to={`${basePath}/${user.userId}/edit`}
                  className="flex items-center gap-2"
                >
                  <Edit className="size-4 shrink-0" />
                  <span>Edit User</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="flex items-center text-primary hover:text-secondary! hover:bg-dark-primary! transition-colors duration-200 cursor-pointer"
                onClick={() => onRequestDelete(user)}
              >
                <Trash2 className="size-4 shrink-0 text-inherit" />
                <span>Delete User</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};
