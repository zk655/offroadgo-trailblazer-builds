import React from 'react';
import { SimpleCar } from './SimpleCar';

// Error boundary component for 3D models
export function ModelErrorBoundary({ children, onError }: { children: React.ReactNode; onError: () => void }) {
  try {
    return <>{children}</>;
  } catch (error) {
    console.error('3D Model Error:', error);
    onError();
    return <SimpleCar />;
  }
}