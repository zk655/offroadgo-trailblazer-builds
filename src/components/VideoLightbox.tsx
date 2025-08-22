import React, { useRef, useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Heart, Bookmark, Share2, Eye, Play, Pause, Volume2, VolumeX, Maximize, RotateCcw } from 'lucide-react';
import SocialShare from '@/components/SocialShare';
import { formatDuration, formatNumber, formatDate } from '@/utils/videoHelpers';

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

interface VideoLightboxProps {
  video: Video;
  isOpen: boolean;
  onClose: () => void;
  onLike: () => void;
  onSave: () => void;
  onShare: () => void;
}

const VideoLightbox: React.FC<VideoLightboxProps> = ({
  video,
  isOpen,
  onClose,
  onLike,
  onSave,
  onShare
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  }, [isOpen]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [isOpen]);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (!isFullscreen) {
        videoRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const restartVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  const progress = video.duration > 0 ? (currentTime / video.duration) * 100 : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-full h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>{video.title}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
          {/* Video Player */}
          <div className="lg:col-span-2 relative bg-black flex items-center justify-center">
            <video
              ref={videoRef}
              className="w-full h-full object-contain"
              poster={video.thumbnail_url && 
                      video.thumbnail_url !== video.video_url && 
                      !video.thumbnail_url.includes('.mp4') &&
                      !video.thumbnail_url.includes('.svg') ? 
                      video.thumbnail_url : undefined}
              preload="metadata"
              onClick={togglePlayPause}
              controls={false}
              playsInline
              crossOrigin="anonymous"
              onError={(e) => {
                console.error('Video playback error:', e);
                console.log('Video URL:', video.video_url);
                console.log('Video element error details:', e.currentTarget.error);
              }}
              onLoadedMetadata={() => {
                console.log('Video metadata loaded for:', video.title);
                if (videoRef.current) {
                  console.log('Video duration:', videoRef.current.duration);
                }
              }}
              onCanPlay={() => {
                console.log('Video can play:', video.title);
              }}
              onLoadStart={() => {
                console.log('Video load started:', video.video_url);
              }}
            >
              <source src={video.video_url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Video Controls Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              {/* Progress Bar */}
              <div className="mb-4">
                <input
                  type="range"
                  min={0}
                  max={video.duration}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer range-slider"
                />
                <div className="flex justify-between text-white text-xs mt-1">
                  <span>{formatDuration(currentTime)}</span>
                  <span>{formatDuration(video.duration)}</span>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={togglePlayPause}
                    className="text-white hover:bg-white/20"
                  >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMute}
                    className="text-white hover:bg-white/20"
                  >
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={restartVideo}
                    className="text-white hover:bg-white/20"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullscreen}
                  className="text-white hover:bg-white/20"
                >
                  <Maximize className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Video Info Sidebar */}
          <div className="bg-background border-l p-6 overflow-y-auto">
            {/* Title and Category */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <Badge variant={video.is_featured ? "default" : "secondary"}>
                  {video.category}
                </Badge>
                {video.is_trending && (
                  <Badge variant="default">Trending</Badge>
                )}
              </div>
              <h2 className="text-xl font-bold leading-tight">{video.title}</h2>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{formatNumber(video.view_count)}</div>
                <div className="text-xs text-muted-foreground">Views</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{formatNumber(video.like_count)}</div>
                <div className="text-xs text-muted-foreground">Likes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">{formatNumber(video.save_count)}</div>
                <div className="text-xs text-muted-foreground">Saves</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              <Button variant="outline" onClick={onLike} className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Like
              </Button>
              <Button variant="outline" onClick={onSave} className="flex items-center gap-2">
                <Bookmark className="h-4 w-4" />
                Save
              </Button>
              <SocialShare
                title={video.title}
                excerpt={video.description || ''}
                url={`/videos/${video.slug}`}
                image={video.thumbnail_url}
                variant="button"
                size="sm"
              />
            </div>

            {/* Description */}
            {video.description && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {video.description}
                </p>
              </div>
            )}

            {/* Tags */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {video.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Video Details */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration:</span>
                <span>{formatDuration(video.duration)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Published:</span>
                <span>{formatDate(video.published_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category:</span>
                <span>{video.category}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoLightbox;