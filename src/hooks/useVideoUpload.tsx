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

      // Generate SEO-friendly title from filename
      const baseTitle = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' ');
      const seoTitle = baseTitle.charAt(0).toUpperCase() + baseTitle.slice(1);
      const slug = generateVideoSlug(seoTitle);

      setUploadProgress(10);

      // Step 1: Create SINGLE video record with processing status
      const { data: videoRecord, error: dbError } = await supabase
        .from('videos')
        .insert({
          title: seoTitle,
          slug: slug,
          video_url: '', // Will be updated with final processed URL
          status: 'processing',
          processing_status: 'pending',
          category: 'offroad',
          video_format: 'mp4', // Final format after processing
          published_at: new Date().toISOString(),
          seo_title: `${seoTitle} | OffRoadGo Videos`,
          seo_description: `Watch ${seoTitle} - Premium off-road video content in high definition.`,
          seo_keywords: ['off-road', 'adventure', '4x4', 'video', ...seoTitle.toLowerCase().split(' ')]
        })
        .select()
        .single();

      if (dbError) throw dbError;
      setUploadProgress(20);

      // Step 2: Upload original video to raw storage
      const originalFileName = `raw/${videoRecord.id}_original.${file.name.split('.').pop()}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('videos')
        .upload(originalFileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;
      setUploadProgress(40);

      // Get original video URL
      const { data: { publicUrl: originalUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(uploadData.path);

      setUploadProgress(50);

      // Step 3: Trigger comprehensive video processing (transcoding, HLS, thumbnail, SEO)
      const { data: processingResult, error: processingError } = await supabase.functions.invoke('process-video', {
        body: {
          video_id: videoRecord.id,
          original_url: originalUrl,
          title: seoTitle,
          file_size: file.size,
          original_format: file.name.split('.').pop()?.toLowerCase() || 'mp4'
        }
      });

      if (processingError) {
        console.error('Processing failed:', processingError);
        // Update record to failed status
        await supabase
          .from('videos')
          .update({ 
            status: 'failed',
            processing_status: 'failed'
          })
          .eq('id', videoRecord.id);
        throw new Error('Video processing failed. Please try again.');
      }

      setUploadProgress(70);

      // Step 4: Wait for processing completion and get final URLs
      let attempts = 0;
      const maxAttempts = 30; // 5 minutes max
      
      while (attempts < maxAttempts) {
        const { data: videoData } = await supabase
          .from('videos')
          .select('processing_status, video_url, thumbnail_url, status')
          .eq('id', videoRecord.id)
          .single();

        if (videoData?.processing_status === 'completed' && videoData?.video_url) {
          setUploadProgress(100);
          
          const uploadedVideo: UploadedVideo = {
            id: videoRecord.id,
            url: videoData.video_url,
            fileName: file.name,
            fileSize: file.size,
            mimeType: 'video/mp4', // Final format
            duration: 0 // Will be set by processing
          };

          toast({
            title: "Success",
            description: "Video uploaded and processed successfully with HLS streaming and auto-generated thumbnail!",
          });

          onUploadSuccess?.(uploadedVideo);
          return uploadedVideo;
        }
        
        if (videoData?.processing_status === 'failed') {
          throw new Error('Video processing failed during transcoding');
        }

        // Update progress based on processing status
        if (videoData?.processing_status === 'transcoding') {
          setUploadProgress(Math.min(95, 70 + attempts * 2));
        }

        attempts++;
        await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
      }

      throw new Error('Video processing timed out. Please check the admin panel for status.');

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