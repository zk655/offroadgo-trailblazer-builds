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
  format = 'auto',
  responsive = true,
  layout = 'in-article'
}: AdSenseAdProps) => {
  const [adLoaded, setAdLoaded] = useState(false);
  const [showContainer, setShowContainer] = useState(true);
  const adRef = useRef<HTMLModElement>(null);
  const [adInitialized, setAdInitialized] = useState(false);

  useEffect(() => {
    if (adInitialized) return;

    // Ensure AdSense script is loaded
    const checkAdSenseScript = () => {
      if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6402737863827515';
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
      }
    };

    checkAdSenseScript();

    const timer = setTimeout(() => {
      try {
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
              
              // Always show container, even if ad doesn't load
              setShowContainer(true);
            }
          }, 3000);
        }
        
      } catch (err) {
        console.log('AdSense error:', err);
        setShowContainer(true); // Still show container on error
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [slot, adInitialized]);

  // Always show container to prevent layout shift
  if (!showContainer) {
    return null;
  }

  return (
    <div className={`adsense-container w-full max-w-screen-xl mx-auto ${className}`} style={{ 
      minHeight: adLoaded ? 'auto' : '90px',
      maxHeight: 'none',
      padding: '8px',
      backgroundColor: 'transparent',
      margin: '12px auto',
      overflow: 'hidden',
      transition: 'all 0.3s ease'
    }}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          display: 'block',
          width: '100%',
          minHeight: '90px',
          height: 'auto',
          backgroundColor: 'transparent',
          opacity: adLoaded ? 1 : 0.8,
          transition: 'opacity 0.3s ease',
          margin: '0 auto'
        }}
        data-ad-client="ca-pub-6402737863827515"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
        data-ad-layout={layout}
      />
    </div>
  );
};

export default AdSenseAd;