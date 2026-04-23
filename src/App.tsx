import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
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
import AdminProfile from "./pages/admin/AdminProfile.tsx";
import AdminShops from "./pages/admin/AdminShops.tsx";

const queryClient = new QueryClient();

const Protected = ({ children, adminOnly }: { children: React.ReactNode; adminOnly?: boolean }) => (
  <ProtectedRoute adminOnly={adminOnly}>{children}</ProtectedRoute>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/salon/:id" element={<SalonDetail />} />
            <Route path="/salon/:id/queue" element={<JoinQueue />} />
            <Route path="/salon/:id/book" element={<BookSlot />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<Protected><AdminDashboard /></Protected>} />
            <Route path="/admin/queue" element={<Protected><AdminQueue /></Protected>} />
            <Route path="/admin/bookings" element={<Protected><AdminBookings /></Protected>} />
            <Route path="/admin/staff" element={<Protected><AdminStaff /></Protected>} />
            <Route path="/admin/services" element={<Protected><AdminServices /></Protected>} />
            <Route path="/admin/analytics" element={<Protected><AdminAnalytics /></Protected>} />
            <Route path="/admin/settings" element={<Protected><AdminSettings /></Protected>} />
            <Route path="/admin/profile" element={<Protected><AdminProfile /></Protected>} />
            <Route path="/admin/shops" element={<Protected adminOnly><AdminShops /></Protected>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
