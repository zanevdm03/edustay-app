import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { mockOwners, mockProperties, type Owner } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Pencil, Building2, FileText, Upload } from "lucide-react";

const AdminOwners = () => {
  const { toast } = useToast();
  const [owners, setOwners] = useState<Owner[]>(mockOwners);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<Owner | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [newOwner, setNewOwner] = useState<Partial<Owner>>({ name: "", email: "", phone: "", idNumber: "", residentialAddress: "" });

  const openEdit = (owner: Owner) => {
    setEditing({ ...owner });
    setEditOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editing) return;
    setOwners((prev) => prev.map((o) => (o.id === editing.id ? editing : o)));
    setEditOpen(false);
    toast({ title: "Owner Updated", description: `${editing.name}'s information has been updated.` });
  };

  const handleAdd = () => {
    if (!newOwner.name || !newOwner.email) return;
    const owner: Owner = { id: `o${Date.now()}`, name: newOwner.name!, email: newOwner.email!, phone: newOwner.phone || "", idNumber: newOwner.idNumber, residentialAddress: newOwner.residentialAddress };
    setOwners((prev) => [...prev, owner]);
    setAddOpen(false);
    setNewOwner({ name: "", email: "", phone: "", idNumber: "", residentialAddress: "" });
    toast({ title: "Owner Added", description: `${owner.name} has been registered.` });
  };

  const handleMandateUpload = (ownerId: string, file: File) => {
    setOwners((prev) => prev.map((o) => o.id === ownerId ? { ...o, mandateFile: file.name } : o));
    toast({ title: "Mandate Uploaded", description: `${file.name} has been attached.` });
  };

  const getOwnerProperties = (ownerId: string) =>
    mockProperties.filter((p) => p.ownerId === ownerId);

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-serif text-foreground">Owners</h1>
            <p className="text-muted-foreground mt-1">Manage property owners, mandates, and documents</p>
          </div>
          <Button onClick={() => setAddOpen(true)}>
            <UserPlus className="h-4 w-4 mr-1" /> Add Owner
          </Button>
        </div>

        <div className="grid gap-6">
          {owners.map((owner) => {
            const props = getOwnerProperties(owner.id);
            return (
              <Card key={owner.id} className="shadow-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-serif">{owner.name}</CardTitle>
                    <Button size="sm" variant="outline" onClick={() => openEdit(owner)}>
                      <Pencil className="h-4 w-4 mr-1" /> Edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Email</p>
                      <p className="font-medium text-foreground">{owner.email}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Phone</p>
                      <p className="font-medium text-foreground">{owner.phone}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">ID Number</p>
                      <p className="font-medium text-foreground">{owner.idNumber || "—"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Properties</p>
                      <p className="font-medium text-foreground">{props.length} propert{props.length === 1 ? "y" : "ies"}</p>
                    </div>
                  </div>

                  {owner.residentialAddress && (
                    <div className="text-sm">
                      <p className="text-muted-foreground">Residential Address</p>
                      <p className="font-medium text-foreground">{owner.residentialAddress}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    {owner.mandateFile ? (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <FileText className="h-3 w-3" /> {owner.mandateFile}
                        {owner.mandateExpiry && (
                          <span className="text-muted-foreground ml-1">Expires: {owner.mandateExpiry}</span>
                        )}
                      </Badge>
                    ) : (
                      <p className="text-xs text-muted-foreground">No mandate uploaded</p>
                    )}
                    <label className="cursor-pointer">
                      <Button size="sm" variant="outline" asChild>
                        <span><Upload className="h-3 w-3 mr-1" /> Upload Mandate (PDF)</span>
                      </Button>
                      <input type="file" accept=".pdf" className="hidden" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleMandateUpload(owner.id, file);
                      }} />
                    </label>
                  </div>

                  {props.length > 0 && (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Property</TableHead>
                          <TableHead>Address</TableHead>
                          <TableHead>Units</TableHead>
                          <TableHead>Rooms</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {props.map((p) => (
                          <TableRow key={p.id}>
                            <TableCell className="font-medium flex items-center gap-1">
                              <Building2 className="h-3 w-3 text-primary" /> {p.name}
                            </TableCell>
                            <TableCell className="text-muted-foreground">{p.address}</TableCell>
                            <TableCell className="text-muted-foreground">{p.units.length}</TableCell>
                            <TableCell className="text-muted-foreground">
                              {p.units.reduce((sum, u) => sum + u.rooms.length, 0)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Edit Owner Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif">Edit Owner</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4 py-4">
              <div>
                <Label>Full Name</Label>
                <Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              </div>
              <div>
                <Label>ID Number</Label>
                <Input value={editing.idNumber || ""} onChange={(e) => setEditing({ ...editing, idNumber: e.target.value })} placeholder="e.g. 7501015012081" />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" value={editing.email} onChange={(e) => setEditing({ ...editing, email: e.target.value })} />
              </div>
              <div>
                <Label>Phone</Label>
                <Input value={editing.phone} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} />
              </div>
              <div>
                <Label>Residential Address</Label>
                <Input value={editing.residentialAddress || ""} onChange={(e) => setEditing({ ...editing, residentialAddress: e.target.value })} placeholder="e.g. 34 Park Ave, Bloemfontein" />
              </div>
              <div>
                <Label>Mandate Expiry Date</Label>
                <Input type="date" value={editing.mandateExpiry || ""} onChange={(e) => setEditing({ ...editing, mandateExpiry: e.target.value })} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Owner Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif">Add New Owner</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Full Name</Label>
              <Input value={newOwner.name} onChange={(e) => setNewOwner((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. John Doe" />
            </div>
            <div>
              <Label>ID Number</Label>
              <Input value={newOwner.idNumber} onChange={(e) => setNewOwner((p) => ({ ...p, idNumber: e.target.value }))} placeholder="e.g. 7501015012081" />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" value={newOwner.email} onChange={(e) => setNewOwner((p) => ({ ...p, email: e.target.value }))} placeholder="e.g. john@example.com" />
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={newOwner.phone} onChange={(e) => setNewOwner((p) => ({ ...p, phone: e.target.value }))} placeholder="e.g. 081 234 5678" />
            </div>
            <div>
              <Label>Residential Address</Label>
              <Input value={newOwner.residentialAddress} onChange={(e) => setNewOwner((p) => ({ ...p, residentialAddress: e.target.value }))} placeholder="e.g. 34 Park Ave, Bloemfontein" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Add Owner</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminOwners;
