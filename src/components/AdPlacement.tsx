import React, { useState, useEffect, useMemo } from 'react';
import AdSenseAd from './AdSenseAd';
import { useAdBlocker } from '@/hooks/useAdBlocker';

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
  const { isBlocked, isChecking } = useAdBlocker();
  const [adLoaded, setAdLoaded] = useState(false);
  
  // Ad slots for each position
  const adSlots = {
    top: ['8773228071', '1234567890', '0987654321'],
    middle: ['2268201929', '2345678901', '1098765432'], 
    bottom: ['3788333009', '3456789012', '2109876543'],
    sidebar: ['5395297838', '4567890123', '3210987654'],
    inline: ['6871374497', '5678901234', '4321098765']
  };

  // Pick random slot once per mount and keep it fixed
  const selectedSlot = useMemo(() => {
    const slots = adSlots[position] || adSlots.top;
    const randomIndex = Math.floor(Math.random() * slots.length);
    return slots[randomIndex];
  }, [position]); // Only recalculates if position changes

  // Analytics tracking
  useEffect(() => {
    if (adLoaded && !isBlocked) {
      // Send analytics event
      if (typeof (window as any).gtag !== 'undefined') {
        (window as any).gtag('event', 'ad_impression', {
          position,
          pageType,
          slot: selectedSlot,
          timestamp: Date.now()
        });
      }
      
      // Alternative analytics (if using different service)
      if (typeof (window as any).analytics !== 'undefined') {
        (window as any).analytics.track('Ad Impression', {
          position,
          pageType,
          slot: selectedSlot
        });
      }
    }
  }, [adLoaded, isBlocked, position, pageType, selectedSlot]);

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

  // Ad blocker fallback message
  if (isBlocked && !isChecking) {
    return (
      <div className={getResponsiveClasses()}>
        <div className="border border-dashed border-muted-foreground/30 rounded-lg p-4 text-center text-muted-foreground">
          <p className="text-sm">📢 Support us by disabling your ad blocker</p>
          <p className="text-xs mt-1">Ads help keep this content free</p>
        </div>
      </div>
    );
  }

  return (
    <div className={getResponsiveClasses()}>
      <AdSenseAd
        slot={selectedSlot}
        format={getAdFormat()}
        layout={getAdLayout()}
        className={getAdClasses()}
        clientId={clientId}
        onAdLoaded={setAdLoaded}
      />
    </div>
  );
};

export default AdPlacement;