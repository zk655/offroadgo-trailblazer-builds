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
import { Trash2, Edit, Plus, Search, Calendar, MapPin, Users } from "lucide-react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import AdminHeader from "@/components/AdminHeader";

interface EventFormData {
  title: string;
  description: string;
  event_type: string;
  location: string;
  country: string;
  venue: string;
  start_date: string;
  end_date: string;
  entry_fee: number | string;
  max_participants: number | string;
  terrain_type: string;
  difficulty_level: string;
  image_url: string;
  external_url: string;
  club_id: string;
}

const eventTypes = ["Rally", "Race", "Trail Ride", "Training", "Social", "Competition", "Exhibition"];
const difficultyLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];
const terrainTypes = ["Desert", "Mountain", "Forest", "Sand", "Rock", "Mud", "Mixed"];

export default function AdminEvents() {
  const { user, userRole, loading, roleLoading } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<EventFormData>({
    defaultValues: {
      title: "",
      description: "",
      event_type: "rally",
      location: "",
      country: "",
      venue: "",
      start_date: "",
      end_date: "",
      entry_fee: "",
      max_participants: "",
      terrain_type: "",
      difficulty_level: "",
      image_url: "",
      external_url: "",
      club_id: "",
    },
  });

  // Move all hooks to the top before any early returns
  const { data: events, isLoading } = useQuery({
    queryKey: ["admin-events", searchTerm, selectedType],
    queryFn: async () => {
      let query = supabase
        .from("events")
        .select(`
          *,
          clubs (
            name
          )
        `)
        .order("start_date", { ascending: false });
      
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%,event_type.ilike.%${searchTerm}%`);
      }
      
      if (selectedType && selectedType !== "all") {
        query = query.eq("event_type", selectedType);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const { data: clubs } = useQuery({
    queryKey: ["admin-clubs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clubs")
        .select("id, name")
        .order("name");
      
      if (error) throw error;
      return data;
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

  const createMutation = useMutation({
    mutationFn: async (data: EventFormData) => {
      const processedData = {
        ...data,
        entry_fee: data.entry_fee ? parseFloat(data.entry_fee.toString()) : null,
        max_participants: data.max_participants ? parseInt(data.max_participants.toString()) : null,
        start_date: data.start_date || null,
        end_date: data.end_date || null,
        club_id: data.club_id && data.club_id !== "none" ? data.club_id : null,
      };

      const { error } = await supabase.from("events").insert(processedData);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      toast({ title: "Event created successfully" });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({ title: "Error creating event", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: EventFormData }) => {
      const processedData = {
        ...data,
        entry_fee: data.entry_fee ? parseFloat(data.entry_fee.toString()) : null,
        max_participants: data.max_participants ? parseInt(data.max_participants.toString()) : null,
        start_date: data.start_date || null,
        end_date: data.end_date || null,
        club_id: data.club_id && data.club_id !== "none" ? data.club_id : null,
      };

      const { error } = await supabase.from("events").update(processedData).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      toast({ title: "Event updated successfully" });
      setIsDialogOpen(false);
      setEditingEvent(null);
      form.reset();
    },
    onError: (error: any) => {
      toast({ title: "Error updating event", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      toast({ title: "Event deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error deleting event", description: error.message, variant: "destructive" });
    },
  });

  const onSubmit = (data: EventFormData) => {
    if (editingEvent) {
      updateMutation.mutate({ id: editingEvent.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (event: any) => {
    setEditingEvent(event);
    form.reset({
      title: event.title || "",
      description: event.description || "",
      event_type: event.event_type || "rally",
      location: event.location || "",
      country: event.country || "",
      venue: event.venue || "",
      start_date: event.start_date ? new Date(event.start_date).toISOString().slice(0, 16) : "",
      end_date: event.end_date ? new Date(event.end_date).toISOString().slice(0, 16) : "",
      entry_fee: event.entry_fee?.toString() || "",
      max_participants: event.max_participants?.toString() || "",
      terrain_type: event.terrain_type || "",
      difficulty_level: event.difficulty_level || "",
      image_url: event.image_url || "",
      external_url: event.external_url || "",
      club_id: event.club_id || "",
    });
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingEvent(null);
    form.reset();
    setIsDialogOpen(true);
  };

  const getEventTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case "rally": return "bg-blue-500";
      case "race": return "bg-red-500";
      case "training": return "bg-green-500";
      case "social": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <AdminHeader
          title="Event Management"
          description="Manage off-road events and rallies"
          action={
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleCreate}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Event
                </Button>
              </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingEvent ? "Edit Event" : "Create New Event"}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Title</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="King of Hammers 2024" />
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
                          <Textarea {...field} placeholder="Event description..." rows={4} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="event_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Event Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {eventTypes.map((type) => (
                                <SelectItem key={type} value={type.toLowerCase()}>
                                  {type}
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
                      name="club_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organizing Club (Optional)</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select club" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">No Club</SelectItem>
                              {clubs?.map((club) => (
                                <SelectItem key={club.id} value={club.id}>
                                  {club.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Johnson Valley" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="USA" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="venue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Venue</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Specific venue name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="start_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date & Time</FormLabel>
                          <FormControl>
                            <Input {...field} type="datetime-local" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="end_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date & Time</FormLabel>
                          <FormControl>
                            <Input {...field} type="datetime-local" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="entry_fee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Entry Fee ($)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" step="0.01" placeholder="100.00" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="max_participants"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Max Participants</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" placeholder="150" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="terrain_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Terrain Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select terrain" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {terrainTypes.map((terrain) => (
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
                    <FormField
                      control={form.control}
                      name="difficulty_level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Difficulty Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select difficulty" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {difficultyLevels.map((level) => (
                                <SelectItem key={level} value={level}>
                                  {level}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
                        <FormLabel>Event Image URL</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://example.com/event-image.jpg" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="external_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>External Registration URL</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://registration-site.com" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                      {editingEvent ? "Update" : "Create"} Event
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
            </Dialog>
          }
        />

        <div className="mb-6 flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events by title, location, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {eventTypes.map((type) => (
                <SelectItem key={type} value={type.toLowerCase()}>
                  {type}
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
            {events?.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 line-clamp-1">
                    <Calendar className="h-5 w-5" />
                    {event.title}
                  </CardTitle>
                  <div className="flex items-center justify-between">
                    <Badge className={`${getEventTypeColor(event.event_type)} text-white`}>
                      {event.event_type}
                    </Badge>
                    {event.start_date && (
                      <span className="text-sm text-muted-foreground">
                        {new Date(event.start_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {event.image_url && (
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="w-full h-32 object-cover rounded mb-4"
                    />
                  )}
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {event.description || "No description available"}
                  </p>
                  <div className="space-y-2 mb-4">
                    {event.location && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                    )}
                    {event.max_participants && (
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4" />
                        <span>Max: {event.max_participants} participants</span>
                      </div>
                    )}
                    {event.entry_fee && (
                      <div className="flex justify-between text-sm">
                        <span>Entry Fee:</span>
                        <span className="font-semibold">${event.entry_fee}</span>
                      </div>
                    )}
                    {event.difficulty_level && (
                      <div className="flex justify-between text-sm">
                        <span>Difficulty:</span>
                        <Badge variant="secondary">{event.difficulty_level}</Badge>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {(event as any).clubs?.name && (
                        <Badge variant="outline" className="text-xs">
                          {(event as any).clubs.name}
                        </Badge>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(event)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteMutation.mutate(event.id)}
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

        {events && events.length === 0 && (
          <Card className="p-8 text-center">
            <CardContent>
              <p className="text-muted-foreground">No events found.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}