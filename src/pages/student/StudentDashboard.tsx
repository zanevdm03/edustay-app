import DashboardLayout from "@/components/DashboardLayout";
import StatCard from "@/components/StatCard";
import NotificationBar from "@/components/NotificationBar";
import { mockProperties } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, FileText, CheckCircle, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const StudentDashboard = () => {
  const [studentStatus] = useState<"none" | "contracted">("contracted");
  const isContracted = studentStatus === "contracted";

  // Simulated rent status from property data (student s1)
  const studentId = "s1";
  let rentPaid = false;
  for (const property of mockProperties) {
    for (const unit of property.units) {
      for (const room of unit.rooms) {
        if (room.studentId === studentId) {
          rentPaid = room.rentPaid;
        }
      }
    }
  }

  return (
    <DashboardLayout role="student">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-serif text-foreground">Welcome back</h1>
          <p className="text-muted-foreground mt-1">Your accommodation overview</p>
        </div>

        <NotificationBar userId="s1" />

        <div className="grid sm:grid-cols-3 gap-4">
          <StatCard title="Contract Status" value={isContracted ? "Signed" : "Pending"} icon={<FileText className="h-5 w-5" />} />
          <StatCard title="Application Form" value={isContracted ? "Available" : "Locked"} icon={<ClipboardList className="h-5 w-5" />} />
          <StatCard
            title="Rent Status"
            value={rentPaid ? "PAID" : "UNPAID"}
            icon={rentPaid ? <CheckCircle className="h-5 w-5 text-success" /> : <XCircle className="h-5 w-5 text-destructive" />}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Application Form Card */}
          <Card className={`shadow-card ${!isContracted ? "opacity-50" : ""}`}>
            <CardHeader>
              <CardTitle className="text-lg font-serif flex items-center gap-2">
                <ClipboardList className={`h-5 w-5 ${isContracted ? "text-primary" : "text-muted-foreground"}`} />
                Application Form
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isContracted ? (
                <p className="text-sm text-muted-foreground">
                  The application form will become available once you have been added to the system and signed your contract.
                </p>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Your application form is ready. Click below to request access or fill it in.
                  </p>
                  <Link to="/student/application">
                    <Button>
                      <ClipboardList className="h-4 w-4 mr-2" /> Go to Application Form
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contract Card */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-lg font-serif">Your Contract</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {isContracted
                  ? "Your contract has been signed. View the details below."
                  : "Your contract will appear here once you've been allocated to a room."}
              </p>
              <Link to="/student/contract">
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" /> View Contract
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
