import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Store, MapPin, Phone, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Shop {
  id: string;
  name: string;
  address: string | null;
  contact: string | null;
  owner_id: string | null;
  created_at: string;
}
interface OwnerOption { id: string; name: string | null; email: string | null }

export default function AdminShops() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [owners, setOwners] = useState<Record<string, OwnerOption>>({});
  const [allUsers, setAllUsers] = useState<OwnerOption[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  // Form
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [ownerId, setOwnerId] = useState<string>("");

  const load = async () => {
    setLoading(true);
    const { data: shopRows, error } = await supabase.from("shops").select("*").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    const list = (shopRows ?? []) as Shop[];
    setShops(list);

    const ownerIds = Array.from(new Set(list.map((s) => s.owner_id).filter(Boolean))) as string[];
    if (ownerIds.length) {
      const { data: profs } = await supabase.from("profiles").select("id,name,email").in("id", ownerIds);
      const map: Record<string, OwnerOption> = {};
      (profs ?? []).forEach((p: any) => { map[p.id] = p; });
      setOwners(map);
    } else setOwners({});

    const { data: all } = await supabase.from("profiles").select("id,name,email").limit(100);
    setAllUsers((all ?? []) as OwnerOption[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!name.trim()) return toast.error("Shop name required");
    setBusy(true);
    const { error } = await supabase.from("shops").insert({
      name: name.trim(),
      address: address.trim() || null,
      contact: contact.trim() || null,
      owner_id: ownerId || null,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Shop created");
    setOpen(false);
    setName(""); setAddress(""); setContact(""); setOwnerId("");
    load();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("shops").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Shop removed");
    load();
  };

  const assignOwner = async (shopId: string, newOwnerId: string) => {
    const { error } = await supabase.from("shops").update({ owner_id: newOwnerId || null }).eq("id", shopId);
    if (error) return toast.error(error.message);
    if (newOwnerId) {
      // also assign the staff member to this shop and grant 'owner' role
      await supabase.from("profiles").update({ shop_id: shopId }).eq("id", newOwnerId);
      await supabase.from("user_roles").upsert({ user_id: newOwnerId, role: "owner" }, { onConflict: "user_id,role" });
    }
    toast.success("Owner updated");
    load();
  };

  return (
    <AdminShell
      title="Shops"
      subtitle="Manage all salon locations"
      actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gold text-primary-foreground hover:opacity-90">
              <Plus className="h-4 w-4 mr-1.5" /> New shop
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card-gradient">
            <DialogHeader><DialogTitle className="font-display">Create shop</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1.5"><Label>Shop name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="GlowSlot Bandra" /></div>
              <div className="space-y-1.5"><Label>Address</Label><Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Linking Rd, Mumbai" /></div>
              <div className="space-y-1.5"><Label>Contact number</Label><Input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="+91 ..." /></div>
              <div className="space-y-1.5">
                <Label>Owner (optional)</Label>
                <Select value={ownerId} onValueChange={setOwnerId}>
                  <SelectTrigger><SelectValue placeholder="Unassigned" /></SelectTrigger>
                  <SelectContent>
                    {allUsers.map((u) => (
                      <SelectItem key={u.id} value={u.id}>{u.name || u.email}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={create} disabled={busy} className="bg-gold text-primary-foreground hover:opacity-90">
                {busy && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : shops.length === 0 ? (
        <Card className="bg-card-gradient border-border/60 rounded-3xl">
          <CardContent className="py-16 text-center">
            <Store className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No shops yet. Create your first one.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          {shops.map((s) => {
            const owner = s.owner_id ? owners[s.owner_id] : null;
            return (
              <Card key={s.id} className="bg-card-gradient border-border/60 rounded-3xl">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-display text-lg truncate">{s.name}</h3>
                      <p className="text-[11px] text-muted-foreground">
                        Created {new Date(s.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => remove(s.id)} className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {s.address && <p className="text-xs text-muted-foreground flex items-start gap-1.5"><MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />{s.address}</p>}
                  {s.contact && <p className="text-xs text-muted-foreground flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />{s.contact}</p>}
                  <div className="pt-2 border-t border-border/40 space-y-1.5">
                    <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Owner</p>
                    <div className="flex items-center gap-2">
                      {owner ? <Badge className="bg-secondary text-foreground">{owner.name || owner.email}</Badge> : <Badge variant="outline" className="text-muted-foreground">Unassigned</Badge>}
                    </div>
                    <Select value={s.owner_id ?? ""} onValueChange={(v) => assignOwner(s.id, v)}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Assign owner..." /></SelectTrigger>
                      <SelectContent>
                        {allUsers.map((u) => (
                          <SelectItem key={u.id} value={u.id}>{u.name || u.email}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </AdminShell>
  );
}
