import { motion } from "framer-motion";
import { ArrowLeft, Star, MapPin, Clock, Heart, Share2, Scissors, CalendarDays, Users } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getSalon } from "@/data/salons";
import { useState } from "react";
import { cn } from "@/lib/utils";

const SalonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const salon = getSalon(id || "");
  const [tab, setTab] = useState<"services" | "stylists">("services");

  if (!salon) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Salon not found. <Link to="/" className="text-primary ml-2">Go back</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto pb-32">
        {/* Hero */}
        <div className="relative aspect-[4/5]">
          <img src={salon.image} alt={salon.name} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/20" />

          <div className="absolute top-12 inset-x-5 flex items-center justify-between">
            <button onClick={() => navigate(-1)} className="h-10 w-10 rounded-full glass flex items-center justify-center">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="flex gap-2">
              <button className="h-10 w-10 rounded-full glass flex items-center justify-center">
                <Share2 className="h-4 w-4" />
              </button>
              <button className="h-10 w-10 rounded-full glass flex items-center justify-center">
                <Heart className="h-4 w-4" />
              </button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-6 inset-x-5"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-primary mb-2">{salon.tagline}</p>
            <h1 className="font-display text-4xl font-medium leading-tight">{salon.name}</h1>
            <div className="flex items-center gap-3 mt-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-primary text-primary" /> <span className="text-foreground font-semibold">{salon.rating}</span> ({salon.reviews})</span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{salon.distance}</span>
            </div>
          </motion.div>
        </div>

        {/* Live status */}
        <div className="px-5 -mt-2">
          <div className="rounded-2xl p-[1px] bg-gold shadow-gold">
            <div className="rounded-2xl bg-card px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Live wait</p>
                  <p className="font-display text-2xl font-semibold">{salon.waitMins} <span className="text-sm text-muted-foreground font-sans">min</span></p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">In queue</p>
                <p className="font-display text-2xl font-semibold">{Math.max(1, Math.round(salon.waitMins / 8))}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-5 mt-6">
          <div className="flex gap-1 bg-secondary/40 p-1 rounded-full">
            {(["services", "stylists"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "flex-1 py-2.5 rounded-full text-sm font-semibold capitalize transition-all",
                  tab === t ? "bg-background text-foreground shadow-soft" : "text-muted-foreground"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-5 mt-5 space-y-3">
          {tab === "services" &&
            salon.services.map((sv, i) => (
              <motion.div
                key={sv.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl bg-card-gradient ring-gold p-4 flex items-center gap-4"
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Scissors className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{sv.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{sv.duration} min · {sv.category}</p>
                </div>
                <p className="font-display text-lg font-semibold text-gold">₹{sv.price}</p>
              </motion.div>
            ))}

          {tab === "stylists" &&
            salon.stylists.map((st, i) => (
              <motion.div
                key={st.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl bg-card-gradient ring-gold p-4 flex items-center gap-4"
              >
                <div className="h-12 w-12 rounded-full bg-gold flex items-center justify-center text-primary-foreground font-bold">
                  {st.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{st.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{st.role}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                  <span className="text-sm font-semibold">{st.rating}</span>
                </div>
              </motion.div>
            ))}
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 inset-x-0 z-40">
        <div className="max-w-md mx-auto p-4 glass border-t border-border/60">
          <div className="grid grid-cols-2 gap-3">
            <Link
              to={`/salon/${salon.id}/book`}
              className="flex items-center justify-center gap-2 py-3.5 rounded-full bg-secondary border border-border font-semibold text-sm hover:bg-secondary/80 transition"
            >
              <CalendarDays className="h-4 w-4" />
              Book Slot
            </Link>
            <Link
              to={`/salon/${salon.id}/queue`}
              className="flex items-center justify-center gap-2 py-3.5 rounded-full bg-gold text-primary-foreground font-semibold text-sm shadow-gold active:scale-[0.98] transition"
            >
              <Users className="h-4 w-4" />
              Join Queue
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalonDetail;
