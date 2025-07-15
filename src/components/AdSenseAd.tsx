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

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        
        // Check if ad loaded after a longer delay
        setTimeout(() => {
          const adElement = document.querySelector(`[data-ad-slot="${slot}"]`);
          if (adElement) {
            const hasContent = adElement.innerHTML.trim().length > 0;
            setAdLoaded(hasContent);
          }
        }, 3000);
        
      } catch (err) {
        console.log('AdSense error:', err);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [slot]);

  return (
    <div className={`adsense-container w-full ${className}`} style={{ 
      minHeight: '280px',
      padding: '16px',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '8px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      margin: '16px 0'
    }}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          width: '100%',
          minHeight: '250px',
          height: 'auto',
          backgroundColor: 'transparent',
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