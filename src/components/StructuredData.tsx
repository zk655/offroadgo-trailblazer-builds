import { Helmet } from 'react-helmet-async';

interface StructuredDataProps {
  type: 'Article' | 'Product' | 'Organization' | 'WebSite' | 'BreadcrumbList' | 'FAQ' | 'VideoObject';
  data: any;
}

const StructuredData = ({ type, data }: StructuredDataProps) => {
  const generateStructuredData = () => {
    const baseData = {
      "@context": "https://schema.org",
      "@type": type,
      ...data
    };

    // Add specific enhancements based on type
    switch (type) {
      case 'Article':
        return {
          ...baseData,
          "@type": "Article",
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": data.url || "https://offroadgo.com"
          },
          headline: data.headline,
          description: data.description,
          image: data.image,
          author: {
            "@type": "Person",
            name: data.author || "OffRoadGo Team"
          },
          publisher: {
            "@type": "Organization",
            name: "OffRoadGo",
            logo: {
              "@type": "ImageObject",
              url: "https://offroadgo.com/logo.png"
            }
          },
          datePublished: data.datePublished,
          dateModified: data.dateModified || data.datePublished,
          articleSection: data.category || "Off-Road",
          keywords: data.keywords
        };

      case 'Product':
        return {
          ...baseData,
          "@type": "Product",
          name: data.name,
          description: data.description,
          image: data.image,
          brand: {
            "@type": "Brand",
            name: data.brand
          },
          offers: {
            "@type": "Offer",
            price: data.price,
            priceCurrency: "USD",
            availability: "https://schema.org/InStock",
            seller: {
              "@type": "Organization",
              name: "OffRoadGo"
            }
          },
          aggregateRating: data.rating ? {
            "@type": "AggregateRating",
            ratingValue: data.rating.value,
            reviewCount: data.rating.count
          } : undefined
        };

      case 'VideoObject':
        return {
          ...baseData,
          "@type": "VideoObject",
          name: data.name,
          description: data.description,
          thumbnailUrl: data.thumbnailUrl,
          uploadDate: data.uploadDate,
          duration: data.duration,
          contentUrl: data.contentUrl,
          embedUrl: data.embedUrl,
          publisher: {
            "@type": "Organization",
            name: "OffRoadGo",
            logo: {
              "@type": "ImageObject",
              url: "https://offroadgo.com/logo.png"
            }
          }
        };

      case 'BreadcrumbList':
        return {
          ...baseData,
          "@type": "BreadcrumbList",
          itemListElement: data.items.map((item: any, index: number) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url
          }))
        };

      case 'FAQ':
        return {
          ...baseData,
          "@type": "FAQPage",
          mainEntity: data.questions.map((q: any) => ({
            "@type": "Question",
            name: q.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: q.answer
            }
          }))
        };

      default:
        return baseData;
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(generateStructuredData(), null, 2)}
      </script>
    </Helmet>
  );
};

export default StructuredData;