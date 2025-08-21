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

      // Extract video metadata client-side
      const metadata = await extractVideoMetadata(file);

      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `videos/${fileName}`;

      // Update progress during upload
      setUploadProgress(25);

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('videos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;
      setUploadProgress(50);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(uploadData.path);

      setUploadProgress(75);

      const uploadedVideo: UploadedVideo = {
        id: crypto.randomUUID(),
        url: publicUrl,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        duration: metadata.duration
      };

      setUploadProgress(100);

      toast({
        title: "Success",
        description: "Video uploaded successfully! Processing in background...",
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

  // Extract video metadata on client-side
  const extractVideoMetadata = (file: File): Promise<{ duration: number; resolution: string }> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      const url = URL.createObjectURL(file);
      
      video.onloadedmetadata = () => {
        const duration = Math.round(video.duration);
        const resolution = `${video.videoWidth}x${video.videoHeight}`;
        URL.revokeObjectURL(url);
        resolve({ duration, resolution });
      };
      
      video.onerror = () => {
        URL.revokeObjectURL(url);
        resolve({ duration: 0, resolution: 'unknown' });
      };
      
      video.src = url;
    });
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