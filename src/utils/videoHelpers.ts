// Video utility functions

/**
 * Format duration from seconds to MM:SS or HH:MM:SS format
 */
export const formatDuration = (seconds: number): string => {
  if (!seconds || seconds < 0) return '0:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Format numbers with K/M suffixes
 */
export const formatNumber = (num: number): string => {
  if (num < 1000) return num.toString();
  if (num < 1000000) return `${(num / 1000).toFixed(1)}K`;
  return `${(num / 1000000).toFixed(1)}M`;
};

/**
 * Format date to readable string
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 2419200) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
  if (diffInSeconds < 29030400) return `${Math.floor(diffInSeconds / 2419200)} months ago`;
  
  return `${Math.floor(diffInSeconds / 29030400)} years ago`;
};

/**
 * Generate video thumbnail URL from video URL
 */
export const generateThumbnailUrl = (videoUrl: string): string => {
  // This would typically extract thumbnail from video or use a service
  // For now, return a placeholder
  return '/placeholder.svg';
};

/**
 * Validate video file
 */
export const validateVideoFile = (file: File): { isValid: boolean; error?: string } => {
  const maxSize = 500 * 1024 * 1024; // 500MB
  const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
  
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Only MP4, WebM, and OGG video files are allowed' };
  }
  
  if (file.size > maxSize) {
    return { isValid: false, error: 'Video file size must be less than 500MB' };
  }
  
  return { isValid: true };
};

/**
 * Extract video metadata (duration, resolution, etc.)
 */
export const extractVideoMetadata = (file: File): Promise<{
  duration: number;
  resolution: string;
  fileSize: number;
}> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      
      resolve({
        duration: Math.floor(video.duration),
        resolution: `${video.videoWidth}x${video.videoHeight}`,
        fileSize: file.size
      });
    };
    
    video.onerror = () => {
      reject(new Error('Failed to load video metadata'));
    };
    
    video.src = URL.createObjectURL(file);
  });
};

/**
 * Generate SEO-friendly slug from video title
 */
export const generateVideoSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

/**
 * Extract hashtags from text
 */
export const extractHashtags = (text: string): string[] => {
  const hashtagRegex = /#(\w+)/g;
  const hashtags: string[] = [];
  let match;
  
  while ((match = hashtagRegex.exec(text)) !== null) {
    hashtags.push(match[1].toLowerCase());
  }
  
  return Array.from(new Set(hashtags)); // Remove duplicates
};

/**
 * Generate video share URL
 */
export const generateShareUrl = (videoSlug: string, baseUrl: string = window.location.origin): string => {
  return `${baseUrl}/videos/${videoSlug}`;
};

/**
 * Check if video format supports streaming
 */
export const supportsStreaming = (format: string): boolean => {
  const streamingFormats = ['mp4', 'webm'];
  return streamingFormats.includes(format.toLowerCase());
};

/**
 * Generate video embed code
 */
export const generateEmbedCode = (videoUrl: string, title: string): string => {
  return `<video controls preload="metadata" style="width: 100%; max-width: 800px;">
  <source src="${videoUrl}" type="video/mp4">
  <p>Your browser doesn't support HTML5 video. <a href="${videoUrl}">Download the video</a> instead.</p>
</video>`;
};