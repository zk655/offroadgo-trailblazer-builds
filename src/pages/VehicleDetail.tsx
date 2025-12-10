import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Car, Gauge, Fuel, TrendingUp, Users, Calendar, Award, Cog, Zap, Shield, Mountain, Wrench, Info, Star, Heart, Share2, Download } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import AdPlacement from '@/components/AdPlacement';
import SEOHead from '@/components/SEOHead';
import { supabase } from '@/integrations/supabase/client';

interface Vehicle {
  id: string;
  name: string;
  brand: string;
  engine: string | null;
  image_url: string | null;
  year: number | null;
  price: number | null;
  fuel_economy: string | null;
  towing_capacity: number | null;
  ground_clearance: number | null;
  drivetrain: string | null;
  description: string | null;
}

const VehicleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicle = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('vehicles')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) {
          return;
        }
        
        if (data) {
          setVehicle(data);
        }
      } catch (error) {
        // Handle error silently in production
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-20">
          <div className="animate-pulse">
            <div className="h-64 bg-muted rounded-lg mb-8" />
            <div className="h-8 bg-muted rounded w-1/2 mb-4" />
            <div className="h-4 bg-muted rounded w-1/3 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-24 bg-muted rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-20 text-center">
          <Car className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Vehicle not found</h1>
          <p className="text-muted-foreground mb-8">The vehicle you're looking for doesn't exist.</p>
          <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
            <Link to="/vehicles">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Vehicles
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const vehicleImageUrl = vehicle.image_url || '/placeholder.svg';

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title={`${vehicle.year} ${vehicle.brand} ${vehicle.name} - Detailed Review`}
        description={`Complete review of the ${vehicle.year} ${vehicle.brand} ${vehicle.name}. Engine: ${vehicle.engine}, Ground clearance: ${vehicle.ground_clearance}", Towing: ${vehicle.towing_capacity?.toLocaleString()} lbs.`}
        keywords={`${vehicle.brand}, ${vehicle.name}, ${vehicle.year}, 4x4 vehicle, off-road, review, specs`}
        url={`/vehicle/${vehicle.id}`}
        type="article"
        image={vehicleImageUrl}
      />
      <Navigation />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <Button asChild variant="ghost" size="sm">
              <Link to="/vehicles">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Vehicles
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start lg:items-center">
            {/* Vehicle Info */}
            <div className="space-y-6">
              <div>
                <Badge variant="secondary" className="mb-3 bg-primary/10 text-primary border-primary/20">
                  {vehicle.brand} • {vehicle.year}
                </Badge>
                <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {vehicle.name}
                </h1>
                <p className="text-xl text-muted-foreground mb-6">
                  Starting at <span className="font-bold text-2xl text-foreground">${vehicle.price?.toLocaleString()}</span>
                </p>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-colors">
                  <Fuel className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium text-muted-foreground">Economy</p>
                  <p className="text-lg font-bold">{vehicle.fuel_economy || 'N/A'}</p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-colors">
                  <Mountain className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium text-muted-foreground">Clearance</p>
                  <p className="text-lg font-bold">{vehicle.ground_clearance}"</p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-colors">
                  <Wrench className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium text-muted-foreground">Towing</p>
                  <p className="text-lg font-bold">{vehicle.towing_capacity?.toLocaleString()}</p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-colors">
                  <Cog className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium text-muted-foreground">Drivetrain</p>
                  <p className="text-lg font-bold">{vehicle.drivetrain || 'N/A'}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button size="lg" className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                  <Download className="mr-2 h-4 w-4" />
                  Download Specs
                </Button>
                <Button variant="outline" size="lg" className="flex-1">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Button variant="outline" size="lg">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Vehicle Image Display */}
            <div className="relative">
              <Card className="relative overflow-hidden rounded-3xl border-border/30 shadow-2xl bg-gradient-to-br from-slate-900/50 to-slate-800/30 backdrop-blur-sm">
                <div className="relative h-[500px] overflow-hidden">
                  <img
                    src={vehicleImageUrl}
                    alt={vehicle.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  
                  {/* Image Info Overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-background/90 backdrop-blur-sm rounded-lg p-3 border border-border/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-sm text-foreground">{vehicle.name}</p>
                          <p className="text-xs text-muted-foreground">High-Quality Vehicle Image</p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                            <Car className="w-3 h-3 mr-1" />
                            {vehicle.year}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Information */}
      <div className="container mx-auto px-4 py-16">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Info className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="safety" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Safety
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cog className="w-5 h-5 text-primary" />
                    Engine & Drivetrain
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Engine</span>
                    <span className="font-semibold">{vehicle.engine}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Drivetrain</span>
                    <span className="font-semibold">{vehicle.drivetrain || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Year</span>
                    <span className="font-semibold">{vehicle.year}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Fuel className="w-5 h-5 text-primary" />
                    Fuel & Efficiency
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fuel Economy</span>
                    <span className="font-semibold">{vehicle.fuel_economy || 'N/A'}</span>
                  </div>
                  {vehicle.engine && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Engine</span>
                      <span className="font-semibold">{vehicle.engine}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mountain className="w-5 h-5 text-primary" />
                  Off-Road Capabilities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-2xl font-bold text-primary">{vehicle.ground_clearance}"</span>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">Ground Clearance</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">{vehicle.towing_capacity?.toLocaleString()}</span>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">Towing (lbs)</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">{vehicle.drivetrain || 'N/A'}</span>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">Drivetrain</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                      <Star className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">Trail Rated</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>Engine Power</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary mb-2">{vehicle.engine}</div>
                  <p className="text-muted-foreground">High-performance engine designed for both on-road and off-road adventures</p>
                </CardContent>
              </Card>
              
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>Fuel Economy</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary mb-2">{vehicle.fuel_economy || 'N/A'}</div>
                  <p className="text-muted-foreground">Combined city/highway fuel efficiency rating</p>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>Towing Capacity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary mb-2">{vehicle.towing_capacity?.toLocaleString()} lbs</div>
                  <p className="text-muted-foreground">Maximum towing capacity when properly equipped</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="safety" className="space-y-6">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Safety Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Star className="w-5 h-5 text-primary" />
                    <span>Advanced airbag system</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Star className="w-5 h-5 text-primary" />
                    <span>Anti-lock braking system</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Star className="w-5 h-5 text-primary" />
                    <span>Electronic stability control</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Star className="w-5 h-5 text-primary" />
                    <span>Traction control system</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Vehicle Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary mb-4">{vehicle.brand} {vehicle.name}</div>
                <p className="text-muted-foreground">{vehicle.description || 'High-quality vehicle built for adventure and reliability'}</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Ad Section - After Content */}
      <AdPlacement 
        position="bottom" 
        pageType="vehicles"
        className="py-6 bg-muted/5"
      />

      <Footer />
    </div>
  );
};

export default VehicleDetail;