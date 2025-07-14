import { Suspense, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Html, useProgress, useGLTF } from '@react-three/drei';
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
  Loader2,
  AlertTriangle
} from 'lucide-react';
import * as THREE from 'three';

interface Real3DViewerProps {
  vehicleName: string;
  vehicleId?: string;
  modelUrl?: string;
  fallbackImage?: string;
  autoRotate?: boolean;
  enableControls?: boolean;
  theme?: 'light' | 'dark';
  className?: string;
}

// Car model URLs from free sources
const CAR_MODEL_URLS: Record<string, string> = {
  '1': 'https://crudblobs.blob.core.windows.net/models/fordfigo.glb', // Ford Bronco Raptor
  '2': 'https://crudblobs.blob.core.windows.net/models/fordfigo.glb', // Ford F-150 Raptor (using same model for demo)
  '6': 'https://crudblobs.blob.core.windows.net/models/fordfigo.glb', // Ram TRX
  '10': 'https://crudblobs.blob.core.windows.net/models/fordfigo.glb', // Jeep Wrangler
  '15': 'https://crudblobs.blob.core.windows.net/models/fordfigo.glb', // Toyota 4Runner
  '20': 'https://crudblobs.blob.core.windows.net/models/fordfigo.glb', // Chevy Colorado
};

// 3D Car Model component with error handling
function CarModel({ vehicleId, modelUrl }: { vehicleId?: string; modelUrl?: string }) {
  const meshRef = useRef<THREE.Group>(null);
  
  // Determine which model URL to use
  const finalModelUrl = modelUrl || (vehicleId ? CAR_MODEL_URLS[vehicleId] : null);
  
  let gltf;
  let error = false;
  
  try {
    if (finalModelUrl) {
      gltf = useGLTF(finalModelUrl);
    }
  } catch (err) {
    console.warn('Failed to load 3D model:', err);
    error = true;
  }
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  // If model loaded successfully, display it
  if (gltf && gltf.scene && !error) {
    return (
      <group ref={meshRef} position={[0, -1, 0]}>
        <primitive 
          object={gltf.scene.clone()} 
          scale={[2, 2, 2]}
          position={[0, 0, 0]}
        />
      </group>
    );
  }
  
  // Fallback to SimpleCar for missing models or errors
  return <SimpleCar />;
}

// Error boundary component for 3D models
function ModelErrorBoundary({ children, onError }: { children: React.ReactNode; onError: () => void }) {
  try {
    return <>{children}</>;
  } catch (error) {
    console.error('3D Model Error:', error);
    onError();
    return <SimpleCar />;
  }
}

// Simple car geometry as fallback when no model is provided
function SimpleCar() {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <group ref={meshRef} position={[0, -0.5, 0]}>
      {/* Car Body */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[4, 1, 2]} />
        <meshStandardMaterial color="#ff4444" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Car Cabin */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[2.5, 0.8, 1.8]} />
        <meshStandardMaterial color="#222222" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Wheels */}
      {([[-1.3, 0, 1], [1.3, 0, 1], [-1.3, 0, -1], [1.3, 0, -1]] as const).map((pos, i) => (
        <mesh key={i} position={pos} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.3]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
      ))}
      
      {/* Headlights */}
      <mesh position={[1.8, 0.6, 0.7]}>
        <sphereGeometry args={[0.2]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[1.8, 0.6, -0.7]}>
        <sphereGeometry args={[0.2]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

// Loading component
function Loader() {
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