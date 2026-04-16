import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

import useAuth from "@/context/auth/useAuth";
import { bloodRequestsQueryOptions } from "../../queries";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import type { BloodRequestStatus } from "../../requests.types";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));

const statusTone: Record<BloodRequestStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-rose-100 text-rose-800",
  fulfilled: "bg-blue-100 text-blue-800",
  cancelled: "bg-slate-200 text-slate-800",
};

export default function RequestListPage() {
  const { user } = useAuth();

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

  const requestLoadError =
    error instanceof Error
      ? error.message
      : "Unable to load your blood requests.";

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div className="space-y-2">
        <Typography as="h1" variant="subtitle">
          Blood Requests
        </Typography>
        <Typography className="max-w-3xl text-muted-foreground">
          Review your submitted blood request forms and create a new one when
          another request is needed.
        </Typography>
      </div>

      {isPending ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            Loading your blood requests...
          </CardContent>
        </Card>
      ) : isError ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            {requestLoadError}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {userRequests.map((request) => {
            const isCompleted = request.status === "fulfilled";

            return (
              <Card key={request.id} className="border shadow-sm">
                <CardHeader className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <Typography className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {request.bloodRequestCode}
                      </Typography>
                      <CardTitle className="text-lg">
                        {request.patientName}
                      </CardTitle>
                    </div>
                    <Badge
                      variant="secondary"
                      className={statusTone[request.status]}
                    >
                      {request.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1 text-sm">
                    <p className="text-muted-foreground">
                      Hospital:{" "}
                      <span className="font-medium text-foreground">
                        {request.hospitalName}
                      </span>
                    </p>
                    <p className="text-muted-foreground">
                      Required Date:{" "}
                      <span className="font-medium text-foreground">
                        {formatDate(request.requiredDate)}
                      </span>
                    </p>
                    <p className="text-muted-foreground">
                      Blood Group:{" "}
                      <span className="font-medium text-foreground">
                        {request.bloodGroup}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between rounded-md bg-muted/30 px-3 py-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      Form status
                    </span>
                    <Badge variant={isCompleted ? "secondary" : "outline"}>
                      {isCompleted ? "Completed" : "Not Completed"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          <Link
            to="/client/blood-requests/create"
            className="flex min-h-72 flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-primary/35 bg-background p-6 text-center shadow-sm transition hover:border-primary hover:bg-primary/5"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Plus className="h-7 w-7" />
            </span>
            <div className="space-y-1">
              <Typography className="font-semibold text-primary">
                Create New Form
              </Typography>
              <Typography className="text-sm text-muted-foreground">
                Start another blood request submission.
              </Typography>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
