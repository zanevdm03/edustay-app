import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { mockProperties } from "@/lib/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Receipt, Upload, Image, Clock } from "lucide-react";

interface Invoice {
  id: string;
  maintenanceType: string;
  description: string;
  cost: number;
  photoFile: string;
  date: string;
  propertyId: string;
  propertyName: string;
  unitName: string;
  roomNumber?: string;
  personName: string;
}

const maintenanceTypes = [
  "Plumbing", "Electrical", "Painting", "Carpentry", "Locksmith",
  "Appliance Repair", "Pest Control", "Roofing", "Cleaning",
  "Gardening", "General Repairs", "Glass/Windows", "Other",
];

const mockInvoices: Invoice[] = [
  {
    id: "inv1",
    maintenanceType: "Plumbing",
    description: "Fixed kitchen sink leakage and replaced tap washer",
    cost: 850,
    photoFile: "invoice_plumbing_mar2026.pdf",
    date: "2026-02-28T14:30:00",
    propertyId: "p2",
    propertyName: "Campus View Apartments",
    unitName: "Floor 1",
    roomNumber: "102",
    personName: "John's Plumbing Services",
  },
];

const MaintenanceInvoices = () => {
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [addOpen, setAddOpen] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    maintenanceType: "",
    description: "",
    cost: "",
    photoFile: "",
    propertyId: "",
    unitName: "",
    roomNumber: "",
    personName: "",
  });

  const selectedProperty = mockProperties.find(p => p.id === newInvoice.propertyId);
  const units = selectedProperty?.units || [];

  const handleAdd = () => {
    if (!newInvoice.maintenanceType || !newInvoice.cost || !newInvoice.propertyId || !newInvoice.personName) return;
    const prop = mockProperties.find(p => p.id === newInvoice.propertyId);
    const invoice: Invoice = {
      id: `inv${Date.now()}`,
      maintenanceType: newInvoice.maintenanceType,
      description: newInvoice.description,
      cost: Number(newInvoice.cost),
      photoFile: newInvoice.photoFile || "no_file",
      date: new Date().toISOString(),
      propertyId: newInvoice.propertyId,
      propertyName: prop?.name || "",
      unitName: newInvoice.unitName,
      roomNumber: newInvoice.roomNumber || undefined,
      personName: newInvoice.personName,
    };
    setInvoices(prev => [invoice, ...prev]);
    setAddOpen(false);
    setNewInvoice({ maintenanceType: "", description: "", cost: "", photoFile: "", propertyId: "", unitName: "", roomNumber: "", personName: "" });
    toast({ title: "Invoice Added", description: `R${invoice.cost.toLocaleString()} for ${invoice.maintenanceType}` });
  };

  const formatTimestamp = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleDateString("en-ZA") + " " + d.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <DashboardLayout role="maintenance_role">
      <div className="space-y-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-serif text-foreground">Invoices</h1>
            <p className="text-muted-foreground mt-1">Record and track all maintenance invoices and receipts</p>
          </div>
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4 mr-1" /> New Invoice
          </Button>
        </div>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            {invoices.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Receipt className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>No invoices recorded yet.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Unit / Room</TableHead>
                    <TableHead>Person</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Receipt</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-medium">{inv.maintenanceType}</TableCell>
                      <TableCell className="text-muted-foreground max-w-[200px] truncate">{inv.description}</TableCell>
                      <TableCell className="text-muted-foreground">R{inv.cost.toLocaleString()}</TableCell>
                      <TableCell className="text-muted-foreground">{inv.propertyName}</TableCell>
                      <TableCell className="text-muted-foreground">{inv.unitName}{inv.roomNumber ? ` / ${inv.roomNumber}` : ""}</TableCell>
                      <TableCell className="text-muted-foreground">{inv.personName}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        <Clock className="h-3 w-3 inline mr-1" />{formatTimestamp(inv.date)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Image className="h-3 w-3" /> {inv.photoFile}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle className="font-serif">New Invoice</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Maintenance Type</Label>
              <Select value={newInvoice.maintenanceType} onValueChange={v => setNewInvoice(p => ({ ...p, maintenanceType: v }))}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  {maintenanceTypes.map(t => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={newInvoice.description} onChange={e => setNewInvoice(p => ({ ...p, description: e.target.value }))} placeholder="Short description of what was done" rows={3} />
            </div>
            <div>
              <Label>Cost (R)</Label>
              <Input type="number" value={newInvoice.cost} onChange={e => setNewInvoice(p => ({ ...p, cost: e.target.value }))} />
            </div>
            <div>
              <Label>Property</Label>
              <Select value={newInvoice.propertyId} onValueChange={v => setNewInvoice(p => ({ ...p, propertyId: v, unitName: "", roomNumber: "" }))}>
                <SelectTrigger><SelectValue placeholder="Select property" /></SelectTrigger>
                <SelectContent>
                  {mockProperties.map(p => (<SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            {units.length > 0 && (
              <div>
                <Label>Unit</Label>
                <Select value={newInvoice.unitName} onValueChange={v => setNewInvoice(p => ({ ...p, unitName: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select unit" /></SelectTrigger>
                  <SelectContent>
                    {units.map(u => (<SelectItem key={u.id} value={u.name}>{u.name}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <Label>Room Number (optional)</Label>
              <Input value={newInvoice.roomNumber} onChange={e => setNewInvoice(p => ({ ...p, roomNumber: e.target.value }))} placeholder="e.g. A101" />
            </div>
            <div>
              <Label>Person who did the maintenance</Label>
              <Input value={newInvoice.personName} onChange={e => setNewInvoice(p => ({ ...p, personName: e.target.value }))} placeholder="Name or company" />
            </div>
            <div>
              <Label>Invoice / Receipt Photo</Label>
              <label className="flex items-center gap-2 cursor-pointer border border-dashed border-border rounded-lg p-4 hover:bg-muted/30 transition-colors mt-1">
                <Upload className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{newInvoice.photoFile || "Click to upload invoice/receipt"}</span>
                <input type="file" accept=".pdf,image/*" className="hidden" onChange={(e) => setNewInvoice(p => ({ ...p, photoFile: e.target.files?.[0]?.name || "" }))} />
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAdd}>Save Invoice</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default MaintenanceInvoices;