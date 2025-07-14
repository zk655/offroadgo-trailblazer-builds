import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { Group } from 'three';

interface Car3DProps {
  color?: string;
  autoRotate?: boolean;
}

// Simple car geometry using basic shapes since we don't have GLTF models
const SimpleCar = ({ color = '#ff4444' }: { color?: string }) => {
  const meshRef = useRef<Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={meshRef} position={[0, -0.5, 0]}>
      {/* Car body */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[2, 0.8, 4]} />
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.2} />
      </mesh>
      
      {/* Car roof */}
      <mesh position={[0, 0.9, -0.2]} rotation={[0, 0, 0]}>
        <boxGeometry args={[1.6, 0.6, 2.5]} />
        <meshStandardMaterial color={color} metalness={0.4} roughness={0.3} />
      </mesh>

      {/* Wheels */}
      <mesh position={[-0.8, -0.2, 1.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2]} />
        <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.8, -0.2, 1.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2]} />
        <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[-0.8, -0.2, -1.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2]} />
        <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.8, -0.2, -1.2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.2]} />
        <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Headlights */}
      <mesh position={[-0.6, 0.2, 2.1]}>
        <sphereGeometry args={[0.15]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0.6, 0.2, 2.1]}>
        <sphereGeometry args={[0.15]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.2} />
      </mesh>

      {/* Windscreen */}
      <mesh position={[0, 0.8, 0.5]}>
        <boxGeometry args={[1.4, 0.5, 0.1]} />
        <meshStandardMaterial color="#87CEEB" transparent opacity={0.3} />
      </mesh>
    </group>
  );
};

const Car3D = ({ color = '#ff4444', autoRotate = true }: Car3DProps) => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      <directionalLight position={[0, 5, 5]} intensity={0.5} />
      
      <SimpleCar color={color} />
      
      <Environment preset="sunset" />
      <OrbitControls 
        enablePan={false} 
        enableZoom={false} 
        autoRotate={autoRotate} 
        autoRotateSpeed={2}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 4}
      />
    </>
  );
};

export default Car3D;