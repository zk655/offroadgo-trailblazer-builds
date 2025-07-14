import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEO = ({
  title,
  description,
  keywords = '4x4, off-road, vehicles, parts, trails, adventure, outdoor',
  image = '/og-image.jpg',
  url = '',
  type = 'website'
}: SEOProps) => {
  const siteName = 'OffRoadGo';
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
  const canonicalUrl = `https://offroadgo.com${url}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="OffRoadGo Team" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Language" content="en" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "OffRoadGo",
          "url": "https://offroadgo.com",
          "logo": "https://offroadgo.com/logo.png",
          "description": "Premium 4x4 vehicles, parts, and off-road adventures",
          "sameAs": [
            "https://facebook.com/offroadgo",
            "https://instagram.com/offroadgo",
            "https://twitter.com/offroadgo"
          ]
        })}
      </script>
    </Helmet>
  );
};

export default SEO;