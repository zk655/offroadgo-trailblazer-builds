import { Suspense, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
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
  Move3D,
  AlertTriangle
} from 'lucide-react';
import { Real3DViewerProps } from './types';
import { CarModel } from './CarModel';
import { Loader } from './Loader';
import { ModelErrorBoundary } from './ModelErrorBoundary';

const Real3DViewer = ({ 
  vehicleName, 
  vehicleId,
  modelUrl, 
  fallbackImage,
  autoRotate = true,
  enableControls = true,
  theme = 'dark',
  className = ''
}: Real3DViewerProps) => {
  const [isAutoRotating, setIsAutoRotating] = useState(autoRotate);
  const [showControls, setShowControls] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [modelError, setModelError] = useState(false);
  const controlsRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleModelError = () => {
    setModelError(true);
  };

  const toggleAutoRotate = () => {
    setIsAutoRotating(!isAutoRotating);
  };

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const zoomIn = () => {
    if (controlsRef.current) {
      controlsRef.current.dollyIn(0.8);
      controlsRef.current.update();
    }
  };

  const zoomOut = () => {
    if (controlsRef.current) {
      controlsRef.current.dollyOut(0.8);
      controlsRef.current.update();
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
        
        {/* 3D Canvas */}
        <Canvas
          camera={{ position: [5, 3, 5], fov: 45 }}
          className="w-full h-full"
          gl={{ 
            antialias: true, 
            alpha: true,
            powerPreference: "high-performance"
          }}
        >
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={1} 
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <pointLight position={[-10, 0, -20]} intensity={0.5} color="#ff7f00" />

          {/* Environment */}
          <Environment preset={theme === 'dark' ? 'night' : 'city'} />
          
          {/* 3D Model */}
          <Suspense fallback={<Loader />}>
            <ModelErrorBoundary onError={handleModelError}>
              <CarModel vehicleId={vehicleId} modelUrl={modelUrl} />
            </ModelErrorBoundary>
            <ContactShadows 
              position={[0, -1, 0]} 
              opacity={0.4} 
              scale={10} 
              blur={2} 
              far={4} 
              resolution={256} 
              color={theme === 'dark' ? '#000000' : '#999999'}
            />
          </Suspense>

          {/* Camera Controls */}
          <OrbitControls
            ref={controlsRef}
            enabled={enableControls}
            autoRotate={isAutoRotating}
            autoRotateSpeed={2}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={3}
            maxDistance={15}
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 2}
            target={[0, 0, 0]}
          />
        </Canvas>

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
                <p className="text-xs text-muted-foreground">
                  {modelError ? 'Fallback 3D Model' : 'Real-time 3D Model'}
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
                  <Move3D className="w-3 h-3 mr-1" />
                  3D
                </Badge>
                {modelError && (
                  <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800 border-orange-200">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Fallback
                  </Badge>
                )}
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
              Drag to orbit • Scroll to zoom • Right-drag to pan
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Real3DViewer;