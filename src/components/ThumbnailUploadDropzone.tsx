import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { useThumbnailUpload } from '@/hooks/useThumbnailUpload';
import { Progress } from '@/components/ui/progress';
import { ImageIcon, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThumbnailUploadDropzoneProps {
  onThumbnailUploaded?: (thumbnailUrl: string) => void;
  variant?: 'default' | 'compact';
  className?: string;
}

export default function ThumbnailUploadDropzone({ 
  onThumbnailUploaded, 
  variant = 'default',
  className 
}: ThumbnailUploadDropzoneProps) {
  const { uploadThumbnail, uploading, uploadProgress } = useThumbnailUpload({
    onUploadSuccess: (thumbnail) => {
      onThumbnailUploaded?.(thumbnail.url);
    }
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      await uploadThumbnail(acceptedFiles[0]);
    }
  }, [uploadThumbnail]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp']
    },
    maxFiles: 1,
    disabled: uploading
  });

  if (variant === 'compact') {
    return (
      <div className={className}>
        <Button
          type="button"
          variant="outline"
          disabled={uploading}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
          <ImageIcon className="mr-2 h-4 w-4" />
          {uploading ? 'Uploading...' : 'Upload Thumbnail'}
        </Button>
        {uploading && (
          <div className="mt-2">
            <Progress value={uploadProgress} className="w-full" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer transition-colors hover:border-muted-foreground/50",
        isDragActive && "border-primary bg-primary/5",
        uploading && "pointer-events-none opacity-50",
        className
      )}
    >
      <input {...getInputProps()} />
      <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      
      {uploading ? (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Uploading thumbnail...</p>
          <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
        </div>
      ) : isDragActive ? (
        <p className="text-sm text-muted-foreground">Drop the thumbnail here...</p>
      ) : (
        <div className="space-y-2">
          <p className="text-sm font-medium">Upload Thumbnail</p>
          <p className="text-xs text-muted-foreground">
            Drag and drop an image file here, or click to select
          </p>
          <p className="text-xs text-muted-foreground">
            Supports: JPG, PNG, WebP (max 10MB)
          </p>
        </div>
      )}
    </div>
  );
}