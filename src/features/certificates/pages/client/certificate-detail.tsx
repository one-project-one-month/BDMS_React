import { Suspense, useMemo } from "react";
import { Link, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";

import CertificateDetailTable from "../../components/certificate-detail-table";
import CertificateDetailSkeleton from "../../components/ui/certificate-detail-skeleton";

export default function ClientCertificateDetailPage() {
  const { certificateId } = useParams();

  const idNum = useMemo(() => Number(certificateId), [certificateId]);
  const isValidId = Number.isInteger(idNum) && idNum > 0;

  if (!isValidId) {
    return (
      <Card className="px-8">
        <header className="mb-6">
          <Typography as="h1" variant="subtitle">
            Certificate Detail
          </Typography>
        </header>
        <section className="space-y-4">
          <div>
            <Button asChild variant="outline">
              <Link to="/client/certificates">Back to Certificate List</Link>
            </Button>
          </div>
          <Typography>Invalid certificate id.</Typography>
        </section>
      </Card>
    );
  }

  return (
    <Card className="px-8">
      <header className="mb-6">
        <Typography as="h1" variant="subtitle">
          Certificate Detail
        </Typography>
      </header>

      <section className="space-y-6">
        <Suspense fallback={<CertificateDetailSkeleton />}>
          <CertificateDetailTable id={idNum} backPath="/client/certificates" />
        </Suspense>
      </section>
    </Card>
  );
}
