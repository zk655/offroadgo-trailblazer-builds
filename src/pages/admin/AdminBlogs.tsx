import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getLiveBlogContent } from "@/services/blogService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Plus, Search, Eye, X } from "lucide-react";
import ImageUploadDropzone from "@/components/ImageUploadDropzone";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import AdminHeader from "@/components/AdminHeader";
import BlogEditor from "@/components/BlogEditor";

interface BlogFormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  tags: string;
  cover_image: string;
  external_url: string;
  published_at: string;
  images: string[];
}

export default function AdminBlogs() {
  const { user, userRole, loading, roleLoading } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewingBlog, setViewingBlog] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<BlogFormData>({
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      author: "",
      tags: "",
      cover_image: "",
      external_url: "",
      published_at: "",
      images: [],
    },
  });

  const { data: blogs, isLoading } = useQuery({
    queryKey: ["admin-blogs", searchTerm],
    queryFn: async () => {
      try {
        // Get live content first (external sources)
        const liveContent = await getLiveBlogContent();
        
        // Get local database content with proper ordering
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Combine live and local content, ensuring local content comes first
        let allPosts = [...(data || []), ...liveContent];
        
        // Apply search filter if provided
        if (searchTerm) {
          allPosts = allPosts.filter(post => 
            post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        
        return allPosts;
      } catch (error) {
        console.error('Error fetching posts:', error);
        return [];
      }
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: BlogFormData) => {
      // Generate slug from title if not provided
      let slug = data.slug;
      if (!slug && data.title) {
        slug = data.title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-+|-+$/g, '');
      }
      
      const { error } = await supabase.from("blogs").insert({
        ...data,
        slug,
        tags: data.tags ? data.tags.split(",").map(tag => tag.trim()) : [],
        published_at: data.published_at || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blogs"] }); // Invalidate blog page cache
      toast({ title: "Blog created successfully" });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({ title: "Error creating blog", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: BlogFormData }) => {
      // Generate slug from title if not provided
      let slug = data.slug;
      if (!slug && data.title) {
        slug = data.title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-+|-+$/g, '');
      }
      
      const { error } = await supabase.from("blogs").update({
        ...data,
        slug,
        tags: data.tags ? data.tags.split(",").map(tag => tag.trim()) : [],
        published_at: data.published_at || null,
      }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blogs"] }); // Invalidate blog page cache
      toast({ title: "Blog updated successfully" });
      setIsDialogOpen(false);
      setEditingBlog(null);
      form.reset();
    },
    onError: (error: any) => {
      toast({ title: "Error updating blog", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // Check if this is a database blog (UUID format) or external content
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
      
      if (!isUUID) {
        throw new Error("Cannot delete external content. Only database blogs can be deleted.");
      }
      
      const { error } = await supabase.from("blogs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blogs"] }); // Invalidate blog page cache
      toast({ title: "Blog deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error deleting blog", description: error.message, variant: "destructive" });
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

  const onSubmit = (data: BlogFormData) => {
    if (editingBlog) {
      updateMutation.mutate({ id: editingBlog.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (blog: any) => {
    setEditingBlog(blog);
    form.reset({
      title: blog.title || "",
      slug: blog.slug || "",
      content: blog.content || "",
      excerpt: blog.excerpt || "",
      author: blog.author || "",
      tags: blog.tags ? blog.tags.join(", ") : "",
      cover_image: blog.cover_image || "",
      external_url: blog.external_url || "",
      published_at: blog.published_at ? new Date(blog.published_at).toISOString().slice(0, 16) : "",
      images: [],
    });
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingBlog(null);
    form.reset();
    setIsDialogOpen(true);
  };

  const handleView = (blog: any) => {
    setViewingBlog(blog);
    setIsViewDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <AdminHeader
          title="Blog Management"
          description="Manage your blog posts and articles"
          action={
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleCreate}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Blog Post
                </Button>
              </DialogTrigger>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingBlog ? "Edit Blog Post" : "Create New Blog Post"}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Blog post title" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Slug</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="blog-post-url-slug" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="excerpt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Excerpt</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Short description..." rows={3} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                           <BlogEditor
                             content={field.value}
                             onChange={field.onChange}
                             blogId={editingBlog?.id}
                           />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="author"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Author</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Author name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="tags"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tags (comma-separated)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="off-road, adventure, tips" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="cover_image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cover Image</FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            <Input {...field} placeholder="https://example.com/image.jpg" />
                            <ImageUploadDropzone
                              onImageUploaded={(url) => field.onChange(url)}
                              blogId={editingBlog?.id}
                              variant="compact"
                            />
                            {field.value && (
                              <div className="relative">
                                <img 
                                  src={field.value} 
                                  alt="Cover preview" 
                                  className="w-full h-32 object-cover rounded-lg"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  className="absolute top-2 right-2"
                                  onClick={() => field.onChange("")}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </div>
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
                        <FormLabel>External URL (optional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="https://external-link.com" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="published_at"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Publish Date (optional)</FormLabel>
                        <FormControl>
                          <Input {...field} type="datetime-local" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                      {editingBlog ? "Update" : "Create"} Blog Post
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
            </Dialog>
          }
        />

        <div className="mb-6 space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Showing {blogs?.length || 0} total blog posts 
              <span className="text-xs ml-2">(Includes database blogs and live external content)</span>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search blogs by title or author..."
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
                    <div className="h-3 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded w-4/5"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {blogs?.map((blog) => (
              <Card key={blog.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="line-clamp-2">{blog.title}</CardTitle>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>By {blog.author || "Unknown"}</span>
                    <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {blog.excerpt || "No excerpt available"}
                  </p>
                  {blog.tags && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {blog.tags.slice(0, 3).map((tag: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Badge variant={blog.published_at ? "default" : "outline"}>
                        {blog.published_at ? "Published" : "Draft"}
                      </Badge>
                      {blog.external_url && (
                        <Badge variant="secondary" className="text-xs">
                          External
                        </Badge>
                      )}
                      {blog.id.startsWith('live-') && (
                        <Badge variant="secondary" className="text-xs">
                          Live Content
                        </Badge>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(blog)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(blog)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteMutation.mutate(blog.id)}
                        disabled={deleteMutation.isPending || !(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(blog.id))}
                        title={!(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(blog.id)) ? "Cannot delete external content" : "Delete blog"}
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

        {blogs && blogs.length === 0 && !isLoading && (
          <Card className="p-8 text-center">
            <CardContent>
              <p className="text-muted-foreground">
                {searchTerm ? "No blog posts found matching your search." : "No blog posts found."}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                This view shows both database blogs and live external content, synchronized with the main blog page.
              </p>
            </CardContent>
          </Card>
        )}

        {/* View Blog Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{viewingBlog?.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>By {viewingBlog?.author || "Unknown"}</span>
                <span>{viewingBlog?.created_at ? new Date(viewingBlog.created_at).toLocaleDateString() : ""}</span>
              </div>
              
              {viewingBlog?.cover_image && (
                <img 
                  src={viewingBlog.cover_image} 
                  alt={viewingBlog.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
              )}
              
              {viewingBlog?.excerpt && (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Excerpt</h3>
                  <p className="text-muted-foreground">{viewingBlog.excerpt}</p>
                </div>
              )}
              
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: viewingBlog?.content || "" }} />
              </div>
              
              {viewingBlog?.tags && viewingBlog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  <span className="text-sm font-medium">Tags:</span>
                  {viewingBlog.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}