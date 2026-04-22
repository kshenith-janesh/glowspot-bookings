import { AdminShell } from "@/components/admin/AdminShell";
import { useAdmin, calcWaitMins } from "@/store/admin";
import { Users, Clock, Calendar, AlertTriangle, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboard() {
  const { queue, bookings, services, staff, salon } = useAdmin();
  const today = new Date().toISOString().split("T")[0];
  const todayBookings = bookings.filter((b) => b.date === today && b.status !== "cancelled");
  const active = queue.filter((q) => q.status === "waiting" || q.status === "in_progress");
  const serving = queue.find((q) => q.status === "in_progress");
  const nextUp = queue.filter((q) => q.status === "waiting").slice(0, 3);
  const wait = calcWaitMins(queue, services, salon.bufferMins);
  const delays = queue.filter((q) => (q.delayMins ?? 0) > 0);

  const stats = [
    { label: "Customers Today", value: todayBookings.length + queue.filter(q => q.status === "done").length + active.length, icon: Users, tint: "text-primary" },
    { label: "Active Queue", value: active.length, icon: PlayCircle, tint: "text-success" },
    { label: "Upcoming Bookings", value: todayBookings.length, icon: Calendar, tint: "text-primary-glow" },
    { label: "Avg Wait Time", value: `${Math.round(wait / Math.max(active.length, 1))}m`, icon: Clock, tint: "text-warning" },
  ];

  const svcName = (id: string) => services.find((s) => s.id === id)?.name ?? "—";
  const stfName = (id?: string) => staff.find((s) => s.id === id)?.name ?? "Unassigned";

  return (
    <AdminShell title="Dashboard" subtitle={`${salon.name} · Live overview`}>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-card-gradient border border-border rounded-2xl p-4">
            <s.icon className={`h-5 w-5 ${s.tint}`} />
            <p className="text-2xl font-display mt-3">{s.value}</p>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card-gradient border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg">Now Serving</h2>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success">
              <span className="absolute inset-0 rounded-full bg-success pulse-dot text-success" />
            </span>
          </div>
          {serving ? (
            <div className="flex items-center justify-between p-4 rounded-xl bg-background/40 border border-border">
              <div>
                <p className="font-medium">{serving.customer}</p>
                <p className="text-xs text-muted-foreground mt-1">{svcName(serving.serviceId)} · {stfName(serving.staffId)}</p>
              </div>
              <Badge className="bg-success/15 text-success border-success/30">In progress</Badge>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No one is being served right now.</p>
          )}

          <h3 className="text-xs uppercase tracking-widest text-muted-foreground mt-6 mb-3">Up next</h3>
          <ul className="space-y-2">
            {nextUp.length === 0 && <li className="text-sm text-muted-foreground">Queue is empty.</li>}
            {nextUp.map((q, i) => (
              <li key={q.id} className="flex items-center gap-3 p-3 rounded-xl bg-background/30 border border-border/60">
                <span className="h-7 w-7 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-semibold">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{q.customer}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{svcName(q.serviceId)} · {stfName(q.staffId)}</p>
                </div>
                <Badge variant="outline" className="text-warning border-warning/40">Waiting</Badge>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-card-gradient border border-border rounded-2xl p-5">
          <h2 className="font-display text-lg mb-4">Alerts</h2>
          {delays.length === 0 ? (
            <p className="text-sm text-muted-foreground">All operations on time.</p>
          ) : (
            <ul className="space-y-3">
              {delays.map((d) => (
                <li key={d.id} className="flex gap-3 p-3 rounded-xl bg-destructive/10 border border-destructive/30">
                  <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">{d.customer} delayed {d.delayMins}m</p>
                    <p className="text-[11px] text-muted-foreground">{svcName(d.serviceId)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AdminShell>
  );
}
