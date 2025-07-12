import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Scale, Plus, X, Car, Fuel, Mountain, DollarSign } from 'lucide-react';
import Navigation from '@/components/Navigation';

interface Vehicle {
  id: string;
  name: string;
  brand: string;
  type: string;
  year: number;
  price: number;
  mpg: number;
  towing_capacity: number;
  ground_clearance: number;
  approach_angle: number;
  departure_angle: number;
  engine: string;
  tire_size: string;
  image_url: string;
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getComparisonValue = (vehicle: Vehicle, key: keyof Vehicle) => {
    const value = vehicle[key];
    if (typeof value === 'number') {
      return value;
    }
    return value || 'N/A';
  };

  const getBestInCategory = (key: keyof Vehicle, higher = true) => {
    if (selectedVehicles.length === 0) return null;
    
    const values = selectedVehicles
      .map(v => ({ id: v.id, value: v[key] as number }))
      .filter(v => typeof v.value === 'number');
    
    if (values.length === 0) return null;
    
    const best = higher 
      ? values.reduce((prev, current) => prev.value > current.value ? prev : current)
      : values.reduce((prev, current) => prev.value < current.value ? prev : current);
    
    return best.id;
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
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-hero text-white py-20 mt-16">
        <div className="container mx-auto px-4 text-center">
          <Scale className="mx-auto mb-4 h-16 w-16" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Compare Vehicles
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
            Compare up to 4 off-road vehicles side by side to find the perfect match for your adventure.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Vehicle Selector */}
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

        {/* Comparison Table */}
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
                          <div className="space-y-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeVehicleFromCompare(vehicle.id)}
                              className="absolute top-2 right-2"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <img
                              src={vehicle.image_url}
                              alt={`${vehicle.brand} ${vehicle.name}`}
                              className="w-full h-32 object-cover rounded-lg mb-2"
                            />
                            <div>
                              <h3 className="font-semibold">{vehicle.year} {vehicle.brand}</h3>
                              <p className="text-sm text-muted-foreground">{vehicle.name}</p>
                              <Badge variant="outline" className="mt-1">{vehicle.type}</Badge>
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
                        <td key={vehicle.id} className="text-center p-4">
                          <span className={`font-semibold ${
                            getBestInCategory('price', false) === vehicle.id ? 'text-primary' : ''
                          }`}>
                            {formatPrice(vehicle.price)}
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-4 font-medium flex items-center gap-2">
                        <Fuel className="h-4 w-4" />
                        MPG
                      </td>
                      {selectedVehicles.map(vehicle => (
                        <td key={vehicle.id} className="text-center p-4">
                          <span className={`font-semibold ${
                            getBestInCategory('mpg', true) === vehicle.id ? 'text-primary' : ''
                          }`}>
                            {getComparisonValue(vehicle, 'mpg')}
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-4 font-medium">Towing Capacity (lbs)</td>
                      {selectedVehicles.map(vehicle => (
                        <td key={vehicle.id} className="text-center p-4">
                          <span className={`font-semibold ${
                            getBestInCategory('towing_capacity', true) === vehicle.id ? 'text-primary' : ''
                          }`}>
                            {getComparisonValue(vehicle, 'towing_capacity')?.toLocaleString() || 'N/A'}
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-4 font-medium flex items-center gap-2">
                        <Mountain className="h-4 w-4" />
                        Ground Clearance (in)
                      </td>
                      {selectedVehicles.map(vehicle => (
                        <td key={vehicle.id} className="text-center p-4">
                          <span className={`font-semibold ${
                            getBestInCategory('ground_clearance', true) === vehicle.id ? 'text-primary' : ''
                          }`}>
                            {getComparisonValue(vehicle, 'ground_clearance')}
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-4 font-medium">Approach Angle (°)</td>
                      {selectedVehicles.map(vehicle => (
                        <td key={vehicle.id} className="text-center p-4">
                          <span className={`font-semibold ${
                            getBestInCategory('approach_angle', true) === vehicle.id ? 'text-primary' : ''
                          }`}>
                            {getComparisonValue(vehicle, 'approach_angle')}
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-4 font-medium">Departure Angle (°)</td>
                      {selectedVehicles.map(vehicle => (
                        <td key={vehicle.id} className="text-center p-4">
                          <span className={`font-semibold ${
                            getBestInCategory('departure_angle', true) === vehicle.id ? 'text-primary' : ''
                          }`}>
                            {getComparisonValue(vehicle, 'departure_angle')}
                          </span>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-4 font-medium">Engine</td>
                      {selectedVehicles.map(vehicle => (
                        <td key={vehicle.id} className="text-center p-4">
                          {getComparisonValue(vehicle, 'engine')}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-4 font-medium">Tire Size</td>
                      {selectedVehicles.map(vehicle => (
                        <td key={vehicle.id} className="text-center p-4">
                          {getComparisonValue(vehicle, 'tire_size')}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center py-12">
            <Scale className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Start Your Comparison</h3>
            <p className="text-muted-foreground">
              Select vehicles from the dropdown above to compare their specifications side by side.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Compare;