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
      // Calculate new dimensions
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

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return null;
    }

    setUploading(true);

    try {
      // Optimize image
      const optimizedFile = await optimizeImage(file);
      
      // Generate unique filename
      const fileExt = optimizedFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `blog-images/${fileName}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, optimizedFile);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath);

      // Save metadata to database if blogId is provided
      let imageRecord = null;
      if (blogId) {
        const { data, error: dbError } = await supabase
          .from('blog_images')
          .insert({
            blog_id: blogId,
            file_name: fileName,
            file_path: filePath,
            file_size: optimizedFile.size,
            mime_type: optimizedFile.type,
            alt_text: optimizedFile.name.replace(/\.[^/.]+$/, ""), // Remove extension for default alt text
          })
          .select()
          .single();

        if (dbError) {
          console.error('Database error:', dbError);
          // Continue anyway, as the file was uploaded successfully
        } else {
          imageRecord = data;
        }
      }

      const uploadedImage: UploadedImage = {
        id: imageRecord?.id || fileName,
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

  const deleteImage = async (filePath: string, imageId?: string) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('blog-images')
        .remove([filePath]);

      if (storageError) {
        throw storageError;
      }

      // Delete from database if imageId is provided
      if (imageId) {
        const { error: dbError } = await supabase
          .from('blog_images')
          .delete()
          .eq('id', imageId);

        if (dbError) {
          console.error('Database delete error:', dbError);
        }
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