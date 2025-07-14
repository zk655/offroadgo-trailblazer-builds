export interface Real3DViewerProps {
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
export const CAR_MODEL_URLS: Record<string, string> = {
  '1': 'https://crudblobs.blob.core.windows.net/models/fordfigo.glb', // Ford Bronco Raptor
  '2': 'https://crudblobs.blob.core.windows.net/models/fordfigo.glb', // Ford F-150 Raptor (using same model for demo)
  '6': 'https://crudblobs.blob.core.windows.net/models/fordfigo.glb', // Ram TRX
  '10': 'https://crudblobs.blob.core.windows.net/models/fordfigo.glb', // Jeep Wrangler
  '15': 'https://crudblobs.blob.core.windows.net/models/fordfigo.glb', // Toyota 4Runner
  '20': 'https://crudblobs.blob.core.windows.net/models/fordfigo.glb', // Chevy Colorado
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