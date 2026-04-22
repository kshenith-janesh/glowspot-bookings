import { AppShell } from "@/components/AppShell";
import { salons } from "@/data/salons";
import { Calendar, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const upcoming = [
  { salon: salons[0], service: "Beard Sculpt", when: "Today · 6:30 PM", status: "Confirmed" },
  { salon: salons[1], service: "Balayage", when: "Sat · 11:00 AM", status: "Confirmed" },
];

const Bookings = () => (
  <AppShell>
    <header className="px-5 pt-12 pb-6">
      <p className="text-[11px] uppercase tracking-widest text-primary">Your schedule</p>
      <h1 className="font-display text-3xl font-medium mt-1">Bookings</h1>
    </header>

    <section className="px-5">
      <h2 className="font-display text-lg mb-3">Upcoming</h2>
      <div className="space-y-3">
        {upcoming.map((b, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-3xl overflow-hidden bg-card-gradient ring-gold"
          >
            <div className="relative h-32">
              <img src={b.salon.image} alt={b.salon.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-70" />
              <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
              <div className="absolute bottom-3 left-4 right-4">
                <p className="text-[11px] uppercase tracking-widest text-primary">{b.status}</p>
                <p className="font-display text-xl font-semibold">{b.salon.name}</p>
              </div>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{b.service}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <Clock className="h-3 w-3" /> {b.when}
                </p>
              </div>
              <Link to={`/salon/${b.salon.id}`} className="text-xs font-semibold px-4 py-2 rounded-full bg-gold text-primary-foreground shadow-gold">
                View
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>

    <section className="px-5 mt-8">
      <h2 className="font-display text-lg mb-3">Past</h2>
      <div className="rounded-2xl bg-card-gradient ring-gold p-8 text-center">
        <Calendar className="h-8 w-8 text-primary mx-auto mb-3 opacity-60" />
        <p className="text-sm text-muted-foreground">Your past bookings will appear here.</p>
      </div>
    </section>
  </AppShell>
);

export default Bookings;
