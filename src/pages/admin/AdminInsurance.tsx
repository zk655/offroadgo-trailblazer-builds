import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Plus, Search, Shield, Star } from "lucide-react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import AdminHeader from "@/components/AdminHeader";

interface ProviderFormData {
  name: string;
  description: string;
  rating: number | string;
  contact_phone: string;
  contact_email: string;
  website_url: string;
  logo_url: string;
}

export default function AdminInsurance() {
  const { user, userRole, loading, roleLoading } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<ProviderFormData>({
    defaultValues: {
      name: "",
      description: "",
      rating: "",
      contact_phone: "",
      contact_email: "",
      website_url: "",
      logo_url: "",
    },
  });

  const { data: providers, isLoading } = useQuery({
    queryKey: ["admin-insurance-providers", searchTerm],
    queryFn: async () => {
      let query = supabase.from("insurance_providers").select("*").order("created_at", { ascending: false });
      
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!user && (userRole === "admin" || userRole === "editor"),
  });

  const createMutation = useMutation({
    mutationFn: async (data: ProviderFormData) => {
      const processedData = {
        name: data.name,
        description: data.description || null,
        rating: data.rating ? parseFloat(data.rating.toString()) : null,
        contact_phone: data.contact_phone || null,
        contact_email: data.contact_email || null,
        website_url: data.website_url || null,
        logo_url: data.logo_url || null,
      };

      const { error } = await supabase.from("insurance_providers").insert(processedData);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-insurance-providers"] });
      toast({ title: "Insurance provider created successfully" });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({ title: "Error creating provider", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ProviderFormData }) => {
      const processedData = {
        name: data.name,
        description: data.description || null,
        rating: data.rating ? parseFloat(data.rating.toString()) : null,
        contact_phone: data.contact_phone || null,
        contact_email: data.contact_email || null,
        website_url: data.website_url || null,
        logo_url: data.logo_url || null,
      };

      const { error } = await supabase.from("insurance_providers").update(processedData).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-insurance-providers"] });
      toast({ title: "Insurance provider updated successfully" });
      setIsDialogOpen(false);
      setEditingProvider(null);
      form.reset();
    },
    onError: (error: any) => {
      toast({ title: "Error updating provider", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("insurance_providers").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-insurance-providers"] });
      toast({ title: "Provider deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error deleting provider", description: error.message, variant: "destructive" });
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

  const onSubmit = (data: ProviderFormData) => {
    if (editingProvider) {
      updateMutation.mutate({ id: editingProvider.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (provider: any) => {
    setEditingProvider(provider);
    form.reset({
      name: provider.name || "",
      description: provider.description || "",
      rating: provider.rating?.toString() || "",
      contact_phone: provider.contact_phone || "",
      contact_email: provider.contact_email || "",
      website_url: provider.website_url || "",
      logo_url: provider.logo_url || "",
    });
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingProvider(null);
    form.reset();
    setIsDialogOpen(true);
  };

  const renderStars = (rating: number | null) => {
    if (!rating) return null;
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
        <span className="text-sm ml-1">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <AdminHeader
          title="Insurance Management"
          description="Manage insurance providers"
          action={
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleCreate}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Provider
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingProvider ? "Edit Insurance Provider" : "Add New Insurance Provider"}
                  </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Provider Name</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="GEICO Off-Road Insurance" />
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
                            <Textarea {...field} placeholder="Provider description..." rows={3} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="rating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rating (1-5)</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" min="1" max="5" step="0.1" placeholder="4.5" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="contact_phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Phone</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="1-800-555-0123" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="contact_email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Email</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" placeholder="contact@provider.com" />
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
                            <Input {...field} placeholder="https://www.provider.com" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="logo_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Logo URL</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="https://example.com/logo.png" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <DialogFooter>
                      <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                        {editingProvider ? "Update" : "Create"} Provider
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          }
        />

        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search providers..."
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
                    <div className="h-20 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {providers?.map((provider) => (
              <Card key={provider.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 line-clamp-1">
                    <Shield className="h-5 w-5" />
                    {provider.name}
                  </CardTitle>
                  {renderStars(provider.rating)}
                </CardHeader>
                <CardContent>
                  {provider.logo_url && (
                    <img
                      src={provider.logo_url}
                      alt={provider.name}
                      className="w-full h-20 object-contain rounded mb-4 bg-white p-2"
                    />
                  )}
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {provider.description || "No description available"}
                  </p>
                  <div className="space-y-1 mb-4 text-sm">
                    {provider.contact_phone && (
                      <div className="flex justify-between">
                        <span>Phone:</span>
                        <span>{provider.contact_phone}</span>
                      </div>
                    )}
                    {provider.contact_email && (
                      <div className="flex justify-between">
                        <span>Email:</span>
                        <span className="truncate ml-2">{provider.contact_email}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 pt-2 border-t justify-end">
                    {provider.website_url && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={provider.website_url} target="_blank" rel="noopener noreferrer">
                          Visit Site
                        </a>
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(provider)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this provider?")) {
                          deleteMutation.mutate(provider.id);
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
