import { Home, Calendar, Heart, User } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Discover", icon: Home },
  { to: "/bookings", label: "Bookings", icon: Calendar },
  { to: "/favorites", label: "Favorites", icon: Heart },
  { to: "/profile", label: "Profile", icon: User },
];

export const BottomNav = () => (
  <nav className="fixed bottom-0 inset-x-0 z-50 glass border-t border-border/60">
    <div className="max-w-md mx-auto grid grid-cols-4 px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      {items.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center gap-1 py-2 rounded-xl transition-colors",
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )
          }
        >
          <Icon className="h-5 w-5" strokeWidth={2.2} />
          <span className="text-[10px] font-medium tracking-wide uppercase">{label}</span>
        </NavLink>
      ))}
    </div>
  </nav>
);
