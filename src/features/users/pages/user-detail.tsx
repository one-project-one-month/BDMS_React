import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { getUserQueryOptions } from "../queries";

export default function UserDetailPage() {
  const { userId } = useParams();

  const idNum = useMemo(() => Number(userId), [userId]);
  const isValidId = Number.isInteger(idNum) && idNum > 0;

  const { data: user, isPending } = useQuery({
    ...getUserQueryOptions(idNum),
    enabled: isValidId,
  });

  /**
   * NOTE: back to list button နှစ်ခုထဲ့ရခြင်းသည် UX အတွက်ဖြစ်သည်။
   * Table သည် field များလာလျှင် user အား scroll ဆွဲစရာမလိုစေဘဲ list page ပြန်သွားနိုင်စေရန်အတွက် ဖြစ်သည်။
   */
  if (!isValidId) {
    return (
      <Card className="px-8">
        <header className="mb-6">
          <Typography as="h1" variant="subtitle">
            User Detail
          </Typography>
        </header>
        <section className="space-y-4">
          <div>
            <Button asChild variant="outline">
              <Link to="/admin/users">Back to User List</Link>
            </Button>
          </div>
          <Typography>Invalid user id.</Typography>
          <div>
            <Button asChild variant="outline">
              <Link to="/admin/users">Back to User List</Link>
            </Button>
          </div>
        </section>
      </Card>
    );
  }

  if (!isPending && !user) {
    return (
      <Card className="px-8">
        <header className="mb-6">
          <Typography as="h1" variant="subtitle">
            User Detail
          </Typography>
        </header>
        <section className="space-y-4">
          <div>
            <Button asChild variant="outline">
              <Link to="/admin/users">Back to User List</Link>
            </Button>
          </div>
          <Typography>User not found.</Typography>
          <div>
            <Button asChild variant="outline">
              <Link to="/admin/users">Back to User List</Link>
            </Button>
          </div>
        </section>
      </Card>
    );
  }

  return (
    <Card className="px-8">
      <header className="mb-6">
        <Typography as={"h1"} variant={"subtitle"}>
          User Detail
        </Typography>
      </header>

      <section className="space-y-6">
        <div>
          <Button asChild variant={"outline"}>
            <Link to={"/admin/users"}>Back to User List</Link>
          </Button>
        </div>
        <div className="overflow-hidden rounded-[10px] border">
          <Table>
            <TableBody>
              {isPending ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`} className="divide-x">
                    <TableCell>
                      <Skeleton className="h-4 w-28" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-28" />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <>
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
                </>
              )}
            </TableBody>
          </Table>
        </div>
        <div>
          <Button asChild variant={"outline"}>
            <Link to={"/admin/users"}>Back to User List</Link>
          </Button>
        </div>
      </section>
    </Card>
  );
}
