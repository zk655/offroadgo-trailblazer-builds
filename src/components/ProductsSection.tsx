import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Heart, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import OptimizedImage from '@/components/OptimizedImage';
import SocialShare from '@/components/SocialShare';

// Import product images
import winchImage from '@/assets/products/winch-12000lb.jpg';
import lightbarImage from '@/assets/products/led-lightbar-50.jpg';
import roofRackImage from '@/assets/products/roof-rack-system.jpg';
import tiresImage from '@/assets/products/mud-terrain-tires.jpg';
import rockSlidersImage from '@/assets/products/rock-sliders.jpg';
import suspensionImage from '@/assets/products/suspension-lift-kit.jpg';
import bullBarImage from '@/assets/products/bull-bar-bumper.jpg';
import recoveryTracksImage from '@/assets/products/recovery-tracks.jpg';
import airCompressorImage from '@/assets/products/air-compressor.jpg';

const ProductsSection = () => {
  const products = [
    {
      id: 'a9789ecd-8210-4d72-bff5-209e9df2a328',
      slug: 'bfgoodrich-all-terrain-ta-ko2',
      name: "BFGoodrich All-Terrain T/A KO2",
      price: "$899.99",
      originalPrice: "$1,199.99",
      image: tiresImage,
      rating: 4.8,
      reviews: 234,
      category: "Tires",
      badge: "Best Seller",
      description: "Heavy-duty all-terrain tires for extreme off-road performance"
    },
    {
      id: 'c7ccf180-effa-4e3e-b243-5d014723f323',
      slug: 'rigid-led-light-bar',
      name: "Rigid LED Light Bar",
      price: "$349.99",
      originalPrice: "$449.99",
      image: lightbarImage,
      rating: 4.9,
      reviews: 189,
      category: "Lighting",
      badge: "New",
      description: "Ultra-bright LED with flood and spot combo"
    },
    {
      id: '9c4e97f7-d342-48d6-9c65-624d5700446d',
      slug: 'arb-bull-bar',
      name: "ARB Bull Bar",
      price: "$599.99",
      originalPrice: "$749.99",
      image: bullBarImage,
      rating: 4.7,
      reviews: 156,
      category: "Protection",
      badge: "Sale",
      description: "Heavy-duty bull bar with integrated mounting points"
    },
    {
      id: '1cee57e6-43f7-4b7a-aa86-d7e9280afbab',
      slug: 'bilstein-5100-shocks',
      name: "Bilstein 5100 Shocks",
      price: "$1,299.99",
      originalPrice: "$1,599.99",
      image: suspensionImage,
      rating: 4.6,
      reviews: 298,
      category: "Suspension",
      badge: "Popular",
      description: "Premium shocks for extreme off-road performance"
    },
    {
      id: '58144f95-dd6f-45db-9284-20d8dbdbfdbd',
      slug: 'teraflex-lift-kit',
      name: "Teraflex Lift Kit",
      price: "$749.99",
      originalPrice: "$899.99",
      image: suspensionImage,
      rating: 4.8,
      reviews: 124,
      category: "Suspension",
      badge: "Recommended",
      description: "Complete suspension lift kit for enhanced clearance"
    },
    {
      id: '207e1d46-88c3-4ffc-a2df-c837861e93e9',
      slug: 'rigid-industries-20-led-light-bar',
      name: "Rigid Industries 20\" LED Light Bar",
      price: "$2,199.99",
      originalPrice: "$2,599.99",
      image: lightbarImage,
      rating: 4.9,
      reviews: 87,
      category: "Lighting",
      badge: "Premium",
      description: "Professional-grade LED light bar with long-range visibility"
    },
    {
      id: 'b748a731-1965-4667-a74b-c1ede3b24fcd',
      slug: 'kc-hilites-flex-led-rock-light-kit',
      name: "KC HiLiTES Flex LED Rock Light Kit",
      price: "$1,599.99",
      originalPrice: "$1,899.99",
      image: lightbarImage,
      rating: 4.7,
      reviews: 156,
      category: "Lighting",
      badge: "Heavy Duty",
      description: "Flexible LED rock light kit for undercarriage illumination"
    },
    {
      id: '842635e6-2919-4c32-8774-65a865fa5f3c',
      slug: 'baja-designs-squadron-sport-led',
      name: "Baja Designs Squadron Sport LED",
      price: "$299.99",
      originalPrice: "$399.99",
      image: lightbarImage,
      rating: 4.6,
      reviews: 203,
      category: "Lighting",
      badge: "Essential",
      description: "Compact LED lights for auxiliary lighting"
    },
    {
      id: '6249ec13-948b-41b8-94f6-de1faaad1a32',
      slug: 'arb-front-bumper-deluxe',
      name: "ARB Front Bumper Deluxe",
      price: "$199.99",
      originalPrice: "$249.99",
      image: bullBarImage,
      rating: 4.8,
      reviews: 342,
      category: "Protection",
      badge: "Portable",
      description: "Heavy-duty front bumper with winch mount"
    },
    {
      id: '4840a073-dd78-4bfe-af0d-edcfa91f0940',
      slug: 'skid-row-engine-skid-plate',
      name: "Skid Row Engine Skid Plate",
      price: "$159.99",
      originalPrice: "$199.99",
      image: bullBarImage,
      rating: 4.5,
      reviews: 167,
      category: "Protection",
      badge: "Durable",
      description: "Heavy-duty aluminum skid plate for engine protection"
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < Math.floor(rating) 
            ? 'fill-yellow-400 text-yellow-400' 
            : 'text-muted-foreground'
        }`}
      />
    ));
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
      {/* Clean Content Container */}
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-3 text-primary border-primary/20 bg-primary/5 text-xs font-medium">
            Premium Products
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            4x4 Gear & <span className="text-primary">Accessories</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Premium off-road equipment designed to enhance your adventures
          </p>
        </div>

        {/* Top 4 Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product) => (
            <Link key={product.id} to={`/product/${product.slug}`}>
              <Card className="group bg-background border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer">
                {/* Product Image - Optimized */}
                <div className="relative overflow-hidden aspect-square bg-muted/10 p-4">
                  <OptimizedImage
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                    fallbackSrc="/placeholder.svg"
                    loading="lazy"
                  />
                  
                  {/* Badge */}
                  <Badge 
                    variant="secondary" 
                    className="absolute top-2 left-2 bg-primary text-primary-foreground border-0 text-xs font-medium"
                  >
                    {product.badge}
                  </Badge>

                  {/* Action Buttons */}
                  <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      className="h-7 w-7 p-0 bg-background/80 backdrop-blur-sm"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Handle add to favorites
                      }}
                    >
                      <Heart className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      className="h-7 w-7 p-0 bg-background/80 backdrop-blur-sm"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // Handle quick view
                      }}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Category */}
                  <div className="absolute bottom-2 left-2">
                    <Badge variant="outline" className="bg-background/80 backdrop-blur-sm border-border text-xs">
                      {product.category}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-3">
                  {/* Product Info - More Compact */}
                  <div className="mb-2">
                    <h3 className="text-base font-semibold leading-tight group-hover:text-primary transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {product.description}
                    </p>
                  </div>

                  {/* Rating - More Compact */}
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="flex items-center gap-0.5">
                      {renderStars(product.rating)}
                    </div>
                    <span className="text-xs font-medium">{product.rating}</span>
                    <span className="text-xs text-muted-foreground">({product.reviews})</span>
                  </div>

                  {/* Price - More Compact */}
                  <div className="flex items-center gap-1.5 mb-3">
                    <span className="text-lg font-bold text-primary">{product.price}</span>
                    <span className="text-xs text-muted-foreground line-through">{product.originalPrice}</span>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <Button 
                      size="sm" 
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-7 text-xs"
                    >
                      <Eye className="h-3 w-3 mr-1.5" />
                      View Details
                    </Button>
                    
                    {/* Social Share */}
                    <div className="flex justify-center">
                      <SocialShare
                        title={product.name}
                        excerpt={product.description}
                        url={`/product/${product.slug}`}
                        image={product.image}
                        variant="icon"
                        size="sm"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* View All Products Button */}
        <div className="text-center mt-12">
          <Link to="/products">
            <Button 
              size="sm" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium px-6 py-2"
            >
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;