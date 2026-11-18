import type { User } from "../../user.types";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const basePath = "/admin/users";

type ColumnHandlers = {
  onRequestDelete: (user: User) => void;
  onRequestStatus: (user: User) => void;
};

export const buildColumns = ({
  onRequestDelete,
  onRequestStatus,
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
            onClick={() => onRequestStatus(user)}
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
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="size-8 text-muted-foreground hover:text-foreground"
              title="View Detail"
            >
              <Link to={`${basePath}/${user.userId}`}>
                <Eye className="size-4" />
                <span className="sr-only">View Detail</span>
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              asChild
              className="size-8 text-muted-foreground hover:text-foreground"
              title="Edit User"
            >
              <Link to={`${basePath}/${user.userId}/edit`}>
                <Pencil className="size-4" />
                <span className="sr-only">Edit User</span>
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              onClick={() => onRequestDelete(user)}
              title="Delete User"
            >
              <Trash2 className="size-4" />
              <span className="sr-only">Delete User</span>
            </Button>
          </div>
        );
      },
    },
  ];
};
