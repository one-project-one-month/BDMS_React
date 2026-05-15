import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Typography } from "@/components/ui/typography";
import useAuth from "@/context/auth/useAuth";

import CertificateDataTable from "../../components/table/certificate-data-table";
import { buildColumns } from "../../components/table/certificate-columns";
import {
  getCertificatesQueryOptions,
  getDonorListQueryOptions,
} from "../../queries";

type DonorProfileRecord = Record<string, unknown>;

const getNestedRecord = (value: unknown, key: string) => {
  if (!value || typeof value !== "object" || !(key in value)) {
    return undefined;
  }

  const nested = (value as DonorProfileRecord)[key];
  return nested && typeof nested === "object"
    ? (nested as DonorProfileRecord)
    : undefined;
};

const getPositiveNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
};

const getDonorIdFromProfile = (profile: unknown) => {
  if (!profile || typeof profile !== "object") {
    return undefined;
  }

  const record = profile as DonorProfileRecord;
  const nestedDonor = getNestedRecord(record, "donor");

  return (
    getPositiveNumber(record.donorId) ??
    getPositiveNumber(record.donorID) ??
    getPositiveNumber(record.donorProfileId) ??
    getPositiveNumber(record.id) ??
    getPositiveNumber(nestedDonor?.donorId) ??
    getPositiveNumber(nestedDonor?.donorID) ??
    getPositiveNumber(nestedDonor?.id)
  );
};

const columns = buildColumns({ basePath: "/client/certificates" });

export default function ClientCertificateListPage() {
  const { user } = useAuth();
  const [titleFilter, setTitleFilter] = useState("");

  const {
    data: donors = [],
    isPending: isDonorListPending,
    isError: isDonorListError,
    error: donorListError,
  } = useQuery(getDonorListQueryOptions);

  const donorId = useMemo(() => {
    const directDonorId = getDonorIdFromProfile(user?.donor);
    if (directDonorId != null) {
      return directDonorId;
    }

    return donors.find((donor) => donor.userId === user?.userId)?.donorId;
  }, [donors, user?.donor, user?.userId]);

  const {
    data: certificates = [],
    isPending: isCertificatesPending,
    isError,
    error,
  } = useQuery({
    ...getCertificatesQueryOptions(donorId ?? 0),
    enabled: donorId != null,
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

  const loadError = donorListError ?? error;
  const certificateLoadError =
    loadError instanceof Error
      ? loadError.message
      : "Unable to load your certificates.";

  const isPending =
    isDonorListPending || (donorId != null && isCertificatesPending);

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

        {isDonorListError || isError ? (
          <Typography className="text-destructive">
            {certificateLoadError}
          </Typography>
        ) : donorId == null && !isDonorListPending ? (
          <Typography className="text-muted-foreground">
            No donor profile was found for this account yet.
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
