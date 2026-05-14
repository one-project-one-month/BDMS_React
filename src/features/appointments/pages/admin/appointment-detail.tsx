import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";

import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import AppointmentDetailTable from "../../components/appointment-detail-table";

export default function AppointmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const appointmentId = useMemo(() => Number(id), [id]);
  const isValidId = Number.isInteger(appointmentId) && appointmentId > 0;

  if (!isValidId) {
    return (
      <Card className="px-8">
        <Typography as="h1" variant="subtitle">
          Appointment Detail
        </Typography>
        <section className="space-y-4">
          <div>
            <Button asChild variant="outline">
              <Link to="/admin/appointments">Back to Appointment List</Link>
            </Button>
          </div>
          <Typography>Invalid appointment id.</Typography>
          <div>
            <Button asChild variant="outline">
              <Link to="/admin/appointments">Back to Appointment List</Link>
            </Button>
          </div>
        </section>
      </Card>
    );
  }

  return (
    <Card className="px-8">
      <header className="mb-6">
        <Typography as="h1" variant="subtitle">
          Appointment Detail
        </Typography>
      </header>
      <section className="space-y-6">
        <AppointmentDetailTable id={appointmentId} />
      </section>
    </Card>
  );
}
