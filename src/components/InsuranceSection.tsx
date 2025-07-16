import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Star, DollarSign, ArrowRight, CheckCircle, Truck, Car } from 'lucide-react';
import { Link } from 'react-router-dom';

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
    <section className="py-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/src/assets/insurance/progressive-logo.png')] bg-cover bg-center opacity-5" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-indigo-600/10 to-purple-600/20" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-700 rounded-full mb-8 shadow-xl">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Premium Insurance Coverage
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Secure your off-road vehicles with comprehensive coverage from America's top-rated insurance providers. 
            Compare competitive rates and discover the perfect protection for your adventures.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-xl h-96" />
              </div>
            ))}
          </div>
        ) : bestQuotes && bestQuotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {bestQuotes.map((quote, index) => (
              <Card key={quote.id} className={`group hover:shadow-2xl hover:scale-105 transition-all duration-500 border-0 bg-card/80 backdrop-blur-sm relative overflow-hidden ${index === 0 ? 'ring-2 ring-blue-500/30 ring-offset-4 ring-offset-background' : ''}`}>
                {index === 0 && (
                  <div className="absolute -top-3 -right-3 z-10">
                    <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg">Best Value</Badge>
                  </div>
                )}
                
                <CardHeader className="pb-3">
                  <div className="flex flex-col items-center text-center mb-3">
                    {quote.provider?.logo_url ? (
                      <img 
                        src={quote.provider.logo_url} 
                        alt={quote.provider.name}
                        className="h-16 w-auto object-contain mb-2"
                      />
                    ) : (
                      <div className="flex items-center mb-2">
                        <Shield className="w-8 h-8 text-blue-600 mr-2" />
                        <span className="font-bold text-lg">{quote.provider?.name}</span>
                      </div>
                    )}
                    
                    {quote.provider?.rating && (
                      <div className="flex items-center gap-1">
                        {getRatingStars(quote.provider.rating)}
                        <span className="text-sm text-muted-foreground ml-1">({quote.provider.rating})</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-center gap-2 mb-2">
                    {getVehicleIcon(quote.vehicle_type)}
                    <span className="font-semibold capitalize">{quote.vehicle_type.replace('_', ' ')}</span>
                  </div>
                  
                  <Badge 
                    className={`${getCoverageColor(quote.coverage_type)} text-white border-0 w-fit mx-auto`}
                  >
                    {quote.coverage_type}
                  </Badge>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {/* Pricing */}
                    <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        ${quote.monthly_premium}
                        <span className="text-sm font-normal text-muted-foreground">/mo</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        ${quote.annual_premium}/year
                      </div>
                    </div>

                    {/* Coverage Details */}
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Deductible:</span>
                        <span className="font-medium">${quote.deductible?.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Coverage:</span>
                        <span className="font-medium">${quote.coverage_limit?.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* Features */}
                    {quote.features && quote.features.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-1 text-xs">Features:</h4>
                        <div className="space-y-1">
                          {quote.features.slice(0, 2).map((feature, index) => (
                            <div key={index} className="flex items-center text-xs">
                              <CheckCircle className="w-3 h-3 text-green-500 mr-1 flex-shrink-0" />
                              <span className="capitalize text-muted-foreground">{feature.replace('_', ' ')}</span>
                            </div>
                          ))}
                          {quote.features.length > 2 && (
                            <div className="text-xs text-muted-foreground">
                              +{quote.features.length - 2} more
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 mb-12">
            <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No quotes available</h3>
            <p className="text-muted-foreground">Check back soon for the best insurance deals.</p>
          </div>
        )}

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center p-6 bg-card/50 backdrop-blur-sm rounded-xl">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Comprehensive Coverage</h3>
            <p className="text-muted-foreground text-sm">
              Full protection for your off-road vehicles including collision, comprehensive, and liability coverage.
            </p>
          </div>

          <div className="text-center p-6 bg-card/50 backdrop-blur-sm rounded-xl">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-950/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Best Rates</h3>
            <p className="text-muted-foreground text-sm">
              Compare quotes from top providers to find the most competitive rates for your specific vehicle.
            </p>
          </div>

          <div className="text-center p-6 bg-card/50 backdrop-blur-sm rounded-xl">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-950/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-bold text-lg mb-2">Top-Rated Providers</h3>
            <p className="text-muted-foreground text-sm">
              Work with trusted insurance companies that specialize in truck and SUV coverage.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-blue-600/10 via-indigo-600/5 to-purple-600/10 rounded-2xl p-8 md:p-12 text-center border border-blue-200/20 dark:border-blue-800/20">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Save on Insurance?
            </h3>
            <p className="text-lg text-muted-foreground mb-8">
              Compare quotes from top providers and find the perfect coverage for your truck or SUV. 
              Get protected and save money today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-700 hover:shadow-lg transition-all">
                <Link to="/insurance">
                  <Shield className="w-5 h-5 mr-2" />
                  Compare Premium Quotes
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                <Link to="/insurance">
                  View All Providers
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InsuranceSection;