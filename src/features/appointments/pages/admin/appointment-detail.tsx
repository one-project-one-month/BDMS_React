import { Card } from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";

export default function AppointmentDetailPage() {
  return (
    <Card className="px-8 py-6">
      <Typography as="h1" variant="subtitle">
        Appointment Detail
      </Typography>
      <Typography as="p" variant="body" className="mt-4 text-muted-foreground">
        This page is not implemented yet.
      </Typography>
    </Card>
  );
}
