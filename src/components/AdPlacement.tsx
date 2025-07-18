import React from 'react';
import AdSenseAd from './AdSenseAd';

interface AdPlacementProps {
  position: 'top' | 'middle' | 'bottom' | 'sidebar' | 'inline';
  className?: string;
  pageType?: 'home' | 'vehicles' | 'insurance' | 'parts' | 'blog' | 'other';
  clientId?: string;
  sticky?: boolean; // Enable sticky positioning for sidebar ads
}

const AdPlacement: React.FC<AdPlacementProps> = ({
  position,
  className = '',
  pageType = 'other',
  clientId,
  sticky = false
}) => {
  const getAdSlot = () => {
    switch (position) {
      case 'top': return '8773228071';
      case 'middle': return '2268201929';
      case 'bottom': return '3788333009';
      case 'sidebar': return '5395297838';
      case 'inline': return '6871374497';
      default: return '8773228071';
    }
  };

  const getAdFormat = () => {
    switch (position) {
      case 'sidebar': return 'rectangle';
      case 'middle':
      case 'inline': return 'fluid';
      default: return 'auto';
    }
  };

  const getAdLayout = () => {
    return position === 'inline' ? 'in-article' : null;
  };

  const getResponsiveClasses = () => {
    const baseClasses = 'ad-placement flex justify-center';
    const positionClasses = `ad-placement-${position}`;
    
    // Responsive layout classes
    const responsiveClasses = {
      top: 'w-full px-2 sm:px-4 lg:px-6',
      middle: 'w-full px-2 sm:px-4 lg:px-6',
      bottom: 'w-full px-2 sm:px-4 lg:px-6',
      sidebar: `w-full max-w-xs lg:max-w-sm ${sticky ? 'lg:sticky lg:top-4' : ''}`,
      inline: 'w-full max-w-2xl mx-auto px-4'
    };

    return `${baseClasses} ${positionClasses} ${responsiveClasses[position]} ${className}`;
  };

  const getAdClasses = () => {
    const baseClasses = `ad-${position} w-full`;
    
    // Format-specific responsive classes
    const formatClasses = {
      top: 'max-w-4xl',
      middle: 'max-w-4xl', 
      bottom: 'max-w-4xl',
      sidebar: 'max-w-full', // Rectangle format, constrained by container
      inline: 'max-w-2xl'
    };

    return `${baseClasses} ${formatClasses[position]}`;
  };

  return (
    <div className={getResponsiveClasses()}>
      <AdSenseAd
        slot={getAdSlot()}
        format={getAdFormat()}
        layout={getAdLayout()}
        className={getAdClasses()}
        clientId={clientId}
      />
    </div>
  );
};

export default AdPlacement;