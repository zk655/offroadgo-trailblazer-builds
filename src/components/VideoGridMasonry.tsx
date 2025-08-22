import React, { useState, useEffect, useRef } from 'react';
import { Play, Heart, Bookmark, Share2, Eye, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import OptimizedImage from '@/components/OptimizedImage';
import { formatDuration, formatNumber, formatDate } from '@/utils/videoHelpers';
import { motion } from 'framer-motion';

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

interface VideoGridMasonryProps {
  videos: Video[];
  onPlay: (video: Video) => void;
  onLike: (videoId: string) => void;
  onSave: (videoId: string) => void;
  onShare: (videoId: string) => void;
  loading?: boolean;
}

const VideoGridMasonry: React.FC<VideoGridMasonryProps> = ({
  videos,
  onPlay,
  onLike,
  onSave,
  onShare,
  loading = false
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [columnCount, setColumnCount] = useState(4);
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive column calculation
  useEffect(() => {
    const updateColumns = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        if (width < 640) setColumnCount(1);
        else if (width < 768) setColumnCount(2);
        else if (width < 1024) setColumnCount(3);
        else if (width < 1280) setColumnCount(4);
        else setColumnCount(5);
      }
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  // Calculate card height based on content
  const getCardHeight = (video: Video) => {
    const baseHeight = 200; // thumbnail aspect ratio height
    const titleLines = Math.ceil(video.title.length / 40); // rough estimate
    const tagsHeight = Math.ceil(video.tags.length / 3) * 24; // tag rows
    return baseHeight + (titleLines * 20) + tagsHeight + 120; // padding and stats
  };

  // Distribute videos into columns
  const distributeVideos = () => {
    const columns: Video[][] = Array.from({ length: columnCount }, () => []);
    const columnHeights = new Array(columnCount).fill(0);

    videos.forEach((video) => {
      const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
      columns[shortestColumnIndex].push(video);
      columnHeights[shortestColumnIndex] += getCardHeight(video);
    });

    return columns;
  };

  if (loading) {
    return (
      <div ref={containerRef} className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-video bg-muted animate-pulse rounded-lg" />
              <div className="space-y-2">
                <div className="h-4 bg-muted animate-pulse rounded" />
                <div className="h-3 bg-muted animate-pulse rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const videoColumns = distributeVideos();

  return (
    <div ref={containerRef} className="w-full">
      <div className="flex gap-4">
        {videoColumns.map((column, columnIndex) => (
          <div key={columnIndex} className="flex-1 space-y-4">
            {column.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-border/50"
                onMouseEnter={() => setHoveredId(video.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => onPlay(video)}
              >
                {/* Thumbnail Container */}
                <div className="relative aspect-video overflow-hidden">
                  {video.thumbnail_url && 
                   video.thumbnail_url !== '/placeholder.svg' && 
                   video.thumbnail_url !== video.video_url && 
                   !video.thumbnail_url.includes('.mp4') ? (
                    <OptimizedImage
                      src={video.thumbnail_url}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      fallbackSrc="/placeholder.svg"
                      onError={() => {
                        console.warn('Thumbnail failed to load:', video.thumbnail_url);
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-600 flex items-center justify-center">
                      <div className="rounded-full bg-white/20 p-4">
                        <Play className="h-8 w-8 text-white" />
                      </div>
                      <div className="absolute bottom-2 left-2 bg-black/75 text-white text-xs px-2 py-1 rounded">
                        No Thumbnail
                      </div>
                    </div>
                  )}
                  
                  {/* Duration Overlay */}
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded-md font-medium">
                    {video.duration && video.duration > 0 ? formatDuration(video.duration) : '0:00'}
                  </div>

                  {/* Featured/Trending Badge */}
                  {(video.is_featured || video.is_trending) && (
                    <div className="absolute top-2 left-2">
                      <Badge 
                        variant={video.is_featured ? "default" : "secondary"}
                        className="text-xs font-semibold"
                      >
                        {video.is_featured ? '⭐ Featured' : '🔥 Trending'}
                      </Badge>
                    </div>
                  )}

                  {/* Play Button Overlay */}
                  <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${
                    hoveredId === video.id ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="secondary"
                        size="lg"
                        className="rounded-full w-16 h-16 p-0 bg-white/90 hover:bg-white text-black"
                      >
                        <Play className="h-6 w-6 fill-current" />
                      </Button>
                    </motion.div>
                  </div>

                  {/* Quick Actions */}
                  <div className={`absolute top-2 right-2 flex flex-col gap-2 transition-opacity duration-300 ${
                    hoveredId === video.id ? 'opacity-100' : 'opacity-0'
                  }`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onLike(video.id);
                      }}
                      className="bg-background/80 hover:bg-background w-8 h-8 p-0 rounded-full backdrop-blur-sm"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onShare(video.id);
                      }}
                      className="bg-background/80 hover:bg-background w-8 h-8 p-0 rounded-full backdrop-blur-sm"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSave(video.id);
                      }}
                      className="bg-background/80 hover:bg-background w-8 h-8 p-0 rounded-full backdrop-blur-sm"
                    >
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Title */}
                  <h3 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                    {video.title}
                  </h3>

                  {/* Category */}
                  <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wide font-medium">
                    {video.category}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {video.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs px-2 py-0.5">
                        #{tag}
                      </Badge>
                    ))}
                    {video.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs px-2 py-0.5">
                        +{video.tags.length - 2}
                      </Badge>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      <span>{formatNumber(video.view_count)}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        <span>{formatNumber(video.like_count)}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(video.published_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoGridMasonry;