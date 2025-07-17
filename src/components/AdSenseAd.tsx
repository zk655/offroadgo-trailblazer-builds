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

    const isProduction = window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1');
    if (!isProduction) {
      setShowContainer(true);
      setAdLoaded(false);
      return;
    }

    const ensureScript = () => {
      if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6402737863827515';
        script.crossOrigin = 'anonymous';
        script.onerror = () => setShowContainer(true);
        document.head.appendChild(script);
      }
    };

    ensureScript();

    const timer = setTimeout(() => {
      try {
        const adElement = adRef.current;
        if (adElement && !adElement.hasAttribute('data-adsbygoogle-status')) {
          // @ts-ignore
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          setAdInitialized(true);

          setTimeout(() => {
            if (adElement) {
              const hasContent = adElement.innerHTML.trim().length > 0;
              const hasChildren = adElement.children.length > 0;
              const hasHeight = adElement.offsetHeight > 10;
              const isAdLoaded = hasContent && (hasChildren || hasHeight);
              setAdLoaded(isAdLoaded);
              setShowContainer(true);
            }
          }, 3000);
        }
      } catch (err) {
        setShowContainer(true);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [slot, adInitialized]);

  if (!showContainer) return null;

  const isProduction = window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1');
  if (!isProduction) {
    return (
      <div className={`adsense-placeholder ${className}`} style={{
        minHeight: '90px',
        padding: '8px',
        backgroundColor: 'hsl(var(--muted))',
        margin: '12px auto',
        borderRadius: '8px',
        border: '1px dashed hsl(var(--border))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <span className="text-sm text-muted-foreground">Ad Placeholder (Development Only)</span>
      </div>
    );
  }

  return (
    <div className={`adsense-container w-full ${className}`} style={{
      minHeight: adLoaded ? 'auto' : '90px',
      padding: '8px',
      margin: '12px auto',
      transition: 'all 0.3s ease'
    }}>
      <ins
        ref={adRef as any}
        className="adsbygoogle"
        style={{
          display: 'block',
          width: '100%',
          minHeight: '90px',
          opacity: adLoaded ? 1 : 0.8,
          transition: 'opacity 0.3s ease'
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
