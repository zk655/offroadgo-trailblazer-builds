import React from 'react';
import AdSenseAd from './AdSenseAd';

interface AdPlacementProps {
  position: 'top' | 'middle' | 'bottom' | 'sidebar' | 'inline';
  className?: string;
  pageType?: 'home' | 'vehicles' | 'insurance' | 'parts' | 'blog' | 'other';
  clientId?: string;
}

const AdPlacement: React.FC<AdPlacementProps> = ({
  position,
  className = '',
  pageType = 'other',
  clientId
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

  return (
    <div className={`ad-placement ad-placement-${position} ${className} flex justify-center`}>
      <AdSenseAd
        slot={getAdSlot()}
        format={getAdFormat()}
        layout={getAdLayout()}
        className={`ad-${position} w-full max-w-4xl`}
        clientId={clientId}
      />
    </div>
  );
};

export default AdPlacement;