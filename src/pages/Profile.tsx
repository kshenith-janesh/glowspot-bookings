import { motion } from "framer-motion";
import { Bell, CreditCard, Heart, HelpCircle, LogOut, Settings, Star, ChevronRight, Scissors } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { Link } from "react-router-dom";
import { salons } from "@/data/salons";

const history = [
  { salon: salons[0], service: "Signature Haircut", date: "Apr 14", price: 1200 },
  { salon: salons[3], service: "Classic Facial", date: "Mar 28", price: 2200 },
];

const menu = [
  { icon: Heart, label: "Favorite salons" },
  { icon: Bell, label: "Notifications" },
  { icon: CreditCard, label: "Payment methods" },
  { icon: Settings, label: "Preferences" },
  { icon: HelpCircle, label: "Help & support" },
];

const Profile = () => (
  <AppShell>
    <header className="px-5 pt-12 pb-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <div className="h-16 w-16 rounded-full bg-gold flex items-center justify-center text-primary-foreground font-display text-2xl font-semibold shadow-gold">
          A
        </div>
        <div>
          <h1 className="font-display text-2xl font-medium">Aarav Sharma</h1>
          <p className="text-sm text-muted-foreground">+91 98765 43210</p>
        </div>
      </motion.div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        {[
          { label: "Visits", value: "24" },
          { label: "Saved", value: "₹3.2k" },
          { label: "Tier", value: "Gold" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-card-gradient ring-gold p-3 text-center">
            <p className="font-display text-xl font-semibold text-gold">{s.value}</p>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    </header>

    <section className="px-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display text-lg">Recent visits</h2>
        <button className="text-xs text-primary font-semibold">See all</button>
      </div>
      <div className="space-y-2">
        {history.map((h, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl bg-card-gradient ring-gold p-4 flex items-center gap-4"
          >
            <img src={h.salon.image} alt={h.salon.name} loading="lazy" className="h-12 w-12 rounded-xl object-cover" />
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{h.salon.name}</p>
              <p className="text-xs text-muted-foreground">{h.service} · {h.date}</p>
            </div>
            <Link
              to={`/salon/${h.salon.id}/book`}
              className="text-xs font-semibold text-primary px-3 py-2 rounded-full border border-primary/30 hover:bg-primary/10 transition"
            >
              Rebook
            </Link>
          </motion.div>
        ))}
      </div>
    </section>

    <section className="px-5 mt-7">
      <h2 className="font-display text-lg mb-3">Preferred stylist</h2>
      <div className="rounded-2xl bg-card-gradient ring-gold p-4 flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-gold flex items-center justify-center text-primary-foreground font-bold">AM</div>
        <div className="flex-1">
          <p className="font-medium">Arjun Mehta</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
            <Scissors className="h-3 w-3" /> Midnight Edge · <Star className="h-3 w-3 fill-primary text-primary" /> 4.95
          </p>
        </div>
      </div>
    </section>

    <section className="px-5 mt-7 space-y-1">
      {menu.map(({ icon: Icon, label }) => (
        <button
          key={label}
          className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-secondary/40 transition"
        >
          <div className="h-9 w-9 rounded-xl bg-secondary flex items-center justify-center">
            <Icon className="h-4 w-4 text-primary" />
          </div>
          <span className="flex-1 text-left text-sm font-medium">{label}</span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>
      ))}
      <button className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl hover:bg-destructive/10 transition text-destructive mt-4">
        <div className="h-9 w-9 rounded-xl bg-destructive/10 flex items-center justify-center">
          <LogOut className="h-4 w-4" />
        </div>
        <span className="flex-1 text-left text-sm font-medium">Sign out</span>
      </button>
    </section>
  </AppShell>
);

export default Profile;
