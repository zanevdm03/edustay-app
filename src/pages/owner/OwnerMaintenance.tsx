import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { mockMaintenanceRequests, type MaintenanceRequest } from "@/lib/mockNotifications";
import { mockProperties } from "@/lib/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Wrench, Eye, Image, Clock, CheckCircle, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const OwnerMaintenance = () => {
  const { toast } = useToast();
  const ownerPropertyIds = mockProperties.filter(p => p.ownerId === "o1").map(p => p.id);
  const [requests, setRequests] = useState<MaintenanceRequest[]>(
    mockMaintenanceRequests.filter(r => ownerPropertyIds.includes(r.propertyId))
  );
  const [viewRequest, setViewRequest] = useState<MaintenanceRequest | null>(null);

  const statusColors: Record<string, string> = {
    pending: "bg-warning/10 text-warning border-warning/20",
    in_progress: "bg-info/10 text-info border-info/20",
    resolved: "bg-success/10 text-success border-success/20",
  };

  const formatTimestamp = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleDateString("en-ZA") + " " + d.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" });
  };

  const handleOwnerResponse = (id: string, response: "approved" | "investigate") => {
    setRequests(prev => prev.map(r =>
      r.id === id ? { ...r, ownerResponse: response, ownerResponseAt: new Date().toISOString() } : r
    ));
    setViewRequest(null);
    toast({
      title: response === "approved" ? "Maintenance Approved" : "Investigation Requested",
      description: response === "approved"
        ? "The maintenance team can proceed with the repair."
        : "The maintenance team will investigate the cause of the damage.",
    });
  };

  return (
    <DashboardLayout role="owner">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-serif text-foreground">Maintenance</h1>
          <p className="text-muted-foreground mt-1">View maintenance history for your properties</p>
        </div>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            {requests.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Wrench className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>No maintenance requests for your properties.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Area</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell className="font-medium">{req.propertyName}</TableCell>
                      <TableCell className="text-muted-foreground">{req.unitName}</TableCell>
                      <TableCell className="text-muted-foreground">{req.area}</TableCell>
                      <TableCell className="text-muted-foreground">{req.item}</TableCell>
                      <TableCell className="text-muted-foreground text-xs"><Clock className="h-3 w-3 inline mr-1" />{formatTimestamp(req.createdAt)}</TableCell>
                      <TableCell className="text-muted-foreground">{req.cost ? `R${req.cost.toLocaleString()}` : "—"}</TableCell>
                      <TableCell><Badge className={cn("capitalize border", statusColors[req.status])}>{req.status.replace("_", " ")}</Badge></TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" onClick={() => setViewRequest(req)}><Eye className="h-4 w-4 mr-1" /> View</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* View + Approve/Investigate Dialog */}
      <Dialog open={!!viewRequest} onOpenChange={() => setViewRequest(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle className="font-serif">Maintenance Details</DialogTitle></DialogHeader>
          {viewRequest && (
            <div className="space-y-4 py-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-muted-foreground">Property</p><p className="font-medium text-foreground">{viewRequest.propertyName}</p></div>
                <div><p className="text-muted-foreground">Unit</p><p className="font-medium text-foreground">{viewRequest.unitName}</p></div>
                <div><p className="text-muted-foreground">Area</p><p className="font-medium text-foreground">{viewRequest.area}</p></div>
                <div><p className="text-muted-foreground">Item</p><p className="font-medium text-foreground">{viewRequest.item}</p></div>
                <div><p className="text-muted-foreground">Date Submitted</p><p className="font-medium text-foreground">{formatTimestamp(viewRequest.createdAt)}</p></div>
                <div><p className="text-muted-foreground">Status</p><Badge className={cn("capitalize border", statusColors[viewRequest.status])}>{viewRequest.status.replace("_", " ")}</Badge></div>
              </div>

              {viewRequest.description && (
                <div><p className="text-muted-foreground">Description</p><p className="font-medium text-foreground">{viewRequest.description}</p></div>
              )}

              {/* Photos - proof of damage */}
              {viewRequest.photos && viewRequest.photos.length > 0 && (
                <div>
                  <p className="text-muted-foreground mb-2">Photos</p>
                  <div className="grid grid-cols-2 gap-2">
                    {viewRequest.photos.map((p, i) => (
                      <div key={i} className="bg-muted/50 rounded-lg p-4 text-center text-xs text-muted-foreground flex flex-col items-center justify-center aspect-video">
                        <Image className="h-6 w-6 mb-1 opacity-40" />{p}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Completion photos */}
              {viewRequest.completionPhotos && viewRequest.completionPhotos.length > 0 && (
                <div>
                  <p className="text-muted-foreground mb-2">Completion Photos</p>
                  <div className="grid grid-cols-2 gap-2">
                    {viewRequest.completionPhotos.map((p, i) => (
                      <div key={i} className="bg-success/5 border border-success/20 rounded-lg p-4 text-center text-xs text-muted-foreground flex flex-col items-center justify-center aspect-video">
                        <Image className="h-6 w-6 mb-1 opacity-40" />{p}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {viewRequest.cost !== undefined && viewRequest.cost > 0 && (
                <div><p className="text-muted-foreground">Repair Cost</p><p className="font-medium text-foreground">R{viewRequest.cost.toLocaleString()}</p></div>
              )}

              {viewRequest.ownerResponse && (
                <div>
                  <p className="text-muted-foreground">Your Response</p>
                  <Badge variant="outline" className={cn("capitalize", viewRequest.ownerResponse === "approved" ? "text-success border-success/30" : "text-info border-info/30")}>
                    {viewRequest.ownerResponse}
                  </Badge>
                  {viewRequest.ownerResponseAt && (
                    <p className="text-xs text-muted-foreground mt-1">Responded: {formatTimestamp(viewRequest.ownerResponseAt)}</p>
                  )}
                </div>
              )}

              {viewRequest.maintenanceDescription && (
                <div><p className="text-muted-foreground">Maintenance Notes</p><p className="font-medium text-foreground">{viewRequest.maintenanceDescription}</p></div>
              )}
            </div>
          )}
          {viewRequest && !viewRequest.ownerResponse && (
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => handleOwnerResponse(viewRequest.id, "investigate")}>
                <Search className="h-4 w-4 mr-1" /> Investigate
              </Button>
              <Button onClick={() => handleOwnerResponse(viewRequest.id, "approved")}>
                <CheckCircle className="h-4 w-4 mr-1" /> Approve
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default OwnerMaintenance;
