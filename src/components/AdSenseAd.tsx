import { useEffect, useState, useRef, useCallback } from 'react';

interface AdSenseAdProps {
  slot: string;
  style?: React.CSSProperties;
  className?: string;
  format?: string;
  responsive?: boolean;
  layout?: string | null;
  clientId?: string;
}

const AdSenseAd = ({
  slot,
  style = { display: 'block', textAlign: 'center' },
  className = '',
  format = 'auto',
  responsive = true,
  layout = 'in-article',
  clientId = 'ca-pub-6402737863827515'
}: AdSenseAdProps) => {
  const [adLoaded, setAdLoaded] = useState(false);
  const [showContainer, setShowContainer] = useState(true);
  const [adInitialized, setAdInitialized] = useState(false);
  const adRef = useRef<HTMLElement | null>(null);

  const isProduction = import.meta.env.PROD;

  const checkAdSenseScript = useCallback(() => {
    if (!document.querySelector(`script[src*="adsbygoogle.js"]`)) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
      script.crossOrigin = 'anonymous';
      script.onerror = () => {
        console.warn('AdSense script failed to load.');
        setShowContainer(true);
      };
      document.head.appendChild(script);
    }
  }, [clientId]);

  useEffect(() => {
    if (adInitialized || !slot) return;

    if (!isProduction) {
      setShowContainer(true);
      setAdLoaded(false);
      return;
    }

    checkAdSenseScript();

    const timer = setTimeout(() => {
      try {
        const adElement = adRef.current;
        if (adElement && !adElement.hasAttribute('data-adsbygoogle-status')) {
          // @ts-ignore
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          setAdInitialized(true);

          setTimeout(() => {
            if (adElement) {
              const isLoaded = (
                adElement.innerHTML.trim().length > 0 &&
                (adElement.children.length > 0 || adElement.offsetHeight > 10)
              );
              setAdLoaded(isLoaded);
              setShowContainer(true);
            }
          }, 2500);
        }
      } catch (err) {
        console.error('AdSense init error:', err);
        setShowContainer(true);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [slot, adInitialized, checkAdSenseScript, isProduction]);

  if (!showContainer) return null;

  if (!isProduction) {
    return (
      <div className={`adsense-placeholder w-full max-w-screen-xl mx-auto ${className}`} style={{
        minHeight: '90px',
        padding: '8px',
        margin: '12px auto',
        backgroundColor: 'hsl(var(--muted))',
        border: '1px dashed hsl(var(--border))',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <span className="text-sm text-muted-foreground">Ad Placeholder (Only in Production)</span>
      </div>
    );
  }

  return (
    <div className={`adsense-container w-full max-w-screen-xl mx-auto ${className}`} style={{
      minHeight: adLoaded ? 'auto' : '90px',
      padding: '8px',
      margin: '12px auto',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      backgroundColor: 'transparent'
    }}>
      <ins
        ref={adRef as any}
        className="adsbygoogle"
        style={{
          ...style,
          width: '100%',
          opacity: adLoaded ? 1 : 0.8,
          transition: 'opacity 0.3s ease',
          margin: '0 auto'
        }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
        {...(layout && { 'data-ad-layout': layout })}
      />
    </div>
  );
};

export default AdSenseAd;
