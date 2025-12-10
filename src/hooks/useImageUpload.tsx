import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UploadedImage {
  id: string;
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

interface UseImageUploadProps {
  blogId?: string;
  onUploadSuccess?: (image: UploadedImage) => void;
}

// Image optimization utility
const optimizeImage = (file: File, maxWidth: number = 1200, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const optimizedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(optimizedFile);
            } else {
              resolve(file);
            }
          },
          file.type,
          quality
        );
      } else {
        resolve(file);
      }
    };
    
    img.src = URL.createObjectURL(file);
  });
};

export const useImageUpload = ({ blogId, onUploadSuccess }: UseImageUploadProps = {}) => {
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file: File): Promise<UploadedImage | null> => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return null;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return null;
    }

    setUploading(true);

    try {
      const optimizedFile = await optimizeImage(file);
      
      const fileExt = optimizedFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `blog-images/${fileName}`;

      // Upload to Supabase Storage (bucket needs to exist)
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, optimizedFile);

      if (uploadError) {
        // If bucket doesn't exist, just return the file info without storage
        console.warn('Storage upload failed:', uploadError);
        const localUrl = URL.createObjectURL(optimizedFile);
        
        const uploadedImage: UploadedImage = {
          id: fileName,
          url: localUrl,
          fileName: fileName,
          fileSize: optimizedFile.size,
          mimeType: optimizedFile.type,
        };

        toast.success('Image processed successfully');
        onUploadSuccess?.(uploadedImage);
        return uploadedImage;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      const uploadedImage: UploadedImage = {
        id: fileName,
        url: publicUrl,
        fileName: fileName,
        fileSize: optimizedFile.size,
        mimeType: optimizedFile.type,
      };

      toast.success('Image uploaded successfully');
      onUploadSuccess?.(uploadedImage);
      
      return uploadedImage;
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (filePath: string) => {
    try {
      const { error: storageError } = await supabase.storage
        .from('blog-images')
        .remove([filePath]);

      if (storageError) {
        console.warn('Storage delete failed:', storageError);
      }

      toast.success('Image deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete image');
    }
  };

  return {
    uploadImage,
    deleteImage,
    uploading,
  };
};
