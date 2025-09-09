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

      // Validate file
      if (!file.type.startsWith('video/')) {
        throw new Error('Please select a valid video file');
      }

      // Check file size (max 100MB)
      const maxSize = 100 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error('Video file size must be less than 100MB');
      }

      // Generate SEO-friendly title from filename
      const baseTitle = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' ');
      const seoTitle = baseTitle.charAt(0).toUpperCase() + baseTitle.slice(1);

      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const slug = generateVideoSlug(seoTitle);
      const fileName = `${slug}.${fileExt}`;
      const filePath = `videos/${fileName}`;

      // Step 1: Create initial video record with processing status
      const { data: videoRecord, error: dbError } = await supabase
        .from('videos')
        .insert({
          title: seoTitle,
          slug: slug,
          video_url: '', // Will be updated after upload
          status: 'processing',
          processing_status: 'uploading',
          category: 'offroad',
          published_at: new Date().toISOString()
        })
        .select()
        .single();

      if (dbError) throw dbError;
      setUploadProgress(20);

      // Step 2: Upload video to storage
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

      // Step 3: Update video record with URL and generate thumbnail
      await supabase
        .from('videos')
        .update({ 
          video_url: publicUrl,
          processing_status: 'generating_thumbnail'
        })
        .eq('id', videoRecord.id);

      setUploadProgress(60);

      // Step 4: Auto-generate thumbnail from video at 2 seconds
      let thumbnailUrl = '';
      try {
        console.log('Generating thumbnail for video:', videoRecord.id);
        thumbnailUrl = await autoGenerateThumbnail(publicUrl, videoRecord.id);
        console.log('Thumbnail generated successfully:', thumbnailUrl);
        setUploadProgress(80);
      } catch (thumbnailError) {
        console.error('Failed to generate thumbnail:', thumbnailError);
        // Continue without thumbnail - not a critical error
      }

      // Step 5: Trigger video processing for metadata extraction
      try {
        await supabase.functions.invoke('video-processor', {
          body: {
            video_id: videoRecord.id,
            video_url: publicUrl,
            title: seoTitle
          }
        });
      } catch (processingError) {
        console.warn('Video processing failed:', processingError);
      }

      setUploadProgress(90);

      // Step 6: Update status to ready and save thumbnail URL
      await supabase
        .from('videos')
        .update({ 
          status: 'ready',
          processing_status: 'completed',
          thumbnail_url: thumbnailUrl
        })
        .eq('id', videoRecord.id);

      const uploadedVideo: UploadedVideo = {
        id: videoRecord.id,
        url: publicUrl,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        duration: 0 // Will be updated by processing
      };

      setUploadProgress(100);

      toast({
        title: "Success",
        description: "Video uploaded successfully with auto-generated thumbnail!",
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