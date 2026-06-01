import { useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import StatusBadge from "@/components/StatusBadge";
import { mockRequests, mockStudents, mockProperties, type ApplicationRequest } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Eye, MapPin, Users, AlertTriangle, Sparkles } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const AdminApplications = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState<ApplicationRequest[]>(mockRequests);
  const [approveDialog, setApproveDialog] = useState<string | null>(null);
  const [secretCode, setSecretCode] = useState("");
  const [allocateDialog, setAllocateDialog] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [viewDialog, setViewDialog] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState("");
  const [adminFee, setAdminFee] = useState("");
  const [keyDeposit, setKeyDeposit] = useState("");
  const [leaseStart, setLeaseStart] = useState("2026-03-01");
  const [leaseEnd, setLeaseEnd] = useState("2026-11-30");

  const handleApprove = (reqId: string) => {
    if (!secretCode.trim()) return;
    setRequests((prev) =>
      prev.map((r) => (r.id === reqId ? { ...r, status: "approved" as const, secretCode } : r))
    );
    setApproveDialog(null);
    setSecretCode("");
    toast({ title: "Access Approved", description: `Secret code sent to the student.` });
  };

  const submittedStudents = mockStudents.filter((s) => s.applicationStatus === "submitted");

  // Get the student being allocated
  const allocatingStudent = mockStudents.find((s) => s.id === allocateDialog);

  // Smart matching: filter properties by student gender
  const matchedProperties = useMemo(() => {
    if (!allocatingStudent) return mockProperties;
    const studentGender = allocatingStudent.applicationData?.gender || allocatingStudent.gender;
    return mockProperties.filter(
      (p) => !p.gender || p.gender === "Mixed" || p.gender === studentGender
    );
  }, [allocatingStudent]);

  // Find roommates in the same room (sharing) or unit for compatibility info
  const getRoommateCompatibility = useMemo(() => {
    if (!allocatingStudent || !selectedUnit) return [];
    const studentField = allocatingStudent.applicationData?.fieldOfStudy || "";
    const unit = mockProperties.find((p) => p.id === selectedProperty)?.units.find((u) => u.id === selectedUnit);
    if (!unit) return [];

    const occupiedRooms = unit.rooms.filter((r) => r.status === "occupied" && r.studentId);
    return occupiedRooms.map((room) => {
      const roommate = mockStudents.find((s) => s.id === room.studentId);
      const roommateField = roommate?.applicationData?.fieldOfStudy || "";
      const fieldMatch = studentField && roommateField &&
        studentField.toLowerCase().includes(roommateField.split(" ").pop()?.toLowerCase() || "") ||
        roommateField.toLowerCase().includes(studentField.split(" ").pop()?.toLowerCase() || "");
      return {
        roomNumber: room.number,
        name: roommate?.name || room.studentName || "Unknown",
        fieldOfStudy: roommateField,
        institution: roommate?.institution || "",
        fieldMatch,
      };
    });
  }, [allocatingStudent, selectedProperty, selectedUnit]);

  const property = mockProperties.find((p) => p.id === selectedProperty);
  const unit = property?.units.find((u) => u.id === selectedUnit);
  const availableRooms = unit?.rooms.filter((r) => r.status === "available") || [];
  const selectedRoomObj = unit?.rooms.find((r) => r.number === selectedRoom);

  const handleAllocate = () => {
    if (!selectedProperty || !selectedUnit || !selectedRoom || !property || !unit || !selectedRoomObj) return;
    toast({
      title: "Student Allocated",
      description: `Student assigned to room ${selectedRoom}. Contract generated with deposit R${depositAmount}, rent R${selectedRoomObj.monthlyRent}/mo.`,
    });
    setAllocateDialog(null);
    setSelectedProperty("");
    setSelectedUnit("");
    setSelectedRoom("");
    setDepositAmount("");
    setAdminFee("");
    setKeyDeposit("");
  };

  const viewStudent = mockStudents.find((s) => s.id === viewDialog);

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-serif text-foreground">Applications</h1>
          <p className="text-muted-foreground mt-1">Review access requests and submitted applications</p>
        </div>

        {/* Access Requests */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-serif">Access Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Secret Code</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((req) => (
                  <TableRow key={req.id}>
                    <TableCell className="font-medium">{req.studentName}</TableCell>
                    <TableCell className="text-muted-foreground">{req.studentEmail}</TableCell>
                    <TableCell className="text-muted-foreground">{req.requestDate}</TableCell>
                    <TableCell><StatusBadge status={req.status} /></TableCell>
                    <TableCell className="font-mono text-sm">{req.secretCode || "—"}</TableCell>
                    <TableCell className="text-right">
                      {req.status === "pending" && (
                        <Button size="sm" onClick={() => setApproveDialog(req.id)}>
                          <CheckCircle className="h-4 w-4 mr-1" /> Approve
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Submitted Applications */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-serif">Submitted Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>University</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submittedStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {student.applicationData?.gender || student.gender}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{student.applicationData?.placeOfStudy}</TableCell>
                    <TableCell className="text-muted-foreground">{student.applicationData?.fieldOfStudy}</TableCell>
                    <TableCell><StatusBadge status={student.applicationStatus} /></TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button size="sm" variant="outline" onClick={() => setViewDialog(student.id)}>
                        <Eye className="h-4 w-4 mr-1" /> View
                      </Button>
                      <Button size="sm" onClick={() => setAllocateDialog(student.id)}>
                        <MapPin className="h-4 w-4 mr-1" /> Allocate
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Approve Dialog */}
      <Dialog open={!!approveDialog} onOpenChange={() => setApproveDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif">Approve Application Access</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Label>Enter Secret Code for Student</Label>
            <Input
              placeholder="e.g. ACC-1234"
              value={secretCode}
              onChange={(e) => setSecretCode(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">This code will be shared with the student to activate their application form.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveDialog(null)}>Cancel</Button>
            <Button onClick={() => approveDialog && handleApprove(approveDialog)}>Approve & Send Code</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Allocate Dialog with Smart Matching */}
      <Dialog open={!!allocateDialog} onOpenChange={() => setAllocateDialog(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Smart Room Allocation
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[65vh] overflow-y-auto">
            {/* Student Info Summary */}
            {allocatingStudent && (
              <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                <p className="text-sm font-medium">{allocatingStudent.name}</p>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline" className="text-xs">
                    {allocatingStudent.applicationData?.gender || allocatingStudent.gender}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {allocatingStudent.applicationData?.placeOfStudy || allocatingStudent.institution}
                  </Badge>
                  {allocatingStudent.applicationData?.fieldOfStudy && (
                    <Badge variant="outline" className="text-xs">
                      {allocatingStudent.applicationData.fieldOfStudy}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Gender-matched properties info */}
            <div className="flex items-start gap-2 bg-primary/5 border border-primary/20 rounded-lg p-3">
              <Users className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground">
                Properties are filtered to match the student's gender ({allocatingStudent?.applicationData?.gender || allocatingStudent?.gender}).
                {matchedProperties.length < mockProperties.length && (
                  <span className="text-primary font-medium"> {mockProperties.length - matchedProperties.length} property(ies) excluded due to gender mismatch.</span>
                )}
              </p>
            </div>

            <div>
              <Label>Property (gender-matched)</Label>
              <Select value={selectedProperty} onValueChange={(v) => { setSelectedProperty(v); setSelectedUnit(""); setSelectedRoom(""); }}>
                <SelectTrigger><SelectValue placeholder="Select property" /></SelectTrigger>
                <SelectContent>
                  {matchedProperties.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} — {p.gender || "Mixed"} only
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {property && (
              <div>
                <Label>Unit</Label>
                <Select value={selectedUnit} onValueChange={(v) => { setSelectedUnit(v); setSelectedRoom(""); }}>
                  <SelectTrigger><SelectValue placeholder="Select unit" /></SelectTrigger>
                  <SelectContent>
                    {property.units.map((u) => (
                      <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Roommate Compatibility Panel */}
            {selectedUnit && getRoommateCompatibility.length > 0 && (
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">Current Occupants in Unit</Label>
                <div className="space-y-2">
                  {getRoommateCompatibility.map((rm, i) => (
                    <div key={i} className="flex items-center justify-between bg-muted/30 rounded-lg p-2 text-sm">
                      <div>
                        <p className="font-medium">{rm.name} <span className="text-muted-foreground text-xs">— Room {rm.roomNumber}</span></p>
                        <p className="text-xs text-muted-foreground">{rm.fieldOfStudy} • {rm.institution}</p>
                      </div>
                      {rm.fieldMatch ? (
                        <Badge className="bg-success/10 text-success border-success/20 border text-xs">
                          <Sparkles className="h-3 w-3 mr-1" /> Similar field
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs text-muted-foreground">Different field</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedUnit && getRoommateCompatibility.length === 0 && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground p-2">
                <AlertTriangle className="h-3 w-3" /> No current occupants in this unit — student will be the first.
              </div>
            )}

            {unit && (
              <div>
                <Label>Room</Label>
                <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                  <SelectTrigger><SelectValue placeholder="Select room" /></SelectTrigger>
                  <SelectContent>
                    {availableRooms.map((r) => (
                      <SelectItem key={r.id} value={r.number}>{r.number} — {r.type} — R{r.monthlyRent}/mo</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {selectedRoomObj && (
              <>
                <Separator />
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Financial Details</p>
                <div className="bg-muted/50 rounded-lg p-3 text-sm space-y-1">
                  <div className="flex justify-between"><span className="text-muted-foreground">Monthly Rent:</span><span className="font-medium">R{selectedRoomObj.monthlyRent.toLocaleString()}.00</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Room Type:</span><span className="font-medium capitalize">{selectedRoomObj.type}</span></div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label className="text-xs">Deposit (R)</Label>
                    <Input placeholder="e.g. 4500" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} />
                  </div>
                  <div>
                    <Label className="text-xs">Admin Fee (R)</Label>
                    <Input placeholder="e.g. 500" value={adminFee} onChange={(e) => setAdminFee(e.target.value)} />
                  </div>
                  <div>
                    <Label className="text-xs">Key Deposit (R)</Label>
                    <Input placeholder="e.g. 200" value={keyDeposit} onChange={(e) => setKeyDeposit(e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Lease Start</Label>
                    <Input type="date" value={leaseStart} onChange={(e) => setLeaseStart(e.target.value)} />
                  </div>
                  <div>
                    <Label className="text-xs">Lease End</Label>
                    <Input type="date" value={leaseEnd} onChange={(e) => setLeaseEnd(e.target.value)} />
                  </div>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAllocateDialog(null)}>Cancel</Button>
            <Button onClick={handleAllocate} disabled={!selectedRoom || !depositAmount}>Allocate & Generate Contract</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Application Dialog */}
      <Dialog open={!!viewDialog} onOpenChange={() => setViewDialog(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif">Application Details</DialogTitle>
          </DialogHeader>
          {viewStudent?.applicationData && (
            <div className="grid grid-cols-2 gap-4 py-4 text-sm">
              {Object.entries(viewStudent.applicationData).map(([key, value]) => (
                <div key={key}>
                  <p className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, " $1")}</p>
                  <p className="font-medium text-foreground">{value}</p>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default AdminApplications;
