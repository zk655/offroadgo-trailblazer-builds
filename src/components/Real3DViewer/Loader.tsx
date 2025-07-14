import { Html, useProgress } from '@react-three/drei';
import { Loader2 } from 'lucide-react';

// Loading component
export function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center space-y-4 text-white">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">Loading 3D Model</p>
          <div className="w-48 h-2 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-300 mt-2">{Math.round(progress)}% loaded</p>
        </div>
      </div>
    </Html>
  );
}