import React, { useState } from 'react';
import { Play, Heart, Bookmark, Share2, Eye, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import OptimizedImage from '@/components/OptimizedImage';
import SocialShare from '@/components/SocialShare';
import { formatDuration, formatNumber } from '@/utils/videoHelpers';
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

interface VideoCardProps {
  video: Video;
  onPlay: () => void;
  onLike: () => void;
  onSave: () => void;
  onShare: () => void;
  priority?: boolean;
}

const VideoCard: React.FC<VideoCardProps> = ({
  video,
  onPlay,
  onLike,
  onSave,
  onShare,
  priority = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowShareDialog(true);
    onShare();
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPlay();
  };
  return (
    <motion.div 
      className="group relative bg-card rounded-lg overflow-hidden shadow-card hover:shadow-primary transition-all duration-300 cursor-pointer border border-border/50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handlePlayClick}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        {video.thumbnail_url && 
         video.thumbnail_url !== '/placeholder.svg' && 
         video.thumbnail_url !== video.video_url && 
         !video.thumbnail_url.includes('.mp4') &&
         !video.thumbnail_url.includes('.svg') ? (
          <OptimizedImage
            src={video.thumbnail_url}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading={priority ? 'eager' : 'lazy'}
            fallbackSrc="/placeholder.svg"
            onError={() => {
              console.warn('Thumbnail failed to load:', video.thumbnail_url);
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-600 flex items-center justify-center">
            <div className="rounded-full bg-white/20 p-6">
              <Play className="h-12 w-12 text-white" />
            </div>
            <div className="absolute bottom-3 left-3 bg-black/80 text-white text-xs px-3 py-1.5 rounded-md">
              <Clock className="h-3 w-3 inline mr-1" />
              Video Ready
            </div>
          </div>
        )}
        
        {/* Duration Overlay */}
        <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-2 py-1 rounded-md font-medium">
          {video.duration && video.duration > 0 ? formatDuration(video.duration) : '0:00'}
        </div>

        {/* Featured/Trending Badge */}
        {(video.is_featured || video.is_trending) && (
          <div className="absolute top-3 left-3">
            <Badge variant={video.is_featured ? "default" : "secondary"}>
              {video.is_featured ? 'Featured' : 'Trending'}
            </Badge>
          </div>
        )}

        {/* Play Button Overlay */}
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="secondary"
              size="lg"
              className="rounded-full w-16 h-16 p-0 bg-white/90 hover:bg-white text-black shadow-lg"
            >
              <Play className="h-6 w-6 fill-current ml-1" />
            </Button>
          </motion.div>
        </div>

        {/* Hover Actions */}
        <div className={`absolute top-3 right-3 flex flex-col gap-2 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onLike();
            }}
            className="bg-background/80 hover:bg-background w-8 h-8 p-0 rounded-full backdrop-blur-sm"
          >
            <Heart className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShareClick}
            className="bg-background/80 hover:bg-background w-8 h-8 p-0 rounded-full backdrop-blur-sm"
          >
            <Share2 className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onSave();
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
        <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide font-medium">
          {video.category}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {video.tags.slice(0, 2).map(tag => (
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
            <span>{formatNumber(video.view_count || 0)}</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              <span>{formatNumber(video.like_count || 0)}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Bookmark className="h-3 w-3" />
              <span>{formatNumber(video.save_count || 0)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Social Share Component */}
      {showShareDialog && (
        <div className="absolute inset-0 z-50" onClick={(e) => e.stopPropagation()}>
          <SocialShare
            title={video.title}
            excerpt={video.description || ''}
            url={`/videos/${video.slug}`}
            image={video.thumbnail_url}
            variant="icon"
          />
        </div>
      )}
    </motion.div>
  );
};

export default VideoCard;