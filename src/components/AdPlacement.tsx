import React from 'react';
import AdSenseAd from './AdSenseAd';

interface AdPlacementProps {
  position: 'top' | 'middle' | 'bottom' | 'sidebar' | 'inline';
  className?: string;
  pageType?: 'home' | 'vehicles' | 'insurance' | 'parts' | 'blog' | 'other';
}

const AdPlacement: React.FC<AdPlacementProps> = ({ 
  position, 
  className = '',
  pageType = 'other'
}) => {
  // Different ad slot IDs for different positions and page types
  const getAdSlot = () => {
    switch (position) {
      case 'top':
        return '8773228071'; // Top banner ads
      case 'middle':
        return '2268201929'; // Middle content ads
      case 'bottom':
        return '3788333009'; // Bottom ads
      case 'sidebar':
        return '5395297838'; // Sidebar ads
      case 'inline':
        return '6871374497'; // Inline content ads
      default:
        return '8773228071';
    }
  };

  const getAdFormat = () => {
    switch (position) {
      case 'top':
      case 'bottom':
        return 'auto';
      case 'sidebar':
        return 'rectangle';
      case 'middle':
      case 'inline':
        return 'fluid';
      default:
        return 'auto';
    }
  };

  const getAdLayout = () => {
    switch (position) {
      case 'inline':
        return 'in-article';
      case 'sidebar':
        return null;
      default:
        return 'in-article';
    }
  };

  return (
    <div className={`ad-placement ad-placement-${position} ${className} flex justify-center`}>
      <AdSenseAd
        slot={getAdSlot()}
        format={getAdFormat()}
        layout={getAdLayout()}
        className={`ad-${position} w-full max-w-4xl`}
      />
    </div>
  );
};

export default AdPlacement;