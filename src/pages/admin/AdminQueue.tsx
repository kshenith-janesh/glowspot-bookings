import { useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAdmin, QueueStatus, calcWaitMins } from "@/store/admin";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Play, Check, X, ArrowUp, ArrowDown, Bell } from "lucide-react";
import { toast } from "sonner";

const statusStyle: Record<QueueStatus, string> = {
  waiting: "bg-warning/15 text-warning border-warning/30",
  in_progress: "bg-success/15 text-success border-success/30",
  done: "bg-muted text-muted-foreground border-border",
  skipped: "bg-destructive/15 text-destructive border-destructive/30",
};

export default function AdminQueue() {
  const { queue, services, staff, addWalkin, startService, completeService, skipEntry, reorderQueue, salon } = useAdmin();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ customer: "", serviceId: services[0]?.id ?? "", staffId: "" });

  const wait = calcWaitMins(queue, services, salon.bufferMins);
  const svcName = (id: string) => services.find((s) => s.id === id)?.name ?? "—";
  const stfName = (id?: string) => staff.find((s) => s.id === id)?.name ?? "Unassigned";
  const minsAgo = (t: number) => Math.max(0, Math.round((Date.now() - t) / 60000));

  const move = (idx: number, dir: -1 | 1) => {
    const ids = queue.map((q) => q.id);
    const j = idx + dir;
    if (j < 0 || j >= ids.length) return;
    [ids[idx], ids[j]] = [ids[j], ids[idx]];
    reorderQueue(ids);
  };

  const submit = () => {
    if (!form.customer || !form.serviceId) return;
    addWalkin({ customer: form.customer, serviceId: form.serviceId, staffId: form.staffId || undefined });
    toast.success(`${form.customer} added to queue`);
    setForm({ customer: "", serviceId: services[0]?.id ?? "", staffId: "" });
    setOpen(false);
  };

  return (
    <AdminShell
      title="Live Queue"
      subtitle={`${queue.filter(q => q.status === "waiting" || q.status === "in_progress").length} active · ~${wait}m total wait`}
      actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gold text-primary-foreground hover:opacity-90"><Plus className="h-4 w-4" />Add Walk-in</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add walk-in customer</DialogTitle></DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2"><Label>Customer name</Label><Input value={form.customer} onChange={(e) => setForm({ ...form, customer: e.target.value })} /></div>
              <div className="space-y-2">
                <Label>Service</Label>
                <Select value={form.serviceId} onValueChange={(v) => setForm({ ...form, serviceId: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{services.map((s) => <SelectItem key={s.id} value={s.id}>{s.name} · {s.duration}m</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Stylist (optional)</Label>
                <Select value={form.staffId} onValueChange={(v) => setForm({ ...form, staffId: v })}>
                  <SelectTrigger><SelectValue placeholder="Unassigned" /></SelectTrigger>
                  <SelectContent>{staff.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter><Button onClick={submit} className="bg-gold text-primary-foreground hover:opacity-90">Add to queue</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      {/* Mobile cards */}
      <div className="space-y-3 lg:hidden">
        {queue.map((q, i) => (
          <div key={q.id} className="bg-card-gradient border border-border rounded-2xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <span className="h-8 w-8 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-semibold shrink-0">{i + 1}</span>
                <div className="min-w-0">
                  <p className="font-medium truncate">{q.customer}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{svcName(q.serviceId)} · {stfName(q.staffId)}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Added {minsAgo(q.addedAt)}m ago</p>
                </div>
              </div>
              <Badge variant="outline" className={statusStyle[q.status]}>{q.status.replace("_", " ")}</Badge>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {q.status === "waiting" && <Button size="sm" onClick={() => { startService(q.id); toast.success("Service started"); }}><Play className="h-3.5 w-3.5" />Start</Button>}
              {q.status === "in_progress" && <Button size="sm" onClick={() => { completeService(q.id); toast.success("Marked complete"); }}><Check className="h-3.5 w-3.5" />Complete</Button>}
              {(q.status === "waiting" || q.status === "in_progress") && (
                <>
                  <Button size="sm" variant="outline" onClick={() => { skipEntry(q.id); toast("Skipped"); }}><X className="h-3.5 w-3.5" />Skip</Button>
                  <Button size="sm" variant="ghost" onClick={() => toast.success(`Notified ${q.customer}`)}><Bell className="h-3.5 w-3.5" />Notify</Button>
                </>
              )}
              <Button size="icon" variant="ghost" onClick={() => move(i, -1)}><ArrowUp className="h-3.5 w-3.5" /></Button>
              <Button size="icon" variant="ghost" onClick={() => move(i, 1)}><ArrowDown className="h-3.5 w-3.5" /></Button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block bg-card-gradient border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-background/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left p-4">#</th>
              <th className="text-left p-4">Customer</th>
              <th className="text-left p-4">Service</th>
              <th className="text-left p-4">Stylist</th>
              <th className="text-left p-4">Added</th>
              <th className="text-left p-4">Status</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {queue.map((q, i) => (
              <tr key={q.id} className="border-t border-border/60 hover:bg-background/30">
                <td className="p-4 text-muted-foreground">{i + 1}</td>
                <td className="p-4 font-medium">{q.customer}</td>
                <td className="p-4">{svcName(q.serviceId)}</td>
                <td className="p-4 text-muted-foreground">{stfName(q.staffId)}</td>
                <td className="p-4 text-muted-foreground">{minsAgo(q.addedAt)}m ago</td>
                <td className="p-4"><Badge variant="outline" className={statusStyle[q.status]}>{q.status.replace("_", " ")}</Badge></td>
                <td className="p-4">
                  <div className="flex justify-end gap-1">
                    {q.status === "waiting" && <Button size="sm" variant="ghost" onClick={() => startService(q.id)}><Play className="h-3.5 w-3.5" /></Button>}
                    {q.status === "in_progress" && <Button size="sm" variant="ghost" onClick={() => completeService(q.id)}><Check className="h-3.5 w-3.5" /></Button>}
                    {(q.status === "waiting" || q.status === "in_progress") && <Button size="sm" variant="ghost" onClick={() => skipEntry(q.id)}><X className="h-3.5 w-3.5" /></Button>}
                    <Button size="sm" variant="ghost" onClick={() => move(i, -1)}><ArrowUp className="h-3.5 w-3.5" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => move(i, 1)}><ArrowDown className="h-3.5 w-3.5" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
