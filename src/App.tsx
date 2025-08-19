import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Vehicles from "./pages/Vehicles";
import VehicleDetail from "./pages/VehicleDetail";
import Compare from "./pages/Compare";
import Build from "./pages/Build";
import Parts from "./pages/Parts";
import ProductDetail from "./pages/ProductDetail";
import Trails from "./pages/Trails";
import Videos from "./pages/Videos";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import NotFound from "./pages/NotFound";
import TrailDetail from "./pages/TrailDetail";
import AdventureStart from "./pages/AdventureStart";
import AboutUs from "./pages/AboutUs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import Sitemap from "./pages/Sitemap";
import ClubsEvents from "./pages/ClubsEvents";
import Insurance from "./pages/Insurance";
import EventDetail from "./pages/EventDetail";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import AdminBlogs from "./pages/admin/AdminBlogs";
import AdminVideos from "./pages/admin/AdminVideos";
import AdminVehicles from "./pages/admin/AdminVehicles";
import AdminParts from "./pages/admin/AdminParts";
import AdminTrails from "./pages/admin/AdminTrails";
import AdminInsurance from "./pages/admin/AdminInsurance";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminClubs from "./pages/admin/AdminClubs";
import AdminUsers from "./pages/admin/AdminUsers";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <AuthProvider>
          <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/vehicles" element={<Vehicles />} />
              <Route path="/vehicles/:slug" element={<VehicleDetail />} />
              <Route path="/vehicle/:slug" element={<VehicleDetail />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/build" element={<Build />} />
              <Route path="/products" element={<Parts />} />
              <Route path="/product/:slug" element={<ProductDetail />} />
              <Route path="/trails" element={<Trails />} />
              <Route path="/trail/:slug" element={<TrailDetail />} />
              <Route path="/adventure-start" element={<AdventureStart />} />
              <Route path="/videos" element={<Videos />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsConditions />} />
              <Route path="/sitemap" element={<Sitemap />} />
              <Route path="/clubs-events" element={<ClubsEvents />} />
              <Route path="/insurance" element={<Insurance />} />
              <Route path="/event/:id" element={<EventDetail />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/blogs" element={<AdminBlogs />} />
              <Route path="/admin/videos" element={<AdminVideos />} />
              <Route path="/admin/vehicles" element={<AdminVehicles />} />
              <Route path="/admin/parts" element={<AdminParts />} />
              <Route path="/admin/products" element={<AdminParts />} />
              <Route path="/admin/trails" element={<AdminTrails />} />
              <Route path="/admin/insurance" element={<AdminInsurance />} />
              <Route path="/admin/events" element={<AdminEvents />} />
              <Route path="/admin/clubs" element={<AdminClubs />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
