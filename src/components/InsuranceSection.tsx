import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import OptimizedImage from '@/components/OptimizedImage';

interface InsuranceProvider {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  website_url: string | null;
  rating: number | null;
}

const InsuranceSection = () => {
  const { data: providers, isLoading } = useQuery({
    queryKey: ['insurance-providers-preview'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('insurance_providers_public')
        .select('*')
        .order('rating', { ascending: false })
        .limit(3);
      
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
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-muted/10">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <Badge variant="outline" className="mb-3 text-primary border-primary/20 bg-primary/5 text-xs font-medium">
            Insurance Partners
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Off-Road <span className="text-primary">Insurance</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Compare rates from top providers for your 4x4 vehicles
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-lg h-48" />
              </div>
            ))}
          </div>
        ) : providers && providers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {providers.map((provider, index) => (
              <Card key={provider.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-background border border-border overflow-hidden">
                {/* Provider Logo */}
                <div className="relative overflow-hidden aspect-[3/2] bg-muted/10 p-4 flex items-center justify-center">
                  {index === 0 && (
                    <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground border-0 text-xs z-10">
                      Top Rated
                    </Badge>
                  )}
                  
                  {provider.logo_url ? (
                    <OptimizedImage
                      src={provider.logo_url} 
                      alt={provider.name}
                      className="max-h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                      fallbackSrc="/placeholder.svg"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex items-center">
                      <Shield className="w-8 h-8 text-primary mr-3" />
                      <span className="font-semibold text-lg">{provider.name}</span>
                    </div>
                  )}
                  
                  {provider.rating && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-background/90 backdrop-blur-sm rounded-md px-2 py-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium">{provider.rating}</span>
                    </div>
                  )}
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{provider.name}</h3>
                  
                  {provider.description && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {provider.description}
                    </p>
                  )}

                  {/* Rating */}
                  {provider.rating && (
                    <div className="flex items-center gap-1 mb-3">
                      {getRatingStars(provider.rating)}
                    </div>
                  )}

                  {/* CTA Button */}
                  {provider.website_url ? (
                    <a href={provider.website_url} target="_blank" rel="noopener noreferrer">
                      <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-8 text-xs">
                        Get Quote
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </a>
                  ) : (
                    <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-8 text-xs">
                      Get Quote
                      <ArrowRight className="w-3 h-3 ml-1" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 mb-8">
            <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No providers available</h3>
            <p className="text-muted-foreground text-sm">Check back soon for the best insurance deals.</p>
          </div>
        )}

        {/* Simple CTA */}
        <div className="text-center">
          <Link to="/insurance">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Shield className="w-4 h-4 mr-2" />
              Compare All Insurance Providers
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default InsuranceSection;
