import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

      // Validate file
      if (!file.type.startsWith('video/')) {
        throw new Error('Please select a valid video file');
      }

      // Check file size (max 100MB)
      const maxSize = 100 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error('Video file size must be less than 100MB');
      }

      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `videos/${fileName}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('videos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(uploadData.path);

      const uploadedVideo: UploadedVideo = {
        id: crypto.randomUUID(),
        url: publicUrl,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type
      };

      toast({
        title: "Success",
        description: "Video uploaded successfully",
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