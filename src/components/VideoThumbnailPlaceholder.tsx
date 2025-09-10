import React from 'react';
import { Play, Video } from 'lucide-react';

interface VideoThumbnailPlaceholderProps {
  title?: string;
  className?: string;
}

const VideoThumbnailPlaceholder: React.FC<VideoThumbnailPlaceholderProps> = ({ 
  title = "Video", 
  className = "w-full h-full" 
}) => {
  return (
    <div className={`bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 flex items-center justify-center relative ${className}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.5)_1px,transparent_0)] bg-[length:20px_20px]"></div>
      </div>
      
      {/* Center Icon */}
      <div className="relative z-10 flex flex-col items-center gap-3">
        <div className="rounded-full bg-white/20 p-4 backdrop-blur-sm">
          <Video className="h-8 w-8 text-white" />
        </div>
        <div className="text-center">
          <p className="text-white/90 text-sm font-medium">No Thumbnail</p>
          <p className="text-white/60 text-xs mt-1">Video available</p>
        </div>
      </div>
      
      {/* Play Indicator */}
      <div className="absolute bottom-3 left-3 bg-black/80 text-white text-xs px-3 py-1.5 rounded-md flex items-center gap-1">
        <Play className="h-3 w-3" />
        <span>Ready to play</span>
      </div>
    </div>
  );
};

export default VideoThumbnailPlaceholder;