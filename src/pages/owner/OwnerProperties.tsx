import DashboardLayout from "@/components/DashboardLayout";
import { mockProperties } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, MapPin } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const OwnerProperties = () => (
  <DashboardLayout role="owner">
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-foreground">My Properties</h1>
        <p className="text-muted-foreground mt-1">Detailed view of your accommodation properties</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {mockProperties.map((property) => {
          const rooms = property.units.flatMap((u) => u.rooms);
          const occ = rooms.filter((r) => r.status === "occupied").length;
          const avail = rooms.filter((r) => r.status === "available").length;
          const rate = Math.round((occ / rooms.length) * 100);
          const revenue = rooms.filter((r) => r.status === "occupied").reduce((s, r) => s + r.monthlyRent, 0);

          return (
            <Card key={property.id} className="shadow-card hover:shadow-elevated transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl font-serif flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  {property.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {property.address}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Occupancy</span>
                  <span className="font-medium text-foreground">{rate}%</span>
                </div>
                <Progress value={rate} className="h-2" />

                <div className="grid grid-cols-3 gap-4 text-center pt-2">
                  <div>
                    <p className="text-2xl font-serif text-foreground">{rooms.length}</p>
                    <p className="text-xs text-muted-foreground">Total Rooms</p>
                  </div>
                  <div>
                    <p className="text-2xl font-serif text-success">{avail}</p>
                    <p className="text-xs text-muted-foreground">Available</p>
                  </div>
                  <div>
                    <p className="text-2xl font-serif text-foreground">R{(revenue / 1000).toFixed(1)}k</p>
                    <p className="text-xs text-muted-foreground">Revenue/mo</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  </DashboardLayout>
);

export default OwnerProperties;
