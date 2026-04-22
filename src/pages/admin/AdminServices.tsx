import { useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAdmin } from "@/store/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Plus, Trash2, Edit3, Clock, IndianRupee } from "lucide-react";
import { toast } from "sonner";

export default function AdminServices() {
  const { services, addService, updateService, removeService } = useAdmin();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", price: 0, duration: 30 });

  const openNew = () => { setEditId(null); setForm({ name: "", price: 0, duration: 30 }); setOpen(true); };
  const openEdit = (id: string) => {
    const s = services.find((x) => x.id === id); if (!s) return;
    setEditId(id); setForm({ name: s.name, price: s.price, duration: s.duration }); setOpen(true);
  };
  const submit = () => {
    if (!form.name) return;
    if (editId) { updateService(editId, form); toast.success("Updated"); }
    else { addService(form); toast.success("Service added"); }
    setOpen(false);
  };

  return (
    <AdminShell
      title="Services"
      subtitle={`${services.length} services offered`}
      actions={<Button onClick={openNew} className="bg-gold text-primary-foreground hover:opacity-90"><Plus className="h-4 w-4" />Add Service</Button>}
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {services.map((s) => (
          <div key={s.id} className="bg-card-gradient border border-border rounded-2xl p-4">
            <div className="flex items-start justify-between gap-2">
              <p className="font-medium">{s.name}</p>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" onClick={() => openEdit(s.id)}><Edit3 className="h-3.5 w-3.5" /></Button>
                <Button size="sm" variant="ghost" onClick={() => { removeService(s.id); toast("Removed"); }}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-3 text-sm">
              <span className="inline-flex items-center gap-1 text-primary"><IndianRupee className="h-3.5 w-3.5" />{s.price}</span>
              <span className="inline-flex items-center gap-1 text-muted-foreground"><Clock className="h-3.5 w-3.5" />{s.duration}m</span>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editId ? "Edit service" : "Add service"}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Price (₹)</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: +e.target.value })} /></div>
              <div className="space-y-2"><Label>Duration (min)</Label><Input type="number" value={form.duration} onChange={(e) => setForm({ ...form, duration: +e.target.value })} /></div>
            </div>
          </div>
          <DialogFooter><Button onClick={submit} className="bg-gold text-primary-foreground hover:opacity-90">{editId ? "Save" : "Add"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}
