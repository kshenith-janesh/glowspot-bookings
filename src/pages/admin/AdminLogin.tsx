import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Phone, Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

type Mode = "signin" | "signup";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { signIn, signUp, user } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [otpStage, setOtpStage] = useState(false);
  const [otp, setOtp] = useState("");

  useEffect(() => {
    if (user) navigate("/admin", { replace: true });
  }, [user, navigate]);

  const submit = async () => {
    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }
    setBusy(true);
    const { error } = mode === "signin" ? await signIn(email, password) : await signUp(email, password, name || email.split("@")[0]);
    setBusy(false);
    if (error) {
      toast.error(error);
      return;
    }
    toast.success(mode === "signin" ? "Welcome back" : "Account created");
    navigate("/admin", { replace: true });
  };

  return (
    <div className="min-h-screen bg-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 rounded-2xl bg-gold items-center justify-center shadow-gold mb-4">
            <Sparkles className="h-7 w-7 text-primary-foreground" strokeWidth={2.4} />
          </div>
          <h1 className="font-display text-3xl">GlowSlot Admin</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your salon in real time</p>
        </div>

        <div className="bg-card-gradient border border-border rounded-3xl p-6 shadow-elevated">
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid grid-cols-2 w-full mb-5">
              <TabsTrigger value="email"><Mail className="h-3.5 w-3.5 mr-2" />Email</TabsTrigger>
              <TabsTrigger value="phone"><Phone className="h-3.5 w-3.5 mr-2" />Phone</TabsTrigger>
            </TabsList>

            <TabsContent value="email" className="space-y-4">
              <div className="flex gap-2 text-xs">
                <button
                  className={`flex-1 py-1.5 rounded-md border ${mode === "signin" ? "bg-secondary border-border" : "border-transparent text-muted-foreground"}`}
                  onClick={() => setMode("signin")}
                >
                  Sign in
                </button>
                <button
                  className={`flex-1 py-1.5 rounded-md border ${mode === "signup" ? "bg-secondary border-border" : "border-transparent text-muted-foreground"}`}
                  onClick={() => setMode("signup")}
                >
                  Sign up
                </button>
              </div>

              {mode === "signup" && (
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                </div>
              )}
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="owner@salon.com" />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
              </div>
              <Button className="w-full bg-gold text-primary-foreground hover:opacity-90" onClick={submit} disabled={busy}>
                {busy && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {mode === "signin" ? "Sign in" : "Create account"}
              </Button>
              {mode === "signup" && (
                <p className="text-[11px] text-muted-foreground text-center">
                  New accounts default to <span className="text-foreground">Staff</span>. An admin can promote you later.
                </p>
              )}
            </TabsContent>

            <TabsContent value="phone" className="space-y-4">
              {!otpStage ? (
                <>
                  <div className="space-y-2">
                    <Label>Phone number</Label>
                    <Input type="tel" placeholder="+91 98765 43210" />
                  </div>
                  <Button
                    className="w-full bg-gold text-primary-foreground hover:opacity-90"
                    onClick={() => { setOtpStage(true); toast("Demo OTP: 1234"); }}
                  >
                    Send OTP (mock)
                  </Button>
                </>
              ) : (
                <>
                  <Label>Enter OTP</Label>
                  <div className="flex justify-center">
                    <InputOTP maxLength={4} value={otp} onChange={setOtp}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} /><InputOTPSlot index={1} /><InputOTPSlot index={2} /><InputOTPSlot index={3} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <Button
                    className="w-full bg-gold text-primary-foreground hover:opacity-90"
                    onClick={() => toast("Phone OTP is mock-only. Use the Email tab to actually sign in.")}
                  >
                    Verify (mock)
                  </Button>
                </>
              )}
              <p className="text-[11px] text-muted-foreground text-center">
                Phone login is a UI mock. Use email/password for real authentication.
              </p>
            </TabsContent>
          </Tabs>

          <p className="text-[11px] text-muted-foreground text-center mt-5">
            Secure session · Role-based access
          </p>
        </div>

        <button onClick={() => navigate("/")} className="block mx-auto mt-5 text-xs text-muted-foreground hover:text-foreground">
          ← Back to customer app
        </button>
      </div>
    </div>
  );
}
