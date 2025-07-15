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
    <div className={`adsense-container w-full max-w-full overflow-hidden ${className}`}>
      <ins
        className="adsbygoogle w-full block"
        style={{
          ...style,
          minHeight: 'auto',
          maxWidth: '100%',
        }}
        data-ad-layout={layout}
        data-ad-format={format}
        data-ad-client="ca-pub-6402737863827515"
        data-ad-slot={slot}
        data-full-width-responsive={responsive.toString()}
      />
    </div>
  );
};

export default AdSenseAd;