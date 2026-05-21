import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { getUserQueryOptions } from "../queries";

export default function UserDetailTable({ id }: { id: number }) {
  const { data: user } = useSuspenseQuery(getUserQueryOptions(id));

  return (
    <>
      <div>
        <Button asChild variant={"outline"}>
          <Link to={"/admin/users"}>Back to User List</Link>
        </Button>
      </div>
      <div className="w-full overflow-x-auto rounded-[10px] border">
        <Table>
          <TableBody>
            <TableRow className="divide-x">
              <TableCell>User Name</TableCell>
              <TableCell>{user?.username}</TableCell>
            </TableRow>
            <TableRow className="divide-x">
              <TableCell>Email</TableCell>
              <TableCell>{user?.email}</TableCell>
            </TableRow>
            <TableRow className="divide-x">
              <TableCell>Role</TableCell>
              <TableCell>{user?.role.roleName ?? "-"}</TableCell>
            </TableRow>
            <TableRow className="divide-x">
              <TableCell>Hospital</TableCell>
              <TableCell>{user?.hospital?.hospitalName ?? "-"}</TableCell>
            </TableRow>
            <TableRow className="divide-x">
              <TableCell>Status</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-secondary",
                    user?.isActive ? "bg-green-400" : "bg-destructive",
                  )}
                >
                  {user?.isActive ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div>
        <Button asChild variant={"outline"}>
          <Link to={"/admin/users"}>Back to User List</Link>
        </Button>
      </div>
    </>
  );
}
