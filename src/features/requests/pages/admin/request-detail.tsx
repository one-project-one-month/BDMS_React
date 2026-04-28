import { Suspense, useMemo } from "react";
import { Link, useParams } from "react-router-dom";

import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import BloodRequestDetailTable from "../../components/table/blood-request-detail-table";
import DonorDetailSkeleton from "@/features/donors/components/ui/donor-detail-skeleton";
// import BloodRequestDetailSkeleton from "../components/ui/blood-request-detail-skeleton";
// import BloodRequestDetailTable from "../components/blood-request-detail-table";

export default function AdminRequestDetailPage() {
  const { requestId } = useParams();
  const idNum = useMemo(() => Number(requestId), [requestId]);
  const isValidId = Number.isInteger(idNum) && idNum > 0;

  if (!isValidId) {
    return (
      <Card className="px-8">
        <header className="mb-6">
          <Typography as="h1" variant="subtitle">
            Blood Request Detail
          </Typography>
        </header>
        <section className="space-y-4">
          <Typography>Invalid blood request id.</Typography>
          <div>
            <Button asChild variant="outline">
              <Link to="/admin/blood-requests">Back to Blood Request List</Link>
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
          Blood Request Detail
        </Typography>
      </header>

      <section className="space-y-6">
        <Suspense fallback={<DonorDetailSkeleton />}>
          <BloodRequestDetailTable id={idNum} />
        </Suspense>
      </section>
    </Card>
  );
}
