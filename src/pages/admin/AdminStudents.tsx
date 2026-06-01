import { useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import StatusBadge from "@/components/StatusBadge";
import { mockStudents, mockProperties } from "@/lib/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Download, FileSpreadsheet, FileText, FolderArchive, Bell, CheckCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

function getStudentRentPaid(studentId: string): boolean | null {
  for (const property of mockProperties) {
    for (const unit of property.units) {
      for (const room of unit.rooms) {
        if (room.studentId === studentId) {
          return room.rentPaid;
        }
      }
    }
  }
  return null;
}

function getStudentResidence(studentId: string): string | null {
  for (const property of mockProperties) {
    for (const unit of property.units) {
      for (const room of unit.rooms) {
        if (room.studentId === studentId) return property.name;
      }
    }
  }
  return null;
}

const AdminStudents = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [institutionFilter, setInstitutionFilter] = useState<string>("all");
  const [fundingFilter, setFundingFilter] = useState<string>("all");
  const [genderFilter, setGenderFilter] = useState<string>("all");
  const [residenceFilter, setResidenceFilter] = useState<string>("all");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const propertyNames = useMemo(() => [...new Set(mockProperties.map(p => p.name))], []);

  const filtered = useMemo(() => {
    return mockStudents.filter(s => {
      const matchesSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase());
      const matchesInstitution = institutionFilter === "all" || s.institution === institutionFilter;
      const matchesFunding = fundingFilter === "all" || s.fundingMethod === fundingFilter;
      const matchesGender = genderFilter === "all" || s.gender === genderFilter;
      const matchesResidence = residenceFilter === "all" || getStudentResidence(s.id) === residenceFilter;
      return matchesSearch && matchesInstitution && matchesFunding && matchesGender && matchesResidence;
    });
  }, [search, institutionFilter, fundingFilter, genderFilter, residenceFilter]);

  const unpaidStudents = filtered.filter((s) => getStudentRentPaid(s.id) === false);

  const toggleStudent = (id: string) => {
    setSelectedStudents((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  };

  const selectAllUnpaid = () => setSelectedStudents(unpaidStudents.map((s) => s.id));

  const handleSendReminder = () => {
    if (selectedStudents.length === 0) return;
    toast({ title: "Rent Reminders Sent", description: `Notification sent to ${selectedStudents.length} student(s).` });
    setSelectedStudents([]);
  };

  const handleExport = (format: "excel" | "pdf" | "zip") => {
    const labels = { excel: "Excel spreadsheet", pdf: "PDF document", zip: "ZIP folder with contracts" };
    toast({ title: "Export Started", description: `Exporting ${filtered.length} student(s) as ${labels[format]}.` });
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-serif text-foreground">Students</h1>
          <p className="text-muted-foreground mt-1">All registered students and their application status</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={institutionFilter} onValueChange={setInstitutionFilter}>
            <SelectTrigger className="w-[150px]"><SelectValue placeholder="Institution" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Institutions</SelectItem>
              <SelectItem value="CUT">CUT</SelectItem>
              <SelectItem value="UFS">UFS</SelectItem>
              <SelectItem value="Eduvos">Eduvos</SelectItem>
            </SelectContent>
          </Select>
          <Select value={fundingFilter} onValueChange={setFundingFilter}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Funding" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Funding</SelectItem>
              <SelectItem value="NSFAS">NSFAS</SelectItem>
              <SelectItem value="cash">Cash</SelectItem>
            </SelectContent>
          </Select>
          <Select value={genderFilter} onValueChange={setGenderFilter}>
            <SelectTrigger className="w-[130px]"><SelectValue placeholder="Gender" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genders</SelectItem>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
            </SelectContent>
          </Select>
          <Select value={residenceFilter} onValueChange={setResidenceFilter}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Residence" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Residences</SelectItem>
              {propertyNames.map(name => (
                <SelectItem key={name} value={name}>{name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline"><Download className="h-4 w-4 mr-1" /> Export</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport("excel")}><FileSpreadsheet className="h-4 w-4 mr-2" /> Export as Excel</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("pdf")}><FileText className="h-4 w-4 mr-2" /> Export as PDF</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("zip")}><FolderArchive className="h-4 w-4 mr-2" /> Export Contracts (ZIP)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {unpaidStudents.length > 0 && (
            <>
              <Button variant="outline" size="sm" onClick={selectAllUnpaid}>Select Unpaid ({unpaidStudents.length})</Button>
              <Button size="sm" disabled={selectedStudents.length === 0} onClick={handleSendReminder}>
                <Bell className="h-4 w-4 mr-1" /> Send Reminder ({selectedStudents.length})
              </Button>
            </>
          )}
        </div>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]"></TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Institution</TableHead>
                  <TableHead>Funding</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Rent Paid</TableHead>
                  <TableHead>Residence</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">No students match the current filters.</TableCell>
                  </TableRow>
                ) : (
                  filtered.map((s) => {
                    const rentPaid = getStudentRentPaid(s.id);
                    const residence = getStudentResidence(s.id);
                    return (
                      <TableRow key={s.id}>
                        <TableCell>
                          {rentPaid === false && (
                            <Checkbox checked={selectedStudents.includes(s.id)} onCheckedChange={() => toggleStudent(s.id)} />
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{s.name}</TableCell>
                        <TableCell className="text-muted-foreground">{s.gender}</TableCell>
                        <TableCell className="text-muted-foreground">{s.email}</TableCell>
                        <TableCell className="text-muted-foreground">{s.phone}</TableCell>
                        <TableCell className="text-muted-foreground">{s.institution}</TableCell>
                        <TableCell className="uppercase text-muted-foreground text-xs font-medium">{s.fundingMethod}</TableCell>
                        <TableCell><StatusBadge status={s.applicationStatus} /></TableCell>
                        <TableCell>
                          {rentPaid === null ? (
                            <span className="text-muted-foreground text-sm">—</span>
                          ) : rentPaid ? (
                            <CheckCircle className="h-5 w-5 text-success" />
                          ) : (
                            <span className="text-xs font-medium text-destructive">UNPAID</span>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">{residence || "—"}</TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminStudents;
