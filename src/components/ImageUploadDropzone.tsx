import { useCallback } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useImageUpload } from '@/hooks/useImageUpload';

interface ImageUploadDropzoneProps {
  onImageUploaded: (imageUrl: string) => void;
  blogId?: string;
  className?: string;
  variant?: 'default' | 'compact';
}

export default function ImageUploadDropzone({ 
  onImageUploaded, 
  blogId, 
  className = "",
  variant = 'default'
}: ImageUploadDropzoneProps) {
  const { uploadImage, uploading } = useImageUpload({
    blogId,
    onUploadSuccess: (image) => onImageUploaded(image.url),
  });

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    await uploadImage(file);
  }, [uploadImage]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  }, [handleFileSelect]);

  if (variant === 'compact') {
    return (
      <div className={`flex gap-2 ${className}`}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          id="compact-image-upload"
          disabled={uploading}
        />
        <label htmlFor="compact-image-upload">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="cursor-pointer"
            disabled={uploading}
            asChild
          >
            <span>
              {uploading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 mr-2" />
              )}
              Upload Image
            </span>
          </Button>
        </label>
      </div>
    );
  }

  return (
    <Card
      className={`relative border-2 border-dashed transition-colors ${className} ${
        uploading ? 'border-primary/50 bg-primary/5' : 'border-border hover:border-primary/50'
      }`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleFileSelect(e.target.files)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={uploading}
      />
      
      <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
        {uploading ? (
          <>
            <Loader2 className="h-12 w-12 mb-4 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Uploading image...</p>
          </>
        ) : (
          <>
            <Upload className="h-12 w-12 mb-4 text-muted-foreground" />
            <p className="text-sm font-medium mb-1">Drop an image here or click to browse</p>
            <p className="text-xs text-muted-foreground">
              Supports: JPG, PNG, GIF, WebP (max 5MB)
            </p>
          </>
        )}
      </div>
    </Card>
  );
}