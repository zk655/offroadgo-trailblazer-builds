import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Simple car geometry as fallback when no model is provided
export function SimpleCar() {
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