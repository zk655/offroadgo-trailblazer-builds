/**
 * Generates a high-quality thumbnail from a video frame
 * @param videoUrl - URL of the video file
 * @param timeInSeconds - Time in seconds to capture (default: 3)
 * @returns Promise<string> - Base64 encoded thumbnail image
 */
export const generateVideoThumbnail = (videoUrl: string, timeInSeconds: number = 3): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    // Set video properties for better quality capture
    video.crossOrigin = 'anonymous';
    video.preload = 'metadata';
    video.muted = true; // Ensure autoplay works
    video.playsInline = true;
    
    video.onloadedmetadata = () => {
      // Set canvas to optimal thumbnail size (16:9 aspect ratio)
      const aspectRatio = video.videoWidth / video.videoHeight;
      const targetWidth = 1280;
      const targetHeight = Math.round(targetWidth / aspectRatio);
      
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      
      // Seek to the specified time (ensure it's within video duration)
      const seekTime = Math.min(timeInSeconds, Math.max(1, video.duration - 1));
      video.currentTime = seekTime;
    };

    video.onseeked = () => {
      try {
        // Set canvas context for high quality rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Draw the current frame to canvas with proper scaling
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to high-quality JPEG
        const thumbnail = canvas.toDataURL('image/jpeg', 0.85);
        resolve(thumbnail);
      } catch (error) {
        reject(error);
      } finally {
        // Cleanup
        video.remove();
        canvas.remove();
      }
    };

    video.onerror = (error) => {
      console.error('Video loading error:', error);
      reject(new Error('Failed to load video for thumbnail generation'));
      video.remove();
      canvas.remove();
    };

    video.ontimeupdate = () => {
      // Additional check to ensure we're at the right time
      if (Math.abs(video.currentTime - timeInSeconds) < 0.1) {
        video.ontimeupdate = null; // Remove listener
      }
    };

    // Start loading the video
    video.src = videoUrl;
  });
};

/**
 * Uploads a thumbnail to Supabase storage
 * @param thumbnailBase64 - Base64 encoded thumbnail
 * @param videoId - ID of the video
 * @returns Promise<string> - URL of the uploaded thumbnail
 */
export const uploadThumbnailToStorage = async (thumbnailBase64: string, videoId: string): Promise<string> => {
  const { supabase } = await import('@/integrations/supabase/client');
  
  // Convert base64 to blob
  const response = await fetch(thumbnailBase64);
  const blob = await response.blob();
  
  const fileName = `thumbnails/${videoId}_thumbnail.jpg`;
  
  const { data, error } = await supabase.storage
    .from('videos')
    .upload(fileName, blob, {
      contentType: 'image/jpeg',
      upsert: true
    });

  if (error) {
    throw new Error(`Failed to upload thumbnail: ${error.message}`);
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('videos')
    .getPublicUrl(fileName);

  return publicUrl;
};

/**
 * Auto-generates and saves thumbnail for a video
 * @param videoUrl - URL of the video
 * @param videoId - ID of the video record
 * @returns Promise<string> - URL of the generated thumbnail
 */
export const autoGenerateThumbnail = async (videoUrl: string, videoId: string): Promise<string> => {
  try {
    // Generate thumbnail from video at 2 seconds
    const thumbnailBase64 = await generateVideoThumbnail(videoUrl, 2);
    
    // Upload to storage
    const thumbnailUrl = await uploadThumbnailToStorage(thumbnailBase64, videoId);
    
    // Update video record with thumbnail URL
    const { supabase } = await import('@/integrations/supabase/client');
    const { error } = await supabase
      .from('videos')
      .update({ thumbnail_url: thumbnailUrl })
      .eq('id', videoId);

    if (error) {
      console.error('Failed to update video with thumbnail URL:', error);
    }

    return thumbnailUrl;
  } catch (error) {
    console.error('Failed to auto-generate thumbnail:', error);
    throw error;
  }
};