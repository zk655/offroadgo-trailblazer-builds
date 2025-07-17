// components/AdSenseAd.tsx
import { useEffect, useRef, useState } from 'react';

interface AdSenseAdProps {
  slotDesktop: string;
  slotMobile?: string;
  format?: string;
  layout?: string | null;
  className?: string;
  sticky?: boolean;
}

const AdSenseAd = ({
  slotDesktop,
  slotMobile,
  format = 'auto',
  layout = null,
  className = '',
  sticky = false,
}: AdSenseAdProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const adRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const slot = isMobile && slotMobile ? slotMobile : slotDesktop;

  useEffect(() => {
    if (!wrapperRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.5 }
    );

    observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || !adRef.current) return;

    const isProduction = typeof window !== 'undefined' && window.location.hostname !== 'localhost';

    if (isProduction && !adRef.current.getAttribute('data-adsbygoogle-status')) {
      const existingScript = document.querySelector('script[src*="adsbygoogle.js"]');
      if (!existingScript) {
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6402737863827515';
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
      }

      setTimeout(() => {
        try {
          // @ts-ignore
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
          console.warn('AdSense error:', e);
        }
      }, 500);
    }

    // Check if ad actually loads
    setTimeout(() => {
      if (adRef.current) {
        const hasContent = adRef.current.innerHTML.trim().length > 0;
        const hasHeight = adRef.current.offsetHeight > 50;
        setAdLoaded(hasContent && hasHeight);
      }
    }, 2500);
  }, [isVisible]);

  return (
    <div
      ref={wrapperRef}
      className={`adsense-wrapper ${className} ${sticky ? 'sticky top-20' : ''}`}
      style={{
        minHeight: '90px',
        display: isVisible ? 'block' : 'none',
        padding: '8px',
      }}
    >
      <ins
        ref={adRef as any}
        className="adsbygoogle"
        style={{
          display: 'block',
          width: '100%',
          minHeight: '90px',
          margin: '0 auto',
          opacity: adLoaded ? 1 : 0.8,
          transition: 'opacity 0.3s ease-in-out',
        }}
        data-ad-client="ca-pub-6402737863827515"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
        {...(layout ? { 'data-ad-layout': layout } : {})}
      />
    </div>
  );
};

export default AdSenseAd;
