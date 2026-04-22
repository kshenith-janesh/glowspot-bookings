import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [otpStage, setOtpStage] = useState(false);
  const [otp, setOtp] = useState("");

  const enter = () => {
    toast.success("Welcome back to GlowSlot Admin");
    navigate("/admin");
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
          <Tabs defaultValue="phone" className="w-full">
            <TabsList className="grid grid-cols-2 w-full mb-5">
              <TabsTrigger value="phone"><Phone className="h-3.5 w-3.5 mr-2" />Phone</TabsTrigger>
              <TabsTrigger value="email"><Mail className="h-3.5 w-3.5 mr-2" />Email</TabsTrigger>
            </TabsList>

            <TabsContent value="phone" className="space-y-4">
              {!otpStage ? (
                <>
                  <div className="space-y-2">
                    <Label>Phone number</Label>
                    <Input type="tel" placeholder="+91 98765 43210" />
                  </div>
                  <Button className="w-full bg-gold text-primary-foreground hover:opacity-90" onClick={() => { setOtpStage(true); toast("OTP sent: 1234"); }}>
                    Send OTP
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
                  <Button className="w-full bg-gold text-primary-foreground hover:opacity-90" onClick={enter}>Verify & Continue</Button>
                </>
              )}
            </TabsContent>

            <TabsContent value="email" className="space-y-4">
              <div className="space-y-2"><Label>Email</Label><Input type="email" placeholder="owner@salon.com" /></div>
              <div className="space-y-2"><Label>Password</Label><Input type="password" placeholder="••••••••" /></div>
              <Button className="w-full bg-gold text-primary-foreground hover:opacity-90" onClick={enter}>Sign in</Button>
            </TabsContent>
          </Tabs>

          <p className="text-[11px] text-muted-foreground text-center mt-5">
            Owner & Staff role-based access · Secure session
          </p>
        </div>

        <button onClick={() => navigate("/")} className="block mx-auto mt-5 text-xs text-muted-foreground hover:text-foreground">
          ← Back to customer app
        </button>
      </div>
    </div>
  );
}
