import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UploadedThumbnail {
  id: string;
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

interface UseThumbnailUploadProps {
  onUploadSuccess?: (thumbnail: UploadedThumbnail) => void;
}

export function useThumbnailUpload({ onUploadSuccess }: UseThumbnailUploadProps = {}) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const uploadThumbnail = async (file: File): Promise<UploadedThumbnail | null> => {
    try {
      setUploading(true);
      setUploadProgress(0);

      // Validate file type - accept only image formats
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        throw new Error('Please select a valid image file (JPG, PNG, WebP)');
      }

      // Check file size (max 10MB for thumbnails)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error('Image file size must be less than 10MB');
      }

      setUploadProgress(25);

      // Generate unique filename
      const fileId = crypto.randomUUID();
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `thumbnails/${fileId}_thumbnail.${fileExtension}`;

      // Upload file to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('videos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;
      setUploadProgress(100);

      // Get thumbnail URL
      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(uploadData.path);

      const uploadedThumbnail: UploadedThumbnail = {
        id: fileId,
        url: publicUrl,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type
      };

      toast({
        title: "Success",
        description: "Thumbnail uploaded successfully!",
      });

      onUploadSuccess?.(uploadedThumbnail);
      return uploadedThumbnail;

    } catch (error) {
      console.error('Thumbnail upload error:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload thumbnail",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return {
    uploadThumbnail,
    uploading,
    uploadProgress
  };
}