import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Car, Search, Filter, Star, Fuel, Gauge, TrendingUp, Zap, Shield, Users, Calendar, Award } from 'lucide-react';
import Navigation from '@/components/Navigation';
import PageHero from '@/components/PageHero';

// Import vehicle images
import fordBroncoRaptor from '@/assets/vehicles/ford-bronco-wildtrak.jpg';
import fordF150Raptor from '@/assets/vehicles/ford-bronco-wildtrak.jpg';
import ramTrx from '@/assets/vehicles/ram-1500-trx.jpg';
import jeepWrangler from '@/assets/vehicles/jeep-wrangler-rubicon.jpg';
import toyota4Runner from '@/assets/vehicles/toyota-4runner-trd-pro.jpg';
import chevyColorado from '@/assets/vehicles/chevy-colorado-zr2.jpg';
import gmcSierra from '@/assets/vehicles/gmc-sierra-at4x.jpg';
import nissanFrontier from '@/assets/vehicles/nissan-frontier-pro4x.jpg';
import subaruOutback from '@/assets/vehicles/subaru-outback-wilderness.jpg';

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
  seating_capacity: number;
  drivetrain: string;
  transmission: string;
  fuel_tank: number;
  warranty: string;
  safety_rating: number;
}

// Hardcoded 4x4 vehicle data with proper images
const vehicleData: Vehicle[] = [
  {
    id: '1',
    name: 'Bronco Raptor',
    brand: 'Ford',
    type: 'SUV',
    engine: '3.0L V6 Twin-Turbo',
    clearance: 13.1,
    tire_size: '37x12.50R17',
    image_url: fordBroncoRaptor,
    year: 2024,
    price: 69995,
    mpg: 15,
    towing_capacity: 4500,
    ground_clearance: 13.1,
    seating_capacity: 4,
    drivetrain: '4WD',
    transmission: '10-Speed Automatic',
    fuel_tank: 23.8,
    warranty: '3yr/36k Basic',
    safety_rating: 4
  },
  {
    id: '2',
    name: 'F-150 Raptor',
    brand: 'Ford',
    type: 'Truck',
    engine: '3.5L V6 Twin-Turbo',
    clearance: 13.0,
    tire_size: '35x12.50R17',
    image_url: fordF150Raptor,
    year: 2024,
    price: 78205,
    mpg: 15,
    towing_capacity: 8200,
    ground_clearance: 13.0,
    seating_capacity: 5,
    drivetrain: '4WD',
    transmission: '10-Speed Automatic',
    fuel_tank: 36.0,
    warranty: '3yr/36k Basic',
    safety_rating: 5
  },
  {
    id: '3',
    name: '1500 TRX',
    brand: 'Ram',
    type: 'Truck',
    engine: '6.2L Supercharged HEMI V8',
    clearance: 11.8,
    tire_size: '35x11.50R18',
    image_url: ramTrx,
    year: 2024,
    price: 98335,
    mpg: 12,
    towing_capacity: 8100,
    ground_clearance: 11.8,
    seating_capacity: 5,
    drivetrain: '4WD',
    transmission: '8-Speed Automatic',
    fuel_tank: 33.0,
    warranty: '3yr/36k Basic',
    safety_rating: 4
  },
  {
    id: '4',
    name: 'Wrangler Rubicon',
    brand: 'Jeep',
    type: 'SUV',
    engine: '3.6L V6',
    clearance: 10.8,
    tire_size: '33x12.50R17',
    image_url: jeepWrangler,
    year: 2024,
    price: 48995,
    mpg: 18,
    towing_capacity: 3500,
    ground_clearance: 10.8,
    seating_capacity: 4,
    drivetrain: '4WD',
    transmission: '8-Speed Automatic',
    fuel_tank: 22.5,
    warranty: '3yr/36k Basic',
    safety_rating: 3
  },
  {
    id: '5',
    name: '4Runner TRD Pro',
    brand: 'Toyota',
    type: 'SUV',
    engine: '4.0L V6',
    clearance: 9.6,
    tire_size: '33x11.50R17',
    image_url: toyota4Runner,
    year: 2024,
    price: 54520,
    mpg: 17,
    towing_capacity: 5000,
    ground_clearance: 9.6,
    seating_capacity: 5,
    drivetrain: '4WD',
    transmission: '5-Speed Automatic',
    fuel_tank: 23.0,
    warranty: '3yr/36k Basic',
    safety_rating: 4
  },
  {
    id: '6',
    name: 'Colorado ZR2',
    brand: 'Chevrolet',
    type: 'Truck',
    engine: '2.7L Turbo I-4',
    clearance: 10.7,
    tire_size: '33x10.50R17',
    image_url: chevyColorado,
    year: 2024,
    price: 48195,
    mpg: 19,
    towing_capacity: 7700,
    ground_clearance: 10.7,
    seating_capacity: 5,
    drivetrain: '4WD',
    transmission: '8-Speed Automatic',
    fuel_tank: 21.0,
    warranty: '3yr/36k Basic',
    safety_rating: 4
  },
  {
    id: '7',
    name: 'Sierra AT4X',
    brand: 'GMC',
    type: 'Truck',
    engine: '6.2L V8',
    clearance: 11.2,
    tire_size: '33x12.50R18',
    image_url: gmcSierra,
    year: 2024,
    price: 75395,
    mpg: 16,
    towing_capacity: 9500,
    ground_clearance: 11.2,
    seating_capacity: 5,
    drivetrain: '4WD',
    transmission: '10-Speed Automatic',
    fuel_tank: 24.0,
    warranty: '3yr/36k Basic',
    safety_rating: 5
  },
  {
    id: '8',
    name: 'Frontier Pro-4X',
    brand: 'Nissan',
    type: 'Truck',
    engine: '3.8L V6',
    clearance: 10.5,
    tire_size: '32x11.50R17',
    image_url: nissanFrontier,
    year: 2024,
    price: 39990,
    mpg: 18,
    towing_capacity: 6720,
    ground_clearance: 10.5,
    seating_capacity: 5,
    drivetrain: '4WD',
    transmission: '9-Speed Automatic',
    fuel_tank: 21.1,
    warranty: '3yr/36k Basic',
    safety_rating: 4
  },
  {
    id: '9',
    name: 'Outback Wilderness',
    brand: 'Subaru',
    type: 'SUV',
    engine: '2.4L Turbo H4',
    clearance: 9.5,
    tire_size: '32x11.50R17',
    image_url: subaruOutback,
    year: 2024,
    price: 38395,
    mpg: 24,
    towing_capacity: 3500,
    ground_clearance: 9.5,
    seating_capacity: 5,
    drivetrain: 'AWD',
    transmission: 'CVT',
    fuel_tank: 19.3,
    warranty: '3yr/36k Basic',
    safety_rating: 5
  }
];

const Vehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(vehicleData);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>(vehicleData);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [brandFilter, setBrandFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    filterVehicles();
  }, [vehicles, searchTerm, brandFilter, typeFilter]);

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
            <Card key={vehicle.id} className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm border-0 hover:border hover:border-primary/30 rounded-2xl">
              <div className="relative overflow-hidden rounded-t-2xl">
                <img
                  src={vehicle.image_url}
                  alt={vehicle.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="absolute top-3 left-3">
                  <Badge className={`text-white text-xs font-semibold ${getDifficultyColor(vehicle.ground_clearance)} shadow-lg`}>
                    {vehicle.ground_clearance}" Ground Clearance
                  </Badge>
                </div>
                
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                  <Badge variant="secondary" className="bg-black/50 text-white border-white/20 backdrop-blur-sm text-xs font-medium">
                    {vehicle.year}
                  </Badge>
                  <div className="flex items-center gap-1">
                    {[...Array(vehicle.safety_rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                
                <div className="absolute bottom-3 right-3">
                  <Badge className="bg-primary text-white font-bold text-sm shadow-lg">
                    {formatPrice(vehicle.price)}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-5">
                <div className="mb-4">
                  <p className="text-xs font-bold text-primary uppercase tracking-wider">{vehicle.brand}</p>
                  <h3 className="text-xl font-bold leading-tight mt-1 mb-2 group-hover:text-primary transition-colors">{vehicle.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{vehicle.type}</span>
                    <span>•</span>
                    <span>{vehicle.drivetrain}</span>
                  </div>
                </div>

                {/* Engine & Performance */}
                <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Gauge className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold">Performance</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-muted-foreground">Engine</p>
                      <p className="font-medium">{vehicle.engine}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Transmission</p>
                      <p className="font-medium">{vehicle.transmission}</p>
                    </div>
                  </div>
                </div>

                {/* Key Specs Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors">
                    <Fuel className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-muted-foreground">MPG</p>
                      <p className="font-bold">{vehicle.mpg}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors">
                    <TrendingUp className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-muted-foreground">Towing</p>
                      <p className="font-bold">{(vehicle.towing_capacity / 1000).toFixed(1)}K lbs</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors">
                    <Users className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-muted-foreground">Seating</p>
                      <p className="font-bold">{vehicle.seating_capacity}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors">
                    <Zap className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-muted-foreground">Tires</p>
                      <p className="font-bold text-xs">{vehicle.tire_size}</p>
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-muted-foreground">Fuel Tank:</span>
                    <span className="font-medium">{vehicle.fuel_tank} gal</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-muted-foreground">Warranty:</span>
                    <span className="font-medium">{vehicle.warranty}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button asChild variant="outline" size="sm" className="flex-1 group-hover:border-primary text-xs h-9 rounded-lg">
                    <Link to={`/vehicle/${vehicle.id}`}>
                      View Details
                    </Link>
                  </Button>
                  <Button asChild size="sm" className="flex-1 text-xs h-9 rounded-lg">
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