import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { mockMaintenanceRequests, type MaintenanceRequest } from "@/lib/mockNotifications";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Wrench, Eye, Image, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const AdminMaintenance = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState<MaintenanceRequest[]>(mockMaintenanceRequests);
  const [viewRequest, setViewRequest] = useState<MaintenanceRequest | null>(null);
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? requests : requests.filter((r) => r.status === filter);

  const handleStatusChange = (id: string, status: MaintenanceRequest["status"]) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    toast({ title: "Status Updated", description: `Maintenance request marked as ${status}.` });
  };

  const statusColors: Record<string, string> = {
    pending: "bg-warning/10 text-warning border-warning/20",
    in_progress: "bg-info/10 text-info border-info/20",
    resolved: "bg-success/10 text-success border-success/20",
  };

  const formatTimestamp = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleDateString("en-ZA", { day: "2-digit", month: "2-digit", year: "numeric" }) + " " + d.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-serif text-foreground">Maintenance</h1>
            <p className="text-muted-foreground mt-1">View and manage maintenance requests from students</p>
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
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
                    <TableHead>Reported by</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Area</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Attachments</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell className="font-medium">{req.propertyName}</TableCell>
                      <TableCell className="text-muted-foreground">{req.unitName}</TableCell>
                      <TableCell className="text-muted-foreground">{req.studentName}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTimestamp(req.createdAt)}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{req.area}</TableCell>
                      <TableCell className="text-muted-foreground">{req.item}</TableCell>
                      <TableCell>
                        {req.ownerResponse ? (
                          <Badge variant="outline" className={cn("capitalize", req.ownerResponse === "approved" ? "text-success border-success/30" : "text-info border-info/30")}>
                            {req.ownerResponse}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-xs">Awaiting</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {req.photos && req.photos.length > 0 ? (
                          <Badge variant="outline" className="text-xs flex items-center gap-1 w-fit">
                            <Image className="h-3 w-3" /> {req.photos.length} image{req.photos.length > 1 ? "s" : ""}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-xs">None</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("capitalize border", statusColors[req.status])}>
                          {req.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => setViewRequest(req)}>
                            <Eye className="h-4 w-4 mr-1" /> View
                          </Button>
                          {req.status === "pending" && (
                            <Button size="sm" onClick={() => handleStatusChange(req.id, "in_progress")}>
                              Start
                            </Button>
                          )}
                          {req.status === "in_progress" && (
                            <Button size="sm" onClick={() => handleStatusChange(req.id, "resolved")}>
                              Resolve
                            </Button>
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

      {/* View Request Dialog */}
      <Dialog open={!!viewRequest} onOpenChange={() => setViewRequest(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif">Maintenance Request Details</DialogTitle>
          </DialogHeader>
          {viewRequest && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Property</p>
                  <p className="font-medium text-foreground">{viewRequest.propertyName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Unit</p>
                  <p className="font-medium text-foreground">{viewRequest.unitName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Reported by</p>
                  <p className="font-medium text-foreground">{viewRequest.studentName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p className="font-medium text-foreground">{formatTimestamp(viewRequest.createdAt)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Area</p>
                  <p className="font-medium text-foreground">{viewRequest.area}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Item</p>
                  <p className="font-medium text-foreground">{viewRequest.item}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <Badge className={cn("capitalize border", statusColors[viewRequest.status])}>
                    {viewRequest.status.replace("_", " ")}
                  </Badge>
                </div>
                <div>
                  <p className="text-muted-foreground">Attachments</p>
                  <p className="font-medium text-foreground">
                    {viewRequest.photos && viewRequest.photos.length > 0
                      ? `${viewRequest.photos.length} image(s)`
                      : "None"
                    }
                  </p>
                </div>
              </div>

              {viewRequest.description && (
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="text-sm font-medium text-foreground">{viewRequest.description}</p>
                </div>
              )}

              {viewRequest.maintenanceDescription && (
                <div>
                  <p className="text-sm text-muted-foreground">Maintenance Notes</p>
                  <p className="text-sm font-medium text-foreground">{viewRequest.maintenanceDescription}</p>
                </div>
              )}

              {/* Timeline */}
              <div className="bg-muted/30 rounded-lg p-3 space-y-2">
                <p className="text-xs font-medium text-foreground">Timeline</p>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">Submitted:</span>
                  <span className="text-foreground">{formatTimestamp(viewRequest.createdAt)}</span>
                </div>
                {viewRequest.ownerResponseAt && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground">Owner responded ({viewRequest.ownerResponse}):</span>
                    <span className="text-foreground">{formatTimestamp(viewRequest.ownerResponseAt)}</span>
                  </div>
                )}
                {viewRequest.maintenanceStartedAt && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground">Maintenance started:</span>
                    <span className="text-foreground">{formatTimestamp(viewRequest.maintenanceStartedAt)}</span>
                  </div>
                )}
                {viewRequest.maintenanceCompletedAt && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground">Completed:</span>
                    <span className="text-foreground">{formatTimestamp(viewRequest.maintenanceCompletedAt)}</span>
                  </div>
                )}
              </div>

              {viewRequest.photos && viewRequest.photos.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Damage Photos</p>
                  <div className="grid grid-cols-3 gap-2">
                    {viewRequest.photos.map((photo, i) => (
                      <div key={i} className="bg-muted/50 rounded-lg p-4 text-center text-xs text-muted-foreground flex flex-col items-center justify-center aspect-square">
                        <Image className="h-6 w-6 mb-1 opacity-40" />
                        {photo}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {viewRequest.completionPhotos && viewRequest.completionPhotos.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Completion Photos</p>
                  <div className="grid grid-cols-3 gap-2">
                    {viewRequest.completionPhotos.map((photo, i) => (
                      <div key={i} className="bg-success/5 border border-success/20 rounded-lg p-4 text-center text-xs text-muted-foreground flex flex-col items-center justify-center aspect-square">
                        <Image className="h-6 w-6 mb-1 opacity-40" />
                        {photo}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {viewRequest.cost !== undefined && (
                <div>
                  <p className="text-sm text-muted-foreground">Repair Cost</p>
                  <p className="text-sm font-medium text-foreground">R{viewRequest.cost.toLocaleString()}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminMaintenance;
