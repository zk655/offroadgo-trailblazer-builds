import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  RotateCcw,
  Settings,
  Download
} from 'lucide-react';
import { useVideoPlayer } from '@/hooks/useVideoPlayer';
import { formatDuration } from '@/utils/videoHelpers';
import OptimizedImage from '@/components/OptimizedImage';

interface VideoPlayerProps {
  videoId: string;
  videoUrl: string;
  thumbnailUrl?: string;
  title: string;
  autoPlay?: boolean;
  className?: string;
  onViewTracked?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoId,
  videoUrl,
  thumbnailUrl,
  title,
  autoPlay = false,
  className = '',
  onViewTracked
}) => {
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);

  const {
    videoRef,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isFullscreen,
    isLoading,
    error,
    play,
    pause,
    togglePlayPause,
    seek,
    setVolume,
    toggleMute,
    toggleFullscreen,
  } = useVideoPlayer({
    videoId,
    videoUrl,
    autoPlay,
    onViewTracked
  });

  const handleMouseMove = () => {
    setShowControls(true);
    
    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
    }
    
    const timeout = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
    
    setControlsTimeout(timeout);
  };

  const handleSeek = (value: number[]) => {
    seek(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  const restart = () => {
    seek(0);
    play();
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (error) {
    return (
      <div className={`relative bg-muted rounded-lg overflow-hidden ${className}`}>
        <div className="aspect-video flex items-center justify-center">
          <div className="text-center">
            <div className="text-destructive mb-2">⚠️</div>
            <p className="text-sm text-muted-foreground">Failed to load video</p>
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`relative bg-black rounded-lg overflow-hidden group ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain cursor-pointer"
        poster={thumbnailUrl}
        preload="metadata"
        playsInline
        crossOrigin="anonymous"
        onClick={togglePlayPause}
        onDoubleClick={toggleFullscreen}
      >
        <source src={videoUrl} type="video/mp4" />
        <source src={videoUrl} type="video/webm" />
        Your browser does not support the video tag.
      </video>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      )}

      {/* Thumbnail Overlay (before play) */}
      {!isPlaying && !isLoading && thumbnailUrl && (
        <div className="absolute inset-0 cursor-pointer" onClick={play}>
          <OptimizedImage
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <Button
              variant="secondary"
              size="lg"
              className="rounded-full w-20 h-20 p-0 bg-white/90 hover:bg-white text-black shadow-lg"
            >
              <Play className="h-8 w-8 fill-current ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Controls Overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity duration-300 ${
        showControls ? 'opacity-100' : 'opacity-0'
      }`}>
        
        {/* Top Controls */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <div className="bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
            <h3 className="text-white font-medium text-sm line-clamp-1">{title}</h3>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white bg-black/50 hover:bg-black/70 backdrop-blur-sm"
              onClick={() => window.open(videoUrl, '_blank')}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white bg-black/50 hover:bg-black/70 backdrop-blur-sm"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Center Play Button (when paused) */}
        {!isPlaying && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              variant="secondary"
              size="lg"
              onClick={play}
              className="rounded-full w-16 h-16 p-0 bg-white/90 hover:bg-white text-black shadow-lg"
            >
              <Play className="h-6 w-6 fill-current ml-1" />
            </Button>
          </div>
        )}

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {/* Progress Bar */}
          <div className="mb-4">
            <Slider
              value={[currentTime]}
              max={duration}
              step={1}
              onValueChange={handleSeek}
              className="w-full cursor-pointer"
            />
            <div className="flex justify-between text-white text-xs mt-1">
              <span>{formatDuration(currentTime)}</span>
              <span>{formatDuration(duration)}</span>
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
                onClick={restart}
                className="text-white hover:bg-white/20"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMute}
                  className="text-white hover:bg-white/20"
                >
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>
                
                <div className="w-20">
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    max={1}
                    step={0.1}
                    onValueChange={handleVolumeChange}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-white text-sm bg-black/50 px-2 py-1 rounded">
                {Math.round(progress)}%
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
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;