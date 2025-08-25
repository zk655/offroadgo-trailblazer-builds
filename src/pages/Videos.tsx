import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import VideoGrid from '@/components/VideoGrid';
import VideoFilters from '@/components/VideoFilters';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Grid, Filter, Upload, Video as VideoIcon, Play } from 'lucide-react';
import { toast } from 'sonner';
import VideoUploadDropzone from '@/components/VideoUploadDropzone';
import AdPlacement from '@/components/AdPlacement';


interface VideoTag {
  id: string;
  name: string;
  slug: string;
  color: string;
  usage_count: number;
}


const Videos = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'newest' | 'trending' | 'most_viewed'>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const queryClient = useQueryClient();

  // Fetch video tags
  const { data: videoTags = [] } = useQuery({
    queryKey: ['video-tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('video_tags')
        .select('*')
        .order('usage_count', { ascending: false });
      
      if (error) throw error;
      return data as VideoTag[];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes cache
  });

  // Fetch video categories
  const { data: categories = [] } = useQuery({
    queryKey: ['video-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('videos')
        .select('category')
        .not('category', 'is', null);
      
      if (error) throw error;
      
      const uniqueCategories = [...new Set(data.map(v => v.category))];
      return uniqueCategories.filter(Boolean);
    },
    staleTime: 15 * 60 * 1000, // 15 minutes cache
  });

  // Handle video upload
  const handleVideoUpload = async (videoUrl: string) => {
    try {
      toast.success('Video uploaded successfully! Processing thumbnail and metadata...');
      setShowUpload(false);
      
      // Refresh videos list
      queryClient.invalidateQueries({ queryKey: ['videos-grid'] });
    } catch (error) {
      console.error('Error creating video entry:', error);
      toast.error('Failed to process video upload');
    }
  };

  // Clear search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      // Trigger re-fetch when search changes
      queryClient.invalidateQueries({ queryKey: ['videos-grid'] });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, queryClient]);

  return (
    <>
      <SEO 
        title="Off-Road Videos - OffroadGo"
        description="Watch the best off-road adventures, vehicle reviews, and trail guides. From Jeep builds to overlanding tips, discover amazing off-road content."
        keywords="off-road videos, jeep videos, overlanding, mud terrain, rock crawling, vehicle builds"
      />
      
      <div className="min-h-screen bg-background">
        <Navigation />
        
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/5 py-16 pt-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Play className="h-8 w-8 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Premium Video Content</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Off-Road <span className="text-primary">Videos</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Discover epic adventures, detailed builds, and expert reviews from the off-road community
              </p>
              
              {/* Search and Upload Bar */}
              <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search videos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-3 text-base"
                  />
                </div>
                <Button
                  onClick={() => setShowUpload(true)}
                  size="lg"
                  className="px-6 py-3 text-base"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Video
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Ad Section - After Hero */}
        <section className="py-4 md:py-6 bg-muted/5">
          <div className="container mx-auto px-4">
            <AdPlacement position="top" pageType="other" />
          </div>
        </section>

        {/* Categories Section */}
        {categories.length > 0 && (
          <section className="py-8 bg-muted/20">
            <div className="container mx-auto px-4">
              <div className="flex flex-wrap gap-2 justify-center">
                <Button
                  variant={selectedCategory === '' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('')}
                >
                  All Videos
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="capitalize"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </section>
        )}
        {/* Filters and Controls */}
        <section className="border-b bg-card/50">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </div>

              <VideoFilters
                sortBy={sortBy}
                onSortChange={setSortBy}
                selectedTags={selectedTags}
                onTagsChange={setSelectedTags}
                videoTags={videoTags}
                isVisible={showFilters}
              />
            </div>
          </div>
        </section>

        {/* Ad Section - After Filters */}
        <section className="py-4 md:py-6 bg-muted/10">
          <div className="container mx-auto px-4">
            <AdPlacement position="middle" pageType="other" />
          </div>
        </section>

        {/* Videos Grid */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <VideoGrid
              searchQuery={searchQuery}
              selectedTags={selectedTags}
              sortBy={sortBy}
              category={selectedCategory}
            />
          </div>
        </section>

        {/* Ad Section - After Videos */}
        <section className="py-4 md:py-6 bg-muted/5">
          <div className="container mx-auto px-4">
            <AdPlacement position="bottom" pageType="other" />
          </div>
        </section>

        {/* Video Upload Modal */}
        {showUpload && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-background rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">Upload Video</h3>
              <VideoUploadDropzone
                onVideoUploaded={handleVideoUpload}
              />
              <Button
                variant="outline"
                onClick={() => setShowUpload(false)}
                className="w-full mt-4"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}


        <Footer />
      </div>
    </>
  );
};

export default Videos;