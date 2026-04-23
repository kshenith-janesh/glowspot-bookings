import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { Bell, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export const AdminShell = ({ children, title, subtitle, actions }: { children: ReactNode; title: string; subtitle?: string; actions?: ReactNode }) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const handleLogout = async () => { await signOut(); navigate("/admin/login"); };
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-hero">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-30 glass border-b border-border/60">
            <div className="h-14 flex items-center gap-3 px-3 sm:px-6">
              <SidebarTrigger className="text-foreground" />
              <div className="flex-1 min-w-0">
                <h1 className="font-display text-lg sm:text-xl truncate leading-none">{title}</h1>
                {subtitle && <p className="text-[11px] text-muted-foreground mt-1 truncate">{subtitle}</p>}
              </div>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </header>
          <main className="flex-1 p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-full">
            {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
