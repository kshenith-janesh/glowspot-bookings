import salon1 from "@/assets/salon-1.jpg";
import salon2 from "@/assets/salon-2.jpg";
import salon3 from "@/assets/salon-3.jpg";
import salon4 from "@/assets/salon-4.jpg";

export type Stylist = { id: string; name: string; role: string; rating: number; speed: "fast" | "average" };
export type Service = { id: string; name: string; duration: number; price: number; category: string };
export type Salon = {
  id: string;
  name: string;
  tagline: string;
  image: string;
  distance: string;
  rating: number;
  reviews: number;
  waitMins: number;
  status: "open" | "busy" | "closed";
  address: string;
  services: Service[];
  stylists: Stylist[];
  gallery: string[];
};

export const salons: Salon[] = [
  {
    id: "midnight-edge",
    name: "Midnight Edge",
    tagline: "Premium men's grooming",
    image: salon1,
    distance: "0.4 km",
    rating: 4.9,
    reviews: 1284,
    waitMins: 12,
    status: "open",
    address: "23 Crescent Lane, Bandra West",
    services: [
      { id: "s1", name: "Signature Haircut", duration: 45, price: 1200, category: "Hair" },
      { id: "s2", name: "Beard Sculpt", duration: 30, price: 700, category: "Beard" },
      { id: "s3", name: "Hot Towel Shave", duration: 40, price: 900, category: "Beard" },
      { id: "s4", name: "Hair Color", duration: 75, price: 2400, category: "Hair" },
    ],
    stylists: [
      { id: "st1", name: "Arjun Mehta", role: "Master Stylist", rating: 4.95, speed: "fast" },
      { id: "st2", name: "Rhea Kapoor", role: "Senior Barber", rating: 4.8, speed: "average" },
      { id: "st3", name: "Kabir Singh", role: "Beard Specialist", rating: 4.9, speed: "fast" },
    ],
    gallery: [salon1, salon3],
  },
  {
    id: "velvet-room",
    name: "The Velvet Room",
    tagline: "Editorial cuts & color",
    image: salon2,
    distance: "0.9 km",
    rating: 4.8,
    reviews: 892,
    waitMins: 28,
    status: "busy",
    address: "8 Linking Road, Khar",
    services: [
      { id: "s1", name: "Precision Cut", duration: 60, price: 1800, category: "Hair" },
      { id: "s2", name: "Balayage", duration: 120, price: 4500, category: "Color" },
      { id: "s3", name: "Keratin Treatment", duration: 90, price: 3200, category: "Treatment" },
    ],
    stylists: [
      { id: "st1", name: "Maya Iyer", role: "Creative Director", rating: 4.97, speed: "average" },
      { id: "st2", name: "Zara Khan", role: "Color Expert", rating: 4.85, speed: "average" },
    ],
    gallery: [salon2],
  },
  {
    id: "atelier-noir",
    name: "Atelier Noir",
    tagline: "Minimalist hair studio",
    image: salon3,
    distance: "1.6 km",
    rating: 4.7,
    reviews: 412,
    waitMins: 5,
    status: "open",
    address: "14 Pali Hill, Bandra",
    services: [
      { id: "s1", name: "Studio Cut", duration: 50, price: 1500, category: "Hair" },
      { id: "s2", name: "Scalp Therapy", duration: 35, price: 1100, category: "Treatment" },
    ],
    stylists: [
      { id: "st1", name: "Devansh Roy", role: "Founder", rating: 4.92, speed: "fast" },
    ],
    gallery: [salon3],
  },
  {
    id: "gilded-spa",
    name: "Gilded Spa & Salon",
    tagline: "Luxury beauty rituals",
    image: salon4,
    distance: "2.3 km",
    rating: 4.9,
    reviews: 2104,
    waitMins: 0,
    status: "open",
    address: "Level 3, Phoenix Marketcity",
    services: [
      { id: "s1", name: "Classic Facial", duration: 60, price: 2200, category: "Skin" },
      { id: "s2", name: "Gel Manicure", duration: 45, price: 1400, category: "Nails" },
      { id: "s3", name: "Full Body Massage", duration: 90, price: 3800, category: "Body" },
    ],
    stylists: [
      { id: "st1", name: "Aanya Verma", role: "Lead Therapist", rating: 4.96, speed: "average" },
      { id: "st2", name: "Priya Nair", role: "Nail Artist", rating: 4.88, speed: "fast" },
    ],
    gallery: [salon4],
  },
];

export const getSalon = (id: string) => salons.find((s) => s.id === id);
