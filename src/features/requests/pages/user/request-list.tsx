import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import useAuth from "@/context/auth/useAuth";
import { bloodRequestsQueryOptions } from "../../queries";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import UserRequestDataTable from "../../components/user-request-data-table";
import { buildUserRequestColumns } from "../../components/user-request-columns";
import { toDateInputValue } from "../../request.utils";

export default function RequestListPage() {
  const { user } = useAuth();
  const [dateFilter, setDateFilter] = useState("");

  const {
    data: requests = [],
    isPending,
    isError,
    error,
  } = useQuery(bloodRequestsQueryOptions);

  const userRequests = useMemo(
    () => requests.filter((request) => request.userId === user?.userId),
    [requests, user?.userId],
  );

  const filteredUserRequests = useMemo(() => {
    if (!dateFilter) return userRequests;

    return userRequests.filter(
      (request) => toDateInputValue(request.requiredDate) === dateFilter,
    );
  }, [userRequests, dateFilter]);

  const requestLoadError =
    error instanceof Error
      ? error.message
      : "Unable to load your blood requests.";

  const columns = useMemo(() => buildUserRequestColumns(), []);

  return (
    <Card className="px-4 sm:px-6 md:px-8 py-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <Typography as={"h1"} variant={"subtitle"}>
          Blood Request List
        </Typography>
        <Button asChild className="w-full sm:w-auto text-center justify-center">
          <Link to="/client/blood-requests/create">Create Blood Request</Link>
        </Button>
      </header>

      <section>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <Input
            type="date"
            value={dateFilter}
            onChange={(event) => setDateFilter(event.target.value)}
            className="w-full max-w-xs"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => setDateFilter("")}
            disabled={!dateFilter}
          >
            Reset
          </Button>
        </div>

        {isError ? (
          <Typography className="text-destructive">{requestLoadError}</Typography>
        ) : (
          <UserRequestDataTable
            columns={columns}
            data={filteredUserRequests}
            isPending={isPending}
          />
        )}
      </section>
    </Card>
  );
}
