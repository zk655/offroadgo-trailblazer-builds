import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Star, ExternalLink } from 'lucide-react';
import OptimizedImage from '@/components/OptimizedImage';
import AdPlacement from '@/components/AdPlacement';

interface InsuranceProvider {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  description: string | null;
  rating: number | null;
}

const Insurance = () => {
  const { data: providers, isLoading } = useQuery({
    queryKey: ['insurance-providers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('insurance_providers_public')
        .select('*')
        .order('rating', { ascending: false });
      
      if (error) throw error;
      return data as InsuranceProvider[];
    },
  });

  const getRatingStars = (rating: number | null) => {
    if (!rating) return null;
    const stars = [];
    const fullStars = Math.floor(rating);

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }

    const remainingStars = 5 - fullStars;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }

    return stars;
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Best Truck & SUV Insurance - Compare Rates"
        description="Find the best insurance rates for trucks, SUVs, and off-road vehicles."
        keywords="truck insurance, SUV insurance, vehicle insurance"
        url="/insurance"
        type="website"
      />
      <Navigation />
      
      <AdPlacement position="top" pageType="insurance" className="py-2 bg-muted/10 border-b" />

      <section className="relative py-20 bg-gradient-to-br from-blue-600 to-indigo-800">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4 text-center">
          <Shield className="w-16 h-16 text-white mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Insurance Partners</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Protect your vehicles with coverage from top-rated insurance providers.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Top Insurance Providers</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Trusted providers for comprehensive vehicle protection.
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-muted rounded-lg h-64" />
                </div>
              ))}
            </div>
          ) : providers && providers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {providers.map((provider) => (
                <Card key={provider.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      {provider.logo_url ? (
                        <OptimizedImage
                          src={provider.logo_url}
                          alt={provider.name}
                          className="h-12 w-auto object-contain"
                          fallbackSrc="/placeholder.svg"
                        />
                      ) : (
                        <div className="flex items-center">
                          <Shield className="w-8 h-8 text-primary mr-2" />
                          <span className="font-bold">{provider.name}</span>
                        </div>
                      )}
                      
                      {provider.rating && (
                        <div className="flex items-center gap-1">
                          {getRatingStars(provider.rating)}
                        </div>
                      )}
                    </div>
                    <CardTitle>{provider.name}</CardTitle>
                  </CardHeader>

                  <CardContent>
                    {provider.description && (
                      <p className="text-muted-foreground mb-4 line-clamp-3">{provider.description}</p>
                    )}
                    
                    {provider.website_url && (
                      <Button variant="default" size="sm" asChild className="w-full">
                        <a href={provider.website_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Get Quote
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No providers available</h3>
              <p className="text-muted-foreground">Check back soon for insurance partners.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Insurance;
