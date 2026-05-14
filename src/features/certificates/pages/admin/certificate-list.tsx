import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import CertificateDataTable from "../../components/table/certificate-data-table";
import { buildColumns } from "../../components/table/certificate-columns";

import {
  getCertificateListQueryOptions,
  getCertificatesQueryOptions,
} from "../../queries";

const columns = buildColumns();

export default function CertificateListPage() {
  const [donorFilterInput, setDonorFilterInput] = useState("");

  const donorId = useMemo(() => {
    const trimmed = donorFilterInput.trim();
    if (!trimmed) {
      return null;
    }

    const parsed = Number(trimmed);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
  }, [donorFilterInput]);

  const queryOptions =
    donorId != null
      ? getCertificatesQueryOptions(donorId)
      : getCertificateListQueryOptions;

  const { data: certificates, isPending } = useQuery(queryOptions);

  const clearFilter = () => setDonorFilterInput("");

  return (
    <Card className="px-8 py-6">
      <header className="flex items-center justify-between mb-6">
        <Typography as="h1" variant="subtitle">
          Certificate List
        </Typography>
        <Button asChild>
          <Link to="/admin/certificates/create">Create Certificate</Link>
        </Button>
      </header>

      <section className="mb-4 flex flex-wrap items-end gap-3">
        <div className="w-full max-w-xs space-y-1">
          <Typography as="p" variant="body" className="text-sm text-muted-foreground">
            Filter by Donor ID
          </Typography>
          <Input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Enter donor id"
            value={donorFilterInput}
            onChange={(event) => setDonorFilterInput(event.target.value)}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={clearFilter}
          disabled={!donorFilterInput}
        >
          Clear Filter
        </Button>
      </section>

      <section>
        <CertificateDataTable
          columns={columns}
          data={certificates ?? []}
          isPending={isPending}
        />
      </section>
    </Card>
  );
}