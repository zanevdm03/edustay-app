import { useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { mockStudents, mockProperties } from "@/lib/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileText, FolderArchive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StatusBadge from "@/components/StatusBadge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import ContractHeader from "@/components/ContractHeader";

const AdminContracts = () => {
  const { toast } = useToast();
  const contractedStudents = mockStudents.filter((s) => s.applicationStatus === "contracted" && s.allocation);
  const [viewContract, setViewContract] = useState<string | null>(null);
  const student = contractedStudents.find(s => s.id === viewContract);

  const [propertyFilter, setPropertyFilter] = useState("all");
  const [institutionFilter, setInstitutionFilter] = useState("all");
  const [fundingFilter, setFundingFilter] = useState("all");

  const filtered = useMemo(() => {
    return contractedStudents.filter((s) => {
      const matchesProperty = propertyFilter === "all" || s.allocation?.propertyId === propertyFilter;
      const matchesInstitution = institutionFilter === "all" || s.institution === institutionFilter;
      const matchesFunding = fundingFilter === "all" || s.fundingMethod === fundingFilter;
      return matchesProperty && matchesInstitution && matchesFunding;
    });
  }, [propertyFilter, institutionFilter, fundingFilter, contractedStudents]);

  const handleExportZip = () => {
    toast({ title: "Export Started", description: `Exporting ${filtered.length} contract(s) as ZIP.` });
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-serif text-foreground">Contracts</h1>
            <p className="text-muted-foreground mt-1">Generated accommodation contracts</p>
          </div>
          <Button variant="outline" onClick={handleExportZip} disabled={filtered.length === 0}>
            <FolderArchive className="h-4 w-4 mr-1" /> Export ZIP ({filtered.length})
          </Button>
        </div>

        <div className="flex flex-wrap gap-3">
          <Select value={propertyFilter} onValueChange={setPropertyFilter}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Property" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Properties</SelectItem>
              {mockProperties.map((p) => (<SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>))}
            </SelectContent>
          </Select>
          <Select value={institutionFilter} onValueChange={setInstitutionFilter}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Institution" /></SelectTrigger>
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
        </div>

        <Card className="shadow-card">
          <CardContent className="pt-6">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>No contracts match the current filters.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Institution</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Rent</TableHead>
                    <TableHead>Funding</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell className="text-muted-foreground">{s.institution}</TableCell>
                      <TableCell>{s.allocation!.propertyName}</TableCell>
                      <TableCell>{s.allocation!.unitName}</TableCell>
                      <TableCell>{s.allocation!.roomNumber}</TableCell>
                      <TableCell>R{s.allocation!.monthlyRent.toLocaleString()}/mo</TableCell>
                      <TableCell className="uppercase text-xs font-medium text-muted-foreground">{s.fundingMethod}</TableCell>
                      <TableCell><StatusBadge status="contracted" /></TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" onClick={() => setViewContract(s.id)}>
                          <FileText className="h-4 w-4 mr-1" /> View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!viewContract} onOpenChange={() => setViewContract(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="font-serif">Student Lease Agreement</DialogTitle>
          </DialogHeader>
          {student && student.allocation && student.applicationData && (
            <ScrollArea className="max-h-[70vh] pr-4">
              <ContractView app={student.applicationData} alloc={student.allocation} />
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

const ContractView = ({ app, alloc }: { app: any; alloc: any }) => (
  <div className="space-y-5 text-sm leading-relaxed py-2">
    <ContractHeader />
    <Separator />
    <Section title="1. PARTIES">
      <p className="text-muted-foreground mb-2">This Agreement is entered into between:</p>
      <p className="font-semibold text-foreground text-xs">1.1) The Landlord / Owner:</p>
      <Field label="Name / Entity" value={alloc.ownerName} />
      <p className="text-xs text-muted-foreground mb-2">Represented by: EduStay Accommodation (Pty) Ltd<br />(Acting under supervision of a registered Principal Property Practitioner)</p>
      <p className="font-semibold text-foreground text-xs text-center my-2">AND</p>
      <p className="font-semibold text-foreground text-xs">1.2) The Tenant:</p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
        <Field label="Full Name" value={app.fullName} />
        <Field label="ID Number" value={app.idNumber} />
        <Field label="Student Number" value={app.studentNumber} />
        <Field label="Email" value={app.email} />
      </div>
      <p className="font-semibold text-foreground text-xs text-center my-2">AND (if applicable)</p>
      <p className="font-semibold text-foreground text-xs">1.3) The Parent / Surety:</p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
        <Field label="Full Name" value={app.motherFullName || app.fatherFullName} />
        <Field label="Contact Number" value={app.motherWhatsapp || app.fatherWhatsapp} />
        <Field label="Email Address" value={app.motherEmail || app.fatherEmail} />
      </div>
    </Section>
    <Separator />
    <Section title="2. PROPERTY">
      <p className="text-muted-foreground mb-2">The Landlord leases to the Tenant:</p>
      <Field label="Property Address" value={`${alloc.propertyName}, ${alloc.propertyAddress}`} />
      <Field label="Unit" value={alloc.unitName} />
      <Field label="Room Number" value={alloc.roomNumber} />
      <p className="text-xs text-muted-foreground mt-1">For residential student accommodation purposes only. The room will be occupied by ({alloc.occupants || 1}) and ONLY ({alloc.occupants || 1}) persons.</p>
    </Section>
    <Separator />
    <Section title="3. LEASE PERIOD">
      <p className="text-xs text-muted-foreground">The lease period will commence on <span className="font-medium text-foreground">{alloc.leaseStart}</span> and terminates on <span className="font-medium text-foreground">{alloc.leaseEnd}</span>.</p>
      <div className="text-xs text-muted-foreground space-y-1 mt-2">
        <p>3.1) This is a fixed term lease. Early termination shall comply with the Consumer Protection Act.</p>
        <p>3.2) In the case of early termination, the Tenant will give 30 days written notice to the Agency.</p>
      </div>
    </Section>
    <Separator />
    <Section title="4. DEPOSIT & FEES">
      <div className="text-xs text-muted-foreground space-y-1">
        <p>4.1) The Tenant shall pay a deposit to secure the accommodation.</p>
        <p>4.2) Deposit Amount: <span className="font-medium text-foreground">R{alloc.depositAmount?.toLocaleString()}.00</span></p>
        <p>4.3) Admin Fee: <span className="font-medium text-foreground">R{alloc.adminFee?.toLocaleString()}.00</span> (NOT refundable)</p>
        <p>4.4) Key Deposit: <span className="font-medium text-foreground">R{alloc.keyDeposit?.toLocaleString()}.00</span> (refundable upon return of all keys)</p>
        <p>4.5) The deposit shall be refunded within 14 days after the termination of the lease, subject to deductions for damages or outstanding rent.</p>
      </div>
    </Section>
    <Separator />
    <Section title="5. RENTAL">
      <div className="text-xs text-muted-foreground space-y-1">
        <p>5.1) Monthly Rental: <span className="font-medium text-foreground">R{alloc.monthlyRent?.toLocaleString()}.00</span></p>
        <p>5.2) Due Date: On or before the <span className="font-medium text-foreground">{app.preferredPaymentDate}</span> of each month.</p>
        <p>5.3) The Tenant shall pay the rental by EFT, cash deposit, or NSFAS allocation as agreed.</p>
        <p className="font-semibold text-foreground mt-2">5.4) Banking Details of Trust Account</p>
        <div className="bg-muted/50 rounded p-3 space-y-1">
          <p>EduStay Accommodation (Pty) Ltd</p>
          <p>ABSA Bank</p>
          <p>Reference: {alloc.propertyName}, {alloc.unitName}, {app.fullName}</p>
        </div>
      </div>
    </Section>
    <Separator />
    <Section title="6. USE OF PROPERTY">
      <div className="text-xs text-muted-foreground space-y-1">
        <p>6.1) The premises shall be used solely for residential student accommodation purposes.</p>
        <p>6.2) The Tenant shall not use the premises or allow it to be used for any illegal, immoral, or commercial purposes.</p>
        <p>6.3) The Tenant shall not make any structural alterations to the premises without prior written consent of the Landlord.</p>
        <p>6.4) The Tenant shall keep the premises in a clean and habitable condition and shall be liable for any damage caused by negligence or misuse.</p>
        <p>6.5) The Tenant shall not sub-let or assign any part of the premises without prior written consent.</p>
        <p>6.6) Pets are strictly prohibited unless written consent is obtained from the Landlord.</p>
      </div>
    </Section>
    <Separator />
    <Section title="7. MAINTENANCE AND REPAIRS">
      <div className="text-xs text-muted-foreground space-y-1">
        <p>7.1) The Landlord shall maintain the structural integrity of the building and common areas.</p>
        <p>7.2) The Tenant shall report any maintenance issues promptly via the EduStay platform.</p>
        <p>7.3) The Tenant shall be responsible for minor maintenance and the cost of repairs resulting from negligence or misuse.</p>
        <p>7.4) The Landlord shall not be liable for any loss or damage to the Tenant's personal belongings.</p>
      </div>
    </Section>
    <Separator />
    <Section title="8. HOUSE RULES">
      <div className="text-xs text-muted-foreground space-y-1">
        <p>8.1) The Tenant agrees to abide by the house rules as set out by the Landlord or managing agent.</p>
        <p>8.2) Quiet hours are from 22:00 to 06:00 daily.</p>
        <p>8.3) Visitors are allowed but must vacate the premises by 22:00 unless prior arrangement has been made.</p>
        <p>8.4) Smoking is prohibited inside the premises.</p>
        <p>8.5) The Tenant shall dispose of refuse in the designated areas provided.</p>
      </div>
    </Section>
    <Separator />
    <Section title="9. DIGITAL EXECUTION">
      <div className="text-xs text-muted-foreground space-y-1">
        <p>9.1) This agreement may be executed electronically in accordance with the Electronic Communications and Transactions Act 25 of 2002.</p>
        <p>9.2) An electronic signature shall have the same legal validity as a handwritten signature.</p>
      </div>
    </Section>
    <Separator />
    <Section title="10. POPIA CONSENT">
      <div className="text-xs text-muted-foreground space-y-1">
        <p>10.1) The Tenant consents to the collection, processing, and storage of personal information by EduStay Accommodation (Pty) Ltd for the purposes of this lease agreement and property management.</p>
        <p>10.2) Personal information will be handled in accordance with the Protection of Personal Information Act 4 of 2013 (POPIA).</p>
        <p>10.3) The Tenant has the right to request access to, correction of, or deletion of their personal information.</p>
      </div>
    </Section>
    <Separator />
    <Section title="11. PLATFORM USAGE">
      <div className="text-xs text-muted-foreground space-y-1">
        <p>11.1) The Tenant agrees to use the EduStay platform for all communication, maintenance requests, and payment submissions.</p>
        <p>11.2) The Tenant shall not share login credentials with any third party.</p>
        <p>11.3) EduStay reserves the right to suspend access for violation of platform terms of use.</p>
      </div>
    </Section>
    <Separator />
    <Section title="12. BREACH AND TERMINATION">
      <div className="text-xs text-muted-foreground space-y-1">
        <p>12.1) Should the Tenant breach any term of this agreement, the Landlord shall issue a written notice allowing 20 business days to remedy the breach.</p>
        <p>12.2) If the breach is not remedied within the stipulated period, the Landlord may cancel the lease and take legal action to recover damages and outstanding amounts.</p>
        <p>12.3) The Landlord may terminate the lease immediately in cases of illegal activity, damage to property, or threatening behaviour.</p>
      </div>
    </Section>
    <Separator />
    <Section title="13. DISPUTE RESOLUTION">
      <div className="text-xs text-muted-foreground space-y-1">
        <p>13.1) Any dispute arising from this agreement shall first be referred to mediation.</p>
        <p>13.2) Should mediation fail, the matter shall be referred to the Rental Housing Tribunal or a competent court of law.</p>
        <p>13.3) The costs of legal proceedings shall be borne by the unsuccessful party.</p>
      </div>
    </Section>
    <Separator />
    <Section title="14. GENERAL PROVISIONS">
      <div className="text-xs text-muted-foreground space-y-1">
        <p>14.1) This agreement constitutes the entire agreement between the parties. No amendments shall be valid unless reduced to writing and signed by both parties.</p>
        <p>14.2) The Tenant acknowledges having read, understood, and agreed to all terms and conditions herein.</p>
        <p>14.3) This agreement shall be governed by the laws of the Republic of South Africa.</p>
        <p>14.4) Any clause found to be unenforceable shall be severed without affecting the remaining provisions.</p>
      </div>
    </Section>
    <Separator />
    <Section title="15. SIGNATURES">
      <p className="text-xs text-muted-foreground mb-6">
        This agreement is signed at ______________ on this _____ day of ______________ 2026.
      </p>
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-2">
          <div className="border-b border-foreground w-full" />
          <p className="text-xs font-semibold text-foreground">PRINCIPAL</p>
        </div>
        <div className="space-y-2">
          <div className="border-b border-foreground w-full" />
          <p className="text-xs font-semibold text-foreground">LANDLORD</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-8 mt-8">
        <div className="space-y-2">
          <div className="border-b border-foreground w-full" />
          <p className="text-xs font-semibold text-foreground">TENANT SIGNATURE</p>
        </div>
        <div className="space-y-2">
          <div className="border-b border-foreground w-full" />
          <p className="text-xs font-semibold text-foreground">AGENT SIGNATURE</p>
        </div>
      </div>
    </Section>
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="space-y-2">
    <h4 className="font-serif text-sm font-semibold text-foreground">{title}</h4>
    {children}
  </div>
);

const Field = ({ label, value }: { label: string; value: string }) => (
  <p className="text-xs text-muted-foreground">{label}: <span className="font-medium text-foreground">{value}</span></p>
);

export default AdminContracts;