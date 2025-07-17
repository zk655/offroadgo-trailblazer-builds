import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import FeatureCards from '@/components/FeatureCards';
import VehiclesShowcase from '@/components/VehiclesShowcase';
import ProductsSection from '@/components/ProductsSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import AdSenseAd from '@/components/AdSenseAd';
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
      <section className="py-4 md:py-6 bg-muted/5">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <AdSenseAd 
              slot="8773228071"
              layout="in-article"
              className="w-full max-w-4xl"
            />
          </div>
        </div>
      </section>
      
      <FeatureCards />
      
      {/* Ad Section 2 - Mid Page */}
      <section className="py-4 md:py-6 bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <AdSenseAd 
              slot="8773228071"
              layout="in-article"
              className="w-full max-w-4xl"
            />
          </div>
        </div>
      </section>
      
      <VehiclesShowcase />
      <ProductsSection />
      
      {/* Clubs & Events Section */}
      <ClubsEventsSection />
      
      {/* Ad Section 3 - After Events */}
      <section className="py-4 md:py-6 bg-muted/5">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <AdSenseAd 
              slot="8773228071"
              layout="in-article"
              className="w-full max-w-4xl"
            />
          </div>
        </div>
      </section>
      
      {/* Insurance Section */}
      <InsuranceSection />
      
      {/* Ad Section 4 - Before CTA */}
      <section className="py-4 md:py-6 bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <AdSenseAd 
              slot="8773228071"
              layout="in-article"
              className="w-full max-w-4xl"
            />
          </div>
        </div>
      </section>
      
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
