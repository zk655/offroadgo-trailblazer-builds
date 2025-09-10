import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { generateVideoSlug } from '@/utils/videoHelpers';
import { autoGenerateThumbnail } from '@/utils/thumbnailGenerator';

interface UploadedVideo {
  id: string;
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  duration?: number;
}

interface UseVideoUploadProps {
  onUploadSuccess?: (video: UploadedVideo) => void;
}

export function useVideoUpload({ onUploadSuccess }: UseVideoUploadProps = {}) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const uploadVideo = async (file: File): Promise<UploadedVideo | null> => {
    try {
      setUploading(true);
      setUploadProgress(0);

      // Validate file type - accept various video formats
      const validTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/mkv', 'video/webm', 'video/quicktime'];
      const isValidType = validTypes.some(type => file.type.includes(type.split('/')[1])) || 
                         file.name.match(/\.(mp4|mov|avi|mkv|webm|m4v)$/i);
      
      if (!isValidType) {
        throw new Error('Please select a valid video file (MP4, MOV, AVI, MKV, WebM)');
      }

      // Check file size (max 500MB for better quality uploads)
      const maxSize = 500 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error('Video file size must be less than 500MB');
      }

      setUploadProgress(25);

      // Generate unique filename
      const fileId = crypto.randomUUID();
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'mp4';
      const fileName = `raw/${fileId}_original.${fileExtension}`;

      // Upload file to storage only - no database record creation
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('videos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;
      setUploadProgress(100);

      // Get video URL
      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(uploadData.path);

      const uploadedVideo: UploadedVideo = {
        id: fileId,
        url: publicUrl,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type || 'video/mp4'
      };

      toast({
        title: "Success",
        description: "Video uploaded successfully! Now create a video record.",
      });

      onUploadSuccess?.(uploadedVideo);
      return uploadedVideo;

    } catch (error) {
      console.error('Video upload error:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload video",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };


  const deleteVideo = async (filePath: string): Promise<void> => {
    try {
      const { error } = await supabase.storage
        .from('videos')
        .remove([filePath]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Video deleted successfully",
      });
    } catch (error) {
      console.error('Video deletion error:', error);
      toast({
        title: "Delete Failed",
        description: error instanceof Error ? error.message : "Failed to delete video",
        variant: "destructive",
      });
    }
  };

  return {
    uploadVideo,
    deleteVideo,
    uploading,
    uploadProgress
  };
}