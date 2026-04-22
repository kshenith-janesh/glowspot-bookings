import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, Bell, MapPin, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getSalon } from "@/data/salons";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const JoinQueue = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const salon = getSalon(id || "");
  const [step, setStep] = useState<"select" | "confirmed">("select");
  const [serviceId, setServiceId] = useState<string>("");
  const [stylistId, setStylistId] = useState<string>("any");
  const [position, setPosition] = useState(3);

  useEffect(() => {
    if (step !== "confirmed") return;
    const t = setInterval(() => {
      setPosition((p) => {
        if (p <= 1) {
          clearInterval(t);
          return 1;
        }
        if (p === 3) toast("2 people left ahead of you", { description: "Start heading over." });
        return p - 1;
      });
    }, 6000);
    return () => clearInterval(t);
  }, [step]);

  if (!salon) return null;

  const service = salon.services.find((s) => s.id === serviceId);
  const waitPerPerson = 12;
  const estWait = position * waitPerPerson;

  return (
    <div className="min-h-screen bg-hero">
      <div className="max-w-md mx-auto pb-12">
        <header className="px-5 pt-12 pb-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="h-10 w-10 rounded-full bg-card border border-border flex items-center justify-center">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <p className="text-[11px] uppercase tracking-widest text-primary">Queue</p>
            <h1 className="font-display text-xl font-semibold leading-tight">{salon.name}</h1>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {step === "select" && (
            <motion.div
              key="select"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="px-5 pt-4 space-y-7"
            >
              <section>
                <h2 className="font-display text-lg mb-3">Choose a service</h2>
                <div className="space-y-2">
                  {salon.services.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setServiceId(s.id)}
                      className={cn(
                        "w-full text-left rounded-2xl p-4 border transition-all flex items-center justify-between",
                        serviceId === s.id
                          ? "bg-primary/10 border-primary shadow-gold"
                          : "bg-card-gradient border-border hover:border-primary/40"
                      )}
                    >
                      <div>
                        <p className="font-medium">{s.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{s.duration} min</p>
                      </div>
                      <p className="font-display text-lg text-gold">₹{s.price}</p>
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <h2 className="font-display text-lg mb-3">Choose a stylist <span className="text-xs text-muted-foreground font-sans">(optional)</span></h2>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setStylistId("any")}
                    className={cn(
                      "rounded-2xl p-4 border text-sm font-medium transition-all",
                      stylistId === "any" ? "bg-primary/10 border-primary" : "bg-card-gradient border-border"
                    )}
                  >
                    Any available
                  </button>
                  {salon.stylists.map((st) => (
                    <button
                      key={st.id}
                      onClick={() => setStylistId(st.id)}
                      className={cn(
                        "rounded-2xl p-4 border text-sm font-medium transition-all text-left",
                        stylistId === st.id ? "bg-primary/10 border-primary" : "bg-card-gradient border-border"
                      )}
                    >
                      <p className="truncate">{st.name}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">★ {st.rating}</p>
                    </button>
                  ))}
                </div>
              </section>

              {service && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl bg-card-gradient ring-gold p-5"
                >
                  <p className="text-[11px] uppercase tracking-widest text-primary mb-3">Live estimate</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">People ahead</p>
                      <p className="font-display text-3xl font-semibold mt-1">{position - 1}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Estimated wait</p>
                      <p className="font-display text-3xl font-semibold mt-1 text-gold">{estWait}<span className="text-sm text-muted-foreground font-sans ml-1">min</span></p>
                    </div>
                  </div>
                </motion.div>
              )}

              <button
                disabled={!serviceId}
                onClick={() => {
                  setStep("confirmed");
                  toast.success("You're in the queue!", { description: `Position #${position}` });
                }}
                className="w-full py-4 rounded-full bg-gold text-primary-foreground font-semibold shadow-gold disabled:opacity-40 disabled:shadow-none active:scale-[0.99] transition"
              >
                Confirm & Join Queue
              </button>
            </motion.div>
          )}

          {step === "confirmed" && (
            <motion.div
              key="confirmed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-5 pt-6"
            >
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="mx-auto h-16 w-16 rounded-full bg-gold flex items-center justify-center shadow-gold mb-4"
                >
                  <Check className="h-7 w-7 text-primary-foreground" strokeWidth={3} />
                </motion.div>
                <h2 className="font-display text-2xl font-semibold">You're in!</h2>
                <p className="text-sm text-muted-foreground mt-1">We'll notify you as your turn approaches.</p>
              </div>

              <div className="rounded-3xl p-[1px] bg-gold shadow-gold">
                <div className="rounded-3xl bg-card p-6 text-center">
                  <p className="text-[11px] uppercase tracking-widest text-primary">Your position</p>
                  <motion.p
                    key={position}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="font-display text-7xl font-medium mt-2 text-gold"
                  >
                    #{position}
                  </motion.p>
                  <div className="mt-5 grid grid-cols-2 gap-4 pt-5 border-t border-border/60">
                    <div>
                      <Clock className="h-4 w-4 text-primary mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">Wait</p>
                      <p className="font-semibold">~{position * waitPerPerson} min</p>
                    </div>
                    <div>
                      <MapPin className="h-4 w-4 text-primary mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">Distance</p>
                      <p className="font-semibold">{salon.distance}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-card-gradient ring-gold p-4 flex items-start gap-3">
                <Bell className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div className="text-sm">
                  <p className="font-medium">Notifications on</p>
                  <p className="text-muted-foreground text-xs mt-0.5">We'll ping you when 2 people are left and when it's time to head over.</p>
                </div>
              </div>

              <Link
                to="/"
                className="mt-8 block text-center py-3.5 rounded-full bg-secondary border border-border font-semibold text-sm"
              >
                Back to discover
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default JoinQueue;
