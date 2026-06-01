import { useState } from "react";
import { getNotificationsForUser, type Notification } from "@/lib/mockNotifications";
import { Bell, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationBarProps {
  userId: string;
}

const NotificationBar = ({ userId }: NotificationBarProps) => {
  const notifications = getNotificationsForUser(userId);
  const [dismissed, setDismissed] = useState<string[]>([]);

  const visible = notifications.filter((n) => !dismissed.includes(n.id));

  if (visible.length === 0) return null;

  const typeColors: Record<string, string> = {
    announcement: "bg-info/10 border-info/20 text-info",
    rent_reminder: "bg-warning/10 border-warning/20 text-warning",
    maintenance: "bg-accent border-accent-foreground/20 text-accent-foreground",
    appointment: "bg-primary/10 border-primary/20 text-primary",
    general: "bg-muted/30 border-border text-muted-foreground",
  };

  return (
    <div className="space-y-2 mb-6">
      {visible.slice(0, 3).map((n) => (
        <div
          key={n.id}
          className={cn("flex items-start gap-3 rounded-lg border px-4 py-3", typeColors[n.type] || typeColors.general)}
        >
          <Bell className="h-4 w-4 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{n.title}</p>
            <p className="text-xs opacity-80 mt-0.5">{n.message}</p>
          </div>
          <button onClick={() => setDismissed((d) => [...d, n.id])} className="shrink-0 opacity-60 hover:opacity-100">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationBar;
