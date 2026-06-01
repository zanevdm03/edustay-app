import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Building2, Users, FileText, Home, LogOut, ClipboardList, MessageSquare, UserCheck, Megaphone, CalendarDays, Wrench, AlertTriangle, Bed, Key, DollarSign, FileCheck, Receipt } from "lucide-react";
import logo from "@/assets/logo.png";

interface NavItem { label: string; href: string; icon: ReactNode; }

const navItems: Record<string, NavItem[]> = {
  admin: [
    { label: "Dashboard", href: "/admin", icon: <Home className="h-4 w-4" /> },
    { label: "Properties", href: "/admin/properties", icon: <Building2 className="h-4 w-4" /> },
    { label: "Owners", href: "/admin/owners", icon: <UserCheck className="h-4 w-4" /> },
    { label: "Applications", href: "/admin/applications", icon: <ClipboardList className="h-4 w-4" /> },
    { label: "Students", href: "/admin/students", icon: <Users className="h-4 w-4" /> },
    { label: "Contracts", href: "/admin/contracts", icon: <FileText className="h-4 w-4" /> },
    { label: "Keys", href: "/admin/keys", icon: <Key className="h-4 w-4" /> },
    { label: "Announcements", href: "/admin/announcements", icon: <Megaphone className="h-4 w-4" /> },
    { label: "Calendar", href: "/admin/calendar", icon: <CalendarDays className="h-4 w-4" /> },
    { label: "Maintenance", href: "/admin/maintenance", icon: <Wrench className="h-4 w-4" /> },
    { label: "Messages", href: "/admin/messages", icon: <MessageSquare className="h-4 w-4" /> },
  ],
  student: [
    { label: "Dashboard", href: "/student", icon: <Home className="h-4 w-4" /> },
    { label: "Application", href: "/student/application", icon: <ClipboardList className="h-4 w-4" /> },
    { label: "Contract", href: "/student/contract", icon: <FileText className="h-4 w-4" /> },
    { label: "Report", href: "/student/report", icon: <AlertTriangle className="h-4 w-4" /> },
    { label: "Accommodation", href: "/student/accommodation", icon: <Bed className="h-4 w-4" /> },
    { label: "Messages", href: "/student/messages", icon: <MessageSquare className="h-4 w-4" /> },
  ],
  owner: [
    { label: "Dashboard", href: "/owner", icon: <Home className="h-4 w-4" /> },
    { label: "Properties", href: "/owner/properties", icon: <Building2 className="h-4 w-4" /> },
    { label: "Maintenance", href: "/owner/maintenance", icon: <Wrench className="h-4 w-4" /> },
    { label: "Mandate", href: "/owner/mandate", icon: <FileCheck className="h-4 w-4" /> },
    { label: "Messages", href: "/owner/messages", icon: <MessageSquare className="h-4 w-4" /> },
  ],
  finance: [
    { label: "Dashboard", href: "/finance", icon: <Home className="h-4 w-4" /> },
    { label: "Properties", href: "/admin/properties", icon: <Building2 className="h-4 w-4" /> },
    { label: "Owners", href: "/admin/owners", icon: <UserCheck className="h-4 w-4" /> },
    { label: "Applications", href: "/admin/applications", icon: <ClipboardList className="h-4 w-4" /> },
    { label: "Students", href: "/admin/students", icon: <Users className="h-4 w-4" /> },
    { label: "Contracts", href: "/admin/contracts", icon: <FileText className="h-4 w-4" /> },
    { label: "Keys", href: "/admin/keys", icon: <Key className="h-4 w-4" /> },
    { label: "Announcements", href: "/admin/announcements", icon: <Megaphone className="h-4 w-4" /> },
    { label: "Calendar", href: "/admin/calendar", icon: <CalendarDays className="h-4 w-4" /> },
    { label: "Messages", href: "/finance/messages", icon: <MessageSquare className="h-4 w-4" /> },
  ],
  maintenance_role: [
    { label: "Dashboard", href: "/maintenance-team", icon: <Home className="h-4 w-4" /> },
    { label: "Invoices", href: "/maintenance-team/invoices", icon: <Receipt className="h-4 w-4" /> },
    { label: "Messages", href: "/maintenance-team/messages", icon: <MessageSquare className="h-4 w-4" /> },
  ],
};

const roleLabels: Record<string, string> = {
  admin: "Administrator",
  student: "Student Portal",
  owner: "Property Owner",
  finance: "Finance Portal",
  maintenance_role: "Maintenance",
};

interface DashboardLayoutProps { role: "admin" | "student" | "owner" | "finance" | "maintenance_role"; children: ReactNode; }

const DashboardLayout = ({ role, children }: DashboardLayoutProps) => {
  const location = useLocation();
  const items = navItems[role] || navItems.admin;

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 w-64 bg-sidebar text-sidebar-foreground flex flex-col">
        <div className="p-6 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="EduStay Accommodation" className="h-14 w-14 object-contain" />
            <span className="font-serif text-lg text-sidebar-primary-foreground">EduStay</span>
          </Link>
          <p className="text-xs mt-1 text-sidebar-foreground/60">{roleLabels[role]}</p>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {items.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link key={item.href} to={item.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-sidebar-accent text-sidebar-primary" : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"}`}>
                {item.icon}{item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors">
            <LogOut className="h-4 w-4" />Switch Role
          </Link>
        </div>
      </aside>
      <main className="flex-1 ml-64"><div className="p-8">{children}</div></main>
    </div>
  );
};

export default DashboardLayout;