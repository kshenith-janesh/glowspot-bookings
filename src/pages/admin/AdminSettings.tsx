import { AdminShell } from "@/components/admin/AdminShell";
import { useAdmin } from "@/store/admin";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminSettings() {
  const { salon, updateSalon } = useAdmin();
  const [form, setForm] = useState(salon);
  const [notif, setNotif] = useState({ sms: true, whatsapp: true, push: false });

  const save = () => { updateSalon(form); toast.success("Settings saved"); };

  return (
    <AdminShell title="Settings" subtitle="Salon configuration & queue rules">
      <div className="grid lg:grid-cols-2 gap-4">
        <section className="bg-card-gradient border border-border rounded-2xl p-5 space-y-4">
          <h3 className="font-display text-lg">Salon details</h3>
          <div className="space-y-2"><Label>Salon name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div className="space-y-2"><Label>Address</Label><Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
          <div className="space-y-2"><Label>Contact phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <div className="space-y-2"><Label>Opening hours</Label><Input value={form.openingHours} onChange={(e) => setForm({ ...form, openingHours: e.target.value })} /></div>
        </section>

        <section className="bg-card-gradient border border-border rounded-2xl p-5 space-y-4">
          <h3 className="font-display text-lg">Queue rules</h3>
          <div className="space-y-2"><Label>Max queue size</Label><Input type="number" value={form.maxQueue} onChange={(e) => setForm({ ...form, maxQueue: +e.target.value })} /></div>
          <div className="space-y-2"><Label>Buffer between customers (min)</Label><Input type="number" value={form.bufferMins} onChange={(e) => setForm({ ...form, bufferMins: +e.target.value })} /></div>

          <h3 className="font-display text-lg pt-4 border-t border-border">Notifications</h3>
          {([
            ["sms", "SMS notifications"],
            ["whatsapp", "WhatsApp messages"],
            ["push", "Push notifications"],
          ] as const).map(([k, label]) => (
            <div key={k} className="flex items-center justify-between p-3 rounded-xl bg-background/30 border border-border/60">
              <span className="text-sm">{label}</span>
              <Switch checked={notif[k]} onCheckedChange={(v) => setNotif({ ...notif, [k]: v })} />
            </div>
          ))}
        </section>
      </div>

      <div className="flex justify-end">
        <Button onClick={save} className="bg-gold text-primary-foreground hover:opacity-90">Save changes</Button>
      </div>
    </AdminShell>
  );
}
