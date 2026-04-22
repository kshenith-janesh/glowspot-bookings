import { motion } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getSalon } from "@/data/salons";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const days = Array.from({ length: 7 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i);
  return d;
});

const slots = ["10:00", "10:30", "11:15", "12:00", "13:30", "14:00", "15:30", "16:15", "17:00", "18:30", "19:15", "20:00"];

const BookSlot = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const salon = getSalon(id || "");
  const [serviceId, setServiceId] = useState("");
  const [day, setDay] = useState(0);
  const [slot, setSlot] = useState("");
  const [done, setDone] = useState(false);

  if (!salon) return null;

  if (done) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring" }}
          className="h-20 w-20 rounded-full bg-gold flex items-center justify-center shadow-gold mb-6"
        >
          <Check className="h-9 w-9 text-primary-foreground" strokeWidth={3} />
        </motion.div>
        <h1 className="font-display text-3xl font-medium">Booking confirmed</h1>
        <p className="text-muted-foreground mt-2 max-w-xs">
          {salon.name} · {days[day].toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "short" })} at {slot}
        </p>
        <Link to="/" className="mt-10 px-8 py-3.5 rounded-full bg-gold text-primary-foreground font-semibold shadow-gold">
          Done
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-hero">
      <div className="max-w-md mx-auto pb-32">
        <header className="px-5 pt-12 pb-4 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="h-10 w-10 rounded-full bg-card border border-border flex items-center justify-center">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <p className="text-[11px] uppercase tracking-widest text-primary">Book a slot</p>
            <h1 className="font-display text-xl font-semibold leading-tight">{salon.name}</h1>
          </div>
        </header>

        <section className="px-5 mt-4">
          <h2 className="font-display text-lg mb-3">Service</h2>
          <div className="space-y-2">
            {salon.services.map((s) => (
              <button
                key={s.id}
                onClick={() => setServiceId(s.id)}
                className={cn(
                  "w-full text-left rounded-2xl p-4 border transition-all flex items-center justify-between",
                  serviceId === s.id ? "bg-primary/10 border-primary" : "bg-card-gradient border-border"
                )}
              >
                <div>
                  <p className="font-medium">{s.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.duration} min</p>
                </div>
                <p className="font-display text-gold">₹{s.price}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="px-5 mt-7">
          <h2 className="font-display text-lg mb-3">Date</h2>
          <div className="flex gap-2 overflow-x-auto -mx-5 px-5 pb-1">
            {days.map((d, i) => {
              const active = i === day;
              return (
                <button
                  key={i}
                  onClick={() => setDay(i)}
                  className={cn(
                    "shrink-0 w-16 py-3 rounded-2xl border text-center transition-all",
                    active ? "bg-gold text-primary-foreground border-transparent shadow-gold" : "bg-card-gradient border-border"
                  )}
                >
                  <p className="text-[10px] uppercase tracking-wider opacity-80">{d.toLocaleDateString(undefined, { weekday: "short" })}</p>
                  <p className="font-display text-xl font-semibold mt-0.5">{d.getDate()}</p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="px-5 mt-7">
          <h2 className="font-display text-lg mb-3">Time</h2>
          <div className="grid grid-cols-3 gap-2">
            {slots.map((t, i) => {
              const disabled = i % 5 === 2;
              const active = slot === t;
              return (
                <button
                  key={t}
                  disabled={disabled}
                  onClick={() => setSlot(t)}
                  className={cn(
                    "py-3 rounded-xl border text-sm font-medium transition-all",
                    disabled && "opacity-30 line-through cursor-not-allowed",
                    active ? "bg-gold text-primary-foreground border-transparent shadow-gold" : "bg-card-gradient border-border"
                  )}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 inset-x-0 z-40">
        <div className="max-w-md mx-auto p-4 glass border-t border-border/60">
          <button
            disabled={!serviceId || !slot}
            onClick={() => {
              setDone(true);
              toast.success("Slot reserved");
            }}
            className="w-full py-4 rounded-full bg-gold text-primary-foreground font-semibold shadow-gold disabled:opacity-40 disabled:shadow-none transition"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookSlot;
