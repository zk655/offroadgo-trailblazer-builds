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
      console.log('AdSense: Attempting to load ad for slot:', slot);
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      console.log('AdSense: Ad push successful for slot:', slot);
    } catch (err) {
      console.error('AdSense error for slot', slot, ':', err);
    }
  }, [slot]);

  return (
    <div className={`adsense-container w-full ${className}`}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          width: '100%',
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