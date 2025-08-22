import React, { useState } from 'react';
import { Play, Heart, Bookmark, Share2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import OptimizedImage from '@/components/OptimizedImage';
import SocialShare from '@/components/SocialShare';
import { formatDuration, formatNumber } from '@/utils/videoHelpers';

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

  return (
    <div 
      className="group relative bg-card rounded-lg overflow-hidden shadow-card hover:shadow-primary transition-all duration-300 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onPlay}
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
            <div className="rounded-full bg-white/20 p-4">
              <Play className="h-8 w-8 text-white" />
            </div>
            <div className="absolute bottom-2 left-2 bg-black/75 text-white text-xs px-2 py-1 rounded">
              No Thumbnail
            </div>
          </div>
        )}
        
        {/* Duration Overlay */}
        <div className="absolute bottom-2 right-2 bg-black/75 text-white text-xs px-2 py-1 rounded">
          {video.duration && video.duration > 0 ? formatDuration(video.duration) : '0:00'}
        </div>

        {/* Featured/Trending Badge */}
        {(video.is_featured || video.is_trending) && (
          <div className="absolute top-2 left-2">
            <Badge variant={video.is_featured ? "default" : "secondary"}>
              {video.is_featured ? 'Featured' : 'Trending'}
            </Badge>
          </div>
        )}

        {/* Play Button Overlay */}
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <Button
            variant="hero"
            size="lg"
            className="rounded-full w-16 h-16 p-0"
          >
            <Play className="h-6 w-6 fill-current" />
          </Button>
        </div>

        {/* Hover Actions */}
        <div className={`absolute top-2 right-2 flex flex-col gap-2 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onLike();
            }}
            className="bg-background/75 hover:bg-background w-10 h-10 p-0 rounded-full"
          >
            <Heart className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShareClick}
            className="bg-background/75 hover:bg-background w-10 h-10 p-0 rounded-full"
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
            className="bg-background/75 hover:bg-background w-10 h-10 p-0 rounded-full"
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
        <p className="text-xs text-muted-foreground mb-2">{video.category}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {video.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              #{tag}
            </Badge>
          ))}
          {video.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{video.tags.length - 3}
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
              <Bookmark className="h-3 w-3" />
              <span>{formatNumber(video.save_count)}</span>
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
    </div>
  );
};

export default VideoCard;