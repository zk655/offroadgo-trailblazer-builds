import { useCallback } from 'react';
import { Upload, X, Loader2, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useVideoUpload } from '@/hooks/useVideoUpload';

interface VideoUploadDropzoneProps {
  onVideoUploaded: (videoUrl: string) => void;
  className?: string;
  variant?: 'default' | 'compact';
}

export default function VideoUploadDropzone({ 
  onVideoUploaded, 
  className = "",
  variant = 'default'
}: VideoUploadDropzoneProps) {
  const { uploadVideo, uploading, uploadProgress } = useVideoUpload({
    onUploadSuccess: (video) => onVideoUploaded(video.url),
  });

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    await uploadVideo(file);
  }, [uploadVideo]);

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
          accept="video/*"
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          id="compact-video-upload"
          disabled={uploading}
        />
        <label htmlFor="compact-video-upload">
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
                <Video className="h-4 w-4 mr-2" />
              )}
              Upload Video
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
        accept="video/*"
        onChange={(e) => handleFileSelect(e.target.files)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={uploading}
      />
      
      <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
        {uploading ? (
          <>
            <Loader2 className="h-12 w-12 mb-4 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground mb-2">Uploading video...</p>
            {uploadProgress > 0 && (
              <Progress value={uploadProgress} className="w-full max-w-xs" />
            )}
          </>
        ) : (
          <>
            <Video className="h-12 w-12 mb-4 text-muted-foreground" />
            <p className="text-sm font-medium mb-1">Drop a video here or click to browse</p>
            <p className="text-xs text-muted-foreground">
              Supports: MP4, WebM, AVI, MOV (max 100MB)
            </p>
          </>
        )}
      </div>
    </Card>
  );
}