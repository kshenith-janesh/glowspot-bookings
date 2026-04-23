import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Shop { id: string; name: string }

export default function AdminProfile() {
  const { profile, roles, refreshProfile, user } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [shop, setShop] = useState<Shop | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(profile?.name ?? "");
    setPhone(profile?.phone ?? "");
    if (profile?.shop_id) {
      supabase.from("shops").select("id,name").eq("id", profile.shop_id).maybeSingle()
        .then(({ data }) => setShop((data as Shop) ?? null));
    } else setShop(null);
  }, [profile]);

  const save = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ name, phone }).eq("id", user.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Profile updated");
    refreshProfile();
  };

  return (
    <AdminShell title="Profile" subtitle="Your account details">
      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="lg:col-span-2 bg-card-gradient border-border/60 rounded-3xl">
          <CardHeader><CardTitle className="font-display text-xl">Personal info</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div className="space-y-2"><Label>Email</Label><Input value={profile?.email ?? ""} disabled /></div>
            <div className="space-y-2"><Label>Phone</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 ..." /></div>
            <Button onClick={save} disabled={saving} className="bg-gold text-primary-foreground hover:opacity-90">
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Save changes
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card-gradient border-border/60 rounded-3xl">
          <CardHeader><CardTitle className="font-display text-xl">Access</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">Roles</p>
              <div className="flex flex-wrap gap-1.5">
                {roles.length === 0 && <span className="text-xs text-muted-foreground">No role assigned</span>}
                {roles.map((r) => (
                  <Badge key={r} className="capitalize bg-secondary text-foreground">{r}</Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1.5">Assigned shop</p>
              <p className="text-sm">{shop?.name ?? <span className="text-muted-foreground">None</span>}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
