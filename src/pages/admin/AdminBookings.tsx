import { useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAdmin } from "@/store/admin";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Plus, Check, X, RefreshCw, ListOrdered } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AdminBookings() {
  const { bookings, services, staff, addBooking, updateBooking, cancelBooking, addWalkin } = useAdmin();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ customer: "", serviceId: services[0]?.id ?? "", staffId: "", time: "15:00" });

  const iso = (d?: Date) => d?.toISOString().split("T")[0] ?? "";
  const dayBookings = bookings.filter((b) => b.date === iso(date));
  const svcName = (id: string) => services.find((s) => s.id === id)?.name ?? "—";
  const stfName = (id?: string) => staff.find((s) => s.id === id)?.name ?? "Unassigned";

  const submit = () => {
    if (!form.customer) return;
    addBooking({ customer: form.customer, serviceId: form.serviceId, staffId: form.staffId || undefined, date: iso(date), time: form.time });
    toast.success("Booking created");
    setOpen(false);
    setForm({ customer: "", serviceId: services[0]?.id ?? "", staffId: "", time: "15:00" });
  };

  const sync = (id: string) => {
    const b = bookings.find((x) => x.id === id);
    if (!b) return;
    addWalkin({ customer: b.customer, serviceId: b.serviceId, staffId: b.staffId });
    toast.success(`${b.customer} synced into live queue`);
  };

  return (
    <AdminShell
      title="Bookings"
      subtitle={`${dayBookings.length} bookings on ${date?.toLocaleDateString()}`}
      actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gold text-primary-foreground hover:opacity-90"><Plus className="h-4 w-4" />New Booking</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create booking</DialogTitle></DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2"><Label>Customer</Label><Input value={form.customer} onChange={(e) => setForm({ ...form, customer: e.target.value })} /></div>
              <div className="space-y-2">
                <Label>Service</Label>
                <Select value={form.serviceId} onValueChange={(v) => setForm({ ...form, serviceId: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{services.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Stylist</Label>
                <Select value={form.staffId} onValueChange={(v) => setForm({ ...form, staffId: v })}>
                  <SelectTrigger><SelectValue placeholder="Unassigned" /></SelectTrigger>
                  <SelectContent>{staff.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Time</Label><Input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} /></div>
            </div>
            <DialogFooter><Button onClick={submit} className="bg-gold text-primary-foreground hover:opacity-90">Create</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      <div className="grid lg:grid-cols-[auto_1fr] gap-4">
        <div className="bg-card-gradient border border-border rounded-2xl p-3 w-fit mx-auto lg:mx-0">
          <Calendar mode="single" selected={date} onSelect={setDate} className={cn("p-2 pointer-events-auto")} />
        </div>

        <div className="bg-card-gradient border border-border rounded-2xl p-4 sm:p-5">
          <h3 className="font-display text-lg mb-4">Schedule</h3>
          {dayBookings.length === 0 ? (
            <p className="text-sm text-muted-foreground">No bookings for this day.</p>
          ) : (
            <ul className="space-y-2">
              {dayBookings.sort((a, b) => a.time.localeCompare(b.time)).map((b) => (
                <li key={b.id} className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-background/30 border border-border/60">
                  <div className="text-center w-14 shrink-0">
                    <p className="font-display text-lg leading-none">{b.time}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{b.customer}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{svcName(b.serviceId)} · {stfName(b.staffId)}</p>
                  </div>
                  <Badge variant="outline" className={
                    b.status === "confirmed" ? "border-success/40 text-success" :
                    b.status === "cancelled" ? "border-destructive/40 text-destructive" :
                    "border-warning/40 text-warning"
                  }>{b.status}</Badge>
                  <div className="flex gap-1 ml-auto">
                    {b.status !== "confirmed" && b.status !== "cancelled" && (
                      <Button size="icon" variant="ghost" onClick={() => { updateBooking(b.id, { status: "confirmed" }); toast.success("Confirmed"); }}><Check className="h-3.5 w-3.5" /></Button>
                    )}
                    <Button size="icon" variant="ghost" onClick={() => sync(b.id)} title="Sync to queue"><ListOrdered className="h-3.5 w-3.5" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => { updateBooking(b.id, { time: prompt("New time HH:MM", b.time) ?? b.time }); toast.success("Rescheduled"); }}><RefreshCw className="h-3.5 w-3.5" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => { cancelBooking(b.id); toast("Cancelled"); }}><X className="h-3.5 w-3.5" /></Button>
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
