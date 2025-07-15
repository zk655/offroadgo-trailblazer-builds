import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import FeatureCards from '@/components/FeatureCards';
import VehiclesShowcase from '@/components/VehiclesShowcase';
import ProductsSection from '@/components/ProductsSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import AdSenseAd from '@/components/AdSenseAd';

const Index = () => {
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
      <section className="py-2 md:py-4 bg-muted/5">
        <div className="w-full overflow-hidden">
          <AdSenseAd 
            slot="8773228071"
            layout="in-article"
            className="w-full"
          />
        </div>
      </section>
      
      <FeatureCards />
      
      {/* Ad Section 2 - Mid Page */}
      <section className="py-2 md:py-4 bg-muted/10">
        <div className="w-full overflow-hidden">
          <AdSenseAd 
            slot="8773228071"
            layout="in-article"
            className="w-full"
          />
        </div>
      </section>
      
      <VehiclesShowcase />
      <ProductsSection />
      
      {/* Ad Section 3 - Before CTA */}
      <section className="py-2 md:py-4 bg-muted/5">
        <div className="w-full overflow-hidden">
          <AdSenseAd 
            slot="8773228071"
            layout="in-article"
            className="w-full"
          />
        </div>
      </section>
      
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
