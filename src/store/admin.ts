import { create } from "zustand";

export type QueueStatus = "waiting" | "in_progress" | "done" | "skipped";
export type StaffStatus = "available" | "busy" | "off";

export type Service = { id: string; name: string; price: number; duration: number };
export type Staff = {
  id: string;
  name: string;
  role: string;
  status: StaffStatus;
  hours: string;
  services: string[]; // service ids
  avgDuration: number;
};
export type QueueEntry = {
  id: string;
  customer: string;
  serviceId: string;
  staffId?: string;
  addedAt: number;
  status: QueueStatus;
  delayMins?: number;
};
export type Booking = {
  id: string;
  customer: string;
  serviceId: string;
  staffId?: string;
  date: string; // ISO yyyy-mm-dd
  time: string; // HH:mm
  status: "confirmed" | "pending" | "cancelled";
};

type State = {
  services: Service[];
  staff: Staff[];
  queue: QueueEntry[];
  bookings: Booking[];
  salon: { name: string; address: string; phone: string; openingHours: string; maxQueue: number; bufferMins: number };
  // actions
  addWalkin: (entry: Omit<QueueEntry, "id" | "addedAt" | "status">) => void;
  startService: (id: string) => void;
  completeService: (id: string) => void;
  skipEntry: (id: string) => void;
  reorderQueue: (ids: string[]) => void;
  addService: (s: Omit<Service, "id">) => void;
  updateService: (id: string, s: Partial<Service>) => void;
  removeService: (id: string) => void;
  addStaff: (s: Omit<Staff, "id">) => void;
  updateStaff: (id: string, s: Partial<Staff>) => void;
  removeStaff: (id: string) => void;
  addBooking: (b: Omit<Booking, "id" | "status">) => void;
  updateBooking: (id: string, b: Partial<Booking>) => void;
  cancelBooking: (id: string) => void;
  updateSalon: (s: Partial<State["salon"]>) => void;
};

const today = new Date();
const iso = (d: Date) => d.toISOString().split("T")[0];

const seedServices: Service[] = [
  { id: "sv1", name: "Signature Haircut", price: 1200, duration: 45 },
  { id: "sv2", name: "Beard Sculpt", price: 700, duration: 30 },
  { id: "sv3", name: "Hot Towel Shave", price: 900, duration: 40 },
  { id: "sv4", name: "Hair Color", price: 2400, duration: 75 },
  { id: "sv5", name: "Classic Facial", price: 2200, duration: 60 },
];

const seedStaff: Staff[] = [
  { id: "stf1", name: "Arjun Mehta", role: "Master Stylist", status: "busy", hours: "10:00 – 20:00", services: ["sv1", "sv4"], avgDuration: 45 },
  { id: "stf2", name: "Rhea Kapoor", role: "Senior Barber", status: "available", hours: "11:00 – 21:00", services: ["sv1", "sv2"], avgDuration: 40 },
  { id: "stf3", name: "Kabir Singh", role: "Beard Specialist", status: "available", hours: "09:00 – 18:00", services: ["sv2", "sv3"], avgDuration: 35 },
  { id: "stf4", name: "Aanya Verma", role: "Lead Therapist", status: "off", hours: "Off today", services: ["sv5"], avgDuration: 60 },
];

const now = Date.now();
const seedQueue: QueueEntry[] = [
  { id: "q1", customer: "Vivaan Shah", serviceId: "sv1", staffId: "stf1", addedAt: now - 22 * 60000, status: "in_progress" },
  { id: "q2", customer: "Ishaan Roy", serviceId: "sv2", staffId: "stf3", addedAt: now - 15 * 60000, status: "waiting" },
  { id: "q3", customer: "Meera Joshi", serviceId: "sv5", addedAt: now - 9 * 60000, status: "waiting" },
  { id: "q4", customer: "Aditya Rao", serviceId: "sv1", staffId: "stf2", addedAt: now - 4 * 60000, status: "waiting", delayMins: 5 },
];

const seedBookings: Booking[] = [
  { id: "b1", customer: "Sara Khan", serviceId: "sv4", staffId: "stf1", date: iso(today), time: "15:30", status: "confirmed" },
  { id: "b2", customer: "Rohan Patel", serviceId: "sv1", staffId: "stf2", date: iso(today), time: "16:00", status: "confirmed" },
  { id: "b3", customer: "Diya Mehra", serviceId: "sv5", date: iso(today), time: "17:15", status: "pending" },
  { id: "b4", customer: "Karan Desai", serviceId: "sv3", staffId: "stf3", date: iso(new Date(today.getTime() + 86400000)), time: "11:00", status: "confirmed" },
];

const uid = () => Math.random().toString(36).slice(2, 9);

export const useAdmin = create<State>((set) => ({
  services: seedServices,
  staff: seedStaff,
  queue: seedQueue,
  bookings: seedBookings,
  salon: {
    name: "Midnight Edge",
    address: "23 Crescent Lane, Bandra West",
    phone: "+91 98765 43210",
    openingHours: "10:00 – 21:00",
    maxQueue: 20,
    bufferMins: 5,
  },
  addWalkin: (e) =>
    set((s) => ({ queue: [...s.queue, { ...e, id: uid(), addedAt: Date.now(), status: "waiting" }] })),
  startService: (id) =>
    set((s) => ({ queue: s.queue.map((q) => (q.id === id ? { ...q, status: "in_progress" } : q)) })),
  completeService: (id) =>
    set((s) => ({ queue: s.queue.map((q) => (q.id === id ? { ...q, status: "done" } : q)) })),
  skipEntry: (id) =>
    set((s) => ({ queue: s.queue.map((q) => (q.id === id ? { ...q, status: "skipped" } : q)) })),
  reorderQueue: (ids) =>
    set((s) => ({ queue: ids.map((id) => s.queue.find((q) => q.id === id)!).filter(Boolean) })),
  addService: (sv) => set((s) => ({ services: [...s.services, { ...sv, id: uid() }] })),
  updateService: (id, sv) => set((s) => ({ services: s.services.map((x) => (x.id === id ? { ...x, ...sv } : x)) })),
  removeService: (id) => set((s) => ({ services: s.services.filter((x) => x.id !== id) })),
  addStaff: (st) => set((s) => ({ staff: [...s.staff, { ...st, id: uid() }] })),
  updateStaff: (id, st) => set((s) => ({ staff: s.staff.map((x) => (x.id === id ? { ...x, ...st } : x)) })),
  removeStaff: (id) => set((s) => ({ staff: s.staff.filter((x) => x.id !== id) })),
  addBooking: (b) => set((s) => ({ bookings: [...s.bookings, { ...b, id: uid(), status: "confirmed" }] })),
  updateBooking: (id, b) => set((s) => ({ bookings: s.bookings.map((x) => (x.id === id ? { ...x, ...b } : x)) })),
  cancelBooking: (id) =>
    set((s) => ({ bookings: s.bookings.map((x) => (x.id === id ? { ...x, status: "cancelled" } : x)) })),
  updateSalon: (sl) => set((s) => ({ salon: { ...s.salon, ...sl } })),
}));

// Smart wait time: sum of waiting + in_progress remaining service durations + buffer
export const calcWaitMins = (queue: QueueEntry[], services: Service[], buffer = 5) => {
  const active = queue.filter((q) => q.status === "waiting" || q.status === "in_progress");
  return active.reduce((sum, q, i) => {
    const dur = services.find((s) => s.id === q.serviceId)?.duration ?? 30;
    const delay = q.delayMins ?? 0;
    return sum + dur + delay + (i > 0 ? buffer : 0);
  }, 0);
};
