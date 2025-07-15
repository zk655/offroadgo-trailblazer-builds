import { useEffect } from 'react';

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
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <div className={`adsense-container w-full max-w-none ${className}`}>
      <div className="w-full max-w-4xl mx-auto px-4">
        <ins
          className="adsbygoogle block w-full"
          style={{
            display: 'block',
            width: '100%',
            height: 'auto',
            minHeight: '90px',
            maxHeight: '280px',
          }}
          data-ad-layout={layout}
          data-ad-format="auto"
          data-ad-client="ca-pub-6402737863827515"
          data-ad-slot={slot}
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
};

export default AdSenseAd;