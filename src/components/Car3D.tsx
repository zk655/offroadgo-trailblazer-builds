import { useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Environment, OrbitControls, Text } from '@react-three/drei';
import { Group, TextureLoader } from 'three';

interface Car3DProps {
  imageUrl: string;
  vehicleName: string;
  autoRotate?: boolean;
}

// 3D Car Display using real images
const CarDisplay = ({ imageUrl, vehicleName }: { imageUrl: string; vehicleName: string }) => {
  const meshRef = useRef<Group>(null);
  const texture = useLoader(TextureLoader, imageUrl);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
  });

  return (
    <group ref={meshRef} position={[0, 0, 0]}>
      {/* Main car image display */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <planeGeometry args={[6, 4]} />
        <meshStandardMaterial 
          map={texture} 
          transparent
          alphaTest={0.1}
          side={2}
        />
      </mesh>
      
      {/* Subtle 3D frame around the image */}
      <mesh position={[0, 0, -0.1]}>
        <boxGeometry args={[6.2, 4.2, 0.1]} />
        <meshStandardMaterial 
          color="#1a1a1a" 
          metalness={0.8} 
          roughness={0.2}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Floating car name */}
      <Text
        position={[0, -2.5, 0.1]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/helvetiker_regular.typeface.json"
      >
        {vehicleName}
      </Text>

      {/* Additional visual elements */}
      <mesh position={[0, 0, -0.2]}>
        <ringGeometry args={[3.5, 3.8, 32]} />
        <meshStandardMaterial 
          color="#444" 
          transparent 
          opacity={0.3}
          side={2}
        />
      </mesh>
    </group>
  );
};

const Car3D = ({ imageUrl, vehicleName, autoRotate = true }: Car3DProps) => {
  return (
    <>
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-10, -10, -10]} intensity={0.4} />
      <directionalLight position={[0, 5, 5]} intensity={0.6} />
      <spotLight position={[0, 10, 0]} intensity={0.5} angle={0.3} penumbra={0.1} />
      
      <CarDisplay imageUrl={imageUrl} vehicleName={vehicleName} />
      
      <Environment preset="city" />
      <OrbitControls 
        enablePan={false} 
        enableZoom={true}
        minDistance={4}
        maxDistance={12}
        autoRotate={autoRotate} 
        autoRotateSpeed={1}
        maxPolarAngle={Math.PI / 1.8}
        minPolarAngle={Math.PI / 6}
      />
    </>
  );
};

export default Car3D;