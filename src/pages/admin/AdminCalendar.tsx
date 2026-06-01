import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { mockAppointments, type Appointment } from "@/lib/mockNotifications";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CalendarDays, Clock, CheckCircle, XCircle, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const AdminCalendar = () => {
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const appointmentDates = appointments.map((a) => a.date);

  const dayAppointments = selectedDate
    ? appointments.filter((a) => a.date === format(selectedDate, "yyyy-MM-dd"))
    : [];

  const handleConfirm = (id: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "confirmed" as const } : a))
    );
    toast({ title: "Appointment Confirmed" });
  };

  const handleCancel = (id: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "cancelled" as const } : a))
    );
    toast({ title: "Appointment Cancelled" });
  };

  const statusColors: Record<string, string> = {
    pending: "bg-warning/10 text-warning border-warning/20",
    confirmed: "bg-success/10 text-success border-success/20",
    cancelled: "bg-destructive/10 text-destructive border-destructive/20",
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-serif text-foreground">Calendar</h1>
          <p className="text-muted-foreground mt-1">View and manage room viewing appointments</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Calendar */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg font-serif flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-primary" /> Appointment Calendar
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className={cn("p-3 pointer-events-auto")}
                modifiers={{
                  hasAppointment: (date) =>
                    appointmentDates.includes(format(date, "yyyy-MM-dd")),
                }}
                modifiersClassNames={{
                  hasAppointment: "bg-primary/20 text-primary font-bold",
                }}
              />
            </CardContent>
          </Card>

          {/* Day appointments */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg font-serif">
                {selectedDate ? format(selectedDate, "EEEE, MMMM d, yyyy") : "Select a date"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dayAppointments.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No appointments on this day.</p>
              ) : (
                <div className="space-y-4">
                  {dayAppointments.map((apt) => (
                    <div key={apt.id} className="border border-border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-foreground">{apt.studentName}</h4>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {apt.time}
                          </p>
                          {apt.propertyName && (
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> {apt.propertyName}
                            </p>
                          )}
                        </div>
                        <Badge className={cn("capitalize border", statusColors[apt.status])}>
                          {apt.status}
                        </Badge>
                      </div>
                      {apt.notes && <p className="text-sm text-muted-foreground italic">"{apt.notes}"</p>}
                      {apt.status === "pending" && (
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleConfirm(apt.id)}>
                            <CheckCircle className="h-4 w-4 mr-1" /> Confirm
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleCancel(apt.id)}>
                            <XCircle className="h-4 w-4 mr-1" /> Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* All upcoming */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-serif">All Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {appointments
                .filter((a) => a.status !== "cancelled")
                .sort((a, b) => a.date.localeCompare(b.date))
                .map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                    <div className="flex items-center gap-4">
                      <div className="text-center min-w-[60px]">
                        <p className="text-xs text-muted-foreground">{format(new Date(apt.date), "MMM")}</p>
                        <p className="text-lg font-bold text-foreground">{format(new Date(apt.date), "d")}</p>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{apt.studentName}</p>
                        <p className="text-sm text-muted-foreground">{apt.time} — {apt.propertyName}</p>
                      </div>
                    </div>
                    <Badge className={cn("capitalize border", statusColors[apt.status])}>{apt.status}</Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminCalendar;
