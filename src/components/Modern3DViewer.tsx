import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Play, 
  Pause, 
  Palette,
  Settings,
  Maximize2,
  Download,
  Share2
} from 'lucide-react';

// Extend window interface for model-viewer
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        'camera-controls'?: boolean;
        'auto-rotate'?: boolean;
        'auto-rotate-delay'?: number;
        'rotation-per-second'?: string;
        loading?: 'auto' | 'lazy' | 'eager';
        'reveal'?: 'auto' | 'interaction' | 'manual';
        poster?: string;
        'background-color'?: string;
        'environment-image'?: string;
        'skybox-image'?: string;
        'shadow-intensity'?: number;
        'shadow-softness'?: number;
        exposure?: number;
        'min-camera-orbit'?: string;
        'max-camera-orbit'?: string;
        'camera-orbit'?: string;
        'field-of-view'?: string;
        style?: React.CSSProperties;
        onLoad?: () => void;
        onError?: () => void;
      };
    }
  }
}

interface Modern3DViewerProps {
  vehicleName: string;
  modelUrl?: string;
  fallbackImage?: string;
  autoRotate?: boolean;
  enableControls?: boolean;
  theme?: 'light' | 'dark';
  className?: string;
}

const Modern3DViewer = ({ 
  vehicleName, 
  modelUrl, 
  fallbackImage,
  autoRotate = true,
  enableControls = true,
  theme = 'dark',
  className = ''
}: Modern3DViewerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(autoRotate);
  const [showControls, setShowControls] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const viewerRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Default model URL - you can replace with actual .glb models from Supabase Storage
  const defaultModelUrl = modelUrl || "https://modelviewer.dev/shared-assets/models/Astronaut.glb";
  
  // Load model-viewer script
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const toggleAutoRotate = () => {
    setIsAutoRotating(!isAutoRotating);
    if (viewerRef.current) {
      (viewerRef.current as any).autoRotate = !isAutoRotating;
    }
  };

  const resetCamera = () => {
    if (viewerRef.current) {
      (viewerRef.current as any).resetTurntableRotation();
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen && containerRef.current) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`relative group ${className}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <Card className={`relative overflow-hidden rounded-3xl border-border/30 shadow-2xl bg-gradient-to-br ${
        theme === 'dark' 
          ? 'from-slate-900/50 to-slate-800/30' 
          : 'from-white to-gray-50/50'
      } backdrop-blur-sm`}>
        
        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-gradient-to-br from-background/95 to-muted/95 backdrop-blur-sm">
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 mx-auto rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 mx-auto rounded-full border-2 border-transparent border-b-accent animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <p className="text-lg font-semibold text-foreground">Loading 3D Model</p>
                <p className="text-sm text-muted-foreground">{vehicleName}</p>
                <div className="flex items-center justify-center space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error State with Fallback */}
        {hasError && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-gradient-to-br from-background/95 to-muted/95">
            {fallbackImage ? (
              <div className="relative w-full h-full">
                <img 
                  src={fallbackImage} 
                  alt={vehicleName}
                  className="w-full h-full object-contain p-8"
                />
                <div className="absolute bottom-4 left-4 right-4">
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200">
                    3D model unavailable - showing image
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
                  <Settings className="w-8 h-8 text-destructive" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-foreground">3D Model Unavailable</p>
                  <p className="text-sm text-muted-foreground">Unable to load 3D model for {vehicleName}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3D Model Viewer */}
        <model-viewer
          ref={viewerRef}
          src={defaultModelUrl}
          camera-controls={enableControls}
          auto-rotate={isAutoRotating}
          auto-rotate-delay={1000}
          rotation-per-second="30deg"
          loading="lazy"
          reveal="auto"
          poster={fallbackImage}
          background-color={theme === 'dark' ? '#0f0f23' : '#ffffff'}
          environment-image={theme === 'dark' ? 'neutral' : 'warehouse'}
          shadow-intensity={0.3}
          shadow-softness={0.8}
          exposure={1.2}
          min-camera-orbit="auto auto 3m"
          max-camera-orbit="auto auto 12m"
          camera-orbit="0deg 75deg 6m"
          field-of-view="45deg"
          style={{
            width: '100%',
            height: '100%',
            minHeight: 400,
            borderRadius: '1.5rem'
          }}
          onLoad={handleLoad}
          onError={handleError}
        />

        {/* Control Panel */}
        {enableControls && (
          <div className={`absolute top-4 right-4 transition-all duration-300 ${
            showControls || isFullscreen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
          }`}>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2 bg-background/90 backdrop-blur-sm rounded-lg p-2 border border-border/30">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleAutoRotate}
                  className="h-8 w-8 p-0"
                  title={isAutoRotating ? 'Pause rotation' : 'Start rotation'}
                >
                  {isAutoRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetCamera}
                  className="h-8 w-8 p-0"
                  title="Reset camera"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleFullscreen}
                  className="h-8 w-8 p-0"
                  title="Toggle fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Info Panel */}
        <div className={`absolute bottom-4 left-4 right-4 transition-all duration-300 ${
          showControls || isLoading || hasError ? 'opacity-100 translate-y-0' : 'opacity-80'
        }`}>
          <div className="bg-background/90 backdrop-blur-sm rounded-lg p-3 border border-border/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm text-foreground">{vehicleName}</p>
                <p className="text-xs text-muted-foreground">
                  {hasError ? 'Fallback image' : '3D Interactive Model'}
                </p>
              </div>
              
              {!hasError && (
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                    Interactive
                  </Badge>
                  {isAutoRotating && (
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 border-green-200">
                      Auto-Rotate
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        {!hasError && !isLoading && (
          <div className={`absolute top-4 left-4 transition-all duration-300 ${
            showControls ? 'opacity-0' : 'opacity-60'
          }`}>
            <div className="bg-background/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-border/20">
              <p className="text-xs text-muted-foreground">
                Drag to rotate • Scroll to zoom • Double-click to reset
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Modern3DViewer;