import { Helmet } from 'react-helmet-async';
import { generateMetaDescription, generatePageTitle, getCanonicalUrl } from '@/utils/seo';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  article?: {
    author?: string;
    publishedTime?: string;
    modifiedTime?: string;
    section?: string;
    tags?: string[];
  };
  noindex?: boolean;
  preloadFonts?: string[];
  criticalCSS?: string;
}

const SEOHead = ({
  title,
  description,
  keywords = '4x4, off-road, vehicles, parts, trails, adventure, outdoor',
  image = 'https://offroadgo.com/og-image.jpg',
  url = '',
  type = 'website',
  article,
  noindex = false,
  preloadFonts = [],
  criticalCSS
}: SEOHeadProps) => {
  const siteName = 'OffRoadGo';
  const fullTitle = generatePageTitle(title);
  const canonicalUrl = getCanonicalUrl(url);
  const optimizedDescription = generateMetaDescription(description);

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={optimizedDescription} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Robots */}
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={optimizedDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      
      {/* Article specific tags */}
      {article && (
        <>
          <meta property="article:author" content={article.author} />
          <meta property="article:published_time" content={article.publishedTime} />
          <meta property="article:modified_time" content={article.modifiedTime} />
          <meta property="article:section" content={article.section} />
          {article.tags?.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@offroadgo" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={optimizedDescription} />
      <meta name="twitter:image" content={image} />

      {/* Additional SEO Meta Tags */}
      <meta name="author" content="OffRoadGo Team" />
      <meta httpEquiv="Content-Language" content="en" />
      <meta name="theme-color" content="#1a1a1a" />
      
      {/* Mobile optimization */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      
      {/* Performance hints */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://images.unsplash.com" />
      <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
      
      {/* Font preloading */}
      {preloadFonts.map(font => (
        <link key={font} rel="preload" href={font} as="font" type="font/woff2" crossOrigin="anonymous" />
      ))}
      
      {/* Critical CSS */}
      {criticalCSS && (
        <style type="text/css">{criticalCSS}</style>
      )}
    </Helmet>
  );
};

export default SEOHead;