import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowRight, Home, Car, Package, MapPin, FileText, Info } from 'lucide-react';

const Sitemap = () => {
  const siteMap = [
    {
      category: "Main Pages",
      icon: <Home className="h-5 w-5" />,
      links: [
        { title: "Home", url: "/", description: "Discover the best off-road vehicles and gear" },
        { title: "Vehicles", url: "/vehicles", description: "Browse 4x4 vehicles and detailed reviews" },
        { title: "Products", url: "/products", description: "Shop premium off-road gear and accessories" },
        { title: "Trails", url: "/trails", description: "Find and explore off-road trails worldwide" },
        { title: "Blog", url: "/blog", description: "Latest off-road news and adventure stories" }
      ]
    },
    {
      category: "Vehicle Pages",
      icon: <Car className="h-5 w-5" />,
      links: [
        { title: "Vehicle Reviews", url: "/vehicles", description: "In-depth vehicle reviews and specs" }
      ]
    },
    {
      category: "Product Categories",
      icon: <Package className="h-5 w-5" />,
      links: [
        { title: "Recovery Gear", url: "/products?category=recovery", description: "Winches, straps, and recovery equipment" },
        { title: "Lighting", url: "/products?category=lighting", description: "LED bars, spotlights, and accessories" },
        { title: "Suspension", url: "/products?category=suspension", description: "Lift kits, shocks, and suspension upgrades" },
        { title: "Tires & Wheels", url: "/products?category=tires", description: "Off-road tires and wheel packages" },
        { title: "Protection", url: "/products?category=protection", description: "Armor, skid plates, and guards" },
        { title: "Storage", url: "/products?category=storage", description: "Roof racks, cargo solutions, and organizers" }
      ]
    },
    {
      category: "Trail Information",
      icon: <MapPin className="h-5 w-5" />,
      links: [
        { title: "Trail Guides", url: "/trails", description: "Detailed trail maps and difficulty ratings" }
      ]
    },
    {
      category: "Company Information",
      icon: <Info className="h-5 w-5" />,
      links: [
        { title: "About Us", url: "/about", description: "Learn about our team and mission" },
        { title: "Privacy Policy", url: "/privacy", description: "How we protect your privacy and data" },
        { title: "Terms & Conditions", url: "/terms", description: "Legal terms for using our services" }
      ]
    },
    {
      category: "Resources",
      icon: <FileText className="h-5 w-5" />,
      links: [
        { title: "Blog & News", url: "/blog", description: "Latest off-road news and articles" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Sitemap - OffRoadGo"
        description="Navigate through all OffRoadGo content including vehicles, products, trails, guides, and resources for off-road enthusiasts."
        keywords="sitemap, site navigation, content overview, OffRoadGo pages, website structure"
        url="/sitemap"
        type="website"
        noindex={true}
      />
      
      <Navigation />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto text-center">
            <Badge variant="outline" className="mb-4 text-primary border-primary/20 bg-primary/5">
              Site Navigation
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Site <span className="text-primary">Map</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Find all pages and resources on OffRoadGo. Everything you need for your off-road adventures.
            </p>
          </div>
        </section>

        {/* Sitemap Content */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-8">
              {siteMap.map((section, index) => (
                <Card key={index} className="bg-background border border-border h-fit">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-xl font-semibold text-foreground">
                      <div className="bg-primary/10 p-2 rounded-lg">
                        {section.icon}
                      </div>
                      {section.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {section.links.map((link, linkIndex) => (
                        <Link
                          key={linkIndex}
                          to={link.url}
                          className="block group"
                        >
                          <div className="flex items-start justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="flex-1">
                              <h4 className="font-medium text-foreground group-hover:text-primary transition-colors mb-1">
                                {link.title}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {link.description}
                              </p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors mt-1 ml-2 flex-shrink-0" />
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Stats */}
            <Card className="mt-12 bg-primary/5 border border-primary/20">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    Comprehensive Off-Road Resources
                  </h3>
                  <p className="text-muted-foreground">
                    Everything you need to enhance your off-road adventures
                  </p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">500+</div>
                    <div className="text-sm text-muted-foreground">Vehicle Reviews</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">1000+</div>
                    <div className="text-sm text-muted-foreground">Products</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">200+</div>
                    <div className="text-sm text-muted-foreground">Trail Guides</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">100+</div>
                    <div className="text-sm text-muted-foreground">How-To Guides</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Sitemap;