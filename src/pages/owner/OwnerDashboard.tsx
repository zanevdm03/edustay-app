import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import { mockProperties } from "@/lib/mockData";
import { Building2, DoorOpen, Users, Banknote } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

const OwnerDashboard = () => {
  const allRooms = mockProperties.flatMap((p) => p.units.flatMap((u) => u.rooms));
  const occupied = allRooms.filter((r) => r.status === "occupied").length;
  const totalRent = allRooms.filter((r) => r.status === "occupied").reduce((sum, r) => sum + r.monthlyRent, 0);
  const occupancyRate = Math.round((occupied / allRooms.length) * 100);

  return (
    <DashboardLayout role="owner">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-serif text-foreground">Property Overview</h1>
          <p className="text-muted-foreground mt-1">Track your accommodation portfolio</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Properties" value={mockProperties.length} icon={<Building2 className="h-5 w-5" />} />
          <StatCard title="Total Rooms" value={allRooms.length} icon={<DoorOpen className="h-5 w-5" />} />
          <StatCard title="Occupied" value={occupied} icon={<Users className="h-5 w-5" />} description={`${occupancyRate}% occupancy`} />
          <StatCard title="Monthly Revenue" value={`R${totalRent.toLocaleString()}`} icon={<Banknote className="h-5 w-5" />} />
        </div>

        {mockProperties.map((property) => {
          const rooms = property.units.flatMap((u) => u.rooms);
          const occ = rooms.filter((r) => r.status === "occupied").length;
          const rate = Math.round((occ / rooms.length) * 100);

          return (
            <Card key={property.id} className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-serif">{property.name}</CardTitle>
                  <span className="text-sm text-muted-foreground">{occ}/{rooms.length} occupied</span>
                </div>
                <Progress value={rate} className="h-2 mt-2" />
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Unit</TableHead>
                      <TableHead>Room</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Rent</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {property.units.flatMap((unit) =>
                      unit.rooms.map((room) => (
                        <TableRow key={room.id}>
                          <TableCell className="text-muted-foreground">{unit.name}</TableCell>
                          <TableCell className="font-medium">{room.number}</TableCell>
                          <TableCell><StatusBadge status={room.status} /></TableCell>
                          <TableCell className="text-muted-foreground">R{room.monthlyRent.toLocaleString()}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </DashboardLayout>
  );
};

export default OwnerDashboard;
