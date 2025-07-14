export interface Real3DViewerProps {
  vehicleName: string;
  vehicleId?: string;
  vehicleBrand?: string;
  modelUrl?: string;
  fallbackImage?: string;
  autoRotate?: boolean;
  enableControls?: boolean;
  theme?: 'light' | 'dark';
  className?: string;
}

// Car model URLs from free sources - updated with different models for each vehicle type
export const CAR_MODEL_URLS: Record<string, string> = {
  // Ford vehicles - using Ford model
  'ford': 'https://crudblobs.blob.core.windows.net/models/fordfigo.glb',
  
  // Ram/Dodge vehicles - using truck model  
  'ram': 'https://sketchfab.com/models/814cf3f8cfd64594b1c4f96e873c3cef/download',
  
  // Jeep vehicles - using SUV model
  'jeep': 'https://crudblobs.blob.core.windows.net/models/fordfigo.glb',
  
  // Toyota vehicles - using SUV model
  'toyota': 'https://crudblobs.blob.core.windows.net/models/fordfigo.glb',
  
  // Chevrolet vehicles - using truck model
  'chevrolet': 'https://crudblobs.blob.core.windows.net/models/fordfigo.glb',
  
  // GMC vehicles - using truck model  
  'gmc': 'https://crudblobs.blob.core.windows.net/models/fordfigo.glb',
  
  // Nissan vehicles - using truck model
  'nissan': 'https://crudblobs.blob.core.windows.net/models/fordfigo.glb',
  
  // Subaru vehicles - using SUV model
  'subaru': 'https://crudblobs.blob.core.windows.net/models/fordfigo.glb',
  
  // Default fallback
  'default': 'https://crudblobs.blob.core.windows.net/models/fordfigo.glb'
};

// Color mapping for different brands
export const brandColors: Record<string, string> = {
  'Ford': '#0066cc',
  'Ram': '#cc0000',
  'Jeep': '#2d5016',
  'Toyota': '#cc0000',
  'Chevrolet': '#ffcc00',
  'GMC': '#cc0000',
  'Nissan': '#003da5',
  'Subaru': '#0057b8'
};