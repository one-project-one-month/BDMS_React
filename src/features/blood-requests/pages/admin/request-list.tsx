import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import BloodRequestDataTable from "../../components/table/blood-request-data-table";
import { buildColumns } from "../../components/table/blood-request-columns";
import {
  bloodRequestsQueryOptions,
  requestKeys,
  updateBloodRequestStatusMutationOptions,
} from "../../queries";

export default function RequestListPage() {
  const queryClient = useQueryClient();
  const { data: requests = [], isPending: isLoading, isError, error } = useQuery(bloodRequestsQueryOptions);
  const { mutate: updateStatus, isPending: isUpdating } = useMutation({
    ...updateBloodRequestStatusMutationOptions,
    onSuccess: async (request) => {
      await queryClient.invalidateQueries({ queryKey: requestKeys.all });
      await queryClient.invalidateQueries({ queryKey: requestKeys.detail(request.id) });
      toast.success({
        approved: "Request approved and appointment created.",
        rejected: "Request rejected.",
        cancelled: "Request cancelled.",
        pending: "Request updated.",
        fulfilled: "Request fulfilled.",
      }[request.status]);
    },
    onError: (updateError) => toast.error(updateError instanceof Error ? updateError.message : "Unable to update request status."),
  });
  const columns = useMemo(
    () => buildColumns((request, status) => updateStatus({ id: request.id, status })),
    [updateStatus],
  );

  return (
    <Card className="px-4 py-6 sm:px-6 md:px-8">
      <header className="mb-6 flex items-center justify-between gap-4">
        <Typography as="h1" variant="subtitle">Blood Requests</Typography>
        <Button asChild><Link to="/admin/blood-requests/create">Create Request</Link></Button>
      </header>
      {isError ? (
        <Typography className="text-destructive">
          {error instanceof Error ? error.message : "Unable to load blood requests."}
        </Typography>
      ) : (
        <div aria-busy={isUpdating}>
          <BloodRequestDataTable columns={columns} data={requests} isPending={isLoading} />
        </div>
      )}
    </Card>
  );
}
