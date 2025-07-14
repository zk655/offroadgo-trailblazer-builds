import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { Group } from 'three';

interface Car3DProps {
  imageUrl: string;
  vehicleName: string;
  autoRotate?: boolean;
}

// Optimized 3D Car Display - Simple and Fast
const OptimizedCarDisplay = ({ imageUrl, vehicleName }: { imageUrl: string; vehicleName: string }) => {
  const meshRef = useRef<Group>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <group ref={meshRef} position={[0, 0, 0]}>
      {/* HTML-based image display for better performance */}
      <Html center>
        <div className="relative w-96 h-64 rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-muted to-muted/50 border border-border/30">
          <img 
            src={imageUrl} 
            alt={vehicleName}
            className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            style={{ objectPosition: 'center' }}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted animate-pulse">
              <div className="text-center text-muted-foreground">
                <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-primary/20 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-sm">Loading...</p>
              </div>
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <h3 className="text-white font-bold text-lg drop-shadow-lg">{vehicleName}</h3>
          </div>
        </div>
      </Html>
      
      {/* Simple geometric elements for 3D feel */}
      <mesh position={[0, 0, -2]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2, 2.2, 8]} />
        <meshBasicMaterial color="#333" transparent opacity={0.2} />
      </mesh>
    </group>
  );
};

const Car3D = ({ imageUrl, vehicleName, autoRotate = true }: Car3DProps) => {
  return (
    <>
      {/* Minimal lighting for better performance */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.4} />
      
      <OptimizedCarDisplay imageUrl={imageUrl} vehicleName={vehicleName} />
      
      <OrbitControls 
        enablePan={false} 
        enableZoom={true}
        minDistance={3}
        maxDistance={8}
        autoRotate={autoRotate} 
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 4}
      />
    </>
  );
};

export default Car3D;