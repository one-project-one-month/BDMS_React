import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";

import MedicalRecordForm from "../components/medical-record-form";
import { getMedicalRecordQueryOptions } from "../queries";

export default function MedicalRecordEditPage() {
  const { id } = useParams<{ id: string }>();
  const medicalRecordId = Number(id);

  const {
    data: medicalRecord,
    isPending,
    isError,
  } = useQuery(getMedicalRecordQueryOptions(medicalRecordId));

  if (isPending) {
    return <div className="p-8">Loading medical record details...</div>;
  }

  if (isError || !medicalRecord) {
    return (
      <div className="p-8 text-destructive">
        Failed to load medical record.
      </div>
    );
  }

  return (
    <Card className="px-8 py-6">
      <header className="mb-6">
        <Typography as="h1" variant="subtitle">
          Edit Medical Record
        </Typography>
        <Typography variant="body">
          Update the details for medical record #{medicalRecordId}
        </Typography>
      </header>
      <section>
        <MedicalRecordForm initialData={medicalRecord} isEditing />
      </section>
    </Card>
  );
}
