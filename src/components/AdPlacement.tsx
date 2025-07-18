import React, { useMemo } from 'react';
import AdSenseAd from './AdSenseAd';

interface AdPlacementProps {
  position: 'top' | 'middle' | 'bottom' | 'sidebar' | 'inline';
  className?: string;
  pageType?: 'home' | 'vehicles' | 'insurance' | 'parts' | 'blog' | 'other';
  clientId?: string;
}

const adSlots: Record<string, string[]> = {
  top: ['8773228071'],
  middle: ['2268201929', '6871374497'],
  bottom: ['3788333009'],
  sidebar: ['5395297838'],
  inline: ['3123701172', '1671234307'],
};

const AdPlacement: React.FC<AdPlacementProps> = ({
  position,
  className = '',
  pageType = 'other',
  clientId
}) => {
  // Random ad slot rotation (session-based)
  const selectedSlot = useMemo(() => {
    const slots = adSlots[position] || [];
    if (slots.length === 0) return null;

    const sessionKey = `ad-slot-${position}`;
    const storedSlot = sessionStorage.getItem(sessionKey);

    if (storedSlot && slots.includes(storedSlot)) {
      return storedSlot;
    } else {
      const randomSlot = slots[Math.floor(Math.random() * slots.length)];
      sessionStorage.setItem(sessionKey, randomSlot);
      return randomSlot;
    }
  }, [position]);

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

  if (!selectedSlot) return null;

  return (
    <div className={`ad-placement ad-placement-${position} ${className} flex justify-center`}>
      <AdSenseAd
        slot={selectedSlot}
        format={getAdFormat()}
        layout={getAdLayout()}
        className={`ad-${position} w-full max-w-4xl`}
        clientId={clientId}
      />
    </div>
  );
};

export default AdPlacement;
