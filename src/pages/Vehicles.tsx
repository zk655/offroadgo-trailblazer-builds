import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Car, Search, Filter, Star, Fuel, Gauge, TrendingUp, Zap, Shield } from 'lucide-react';
import Navigation from '@/components/Navigation';
import PageHero from '@/components/PageHero';

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

const Vehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [brandFilter, setBrandFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    filterVehicles();
  }, [vehicles, searchTerm, brandFilter, typeFilter]);

  const fetchVehicles = async () => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .in('type', ['SUV', 'Truck', 'Pickup']) // Only 4x4 vehicles
        .gte('ground_clearance', 8.0) // Minimum ground clearance for off-road
        .order('brand', { ascending: true });

      if (error) throw error;
      setVehicles(data || []);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterVehicles = () => {
    let filtered = vehicles;

    if (searchTerm) {
      filtered = filtered.filter(vehicle =>
        vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (brandFilter !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.brand === brandFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.type === typeFilter);
    }

    setFilteredVehicles(filtered);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getDifficultyColor = (clearance: number) => {
    if (clearance >= 11) return 'bg-red-500';
    if (clearance >= 9) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const uniqueBrands = [...new Set(vehicles.map(v => v.brand))];
  const uniqueTypes = [...new Set(vehicles.map(v => v.type))];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-muted rounded-t-lg" />
                <CardContent className="p-4">
                  <div className="h-4 bg-muted rounded mb-2" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <PageHero
        title="4x4 Off-Road Vehicles"
        subtitle="Discover the perfect 4x4 vehicle for your next adventure. Compare specs, features, and find your ideal off-road companion built to conquer any terrain."
        icon={Car}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 bg-card p-6 rounded-lg shadow-card">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search vehicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={brandFilter} onValueChange={setBrandFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              {uniqueBrands.map(brand => (
                <SelectItem key={brand} value={brand}>{brand}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {uniqueTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredVehicles.length} of {vehicles.length} vehicles
          </p>
        </div>

        {/* Vehicle Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVehicles.map((vehicle) => (
            <Card key={vehicle.id} className="group hover:shadow-xl transition-smooth hover:-translate-y-1 overflow-hidden bg-card/80 backdrop-blur-sm border hover:border-primary/30">
              <div className="relative">
                <img
                  src={vehicle.image_url}
                  alt={vehicle.name}
                  className="w-full h-44 object-cover group-hover:scale-105 transition-smooth"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
                <div className="absolute top-3 left-3">
                  <Badge className={`text-white text-xs ${getDifficultyColor(vehicle.ground_clearance)} font-medium`}>
                    {vehicle.ground_clearance}" clearance
                  </Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <Badge variant="secondary" className="bg-black/30 text-white border-white/20 backdrop-blur-sm text-xs">
                    {vehicle.year}
                  </Badge>
                </div>
                <div className="absolute bottom-3 right-3">
                  <Badge className="bg-primary text-white font-bold text-xs">
                    {formatPrice(vehicle.price)}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="mb-3">
                  <p className="text-xs font-medium text-primary uppercase tracking-wide">{vehicle.brand}</p>
                  <h3 className="text-lg font-bold leading-tight mt-1 mb-1">{vehicle.name}</h3>
                  <p className="text-xs text-muted-foreground">{vehicle.type}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div className="flex items-center gap-1.5 p-2 rounded-md bg-muted/40">
                    <Gauge className="h-3 w-3 text-primary flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-muted-foreground text-xs">Engine</p>
                      <p className="font-medium text-xs truncate">{vehicle.engine}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1.5 p-2 rounded-md bg-muted/40">
                    <Fuel className="h-3 w-3 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-muted-foreground text-xs">MPG</p>
                      <p className="font-medium text-xs">{vehicle.mpg}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1.5 p-2 rounded-md bg-muted/40">
                    <TrendingUp className="h-3 w-3 text-primary flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-muted-foreground text-xs">Towing</p>
                      <p className="font-medium text-xs">{(vehicle.towing_capacity / 1000).toFixed(1)}K lbs</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 p-2 rounded-md bg-muted/40">
                    <Zap className="h-3 w-3 text-primary flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-muted-foreground text-xs">Tires</p>
                      <p className="font-medium text-xs truncate">{vehicle.tire_size}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center p-2 rounded-md bg-primary/5 border border-primary/10 mb-3">
                  <div className="text-center flex-1">
                    <p className="text-muted-foreground text-xs">Approach</p>
                    <p className="font-bold text-primary text-sm">{vehicle.approach_angle}°</p>
                  </div>
                  <div className="w-px h-8 bg-border mx-2"></div>
                  <div className="text-center flex-1">
                    <p className="text-muted-foreground text-xs">Departure</p>
                    <p className="font-bold text-primary text-sm">{vehicle.departure_angle}°</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm" className="flex-1 group-hover:border-primary text-xs h-8">
                    <Link to={`/vehicle/${vehicle.id}`}>
                      Details
                    </Link>
                  </Button>
                  <Button asChild size="sm" className="flex-1 text-xs h-8">
                    <Link to={`/compare?vehicles=${vehicle.id}`}>
                      Compare
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredVehicles.length === 0 && (
          <div className="text-center py-12">
            <Car className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No vehicles found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Vehicles;