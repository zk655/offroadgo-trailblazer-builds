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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Edit, Plus, Search, Shield, DollarSign } from "lucide-react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProviderFormData {
  name: string;
  company_name: string;
  description: string;
  specializes_in: string;
  coverage_areas: string;
  rating: number | string;
  contact_phone: string;
  contact_email: string;
  website_url: string;
  logo_url: string;
}

interface QuoteFormData {
  provider_id: string;
  vehicle_type: string;
  coverage_type: string;
  state_code: string;
  monthly_premium: number | string;
  annual_premium: number | string;
  deductible: number | string;
  coverage_limit: number | string;
  min_age: number | string;
  max_age: number | string;
  min_experience_years: number | string;
  features: string;
  effective_date: string;
  expiry_date: string;
}

const vehicleTypes = ["SUV", "Truck", "ATV", "UTV", "Motorcycle", "Jeep", "Other"];
const coverageTypes = ["Liability", "Comprehensive", "Collision", "Full Coverage", "Off-Road Specific"];
const specializations = ["Off-Road", "ATV/UTV", "Modified Vehicles", "Racing", "Commercial", "Classic Cars"];

export default function AdminInsurance() {
  const { user, userRole } = useAuth();
  const [isProviderDialogOpen, setIsProviderDialogOpen] = useState(false);
  const [isQuoteDialogOpen, setIsQuoteDialogOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<any>(null);
  const [editingQuote, setEditingQuote] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const providerForm = useForm<ProviderFormData>({
    defaultValues: {
      name: "",
      company_name: "",
      description: "",
      specializes_in: "",
      coverage_areas: "",
      rating: "",
      contact_phone: "",
      contact_email: "",
      website_url: "",
      logo_url: "",
    },
  });

  const quoteForm = useForm<QuoteFormData>({
    defaultValues: {
      provider_id: "",
      vehicle_type: "",
      coverage_type: "",
      state_code: "",
      monthly_premium: "",
      annual_premium: "",
      deductible: "",
      coverage_limit: "",
      min_age: "",
      max_age: "",
      min_experience_years: "",
      features: "",
      effective_date: "",
      expiry_date: "",
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

  const { data: providers, isLoading: providersLoading } = useQuery({
    queryKey: ["admin-insurance-providers", searchTerm],
    queryFn: async () => {
      let query = supabase.from("insurance_providers").select("*").order("created_at", { ascending: false });
      
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,company_name.ilike.%${searchTerm}%`);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const { data: quotes, isLoading: quotesLoading } = useQuery({
    queryKey: ["admin-insurance-quotes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("insurance_quotes")
        .select(`
          *,
          insurance_providers (
            name,
            company_name
          )
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Provider mutations
  const createProviderMutation = useMutation({
    mutationFn: async (data: ProviderFormData) => {
      const processedData = {
        ...data,
        specializes_in: data.specializes_in ? data.specializes_in.split(",").map(item => item.trim()) : [],
        coverage_areas: data.coverage_areas ? data.coverage_areas.split(",").map(item => item.trim()) : [],
        rating: data.rating ? parseFloat(data.rating.toString()) : null,
      };

      const { error } = await supabase.from("insurance_providers").insert(processedData);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-insurance-providers"] });
      toast({ title: "Insurance provider created successfully" });
      setIsProviderDialogOpen(false);
      providerForm.reset();
    },
    onError: (error: any) => {
      toast({ title: "Error creating provider", description: error.message, variant: "destructive" });
    },
  });

  // Quote mutations
  const createQuoteMutation = useMutation({
    mutationFn: async (data: QuoteFormData) => {
      const processedData = {
        ...data,
        monthly_premium: data.monthly_premium ? parseFloat(data.monthly_premium.toString()) : null,
        annual_premium: data.annual_premium ? parseFloat(data.annual_premium.toString()) : null,
        deductible: data.deductible ? parseFloat(data.deductible.toString()) : null,
        coverage_limit: data.coverage_limit ? parseFloat(data.coverage_limit.toString()) : null,
        min_age: data.min_age ? parseInt(data.min_age.toString()) : null,
        max_age: data.max_age ? parseInt(data.max_age.toString()) : null,
        min_experience_years: data.min_experience_years ? parseInt(data.min_experience_years.toString()) : null,
        features: data.features ? data.features.split(",").map(item => item.trim()) : [],
        effective_date: data.effective_date || null,
        expiry_date: data.expiry_date || null,
      };

      const { error } = await supabase.from("insurance_quotes").insert(processedData);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-insurance-quotes"] });
      toast({ title: "Insurance quote created successfully" });
      setIsQuoteDialogOpen(false);
      quoteForm.reset();
    },
    onError: (error: any) => {
      toast({ title: "Error creating quote", description: error.message, variant: "destructive" });
    },
  });

  const deleteProviderMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("insurance_providers").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-insurance-providers"] });
      toast({ title: "Provider deleted successfully" });
    },
  });

  const deleteQuoteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("insurance_quotes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-insurance-quotes"] });
      toast({ title: "Quote deleted successfully" });
    },
  });

  const onProviderSubmit = (data: ProviderFormData) => {
    createProviderMutation.mutate(data);
  };

  const onQuoteSubmit = (data: QuoteFormData) => {
    createQuoteMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Insurance Management</h1>
            <p className="text-muted-foreground">Manage insurance providers and quotes</p>
          </div>
        </div>

        <Tabs defaultValue="providers" className="space-y-6">
          <TabsList>
            <TabsTrigger value="providers">Insurance Providers</TabsTrigger>
            <TabsTrigger value="quotes">Insurance Quotes</TabsTrigger>
          </TabsList>

          <TabsContent value="providers" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search providers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Dialog open={isProviderDialogOpen} onOpenChange={setIsProviderDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Provider
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Insurance Provider</DialogTitle>
                  </DialogHeader>
                  <Form {...providerForm}>
                    <form onSubmit={providerForm.handleSubmit(onProviderSubmit)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={providerForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Provider Name</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Geico Off-Road" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={providerForm.control}
                          name="company_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company Name</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="GEICO" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={providerForm.control}
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

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={providerForm.control}
                          name="specializes_in"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Specializes In (comma-separated)</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Off-Road, ATV/UTV, Modified Vehicles" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={providerForm.control}
                          name="coverage_areas"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Coverage Areas (comma-separated)</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="CA, TX, FL, NY" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <FormField
                          control={providerForm.control}
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
                        <FormField
                          control={providerForm.control}
                          name="contact_phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="1-800-123-4567" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={providerForm.control}
                          name="contact_email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input {...field} type="email" placeholder="contact@provider.com" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={providerForm.control}
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
                          control={providerForm.control}
                          name="logo_url"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Logo URL</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="https://www.provider.com/logo.png" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <DialogFooter>
                        <Button type="submit" disabled={createProviderMutation.isPending}>
                          Create Provider
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            {providersLoading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-20 bg-muted rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {providers?.map((provider) => (
                  <Card key={provider.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        {provider.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{provider.company_name}</p>
                    </CardHeader>
                    <CardContent>
                      {provider.logo_url && (
                        <img
                          src={provider.logo_url}
                          alt={provider.name}
                          className="w-full h-16 object-contain mb-4"
                        />
                      )}
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {provider.description}
                      </p>
                      <div className="space-y-2 mb-4">
                        {provider.rating && (
                          <div className="flex justify-between text-sm">
                            <span>Rating:</span>
                            <span>{provider.rating}/5 ⭐</span>
                          </div>
                        )}
                        {provider.specializes_in && provider.specializes_in.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {provider.specializes_in.slice(0, 2).map((spec: string, index: number) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {spec}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteProviderMutation.mutate(provider.id)}
                          disabled={deleteProviderMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="quotes" className="space-y-6">
            <div className="flex justify-end">
              <Dialog open={isQuoteDialogOpen} onOpenChange={setIsQuoteDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Quote
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Insurance Quote</DialogTitle>
                  </DialogHeader>
                  <Form {...quoteForm}>
                    <form onSubmit={quoteForm.handleSubmit(onQuoteSubmit)} className="space-y-4">
                      <FormField
                        control={quoteForm.control}
                        name="provider_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Insurance Provider</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select provider" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {providers?.map((provider) => (
                                  <SelectItem key={provider.id} value={provider.id}>
                                    {provider.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={quoteForm.control}
                          name="vehicle_type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Vehicle Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select vehicle type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {vehicleTypes.map((type) => (
                                    <SelectItem key={type} value={type}>
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
                          control={quoteForm.control}
                          name="coverage_type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Coverage Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select coverage" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {coverageTypes.map((type) => (
                                    <SelectItem key={type} value={type}>
                                      {type}
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
                          control={quoteForm.control}
                          name="monthly_premium"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Monthly Premium ($)</FormLabel>
                              <FormControl>
                                <Input {...field} type="number" step="0.01" placeholder="150.00" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={quoteForm.control}
                          name="annual_premium"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Annual Premium ($)</FormLabel>
                              <FormControl>
                                <Input {...field} type="number" step="0.01" placeholder="1800.00" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={quoteForm.control}
                          name="deductible"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Deductible ($)</FormLabel>
                              <FormControl>
                                <Input {...field} type="number" placeholder="500" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <DialogFooter>
                        <Button type="submit" disabled={createQuoteMutation.isPending}>
                          Create Quote
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            {quotesLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {quotes?.map((quote) => (
                  <Card key={quote.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            {(quote as any).insurance_providers?.name || "Unknown Provider"}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {quote.vehicle_type} - {quote.coverage_type}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteQuoteMutation.mutate(quote.id)}
                          disabled={deleteQuoteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        {quote.monthly_premium && (
                          <div>
                            <span className="text-muted-foreground">Monthly:</span>
                            <p className="font-semibold">${quote.monthly_premium}</p>
                          </div>
                        )}
                        {quote.annual_premium && (
                          <div>
                            <span className="text-muted-foreground">Annual:</span>
                            <p className="font-semibold">${quote.annual_premium}</p>
                          </div>
                        )}
                        {quote.deductible && (
                          <div>
                            <span className="text-muted-foreground">Deductible:</span>
                            <p>${quote.deductible}</p>
                          </div>
                        )}
                        {quote.state_code && (
                          <div>
                            <span className="text-muted-foreground">State:</span>
                            <p>{quote.state_code}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {((providers && providers.length === 0) || (quotes && quotes.length === 0)) && (
          <Card className="p-8 text-center">
            <CardContent>
              <p className="text-muted-foreground">No insurance data found.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}