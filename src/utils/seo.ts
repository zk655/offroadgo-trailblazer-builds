// SEO optimization utilities

export const generateMetaDescription = (content: string, maxLength: number = 160): string => {
  if (content.length <= maxLength) return content;
  
  const truncated = content.substring(0, maxLength - 3);
  const lastSpace = truncated.lastIndexOf(' ');
  return (lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated) + '...';
};

export const generateKeywords = (base: string[], additional: string[] = []): string => {
  return [...base, ...additional].join(', ');
};

export const getCanonicalUrl = (path: string): string => {
  const baseUrl = 'https://offroadgo.com';
  return `${baseUrl}${path}`;
};

export const generateStructuredData = (type: string, data: any) => {
  const baseData = {
    "@context": "https://schema.org",
    "@type": type,
    ...data
  };
  
  return JSON.stringify(baseData);
};

// Common SEO configurations
export const seoConfig = {
  defaultTitle: "OffRoadGo - Premium 4x4 Vehicles & Off-Road Adventures",
  defaultDescription: "Discover the best 4x4 vehicles, off-road gear, and trail guides. Expert reviews, premium accessories, and everything you need for your off-road adventures.",
  defaultKeywords: ["4x4", "off-road", "vehicles", "parts", "trails", "adventure", "outdoor", "offroad gear"],
  siteUrl: "https://offroadgo.com",
  siteName: "OffRoadGo",
  twitterHandle: "@offroadgo",
  facebookPage: "https://facebook.com/offroadgo"
};

export const generatePageTitle = (pageTitle: string): string => {
  return pageTitle.includes(seoConfig.siteName) 
    ? pageTitle 
    : `${pageTitle} | ${seoConfig.siteName}`;
};