import { useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAdmin, StaffStatus } from "@/store/admin";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Plus, Trash2, Edit3 } from "lucide-react";
import { toast } from "sonner";

const statusBadge: Record<StaffStatus, string> = {
  available: "bg-success/15 text-success border-success/30",
  busy: "bg-warning/15 text-warning border-warning/30",
  off: "bg-destructive/15 text-destructive border-destructive/30",
};

const cycle: Record<StaffStatus, StaffStatus> = { available: "busy", busy: "off", off: "available" };

export default function AdminStaff() {
  const { staff, services, addStaff, updateStaff, removeStaff } = useAdmin();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", role: "", hours: "10:00 – 20:00", avgDuration: 45 });

  const openNew = () => { setEditId(null); setForm({ name: "", role: "", hours: "10:00 – 20:00", avgDuration: 45 }); setOpen(true); };
  const openEdit = (id: string) => {
    const s = staff.find((x) => x.id === id); if (!s) return;
    setEditId(id); setForm({ name: s.name, role: s.role, hours: s.hours, avgDuration: s.avgDuration }); setOpen(true);
  };
  const submit = () => {
    if (!form.name) return;
    if (editId) { updateStaff(editId, form); toast.success("Updated"); }
    else { addStaff({ ...form, status: "available", services: [] }); toast.success("Stylist added"); }
    setOpen(false);
  };

  return (
    <AdminShell
      title="Staff"
      subtitle={`${staff.length} stylists`}
      actions={<Button onClick={openNew} className="bg-gold text-primary-foreground hover:opacity-90"><Plus className="h-4 w-4" />Add Stylist</Button>}
    >
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {staff.map((s) => (
          <div key={s.id} className="bg-card-gradient border border-border rounded-2xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medium truncate">{s.name}</p>
                <p className="text-[11px] text-muted-foreground">{s.role}</p>
              </div>
              <button onClick={() => { updateStaff(s.id, { status: cycle[s.status] }); toast(`Now ${cycle[s.status]}`); }}>
                <Badge variant="outline" className={statusBadge[s.status]}>{s.status}</Badge>
              </button>
            </div>
            <dl className="grid grid-cols-2 gap-2 mt-4 text-xs">
              <div><dt className="text-muted-foreground text-[10px] uppercase tracking-wider">Hours</dt><dd>{s.hours}</dd></div>
              <div><dt className="text-muted-foreground text-[10px] uppercase tracking-wider">Avg time</dt><dd>{s.avgDuration}m</dd></div>
            </dl>
            <div className="flex flex-wrap gap-1 mt-3">
              {s.services.length === 0 && <span className="text-[11px] text-muted-foreground">No services</span>}
              {s.services.map((id) => {
                const sv = services.find((x) => x.id === id);
                return sv ? <span key={id} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">{sv.name}</span> : null;
              })}
            </div>
            <div className="flex gap-1 mt-4 justify-end">
              <Button size="sm" variant="ghost" onClick={() => openEdit(s.id)}><Edit3 className="h-3.5 w-3.5" /></Button>
              <Button size="sm" variant="ghost" onClick={() => { removeStaff(s.id); toast("Removed"); }}><Trash2 className="h-3.5 w-3.5" /></Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editId ? "Edit stylist" : "Add stylist"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="space-y-2"><Label>Role</Label><Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Senior Stylist" /></div>
            <div className="space-y-2"><Label>Working hours</Label><Input value={form.hours} onChange={(e) => setForm({ ...form, hours: e.target.value })} /></div>
            <div className="space-y-2"><Label>Avg service duration (min)</Label><Input type="number" value={form.avgDuration} onChange={(e) => setForm({ ...form, avgDuration: +e.target.value })} /></div>
          </div>
          <DialogFooter><Button onClick={submit} className="bg-gold text-primary-foreground hover:opacity-90">{editId ? "Save" : "Add"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}
