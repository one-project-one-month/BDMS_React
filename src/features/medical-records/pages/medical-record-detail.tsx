import { Suspense, useMemo } from "react";
import { Link, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";

import MedicalRecordDetailTable from "../components/medical-record-detail-table";

export default function MedicalRecordDetailPage() {
  const { id } = useParams();

  const idNum = useMemo(() => Number(id), [id]);
  const isValidId = Number.isInteger(idNum) && idNum > 0;

  if (!isValidId) {
    return (
      <Card className="px-8">
        <header className="mb-6">
          <Typography as="h1" variant="subtitle">
            Medical Record Detail
          </Typography>
        </header>
        <section className="space-y-4">
          <div>
            <Button asChild variant="outline">
              <Link to="/admin/medical-records">Back to Medical Record List</Link>
            </Button>
          </div>
          <Typography>Invalid medical record id.</Typography>
        </section>
      </Card>
    );
  }

  return (
    <Card className="px-8">
      <header className="mb-6">
        <Typography as="h1" variant="subtitle">
          Medical Record Detail
        </Typography>
      </header>

      <section className="space-y-6">
        <Suspense fallback={<div className="p-4">Loading medical record...</div>}>
          <MedicalRecordDetailTable id={idNum} />
        </Suspense>
      </section>
    </Card>
  );
}
