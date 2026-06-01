import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { mockProperties, mockStudents } from "@/lib/mockData";
import { mockAnnouncements, type Announcement } from "@/lib/mockNotifications";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Megaphone, Send, Users } from "lucide-react";

const AdminAnnouncements = () => {
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  // Filters
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [selectedInstitutions, setSelectedInstitutions] = useState<string[]>([]);
  const [selectedFunding, setSelectedFunding] = useState<string[]>([]);

  const institutions = ["CUT", "UFS", "Eduvos"];
  const fundingTypes = ["NSFAS", "cash"];

  const toggleArray = (arr: string[], val: string) =>
    arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];

  const getTargetCount = () => {
    let students = mockStudents;
    if (selectedInstitutions.length > 0)
      students = students.filter((s) => selectedInstitutions.includes(s.institution));
    if (selectedFunding.length > 0)
      students = students.filter((s) => selectedFunding.includes(s.fundingMethod));
    if (selectedProperties.length > 0)
      students = students.filter((s) => s.allocation && selectedProperties.includes(s.allocation.propertyId));
    return students.length;
  };

  const handleSend = () => {
    if (!title || !message) return;
    const ann: Announcement = {
      id: `ann${Date.now()}`,
      title,
      message,
      filters: {
        properties: selectedProperties.length > 0 ? selectedProperties : undefined,
        institutions: selectedInstitutions.length > 0 ? selectedInstitutions : undefined,
        funding: selectedFunding.length > 0 ? selectedFunding : undefined,
      },
      createdAt: new Date().toISOString(),
    };
    setAnnouncements((prev) => [ann, ...prev]);
    setTitle("");
    setMessage("");
    setSelectedProperties([]);
    setSelectedInstitutions([]);
    setSelectedFunding([]);
    toast({
      title: "Announcement Sent",
      description: `Announcement sent to ${getTargetCount()} student(s).`,
    });
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-serif text-foreground">Announcements</h1>
          <p className="text-muted-foreground mt-1">Send announcements to selected students</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Compose */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg font-serif flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-primary" /> New Announcement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Water Outage Notice" />
              </div>
              <div>
                <Label>Message</Label>
                <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write your announcement..." rows={4} />
              </div>

              {/* Filters */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">Target Audience (leave empty for all)</p>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">Property</p>
                  <div className="flex flex-wrap gap-2">
                    {mockProperties.map((p) => (
                      <label key={p.id} className="flex items-center gap-1.5 text-sm">
                        <Checkbox
                          checked={selectedProperties.includes(p.id)}
                          onCheckedChange={() => setSelectedProperties((prev) => toggleArray(prev, p.id))}
                        />
                        {p.name}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">Institution</p>
                  <div className="flex flex-wrap gap-2">
                    {institutions.map((i) => (
                      <label key={i} className="flex items-center gap-1.5 text-sm">
                        <Checkbox
                          checked={selectedInstitutions.includes(i)}
                          onCheckedChange={() => setSelectedInstitutions((prev) => toggleArray(prev, i))}
                        />
                        {i}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">Funding</p>
                  <div className="flex flex-wrap gap-2">
                    {fundingTypes.map((f) => (
                      <label key={f} className="flex items-center gap-1.5 text-sm">
                        <Checkbox
                          checked={selectedFunding.includes(f)}
                          onCheckedChange={() => setSelectedFunding((prev) => toggleArray(prev, f))}
                        />
                        {f.toUpperCase()}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Users className="h-4 w-4" /> Targets {getTargetCount()} student(s)
                </p>
                <Button onClick={handleSend} disabled={!title || !message}>
                  <Send className="h-4 w-4 mr-1" /> Send Announcement
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* History */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg font-serif">Sent Announcements</CardTitle>
            </CardHeader>
            <CardContent>
              {announcements.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No announcements yet.</p>
              ) : (
                <div className="space-y-4">
                  {announcements.map((ann) => (
                    <div key={ann.id} className="border border-border rounded-lg p-4 space-y-1">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-foreground">{ann.title}</h4>
                        <span className="text-xs text-muted-foreground">
                          {new Date(ann.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{ann.message}</p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {ann.filters.properties?.map((p) => (
                          <span key={p} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                            {mockProperties.find((pr) => pr.id === p)?.name}
                          </span>
                        ))}
                        {ann.filters.institutions?.map((i) => (
                          <span key={i} className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded">{i}</span>
                        ))}
                        {ann.filters.funding?.map((f) => (
                          <span key={f} className="text-xs bg-muted/50 text-muted-foreground px-2 py-0.5 rounded">{f}</span>
                        ))}
                        {!ann.filters.properties && !ann.filters.institutions && !ann.filters.funding && (
                          <span className="text-xs text-muted-foreground">Sent to all students</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminAnnouncements;
