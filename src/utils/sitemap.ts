// Enhanced sitemap generation utilities

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export const generateSitemapXML = (urls: SitemapUrl[]): string => {
  const urlElements = urls.map(url => `
    <url>
      <loc>${url.loc}</loc>
      ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
      ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
      ${url.priority ? `<priority>${url.priority}</priority>` : ''}
    </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urlElements}
</urlset>`;
};

export const getStaticPages = (): SitemapUrl[] => {
  const baseUrl = 'https://offroadgo.com';
  const now = new Date().toISOString();
  
  return [
    {
      loc: `${baseUrl}/`,
      lastmod: now,
      changefreq: 'daily',
      priority: 1.0
    },
    {
      loc: `${baseUrl}/vehicles`,
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.9
    },
    {
      loc: `${baseUrl}/parts`,
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.9
    },
    {
      loc: `${baseUrl}/trails`,
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.8
    },
    {
      loc: `${baseUrl}/blog`,
      lastmod: now,
      changefreq: 'daily',
      priority: 0.8
    },
    {
      loc: `${baseUrl}/videos`,
      lastmod: now,
      changefreq: 'daily',
      priority: 0.7
    },
    {
      loc: `${baseUrl}/clubs-events`,
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.7
    },
    {
      loc: `${baseUrl}/insurance`,
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.6
    },
    {
      loc: `${baseUrl}/compare`,
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.6
    },
    {
      loc: `${baseUrl}/build`,
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.6
    },
    {
      loc: `${baseUrl}/about-us`,
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.5
    },
    {
      loc: `${baseUrl}/privacy-policy`,
      lastmod: now,
      changefreq: 'yearly',
      priority: 0.3
    },
    {
      loc: `${baseUrl}/terms-conditions`,
      lastmod: now,
      changefreq: 'yearly',
      priority: 0.3
    }
  ];
};

export const generateRobotsTxt = (): string => {
  return `User-agent: *
Allow: /

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

# Disallow admin pages
Disallow: /admin/
Disallow: /auth/

# Allow crawling of public uploads
Allow: /lovable-uploads/

Sitemap: https://offroadgo.com/sitemap.xml

# Crawl delay
Crawl-delay: 1`;
};

export const generateOpenSearchXML = (): string => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/">
  <ShortName>OffRoadGo</ShortName>
  <Description>Search OffRoadGo for 4x4 vehicles, parts, and off-road content</Description>
  <Tags>4x4 off-road vehicles parts trails</Tags>
  <Contact>search@offroadgo.com</Contact>
  <Url type="text/html" template="https://offroadgo.com/search?q={searchTerms}"/>
  <Url type="application/x-suggestions+json" template="https://offroadgo.com/api/suggestions?q={searchTerms}"/>
  <Image height="16" width="16" type="image/png">https://offroadgo.com/favicon-16x16.png</Image>
  <Image height="64" width="64" type="image/png">https://offroadgo.com/favicon-64x64.png</Image>
  <Developer>OffRoadGo Team</Developer>
  <Attribution>© 2024 OffRoadGo. All rights reserved.</Attribution>
  <SyndicationRight>open</SyndicationRight>
  <AdultContent>false</AdultContent>
  <Language>en-us</Language>
  <OutputEncoding>UTF-8</OutputEncoding>
  <InputEncoding>UTF-8</InputEncoding>
</OpenSearchDescription>`;
};