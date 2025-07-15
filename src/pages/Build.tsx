import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Wrench, Plus, X, Save, Car, DollarSign, Package } from 'lucide-react';
import Navigation from '@/components/Navigation';
import PageHero from '@/components/PageHero';

interface Vehicle {
  id: string;
  name: string;
  brand: string;
  year: number;
  image_url: string;
}

interface Mod {
  id: string;
  title: string;
  category: string;
  price: number;
  brand: string;
  image_url: string;
}

interface Build {
  id: string;
  name: string;
  description: string;
  vehicle_id: string;
  mod_ids: string[];
  total_cost: number;
}

const Build = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [mods, setMods] = useState<Mod[]>([]);
  const [builds, setBuilds] = useState<Build[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [selectedMods, setSelectedMods] = useState<Mod[]>([]);
  const [buildName, setBuildName] = useState('');
  const [buildDescription, setBuildDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [vehiclesResponse, modsResponse, buildsResponse] = await Promise.all([
        supabase.from('vehicles').select('*').order('brand', { ascending: true }),
        supabase.from('mods').select('*').order('category', { ascending: true }),
        supabase.from('builds').select('*').order('created_at', { ascending: false })
      ]);

      if (vehiclesResponse.error) throw vehiclesResponse.error;
      if (modsResponse.error) throw modsResponse.error;
      if (buildsResponse.error) throw buildsResponse.error;

      setVehicles(vehiclesResponse.data || []);
      setMods(modsResponse.data || []);
      setBuilds(buildsResponse.data || []);
    } catch (error) {
      // Handle error silently in production
    } finally {
      setLoading(false);
    }
  };

  const selectVehicle = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    setSelectedVehicle(vehicle || null);
  };

  const addMod = (modId: string) => {
    const mod = mods.find(m => m.id === modId);
    if (mod && !selectedMods.find(m => m.id === modId)) {
      setSelectedMods([...selectedMods, mod]);
    }
  };

  const removeMod = (modId: string) => {
    setSelectedMods(selectedMods.filter(m => m.id !== modId));
  };

  const calculateTotalCost = () => {
    return selectedMods.reduce((total, mod) => total + mod.price, 0);
  };

  const saveBuild = async () => {
    if (!selectedVehicle || !buildName) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('builds')
        .insert({
          name: buildName,
          description: buildDescription,
          vehicle_id: selectedVehicle.id,
          mod_ids: selectedMods.map(m => m.id),
          total_cost: calculateTotalCost()
        });

      if (error) throw error;

      // Reset form
      setBuildName('');
      setBuildDescription('');
      setSelectedVehicle(null);
      setSelectedMods([]);
      
      // Refresh builds
      fetchData();
    } catch (error) {
      // Handle error silently in production
    } finally {
      setSaving(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getModsByCategory = () => {
    const categories = [...new Set(mods.map(m => m.category))];
    return categories.map(category => ({
      category,
      mods: mods.filter(m => m.category === category)
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-20">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded mb-4" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-muted rounded" />
              <div className="h-96 bg-muted rounded" />
            </div>
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
        title="Build Your Ultimate Rig"
        subtitle="Create your perfect 4x4 off-road setup by choosing a vehicle and adding modifications for maximum adventure capability."
        icon={Wrench}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Build Creator */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vehicle Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Choose Your Vehicle
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Select onValueChange={selectVehicle}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a base vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles.map(vehicle => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.year} {vehicle.brand} {vehicle.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {selectedVehicle && (
                    <Card className="border border-primary/20">
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <img
                            src={selectedVehicle.image_url}
                            alt={`${selectedVehicle.brand} ${selectedVehicle.name}`}
                            className="w-24 h-16 object-cover rounded"
                          />
                          <div>
                            <h4 className="font-semibold">
                              {selectedVehicle.year} {selectedVehicle.brand}
                            </h4>
                            <p className="text-muted-foreground">{selectedVehicle.name}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Modifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Add Modifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {getModsByCategory().map(({ category, mods: categoryMods }) => (
                    <div key={category}>
                      <h4 className="font-semibold mb-3 text-primary">{category}</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {categoryMods.map(mod => (
                          <Card 
                            key={mod.id} 
                            className={`cursor-pointer transition-smooth hover:shadow-primary hover:-translate-y-1 ${
                              selectedMods.find(m => m.id === mod.id) ? 'ring-2 ring-primary' : ''
                            }`}
                            onClick={() => addMod(mod.id)}
                          >
                            <CardContent className="p-3">
                              <div className="flex gap-3">
                                <img
                                  src={mod.image_url}
                                  alt={mod.title}
                                  className="w-16 h-12 object-cover rounded"
                                />
                                <div className="flex-1">
                                  <p className="font-medium text-sm line-clamp-1">{mod.title}</p>
                                  <p className="text-xs text-muted-foreground">{mod.brand}</p>
                                  <p className="text-sm font-bold text-primary">{formatPrice(mod.price)}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Build Summary */}
          <div className="space-y-6">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Build Summary</span>
                  <Badge variant="outline">
                    {selectedMods.length} mods
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Build Name</label>
                  <Input
                    value={buildName}
                    onChange={(e) => setBuildName(e.target.value)}
                    placeholder="Enter build name"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={buildDescription}
                    onChange={(e) => setBuildDescription(e.target.value)}
                    placeholder="Describe your build"
                    className="min-h-20"
                  />
                </div>

                {selectedVehicle && (
                  <div>
                    <h4 className="font-medium mb-2">Base Vehicle</h4>
                    <div className="text-sm text-muted-foreground">
                      {selectedVehicle.year} {selectedVehicle.brand} {selectedVehicle.name}
                    </div>
                  </div>
                )}

                {selectedMods.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Selected Mods</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {selectedMods.map(mod => (
                        <div key={mod.id} className="flex items-center justify-between text-sm bg-muted p-2 rounded">
                          <span className="flex-1 line-clamp-1">{mod.title}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{formatPrice(mod.price)}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeMod(mod.id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between text-lg font-bold">
                    <span>Total Cost:</span>
                    <span className="text-primary">{formatPrice(calculateTotalCost())}</span>
                  </div>
                </div>

                <Button 
                  className="w-full"
                  onClick={saveBuild}
                  disabled={!selectedVehicle || !buildName || saving}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? 'Saving...' : 'Save Build'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Saved Builds */}
        {builds.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Saved Builds</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {builds.map(build => (
                  <Card key={build.id}>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">{build.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {build.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">
                          {build.mod_ids?.length || 0} mods
                        </Badge>
                        <span className="font-bold text-primary">
                          {formatPrice(build.total_cost || 0)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Build;