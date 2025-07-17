import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import FeatureCards from '@/components/FeatureCards';
import VehiclesShowcase from '@/components/VehiclesShowcase';
import ProductsSection from '@/components/ProductsSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import AdPlacement from '@/components/AdPlacement';
import ClubsEventsSection from '@/components/ClubsEventsSection';
import InsuranceSection from '@/components/InsuranceSection';
import { useAutoDataSync } from '@/hooks/useAutoDataSync';

const Index = () => {
  // Initialize automatic data sync
  useAutoDataSync({
    enabled: true,
    syncOnMount: true,
    syncInterval: 30 * 60 * 1000, // 30 minutes
  });

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="OffRoadGo - Premium 4x4 Adventures & Off-Road Vehicles"
        description="Discover epic off-road trails, premium 4x4 vehicles, and professional-grade parts. Build your dream off-road machine and explore the world beyond the pavement."
        keywords="4x4 vehicles, off-road adventures, trails, jeep, toyota, ford, bronco, wrangler, lifted trucks, off-road parts, accessories"
        url="/"
      />
      <Navigation />
      <HeroSection />
      
      {/* Ad Section 1 - After Hero */}
      <AdPlacement 
        position="top" 
        pageType="home"
        className="py-4 md:py-6 bg-muted/5"
      />
      
      <FeatureCards />
      
      {/* Ad Section 2 - Mid Page */}
      <AdPlacement 
        position="middle" 
        pageType="home"
        className="py-4 md:py-6 bg-muted/10"
      />
      
      <VehiclesShowcase />
      <ProductsSection />
      
      {/* Clubs & Events Section */}
      <ClubsEventsSection />
      
      {/* Ad Section 3 - After Events */}
      <AdPlacement 
        position="inline" 
        pageType="home"
        className="py-4 md:py-6 bg-muted/5"
      />
      
      {/* Insurance Section */}
      <InsuranceSection />
      
      {/* Ad Section 4 - Before CTA */}
      <AdPlacement 
        position="bottom" 
        pageType="home"
        className="py-4 md:py-6 bg-muted/10"
      />
      
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
