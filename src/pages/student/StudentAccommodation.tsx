import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { mockProperties, mockStudents } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Building2, DoorOpen, MapPin, Wifi, Shield, ChefHat, Bath, Bed, WashingMachine, Check, Lock } from "lucide-react";

type AccomOption = "new_property" | "other_room" | "keep_room" | null;

const ACTIVATION_DATE = new Date("2026-11-30T00:00:00");

const StudentAccommodation = () => {
  const { toast } = useToast();
  const student = mockStudents[0];
  const [selectedOption, setSelectedOption] = useState<AccomOption>(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const now = new Date();
  const isLocked = now < ACTIVATION_DATE;

  if (isLocked) {
    return (
      <DashboardLayout role="student">
        <div className="space-y-8">
          <div className="text-center py-16 space-y-4">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto">
              <Lock className="h-8 w-8 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-serif text-foreground">Coming Soon</h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              The accommodation selection for 2027 will open on <span className="font-medium text-foreground">30 November 2026</span>. Please check back then!
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const handleKeepRoom = () => {
    setConfirmed(true);
    toast({ title: "Room Saved!", description: "Your room has been reserved for next year." });
  };

  const handleSelectProperty = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
    setConfirmed(true);
    const prop = mockProperties.find((p) => p.id === propertyId);
    toast({ title: "Property Selected", description: `You've selected ${prop?.name}.` });
  };

  const handleSelectOtherRoom = () => {
    setConfirmed(true);
    toast({ title: "Room Transfer Requested", description: "Your request has been submitted." });
  };

  if (confirmed) {
    return (
      <DashboardLayout role="student">
        <div className="text-center py-16 space-y-4">
          <div className="h-16 w-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
            <Check className="h-8 w-8 text-success" />
          </div>
          <h1 className="text-3xl font-serif text-foreground">Thank You!</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Thank you for choosing EduStay Accommodation for 2027!
          </p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="student">
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-serif text-foreground">Dearest Stayer,</h1>
          <p className="text-muted-foreground">Thank you for choosing EduStay Accommodation for 2027!</p>
        </div>

        {!selectedOption && (
          <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <Card className="shadow-card cursor-pointer hover:border-primary transition-colors" onClick={() => setSelectedOption("new_property")}>
              <CardContent className="pt-6 text-center space-y-3">
                <Building2 className="h-10 w-10 mx-auto text-primary" />
                <h3 className="font-serif text-lg text-foreground">New Property</h3>
                <p className="text-sm text-muted-foreground">Browse other EduStay properties</p>
              </CardContent>
            </Card>
            <Card className="shadow-card cursor-pointer hover:border-primary transition-colors" onClick={() => setSelectedOption("other_room")}>
              <CardContent className="pt-6 text-center space-y-3">
                <DoorOpen className="h-10 w-10 mx-auto text-primary" />
                <h3 className="font-serif text-lg text-foreground">Other Room</h3>
                <p className="text-sm text-muted-foreground">Switch to a different room</p>
              </CardContent>
            </Card>
            <Card className="shadow-card cursor-pointer hover:border-primary transition-colors" onClick={() => setSelectedOption("keep_room")}>
              <CardContent className="pt-6 text-center space-y-3">
                <Bed className="h-10 w-10 mx-auto text-primary" />
                <h3 className="font-serif text-lg text-foreground">Keep My Room</h3>
                <p className="text-sm text-muted-foreground">Stay in your current room</p>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedOption === "new_property" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{mockProperties.length} properties found</p>
              <Button variant="ghost" size="sm" onClick={() => setSelectedOption(null)}>← Back</Button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {mockProperties.map((prop) => {
                const rooms = prop.units.flatMap((u) => u.rooms);
                const available = rooms.filter((r) => r.status === "available").length;
                const minRent = Math.min(...rooms.map((r) => r.monthlyRent));
                return (
                  <Card key={prop.id} className="shadow-card hover:border-primary transition-colors">
                    <CardHeader className="pb-2">
                      <Badge className="bg-primary/10 text-primary border-primary/20 mb-2 w-fit">R{minRent.toLocaleString()}</Badge>
                      <CardTitle className="text-lg font-serif">{prop.name}</CardTitle>
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="h-3 w-3" /> {prop.address}</p>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {[{ icon: Wifi, label: "Wi-Fi" }, { icon: Shield, label: "Security" }, { icon: ChefHat, label: "Kitchen" }, { icon: Bath, label: "Bathroom" }, { icon: Bed, label: "Furnished" }, { icon: WashingMachine, label: "Laundry" }].map(({ icon: Icon, label }) => (
                          <Badge key={label} variant="outline" className="text-xs flex items-center gap-1"><Icon className="h-3 w-3" /> {label}</Badge>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">{available} room{available !== 1 ? "s" : ""} available</p>
                      <Button className="w-full" onClick={() => handleSelectProperty(prop.id)}>Select</Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {selectedOption === "other_room" && (
          <Card className="shadow-card max-w-lg mx-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-serif">Request Another Room</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setSelectedOption(null)}>← Back</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">Your agent will contact you with available options.</p>
              <Button onClick={handleSelectOtherRoom}>Submit Request</Button>
            </CardContent>
          </Card>
        )}

        {selectedOption === "keep_room" && (
          <Card className="shadow-card max-w-lg mx-auto text-center">
            <CardContent className="pt-8 space-y-4">
              <h2 className="text-xl font-serif text-foreground">Dearest Stayer,</h2>
              <p className="text-muted-foreground">We'll save your room for next year!</p>
              {student?.allocation && (
                <div className="bg-muted/30 rounded-lg p-4 text-sm text-left space-y-1">
                  <p><span className="text-muted-foreground">Property:</span> <span className="font-medium text-foreground">{student.allocation.propertyName}</span></p>
                  <p><span className="text-muted-foreground">Unit:</span> <span className="font-medium text-foreground">{student.allocation.unitName}</span></p>
                  <p><span className="text-muted-foreground">Room:</span> <span className="font-medium text-foreground">{student.allocation.roomNumber}</span></p>
                </div>
              )}
              <Button size="lg" onClick={handleKeepRoom}><Bed className="h-4 w-4 mr-2" /> Save My Room</Button>
              <Button variant="ghost" size="sm" onClick={() => setSelectedOption(null)} className="block mx-auto">← Back to options</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentAccommodation;
