import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import VideoCard from '@/components/VideoCard';
import VideoLightbox from '@/components/VideoLightbox';
import VideoFilters from '@/components/VideoFilters';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Grid, Filter } from 'lucide-react';
import { toast } from 'sonner';

interface Video {
  id: string;
  title: string;
  description: string;
  slug: string;
  thumbnail_url: string;
  video_url: string;
  duration: number;
  tags: string[];
  category: string;
  view_count: number;
  like_count: number;
  share_count: number;
  save_count: number;
  is_featured: boolean;
  is_trending: boolean;
  created_at: string;
  published_at: string;
}

interface VideoTag {
  id: string;
  name: string;
  slug: string;
  color: string;
  usage_count: number;
}

const VIDEOS_PER_PAGE = 12;

const Videos = () => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'newest' | 'trending' | 'most_viewed'>('newest');
  const [showFilters, setShowFilters] = useState(false);

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
    }
  });

  // Build query for videos with filters
  const buildVideoQuery = useCallback(() => {
    let query = supabase
      .from('videos')
      .select('*')
      .eq('status', 'active');

    // Apply search filter
    if (searchQuery.trim()) {
      query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
    }

    // Apply tag filter
    if (selectedTags.length > 0) {
      query = query.overlaps('tags', selectedTags);
    }

    // Apply sorting
    switch (sortBy) {
      case 'trending':
        query = query.eq('is_trending', true).order('view_count', { ascending: false });
        break;
      case 'most_viewed':
        query = query.order('view_count', { ascending: false });
        break;
      case 'newest':
      default:
        query = query.order('published_at', { ascending: false });
        break;
    }

    return query;
  }, [searchQuery, selectedTags, sortBy]);

  // Infinite query for videos
  const {
    data: videosData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error
  } = useInfiniteQuery({
    queryKey: ['videos', searchQuery, selectedTags, sortBy],
    queryFn: async ({ pageParam = 0 }) => {
      const query = buildVideoQuery();
      const { data, error } = await query
        .range(pageParam * VIDEOS_PER_PAGE, (pageParam + 1) * VIDEOS_PER_PAGE - 1);
      
      if (error) throw error;
      return data as Video[];
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === VIDEOS_PER_PAGE ? allPages.length : undefined;
    },
    initialPageParam: 0
  });

  const videos = videosData?.pages.flatMap(page => page) || [];

  // Handle video interaction (like, save, share)
  const handleVideoInteraction = async (videoId: string, type: 'like' | 'save' | 'share') => {
    try {
      const { error } = await supabase
        .from('video_interactions')
        .upsert({
          video_id: videoId,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          interaction_type: type
        });

      if (error) throw error;

      // Update video counts - simplified approach
      const currentVideo = videos.find(v => v.id === videoId);
      const currentCount = currentVideo?.[`${type}_count` as keyof Video] as number || 0;
      const { error: updateError } = await supabase
        .from('videos')
        .update({ [`${type}_count`]: currentCount + 1 })
        .eq('id', videoId);

      if (updateError) console.warn('Failed to update count:', updateError);

      toast.success(`Video ${type}d successfully!`);
    } catch (error) {
      console.error(`Error ${type}ing video:`, error);
      toast.error(`Failed to ${type} video. Please try again.`);
    }
  };

  // Handle video view tracking
  const handleVideoView = async (video: Video) => {
    setSelectedVideo(video);
    
    try {
      // Track view interaction - just increment view count directly
      const { error } = await supabase
        .from('videos')
        .update({ view_count: video.view_count + 1 })
        .eq('id', video.id);
      
      if (error) console.warn('Failed to track view:', error);
    } catch (error) {
      console.error('Error tracking video view:', error);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">Error Loading Videos</h1>
            <p className="text-muted-foreground">Please try again later.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
        <section className="relative bg-gradient-to-br from-primary/10 via-background to-accent/5 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Off-Road <span className="text-primary">Videos</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Discover epic adventures, detailed builds, and expert reviews from the off-road community
              </p>
              
              {/* Search Bar */}
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search videos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-3 text-base"
                />
              </div>
            </div>
          </div>
        </section>

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
                
                <div className="flex items-center gap-2">
                  <Grid className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {videos.length} videos
                  </span>
                </div>
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

        {/* Videos Grid */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-video bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : videos.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-xl font-semibold mb-2">No videos found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                  {videos.map((video, index) => (
                    <VideoCard
                      key={video.id}
                      video={video}
                      onPlay={() => handleVideoView(video)}
                      onLike={() => handleVideoInteraction(video.id, 'like')}
                      onSave={() => handleVideoInteraction(video.id, 'save')}
                      onShare={() => handleVideoInteraction(video.id, 'share')}
                      priority={index < 8}
                    />
                  ))}
                </div>

                {/* Load More Button */}
                {hasNextPage && (
                  <div className="text-center">
                    <Button
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                      variant="outline"
                      size="lg"
                    >
                      {isFetchingNextPage ? 'Loading...' : 'Load More Videos'}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Video Lightbox */}
        {selectedVideo && (
          <VideoLightbox
            video={selectedVideo}
            isOpen={!!selectedVideo}
            onClose={() => setSelectedVideo(null)}
            onLike={() => handleVideoInteraction(selectedVideo.id, 'like')}
            onSave={() => handleVideoInteraction(selectedVideo.id, 'save')}
            onShare={() => handleVideoInteraction(selectedVideo.id, 'share')}
          />
        )}

        <Footer />
      </div>
    </>
  );
};

export default Videos;