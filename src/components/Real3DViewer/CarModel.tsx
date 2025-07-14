import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { CAR_MODEL_URLS } from './types';
import { SimpleCar } from './SimpleCar';

// 3D Car Model component with error handling
export function CarModel({ vehicleId, modelUrl }: { vehicleId?: string; modelUrl?: string }) {
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