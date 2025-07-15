import { useEffect } from 'react';

interface AdSenseAdProps {
  slot: string;
  style?: React.CSSProperties;
  className?: string;
  format?: string;
  responsive?: boolean;
}

const AdSenseAd = ({ 
  slot, 
  style = { display: 'block' }, 
  className = '',
  format = 'auto',
  responsive = true 
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
    <div className={`adsense-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client="ca-pub-XXXXXXXXXX" // Replace with your AdSense Publisher ID
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive.toString()}
      />
    </div>
  );
};

export default AdSenseAd;