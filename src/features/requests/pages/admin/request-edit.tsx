import { Suspense } from "react";
import { Link, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Typography } from "@/components/ui/typography";
import BloodRequestEditForm from "../../components/blood-request-edit-form";

export default function RequestEditPage() {
  const id = Number(useParams<{ requestId: string }>().requestId);
  const isValidId = Number.isInteger(id) && id > 0;

  return (
    <Card className="px-4 py-6 sm:px-6 md:px-8">
      <header className="mb-6">
        <Typography as="h1" variant="subtitle">Edit Blood Request</Typography>
      </header>
      {!isValidId ? (
        <section className="space-y-4">
          <Typography className="text-destructive">Invalid blood request ID.</Typography>
          <Button asChild variant="outline"><Link to="/admin/blood-requests">Back to Blood Requests</Link></Button>
        </section>
      ) : (
        <Suspense fallback={<Skeleton className="h-96 w-full" />}>
          <BloodRequestEditForm id={id} />
        </Suspense>
      )}
    </Card>
  );
}
