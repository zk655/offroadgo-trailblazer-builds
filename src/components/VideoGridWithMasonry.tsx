import React, { useState, useRef, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import VideoGridMasonry from '@/components/VideoGridMasonry';
import VideoPlayerAdvanced from '@/components/VideoPlayerAdvanced';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { AlertCircle, Loader2 } from 'lucide-react';

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

interface VideoGridWithMasonryProps {
  searchQuery: string;
  selectedTags: string[];
  sortBy: 'newest' | 'trending' | 'most_viewed';
  category: string;
}

const VideoGridWithMasonry: React.FC<VideoGridWithMasonryProps> = ({
  searchQuery,
  selectedTags,
  sortBy,
  category,
}) => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Build video query based on filters
  const buildVideoQuery = React.useCallback(() => {
    let query = supabase
      .from('videos')
      .select('*')
      .eq('status', 'active');

    // Apply search filter
    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
    }

    // Apply category filter
    if (category) {
      query = query.eq('category', category);
    }

    // Apply tag filters
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

  // Fetch videos with infinite scroll
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch
  } = useInfiniteQuery({
    queryKey: ['videos-grid', searchQuery, selectedTags, sortBy, category],
    queryFn: async ({ pageParam = 0 }) => {
      const query = buildVideoQuery();
      const { data, error } = await query.range(pageParam * 12, (pageParam * 12) + 11);
      
      if (error) throw error;
      return data as Video[];
    },
    getNextPageParam: (lastPage, pages) => {
      return lastPage.length === 12 ? pages.length : undefined;
    },
    initialPageParam: 0,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observerRef.current.observe(currentRef);
    }

    return () => {
      if (observerRef.current && currentRef) {
        observerRef.current.unobserve(currentRef);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Handle video play
  const handleVideoPlay = (video: Video) => {
    setSelectedVideo(video);
    setIsPlayerOpen(true);
  };

  // Handle video interactions
  const handleVideoInteraction = async (videoId: string, type: 'like' | 'view') => {
    try {
      const allVideos = data?.pages.flatMap(page => page) || [];
      const currentVideo = allVideos.find(v => v.id === videoId);
      
      if (currentVideo) {
        const field = type === 'like' ? 'likes' : 'views';
        const { error } = await supabase
          .from('videos')
          .update({ 
            [field]: (currentVideo[field] || 0) + 1
          })
          .eq('id', videoId);

        if (error) throw error;
      }
    } catch (error) {
      console.error(`Error updating ${type} count:`, error);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="aspect-video" />
            <div className="space-y-2">
              <Skeleton className="h-4" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <p className="text-lg font-semibold mb-2">Failed to load videos</p>
        <p className="text-muted-foreground mb-4">Please try again later</p>
        <Button onClick={() => refetch()} variant="outline">
          Try Again
        </Button>
      </div>
    );
  }

  // Flatten all pages of videos and map to expected format
  const allVideos = data?.pages.flatMap(page => page) || [];
  const mappedVideos = allVideos.map(video => ({
    ...video,
    view_count: video.views || 0,
    like_count: video.likes || 0,
    share_count: 0,
    save_count: 0,
  }));

  return (
    <>
      <VideoGridMasonry
        videos={mappedVideos}
        onPlay={(video) => handleVideoPlay(video as unknown as Video)}
        onLike={(videoId) => handleVideoInteraction(videoId, 'like')}
        onSave={() => {}}
        onShare={() => {}}
        loading={isLoading}
      />

      {/* Load More Trigger */}
      <div ref={loadMoreRef} className="flex justify-center py-8">
        {isFetchingNextPage && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading more videos...</span>
          </div>
        )}
      </div>

      {/* Video Player Modal */}
      <Dialog open={isPlayerOpen} onOpenChange={setIsPlayerOpen}>
        <DialogContent className="max-w-6xl w-full h-[90vh] p-0">
          {selectedVideo && (
            <div className="flex flex-col lg:flex-row h-full">
              <div className="flex-1 bg-black">
                <VideoPlayerAdvanced
                  videoId={selectedVideo.id}
                  videoUrl={selectedVideo.video_url || ''}
                  thumbnailUrl={selectedVideo.thumbnail_url || ''}
                  title={selectedVideo.title}
                  onViewTracked={() => {
                    handleVideoInteraction(selectedVideo.id, 'view');
                  }}
                />
              </div>
              
              <div className="w-full lg:w-80 p-6 bg-card border-l overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">{selectedVideo.title}</h2>
                <p className="text-muted-foreground mb-4">{selectedVideo.description}</p>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>Views: {(selectedVideo.views || 0).toLocaleString()}</span>
                    <span>Likes: {(selectedVideo.likes || 0).toLocaleString()}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {selectedVideo.tags?.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs">
                        #{tag}
                      </span>
                    ))}
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

export default VideoGridWithMasonry;
