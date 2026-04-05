import { Link, Navigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import {
  bloodRequestDetailQueryOptions,
  requestKeys,
  updateBloodRequestStatusMutationOptions,
} from "../queries";
import type { BloodRequestStatus } from "../requests.types";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));

const statusTone: Record<BloodRequestStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-rose-100 text-rose-800",
  fulfilled: "bg-blue-100 text-blue-800",
  cancelled: "bg-slate-200 text-slate-800",
};

const nextStatuses: BloodRequestStatus[] = [
  "approved",
  "rejected",
  "fulfilled",
  "cancelled",
];

export default function RequestDetailPage() {
  const { requestId } = useParams<{ requestId: string }>();
  const numericRequestId = Number(requestId);
  const queryClient = useQueryClient();

  const isValidId = Boolean(requestId) && !Number.isNaN(numericRequestId);

  const { data: request, isPending } = useQuery({
    ...bloodRequestDetailQueryOptions(numericRequestId),
    enabled: isValidId,
  });

  const updateStatusMutation = useMutation({
    ...updateBloodRequestStatusMutationOptions,
    onSuccess: async (updatedRequest) => {
      queryClient.setQueryData(
        requestKeys.detail(updatedRequest.id),
        updatedRequest,
      );
      await queryClient.invalidateQueries({ queryKey: requestKeys.list() });
      toast.success("Request status updated.", {
        position: "bottom-right",
      });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to update request status.",
        { position: "bottom-right" },
      );
    },
  });

  if (!isValidId) {
    return <Navigate to="/admin/blood-requests" replace />;
  }

  if (isPending) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">
          Loading request details...
        </CardContent>
      </Card>
    );
  }

  if (!request) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-muted-foreground">
          Blood request not found.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <Typography as="p" className="text-sm text-muted-foreground">
              {request.bloodRequestCode}
            </Typography>
            <CardTitle>{request.patientName}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className={statusTone[request.status]}>
                {request.status}
              </Badge>
              <Badge variant="outline">{request.bloodGroup}</Badge>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link to="/admin/blood-requests">Back to List</Link>
            </Button>
            <Button asChild>
              <Link to={`/admin/blood-requests/${request.id}/edit`}>
                Edit Request
              </Link>
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Request Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Hospital</p>
              <p className="font-medium">{request.hospitalName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Required Date</p>
              <p className="font-medium">{formatDate(request.requiredDate)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Units Required</p>
              <p className="font-medium">{request.unitsRequired}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Request Type</p>
              <p className="font-medium capitalize">{request.requestType}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Relationship</p>
              <p className="font-medium capitalize">
                {request.relationshipToPatient}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Contact Phone</p>
              <p className="font-medium">{request.contactPhone}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-muted-foreground">Hospital Address</p>
              <p className="font-medium">{request.hospitalAddress}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-muted-foreground">Reason</p>
              <p className="font-medium leading-7">{request.reason}</p>
            </div>
            {request.additionalNotes && (
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground">
                  Additional Notes
                </p>
                <p className="font-medium leading-7">
                  {request.additionalNotes}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Update Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Typography className="text-sm text-muted-foreground">
              Change the request state as the review and fulfillment process
              progresses.
            </Typography>
            {nextStatuses.map((status) => (
              <Button
                key={status}
                type="button"
                variant={request.status === status ? "secondary" : "outline"}
                className="w-full justify-start capitalize"
                disabled={
                  updateStatusMutation.isPending || request.status === status
                }
                onClick={() =>
                  updateStatusMutation.mutate({ id: request.id, status })
                }
              >
                Mark as {status}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
