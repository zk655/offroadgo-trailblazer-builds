import { useRef, useState } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Group, TextureLoader } from 'three';

interface Car3DProps {
  imageUrl: string;
  vehicleName: string;
  autoRotate?: boolean;
}

// True 3D Car Display with optimized performance
const Car3DDisplay = ({ imageUrl, vehicleName }: { imageUrl: string; vehicleName: string }) => {
  const meshRef = useRef<Group>(null);
  const [loading, setLoading] = useState(true);

  // Load texture properly
  const texture = useLoader(TextureLoader, imageUrl);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
    
    // Hide loading when texture is loaded
    if (texture && loading) {
      setLoading(false);
    }
  });

  return (
    <group ref={meshRef} position={[0, 0, 0]}>
      {/* Main 3D car display plane */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <planeGeometry args={[4, 3]} />
        <meshStandardMaterial 
          map={texture} 
          transparent 
          opacity={loading ? 0 : 1}
          alphaTest={0.1}
        />
      </mesh>
      
      {/* 3D Frame around the car */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[4.2, 3.2, 0.1]} />
        <meshStandardMaterial 
          color="#2a2a2a" 
          metalness={0.7} 
          roughness={0.3}
        />
      </mesh>

      {/* 3D Text floating below */}
      <mesh position={[0, -2, 0.1]}>
        <planeGeometry args={[3, 0.5]} />
        <meshBasicMaterial color="#1a1a1a" transparent opacity={0.8} />
      </mesh>

      {/* Decorative 3D rings */}
      <mesh position={[0, 0, -0.3]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.5, 2.7, 16]} />
        <meshBasicMaterial color="#444" transparent opacity={0.3} />
      </mesh>
      
      <mesh position={[0, 0, -0.4]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.8, 3.0, 8]} />
        <meshBasicMaterial color="#666" transparent opacity={0.2} />
      </mesh>

      {/* Loading indicator in 3D space */}
      {loading && (
        <mesh position={[0, 0, 0.1]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial color="#333" transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  );
};

const Car3D = ({ imageUrl, vehicleName, autoRotate = true }: Car3DProps) => {
  return (
    <>
      {/* Optimized lighting setup */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.6} />
      <pointLight position={[-5, 5, 5]} intensity={0.3} />
      
      <Car3DDisplay imageUrl={imageUrl} vehicleName={vehicleName} />
      
      <OrbitControls 
        enablePan={false} 
        enableZoom={true}
        minDistance={3}
        maxDistance={10}
        autoRotate={autoRotate} 
        autoRotateSpeed={0.8}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 6}
      />
    </>
  );
};

export default Car3D;