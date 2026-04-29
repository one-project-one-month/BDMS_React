import { Suspense, useMemo } from "react";
import { Link, useParams } from "react-router-dom";

import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";

import DonorEditForm from "../components/donor-edit-form";
import DonorFormSkeleton from "../components/ui/donor-form-skeleton";

export default function DonorEditPage() {
  const { donorId } = useParams();

  const idNum = useMemo(() => Number(donorId), [donorId]);
  const isValidId = Number.isInteger(idNum) && idNum > 0;

  if (!isValidId) {
    return (
      <Card className="px-8">
        <header className="mb-6">
          <Typography as="h1" variant="subtitle">
            Donor Detail
          </Typography>
        </header>
        <section className="space-y-4">
          <Typography>Invalid donor id.</Typography>
          <div>
            <Button asChild variant="outline">
              <Link to="/admin/donors">Back to Donor List</Link>
            </Button>
          </div>
        </section>
      </Card>
    );
  }

  return (
    <Card className="px-8">
      <header className="mb-6">
        <Typography as="h1" variant="subtitle">
          Edit Donor
        </Typography>
      </header>

      <section>
        <Suspense fallback={<DonorFormSkeleton />}>
          <DonorEditForm id={idNum} />
        </Suspense>
      </section>
    </Card>
  );
}
