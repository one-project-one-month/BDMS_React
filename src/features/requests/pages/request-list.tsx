import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Typography } from "@/components/ui/typography";
import { bloodRequestsQueryOptions } from "../queries";
import type { BloodRequestStatus } from "../requests.types";

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
  const {
    data: requests = [],
    isPending,
    isError,
    error,
  } = useQuery(bloodRequestsQueryOptions);

  const summary = {
    total: requests.length,
    pending: requests.filter((request) => request.status === "pending").length,
    approved: requests.filter((request) => request.status === "approved").length,
    fulfilled: requests.filter((request) => request.status === "fulfilled").length,
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{summary.total}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{summary.pending}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Approved
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{summary.approved}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Fulfilled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{summary.fulfilled}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <CardTitle>Blood Requests</CardTitle>
            <Typography className="text-muted-foreground">
              Review incoming requests, inspect request details, and update the
              request status.
            </Typography>
          </div>
          <Button asChild variant="outline">
            <Link to="/client/blood-requests">Open Create Form</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Hospital</TableHead>
                  <TableHead>Blood</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead>Required Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isPending ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      Loading blood requests...
                    </TableCell>
                  </TableRow>
                ) : isError ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      {error instanceof Error
                        ? error.message
                        : "Unable to load blood requests."}
                    </TableCell>
                  </TableRow>
                ) : requests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No blood requests have been submitted yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">
                        {request.bloodRequestCode}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p>{request.patientName}</p>
                          <p className="text-xs text-muted-foreground">
                            {request.contactPhone}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{request.hospitalName}</TableCell>
                      <TableCell>{request.bloodGroup}</TableCell>
                      <TableCell>{request.unitsRequired}</TableCell>
                      <TableCell>{formatDate(request.requiredDate)}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={statusTone[request.status]}
                        >
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button asChild size="sm" variant="outline">
                            <Link to={`/admin/blood-requests/${request.id}`}>
                              View
                            </Link>
                          </Button>
                          <Button asChild size="sm">
                            <Link to={`/admin/blood-requests/${request.id}/edit`}>
                              Edit
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
