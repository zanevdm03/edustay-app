import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import { mockMaintenanceRequests, type MaintenanceRequest } from "@/lib/mockNotifications";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Wrench, Eye, Upload, Clock, Image, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import NotificationBar from "@/components/NotificationBar";

const MaintenanceDashboard = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState<MaintenanceRequest[]>(mockMaintenanceRequests);
  const [viewRequest, setViewRequest] = useState<MaintenanceRequest | null>(null);
  const [filter, setFilter] = useState("all");
  const [invoiceOpen, setInvoiceOpen] = useState(false);
  const [invoiceData, setInvoiceData] = useState({ requestId: "", cost: "", file: "" });
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const [descData, setDescData] = useState({ requestId: "", description: "" });
  const [completeOpen, setCompleteOpen] = useState(false);
  const [completeData, setCompleteData] = useState({ requestId: "", photos: [] as File[] });

  const filtered = filter === "all" ? requests : requests.filter((r) => r.status === filter);
  const pending = requests.filter(r => r.status === "pending").length;
  const inProgress = requests.filter(r => r.status === "in_progress").length;
  const resolved = requests.filter(r => r.status === "resolved").length;

  const statusColors: Record<string, string> = {
    pending: "bg-warning/10 text-warning border-warning/20",
    in_progress: "bg-info/10 text-info border-info/20",
    resolved: "bg-success/10 text-success border-success/20",
  };

  const ownerResponseColors: Record<string, string> = {
    approved: "text-success border-success/30",
    investigate: "text-info border-info/30",
  };

  const handleStart = (id: string) => {
    setRequests(prev => prev.map(r =>
      r.id === id ? { ...r, status: "in_progress" as const, maintenanceStartedAt: new Date().toISOString() } : r
    ));
    toast({ title: "Request Started", description: "Maintenance is now in progress." });
  };

  const handleComplete = () => {
    if (!completeData.requestId) return;
    setRequests(prev => prev.map(r =>
      r.id === completeData.requestId
        ? {
            ...r,
            status: "resolved" as const,
            maintenanceCompleted: true,
            maintenanceCompletedAt: new Date().toISOString(),
            completionPhotos: completeData.photos.map(f => f.name),
          }
        : r
    ));
    setCompleteOpen(false);
    setCompleteData({ requestId: "", photos: [] });
    toast({ title: "Marked Complete", description: "The student will be asked to confirm completion." });
  };

  const handleUploadInvoice = () => {
    if (!invoiceData.requestId || !invoiceData.cost) return;
    setRequests(prev => prev.map(r =>
      r.id === invoiceData.requestId
        ? { ...r, cost: Number(invoiceData.cost), invoiceFile: invoiceData.file || "invoice.pdf" }
        : r
    ));
    setInvoiceOpen(false);
    setInvoiceData({ requestId: "", cost: "", file: "" });
    toast({ title: "Invoice Uploaded", description: "Cost and invoice have been recorded." });
  };

  const handleSaveDescription = () => {
    if (!descData.requestId || !descData.description) return;
    setRequests(prev => prev.map(r =>
      r.id === descData.requestId ? { ...r, maintenanceDescription: descData.description } : r
    ));
    setDescriptionOpen(false);
    setDescData({ requestId: "", description: "" });
    toast({ title: "Description Saved", description: "Maintenance description recorded." });
  };

  const formatTimestamp = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleDateString("en-ZA") + " " + d.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <DashboardLayout role="maintenance_role">
      <div className="space-y-8">
        <NotificationBar userId="maintenance1" />
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-serif text-foreground">Maintenance Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage and track all maintenance requests</p>
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[150px]"><SelectValue placeholder="Filter" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <StatCard title="Pending" value={pending} icon={<AlertTriangle className="h-5 w-5" />} />
          <StatCard title="In Progress" value={inProgress} icon={<Loader2 className="h-5 w-5" />} />
          <StatCard title="Resolved" value={resolved} icon={<CheckCircle className="h-5 w-5" />} />
        </div>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Wrench className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>No maintenance requests.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Area</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell className="font-medium">{req.propertyName}</TableCell>
                      <TableCell className="text-muted-foreground">{req.unitName}</TableCell>
                      <TableCell className="text-muted-foreground">{req.studentName}</TableCell>
                      <TableCell className="text-muted-foreground text-xs"><Clock className="h-3 w-3 inline mr-1" />{formatTimestamp(req.createdAt)}</TableCell>
                      <TableCell className="text-muted-foreground">{req.area}</TableCell>
                      <TableCell className="text-muted-foreground">{req.item}</TableCell>
                      <TableCell className="text-muted-foreground">{req.cost ? `R${req.cost.toLocaleString()}` : "—"}</TableCell>
                      <TableCell>
                        {req.ownerResponse ? (
                          <Badge variant="outline" className={cn("capitalize", ownerResponseColors[req.ownerResponse])}>
                            {req.ownerResponse}
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">Awaiting</span>
                        )}
                      </TableCell>
                      <TableCell><Badge className={cn("capitalize border", statusColors[req.status])}>{req.status.replace("_", " ")}</Badge></TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1 flex-wrap">
                          <Button size="sm" variant="outline" onClick={() => setViewRequest(req)}><Eye className="h-3 w-3" /></Button>
                          {req.status === "pending" && req.ownerResponse && (
                            <Button size="sm" onClick={() => handleStart(req.id)}>Start</Button>
                          )}
                          {req.status === "in_progress" && (
                            <>
                              <Button size="sm" variant="outline" onClick={() => { setDescData({ requestId: req.id, description: req.maintenanceDescription || "" }); setDescriptionOpen(true); }}>
                                Description
                              </Button>
                              {req.ownerResponse === "approved" && (
                                <Button size="sm" variant="outline" onClick={() => { setInvoiceData({ requestId: req.id, cost: "", file: "" }); setInvoiceOpen(true); }}>
                                  <Upload className="h-3 w-3 mr-1" /> Invoice
                                </Button>
                              )}
                              <Button size="sm" onClick={() => { setCompleteData({ requestId: req.id, photos: [] }); setCompleteOpen(true); }}>
                                Complete
                              </Button>
                            </>
                          )}
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

      {/* View Details Dialog with timestamps */}
      <Dialog open={!!viewRequest} onOpenChange={() => setViewRequest(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle className="font-serif">Maintenance Details</DialogTitle></DialogHeader>
          {viewRequest && (
            <div className="space-y-4 py-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-muted-foreground">Property</p><p className="font-medium text-foreground">{viewRequest.propertyName}</p></div>
                <div><p className="text-muted-foreground">Unit</p><p className="font-medium text-foreground">{viewRequest.unitName}</p></div>
                <div><p className="text-muted-foreground">Student</p><p className="font-medium text-foreground">{viewRequest.studentName}</p></div>
                <div><p className="text-muted-foreground">Area</p><p className="font-medium text-foreground">{viewRequest.area}</p></div>
                <div><p className="text-muted-foreground">Item</p><p className="font-medium text-foreground">{viewRequest.item}</p></div>
                <div><p className="text-muted-foreground">Owner Response</p>
                  {viewRequest.ownerResponse ? (
                    <Badge variant="outline" className={cn("capitalize", ownerResponseColors[viewRequest.ownerResponse])}>{viewRequest.ownerResponse}</Badge>
                  ) : <span className="text-muted-foreground">Awaiting</span>}
                </div>
              </div>

              {viewRequest.maintenanceDescription && (
                <div><p className="text-muted-foreground">Description</p><p className="font-medium text-foreground">{viewRequest.maintenanceDescription}</p></div>
              )}

              {/* Timestamps */}
              <div className="bg-muted/30 rounded-lg p-3 space-y-2">
                <p className="text-xs font-medium text-foreground">Timeline</p>
                <div className="flex items-center gap-2 text-xs">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Submitted:</span>
                  <span className="text-foreground">{formatTimestamp(viewRequest.createdAt)}</span>
                </div>
                {viewRequest.ownerResponseAt && (
                  <div className="flex items-center gap-2 text-xs">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Owner responded:</span>
                    <span className="text-foreground">{formatTimestamp(viewRequest.ownerResponseAt)}</span>
                  </div>
                )}
                {viewRequest.maintenanceStartedAt && (
                  <div className="flex items-center gap-2 text-xs">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Maintenance started:</span>
                    <span className="text-foreground">{formatTimestamp(viewRequest.maintenanceStartedAt)}</span>
                  </div>
                )}
                {viewRequest.maintenanceCompletedAt && (
                  <div className="flex items-center gap-2 text-xs">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">Completed:</span>
                    <span className="text-foreground">{formatTimestamp(viewRequest.maintenanceCompletedAt)}</span>
                  </div>
                )}
              </div>

              {viewRequest.photos && viewRequest.photos.length > 0 && (
                <div>
                  <p className="text-muted-foreground mb-2">Damage Photos</p>
                  <div className="grid grid-cols-3 gap-2">
                    {viewRequest.photos.map((p, i) => (
                      <div key={i} className="bg-muted/50 rounded-lg p-4 text-center text-xs text-muted-foreground flex flex-col items-center justify-center aspect-square">
                        <Image className="h-6 w-6 mb-1 opacity-40" />{p}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {viewRequest.completionPhotos && viewRequest.completionPhotos.length > 0 && (
                <div>
                  <p className="text-muted-foreground mb-2">Completion Photos</p>
                  <div className="grid grid-cols-3 gap-2">
                    {viewRequest.completionPhotos.map((p, i) => (
                      <div key={i} className="bg-success/5 border border-success/20 rounded-lg p-4 text-center text-xs text-muted-foreground flex flex-col items-center justify-center aspect-square">
                        <Image className="h-6 w-6 mb-1 opacity-40" />{p}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {viewRequest.cost !== undefined && viewRequest.cost > 0 && (
                <div><p className="text-muted-foreground">Repair Cost</p><p className="font-medium text-foreground">R{viewRequest.cost.toLocaleString()}</p></div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Invoice Upload Dialog */}
      <Dialog open={invoiceOpen} onOpenChange={setInvoiceOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-serif">Upload Invoice</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Repair Cost (R)</Label>
              <Input type="number" value={invoiceData.cost} onChange={e => setInvoiceData(p => ({ ...p, cost: e.target.value }))} />
            </div>
            <div>
              <Label>Invoice/Receipt File</Label>
              <label className="flex items-center gap-2 cursor-pointer border border-dashed border-border rounded-lg p-4 hover:bg-muted/30 transition-colors mt-1">
                <Upload className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{invoiceData.file || "Click to upload invoice/receipt"}</span>
                <input type="file" accept=".pdf,image/*" className="hidden" onChange={(e) => setInvoiceData(p => ({ ...p, file: e.target.files?.[0]?.name || "" }))} />
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInvoiceOpen(false)}>Cancel</Button>
            <Button onClick={handleUploadInvoice}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Description Dialog */}
      <Dialog open={descriptionOpen} onOpenChange={setDescriptionOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-serif">Maintenance Description</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Description of what was done</Label>
              <Textarea value={descData.description} onChange={e => setDescData(p => ({ ...p, description: e.target.value }))} placeholder="Short description of what was done for tracking..." rows={4} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDescriptionOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveDescription}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Complete Dialog with photo upload */}
      <Dialog open={completeOpen} onOpenChange={setCompleteOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-serif">Complete Maintenance Request</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">Upload a photo of the completed fix to confirm the maintenance has been done.</p>
            <div>
              <Label>Upload Photo of Fix</Label>
              <label className="flex items-center gap-2 cursor-pointer border border-dashed border-border rounded-lg p-4 hover:bg-muted/30 transition-colors mt-1">
                <Upload className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {completeData.photos.length > 0 ? completeData.photos.map(f => f.name).join(", ") : "Click to upload photo"}
                </span>
                <input type="file" accept="image/*" className="hidden" multiple onChange={(e) => {
                  if (e.target.files) setCompleteData(p => ({ ...p, photos: Array.from(e.target.files!) }));
                }} />
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCompleteOpen(false)}>Cancel</Button>
            <Button onClick={handleComplete}>
              <CheckCircle className="h-4 w-4 mr-1" /> Mark Complete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default MaintenanceDashboard;
