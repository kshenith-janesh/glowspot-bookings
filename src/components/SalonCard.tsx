import { motion } from "framer-motion";
import { Star, MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Salon } from "@/data/salons";
import { cn } from "@/lib/utils";

const statusStyles = {
  open: "text-success",
  busy: "text-warning",
  closed: "text-muted-foreground",
};

export const SalonCard = ({ salon, index = 0 }: { salon: Salon; index?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.06, ease: [0.32, 0.72, 0, 1] }}
  >
    <Link to={`/salon/${salon.id}`} className="block group">
      <div className="relative overflow-hidden rounded-3xl bg-card-gradient ring-gold shadow-soft">
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={salon.image}
            alt={salon.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
          <div className="absolute top-3 left-3 flex items-center gap-1.5 glass rounded-full px-3 py-1.5">
            <span className={cn("relative h-2 w-2 rounded-full pulse-dot", statusStyles[salon.status])}>
              <span className="relative block h-2 w-2 rounded-full bg-current" />
            </span>
            <span className={cn("text-[11px] font-semibold uppercase tracking-wider", statusStyles[salon.status])}>
              {salon.status}
            </span>
          </div>
          {salon.waitMins > 0 ? (
            <div className="absolute top-3 right-3 glass rounded-full px-3 py-1.5 flex items-center gap-1.5">
              <Clock className="h-3 w-3 text-primary" />
              <span className="text-[11px] font-semibold text-foreground">{salon.waitMins} min wait</span>
            </div>
          ) : (
            <div className="absolute top-3 right-3 bg-gold rounded-full px-3 py-1.5">
              <span className="text-[11px] font-bold text-primary-foreground uppercase tracking-wider">Walk in</span>
            </div>
          )}
        </div>
        <div className="p-4 -mt-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-display text-xl font-semibold leading-tight truncate">{salon.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{salon.tagline}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0 bg-secondary/60 rounded-full px-2.5 py-1">
              <Star className="h-3 w-3 fill-primary text-primary" />
              <span className="text-xs font-semibold">{salon.rating}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{salon.distance}</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span>{salon.reviews} reviews</span>
          </div>
        </div>
      </div>
    </Link>
  </motion.div>
);
