import { Suspense, useMemo } from "react";
import { Link, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import useAuth from "@/context/auth/useAuth";

import CertificateDetailTable from "../../components/certificate-detail-table";
import CertificateDetailSkeleton from "../../components/ui/certificate-detail-skeleton";
import CertificateRequiredCard from "../../components/certificate-required-card";

export default function ClientCertificateDetailPage() {
  const { certificateId } = useParams();
  const { user } = useAuth();

  const idNum = useMemo(() => Number(certificateId), [certificateId]);
  const isValidId = Number.isInteger(idNum) && idNum > 0;
  // Same rule as the list: skip the request and show the guard when the API would 403
  const canView =
    user?.donor != null &&
    user.donor.status !== "pending" &&
    !!user.permissions?.includes("certificates.view");

  if (!canView) {
    return (
      <Card className="px-8">
        <header className="mb-6">
          <Typography as="h1" variant="subtitle">
            Certificate Detail
          </Typography>
        </header>
        <CertificateRequiredCard
          forbidden={user?.donor != null && user.donor.status !== "pending"}
        />
      </Card>
    );
  }

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
