import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Car, Search, Filter, Star, Fuel, Gauge, TrendingUp, Zap, Shield, Users, Calendar, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import Navigation from '@/components/Navigation';
import PageHero from '@/components/PageHero';
import { supabase } from '@/integrations/supabase/client';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';
import AdSenseAd from '@/components/AdSenseAd';
import OptimizedImage from '@/components/OptimizedImage';

import { resolveImageUrl } from '@/utils/imageResolver';
import AdPlacement from '@/components/AdPlacement';

interface Vehicle {
  id: string;
  name: string;
  brand: string;
  type: string;
  engine: string;
  clearance?: number;
  tire_size: string;
  image_url: string;
  year: number;
  price: number;
  mpg: number;
  towing_capacity: number;
  ground_clearance: number;
}

// Helper function to get vehicle image
const getVehicleImage = (brand: string, name: string, image_url?: string) => {
  if (image_url) {
    return resolveImageUrl(image_url);
  }
  
  return '/placeholder.svg';
};

// Remove the hardcoded vehicle data - now using database

const Vehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [brandFilter, setBrandFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const vehiclesPerPage = 8;

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const { data, error } = await supabase
          .from('vehicles')
          .select('*')
          .order('brand, name');
          
        if (error) {
          return;
        }
        
        if (data) {
          setVehicles(data);
          setFilteredVehicles(data);
        }
      } catch (error) {
        // Handle error silently in production
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

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

  // Pagination logic
  const totalPages = Math.ceil(filteredVehicles.length / vehiclesPerPage);
  const startIndex = (currentPage - 1) * vehiclesPerPage;
  const endIndex = startIndex + vehiclesPerPage;
  const currentVehicles = filteredVehicles.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, brandFilter, typeFilter]);

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="4x4 Off-Road Vehicles - Browse Premium SUVs & Trucks"
        description="Explore our extensive collection of 4x4 off-road vehicles. Compare specs, features, and find your perfect adventure companion from top brands like Ford, Jeep, Toyota, and more."
        keywords="4x4 vehicles, off-road SUV, pickup trucks, jeep wrangler, ford bronco, toyota 4runner, lifted trucks, AWD vehicles"
        url="/vehicles"
      />
      <Navigation />
      
      {/* Hero Section */}
      <PageHero
        title="4x4 Off-Road Vehicles"
        subtitle="Discover the perfect 4x4 vehicle for your next adventure. Compare specs, features, and find your ideal off-road companion built to conquer any terrain."
        icon={Car}
      />

        {/* Ad Section 1 - After Hero */}
        <section className="py-2 md:py-4 bg-muted/5">
          <div className="w-full overflow-hidden">
            <AdPlacement position="top" pageType="vehicles" />
          </div>
        </section>

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

        {/* Ad Section 2 - After Filters */}
        <section className="py-2 md:py-4 bg-muted/10">
          <div className="w-full overflow-hidden">
            <AdSenseAd 
              slot="8773228071"
              layout="in-article"
              className="w-full"
            />
          </div>
        </section>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredVehicles.length)} of {filteredVehicles.length} vehicles
          </p>
        </div>

        {/* Vehicle Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-56 bg-muted rounded-t-3xl" />
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded" />
                      <div className="h-3 bg-muted rounded w-5/6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentVehicles.map((vehicle) => {
              const vehicleImageUrl = getVehicleImage(vehicle.brand, vehicle.name, vehicle.image_url);
              return (
                <Card key={vehicle.id} className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 overflow-hidden bg-gradient-to-br from-card via-card/95 to-card/90 backdrop-blur-sm border-2 border-border/20 hover:border-primary/40 rounded-3xl relative">
                  {/* Enhanced Card Outline */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/0 via-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/5 group-hover:ring-primary/20 transition-all duration-500" />
                  
                  <div className="relative overflow-hidden rounded-t-3xl">
                    <OptimizedImage
                      src={vehicleImageUrl}
                      alt={vehicle.name}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                      fallbackSrc="/placeholder.svg"
                      loading="lazy"
                      width={400}
                      height={224}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Enhanced Badges */}
                    <div className="absolute top-4 left-4">
                      <Badge className={`text-white text-xs font-bold ${getDifficultyColor(vehicle.ground_clearance)} shadow-2xl ring-1 ring-white/20`}>
                        <Shield className="w-3 h-3 mr-1" />
                        {vehicle.ground_clearance}" Clearance
                      </Badge>
                    </div>
                    
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <Badge variant="secondary" className="bg-black/60 text-white border-white/30 backdrop-blur-md text-xs font-semibold shadow-lg">
                        <Calendar className="w-3 h-3 mr-1" />
                        {vehicle.year}
                      </Badge>
                    </div>
                    
                    <div className="absolute bottom-4 right-4">
                      <Badge className="bg-gradient-to-r from-primary to-accent text-white font-bold text-sm shadow-2xl border border-white/20">
                        {formatPrice(vehicle.price)}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-6 relative">
                    {/* Header Section */}
                    <div className="mb-5">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-xs font-bold text-primary uppercase tracking-wider">{vehicle.brand}</p>
                        <div className="flex-1 h-px bg-gradient-to-r from-primary/20 to-transparent" />
                      </div>
                      <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors duration-300">{vehicle.name}</h3>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mt-2">
                        <span className="flex items-center gap-1">
                          <Car className="w-3 h-3" />
                          {vehicle.type}
                        </span>
                        <span>•</span>
                        <span>{vehicle.year}</span>
                      </div>
                    </div>

                    {/* Enhanced Performance Section */}
                    <div className="mb-5 p-4 rounded-2xl bg-gradient-to-br from-primary/8 via-primary/5 to-accent/8 border border-primary/15 shadow-inner">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
                          <Gauge className="h-4 w-4 text-primary" />
                        </div>
                        <span className="text-sm font-bold text-primary">Performance</span>
                      </div>
                      <div className="grid grid-cols-1 gap-3 text-xs">
                        <div className="flex justify-between items-center p-2 rounded-lg bg-card/50">
                          <span className="text-muted-foreground font-medium">Engine:</span>
                          <span className="font-bold">{vehicle.engine}</span>
                        </div>
                        <div className="flex justify-between items-center p-2 rounded-lg bg-card/50">
                          <span className="text-muted-foreground font-medium">Type:</span>
                          <span className="font-bold">{vehicle.type}</span>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Key Specs Grid */}
                    <div className="grid grid-cols-2 gap-3 text-xs mb-5">
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-br from-muted/60 to-muted/40 hover:from-muted/80 hover:to-muted/60 transition-all duration-300 border border-border/50">
                        <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
                          <Fuel className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <div>
                          <p className="text-muted-foreground font-medium">MPG</p>
                          <p className="font-bold text-foreground">{vehicle.mpg}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-br from-muted/60 to-muted/40 hover:from-muted/80 hover:to-muted/60 transition-all duration-300 border border-border/50">
                        <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
                          <TrendingUp className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <div>
                          <p className="text-muted-foreground font-medium">Towing</p>
                          <p className="font-bold text-foreground">{(vehicle.towing_capacity / 1000).toFixed(1)}K lbs</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-br from-muted/60 to-muted/40 hover:from-muted/80 hover:to-muted/60 transition-all duration-300 border border-border/50">
                        <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
                          <Shield className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <div>
                          <p className="text-muted-foreground font-medium">Clearance</p>
                          <p className="font-bold text-foreground">{vehicle.ground_clearance}"</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-br from-muted/60 to-muted/40 hover:from-muted/80 hover:to-muted/60 transition-all duration-300 border border-border/50">
                        <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
                          <Zap className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <div>
                          <p className="text-muted-foreground font-medium">Tires</p>
                          <p className="font-bold text-foreground text-xs">{vehicle.tire_size}</p>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Action Buttons */}
                    <div className="flex gap-3">
                      <Button asChild variant="outline" size="sm" className="flex-1 group-hover:border-primary/60 group-hover:bg-primary/5 text-xs h-10 rounded-xl font-semibold transition-all duration-300">
                        <Link to={`/vehicle/${vehicle.id}`}>
                          View Details
                        </Link>
                      </Button>
                      <Button asChild size="sm" className="flex-1 text-xs h-10 rounded-xl font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300">
                        <Link to={`/compare?vehicles=${vehicle.id}`}>
                          Compare
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {filteredVehicles.length > vehiclesPerPage && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              size="sm"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  onClick={() => handlePageChange(page)}
                  size="sm"
                  className={`min-w-10 ${currentPage === page ? 'bg-primary text-primary-foreground' : ''}`}
                >
                  {page}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              size="sm"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}

        {filteredVehicles.length === 0 && (
          <div className="text-center py-12">
            <Car className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No vehicles found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}

        {/* Ad Section 3 - After Vehicle Grid */}
        <section className="py-2 md:py-4 bg-muted/5 mb-8">
          <div className="w-full overflow-hidden">
            <AdSenseAd 
              slot="8773228071"
              layout="in-article"
              className="w-full"
            />
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Vehicles;