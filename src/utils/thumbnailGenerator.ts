/**
 * Generates a thumbnail from the first frame of a video
 * @param videoUrl - URL of the video file
 * @param timeInSeconds - Time in seconds to capture (default: 1)
 * @returns Promise<string> - Base64 encoded thumbnail image
 */
export const generateVideoThumbnail = (videoUrl: string, timeInSeconds: number = 1): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    video.crossOrigin = 'anonymous';
    video.preload = 'metadata';
    
    video.onloadedmetadata = () => {
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Seek to the specified time
      video.currentTime = Math.min(timeInSeconds, video.duration);
    };

    video.onseeked = () => {
      try {
        // Draw the current frame to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to base64 image
        const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
        resolve(thumbnail);
      } catch (error) {
        reject(error);
      } finally {
        // Cleanup
        video.remove();
        canvas.remove();
      }
    };

    video.onerror = () => {
      reject(new Error('Failed to load video for thumbnail generation'));
      video.remove();
      canvas.remove();
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
    // Generate thumbnail from first frame
    const thumbnailBase64 = await generateVideoThumbnail(videoUrl, 1);
    
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