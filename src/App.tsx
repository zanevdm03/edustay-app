import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProperties from "./pages/admin/AdminProperties";
import AdminOwners from "./pages/admin/AdminOwners";
import AdminApplications from "./pages/admin/AdminApplications";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminContracts from "./pages/admin/AdminContracts";
import AdminAnnouncements from "./pages/admin/AdminAnnouncements";
import AdminCalendar from "./pages/admin/AdminCalendar";
import AdminMaintenance from "./pages/admin/AdminMaintenance";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminKeys from "./pages/admin/AdminKeys";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentApplication from "./pages/student/StudentApplication";
import StudentContract from "./pages/student/StudentContract";
import StudentReport from "./pages/student/StudentReport";
import StudentAccommodation from "./pages/student/StudentAccommodation";
import StudentMessages from "./pages/student/StudentMessages";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import OwnerProperties from "./pages/owner/OwnerProperties";
import OwnerMessages from "./pages/owner/OwnerMessages";
import OwnerMaintenance from "./pages/owner/OwnerMaintenance";
import OwnerMandate from "./pages/owner/OwnerMandate";
import FinanceDashboard from "./pages/finance/FinanceDashboard";
import FinanceMessages from "./pages/finance/FinanceMessages";
import MaintenanceDashboard from "./pages/maintenance/MaintenanceDashboard";
import MaintenanceMessages from "./pages/maintenance/MaintenanceMessages";
import MaintenanceInvoices from "./pages/maintenance/MaintenanceInvoices";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/properties" element={<AdminProperties />} />
          <Route path="/admin/owners" element={<AdminOwners />} />
          <Route path="/admin/applications" element={<AdminApplications />} />
          <Route path="/admin/students" element={<AdminStudents />} />
          <Route path="/admin/contracts" element={<AdminContracts />} />
          <Route path="/admin/keys" element={<AdminKeys />} />
          <Route path="/admin/announcements" element={<AdminAnnouncements />} />
          <Route path="/admin/calendar" element={<AdminCalendar />} />
          <Route path="/admin/maintenance" element={<AdminMaintenance />} />
          <Route path="/admin/messages" element={<AdminMessages />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/application" element={<StudentApplication />} />
          <Route path="/student/contract" element={<StudentContract />} />
          <Route path="/student/report" element={<StudentReport />} />
          <Route path="/student/accommodation" element={<StudentAccommodation />} />
          <Route path="/student/messages" element={<StudentMessages />} />
          <Route path="/owner" element={<OwnerDashboard />} />
          <Route path="/owner/properties" element={<OwnerProperties />} />
          <Route path="/owner/maintenance" element={<OwnerMaintenance />} />
          <Route path="/owner/mandate" element={<OwnerMandate />} />
          <Route path="/owner/messages" element={<OwnerMessages />} />
          <Route path="/finance" element={<FinanceDashboard />} />
          <Route path="/finance/messages" element={<FinanceMessages />} />
          <Route path="/maintenance-team" element={<MaintenanceDashboard />} />
          <Route path="/maintenance-team/invoices" element={<MaintenanceInvoices />} />
          <Route path="/maintenance-team/messages" element={<MaintenanceMessages />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
