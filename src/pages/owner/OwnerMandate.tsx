import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { mockOwners } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { FileText, RefreshCw } from "lucide-react";

const OwnerMandate = () => {
  const { toast } = useToast();
  const owner = mockOwners[0]; // simulated current owner
  const [renewalRequested, setRenewalRequested] = useState(false);

  const handleRequestRenewal = () => {
    setRenewalRequested(true);
    toast({ title: "Renewal Requested", description: "Your mandate renewal request has been sent to the admin office." });
  };

  return (
    <DashboardLayout role="owner">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-serif text-foreground">Mandate</h1>
          <p className="text-muted-foreground mt-1">View your mandate agreement and request renewals</p>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg font-serif">Current Mandate Agreement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Owner</p>
                <p className="font-medium text-foreground">{owner.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">ID Number</p>
                <p className="font-medium text-foreground">{owner.idNumber || "—"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Mandate Document</p>
                {owner.mandateFile ? (
                  <Badge variant="outline" className="flex items-center gap-1 w-fit"><FileText className="h-3 w-3" /> {owner.mandateFile}</Badge>
                ) : (
                  <p className="text-muted-foreground">No mandate on file</p>
                )}
              </div>
              <div>
                <p className="text-muted-foreground">Expiry Date</p>
                <p className="font-medium text-foreground">{owner.mandateExpiry || "—"}</p>
              </div>
            </div>

            <div className="pt-4">
              <Button onClick={handleRequestRenewal} disabled={renewalRequested}>
                <RefreshCw className="h-4 w-4 mr-1" /> {renewalRequested ? "Renewal Requested" : "Request Mandate Renewal"}
              </Button>
              {renewalRequested && (
                <p className="text-sm text-success mt-2">Your renewal request has been submitted. The admin office will contact you.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default OwnerMandate;
