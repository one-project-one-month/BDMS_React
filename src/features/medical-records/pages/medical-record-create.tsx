import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";

import MedicalRecordForm from "../components/medical-record-form";

export default function MedicalRecordCreatePage() {
  return (
    <Card className="px-8 py-6">
      <header className="mb-6">
        <Typography as="h1" variant="subtitle">
          Create Medical Record
        </Typography>
        <Typography variant="body">
          Fill in the screening details below to add a new medical record.
        </Typography>
      </header>

      <section>
        <MedicalRecordForm />
      </section>
    </Card>
  );
}
