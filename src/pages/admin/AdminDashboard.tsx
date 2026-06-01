import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import NotificationBar from "@/components/NotificationBar";
import { mockProperties, mockRequests, mockStudents } from "@/lib/mockData";
import { mockAppointments } from "@/lib/mockNotifications";
import { Building2, Users, FileText, ClipboardList, CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const AdminDashboard = () => {
  const totalRooms = mockProperties.flatMap((p) => p.units.flatMap((u) => u.rooms)).length;
  const occupied = mockProperties.flatMap((p) => p.units.flatMap((u) => u.rooms)).filter((r) => r.status === "occupied").length;
  const pendingRequests = mockRequests.filter((r) => r.status === "pending").length;
  const upcomingAppointments = mockAppointments.filter((a) => a.status !== "cancelled");

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-serif text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of your accommodation management</p>
        </div>

        <NotificationBar userId="admin1" />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Properties" value={mockProperties.length} icon={<Building2 className="h-5 w-5" />} />
          <StatCard title="Total Rooms" value={totalRooms} icon={<Building2 className="h-5 w-5" />} description={`${occupied} occupied`} />
          <StatCard title="Students" value={mockStudents.length} icon={<Users className="h-5 w-5" />} />
          <StatCard title="Pending Requests" value={pendingRequests} icon={<ClipboardList className="h-5 w-5" />} />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent requests */}
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-serif">Recent Application Requests</CardTitle>
              <Link to="/admin/applications" className="text-sm text-primary hover:underline">View all</Link>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockRequests.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell className="font-medium">{req.studentName}</TableCell>
                      <TableCell className="text-muted-foreground">{req.studentEmail}</TableCell>
                      <TableCell className="text-muted-foreground">{req.requestDate}</TableCell>
                      <TableCell><StatusBadge status={req.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Upcoming Appointments */}
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-serif flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-primary" /> Upcoming Appointments
              </CardTitle>
              <Link to="/admin/calendar" className="text-sm text-primary hover:underline">View all</Link>
            </CardHeader>
            <CardContent>
              {upcomingAppointments.length === 0 ? (
                <p className="text-center py-6 text-muted-foreground">No upcoming appointments.</p>
              ) : (
                <div className="space-y-3">
                  {upcomingAppointments.slice(0, 5).map((apt) => (
                    <div key={apt.id} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                      <div>
                        <p className="font-medium text-foreground text-sm">{apt.studentName}</p>
                        <p className="text-xs text-muted-foreground">{apt.date} at {apt.time} — {apt.propertyName}</p>
                      </div>
                      <Badge className={cn("capitalize border text-xs",
                        apt.status === "confirmed" ? "bg-success/10 text-success border-success/20" :
                        apt.status === "pending" ? "bg-warning/10 text-warning border-warning/20" :
                        "bg-destructive/10 text-destructive border-destructive/20"
                      )}>
                        {apt.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
