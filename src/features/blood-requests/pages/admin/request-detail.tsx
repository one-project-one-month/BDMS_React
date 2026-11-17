import { Suspense } from "react";
import { Link, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Typography } from "@/components/ui/typography";
import BloodRequestDetailTable from "../../components/table/blood-request-detail-table";

export default function RequestDetailPage() {
  const id = Number(useParams<{ requestId: string }>().requestId);
  const isValidId = Number.isInteger(id) && id > 0;

  return (
    <Card className="space-y-6 px-4 py-6 sm:px-6 md:px-8">
      <header>
        <Typography as="h1" variant="subtitle">Blood Request Details</Typography>
      </header>
      {!isValidId ? (
        <section className="space-y-4">
          <Typography className="text-destructive">Invalid blood request ID.</Typography>
          <Button asChild variant="outline"><Link to="/admin/blood-requests">Back to Blood Requests</Link></Button>
        </section>
      ) : (
        <Suspense fallback={<Skeleton className="h-96 w-full" />}>
          <BloodRequestDetailTable id={id} />
        </Suspense>
      )}
    </Card>
  );
}
