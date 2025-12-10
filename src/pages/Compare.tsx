import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Scale, Plus, X, Fuel, Mountain, DollarSign, Gauge, Users, Truck, Zap, Clock, Shield } from 'lucide-react';
import Navigation from '@/components/Navigation';
import PageHero from '@/components/PageHero';
import SEOHead from '@/components/SEOHead';

interface Vehicle {
  id: string;
  name: string;
  brand: string;
  year: number | null;
  price: number | null;
  towing_capacity: number | null;
  ground_clearance: number | null;
  approach_angle: number | null;
  departure_angle: number | null;
  breakover_angle: number | null;
  engine: string | null;
  image_url: string | null;
  drivetrain: string | null;
  transmission: string | null;
  horsepower: number | null;
  torque: number | null;
  fuel_economy: string | null;
  payload_capacity: number | null;
  description: string | null;
}

const Compare = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicles, setSelectedVehicles] = useState<Vehicle[]>([]);
  const [availableVehicles, setAvailableVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('brand', { ascending: true });

      if (error) throw error;
      setVehicles(data || []);
      setAvailableVehicles(data || []);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const addVehicleToCompare = (vehicleId: string) => {
    if (selectedVehicles.length >= 4) return;
    
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (vehicle && !selectedVehicles.find(v => v.id === vehicleId)) {
      setSelectedVehicles([...selectedVehicles, vehicle]);
      setAvailableVehicles(availableVehicles.filter(v => v.id !== vehicleId));
    }
  };

  const removeVehicleFromCompare = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (vehicle) {
      setSelectedVehicles(selectedVehicles.filter(v => v.id !== vehicleId));
      setAvailableVehicles([...availableVehicles, vehicle]);
    }
  };

  const formatPrice = (price: number | null) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-20">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded mb-4" />
            <div className="h-64 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Compare 4x4 Vehicles Side by Side - OffRoadGo"
        description="Compare up to 4 off-road vehicles side by side. Compare specs, pricing, towing capacity, ground clearance, and more."
        keywords="compare 4x4 vehicles, vehicle comparison, off-road specs"
        url="/compare"
        type="website"
      />
      <Navigation />
      
      <PageHero
        title="Compare 4x4 Vehicles"
        subtitle="Compare up to 4 off-road vehicles side by side."
        icon={Scale}
      />

      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add Vehicles to Compare
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Select onValueChange={addVehicleToCompare}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a vehicle to compare" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableVehicles.map(vehicle => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.year} {vehicle.brand} {vehicle.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="text-sm text-muted-foreground">
                {selectedVehicles.length}/4 vehicles selected
              </div>
            </div>
          </CardContent>
        </Card>

        {selectedVehicles.length > 0 ? (
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 font-medium">Specification</th>
                      {selectedVehicles.map(vehicle => (
                        <th key={vehicle.id} className="text-center p-4 min-w-[250px]">
                          <div className="space-y-2 relative">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeVehicleFromCompare(vehicle.id)}
                              className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 z-10"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                            <img
                              src={vehicle.image_url || '/placeholder.svg'}
                              alt={`${vehicle.brand} ${vehicle.name}`}
                              className="w-full h-32 object-cover rounded-lg mb-2"
                            />
                            <div>
                              <h3 className="font-semibold">{vehicle.year} {vehicle.brand}</h3>
                              <p className="text-sm text-muted-foreground">{vehicle.name}</p>
                            </div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="p-4 font-medium flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Price
                      </td>
                      {selectedVehicles.map(vehicle => (
                        <td key={vehicle.id} className="text-center p-4 font-semibold">
                          {formatPrice(vehicle.price)}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-4 font-medium flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        Horsepower
                      </td>
                      {selectedVehicles.map(vehicle => (
                        <td key={vehicle.id} className="text-center p-4 font-semibold">
                          {vehicle.horsepower || 'N/A'} hp
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-4 font-medium flex items-center gap-2">
                        <Gauge className="h-4 w-4" />
                        Torque
                      </td>
                      {selectedVehicles.map(vehicle => (
                        <td key={vehicle.id} className="text-center p-4 font-semibold">
                          {vehicle.torque || 'N/A'} lb-ft
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-4 font-medium flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        Towing Capacity
                      </td>
                      {selectedVehicles.map(vehicle => (
                        <td key={vehicle.id} className="text-center p-4 font-semibold">
                          {vehicle.towing_capacity?.toLocaleString() || 'N/A'} lbs
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-4 font-medium flex items-center gap-2">
                        <Mountain className="h-4 w-4" />
                        Ground Clearance
                      </td>
                      {selectedVehicles.map(vehicle => (
                        <td key={vehicle.id} className="text-center p-4 font-semibold">
                          {vehicle.ground_clearance || 'N/A'}"
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="p-12 text-center">
            <Scale className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No vehicles selected</h3>
            <p className="text-muted-foreground">Select vehicles above to compare them side by side.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Compare;
