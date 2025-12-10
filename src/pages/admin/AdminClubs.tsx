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
import { Trash2, Edit, Plus, Search, Users, Globe, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import AdminHeader from "@/components/AdminHeader";

interface ClubFormData {
  name: string;
  description: string;
  type: string;
  location: string;
  member_count: number | string;
  contact_email: string;
  contact_phone: string;
  website_url: string;
  image_url: string;
}

const clubTypes = ["Rally", "Racing", "Trail Riding", "Social", "Competition", "Training", "Mixed"];

export default function AdminClubs() {
  const { user, userRole, loading, roleLoading } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClub, setEditingClub] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<ClubFormData>({
    defaultValues: {
      name: "",
      description: "",
      type: "rally",
      location: "",
      member_count: "",
      contact_email: "",
      contact_phone: "",
      website_url: "",
      image_url: "",
    },
  });

  const { data: clubs, isLoading } = useQuery({
    queryKey: ["admin-clubs", searchTerm, selectedType],
    queryFn: async () => {
      let query = supabase.from("clubs").select("*").order("created_at", { ascending: false });
      
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%,type.ilike.%${searchTerm}%`);
      }
      
      if (selectedType) {
        query = query.eq("type", selectedType);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!user && (userRole === "admin" || userRole === "editor"),
  });

  const createMutation = useMutation({
    mutationFn: async (data: ClubFormData) => {
      const processedData = {
        name: data.name,
        description: data.description || null,
        type: data.type || null,
        location: data.location || null,
        member_count: data.member_count ? parseInt(data.member_count.toString()) : null,
        contact_email: data.contact_email || null,
        contact_phone: data.contact_phone || null,
        website_url: data.website_url || null,
        image_url: data.image_url || null,
      };

      const { error } = await supabase.from("clubs").insert(processedData);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-clubs"] });
      toast({ title: "Club created successfully" });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({ title: "Error creating club", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ClubFormData }) => {
      const processedData = {
        name: data.name,
        description: data.description || null,
        type: data.type || null,
        location: data.location || null,
        member_count: data.member_count ? parseInt(data.member_count.toString()) : null,
        contact_email: data.contact_email || null,
        contact_phone: data.contact_phone || null,
        website_url: data.website_url || null,
        image_url: data.image_url || null,
      };

      const { error } = await supabase.from("clubs").update(processedData).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-clubs"] });
      toast({ title: "Club updated successfully" });
      setIsDialogOpen(false);
      setEditingClub(null);
      form.reset();
    },
    onError: (error: any) => {
      toast({ title: "Error updating club", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("clubs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-clubs"] });
      toast({ title: "Club deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error deleting club", description: error.message, variant: "destructive" });
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

  const onSubmit = (data: ClubFormData) => {
    if (editingClub) {
      updateMutation.mutate({ id: editingClub.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (club: any) => {
    setEditingClub(club);
    form.reset({
      name: club.name || "",
      description: club.description || "",
      type: club.type || "rally",
      location: club.location || "",
      member_count: club.member_count?.toString() || "",
      contact_email: club.contact_email || "",
      contact_phone: club.contact_phone || "",
      website_url: club.website_url || "",
      image_url: club.image_url || "",
    });
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingClub(null);
    form.reset();
    setIsDialogOpen(true);
  };

  const getClubTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case "rally": return "bg-blue-500";
      case "racing": return "bg-red-500";
      case "social": return "bg-green-500";
      case "competition": return "bg-orange-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <AdminHeader
          title="Club Management"
          description="Manage off-road clubs and communities"
          action={
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleCreate}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Club
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingClub ? "Edit Club" : "Add New Club"}
                  </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Club Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Desert Riders Off-Road Club" />
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
                            <Textarea {...field} placeholder="Club description..." rows={4} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Club Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {clubTypes.map((type) => (
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
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Phoenix, Arizona" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="member_count"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Member Count</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" placeholder="150" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="contact_email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Email</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" placeholder="info@desertridersclub.com" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="contact_phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Phone</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="(555) 123-4567" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="website_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website URL</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="https://www.desertridersclub.com" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="image_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Club Logo/Image URL</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="https://example.com/club-logo.jpg" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <DialogFooter>
                      <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                        {editingClub ? "Update" : "Create"} Club
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
              placeholder="Search clubs by name, location, or type..."
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
              <SelectItem value="">All Types</SelectItem>
              {clubTypes.map((type) => (
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
            {clubs?.map((club) => (
              <Card key={club.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 line-clamp-1">
                    <Users className="h-5 w-5" />
                    {club.name}
                  </CardTitle>
                  <div className="flex items-center justify-between">
                    <Badge className={`${getClubTypeColor(club.type)} text-white`}>
                      {club.type || "Unknown"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {club.image_url && (
                    <img
                      src={club.image_url}
                      alt={club.name}
                      className="w-full h-32 object-cover rounded mb-4"
                    />
                  )}
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {club.description || "No description available"}
                  </p>
                  <div className="space-y-2 mb-4">
                    {club.location && (
                      <div className="flex justify-between text-sm">
                        <span>Location:</span>
                        <span className="line-clamp-1">{club.location}</span>
                      </div>
                    )}
                    {club.member_count && (
                      <div className="flex justify-between text-sm">
                        <span>Members:</span>
                        <span>{club.member_count}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 pt-2 border-t">
                    {club.website_url && (
                      <Button variant="ghost" size="sm" asChild>
                        <a href={club.website_url} target="_blank" rel="noopener noreferrer">
                          <Globe className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {club.contact_email && (
                      <Button variant="ghost" size="sm" asChild>
                        <a href={`mailto:${club.contact_email}`}>
                          <Mail className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    <div className="flex-1" />
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(club)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this club?")) {
                          deleteMutation.mutate(club.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
