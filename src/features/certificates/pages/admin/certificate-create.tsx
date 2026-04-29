import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import CertificateCreateForm from "../../components/certificate-create-form";
import CertificateFormSkeleton from "../../components/ui/certificate-form-skeleton";

export default function CertificateCreatePage() {
  return (
    <Card className="px-8">
      <header className="mb-6">
        <Typography as="h1" variant="subtitle">
          Generate New Certificate
        </Typography>
      </header>

      <section>
        <Suspense fallback={<CertificateFormSkeleton />}>
          <CertificateCreateForm />
        </Suspense>
      </section>
    </Card>
  );
}