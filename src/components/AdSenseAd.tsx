import { useEffect, useState, useRef } from 'react';

interface AdSenseAdProps {
  slot: string;
  style?: React.CSSProperties;
  className?: string;
  format?: string;
  responsive?: boolean;
  layout?: string | null;
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
  const adRef = useRef<HTMLElement | null>(null);
  const [adInitialized, setAdInitialized] = useState(false);

  useEffect(() => {
    if (adInitialized) return;

    // Only load ads if we're in production environment
    const isProduction = window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1');
    
    if (!isProduction) {
      // Show placeholder in development
      setShowContainer(true);
      setAdLoaded(false);
      return;
    }

    // Ensure AdSense script is loaded
    const checkAdSenseScript = () => {
      if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6402737863827515';
        script.crossOrigin = 'anonymous';
        
        // Add error handling for script loading
        script.onerror = () => {
          console.log('AdSense script failed to load');
          setShowContainer(true);
        };
        
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
        console.log('AdSense initialization error:', err);
        setShowContainer(true); // Still show container on error
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [slot, adInitialized]);

  // Show development placeholder or production ad container
  if (!showContainer) {
    return null;
  }

  // Development placeholder
  const isProduction = window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1');
  
  if (!isProduction) {
    return (
      <div className={`adsense-container w-full max-w-screen-xl mx-auto ${className}`} style={{ 
        minHeight: '90px',
        padding: '8px',
        backgroundColor: 'hsl(var(--muted))',
        margin: '12px auto',
        overflow: 'hidden',
        borderRadius: '8px',
        border: '1px dashed hsl(var(--border))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <span className="text-sm text-muted-foreground">Ad Placeholder (Production Only)</span>
      </div>
    );
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
        ref={adRef as any}
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
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
        {...(layout && { 'data-ad-layout': layout })}
      />
    </div>
  );
};

export default AdSenseAd;