import { AdminShell } from "@/components/admin/AdminShell";
import { useAdmin } from "@/store/admin";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line, CartesianGrid } from "recharts";
import { TrendingUp, Users, Clock, Star } from "lucide-react";

const customersData = [
  { day: "Mon", customers: 24 },
  { day: "Tue", customers: 31 },
  { day: "Wed", customers: 28 },
  { day: "Thu", customers: 42 },
  { day: "Fri", customers: 56 },
  { day: "Sat", customers: 78 },
  { day: "Sun", customers: 64 },
];

const peakHoursData = [
  { hour: "10am", count: 4 },
  { hour: "11am", count: 7 },
  { hour: "12pm", count: 9 },
  { hour: "1pm", count: 6 },
  { hour: "2pm", count: 5 },
  { hour: "3pm", count: 8 },
  { hour: "4pm", count: 12 },
  { hour: "5pm", count: 16 },
  { hour: "6pm", count: 18 },
  { hour: "7pm", count: 14 },
  { hour: "8pm", count: 9 },
];

export default function AdminAnalytics() {
  const { services } = useAdmin();
  const popular = [...services].sort((a, b) => b.price - a.price).slice(0, 5).map((s, i) => ({ name: s.name, bookings: 80 - i * 12 }));
  const total = customersData.reduce((s, d) => s + d.customers, 0);

  const stats = [
    { label: "Total this week", value: total, icon: Users },
    { label: "Peak hour", value: "6 PM", icon: TrendingUp },
    { label: "Avg service", value: "42m", icon: Clock },
    { label: "Satisfaction", value: "4.9", icon: Star },
  ];

  return (
    <AdminShell title="Analytics" subtitle="Last 7 days">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-card-gradient border border-border rounded-2xl p-4">
            <s.icon className="h-5 w-5 text-primary" />
            <p className="text-2xl font-display mt-3">{s.value}</p>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-card-gradient border border-border rounded-2xl p-4 sm:p-5">
          <h3 className="font-display text-lg mb-4">Daily customers</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={customersData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }} />
                <Line type="monotone" dataKey="customers" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ fill: "hsl(var(--primary))" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card-gradient border border-border rounded-2xl p-4 sm:p-5">
          <h3 className="font-display text-lg mb-4">Peak hours</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={peakHoursData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }} />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-card-gradient border border-border rounded-2xl p-4 sm:p-5">
        <h3 className="font-display text-lg mb-4">Most popular services</h3>
        <ul className="space-y-3">
          {popular.map((p) => {
            const max = popular[0].bookings;
            const pct = (p.bookings / max) * 100;
            return (
              <li key={p.name}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span>{p.name}</span>
                  <span className="text-muted-foreground">{p.bookings}</span>
                </div>
                <div className="h-2 bg-background/50 rounded-full overflow-hidden">
                  <div className="h-full bg-gold rounded-full" style={{ width: `${pct}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </AdminShell>
  );
}
