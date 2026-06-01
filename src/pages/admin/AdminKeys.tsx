import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { mockProperties, type Property } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Key, Building2, Minus, Plus } from "lucide-react";

const AdminKeys = () => {
  const { toast } = useToast();
  const [properties, setProperties] = useState<Property[]>(mockProperties);

  const handleTakeKey = (propertyId: string, unitId: string, roomId: string) => {
    setProperties(prev => prev.map(p => {
      if (p.id !== propertyId) return p;
      return {
        ...p,
        units: p.units.map(u => {
          if (u.id !== unitId) return u;
          return {
            ...u,
            rooms: u.rooms.map(r => {
              if (r.id !== roomId || !r.keysAvailable || r.keysAvailable <= 0) return r;
              return { ...r, keysAvailable: r.keysAvailable - 1 };
            }),
          };
        }),
      };
    }));
    toast({ title: "Key Taken", description: "Key has been checked out." });
  };

  const handleReturnKey = (propertyId: string, unitId: string, roomId: string) => {
    setProperties(prev => prev.map(p => {
      if (p.id !== propertyId) return p;
      return {
        ...p,
        units: p.units.map(u => {
          if (u.id !== unitId) return u;
          return {
            ...u,
            rooms: u.rooms.map(r => {
              if (r.id !== roomId || (r.keysAvailable ?? 0) >= (r.keysTotal ?? 0)) return r;
              return { ...r, keysAvailable: (r.keysAvailable ?? 0) + 1 };
            }),
          };
        }),
      };
    }));
    toast({ title: "Key Returned", description: "Key has been checked back in." });
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-serif text-foreground">Keys</h1>
          <p className="text-muted-foreground mt-1">Track room key codes and availability across all properties</p>
        </div>

        <div className="space-y-6">
          {properties.map((property) => (
            <Card key={property.id} className="shadow-card">
              <CardHeader>
                <CardTitle className="text-xl font-serif flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  {property.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className="w-full">
                  {property.units.map((unit) => (
                    <AccordionItem key={unit.id} value={unit.id}>
                      <AccordionTrigger className="text-sm font-medium">
                        {unit.name} — {unit.rooms.length} rooms
                      </AccordionTrigger>
                      <AccordionContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Room</TableHead>
                              <TableHead>Key Code</TableHead>
                              <TableHead>Total Keys</TableHead>
                              <TableHead>Available</TableHead>
                              <TableHead>Checked Out</TableHead>
                              <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {unit.rooms.map((room) => {
                              const total = room.keysTotal ?? 0;
                              const available = room.keysAvailable ?? 0;
                              const checkedOut = total - available;
                              return (
                                <TableRow key={room.id}>
                                  <TableCell className="font-medium">{room.number}</TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className="font-mono text-xs">
                                      <Key className="h-3 w-3 mr-1" /> {room.keyCode || "—"}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-muted-foreground">{total}</TableCell>
                                  <TableCell>
                                    <Badge className={available > 0 ? "bg-success/10 text-success border-success/20 border" : "bg-destructive/10 text-destructive border-destructive/20 border"}>
                                      {available}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-muted-foreground">{checkedOut}</TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        disabled={available <= 0}
                                        onClick={() => handleTakeKey(property.id, unit.id, room.id)}
                                      >
                                        <Minus className="h-3 w-3 mr-1" /> Take
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        disabled={checkedOut <= 0}
                                        onClick={() => handleReturnKey(property.id, unit.id, room.id)}
                                      >
                                        <Plus className="h-3 w-3 mr-1" /> Return
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminKeys;
