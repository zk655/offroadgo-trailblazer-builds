import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

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
      id: 1,
      name: "Pro Series Winch 12000lb",
      price: "$899.99",
      originalPrice: "$1,199.99",
      image: winchImage,
      rating: 4.8,
      reviews: 234,
      category: "Recovery",
      badge: "Best Seller",
      description: "Heavy-duty electric winch with synthetic rope"
    },
    {
      id: 2,
      name: "All-Terrain LED Light Bar 50\"",
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
      id: 3,
      name: "Heavy Duty Roof Rack System",
      price: "$599.99",
      originalPrice: "$749.99",
      image: roofRackImage,
      rating: 4.7,
      reviews: 156,
      category: "Storage",
      badge: "Sale",
      description: "Modular rack with integrated mounting points"
    },
    {
      id: 4,
      name: "Mud Terrain Tires Set (4)",
      price: "$1,299.99",
      originalPrice: "$1,599.99",
      image: tiresImage,
      rating: 4.6,
      reviews: 298,
      category: "Tires",
      badge: "Popular",
      description: "Premium tires for extreme off-road performance"
    },
    {
      id: 5,
      name: "Rock Sliders Protection Kit",
      price: "$749.99",
      originalPrice: "$899.99",
      image: rockSlidersImage,
      rating: 4.8,
      reviews: 124,
      category: "Protection",
      badge: "Recommended",
      description: "Heavy-duty sliders with integrated step plates"
    },
    {
      id: 6,
      name: "Suspension Lift Kit 6\"",
      price: "$2,199.99",
      originalPrice: "$2,599.99",
      image: suspensionImage,
      rating: 4.9,
      reviews: 87,
      category: "Suspension",
      badge: "Premium",
      description: "Complete kit with adjustable coilovers"
    },
    {
      id: 7,
      name: "Heavy Duty Bull Bar",
      price: "$1,599.99",
      originalPrice: "$1,899.99",
      image: bullBarImage,
      rating: 4.7,
      reviews: 156,
      category: "Protection",
      badge: "Heavy Duty",
      description: "Steel bull bar with LED light mounts"
    },
    {
      id: 8,
      name: "Recovery Tracks Set",
      price: "$299.99",
      originalPrice: "$399.99",
      image: recoveryTracksImage,
      rating: 4.6,
      reviews: 203,
      category: "Recovery",
      badge: "Essential",
      description: "Sand ladders for vehicle recovery"
    },
    {
      id: 9,
      name: "Portable Air Compressor",
      price: "$199.99",
      originalPrice: "$249.99",
      image: airCompressorImage,
      rating: 4.8,
      reviews: 342,
      category: "Tools",
      badge: "Portable",
      description: "12V compressor for tire inflation"
    },
    {
      id: 10,
      name: "Tactical Floor Mats",
      price: "$159.99",
      originalPrice: "$199.99",
      image: airCompressorImage, // Reusing image for demo
      rating: 4.5,
      reviews: 167,
      category: "Interior",
      badge: "Durable",
      description: "Heavy-duty rubber mats with drainage"
    },
    {
      id: 11,
      name: "Off-Road Tool Kit",
      price: "$249.99",
      originalPrice: "$299.99",
      image: recoveryTracksImage, // Reusing image for demo
      rating: 4.7,
      reviews: 98,
      category: "Tools",
      badge: "Complete",
      description: "Essential tools for trail maintenance"
    },
    {
      id: 12,
      name: "Cargo Net System",
      price: "$89.99",
      originalPrice: "$119.99",
      image: roofRackImage, // Reusing image for demo
      rating: 4.4,
      reviews: 145,
      category: "Storage",
      badge: "Flexible",
      description: "Adjustable cargo retention system"
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

        {/* Products Grid - More Compact */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`}>
              <Card className="group bg-background border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer">
                {/* Product Image - Compact */}
                <div className="relative overflow-hidden aspect-square bg-muted/10 p-4">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
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

                  {/* Add to Cart Button - Smaller */}
                  <Button 
                    size="sm" 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-7 text-xs"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // Handle add to cart action
                    }}
                  >
                    <ShoppingCart className="h-3 w-3 mr-1.5" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* View All Products Button */}
        <div className="text-center mt-12">
          <Link to="/parts">
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