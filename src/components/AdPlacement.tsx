// components/AdPlacement.tsx
import AdSenseAd from './AdSenseAd';

interface AdPlacementProps {
  position: 'top' | 'middle' | 'bottom' | 'sidebar' | 'inline';
  className?: string;
}

const AdPlacement = ({ position, className = '' }: AdPlacementProps) => {
  const adSlotMap = {
    top: { desktop: '8773228071', mobile: '2268201929', format: 'auto' },
    middle: { desktop: '2268201929', mobile: '6871374497', format: 'fluid', layout: 'in-article' },
    bottom: { desktop: '3788333009', mobile: '2268201929', format: 'auto' },
    sidebar: { desktop: '5395297838', format: 'rectangle' },
    inline: { desktop: '6871374497', format: 'fluid', layout: 'in-article' },
  };

  const config = adSlotMap[position];

  return (
    <div className={`ad-placement-${position} ${className} flex justify-center`}>
      <AdSenseAd
        slotDesktop={config.desktop}
        slotMobile={config.mobile}
        format={config.format}
        layout={config.layout}
        sticky={position === 'sidebar'}
        className="w-full max-w-4xl"
      />
    </div>
  );
};

export default AdPlacement;
