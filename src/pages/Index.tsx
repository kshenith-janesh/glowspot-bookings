import { motion } from "framer-motion";
import { Search, MapPin, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { SalonCard } from "@/components/SalonCard";
import { salons } from "@/data/salons";

const filters = ["All", "Hair", "Beard", "Color", "Skin", "Nails"];

const Index = () => {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("All");

  const list = useMemo(() => {
    return salons.filter((s) => {
      const q = query.toLowerCase();
      const matchesQ = !q || s.name.toLowerCase().includes(q) || s.tagline.toLowerCase().includes(q);
      const matchesF = active === "All" || s.services.some((sv) => sv.category === active);
      return matchesQ && matchesF;
    });
  }, [query, active]);

  return (
    <AppShell>
      {/* Header */}
      <header className="px-5 pt-12 pb-5">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            <span>Bandra West, Mumbai</span>
          </div>
          <div className="h-9 w-9 rounded-full bg-gold flex items-center justify-center text-primary-foreground font-bold text-sm shadow-gold">
            A
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6"
        >
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium tracking-widest uppercase text-primary">GlowSlot</span>
          </div>
          <h1 className="font-display text-[2.6rem] leading-[1.05] font-medium">
            Skip the wait,<br />
            <span className="text-gold italic">stay golden.</span>
          </h1>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 relative"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find salons near you"
            className="w-full bg-card-gradient border border-border rounded-full pl-11 pr-4 py-3.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
          />
        </motion.div>

        {/* Filter chips */}
        <div className="mt-5 -mx-5 px-5 flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                active === f
                  ? "bg-gold text-primary-foreground shadow-gold"
                  : "bg-secondary/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      {/* Live banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mx-5 mb-5 rounded-2xl p-[1px] bg-gold"
      >
        <div className="rounded-2xl bg-card px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-primary font-semibold">Live</p>
            <p className="text-sm font-medium mt-0.5">{salons.filter(s => s.status === 'open').length} salons accepting now</p>
          </div>
          <div className="h-2 w-2 rounded-full bg-success relative pulse-dot text-success">
            <span className="block h-2 w-2 rounded-full bg-current" />
          </div>
        </div>
      </motion.div>

      {/* List */}
      <section className="px-5 space-y-4">
        <h2 className="font-display text-xl font-semibold">Near you</h2>
        {list.map((s, i) => (
          <SalonCard key={s.id} salon={s} index={i} />
        ))}
        {list.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-12">No salons match your search.</p>
        )}
      </section>
    </AppShell>
  );
};

export default Index;
