import { Badge } from "@/components/ui/badge";

type StatusType = "available" | "occupied" | "reserved" | "pending" | "approved" | "rejected" | "submitted" | "allocated" | "contracted" | "none" | "requested";

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  available: { label: "Available", className: "bg-success/10 text-success border-success/20" },
  occupied: { label: "Occupied", className: "bg-info/10 text-info border-info/20" },
  reserved: { label: "Reserved", className: "bg-warning/10 text-warning border-warning/20" },
  pending: { label: "Pending", className: "bg-warning/10 text-warning border-warning/20" },
  approved: { label: "Approved", className: "bg-success/10 text-success border-success/20" },
  rejected: { label: "Rejected", className: "bg-destructive/10 text-destructive border-destructive/20" },
  submitted: { label: "Submitted", className: "bg-info/10 text-info border-info/20" },
  allocated: { label: "Allocated", className: "bg-primary/10 text-primary border-primary/20" },
  contracted: { label: "Contracted", className: "bg-success/10 text-success border-success/20" },
  none: { label: "No Application", className: "bg-muted text-muted-foreground border-border" },
  requested: { label: "Requested", className: "bg-warning/10 text-warning border-warning/20" },
};

const StatusBadge = ({ status }: { status: StatusType }) => {
  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
};

export default StatusBadge;
