import { LayoutDashboard, ListOrdered, Calendar, Users, Scissors, BarChart3, Settings, Sparkles } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const items = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard, end: true },
  { title: "Queue", url: "/admin/queue", icon: ListOrdered },
  { title: "Bookings", url: "/admin/bookings", icon: Calendar },
  { title: "Staff", url: "/admin/staff", icon: Users },
  { title: "Services", url: "/admin/services", icon: Scissors },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="px-4 py-5">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gold flex items-center justify-center shadow-gold shrink-0">
            <Sparkles className="h-5 w-5 text-primary-foreground" strokeWidth={2.4} />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-display text-lg leading-none">GlowSlot</span>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">Admin</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="text-[10px] uppercase tracking-widest">Manage</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = item.end ? location.pathname === item.url : location.pathname.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild tooltip={item.title} isActive={active}>
                      <NavLink to={item.url} end={item.end}
                        className={cn(
                          "flex items-center gap-3 rounded-lg",
                          active && "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        )}
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span>{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        {!collapsed && (
          <div className="rounded-xl border border-sidebar-border bg-sidebar-accent/40 p-3">
            <p className="text-xs font-medium">Owner</p>
            <p className="text-[11px] text-muted-foreground truncate">owner@midnight-edge.com</p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
