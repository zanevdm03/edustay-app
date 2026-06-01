import { Link } from "react-router-dom";
import { GraduationCap, Home, Shield, DollarSign, Wrench } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import logo from "@/assets/logo.png";

const roles = [
  {
    title: "Administrator",
    description: "Manage properties, approve applications, allocate students, and generate contracts.",
    icon: <Shield className="h-8 w-8" />,
    href: "/admin",
    color: "bg-primary/10 text-primary",
  },
  {
    title: "Student",
    description: "Request application access, fill in your application, and view your accommodation contract.",
    icon: <GraduationCap className="h-8 w-8" />,
    href: "/student",
    color: "bg-info/10 text-info",
  },
  {
    title: "Property Owner",
    description: "Track your properties, view occupancy rates, and monitor your accommodation portfolio.",
    icon: <Home className="h-8 w-8" />,
    href: "/owner",
    color: "bg-accent/10 text-accent-foreground",
  },
  {
    title: "Finance",
    description: "Track student payments, manage expenses, and send payment reminders.",
    icon: <DollarSign className="h-8 w-8" />,
    href: "/finance",
    color: "bg-success/10 text-success",
  },
  {
    title: "Maintenance",
    description: "Receive and manage maintenance requests, upload invoices, and track repairs.",
    icon: <Wrench className="h-8 w-8" />,
    href: "/maintenance-team",
    color: "bg-warning/10 text-warning",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero */}
      <header className="relative overflow-hidden">
       <div className="absolute inset-0 bg-white" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <img src={logo} alt="EduStay Accommodation" className="h-24 w-24 object-contain" />
            <h1 className="text-4xl md:text-5xl font-serif bg-gradient-to-r from-[#3E45D2] via-[#8B289B] to-[#EC0B42] bg-clip-text text-transparent">
              EduStay Accommodation
            </h1>
          </div>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Smart living for bright futures. From application to contract — all in one place.
          </p>
        </div>
      </header>

      {/* Role Selection */}
      <main className="flex-1 max-w-5xl mx-auto px-6 -mt-8 relative z-20 w-full pb-16">
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
          {roles.map((role) => (
            <Link key={role.href} to={role.href} className="group">
              <Card className="h-full shadow-elevated hover:-translate-y-1 transition-all duration-300 border-border/50">
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <div className={`h-16 w-16 rounded-2xl ${role.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                    {role.icon}
                  </div>
                  <h2 className="text-xl font-serif mb-2 text-card-foreground">{role.title}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">{role.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>

      <footer className="text-center py-6 text-xs text-muted-foreground">
        © 2026 EduStay Accommodation. All rights reserved.
      </footer>
    </div>
  );
};

export default Index;
