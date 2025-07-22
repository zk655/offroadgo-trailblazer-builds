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
import { Trash2, Edit, Plus, Search, MapPin, Mountain } from "lucide-react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface TrailFormData {
  name: string;
  location: string;
  description: string;
  difficulty: string;
  terrain: string;
  distance: number | string;
  elevation_gain: number | string;
  latitude: number | string;
  longitude: number | string;
  image_url: string;
  gpx_url: string;
}

const difficulties = ["Easy", "Moderate", "Hard", "Expert"];
const terrains = ["Sand", "Rock", "Mud", "Snow", "Desert", "Forest", "Mountain", "Canyon", "Mixed"];

export default function AdminTrails() {
  const { user, userRole } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTrail, setEditingTrail] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<TrailFormData>({
    defaultValues: {
      name: "",
      location: "",
      description: "",
      difficulty: "",
      terrain: "",
      distance: "",
      elevation_gain: "",
      latitude: "",
      longitude: "",
      image_url: "",
      gpx_url: "",
    },
  });

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

  const { data: trails, isLoading } = useQuery({
    queryKey: ["admin-trails", searchTerm, selectedDifficulty],
    queryFn: async () => {
      let query = supabase.from("trails").select("*").order("created_at", { ascending: false });
      
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%,terrain.ilike.%${searchTerm}%`);
      }
      
      if (selectedDifficulty) {
        query = query.eq("difficulty", selectedDifficulty);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: TrailFormData) => {
      const processedData = {
        ...data,
        distance: data.distance ? parseFloat(data.distance.toString()) : null,
        elevation_gain: data.elevation_gain ? parseInt(data.elevation_gain.toString()) : null,
        latitude: data.latitude ? parseFloat(data.latitude.toString()) : null,
        longitude: data.longitude ? parseFloat(data.longitude.toString()) : null,
      };

      const { error } = await supabase.from("trails").insert(processedData);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-trails"] });
      toast({ title: "Trail created successfully" });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({ title: "Error creating trail", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: TrailFormData }) => {
      const processedData = {
        ...data,
        distance: data.distance ? parseFloat(data.distance.toString()) : null,
        elevation_gain: data.elevation_gain ? parseInt(data.elevation_gain.toString()) : null,
        latitude: data.latitude ? parseFloat(data.latitude.toString()) : null,
        longitude: data.longitude ? parseFloat(data.longitude.toString()) : null,
      };

      const { error } = await supabase.from("trails").update(processedData).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-trails"] });
      toast({ title: "Trail updated successfully" });
      setIsDialogOpen(false);
      setEditingTrail(null);
      form.reset();
    },
    onError: (error: any) => {
      toast({ title: "Error updating trail", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("trails").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-trails"] });
      toast({ title: "Trail deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error deleting trail", description: error.message, variant: "destructive" });
    },
  });

  const onSubmit = (data: TrailFormData) => {
    if (editingTrail) {
      updateMutation.mutate({ id: editingTrail.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (trail: any) => {
    setEditingTrail(trail);
    form.reset({
      name: trail.name || "",
      location: trail.location || "",
      description: trail.description || "",
      difficulty: trail.difficulty || "",
      terrain: trail.terrain || "",
      distance: trail.distance?.toString() || "",
      elevation_gain: trail.elevation_gain?.toString() || "",
      latitude: trail.latitude?.toString() || "",
      longitude: trail.longitude?.toString() || "",
      image_url: trail.image_url || "",
      gpx_url: trail.gpx_url || "",
    });
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingTrail(null);
    form.reset();
    setIsDialogOpen(true);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case "easy": return "bg-green-500";
      case "moderate": return "bg-yellow-500";
      case "hard": return "bg-orange-500";
      case "expert": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Trail Management</h1>
            <p className="text-muted-foreground">Manage off-road trails and routes</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Add Trail
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingTrail ? "Edit Trail" : "Add New Trail"}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trail Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Hell's Revenge" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Moab, Utah" />
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
                          <Textarea {...field} placeholder="Trail description..." rows={4} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="difficulty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Difficulty</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select difficulty" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {difficulties.map((difficulty) => (
                                <SelectItem key={difficulty} value={difficulty}>
                                  {difficulty}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="terrain"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Terrain</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select terrain" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {terrains.map((terrain) => (
                                <SelectItem key={terrain} value={terrain}>
                                  {terrain}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="distance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Distance (miles)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" step="0.1" placeholder="12.5" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="elevation_gain"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Elevation Gain (ft)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" placeholder="1500" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="latitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Latitude</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" step="any" placeholder="38.5733" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="longitude"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Longitude</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" step="any" placeholder="-109.5498" />
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
                          <Input {...field} placeholder="https://example.com/trail-image.jpg" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gpx_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GPX File URL</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://example.com/trail.gpx" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                      {editingTrail ? "Update" : "Create"} Trail
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-6 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search trails by name, location, or terrain..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Difficulties</SelectItem>
              {difficulties.map((difficulty) => (
                <SelectItem key={difficulty} value={difficulty}>
                  {difficulty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            {trails?.map((trail) => (
              <Card key={trail.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 line-clamp-1">
                    <Mountain className="h-5 w-5" />
                    {trail.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="line-clamp-1">{trail.location}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  {trail.image_url && (
                    <img
                      src={trail.image_url}
                      alt={trail.name}
                      className="w-full h-32 object-cover rounded mb-4"
                    />
                  )}
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {trail.description || "No description available"}
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Difficulty:</span>
                      <Badge className={`${getDifficultyColor(trail.difficulty)} text-white`}>
                        {trail.difficulty}
                      </Badge>
                    </div>
                    {trail.terrain && (
                      <div className="flex justify-between text-sm">
                        <span>Terrain:</span>
                        <Badge variant="secondary">{trail.terrain}</Badge>
                      </div>
                    )}
                    {trail.distance && (
                      <div className="flex justify-between text-sm">
                        <span>Distance:</span>
                        <span>{trail.distance} miles</span>
                      </div>
                    )}
                    {trail.elevation_gain && (
                      <div className="flex justify-between text-sm">
                        <span>Elevation:</span>
                        <span>{trail.elevation_gain} ft</span>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {trail.gpx_url && (
                        <Badge variant="outline" className="text-xs">GPX</Badge>
                      )}
                      {trail.latitude && trail.longitude && (
                        <Badge variant="outline" className="text-xs">GPS</Badge>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(trail)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteMutation.mutate(trail.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {trails && trails.length === 0 && (
          <Card className="p-8 text-center">
            <CardContent>
              <p className="text-muted-foreground">No trails found.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}