import { Suspense } from "react";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Typography } from "@/components/ui/typography";
import BloodRequestCreateForm from "../../components/blood-request-form-admin";

export default function RequestCreatePage() {
  return (
    <Card className="px-4 py-6 sm:px-6 md:px-8">
      <header className="mb-6">
        <Typography as="h1" variant="subtitle">Create Blood Request</Typography>
      </header>
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <BloodRequestCreateForm />
      </Suspense>
    </Card>
  );
}
