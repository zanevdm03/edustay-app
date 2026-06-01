import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Lock, Send, ShieldCheck, FileUp } from "lucide-react";

const StudentApplication = () => {
  const { toast } = useToast();

  // Flow states: "request" → "unlock" → "form" → "submitted"
  const [flowState, setFlowState] = useState<"request" | "unlock" | "form" | "submitted">("request");
  const [codeInput, setCodeInput] = useState("");

  // Form state matching PDF
  const [form, setForm] = useState({
    placeOfStudy: "",
    gender: "",
    genderOther: "",
    paymentMethod: "",
    paymentMethodOther: "",
    fullName: "",
    idNumber: "",
    email: "",
    studentNumber: "",
    whatsappNumber: "",
    callNumber: "",
    yearOfStudy: "",
    fieldOfStudy: "",
    motherFullName: "",
    motherIdNumber: "",
    motherEmail: "",
    motherWhatsapp: "",
    motherCallNumber: "",
    motherOccupation: "",
    fatherFullName: "",
    fatherIdNumber: "",
    fatherEmail: "",
    fatherWhatsapp: "",
    fatherCallNumber: "",
    fatherOccupation: "",
    emergencyContactType: "",
    emergencyOtherName: "",
    emergencyOtherWhatsapp: "",
    emergencyOtherCallNumber: "",
    emergencyOtherRelationship: "",
    preferredPaymentDate: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleRequestAccess = () => {
    setFlowState("unlock");
    toast({ title: "Request Sent", description: "Your request has been sent to the administrator. You'll receive a secret code once approved." });
  };

  const handleUnlock = () => {
    if (codeInput.trim().length >= 4) {
      setFlowState("form");
      toast({ title: "Form Unlocked", description: "You can now fill in your application." });
    } else {
      toast({ title: "Invalid Code", description: "Please enter the correct secret code.", variant: "destructive" });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const requiredFields = ["placeOfStudy", "gender", "paymentMethod", "fullName", "idNumber", "email", "studentNumber", "whatsappNumber", "callNumber", "yearOfStudy", "fieldOfStudy"];
    const missing = requiredFields.filter((f) => !(form as any)[f]?.trim());
    if (missing.length > 0) {
      toast({ title: "Incomplete", description: "Please fill in all required student fields.", variant: "destructive" });
      return;
    }
    setFlowState("submitted");
    toast({ title: "Application Submitted", description: "Your application has been sent to the administrator for review and placement." });
  };

  // --- REQUEST ACCESS STATE ---
  if (flowState === "request") {
    return (
      <DashboardLayout role="student">
        <div className="max-w-md mx-auto py-16">
          <Card className="shadow-elevated">
            <CardHeader className="text-center">
              <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                <ShieldCheck className="h-7 w-7 text-muted-foreground" />
              </div>
              <CardTitle className="font-serif text-xl">Application Form</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                You need to request access from the administrator before you can fill in your application form.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" onClick={handleRequestAccess}>
                <Send className="h-4 w-4 mr-2" /> Send Request
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  // --- UNLOCK STATE ---
  if (flowState === "unlock") {
    return (
      <DashboardLayout role="student">
        <div className="max-w-md mx-auto py-16">
          <Card className="shadow-elevated">
            <CardHeader className="text-center">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Lock className="h-7 w-7 text-primary" />
              </div>
              <CardTitle className="font-serif text-xl">Enter Secret Code</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Enter the code provided by the administrator to unlock your application form.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="e.g. ACC-1234"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                className="text-center font-mono text-lg tracking-wider"
              />
              <Button className="w-full" onClick={handleUnlock}>Unlock Application</Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  // --- SUBMITTED STATE ---
  if (flowState === "submitted") {
    return (
      <DashboardLayout role="student">
        <div className="max-w-2xl mx-auto text-center py-16 space-y-4">
          <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mx-auto">
            <Send className="h-8 w-8 text-success" />
          </div>
          <h1 className="text-3xl font-serif text-foreground">Application Submitted</h1>
          <p className="text-muted-foreground">Your application has been sent to the administrator for review and placement.</p>
        </div>
      </DashboardLayout>
    );
  }

  // --- FORM STATE ---
  return (
    <DashboardLayout role="student">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-serif text-foreground">Application for Student Lease</h1>
          <p className="text-muted-foreground mt-1">EduStay Accommodation (Pty) Ltd</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Information */}
          <Card className="shadow-card">
            <CardHeader><CardTitle className="font-serif text-lg">General Information</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label className="mb-2 block">Place of Study</Label>
                <RadioGroup value={form.placeOfStudy} onValueChange={(v) => handleChange("placeOfStudy", v)} className="flex flex-wrap gap-4">
                  {["UFS", "CUT", "Eduvos", "Motheo"].map((s) => (
                    <div key={s} className="flex items-center gap-2">
                      <RadioGroupItem value={s} id={`study-${s}`} />
                      <Label htmlFor={`study-${s}`} className="cursor-pointer">{s}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div>
                <Label className="mb-2 block">Gender</Label>
                <RadioGroup value={form.gender} onValueChange={(v) => handleChange("gender", v)} className="flex flex-wrap gap-4">
                  {["Male", "Female", "Other"].map((g) => (
                    <div key={g} className="flex items-center gap-2">
                      <RadioGroupItem value={g} id={`gender-${g}`} />
                      <Label htmlFor={`gender-${g}`} className="cursor-pointer">{g}</Label>
                    </div>
                  ))}
                </RadioGroup>
                {form.gender === "Other" && (
                  <Input placeholder="Please specify" value={form.genderOther} onChange={(e) => handleChange("genderOther", e.target.value)} className="mt-2 max-w-xs" />
                )}
              </div>
              <div>
                <Label className="mb-2 block">Method of Payment</Label>
                <RadioGroup value={form.paymentMethod} onValueChange={(v) => handleChange("paymentMethod", v)} className="flex flex-wrap gap-4">
                  {["EFT", "Cash", "NSFAS", "Other"].map((m) => (
                    <div key={m} className="flex items-center gap-2">
                      <RadioGroupItem value={m} id={`pay-${m}`} />
                      <Label htmlFor={`pay-${m}`} className="cursor-pointer">{m}</Label>
                    </div>
                  ))}
                </RadioGroup>
                {form.paymentMethod === "Other" && (
                  <Input placeholder="Please specify" value={form.paymentMethodOther} onChange={(e) => handleChange("paymentMethodOther", e.target.value)} className="mt-2 max-w-xs" />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Student Information */}
          <Card className="shadow-card">
            <CardHeader><CardTitle className="font-serif text-lg">Student Information</CardTitle></CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { key: "fullName", label: "Full Name & Surname", type: "text" },
                  { key: "idNumber", label: "ID Number", type: "text" },
                  { key: "email", label: "Email Address", type: "email" },
                  { key: "studentNumber", label: "Student Number", type: "text" },
                  { key: "whatsappNumber", label: "WhatsApp Number", type: "tel" },
                  { key: "callNumber", label: "Call Number", type: "tel" },
                  { key: "yearOfStudy", label: "Year of Study", type: "text" },
                  { key: "fieldOfStudy", label: "Field of Study", type: "text" },
                ].map((f) => (
                  <div key={f.key}>
                    <Label htmlFor={f.key}>{f.label}</Label>
                    <Input id={f.key} type={f.type} value={(form as any)[f.key]} onChange={(e) => handleChange(f.key, e.target.value)} className="mt-1" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Mother Information */}
          <Card className="shadow-card">
            <CardHeader><CardTitle className="font-serif text-lg">Mother Information</CardTitle></CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { key: "motherFullName", label: "Full Name & Surname" },
                  { key: "motherIdNumber", label: "ID Number" },
                  { key: "motherEmail", label: "Email Address", type: "email" },
                  { key: "motherWhatsapp", label: "WhatsApp Number", type: "tel" },
                  { key: "motherCallNumber", label: "Call Number", type: "tel" },
                  { key: "motherOccupation", label: "Occupation" },
                ].map((f) => (
                  <div key={f.key}>
                    <Label htmlFor={f.key}>{f.label}</Label>
                    <Input id={f.key} type={f.type || "text"} value={(form as any)[f.key]} onChange={(e) => handleChange(f.key, e.target.value)} className="mt-1" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Father Information */}
          <Card className="shadow-card">
            <CardHeader><CardTitle className="font-serif text-lg">Father Information</CardTitle></CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { key: "fatherFullName", label: "Full Name & Surname" },
                  { key: "fatherIdNumber", label: "ID Number" },
                  { key: "fatherEmail", label: "Email Address", type: "email" },
                  { key: "fatherWhatsapp", label: "WhatsApp Number", type: "tel" },
                  { key: "fatherCallNumber", label: "Call Number", type: "tel" },
                  { key: "fatherOccupation", label: "Occupation" },
                ].map((f) => (
                  <div key={f.key}>
                    <Label htmlFor={f.key}>{f.label}</Label>
                    <Input id={f.key} type={f.type || "text"} value={(form as any)[f.key]} onChange={(e) => handleChange(f.key, e.target.value)} className="mt-1" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card className="shadow-card">
            <CardHeader><CardTitle className="font-serif text-lg">In Case of Emergency</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="mb-2 block">In the case of emergency, please contact:</Label>
                <RadioGroup value={form.emergencyContactType} onValueChange={(v) => handleChange("emergencyContactType", v)} className="flex gap-4">
                  {["Mother", "Father", "Other"].map((c) => (
                    <div key={c} className="flex items-center gap-2">
                      <RadioGroupItem value={c} id={`emergency-${c}`} />
                      <Label htmlFor={`emergency-${c}`} className="cursor-pointer">{c}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              {form.emergencyContactType === "Other" && (
                <div className="grid sm:grid-cols-2 gap-4 pt-2">
                  {[
                    { key: "emergencyOtherName", label: "Name & Surname" },
                    { key: "emergencyOtherWhatsapp", label: "WhatsApp Number", type: "tel" },
                    { key: "emergencyOtherCallNumber", label: "Call Number", type: "tel" },
                    { key: "emergencyOtherRelationship", label: "Relationship" },
                  ].map((f) => (
                    <div key={f.key}>
                      <Label htmlFor={f.key}>{f.label}</Label>
                      <Input id={f.key} type={f.type || "text"} value={(form as any)[f.key]} onChange={(e) => handleChange(f.key, e.target.value)} className="mt-1" />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Preferred Payment Date */}
          <Card className="shadow-card">
            <CardHeader><CardTitle className="font-serif text-lg">Preferred Date of Payment</CardTitle></CardHeader>
            <CardContent>
              <Label className="mb-2 block">Payment will be made every month on the:</Label>
              <RadioGroup value={form.preferredPaymentDate} onValueChange={(v) => handleChange("preferredPaymentDate", v)} className="flex gap-6">
                {[{ v: "7th", l: "7th" }, { v: "15th", l: "15th" }, { v: "30th", l: "30th" }].map((d) => (
                  <div key={d.v} className="flex items-center gap-2">
                    <RadioGroupItem value={d.v} id={`pay-date-${d.v}`} />
                    <Label htmlFor={`pay-date-${d.v}`} className="cursor-pointer">{d.l}</Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card className="shadow-card">
            <CardHeader><CardTitle className="font-serif text-lg">Documents</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Please upload a copy of your ID", key: "studentIdDoc" },
                { label: "Please upload a copy of your mother's ID", key: "motherIdDoc" },
                { label: "Please upload a copy of your father's ID", key: "fatherIdDoc" },
                { label: "Upload a copy of your NSFAS registration", key: "nsfasDoc" },
              ].map((d) => (
                <div key={d.key}>
                  <Label className="mb-1 block">{d.label}</Label>
                  <p className="text-xs text-muted-foreground mb-2">Acceptable formats: jpg, jpeg, PDF</p>
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" size="sm">
                      <FileUp className="h-4 w-4 mr-1" /> Choose File
                    </Button>
                    <span className="text-xs text-muted-foreground">No file chosen</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Submit */}
          <Button type="submit" className="w-full" size="lg">
            <Send className="h-4 w-4 mr-2" /> Submit Application
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default StudentApplication;
