import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import FeatureCards from '@/components/FeatureCards';
import VehiclesShowcase from '@/components/VehiclesShowcase';
import ProductsSection from '@/components/ProductsSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      
      {/* Section Separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <FeatureCards />
      
      {/* Section Separator with spacing */}
      <div className="py-8 bg-background">
        <div className="container mx-auto px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>
      </div>
      
      <VehiclesShowcase />
      <ProductsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
