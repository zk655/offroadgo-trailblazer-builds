import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import VideoCard from '@/components/VideoCard';
import VideoPlayerAdvanced from '@/components/VideoPlayerAdvanced';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { formatDuration } from '@/utils/videoHelpers';

interface Video {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  video_url: string | null;
  duration: number | null;
  tags: string[] | null;
  category: string | null;
  views: number | null;
  likes: number | null;
  status: string | null;
  created_at: string | null;
}

interface VideoGridProps {
  searchQuery?: string;
  selectedTags?: string[];
  sortBy?: 'newest' | 'trending' | 'most_viewed';
  category?: string;
}

const VIDEOS_PER_PAGE = 12;

const VideoGrid: React.FC<VideoGridProps> = ({
  searchQuery = '',
  selectedTags = [],
  sortBy = 'newest',
  category
}) => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

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

    // Apply category filter
    if (category) {
      query = query.eq('category', category);
    }

    // Apply tag filter
    if (selectedTags.length > 0) {
      query = query.overlaps('tags', selectedTags);
    }

    // Apply sorting
    switch (sortBy) {
      case 'trending':
      case 'most_viewed':
        query = query.order('views', { ascending: false });
        break;
      case 'newest':
      default:
        query = query.order('created_at', { ascending: false });
        break;
    }

    return query;
  }, [searchQuery, selectedTags, sortBy, category]);

  // Infinite query for videos with caching
  const {
    data: videosData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error
  } = useInfiniteQuery({
    queryKey: ['videos-grid', searchQuery, selectedTags, sortBy, category],
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
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    gcTime: 10 * 60 * 1000, // 10 minutes garbage collection
  });

  const videos = videosData?.pages.flatMap(page => page) || [];

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleVideoPlay = (video: Video) => {
    setSelectedVideo(video);
    setIsPlayerOpen(true);
  };

  const handleVideoInteraction = async (videoId: string, type: 'like' | 'view') => {
    try {
      const currentVideo = videos.find(v => v.id === videoId);
      if (currentVideo) {
        const field = type === 'like' ? 'likes' : 'views';
        const currentCount = currentVideo[field] || 0;
        await supabase
          .from('videos')
          .update({ [field]: currentCount + 1 })
          .eq('id', videoId);
      }
    } catch (error) {
      console.error(`Error ${type}ing video:`, error);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-video bg-muted rounded-lg mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">Error loading videos</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <>
      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map((video, index) => (
          <VideoCard
            key={video.id}
            video={{
              ...video,
              view_count: video.views || 0,
              like_count: video.likes || 0,
              share_count: 0,
              save_count: 0,
            }}
            onPlay={() => handleVideoPlay(video)}
            onLike={() => handleVideoInteraction(video.id, 'like')}
            onSave={() => {}}
            onShare={() => {}}
            priority={index < 4}
          />
        ))}
      </div>

      {/* Load More Trigger */}
      <div ref={loadMoreRef} className="flex justify-center py-8">
        {isFetchingNextPage && (
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading more videos...</span>
          </div>
        )}
      </div>

      {/* Video Player Modal */}
      <Dialog open={isPlayerOpen} onOpenChange={setIsPlayerOpen}>
        <DialogContent className="max-w-7xl w-[95vw] max-h-[95vh] p-0 overflow-hidden">
          {selectedVideo && (
            <div className="flex flex-col lg:flex-row h-[95vh]">
              {/* Video Player */}
              <div className="flex-1 bg-black min-h-0">
                <VideoPlayerAdvanced
                  videoId={selectedVideo.id}
                  videoUrl={selectedVideo.video_url || ''}
                  thumbnailUrl={selectedVideo.thumbnail_url || ''}
                  title={selectedVideo.title}
                  autoPlay={true}
                  className="w-full h-full"
                  onViewTracked={() => {
                    setSelectedVideo(prev => prev ? {
                      ...prev,
                      views: (prev.views || 0) + 1
                    } : null);
                  }}
                />
              </div>

              {/* Video Info Sidebar */}
              <div className="w-full lg:w-80 xl:w-96 bg-background border-l flex flex-col max-h-full">
                <div className="p-4 md:p-6 overflow-y-auto flex-1">
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-lg md:text-xl font-bold leading-tight">{selectedVideo.title}</h2>
                      {selectedVideo.description && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                          {selectedVideo.description}
                        </p>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-2 md:gap-4 text-center">
                      <div>
                        <div className="text-lg md:text-2xl font-bold text-primary">
                          {(selectedVideo.views || 0).toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">Views</div>
                      </div>
                      <div>
                        <div className="text-lg md:text-2xl font-bold text-primary">
                          {(selectedVideo.likes || 0).toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">Likes</div>
                      </div>
                    </div>

                    {/* Tags */}
                    {selectedVideo.tags && selectedVideo.tags.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-2">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedVideo.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-muted rounded-md text-xs"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Video Details */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Duration:</span>
                        <span>{formatDuration(selectedVideo.duration || 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Category:</span>
                        <span className="capitalize">{selectedVideo.category || 'General'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Published:</span>
                        <span>{selectedVideo.created_at ? new Date(selectedVideo.created_at).toLocaleDateString() : 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VideoGrid;
