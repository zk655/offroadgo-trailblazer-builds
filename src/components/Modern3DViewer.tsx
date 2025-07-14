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
  Maximize2,
  Move3D
} from 'lucide-react';

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
  const [isAutoRotating, setIsAutoRotating] = useState(autoRotate);
  const [showControls, setShowControls] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [rotationY, setRotationY] = useState(0);
  const [rotationX, setRotationX] = useState(-10);
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<HTMLDivElement>(null);

  // Auto rotation effect
  useEffect(() => {
    if (!isAutoRotating) return;
    
    const interval = setInterval(() => {
      setRotationY(prev => (prev + 1) % 360);
    }, 50);
    
    return () => clearInterval(interval);
  }, [isAutoRotating]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!enableControls) return;
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
    setIsAutoRotating(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !enableControls) return;
    
    const deltaX = e.clientX - lastMousePos.x;
    const deltaY = e.clientY - lastMousePos.y;
    
    setRotationY(prev => prev + deltaX * 0.5);
    setRotationX(prev => Math.max(-90, Math.min(90, prev - deltaY * 0.5)));
    
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!enableControls) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale(prev => Math.max(0.5, Math.min(3, prev + delta)));
  };

  const toggleAutoRotate = () => {
    setIsAutoRotating(!isAutoRotating);
  };

  const resetCamera = () => {
    setRotationX(-10);
    setRotationY(0);
    setScale(1);
  };

  const zoomIn = () => {
    setScale(prev => Math.min(3, prev + 0.2));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(0.5, prev - 0.2));
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
      className={`relative group ${className} select-none`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <Card className={`relative overflow-hidden rounded-3xl border-border/30 shadow-2xl bg-gradient-to-br ${
        theme === 'dark' 
          ? 'from-slate-900/50 to-slate-800/30' 
          : 'from-white to-gray-50/50'
      } backdrop-blur-sm h-[500px]`}>
        
        {/* 3D Scene Container */}
        <div 
          className="relative w-full h-full flex items-center justify-center perspective-1000 cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          style={{ perspective: '1000px' }}
        >
          {/* 3D Model Container */}
          <div
            ref={modelRef}
            className="relative transform-gpu transition-transform duration-75 ease-out"
            style={{
              transform: `
                rotateX(${rotationX}deg) 
                rotateY(${rotationY}deg) 
                scale3d(${scale}, ${scale}, ${scale})
              `,
              transformStyle: 'preserve-3d'
            }}
          >
            {/* Vehicle Image with 3D Frame */}
            <div className="relative">
              {/* Main vehicle image */}
              <div 
                className="w-80 h-64 rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-white to-gray-100"
                style={{
                  transform: 'translateZ(20px)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3), 0 0 0 2px rgba(255,255,255,0.1)'
                }}
              >
                <img 
                  src={fallbackImage || '/placeholder.svg'} 
                  alt={vehicleName}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* 3D Frame sides */}
              <div 
                className="absolute inset-0 w-80 h-64 bg-gradient-to-r from-orange-500/20 to-orange-400/20 rounded-2xl"
                style={{
                  transform: 'translateZ(-20px) rotateY(180deg)',
                  boxShadow: 'inset 0 0 20px rgba(255,165,0,0.3)'
                }}
              />
              
              {/* Side panels for depth */}
              <div 
                className="absolute top-0 left-0 w-10 h-64 bg-gradient-to-r from-orange-600/30 to-orange-500/20"
                style={{
                  transform: 'rotateY(-90deg) translateZ(20px)',
                  transformOrigin: 'left center'
                }}
              />
              <div 
                className="absolute top-0 right-0 w-10 h-64 bg-gradient-to-l from-orange-600/30 to-orange-500/20"
                style={{
                  transform: 'rotateY(90deg) translateZ(20px)',
                  transformOrigin: 'right center'
                }}
              />
              
              {/* Top and bottom panels */}
              <div 
                className="absolute top-0 left-0 w-80 h-10 bg-gradient-to-b from-orange-600/30 to-orange-500/20"
                style={{
                  transform: 'rotateX(90deg) translateZ(20px)',
                  transformOrigin: 'top center'
                }}
              />
              <div 
                className="absolute bottom-0 left-0 w-80 h-10 bg-gradient-to-t from-orange-600/30 to-orange-500/20"
                style={{
                  transform: 'rotateX(-90deg) translateZ(20px)',
                  transformOrigin: 'bottom center'
                }}
              />
            </div>
          </div>
          
          {/* Ambient lighting effect */}
          <div className="absolute inset-0 bg-gradient-radial from-orange-500/5 via-transparent to-transparent pointer-events-none" />
        </div>

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
                  title="Reset view"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={zoomIn}
                  className="h-8 w-8 p-0"
                  title="Zoom in"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={zoomOut}
                  className="h-8 w-8 p-0"
                  title="Zoom out"
                >
                  <ZoomOut className="w-4 h-4" />
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
          showControls ? 'opacity-100 translate-y-0' : 'opacity-80'
        }`}>
          <div className="bg-background/90 backdrop-blur-sm rounded-lg p-3 border border-border/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm text-foreground">{vehicleName}</p>
                <p className="text-xs text-muted-foreground">3D Interactive Viewer</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                  <Move3D className="w-3 h-3 mr-1" />
                  3D
                </Badge>
                {isAutoRotating && (
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 border-green-200">
                    Auto-Rotate
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className={`absolute top-4 left-4 transition-all duration-300 ${
          showControls ? 'opacity-0' : 'opacity-60'
        }`}>
          <div className="bg-background/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-border/20">
            <p className="text-xs text-muted-foreground">
              Drag to rotate • Scroll to zoom • Controls on hover
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Modern3DViewer;