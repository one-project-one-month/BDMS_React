import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CalendarDays, MapPin, Clock } from "lucide-react";
import { Typography } from "@/components/ui/typography";

export function UpcomingAppointment() {
  const appointment = {
    date: "2024-05-20",
    time: "10:30 AM",
    location: "Central Blood Bank, Downtown",
    // status: "Confirmed",
  };

  return (
    <Card className="h-full shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <Typography variant="body" className="text-dark-primary font-semibold">Upcoming Appointments</Typography>  
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{appointment.date}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{appointment.time}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{appointment.location}</span>
          </div>
        </div>
        <div className="rounded-lg border border-dashed p-3 text-center">
          <p className="text-xs text-muted-foreground">
            Please remember to bring your ID and stay hydrated before your donation.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
