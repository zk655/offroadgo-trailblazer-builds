import React from 'react';
import AdSenseAd from './AdSenseAd';

interface AdPlacementProps {
  position: 'top' | 'middle' | 'bottom' | 'sidebar' | 'inline';
  className?: string;
  pageType?: 'home' | 'vehicles' | 'insurance' | 'parts' | 'blog' | 'other';
  clientId?: string;
}

// Multiple slot options per position
const adSlotsByPosition: Record<AdPlacementProps['position'], string[]> = {
  top: ['8773228071', '2268201929'],
  middle: ['2268201929', '6871374497'],
  bottom: ['3788333009', '5395297838'],
  sidebar: ['5395297838', '8773228071'],
  inline: ['6871374497', '2268201929'],
};

// Default format
const defaultFormat: Record<AdPlacementProps['position'], string> = {
  top: 'auto',
  middle: 'fluid',
  bottom: 'auto',
  sidebar: 'rectangle',
  inline: 'fluid',
};

// Default layout
const defaultLayout: Partial<Record<AdPlacementProps['position'], string>> = {
  inline: 'in-article',
  middle: 'in-article',
};

// Get slot with session rotation
const getSessionSlot = (position: AdPlacementProps['position']): string => {
  const key = `ad-slot-${position}`;
  const saved = sessionStorage.getItem(key);
  if (saved) return saved;

  const pool = adSlotsByPosition[position] || [];
  const random = pool[Math.floor(Math.random() * pool.length)] || '';
  sessionStorage.setItem(key, random);
  return random;
};

const AdPlacement: React.FC<AdPlacementProps> = ({
  position,
  className = '',
  pageType = 'other',
  clientId
}) => {
  const slot = typeof window !== 'undefined' ? getSessionSlot(position) : adSlotsByPosition[position][0];
  const format = defaultFormat[position];
  const layout = defaultLayout[position] || undefined;

  return (
    <div className={`ad-placement ad-placement-${position} ${className} flex justify-center`}>
      <AdSenseAd
        slot={slot}
        format={format}
        layout={layout}
        className={`ad-${position} w-full max-w-4xl`}
        clientId={clientId}
      />
    </div>
  );
};

export default AdPlacement;
