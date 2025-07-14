import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import Vehicles from "./pages/Vehicles";
import VehicleDetail from "./pages/VehicleDetail";
import Compare from "./pages/Compare";
import Build from "./pages/Build";
import Parts from "./pages/Parts";
import ProductDetail from "./pages/ProductDetail";
import Trails from "./pages/Trails";
import Blog from "./pages/Blog";
import NotFound from "./pages/NotFound";
import TrailDetail from "./pages/TrailDetail";
import AdventureStart from "./pages/AdventureStart";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/vehicle/:id" element={<VehicleDetail />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/build" element={<Build />} />
            <Route path="/products" element={<Parts />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/trails" element={<Trails />} />
            <Route path="/trail/:id" element={<TrailDetail />} />
            <Route path="/adventure-start" element={<AdventureStart />} />
            <Route path="/blog" element={<Blog />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
