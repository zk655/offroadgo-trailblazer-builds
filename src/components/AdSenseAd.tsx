import { useEffect, useState, useRef } from 'react';

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
  const [showContainer, setShowContainer] = useState(false);
  const adRef = useRef<HTMLModElement>(null);
  const [adInitialized, setAdInitialized] = useState(false);

  useEffect(() => {
    if (adInitialized) return;

    const timer = setTimeout(() => {
      try {
        // Check if the ad element exists and hasn't been processed yet
        const adElement = adRef.current;
        if (adElement && !adElement.hasAttribute('data-adsbygoogle-status')) {
          // @ts-ignore
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          setAdInitialized(true);
          
          // Check if ad loaded after a delay
          setTimeout(() => {
            if (adElement) {
              const hasContent = adElement.innerHTML.trim().length > 0;
              const hasChildren = adElement.children.length > 0;
              const hasHeight = adElement.offsetHeight > 10;
              
              const isAdLoaded = hasContent && (hasChildren || hasHeight);
              setAdLoaded(isAdLoaded);
              setShowContainer(isAdLoaded);
            }
          }, 2000);
        }
        
      } catch (err) {
        console.log('AdSense error:', err);
        setShowContainer(false);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [slot, adInitialized]);

  // Don't render anything if no ad is loaded
  if (!showContainer && !adLoaded) {
    return null;
  }

  return (
    <div className={`adsense-container w-full ${className}`} style={{ 
      minHeight: adLoaded ? 'auto' : '0',
      maxHeight: 'none',
      padding: adLoaded ? '8px' : '0',
      backgroundColor: 'transparent',
      margin: adLoaded ? '12px 0' : '0',
      overflow: 'hidden',
      transition: 'all 0.3s ease'
    }}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          display: 'block',
          width: '100%',
          minHeight: '0',
          height: 'auto',
          backgroundColor: 'transparent',
          opacity: adLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease'
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