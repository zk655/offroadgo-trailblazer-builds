import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Car, Gauge, Fuel, TrendingUp, Download, Share2, Heart, Plus } from 'lucide-react';
import Navigation from '@/components/Navigation';

interface Vehicle {
  id: string;
  name: string;
  brand: string;
  type: string;
  engine: string;
  clearance: number;
  tire_size: string;
  image_url: string;
  year: number;
  price: number;
  mpg: number;
  towing_capacity: number;
  ground_clearance: number;
  approach_angle: number;
  departure_angle: number;
}

const VehicleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchVehicle();
    }
  }, [id]);

  const fetchVehicle = async () => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setVehicle(data);
    } catch (error) {
      console.error('Error fetching vehicle:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getDifficultyLevel = (clearance: number) => {
    if (clearance >= 11) return { level: 'Expert', color: 'bg-red-500' };
    if (clearance >= 9) return { level: 'Intermediate', color: 'bg-orange-500' };
    return { level: 'Beginner', color: 'bg-green-500' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-20">
          <div className="animate-pulse">
            <div className="h-64 md:h-96 bg-muted rounded-lg mb-8" />
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
          <Button asChild>
            <Link to="/vehicles">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Vehicles
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const difficulty = getDifficultyLevel(vehicle.ground_clearance);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-20 pb-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/vehicles">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Vehicles
          </Link>
        </Button>

        {/* Vehicle Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Image */}
          <div className="relative">
            <div className="aspect-video rounded-lg overflow-hidden bg-muted">
              {imageLoading && (
                <div className="absolute inset-0 bg-muted animate-pulse rounded-lg" />
              )}
              <img
                src={vehicle.image_url}
                alt={vehicle.name}
                className="w-full h-full object-cover"
                onLoad={() => setImageLoading(false)}
              />
            </div>
            <div className="absolute top-4 left-4">
              <Badge className={`text-white ${difficulty.color}`}>
                {difficulty.level}
              </Badge>
            </div>
            <div className="absolute top-4 right-4">
              <Badge variant="secondary" className="bg-white/90 text-black">
                {vehicle.year}
              </Badge>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <p className="text-lg text-muted-foreground">{vehicle.brand}</p>
              <h1 className="text-4xl font-bold mb-2">{vehicle.name}</h1>
              <p className="text-3xl font-bold text-primary">{formatPrice(vehicle.price)}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{vehicle.type}</Badge>
              <Badge variant="outline">{vehicle.engine}</Badge>
              <Badge variant="outline">{vehicle.tire_size} Tires</Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Fuel className="mx-auto h-6 w-6 text-primary mb-2" />
                  <p className="text-2xl font-bold">{vehicle.mpg}</p>
                  <p className="text-sm text-muted-foreground">MPG</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <TrendingUp className="mx-auto h-6 w-6 text-primary mb-2" />
                  <p className="text-2xl font-bold">{vehicle.towing_capacity?.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Towing (lbs)</p>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1">
                <Plus className="mr-2 h-4 w-4" />
                Add to Build
              </Button>
              <Button variant="outline">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="outline">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Detailed Specs */}
        <Tabs defaultValue="specs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="specs">Specifications</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="compare">Compare</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="specs" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Gauge className="mr-2 h-5 w-5" />
                    Engine & Power
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Engine</span>
                    <span className="font-medium">{vehicle.engine}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fuel Economy</span>
                    <span className="font-medium">{vehicle.mpg} MPG</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Towing Capacity</span>
                    <span className="font-medium">{vehicle.towing_capacity?.toLocaleString()} lbs</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Car className="mr-2 h-5 w-5" />
                    Off-Road Capability
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ground Clearance</span>
                    <span className="font-medium">{vehicle.ground_clearance}"</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Approach Angle</span>
                    <span className="font-medium">{vehicle.approach_angle}°</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Departure Angle</span>
                    <span className="font-medium">{vehicle.departure_angle}°</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tire Size</span>
                    <span className="font-medium">{vehicle.tire_size}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>General Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Year</span>
                    <span className="font-medium">{vehicle.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span className="font-medium">{vehicle.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Brand</span>
                    <span className="font-medium">{vehicle.brand}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">MSRP</span>
                    <span className="font-medium">{formatPrice(vehicle.price)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center pt-6">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Download Spec Sheet (PDF)
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Detailed performance data and charts will be available soon.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compare" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Comparison</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground mb-4">
                  Compare this vehicle with others to make the best choice for your needs.
                </p>
                <Button asChild>
                  <Link to={`/compare?vehicles=${vehicle.id}`}>
                    Start Comparison
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Customer reviews and ratings will be available soon.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default VehicleDetail;