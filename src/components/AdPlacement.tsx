import React, { useMemo } from 'react';
import AdSenseAd from './AdSenseAd';

interface AdPlacementProps {
  position: 'top' | 'middle' | 'bottom' | 'sidebar' | 'inline';
  className?: string;
  pageType?: 'home' | 'vehicles' | 'insurance' | 'parts' | 'blog' | 'other';
  clientId?: string;
}

const adSlots: Record<string, string[]> = {
  top: ['8773228071', '4973228012'],
  middle: ['2268201929', '3368201999'],
  bottom: ['3788333009', '4688333088'],
  sidebar: ['5395297838', '6395297899'],
  inline: ['6871374497', '7871374400']
};

const AdPlacement: React.FC<AdPlacementProps> = ({
  position,
  className = '',
  pageType = 'other',
  clientId = 'ca-pub-6402737863827515'
}) => {
  const adSlot = useMemo(() => {
    const key = `adslot-${position}-${clientId}`;
    const saved = sessionStorage.getItem(key);
    if (saved) return saved;

    const slots = adSlots[position];
    const randomSlot = slots?.[Math.floor(Math.random() * slots.length)] || slots?.[0] || '';
    if (randomSlot) sessionStorage.setItem(key, randomSlot);
    return randomSlot;
  }, [position, clientId]);

  const format =
    ['middle', 'inline'].includes(position) ? 'fluid' :
    position === 'sidebar' ? 'rectangle' :
    'auto';

  const layout = (position === 'inline' && format === 'fluid') ? 'in-article' : null;

  return (
    <div className={`ad-placement ad-${position} ${className} flex justify-center`}>
      <AdSenseAd
        key={`${position}-${adSlot}`}
        slot={adSlot}
        format={format}
        layout={layout}
        className="w-full max-w-4xl"
        clientId={clientId}
      />
    </div>
  );
};

export default AdPlacement;
