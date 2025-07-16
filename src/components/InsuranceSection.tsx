import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Star, DollarSign, ArrowRight, CheckCircle, Truck, Car } from 'lucide-react';
import { Link } from 'react-router-dom';
import OptimizedImage from '@/components/OptimizedImage';

interface InsuranceQuote {
  id: string;
  provider_id: string;
  vehicle_type: string;
  coverage_type: string;
  monthly_premium: number;
  annual_premium: number;
  deductible: number;
  coverage_limit: number;
  features: string[];
  provider?: {
    name: string;
    rating: number;
    logo_url: string;
  };
}

const InsuranceSection = () => {
  const { data: bestQuotes, isLoading } = useQuery({
    queryKey: ['best-insurance-quotes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('insurance_quotes')
        .select(`
          *,
          provider:insurance_providers(name, rating, logo_url)
        `)
        .in('vehicle_type', ['truck', 'SUV', 'pickup'])
        .order('monthly_premium')
        .limit(3);
      
      if (error) throw error;
      return data as InsuranceQuote[];
    },
  });

  const getRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 fill-yellow-400/50 text-yellow-400" />);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }

    return stars;
  };

  const getVehicleIcon = (vehicleType: string) => {
    switch (vehicleType.toLowerCase()) {
      case 'truck':
      case 'pickup':
        return <Truck className="w-5 h-5" />;
      default:
        return <Car className="w-5 h-5" />;
    }
  };

  const getCoverageColor = (coverageType: string) => {
    switch (coverageType.toLowerCase()) {
      case 'liability': return 'bg-blue-500';
      case 'comprehensive': return 'bg-green-500';
      case 'collision': return 'bg-orange-500';
      case 'full': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-muted/10">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <Badge variant="outline" className="mb-3 text-primary border-primary/20 bg-primary/5 text-xs font-medium">
            Insurance Quotes
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
        ) : bestQuotes && bestQuotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {bestQuotes.map((quote, index) => (
              <Card key={quote.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-background border border-border overflow-hidden">
                {/* Provider Logo */}
                <div className="relative overflow-hidden aspect-[3/2] bg-muted/10 p-4 flex items-center justify-center">
                  {index === 0 && (
                    <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground border-0 text-xs z-10">
                      Best Value
                    </Badge>
                  )}
                  
                  {quote.provider?.logo_url ? (
                    <OptimizedImage
                      src={quote.provider.logo_url} 
                      alt={quote.provider.name}
                      className="max-h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                      fallbackSrc="/placeholder.svg"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex items-center">
                      <Shield className="w-8 h-8 text-primary mr-3" />
                      <span className="font-semibold text-lg">{quote.provider?.name}</span>
                    </div>
                  )}
                  
                  {quote.provider?.rating && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-background/90 backdrop-blur-sm rounded-md px-2 py-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium">{quote.provider.rating}</span>
                    </div>
                  )}
                </div>
                
                <CardContent className="p-4">

                  {/* Vehicle Type & Coverage */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      {getVehicleIcon(quote.vehicle_type)}
                      <span className="text-xs font-medium capitalize">{quote.vehicle_type}</span>
                    </div>
                    <Badge variant="outline" className="text-xs px-2 py-0.5">
                      {quote.coverage_type}
                    </Badge>
                  </div>

                  {/* Pricing - Compact */}
                  <div className="text-center p-3 bg-muted/50 rounded-lg mb-3">
                    <div className="text-xl font-bold text-primary">
                      ${quote.monthly_premium}
                      <span className="text-xs font-normal text-muted-foreground">/mo</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ${quote.annual_premium}/year
                    </div>
                  </div>

                  {/* Key Details */}
                  <div className="space-y-1 text-xs mb-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Deductible:</span>
                      <span className="font-medium">${quote.deductible?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Coverage:</span>
                      <span className="font-medium">${quote.coverage_limit?.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Top Features */}
                  {quote.features && quote.features.length > 0 && (
                    <div className="mb-3">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span>{quote.features[0]?.replace('_', ' ')}</span>
                      </div>
                      {quote.features.length > 1 && (
                        <div className="text-xs text-muted-foreground">
                          +{quote.features.length - 1} more benefits
                        </div>
                      )}
                    </div>
                  )}

                  {/* CTA Button */}
                  <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-8 text-xs">
                    Get Quote
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 mb-8">
            <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No quotes available</h3>
            <p className="text-muted-foreground text-sm">Check back soon for the best insurance deals.</p>
          </div>
        )}

        {/* Simple CTA */}
        <div className="text-center">
          <Link to="/insurance">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Shield className="w-4 h-4 mr-2" />
              Compare All Insurance Quotes
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default InsuranceSection;