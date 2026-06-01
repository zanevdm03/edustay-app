import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import StatusBadge from "@/components/StatusBadge";
import { mockProperties, mockOwners, type Property, type Room, type Unit, type Owner } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Building2, MapPin, Plus, Pencil, UserPlus, Trash2 } from "lucide-react";

interface NewRoom {
  number: string;
  type: "single" | "sharing";
  monthlyRent: string;
  depositAmount: string;
}

const AdminProperties = () => {
  const { toast } = useToast();
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [owners] = useState<Owner[]>(mockOwners);

  // Add Property dialog
  const [addPropertyOpen, setAddPropertyOpen] = useState(false);
  const [newProperty, setNewProperty] = useState({ name: "", address: "", ownerId: "", unitName: "", roomsAmount: "1" });
  const [newRooms, setNewRooms] = useState<NewRoom[]>([{ number: "", type: "single", monthlyRent: "", depositAmount: "" }]);

  // Edit Room dialog
  const [editRoomOpen, setEditRoomOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<{ propertyId: string; unitId: string; room: Room } | null>(null);
  const [editRoomData, setEditRoomData] = useState({ number: "", type: "single" as "single" | "sharing", monthlyRent: "", depositAmount: "" });

  const updateRoomsCount = (count: string) => {
    const num = Math.max(1, parseInt(count) || 1);
    setNewProperty(p => ({ ...p, roomsAmount: String(num) }));
    const current = [...newRooms];
    while (current.length < num) current.push({ number: "", type: "single", monthlyRent: "", depositAmount: "" });
    setNewRooms(current.slice(0, num));
  };

  const updateNewRoom = (index: number, field: keyof NewRoom, value: string) => {
    setNewRooms(prev => prev.map((r, i) => i === index ? { ...r, [field]: value } : r));
  };

  // When sharing is selected, add a sub-row
  const handleRoomTypeChange = (index: number, type: "single" | "sharing") => {
    setNewRooms(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], type };
      return updated;
    });
  };

  const handleAddProperty = () => {
    if (!newProperty.name || !newProperty.address || !newProperty.ownerId) return;
    const owner = owners.find(o => o.id === newProperty.ownerId);
    if (!owner) return;

    const rooms: Room[] = [];
    newRooms.forEach((nr, i) => {
      if (nr.type === "sharing") {
        rooms.push({
          id: `r${Date.now()}-${i}-1`,
          number: `${nr.number}.1`,
          type: "sharing",
          status: "available",
          monthlyRent: Number(nr.monthlyRent) || 0,
          depositAmount: Number(nr.depositAmount) || 0,
          rentPaid: false,
        });
        rooms.push({
          id: `r${Date.now()}-${i}-2`,
          number: `${nr.number}.2`,
          type: "sharing",
          status: "available",
          monthlyRent: Number(nr.monthlyRent) || 0,
          depositAmount: Number(nr.depositAmount) || 0,
          rentPaid: false,
        });
      } else {
        rooms.push({
          id: `r${Date.now()}-${i}`,
          number: nr.number,
          type: "single",
          status: "available",
          monthlyRent: Number(nr.monthlyRent) || 0,
          depositAmount: Number(nr.depositAmount) || 0,
          rentPaid: false,
        });
      }
    });

    const unit: Unit = { id: `u${Date.now()}`, name: newProperty.unitName || "Unit 1", rooms };
    const prop: Property = {
      id: `p${Date.now()}`,
      name: newProperty.name,
      address: newProperty.address,
      ownerId: owner.id,
      ownerName: owner.name,
      units: [unit],
    };
    setProperties(prev => [...prev, prop]);
    setAddPropertyOpen(false);
    setNewProperty({ name: "", address: "", ownerId: "", unitName: "", roomsAmount: "1" });
    setNewRooms([{ number: "", type: "single", monthlyRent: "", depositAmount: "" }]);
    toast({ title: "Property Added", description: `${prop.name} has been created with ${rooms.length} room(s).` });
  };

  const openEditRoom = (propertyId: string, unitId: string, room: Room) => {
    setEditingRoom({ propertyId, unitId, room });
    setEditRoomData({ number: room.number, type: room.type, monthlyRent: String(room.monthlyRent), depositAmount: String(room.depositAmount || "") });
    setEditRoomOpen(true);
  };

  const handleEditRoom = () => {
    if (!editingRoom) return;
    setProperties(prev => prev.map(p => {
      if (p.id !== editingRoom.propertyId) return p;
      return {
        ...p,
        units: p.units.map(u => {
          if (u.id !== editingRoom.unitId) return u;
          return {
            ...u,
            rooms: u.rooms.map(r =>
              r.id === editingRoom.room.id
                ? { ...r, number: editRoomData.number, type: editRoomData.type, monthlyRent: Number(editRoomData.monthlyRent), depositAmount: Number(editRoomData.depositAmount) }
                : r
            ),
          };
        }),
      };
    }));
    setEditRoomOpen(false);
    toast({ title: "Room Updated", description: `Room ${editRoomData.number} has been updated.` });
  };

  const toggleRentPaid = (propertyId: string, unitId: string, roomId: string) => {
    setProperties(prev => prev.map(p => {
      if (p.id !== propertyId) return p;
      return {
        ...p,
        units: p.units.map(u => {
          if (u.id !== unitId) return u;
          return {
            ...u,
            rooms: u.rooms.map(r =>
              r.id === roomId ? { ...r, rentPaid: !r.rentPaid } : r
            ),
          };
        }),
      };
    }));
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-serif text-foreground">Properties</h1>
            <p className="text-muted-foreground mt-1">Manage all accommodation properties, units, and rooms</p>
          </div>
          <Button onClick={() => setAddPropertyOpen(true)}>
            <Plus className="h-4 w-4 mr-1" /> Add Property
          </Button>
        </div>

        <div className="space-y-6">
          {properties.map((property) => (
            <Card key={property.id} className="shadow-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl font-serif flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      {property.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" /> {property.address}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Owner: {property.ownerName}</p>
                  </div>
                </div>
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
                              <TableHead>Type</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Student</TableHead>
                              <TableHead>Rent</TableHead>
                              <TableHead>Deposit</TableHead>
                              <TableHead>Paid</TableHead>
                              <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {unit.rooms.map((room) => (
                              <TableRow key={room.id}>
                                <TableCell className="font-medium">{room.number}</TableCell>
                                <TableCell className="capitalize text-muted-foreground">{room.type}</TableCell>
                                <TableCell><StatusBadge status={room.status} /></TableCell>
                                <TableCell className="text-muted-foreground">{room.studentName || "—"}</TableCell>
                                <TableCell className="text-muted-foreground">R{room.monthlyRent.toLocaleString()}</TableCell>
                                <TableCell className="text-muted-foreground">{room.depositAmount ? `R${room.depositAmount.toLocaleString()}` : "—"}</TableCell>
                                <TableCell>
                                  {room.status === "occupied" ? (
                                    <Checkbox
                                      checked={room.rentPaid}
                                      onCheckedChange={() => toggleRentPaid(property.id, unit.id, room.id)}
                                    />
                                  ) : (
                                    <span className="text-muted-foreground">—</span>
                                  )}
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button size="sm" variant="outline" onClick={() => openEditRoom(property.id, unit.id, room)}>
                                    <Pencil className="h-4 w-4 mr-1" /> Edit
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
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

      {/* Add Property Dialog */}
      <Dialog open={addPropertyOpen} onOpenChange={setAddPropertyOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif">Add New Property</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Property Name</Label>
                <Input value={newProperty.name} onChange={e => setNewProperty(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Sunrise Residence" />
              </div>
              <div>
                <Label>Owner</Label>
                <Select value={newProperty.ownerId} onValueChange={v => setNewProperty(p => ({ ...p, ownerId: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select owner" /></SelectTrigger>
                  <SelectContent>
                    {owners.map(o => (
                      <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Address</Label>
              <Input value={newProperty.address} onChange={e => setNewProperty(p => ({ ...p, address: e.target.value }))} placeholder="e.g. 10 Long Street, Cape Town" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Unit Name</Label>
                <Input value={newProperty.unitName} onChange={e => setNewProperty(p => ({ ...p, unitName: e.target.value }))} placeholder="e.g. Block A" />
              </div>
              <div>
                <Label>Number of Rooms</Label>
                <Input type="number" min={1} value={newProperty.roomsAmount} onChange={e => updateRoomsCount(e.target.value)} />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-base font-medium">Rooms</Label>
              {newRooms.map((room, i) => (
                <Card key={i} className="p-3">
                  <div className="grid grid-cols-4 gap-3">
                    <div>
                      <Label className="text-xs">Room Number</Label>
                      <Input value={room.number} onChange={e => updateNewRoom(i, "number", e.target.value)} placeholder={`e.g. A10${i + 1}`} />
                    </div>
                    <div>
                      <Label className="text-xs">Type</Label>
                      <Select value={room.type} onValueChange={(v: "single" | "sharing") => handleRoomTypeChange(i, v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">Single</SelectItem>
                          <SelectItem value="sharing">Sharing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs">Rent (R)</Label>
                      <Input type="number" value={room.monthlyRent} onChange={e => updateNewRoom(i, "monthlyRent", e.target.value)} placeholder="4500" />
                    </div>
                    <div>
                      <Label className="text-xs">Deposit (R)</Label>
                      <Input type="number" value={room.depositAmount} onChange={e => updateNewRoom(i, "depositAmount", e.target.value)} placeholder="4500" />
                    </div>
                  </div>
                  {room.type === "sharing" && (
                    <p className="text-xs text-muted-foreground mt-2">
                      This will create {room.number || "?"}.1 and {room.number || "?"}.2 as two sharing rooms
                    </p>
                  )}
                </Card>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddPropertyOpen(false)}>Cancel</Button>
            <Button onClick={handleAddProperty}>Add Property</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Room Dialog */}
      <Dialog open={editRoomOpen} onOpenChange={setEditRoomOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif">Edit Room</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Room Number</Label>
              <Input value={editRoomData.number} onChange={e => setEditRoomData(p => ({ ...p, number: e.target.value }))} />
            </div>
            <div>
              <Label>Room Type</Label>
              <Select value={editRoomData.type} onValueChange={(v: "single" | "sharing") => setEditRoomData(p => ({ ...p, type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="sharing">Sharing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Monthly Rent (R)</Label>
              <Input type="number" value={editRoomData.monthlyRent} onChange={e => setEditRoomData(p => ({ ...p, monthlyRent: e.target.value }))} />
            </div>
            <div>
              <Label>Deposit Amount (R)</Label>
              <Input type="number" value={editRoomData.depositAmount} onChange={e => setEditRoomData(p => ({ ...p, depositAmount: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditRoomOpen(false)}>Cancel</Button>
            <Button onClick={handleEditRoom}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminProperties;
