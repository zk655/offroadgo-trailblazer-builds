import { useEffect, useState } from 'react';

interface AdSenseAdProps {
  slot: string;
  style?: React.CSSProperties;
  className?: string;
  format?: string;
  responsive?: boolean;
  layout?: string;
}

const AdSenseAd = ({ 
  slot, 
  style = { display: 'block', textAlign: 'center' }, 
  className = '',
  format = 'fluid',
  responsive = true,
  layout = 'in-article'
}: AdSenseAdProps) => {
  const [adLoaded, setAdLoaded] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        
        // Check if ad loaded after a delay
        setTimeout(() => {
          const adElement = document.querySelector(`[data-ad-slot="${slot}"]`);
          if (adElement) {
            const hasContent = adElement.innerHTML.trim().length > 0;
            setAdLoaded(hasContent);
            if (hasContent) {
              setShowPlaceholder(false);
            }
          }
        }, 2000);
        
      } catch (err) {
        setShowPlaceholder(false); // Hide on error
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [slot]);

  // Hide completely if no ad content after timeout
  useEffect(() => {
    const hideTimer = setTimeout(() => {
      if (!adLoaded) {
        setShowPlaceholder(false);
      }
    }, 5000);

    return () => clearTimeout(hideTimer);
  }, [adLoaded]);

  if (!showPlaceholder) {
    return null; // Don't render anything if ad failed to load
  }

  return (
    <div className={`adsense-container w-full ${className}`} style={{ minHeight: '0' }}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          width: '100%',
          minHeight: '0',
          height: 'auto',
        }}
        data-ad-client="ca-pub-6402737863827515"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdSenseAd;