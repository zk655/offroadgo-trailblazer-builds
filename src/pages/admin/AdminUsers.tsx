import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, UserPlus, Search, User, Shield, Settings, Edit, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import AdminHeader from "@/components/AdminHeader";

interface RoleFormData {
  user_id: string;
  role: string;
}

interface UserFormData {
  email: string;
  password: string;
  full_name: string;
  username: string;
  role: string;
}

interface EditPasswordFormData {
  password: string;
}

export default function AdminUsers() {
  const { user, userRole, loading, roleLoading } = useAuth();
  
  // Handle loading state first, before any other hooks
  if (loading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Handle authentication early, before other hooks
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Handle authorization early, before other hooks - allow both admins and editors
  if (userRole !== "admin" && userRole !== "editor") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-destructive">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You don't have permission to access this page. Admin or Editor access required.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Now we can safely use all hooks after the early returns
  return <AdminUsersContent />;
}

function AdminUsersContent() {
  const { user, userRole } = useAuth(); // Get user context and role in this component too
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditPasswordDialogOpen, setIsEditPasswordDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const roleForm = useForm<RoleFormData>({
    defaultValues: {
      user_id: "",
      role: "",
    },
  });

  const userForm = useForm<UserFormData>({
    defaultValues: {
      email: "",
      password: "",
      full_name: "",
      username: "",
      role: "user",
    },
  });

  const passwordForm = useForm<EditPasswordFormData>({
    defaultValues: {
      password: "",
    },
  });

  const { data: profiles, isLoading: profilesLoading } = useQuery({
    queryKey: ["admin-profiles", searchTerm],
    queryFn: async () => {
      let query = supabase.from("profiles").select("*").order("created_at", { ascending: false });
      
      if (searchTerm) {
        query = query.or(`username.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%`);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const { data: userRoles, isLoading: rolesLoading } = useQuery({
    queryKey: ["admin-user-roles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select(`
          *,
          profiles (
            username,
            full_name
          )
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const createRoleMutation = useMutation({
    mutationFn: async (data: RoleFormData) => {
      const { error } = await supabase.from("user_roles").insert({
        user_id: data.user_id,
        role: data.role as 'admin' | 'editor' | 'user'
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-user-roles"] });
      toast({ title: "User role assigned successfully" });
      setIsRoleDialogOpen(false);
      roleForm.reset();
    },
    onError: (error: any) => {
      toast({ title: "Error assigning role", description: error.message, variant: "destructive" });
    },
  });

  const deleteRoleMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("user_roles").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-user-roles"] });
      toast({ title: "User role removed successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error removing role", description: error.message, variant: "destructive" });
    },
  });

  const createUserMutation = useMutation({
    mutationFn: async (data: UserFormData) => {
      // Get the current user's session token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No active session');

      // Call the edge function to create user with admin privileges
      const response = await fetch('https://muzlggruqnlackmbrswp.supabase.co/functions/v1/admin-create-user', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          full_name: data.full_name,
          username: data.username,
          role: data.role,
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create user');
      }
      
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-profiles"] });
      queryClient.invalidateQueries({ queryKey: ["admin-user-roles"] });
      toast({ title: "User created successfully" });
      setIsAddUserDialogOpen(false);
      userForm.reset();
    },
    onError: (error: any) => {
      toast({ title: "Error creating user", description: error.message, variant: "destructive" });
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: async ({ userId, password }: { userId: string; password: string }) => {
      // For security, users should change their own passwords
      // This is a limitation when using client-side auth without service role
      throw new Error("Password updates require service role access. Users should reset their password via email.");
    },
    onSuccess: () => {
      toast({ title: "Password updated successfully" });
      setIsEditPasswordDialogOpen(false);
      passwordForm.reset();
      setSelectedUserId("");
    },
    onError: (error: any) => {
      toast({ title: "Error updating password", description: error.message, variant: "destructive" });
    },
  });

  const onRoleSubmit = (data: RoleFormData) => {
    createRoleMutation.mutate(data);
  };

  const onUserSubmit = (data: UserFormData) => {
    createUserMutation.mutate(data);
  };

  const onPasswordSubmit = (data: EditPasswordFormData) => {
    updatePasswordMutation.mutate({ userId: selectedUserId, password: data.password });
  };

  const handleEditPassword = (userId: string) => {
    setSelectedUserId(userId);
    setIsEditPasswordDialogOpen(true);
  };

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case "admin": return "bg-red-500";
      case "editor": return "bg-blue-500";
      case "user": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <AdminHeader
          title="User Management"
          description="Manage user profiles and permissions"
        />

        <Tabs defaultValue="profiles" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profiles">User Profiles</TabsTrigger>
            <TabsTrigger value="roles">User Roles</TabsTrigger>
          </TabsList>

          <TabsContent value="profiles" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users by username or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                  </DialogHeader>
                  <Form {...userForm}>
                    <form onSubmit={userForm.handleSubmit(onUserSubmit)} className="space-y-4">
                      <FormField
                        control={userForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="user@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={userForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Enter password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={userForm.control}
                        name="full_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={userForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="johndoe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={userForm.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Role</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                              </FormControl>
                               <SelectContent>
                                 <SelectItem value="user">User</SelectItem>
                                 <SelectItem value="editor">Editor</SelectItem>
                                 {userRole === "admin" && (
                                   <SelectItem value="admin">Admin</SelectItem>
                                 )}
                               </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <DialogFooter>
                        <Button type="submit" disabled={createUserMutation.isPending}>
                          Create User
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            {profilesLoading ? (
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
                {profiles?.map((profile) => (
                  <Card key={profile.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        {profile.full_name || profile.username || "Unknown User"}
                      </CardTitle>
                      {profile.username && profile.full_name && (
                        <p className="text-sm text-muted-foreground">@{profile.username}</p>
                      )}
                    </CardHeader>
                    <CardContent>
                      {profile.avatar_url && (
                        <img
                          src={profile.avatar_url}
                          alt={profile.full_name || profile.username}
                          className="w-16 h-16 rounded-full mb-4 mx-auto"
                        />
                      )}
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span>Joined:</span>
                          <span>{new Date(profile.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>User ID:</span>
                          <span className="font-mono text-xs">{profile.id.slice(0, 8)}...</span>
                        </div>
                      </div>
                      <div className="flex justify-center">
                        <p className="text-xs text-muted-foreground">Users can reset passwords via email</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {profiles && profiles.length === 0 && (
              <Card className="p-8 text-center">
                <CardContent>
                  <p className="text-muted-foreground">No user profiles found.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="roles" className="space-y-6">
            <div className="flex justify-end">
              <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Assign Role
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Assign User Role</DialogTitle>
                  </DialogHeader>
                  <Form {...roleForm}>
                    <form onSubmit={roleForm.handleSubmit(onRoleSubmit)} className="space-y-4">
                      <FormField
                        control={roleForm.control}
                        name="user_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>User</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select user" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {profiles?.map((profile) => (
                                  <SelectItem key={profile.id} value={profile.id}>
                                    {profile.full_name || profile.username || `User ${profile.id.slice(0, 8)}`}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={roleForm.control}
                        name="role"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Role</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                              </FormControl>
                               <SelectContent>
                                 {userRole === "admin" && (
                                   <SelectItem value="admin">Admin</SelectItem>
                                 )}
                                 <SelectItem value="editor">Editor</SelectItem>
                                 <SelectItem value="user">User</SelectItem>
                               </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <DialogFooter>
                        <Button type="submit" disabled={createRoleMutation.isPending}>
                          Assign Role
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            {rolesLoading ? (
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
                {userRoles?.map((roleEntry) => (
                  <Card key={roleEntry.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            {(roleEntry as any).profiles?.full_name || 
                             (roleEntry as any).profiles?.username || 
                             `User ${roleEntry.user_id.slice(0, 8)}`}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            User ID: {roleEntry.user_id.slice(0, 8)}...
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${getRoleColor(roleEntry.role)} text-white`}>
                            {roleEntry.role}
                          </Badge>
                          {/* Only allow deletion if user has permission */}
                          {(userRole === "admin" || (userRole === "editor" && roleEntry.role !== "admin")) && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteRoleMutation.mutate(roleEntry.id)}
                              disabled={deleteRoleMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Role assigned: {new Date(roleEntry.created_at).toLocaleDateString()}</span>
                        {roleEntry.user_id === user?.id && (
                          <Badge variant="outline" className="text-xs">
                            You
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {userRoles && userRoles.length === 0 && (
              <Card className="p-8 text-center">
                <CardContent>
                  <p className="text-muted-foreground">No user roles assigned yet.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Edit Password Dialog */}
        <Dialog open={isEditPasswordDialogOpen} onOpenChange={setIsEditPasswordDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Update User Password</DialogTitle>
            </DialogHeader>
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                <FormField
                  control={passwordForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter new password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="submit" disabled={updatePasswordMutation.isPending}>
                    Update Password
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}