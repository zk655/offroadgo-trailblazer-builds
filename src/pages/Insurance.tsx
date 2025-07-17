import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Star, DollarSign, Calendar, CheckCircle, Phone, ExternalLink, Truck, Car, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import OptimizedImage from '@/components/OptimizedImage';
import AdPlacement from '@/components/AdPlacement';

interface InsuranceProvider {
  id: string;
  name: string;
  company_name: string;
  logo_url: string;
  website_url: string;
  contact_phone: string;
  contact_email: string;
  description: string;
  rating: number;
  coverage_areas: string[];
  specializes_in: string[];
}

interface InsuranceQuote {
  id: string;
  provider_id: string;
  vehicle_type: string;
  coverage_type: string;
  monthly_premium: number;
  annual_premium: number;
  deductible: number;
  coverage_limit: number;
  min_age: number;
  max_age: number;
  min_experience_years: number;
  state_code: string;
  effective_date: string;
  expiry_date: string;
  features: string[];
  provider?: InsuranceProvider;
}

const Insurance = () => {
  const [selectedVehicleType, setSelectedVehicleType] = useState<string>('all');
  const [selectedCoverageType, setSelectedCoverageType] = useState<string>('all');

  const { data: providers, isLoading: providersLoading } = useQuery({
    queryKey: ['insurance-providers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('insurance_providers')
        .select('*')
        .order('rating', { ascending: false });
      
      if (error) throw error;
      return data as InsuranceProvider[];
    },
  });

  const { data: quotes, isLoading: quotesLoading } = useQuery({
    queryKey: ['insurance-quotes', selectedVehicleType, selectedCoverageType],
    queryFn: async () => {
      let query = supabase
        .from('insurance_quotes')
        .select(`
          *,
          provider:insurance_providers(*)
        `)
        .order('monthly_premium');

      if (selectedVehicleType !== 'all') {
        query = query.eq('vehicle_type', selectedVehicleType);
      }

      if (selectedCoverageType !== 'all') {
        query = query.eq('coverage_type', selectedCoverageType);
      }
      
      const { data, error } = await query;
      
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
      case 'commercial_truck':
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
    <div className="min-h-screen bg-background">
      <SEO 
        title="Best Truck & SUV Insurance - OffRoadGo"
        description="Find the best insurance rates for trucks, SUVs, and off-road vehicles. Compare quotes from top providers with comprehensive coverage options."
        keywords="truck insurance, SUV insurance, vehicle insurance, auto insurance quotes, off-road vehicle coverage"
        url="/insurance"
      />
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4 text-center">
          <Shield className="w-16 h-16 text-white mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Best Insurance for Your Ride
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            Protect your trucks and SUVs with comprehensive coverage from top-rated insurance providers. Compare rates and find the perfect policy.
          </p>
        </div>
      </section>

      {/* Ad Section 1 - After Hero */}
      <section className="py-4 md:py-6 bg-muted/5">
        <div className="container mx-auto px-4">
          <AdPlacement position="top" pageType="insurance" />
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 items-center justify-center">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">Filter by:</span>
            </div>
            
            <Select value={selectedVehicleType} onValueChange={setSelectedVehicleType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Vehicle Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Vehicles</SelectItem>
                <SelectItem value="truck">Trucks</SelectItem>
                <SelectItem value="SUV">SUVs</SelectItem>
                <SelectItem value="pickup">Pickup Trucks</SelectItem>
                <SelectItem value="commercial_truck">Commercial Trucks</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedCoverageType} onValueChange={setSelectedCoverageType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Coverage Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Coverage</SelectItem>
                <SelectItem value="liability">Liability Only</SelectItem>
                <SelectItem value="comprehensive">Comprehensive</SelectItem>
                <SelectItem value="collision">Collision</SelectItem>
                <SelectItem value="full">Full Coverage</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Insurance Quotes Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Compare Insurance Quotes</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Find the best insurance rates for your vehicle with our comprehensive comparison tool.
            </p>
          </div>

          {quotesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-muted rounded-lg h-80" />
                </div>
              ))}
            </div>
          ) : quotes && quotes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quotes.map((quote) => (
                <Card key={quote.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-border/30 hover:border-primary/40 bg-card/80 backdrop-blur-sm rounded-2xl overflow-hidden relative">
                  {quote.monthly_premium <= 100 && (
                    <div className="absolute -top-3 -right-3 z-10">
                      <Badge className="bg-green-500 text-white border-0">Best Value</Badge>
                    </div>
                  )}
                  
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      {quote.provider?.logo_url ? (
                        <OptimizedImage
                          src={quote.provider.logo_url} 
                          alt={quote.provider.name}
                          className="h-12 w-auto object-contain"
                          fallbackSrc="/placeholder.svg"
                          loading="lazy"
                          width={120}
                          height={48}
                        />
                      ) : (
                        <div className="flex items-center">
                          <Shield className="w-8 h-8 text-primary mr-2" />
                          <span className="font-bold text-lg">{quote.provider?.name}</span>
                        </div>
                      )}
                      
                      {quote.provider?.rating && (
                        <div className="flex items-center gap-1">
                          {getRatingStars(quote.provider.rating)}
                          <span className="text-sm text-muted-foreground ml-1">
                            ({quote.provider.rating})
                          </span>
                        </div>
                      )}
                    </div>

                    <CardTitle className="text-2xl flex items-center gap-2">
                      {getVehicleIcon(quote.vehicle_type)}
                      <span className="capitalize">{quote.vehicle_type.replace('_', ' ')}</span>
                    </CardTitle>
                    
                    <div className="flex items-center gap-2">
                      <Badge 
                        className={`${getCoverageColor(quote.coverage_type)} text-white border-0`}
                      >
                        {quote.coverage_type}
                      </Badge>
                      {quote.state_code && (
                        <Badge variant="outline">{quote.state_code}</Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      {/* Pricing */}
                      <div className="text-center p-4 bg-primary/5 rounded-lg">
                        <div className="text-3xl font-bold text-primary">
                          ${quote.monthly_premium}
                          <span className="text-lg font-normal text-muted-foreground">/month</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ${quote.annual_premium}/year
                        </div>
                      </div>

                      {/* Coverage Details */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Deductible:</span>
                          <span className="font-medium">${quote.deductible?.toLocaleString()}</span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Coverage Limit:</span>
                          <span className="font-medium">${quote.coverage_limit?.toLocaleString()}</span>
                        </div>

                        {quote.min_age && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Age Range:</span>
                            <span className="font-medium">
                              {quote.min_age}-{quote.max_age || '∞'}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Features */}
                      {quote.features && quote.features.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">Included Features:</h4>
                          <div className="space-y-1">
                            {quote.features.slice(0, 3).map((feature, index) => (
                              <div key={index} className="flex items-center text-sm">
                                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                <span className="capitalize">{feature.replace('_', ' ')}</span>
                              </div>
                            ))}
                            {quote.features.length > 3 && (
                              <div className="text-sm text-muted-foreground">
                                +{quote.features.length - 3} more features
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-4">
                        {quote.provider?.website_url && (
                          <Button variant="default" size="sm" asChild className="flex-1">
                            <a href={quote.provider.website_url} target="_blank" rel="noopener noreferrer">
                              Get Quote
                            </a>
                          </Button>
                        )}
                        
                        {quote.provider?.contact_phone && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={`tel:${quote.provider.contact_phone}`}>
                              <Phone className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Shield className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No quotes found</h3>
              <p className="text-muted-foreground">Try adjusting your filters to see more insurance options.</p>
            </div>
          )}
        </div>
      </section>

      {/* Top Providers Section */}
      {providers && providers.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Top Insurance Providers</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Trusted by millions of drivers worldwide for comprehensive vehicle protection.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {providers.slice(0, 6).map((provider) => (
                <Card key={provider.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 border-border/30 hover:border-primary/40 bg-card/80 backdrop-blur-sm rounded-2xl overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      {provider.logo_url ? (
                        <OptimizedImage
                          src={provider.logo_url} 
                          alt={provider.name}
                          className="h-12 w-auto object-contain"
                          fallbackSrc="/placeholder.svg"
                          loading="lazy"
                          width={120}
                          height={48}
                        />
                      ) : (
                        <CardTitle className="text-xl">{provider.name}</CardTitle>
                      )}
                      
                      {provider.rating && (
                        <div className="flex items-center gap-1">
                          {getRatingStars(provider.rating)}
                        </div>
                      )}
                    </div>
                    
                    <CardDescription className="line-clamp-2">
                      {provider.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3">
                      {provider.specializes_in && provider.specializes_in.length > 0 && (
                        <div>
                          <span className="text-sm font-medium">Specializes in:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {provider.specializes_in.map((specialty, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        {provider.website_url && (
                          <Button variant="outline" size="sm" asChild className="flex-1">
                            <a href={provider.website_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Visit Site
                            </a>
                          </Button>
                        )}
                        
                        {provider.contact_phone && (
                          <Button variant="outline" size="sm" asChild>
                            <a href={`tel:${provider.contact_phone}`}>
                              <Phone className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Ad Section 2 - Before Footer */}
      <section className="py-4 md:py-6 bg-muted/10">
        <div className="container mx-auto px-4">
          <AdPlacement position="bottom" pageType="insurance" />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Insurance;