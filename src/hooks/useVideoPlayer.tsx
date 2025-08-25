import { useState, useRef, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseVideoPlayerProps {
  videoId: string;
  videoUrl: string;
  autoPlay?: boolean;
  onViewTracked?: () => void;
}

export function useVideoPlayer({ 
  videoId, 
  videoUrl, 
  autoPlay = false,
  onViewTracked 
}: UseVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewTracked, setViewTracked] = useState(false);

  // Track video view after 10 seconds of playback
  const trackView = useCallback(async () => {
    if (viewTracked || currentTime < 10) return;
    
    try {
      const { data } = await supabase.functions.invoke('video-stream', {
        body: { video_id: videoId, action: 'view' }
      });
      
      if (data?.success) {
        setViewTracked(true);
        onViewTracked?.();
      }
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  }, [videoId, currentTime, viewTracked, onViewTracked]);

  // Video event handlers
  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsLoading(false);
    }
  }, []);

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      trackView();
    }
  }, [trackView]);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleError = useCallback((e: Event) => {
    console.error('Video error:', e);
    setError('Failed to load video');
    setIsLoading(false);
  }, []);

  const handleCanPlay = useCallback(() => {
    setIsLoading(false);
    if (autoPlay && videoRef.current) {
      videoRef.current.play().catch(console.error);
    }
  }, [autoPlay]);

  // Control functions
  const play = useCallback(async () => {
    if (videoRef.current) {
      try {
        await videoRef.current.play();
      } catch (error) {
        console.error('Error playing video:', error);
      }
    }
  }, []);

  const pause = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  }, []);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const seek = useCallback((time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const setVolumeLevel = useCallback((level: number) => {
    if (videoRef.current) {
      videoRef.current.volume = level;
      setVolume(level);
      setIsMuted(level === 0);
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  }, [isMuted]);

  const toggleFullscreen = useCallback(async () => {
    if (!videoRef.current) return;

    try {
      if (!isFullscreen) {
        await videoRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  }, [isFullscreen]);

  // Set up video element event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('error', handleError);
    video.addEventListener('canplay', handleCanPlay);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('error', handleError);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [handleLoadedMetadata, handleTimeUpdate, handlePlay, handlePause, handleError, handleCanPlay]);

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return {
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
    setVolume: setVolumeLevel,
    toggleMute,
    toggleFullscreen,
  };
}