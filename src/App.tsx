import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import SalonDetail from "./pages/SalonDetail.tsx";
import JoinQueue from "./pages/JoinQueue.tsx";
import BookSlot from "./pages/BookSlot.tsx";
import Profile from "./pages/Profile.tsx";
import Bookings from "./pages/Bookings.tsx";
import Favorites from "./pages/Favorites.tsx";
import AdminLogin from "./pages/admin/AdminLogin.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import AdminQueue from "./pages/admin/AdminQueue.tsx";
import AdminBookings from "./pages/admin/AdminBookings.tsx";
import AdminStaff from "./pages/admin/AdminStaff.tsx";
import AdminServices from "./pages/admin/AdminServices.tsx";
import AdminAnalytics from "./pages/admin/AdminAnalytics.tsx";
import AdminSettings from "./pages/admin/AdminSettings.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/salon/:id" element={<SalonDetail />} />
          <Route path="/salon/:id/queue" element={<JoinQueue />} />
          <Route path="/salon/:id/book" element={<BookSlot />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/queue" element={<AdminQueue />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/staff" element={<AdminStaff />} />
          <Route path="/admin/services" element={<AdminServices />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
