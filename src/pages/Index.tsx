import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import FeatureCards from '@/components/FeatureCards';
import VehiclesShowcase from '@/components/VehiclesShowcase';
import ProductsSection from '@/components/ProductsSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

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
      <FeatureCards />
      <VehiclesShowcase />
      <ProductsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
