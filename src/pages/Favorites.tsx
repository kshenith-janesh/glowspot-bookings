import { AppShell } from "@/components/AppShell";
import { SalonCard } from "@/components/SalonCard";
import { salons } from "@/data/salons";

const Favorites = () => (
  <AppShell>
    <header className="px-5 pt-12 pb-6">
      <p className="text-[11px] uppercase tracking-widest text-primary">Saved spots</p>
      <h1 className="font-display text-3xl font-medium mt-1">Favorites</h1>
    </header>
    <div className="px-5 space-y-4">
      {salons.slice(0, 2).map((s, i) => (
        <SalonCard key={s.id} salon={s} index={i} />
      ))}
    </div>
  </AppShell>
);

export default Favorites;
