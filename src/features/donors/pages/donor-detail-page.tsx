import { Suspense, useMemo } from "react";
import { Link, useParams } from "react-router-dom";

import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import DonorDetailSkeleton from "../components/ui/donor-detail-skeleton";
import DonorDetailTable from "../components/donor-detail-table";

export default function DonorDetailPage() {
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
          <div>
            <Button asChild variant="outline">
              <Link to="/admin/donors">Back to Donor List</Link>
            </Button>
          </div>
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
        <Typography as={"h1"} variant={"subtitle"}>
          Donor Detail
        </Typography>
      </header>

      <section className="space-y-6">
        <Suspense fallback={<DonorDetailSkeleton />}>
          <DonorDetailTable id={idNum} />
        </Suspense>
      </section>
    </Card>
  );
}
