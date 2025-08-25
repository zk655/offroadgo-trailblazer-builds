import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import AdminHeader from "@/components/AdminHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import VideoUploadDropzone from "@/components/VideoUploadDropzone";
import { Plus, Edit, Trash2, Search, Video, Clock, Eye, Heart } from "lucide-react";
import { formatDuration } from "@/utils/videoHelpers";

interface VideoFormData {
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  category: string;
  tags: string[];
  duration: number;
  resolution: string;
  status: 'active' | 'draft' | 'archived';
  seo_title: string;
  seo_description: string;
  seo_keywords: string[];
}

export default function AdminVideos() {
  // ALL HOOKS MUST BE CALLED AT THE TOP LEVEL - BEFORE ANY CONDITIONAL LOGIC
  const { user, userRole, loading, roleLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State hooks
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<any>(null);

  // Form hook
  const form = useForm<VideoFormData>({
    defaultValues: {
      title: "",
      description: "",
      video_url: "",
      thumbnail_url: "",
      category: "",
      tags: [],
      duration: 0,
      resolution: "1080p",
      status: "draft",
      seo_title: "",
      seo_description: "",
      seo_keywords: []
    }
  });

  // Query hook
  const { data: videos, isLoading } = useQuery({
    queryKey: ['admin-videos', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !loading && !roleLoading && !!user && (userRole === 'admin' || userRole === 'editor')
  });

  // Mutation hooks
  const createMutation = useMutation({
    mutationFn: async (data: VideoFormData) => {
      const { error } = await supabase.from('videos').insert([{
        ...data,
        tags: data.tags,
        seo_keywords: data.seo_keywords
      }]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-videos'] });
      toast({
        title: "Success",
        description: "Video created successfully",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create video",
        variant: "destructive",
      });
      console.error('Error creating video:', error);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (data: VideoFormData) => {
      const { error } = await supabase
        .from('videos')
        .update({
          ...data,
          tags: data.tags,
          seo_keywords: data.seo_keywords,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingVideo.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-videos'] });
      toast({
        title: "Success",
        description: "Video updated successfully",
      });
      setIsDialogOpen(false);
      setEditingVideo(null);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update video",
        variant: "destructive",
      });
      console.error('Error updating video:', error);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (videoId: string) => {
      const { error } = await supabase.from('videos').delete().eq('id', videoId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-videos'] });
      toast({
        title: "Success",
        description: "Video deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete video",
        variant: "destructive",
      });
      console.error('Error deleting video:', error);
    }
  });

  // CONDITIONAL LOGIC AND EARLY RETURNS AFTER ALL HOOKS
  if (loading || roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || (userRole !== 'admin' && userRole !== 'editor')) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-muted-foreground mb-4">You don't have permission to access this page.</p>
          <Button onClick={() => window.location.href = '/auth'}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  // EVENT HANDLERS
  const onSubmit = (data: VideoFormData) => {
    if (editingVideo) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (video: any) => {
    setEditingVideo(video);
    form.reset({
      title: video.title,
      description: video.description || "",
      video_url: video.video_url,
      thumbnail_url: video.thumbnail_url || "",
      category: video.category || "",
      tags: video.tags || [],
      duration: video.duration || 0,
      resolution: video.resolution || "1080p",
      status: video.status,
      seo_title: video.seo_title || "",
      seo_description: video.seo_description || "",
      seo_keywords: video.seo_keywords || []
    });
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingVideo(null);
    form.reset();
    setIsDialogOpen(true);
  };

  const handleTagInput = (value: string, field: any) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
    field.onChange(tags);
  };

  const handleVideoUpload = async (videoUrl: string) => {
    try {
      // The video upload hook now handles database creation and processing
      toast({
        title: "Success",
        description: "Video uploaded and processing started",
      });
      
      // Refresh the videos list
      queryClient.invalidateQueries({ queryKey: ['admin-videos'] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process video upload",
        variant: "destructive",
      });
    }
  };
  // RENDER
  return (
    <div className="container mx-auto px-4 py-8">
      <AdminHeader
        title="Video Management"
        description="Manage your video content library"
        action={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleCreate}>
                <Plus className="mr-2 h-4 w-4" />
                Add Video
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingVideo ? 'Edit Video' : 'Add New Video'}
                </DialogTitle>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title *</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter video title" {...field} />
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
                              <Textarea 
                                placeholder="Enter video description" 
                                className="min-h-20"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="offroad">Off-Road</SelectItem>
                                <SelectItem value="review">Review</SelectItem>
                                <SelectItem value="tutorial">Tutorial</SelectItem>
                                <SelectItem value="adventure">Adventure</SelectItem>
                                <SelectItem value="modification">Modification</SelectItem>
                                <SelectItem value="maintenance">Maintenance</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tags (comma separated)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="jeep, offroad, 4x4"
                                value={field.value?.join(', ') || ''}
                                onChange={(e) => handleTagInput(e.target.value, field)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="video_url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Video Upload</FormLabel>
                            <FormControl>
                              <div className="space-y-2">
                                <VideoUploadDropzone
                                  onVideoUploaded={(url) => {
                                    field.onChange(url);
                                    handleVideoUpload(url);
                                  }}
                                  variant="compact"
                                />
                                {field.value && (
                                  <Input 
                                    placeholder="Video URL" 
                                    value={field.value}
                                    onChange={(e) => field.onChange(e.target.value)}
                                  />
                                )}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="thumbnail_url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Thumbnail URL</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter thumbnail URL" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="duration"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Duration (seconds)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="300"
                                  {...field}
                                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="resolution"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Resolution</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="720p">720p</SelectItem>
                                  <SelectItem value="1080p">1080p</SelectItem>
                                  <SelectItem value="1440p">1440p</SelectItem>
                                  <SelectItem value="4K">4K</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="archived">Archived</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* SEO Section */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">SEO Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="seo_title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SEO Title</FormLabel>
                            <FormControl>
                              <Input placeholder="SEO optimized title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="seo_keywords"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SEO Keywords (comma separated)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="keyword1, keyword2, keyword3"
                                value={field.value?.join(', ') || ''}
                                onChange={(e) => handleTagInput(e.target.value, field)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="seo_description"
                        render={({ field }) => (
                          <FormItem className="col-span-full">
                            <FormLabel>SEO Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="SEO meta description" 
                                className="min-h-16"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createMutation.isPending || updateMutation.isPending}
                    >
                      {createMutation.isPending || updateMutation.isPending ? (
                        <>Loading...</>
                      ) : (
                        editingVideo ? 'Update Video' : 'Create Video'
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search videos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Videos Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-muted rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : videos && videos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <Card key={video.id} className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{video.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={video.status === 'active' ? 'default' : video.status === 'draft' ? 'secondary' : 'outline'}>
                        {video.status}
                      </Badge>
                      {video.category && (
                        <Badge variant="outline" className="capitalize">
                          {video.category}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(video)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => deleteMutation.mutate(video.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {video.thumbnail_url && (
                  <div className="aspect-video bg-muted rounded-lg mb-4 overflow-hidden">
                    <img 
                      src={video.thumbnail_url} 
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                {video.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {video.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-4">
                    {video.duration && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDuration(video.duration)}
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {video.view_count || 0}
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {video.like_count || 0}
                    </div>
                  </div>
                  {video.resolution && (
                    <Badge variant="outline" className="text-xs">
                      {video.resolution}
                    </Badge>
                  )}
                </div>

                {video.tags && video.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {video.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                    {video.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{video.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Processing Status */}
                {video.processing_status && video.processing_status !== 'completed' && (
                  <div className="mt-2">
                    <Badge variant="outline" className="text-xs">
                      {video.processing_status === 'pending' && '⏳ Processing...'}
                      {video.processing_status === 'processing' && '🔄 Processing...'}
                      {video.processing_status === 'failed' && '❌ Failed'}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Video className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No videos found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? 'No videos match your search criteria.' : 'Get started by adding your first video.'}
          </p>
          {!searchTerm && (
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Add Video
            </Button>
          )}
        </div>
      )}
    </div>
  );
}