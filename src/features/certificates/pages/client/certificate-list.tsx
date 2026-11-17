import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import useAuth from "@/context/auth/useAuth";

import CertificateRequiredCard from "../../components/certificate-required-card";
import CertificateDataTable from "../../components/table/certificate-data-table";
import { buildColumns } from "../../components/table/certificate-columns";
import { getCertificatesQueryOptions } from "../../queries";

const columns = buildColumns("/client/certificates");

export default function ClientCertificateListPage() {
  const { user } = useAuth();
  const [titleFilter, setTitleFilter] = useState("");

  // No approved donor profile or no permission means the API would 403, so skip the request
  const donorId = user?.donor?.id;
  const canView =
    donorId != null &&
    user?.donor?.status !== "pending" &&
    !!user?.permissions?.includes("certificates.view");

  const {
    data: certificates = [],
    isPending,
    isError,
    error,
  } = useQuery({
    ...getCertificatesQueryOptions(donorId ?? 0),
    enabled: canView,
  });

  const filteredCertificates = useMemo(() => {
    const query = titleFilter.trim().toLowerCase();

    if (!query) {
      return certificates;
    }

    return certificates.filter((certificate) =>
      certificate.certificateTitle.toLowerCase().includes(query),
    );
  }, [certificates, titleFilter]);

  const isForbidden = isAxiosError(error) && error.response?.status === 403;

  if (!canView || isForbidden) {
    return (
      <Card className="px-8 py-6">
        <header className="mb-6">
          <Typography as="h1" variant="subtitle">
            My Certificates
          </Typography>
        </header>
        <CertificateRequiredCard forbidden={isForbidden || (donorId != null && user?.donor?.status !== "pending")} />
      </Card>
    );
  }

  return (
    <Card className="px-8 py-6">
      <header className="mb-6">
        <Typography as="h1" variant="subtitle">
          My Certificates
        </Typography>
      </header>

      <section>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <Input
            type="text"
            value={titleFilter}
            onChange={(event) => setTitleFilter(event.target.value)}
            placeholder="Filter by certificate title"
            className="w-full max-w-sm"
          />
        </div>

        {isError ? (
          <Typography className="text-destructive">
            {error instanceof Error ? error.message : "Unable to load your certificates."}
          </Typography>
        ) : (
          <CertificateDataTable
            columns={columns}
            data={filteredCertificates}
            isPending={isPending}
          />
        )}
      </section>
    </Card>
  );
}
