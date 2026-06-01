import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { maintenanceAreas, mockMaintenanceRequests, type MaintenanceRequest } from "@/lib/mockNotifications";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeftRight, Wrench, Key, Send, Upload, AlertTriangle, Camera, CheckCircle, Clock, Image } from "lucide-react";
import { cn } from "@/lib/utils";

type ReportType = "transfer" | "maintenance" | "missing_key" | "inspection" | null;
type TransferType = "property" | "room" | null;

const StudentReport = () => {
  const { toast } = useToast();
  const [reportType, setReportType] = useState<ReportType>(null);
  const [submitted, setSubmitted] = useState(false);
  const [myRequests, setMyRequests] = useState<MaintenanceRequest[]>(
    mockMaintenanceRequests.filter(r => r.studentId === "s1")
  );

  // Transfer state
  const [transferType, setTransferType] = useState<TransferType>(null);
  const [transferReason, setTransferReason] = useState("");

  // Maintenance state
  const [maintenanceArea, setMaintenanceArea] = useState("");
  const [maintenanceItem, setMaintenanceItem] = useState("");
  const [maintenanceDesc, setMaintenanceDesc] = useState("");
  const [maintenancePhotos, setMaintenancePhotos] = useState<File[]>([]);

  // Inspection state
  const [keyCode, setKeyCode] = useState("");
  const [keyPhoto, setKeyPhoto] = useState<File | null>(null);

  // Completion dialog
  const [completeDialog, setCompleteDialog] = useState<MaintenanceRequest | null>(null);
  const [completionPhotos, setCompletionPhotos] = useState<File[]>([]);

  const handleTransferSubmit = () => {
    toast({ title: "Request Sent Successfully", description: "Your agent will be in touch." });
    setTransferType(null);
    setTransferReason("");
    setReportType(null);
  };

  const handleMaintenanceSubmit = () => {
    if (!maintenanceArea || !maintenanceItem) return;
    setSubmitted(true);
    setMaintenanceArea("");
    setMaintenanceItem("");
    setMaintenanceDesc("");
    setMaintenancePhotos([]);
  };

  const handleMissingKey = () => {
    toast({ title: "Key Replacement Request Sent", description: "The key deposit (R250.00) will be used for the replacement." });
    setReportType(null);
  };

  const handleInspectionSubmit = () => {
    if (!keyCode) return;
    toast({ title: "Inspection Submitted", description: "Your room key code has been recorded." });
    setKeyCode("");
    setKeyPhoto(null);
    setReportType(null);
  };

  const handleStudentComplete = () => {
    if (!completeDialog) return;
    setMyRequests(prev => prev.map(r =>
      r.id === completeDialog.id
        ? { ...r, studentCompleted: true, completionPhotos: completionPhotos.map(f => f.name) }
        : r
    ));
    setCompleteDialog(null);
    setCompletionPhotos([]);
    toast({ title: "Marked as Complete", description: "Thank you for confirming the maintenance was completed." });
  };

  const addPhoto = (file: File) => {
    setMaintenancePhotos(prev => [...prev, file]);
  };

  const items = maintenanceArea ? maintenanceAreas[maintenanceArea] || [] : [];
  const isOtherSelected = maintenanceItem === "Other";

  const statusColors: Record<string, string> = {
    pending: "bg-warning/10 text-warning border-warning/20",
    in_progress: "bg-info/10 text-info border-info/20",
    resolved: "bg-success/10 text-success border-success/20",
  };

  const formatTimestamp = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleDateString("en-ZA") + " " + d.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <DashboardLayout role="student">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-serif text-foreground">Report</h1>
          <p className="text-muted-foreground mt-1">Submit requests, maintenance issues, inspections, or report missing keys</p>
        </div>

        {/* Submitted confirmation */}
        {submitted && (
          <Card className="shadow-card border-success/30">
            <CardContent className="pt-6 text-center space-y-4">
              <CheckCircle className="h-16 w-16 mx-auto text-success" />
              <h2 className="text-xl font-serif text-foreground">Maintenance Request Submitted</h2>
              <p className="text-muted-foreground">The maintenance team will assess it shortly.</p>
              <Button onClick={() => { setSubmitted(false); setReportType(null); }}>Back to Report</Button>
            </CardContent>
          </Card>
        )}

        {!reportType && !submitted && (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="shadow-card cursor-pointer hover:border-primary transition-colors" onClick={() => setReportType("transfer")}>
                <CardContent className="pt-6 text-center space-y-3">
                  <ArrowLeftRight className="h-10 w-10 mx-auto text-primary" />
                  <h3 className="font-serif text-lg text-foreground">Request Transfer</h3>
                  <p className="text-sm text-muted-foreground">Request a property or room transfer</p>
                </CardContent>
              </Card>
              <Card className="shadow-card cursor-pointer hover:border-primary transition-colors" onClick={() => setReportType("maintenance")}>
                <CardContent className="pt-6 text-center space-y-3">
                  <Wrench className="h-10 w-10 mx-auto text-primary" />
                  <h3 className="font-serif text-lg text-foreground">Maintenance</h3>
                  <p className="text-sm text-muted-foreground">Report a maintenance issue</p>
                </CardContent>
              </Card>
              <Card className="shadow-card cursor-pointer hover:border-primary transition-colors" onClick={() => setReportType("missing_key")}>
                <CardContent className="pt-6 text-center space-y-3">
                  <Key className="h-10 w-10 mx-auto text-primary" />
                  <h3 className="font-serif text-lg text-foreground">Missing Key</h3>
                  <p className="text-sm text-muted-foreground">Report a lost or missing key</p>
                </CardContent>
              </Card>
              <Card className="shadow-card cursor-pointer hover:border-primary transition-colors" onClick={() => setReportType("inspection")}>
                <CardContent className="pt-6 text-center space-y-3">
                  <Camera className="h-10 w-10 mx-auto text-primary" />
                  <h3 className="font-serif text-lg text-foreground">Room Inspection</h3>
                  <p className="text-sm text-muted-foreground">Record your room key code</p>
                </CardContent>
              </Card>
            </div>

            {/* My Maintenance Requests - student can mark as complete */}
            {myRequests.length > 0 && (
              <Card className="shadow-card">
                <CardHeader><CardTitle className="font-serif text-lg">My Maintenance Requests</CardTitle></CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Area</TableHead>
                        <TableHead>Item</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {myRequests.map(req => (
                        <TableRow key={req.id}>
                          <TableCell className="font-medium">{req.area}</TableCell>
                          <TableCell className="text-muted-foreground">{req.item}</TableCell>
                          <TableCell className="text-muted-foreground text-xs">
                            <Clock className="h-3 w-3 inline mr-1" />{formatTimestamp(req.createdAt)}
                          </TableCell>
                          <TableCell>
                            <Badge className={cn("capitalize border", statusColors[req.status])}>
                              {req.status.replace("_", " ")}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {req.maintenanceCompleted && !req.studentCompleted ? (
                              <Button size="sm" onClick={() => setCompleteDialog(req)}>
                                <CheckCircle className="h-3 w-3 mr-1" /> Mark Complete
                              </Button>
                            ) : req.studentCompleted ? (
                              <Badge variant="outline" className="text-success border-success/30">Completed</Badge>
                            ) : (
                              <span className="text-xs text-muted-foreground">Awaiting</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Transfer */}
        {reportType === "transfer" && !submitted && (
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-serif flex items-center gap-2"><ArrowLeftRight className="h-5 w-5 text-primary" /> Request Transfer</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => { setReportType(null); setTransferType(null); }}>← Back</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {!transferType ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setTransferType("property")}>
                    <CardContent className="pt-6 text-center space-y-2">
                      <h4 className="font-medium text-foreground">Property Transfer</h4>
                      <p className="text-sm text-muted-foreground">Move to a different property</p>
                    </CardContent>
                  </Card>
                  <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setTransferType("room")}>
                    <CardContent className="pt-6 text-center space-y-2">
                      <h4 className="font-medium text-foreground">Room Transfer</h4>
                      <p className="text-sm text-muted-foreground">Move to a different room</p>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm font-medium text-foreground">{transferType === "property" ? "Property" : "Room"} Transfer Request</p>
                  <div>
                    <Label>Reason (optional)</Label>
                    <Textarea value={transferReason} onChange={(e) => setTransferReason(e.target.value)} placeholder="Please explain why you want to transfer..." rows={3} />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setTransferType(null)}>Back</Button>
                    <Button onClick={handleTransferSubmit}><Send className="h-4 w-4 mr-1" /> Send Request</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Maintenance */}
        {reportType === "maintenance" && !submitted && (
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-serif flex items-center gap-2"><Wrench className="h-5 w-5 text-primary" /> Maintenance Request</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setReportType(null)}>← Back</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Area</Label>
                <Select value={maintenanceArea} onValueChange={(v) => { setMaintenanceArea(v); setMaintenanceItem(""); }}>
                  <SelectTrigger><SelectValue placeholder="Select area" /></SelectTrigger>
                  <SelectContent>
                    {Object.keys(maintenanceAreas).map((area) => (
                      <SelectItem key={area} value={area}>{area}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {maintenanceArea && (
                <div>
                  <Label>What needs maintenance?</Label>
                  <RadioGroup value={maintenanceItem} onValueChange={setMaintenanceItem} className="grid grid-cols-2 gap-2 mt-2">
                    {items.map((item) => (
                      <div key={item} className="flex items-center space-x-2">
                        <RadioGroupItem value={item} id={`item-${item}`} />
                        <Label htmlFor={`item-${item}`} className="text-sm cursor-pointer">{item}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {isOtherSelected && (
                <div>
                  <Label>Description</Label>
                  <Textarea value={maintenanceDesc} onChange={(e) => setMaintenanceDesc(e.target.value)} placeholder="Describe what needs maintenance..." rows={3} />
                </div>
              )}

              {maintenanceItem && (
                <div>
                  <Label>Upload Photos/Videos</Label>
                  <div className="mt-1 space-y-2">
                    {maintenancePhotos.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {maintenancePhotos.map((f, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{f.name}</Badge>
                        ))}
                      </div>
                    )}
                    <label className="flex items-center gap-2 cursor-pointer border border-dashed border-border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                      <Upload className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Click to upload photos or videos of the damage</span>
                      <input type="file" accept="image/*,video/*" className="hidden" multiple onChange={(e) => {
                        if (e.target.files) Array.from(e.target.files).forEach(addPhoto);
                      }} />
                    </label>
                  </div>
                </div>
              )}

              <Button onClick={handleMaintenanceSubmit} disabled={!maintenanceArea || !maintenanceItem}>
                <Send className="h-4 w-4 mr-1" /> Submit Request
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Missing Key */}
        {reportType === "missing_key" && !submitted && (
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-serif flex items-center gap-2"><Key className="h-5 w-5 text-primary" /> Missing Key</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setReportType(null)}>← Back</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 flex gap-3">
                <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Lost your keys? No worries.</p>
                  <p className="text-sm text-muted-foreground mt-1">The key deposit (<span className="font-medium">R250.00</span>) will be used for the replacement.</p>
                </div>
              </div>
              <Button onClick={handleMissingKey}><Send className="h-4 w-4 mr-1" /> Send Request</Button>
            </CardContent>
          </Card>
        )}

        {/* Room Inspection */}
        {reportType === "inspection" && !submitted && (
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-serif flex items-center gap-2"><Camera className="h-5 w-5 text-primary" /> Room Inspection</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setReportType(null)}>← Back</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">Please record your room key code and attach a photo of the key for verification.</p>
              <div>
                <Label>Room Key Code</Label>
                <Input value={keyCode} onChange={(e) => setKeyCode(e.target.value)} placeholder="e.g. KA102" />
              </div>
              <div>
                <Label>Photo of Key</Label>
                <label className="flex items-center gap-2 cursor-pointer border border-dashed border-border rounded-lg p-4 hover:bg-muted/30 transition-colors mt-1">
                  <Camera className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {keyPhoto ? keyPhoto.name : "Click to upload a photo of your room key"}
                  </span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => setKeyPhoto(e.target.files?.[0] || null)} />
                </label>
              </div>
              <Button onClick={handleInspectionSubmit} disabled={!keyCode}>
                <Send className="h-4 w-4 mr-1" /> Submit Inspection
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Student completion dialog */}
      <Dialog open={!!completeDialog} onOpenChange={() => setCompleteDialog(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle className="font-serif">Confirm Maintenance Complete</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Please upload a photo of the completed fix and confirm the maintenance has been done satisfactorily.
            </p>
            <div>
              <Label>Upload Photo of Fix</Label>
              <label className="flex items-center gap-2 cursor-pointer border border-dashed border-border rounded-lg p-4 hover:bg-muted/30 transition-colors mt-1">
                <Upload className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {completionPhotos.length > 0 ? completionPhotos.map(f => f.name).join(", ") : "Click to upload photo"}
                </span>
                <input type="file" accept="image/*" className="hidden" multiple onChange={(e) => {
                  if (e.target.files) setCompletionPhotos(Array.from(e.target.files));
                }} />
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCompleteDialog(null)}>Cancel</Button>
            <Button onClick={handleStudentComplete}>
              <CheckCircle className="h-4 w-4 mr-1" /> Confirm Complete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default StudentReport;
