// Vehicle images
import fordBroncoWildtrak from '@/assets/vehicles/ford-bronco-wildtrak.jpg';
import ramTrx from '@/assets/vehicles/ram-1500-trx.jpg';
import jeepWrangler from '@/assets/vehicles/jeep-wrangler-rubicon.jpg';
import toyota4Runner from '@/assets/vehicles/toyota-4runner-trd-pro.jpg';
import chevyColorado from '@/assets/vehicles/chevy-colorado-zr2.jpg';
import gmcSierra from '@/assets/vehicles/gmc-sierra-at4x.jpg';
import nissanFrontier from '@/assets/vehicles/nissan-frontier-pro4x.jpg';
import subaruOutback from '@/assets/vehicles/subaru-outback-wilderness.jpg';

// Product images
import airCompressor from '@/assets/products/air-compressor.jpg';
import bullBarBumper from '@/assets/products/bull-bar-bumper.jpg';
import ledLightbar from '@/assets/products/led-lightbar-50.jpg';
import mudTerrainTires from '@/assets/products/mud-terrain-tires.jpg';
import recoveryTracks from '@/assets/products/recovery-tracks.jpg';
import rockSliders from '@/assets/products/rock-sliders.jpg';
import roofRackSystem from '@/assets/products/roof-rack-system.jpg';
import suspensionLiftKit from '@/assets/products/suspension-lift-kit.jpg';
import winch12000lb from '@/assets/products/winch-12000lb.jpg';

// Insurance logos
import allstateLogo from '@/assets/insurance/allstate-logo.png';
import geicoLogo from '@/assets/insurance/geico-logo.png';
import progressiveLogo from '@/assets/insurance/progressive-logo.png';
import statefarmLogo from '@/assets/insurance/statefarm-logo.png';
import usaaLogo from '@/assets/insurance/usaa-logo.png';

// Rally event images
import rallyEvent1 from '@/assets/rally-event-1.jpg';
import rallyEvent2 from '@/assets/rally-event-2.jpg';
import rallyEvent3 from '@/assets/rally-event-3.jpg';
import rallyEvent4 from '@/assets/rally-event-4.jpg';
import rallyEvent5 from '@/assets/rally-event-5.jpg';
import rallyEvent6 from '@/assets/rally-event-6.jpg';

// Blog images
import coloradoDestinations from '@/assets/blog/colorado-destinations.jpg';
import fordBroncoRaptorBlog from '@/assets/blog/ford-bronco-raptor.jpg';
import jeepModifications from '@/assets/blog/jeep-modifications.jpg';
import kingOfHammers from '@/assets/blog/king-of-hammers.jpg';
import moabHellsRevenge from '@/assets/blog/moab-hells-revenge.jpg';
import recoveryGear from '@/assets/blog/recovery-gear.jpg';
import winchingTechniques from '@/assets/blog/winching-techniques.jpg';
import winterMaintenance from '@/assets/blog/winter-maintenance.jpg';

// Image mapping
const imageMap: Record<string, string> = {
  // Vehicles
  '/src/assets/vehicles/ford-bronco-wildtrak.jpg': fordBroncoWildtrak,
  '/src/assets/vehicles/ram-1500-trx.jpg': ramTrx,
  '/src/assets/vehicles/jeep-wrangler-rubicon.jpg': jeepWrangler,
  '/src/assets/vehicles/toyota-4runner-trd-pro.jpg': toyota4Runner,
  '/src/assets/vehicles/chevy-colorado-zr2.jpg': chevyColorado,
  '/src/assets/vehicles/gmc-sierra-at4x.jpg': gmcSierra,
  '/src/assets/vehicles/nissan-frontier-pro4x.jpg': nissanFrontier,
  '/src/assets/vehicles/subaru-outback-wilderness.jpg': subaruOutback,

  // Products
  '/src/assets/products/air-compressor.jpg': airCompressor,
  '/src/assets/products/bull-bar-bumper.jpg': bullBarBumper,
  '/src/assets/products/led-lightbar-50.jpg': ledLightbar,
  '/src/assets/products/mud-terrain-tires.jpg': mudTerrainTires,
  '/src/assets/products/recovery-tracks.jpg': recoveryTracks,
  '/src/assets/products/rock-sliders.jpg': rockSliders,
  '/src/assets/products/roof-rack-system.jpg': roofRackSystem,
  '/src/assets/products/suspension-lift-kit.jpg': suspensionLiftKit,
  '/src/assets/products/winch-12000lb.jpg': winch12000lb,

  // Insurance logos
  '/src/assets/insurance/allstate-logo.png': allstateLogo,
  '/src/assets/insurance/geico-logo.png': geicoLogo,
  '/src/assets/insurance/progressive-logo.png': progressiveLogo,
  '/src/assets/insurance/statefarm-logo.png': statefarmLogo,
  '/src/assets/insurance/usaa-logo.png': usaaLogo,

  // Rally events
  '/src/assets/rally-event-1.jpg': rallyEvent1,
  '/src/assets/rally-event-2.jpg': rallyEvent2,
  '/src/assets/rally-event-3.jpg': rallyEvent3,
  '/src/assets/rally-event-4.jpg': rallyEvent4,
  '/src/assets/rally-event-5.jpg': rallyEvent5,
  '/src/assets/rally-event-6.jpg': rallyEvent6,

  // Blog images
  '/src/assets/blog/colorado-destinations.jpg': coloradoDestinations,
  '/src/assets/blog/ford-bronco-raptor.jpg': fordBroncoRaptorBlog,
  '/src/assets/blog/jeep-modifications.jpg': jeepModifications,
  '/src/assets/blog/king-of-hammers.jpg': kingOfHammers,
  '/src/assets/blog/moab-hells-revenge.jpg': moabHellsRevenge,
  '/src/assets/blog/recovery-gear.jpg': recoveryGear,
  '/src/assets/blog/winching-techniques.jpg': winchingTechniques,
  '/src/assets/blog/winter-maintenance.jpg': winterMaintenance,
};

/**
 * Resolves image URLs to work in both development and production
 * @param imagePath - The image path from the database or component
 * @returns The resolved image URL
 */
export const resolveImageUrl = (imagePath: string | null): string => {
  if (!imagePath) {
    return '/placeholder.svg';
  }

  // If it's already a resolved import, return as is
  if (imagePath.startsWith('data:') || imagePath.startsWith('blob:') || imagePath.startsWith('http')) {
    return imagePath;
  }

  // Check if we have a mapped image first
  if (imageMap[imagePath]) {
    return imageMap[imagePath];
  }

  // For public folder images, ensure they work in production
  if (imagePath.startsWith('/public/')) {
    return imagePath.replace('/public/', '/');
  }

  // For src/assets paths, try to resolve them
  if (imagePath.startsWith('/src/assets/')) {
    const mappedImage = imageMap[imagePath];
    if (mappedImage) {
      return mappedImage;
    }
    // If not mapped, log warning and return placeholder
    console.warn(`Image not found in imageMap: ${imagePath}`);
    return '/placeholder.svg';
  }

  // For assets paths without /src prefix
  if (imagePath.startsWith('assets/')) {
    const fullPath = `/src/${imagePath}`;
    return imageMap[fullPath] || '/placeholder.svg';
  }

  // For relative paths starting with ./
  if (imagePath.startsWith('./')) {
    const cleanPath = imagePath.replace('./', '/src/assets/');
    return imageMap[cleanPath] || '/placeholder.svg';
  }

  // If it starts with '/', it's likely a public path
  if (imagePath.startsWith('/')) {
    return imagePath;
  }

  // Try to resolve as relative asset path
  const assetPath = `/src/assets/${imagePath}`;
  if (imageMap[assetPath]) {
    return imageMap[assetPath];
  }

  // Default fallback
  console.warn(`Could not resolve image path: ${imagePath}`);
  return '/placeholder.svg';
};

/**
 * Pre-loads an image to improve performance
 * @param src - The image source URL
 * @returns Promise that resolves when image is loaded
 */
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

export default resolveImageUrl;