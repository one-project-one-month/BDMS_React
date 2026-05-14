import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import AppointmentCreateForm from "../../components/appointment-create-form";

export default function AppointmentCreatePage() {
  return (
    <Card className="px-8 py-6">
      <header className="mb-6">
        <Typography as="h1" variant="subtitle">
          Create Appointment
        </Typography>
        <Typography variant="body">
          Create an appointment from a donation and optionally include remarks.
        </Typography>
      </header>

      <section>
        <AppointmentCreateForm />
      </section>
    </Card>
  );
}
