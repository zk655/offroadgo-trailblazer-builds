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
      
      {/* Ad Section - After Hero */}
      <section className="py-8 px-4">
        <div className="container mx-auto text-center">
          <AdSenseAd 
            slot="8773228071"
            style={{ display: 'block', textAlign: 'center', minHeight: '250px' }}
            format="auto"
            responsive={true}
          />
        </div>
      </section>
      
      <FeatureCards />
      
      {/* Ad Section - Mid Page */}
      <section className="py-8 px-4 bg-muted/20">
        <div className="container mx-auto text-center">
          <AdSenseAd 
            slot="8773228071" 
            style={{ display: 'block', textAlign: 'center', minHeight: '250px' }}
            format="auto"
            responsive={true}
          />
        </div>
      </section>
      
      <VehiclesShowcase />
      <ProductsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
