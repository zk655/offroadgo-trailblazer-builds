import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Plus, Search, Car } from "lucide-react";
import AdminHeader from "@/components/AdminHeader";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface VehicleFormData {
  name: string;
  brand: string;
  year: number | string;
  engine: string;
  transmission: string;
  drivetrain: string;
  horsepower: number | string;
  torque: number | string;
  price: number | string;
  fuel_economy: string;
  towing_capacity: number | string;
  payload_capacity: number | string;
  ground_clearance: number | string;
  approach_angle: number | string;
  departure_angle: number | string;
  breakover_angle: number | string;
  image_url: string;
  description: string;
}

export default function AdminVehicles() {
  const { user, userRole, loading, roleLoading } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<VehicleFormData>({
    defaultValues: {
      name: "",
      brand: "",
      year: "",
      engine: "",
      transmission: "",
      drivetrain: "4WD",
      horsepower: "",
      torque: "",
      price: "",
      fuel_economy: "",
      towing_capacity: "",
      payload_capacity: "",
      ground_clearance: "",
      approach_angle: "",
      departure_angle: "",
      breakover_angle: "",
      image_url: "",
      description: "",
    },
  });

  const { data: vehicles, isLoading } = useQuery({
    queryKey: ["admin-vehicles", searchTerm],
    queryFn: async () => {
      let query = supabase.from("vehicles").select("*").order("created_at", { ascending: false });
      
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,brand.ilike.%${searchTerm}%`);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: VehicleFormData) => {
      const processedData = {
        name: data.name,
        brand: data.brand,
        year: data.year ? parseInt(data.year.toString()) : null,
        engine: data.engine || null,
        transmission: data.transmission || null,
        drivetrain: data.drivetrain || null,
        horsepower: data.horsepower ? parseInt(data.horsepower.toString()) : null,
        torque: data.torque ? parseInt(data.torque.toString()) : null,
        price: data.price ? parseFloat(data.price.toString()) : null,
        fuel_economy: data.fuel_economy || null,
        towing_capacity: data.towing_capacity ? parseInt(data.towing_capacity.toString()) : null,
        payload_capacity: data.payload_capacity ? parseInt(data.payload_capacity.toString()) : null,
        ground_clearance: data.ground_clearance ? parseFloat(data.ground_clearance.toString()) : null,
        approach_angle: data.approach_angle ? parseFloat(data.approach_angle.toString()) : null,
        departure_angle: data.departure_angle ? parseFloat(data.departure_angle.toString()) : null,
        breakover_angle: data.breakover_angle ? parseFloat(data.breakover_angle.toString()) : null,
        image_url: data.image_url || null,
        description: data.description || null,
      };

      const { error } = await supabase.from("vehicles").insert(processedData);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-vehicles"] });
      toast({ title: "Vehicle created successfully" });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({ title: "Error creating vehicle", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: VehicleFormData }) => {
      const processedData = {
        name: data.name,
        brand: data.brand,
        year: data.year ? parseInt(data.year.toString()) : null,
        engine: data.engine || null,
        transmission: data.transmission || null,
        drivetrain: data.drivetrain || null,
        horsepower: data.horsepower ? parseInt(data.horsepower.toString()) : null,
        torque: data.torque ? parseInt(data.torque.toString()) : null,
        price: data.price ? parseFloat(data.price.toString()) : null,
        fuel_economy: data.fuel_economy || null,
        towing_capacity: data.towing_capacity ? parseInt(data.towing_capacity.toString()) : null,
        payload_capacity: data.payload_capacity ? parseInt(data.payload_capacity.toString()) : null,
        ground_clearance: data.ground_clearance ? parseFloat(data.ground_clearance.toString()) : null,
        approach_angle: data.approach_angle ? parseFloat(data.approach_angle.toString()) : null,
        departure_angle: data.departure_angle ? parseFloat(data.departure_angle.toString()) : null,
        breakover_angle: data.breakover_angle ? parseFloat(data.breakover_angle.toString()) : null,
        image_url: data.image_url || null,
        description: data.description || null,
      };

      const { error } = await supabase.from("vehicles").update(processedData).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-vehicles"] });
      toast({ title: "Vehicle updated successfully" });
      setIsDialogOpen(false);
      setEditingVehicle(null);
      form.reset();
    },
    onError: (error: any) => {
      toast({ title: "Error updating vehicle", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("vehicles").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-vehicles"] });
      toast({ title: "Vehicle deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error deleting vehicle", description: error.message, variant: "destructive" });
    },
  });

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (userRole !== "admin" && userRole !== "editor") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-destructive">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You don't have permission to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const onSubmit = (data: VehicleFormData) => {
    if (editingVehicle) {
      updateMutation.mutate({ id: editingVehicle.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (vehicle: any) => {
    setEditingVehicle(vehicle);
    form.reset({
      name: vehicle.name || "",
      brand: vehicle.brand || "",
      year: vehicle.year?.toString() || "",
      engine: vehicle.engine || "",
      transmission: vehicle.transmission || "",
      drivetrain: vehicle.drivetrain || "4WD",
      horsepower: vehicle.horsepower?.toString() || "",
      torque: vehicle.torque?.toString() || "",
      price: vehicle.price?.toString() || "",
      fuel_economy: vehicle.fuel_economy || "",
      towing_capacity: vehicle.towing_capacity?.toString() || "",
      payload_capacity: vehicle.payload_capacity?.toString() || "",
      ground_clearance: vehicle.ground_clearance?.toString() || "",
      approach_angle: vehicle.approach_angle?.toString() || "",
      departure_angle: vehicle.departure_angle?.toString() || "",
      breakover_angle: vehicle.breakover_angle?.toString() || "",
      image_url: vehicle.image_url || "",
      description: vehicle.description || "",
    });
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingVehicle(null);
    form.reset();
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <AdminHeader
          title="Vehicle Management"
          description="Manage off-road vehicles and specifications"
          action={
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleCreate}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Vehicle
                </Button>
              </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Wrangler Rubicon" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="brand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Brand</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Jeep" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Year</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" placeholder="2024" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price ($)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" placeholder="55000" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="engine"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Engine</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="3.6L V6" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="transmission"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Transmission</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="8-Speed Automatic" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="drivetrain"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Drivetrain</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="4WD">4WD</SelectItem>
                              <SelectItem value="AWD">AWD</SelectItem>
                              <SelectItem value="2WD">2WD</SelectItem>
                              <SelectItem value="RWD">RWD</SelectItem>
                              <SelectItem value="FWD">FWD</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="fuel_economy"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fuel Economy</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="17/23 mpg city/hwy" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="horsepower"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Horsepower</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" placeholder="285" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="torque"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Torque (lb-ft)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" placeholder="260" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="towing_capacity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Towing Capacity (lbs)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" placeholder="3500" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="payload_capacity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payload Capacity (lbs)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" placeholder="1000" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <FormField
                      control={form.control}
                      name="ground_clearance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ground Clearance (in)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" step="0.1" placeholder="10.8" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="approach_angle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Approach (°)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" step="0.1" placeholder="44" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="departure_angle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Departure (°)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" step="0.1" placeholder="37" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="breakover_angle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Breakover (°)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" step="0.1" placeholder="27.8" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="image_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://example.com/vehicle-image.jpg" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Vehicle description..." rows={3} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                      {editingVehicle ? "Update" : "Create"} Vehicle
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
            </Dialog>
          }
        />

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search vehicles by name or brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-32 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {vehicles?.map((vehicle) => (
              <Card key={vehicle.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    {vehicle.year} {vehicle.brand} {vehicle.name}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{vehicle.drivetrain}</Badge>
                    {vehicle.price && (
                      <Badge variant="outline">${vehicle.price.toLocaleString()}</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {vehicle.image_url && (
                    <img
                      src={vehicle.image_url}
                      alt={vehicle.name}
                      className="w-full h-32 object-cover rounded mb-4"
                    />
                  )}
                  <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                    {vehicle.horsepower && (
                      <div>
                        <span className="text-muted-foreground">HP:</span> {vehicle.horsepower}
                      </div>
                    )}
                    {vehicle.torque && (
                      <div>
                        <span className="text-muted-foreground">Torque:</span> {vehicle.torque} lb-ft
                      </div>
                    )}
                    {vehicle.ground_clearance && (
                      <div>
                        <span className="text-muted-foreground">Clearance:</span> {vehicle.ground_clearance}"
                      </div>
                    )}
                    {vehicle.towing_capacity && (
                      <div>
                        <span className="text-muted-foreground">Towing:</span> {vehicle.towing_capacity.toLocaleString()} lbs
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(vehicle)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => deleteMutation.mutate(vehicle.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {vehicles?.length === 0 && !isLoading && (
          <Card className="text-center py-12">
            <CardContent>
              <Car className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No vehicles found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm
                  ? "Try adjusting your search criteria"
                  : "Get started by adding your first vehicle"}
              </p>
              <Button onClick={handleCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Add Vehicle
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
