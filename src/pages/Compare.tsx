import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Scale, Plus, X, Car, Fuel, Mountain, DollarSign, Gauge, Users, Truck, Zap, Clock, Shield, Award } from 'lucide-react';
import Navigation from '@/components/Navigation';
import PageHero from '@/components/PageHero';

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
  approach_angle?: number;
  departure_angle?: number;
  engine: string;
  tire_size: string;
  image_url: string;
  // New detailed specifications
  drivetrain?: string;
  transmission?: string;
  fuel_tank_capacity?: number;
  seating_capacity?: number;
  cargo_capacity?: number;
  approach_angle_degrees?: number;
  departure_angle_degrees?: number;
  breakover_angle?: number;
  wading_depth?: number;
  horsepower?: number;
  torque?: number;
  zero_to_sixty?: number;
  top_speed?: number;
  fuel_type?: string;
  safety_rating?: number;
  warranty?: string;
  starting_price?: number;
  max_payload?: number;
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
      <PageHero
        title="Compare 4x4 Vehicles"
        subtitle="Compare up to 4 off-road vehicles side by side to find the perfect 4x4 match for your adventure needs."
        icon={Scale}
      />

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
                          <div className="space-y-2 relative">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeVehicleFromCompare(vehicle.id)}
                              className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 z-10"
                              title="Remove from comparison"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                            <img
                              src={vehicle.image_url}
                              alt={`${vehicle.brand} ${vehicle.name}`}
                              className="w-full h-32 object-cover rounded-lg mb-2"
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder.svg';
                              }}
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
                      <td className="p-4 font-medium flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        Horsepower
                      </td>
                      {selectedVehicles.map(vehicle => (
                        <td key={vehicle.id} className="text-center p-4">
                          <span className={`font-semibold ${
                            getBestInCategory('horsepower', true) === vehicle.id ? 'text-primary' : ''
                          }`}>
                            {getComparisonValue(vehicle, 'horsepower')} hp
                          </span>
                        </td>
                      ))}
                    </tr>
                    
                    <tr className="border-b border-border">
                      <td className="p-4 font-medium flex items-center gap-2">
                        <Gauge className="h-4 w-4" />
                        Torque
                      </td>
                      {selectedVehicles.map(vehicle => (
                        <td key={vehicle.id} className="text-center p-4">
                          <span className={`font-semibold ${
                            getBestInCategory('torque', true) === vehicle.id ? 'text-primary' : ''
                          }`}>
                            {getComparisonValue(vehicle, 'torque')} lb-ft
                          </span>
                        </td>
                      ))}
                    </tr>
                    
                    <tr className="border-b border-border">
                      <td className="p-4 font-medium flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        0-60 mph
                      </td>
                      {selectedVehicles.map(vehicle => (
                        <td key={vehicle.id} className="text-center p-4">
                          <span className={`font-semibold ${
                            getBestInCategory('zero_to_sixty', false) === vehicle.id ? 'text-primary' : ''
                          }`}>
                            {getComparisonValue(vehicle, 'zero_to_sixty')} sec
                          </span>
                        </td>
                      ))}
                    </tr>
                    
                    <tr className="border-b border-border">
                      <td className="p-4 font-medium flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        Towing Capacity
                      </td>
                      {selectedVehicles.map(vehicle => (
                        <td key={vehicle.id} className="text-center p-4">
                          <span className={`font-semibold ${
                            getBestInCategory('towing_capacity', true) === vehicle.id ? 'text-primary' : ''
                          }`}>
                            {(getComparisonValue(vehicle, 'towing_capacity') as number)?.toLocaleString() || 'N/A'} lbs
                          </span>
                        </td>
                      ))}
                    </tr>
                    
                    <tr className="border-b border-border">
                      <td className="p-4 font-medium flex items-center gap-2">
                        <Mountain className="h-4 w-4" />
                        Ground Clearance
                      </td>
                      {selectedVehicles.map(vehicle => (
                        <td key={vehicle.id} className="text-center p-4">
                          <span className={`font-semibold ${
                            getBestInCategory('ground_clearance', true) === vehicle.id ? 'text-primary' : ''
                          }`}>
                            {getComparisonValue(vehicle, 'ground_clearance')}"
                          </span>
                        </td>
                      ))}
                    </tr>
                    
                    <tr className="border-b border-border">
                      <td className="p-4 font-medium">Approach Angle</td>
                      {selectedVehicles.map(vehicle => (
                        <td key={vehicle.id} className="text-center p-4">
                          <span className={`font-semibold ${
                            getBestInCategory('approach_angle_degrees', true) === vehicle.id ? 'text-primary' : ''
                          }`}>
                            {getComparisonValue(vehicle, 'approach_angle_degrees')}°
                          </span>
                        </td>
                      ))}
                    </tr>
                    
                    <tr className="border-b border-border">
                      <td className="p-4 font-medium">Departure Angle</td>
                      {selectedVehicles.map(vehicle => (
                        <td key={vehicle.id} className="text-center p-4">
                          <span className={`font-semibold ${
                            getBestInCategory('departure_angle_degrees', true) === vehicle.id ? 'text-primary' : ''
                          }`}>
                            {getComparisonValue(vehicle, 'departure_angle_degrees')}°
                          </span>
                        </td>
                      ))}
                    </tr>
                    
                    <tr className="border-b border-border">
                      <td className="p-4 font-medium">Breakover Angle</td>
                      {selectedVehicles.map(vehicle => (
                        <td key={vehicle.id} className="text-center p-4">
                          <span className={`font-semibold ${
                            getBestInCategory('breakover_angle', true) === vehicle.id ? 'text-primary' : ''
                          }`}>
                            {getComparisonValue(vehicle, 'breakover_angle')}°
                          </span>
                        </td>
                      ))}
                    </tr>
                    
                    <tr className="border-b border-border">
                      <td className="p-4 font-medium flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Seating Capacity
                      </td>
                      {selectedVehicles.map(vehicle => (
                        <td key={vehicle.id} className="text-center p-4">
                          <span className={`font-semibold ${
                            getBestInCategory('seating_capacity', true) === vehicle.id ? 'text-primary' : ''
                          }`}>
                            {getComparisonValue(vehicle, 'seating_capacity')} seats
                          </span>
                        </td>
                      ))}
                    </tr>
                    
                    <tr className="border-b border-border">
                      <td className="p-4 font-medium">Cargo Capacity</td>
                      {selectedVehicles.map(vehicle => (
                        <td key={vehicle.id} className="text-center p-4">
                          <span className={`font-semibold ${
                            getBestInCategory('cargo_capacity', true) === vehicle.id ? 'text-primary' : ''
                          }`}>
                            {getComparisonValue(vehicle, 'cargo_capacity')} cu ft
                          </span>
                        </td>
                      ))}
                    </tr>
                    
                    <tr className="border-b border-border">
                      <td className="p-4 font-medium">Fuel Tank</td>
                      {selectedVehicles.map(vehicle => (
                        <td key={vehicle.id} className="text-center p-4">
                          <span className={`font-semibold ${
                            getBestInCategory('fuel_tank_capacity', true) === vehicle.id ? 'text-primary' : ''
                          }`}>
                            {getComparisonValue(vehicle, 'fuel_tank_capacity')} gal
                          </span>
                        </td>
                      ))}
                    </tr>
                    
                    <tr className="border-b border-border">
                      <td className="p-4 font-medium">Wading Depth</td>
                      {selectedVehicles.map(vehicle => (
                        <td key={vehicle.id} className="text-center p-4">
                          <span className={`font-semibold ${
                            getBestInCategory('wading_depth', true) === vehicle.id ? 'text-primary' : ''
                          }`}>
                            {getComparisonValue(vehicle, 'wading_depth')}"
                          </span>
                        </td>
                      ))}
                    </tr>
                    
                    <tr className="border-b border-border">
                      <td className="p-4 font-medium">Transmission</td>
                      {selectedVehicles.map(vehicle => (
                        <td key={vehicle.id} className="text-center p-4">
                          {getComparisonValue(vehicle, 'transmission')}
                        </td>
                      ))}
                    </tr>
                    
                    <tr className="border-b border-border">
                      <td className="p-4 font-medium">Drivetrain</td>
                      {selectedVehicles.map(vehicle => (
                        <td key={vehicle.id} className="text-center p-4">
                          {getComparisonValue(vehicle, 'drivetrain')}
                        </td>
                      ))}
                    </tr>
                    
                    <tr className="border-b border-border">
                      <td className="p-4 font-medium flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Safety Rating
                      </td>
                      {selectedVehicles.map(vehicle => (
                        <td key={vehicle.id} className="text-center p-4">
                          <span className={`font-semibold ${
                            getBestInCategory('safety_rating', true) === vehicle.id ? 'text-primary' : ''
                          }`}>
                            {getComparisonValue(vehicle, 'safety_rating')}/5
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
                    
                    <tr className="border-b border-border">
                      <td className="p-4 font-medium">Tire Size</td>
                      {selectedVehicles.map(vehicle => (
                        <td key={vehicle.id} className="text-center p-4">
                          {getComparisonValue(vehicle, 'tire_size')}
                        </td>
                      ))}
                    </tr>
                    
                    <tr>
                      <td className="p-4 font-medium flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        Warranty
                      </td>
                      {selectedVehicles.map(vehicle => (
                        <td key={vehicle.id} className="text-center p-4">
                          {getComparisonValue(vehicle, 'warranty')}
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