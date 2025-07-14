import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react';

const ProductsSection = () => {
  const products = [
    {
      id: 1,
      name: "Pro Series Winch 12000lb",
      price: "$899.99",
      originalPrice: "$1,199.99",
      image: "/src/assets/offroad-bg-1.jpg",
      rating: 4.8,
      reviews: 234,
      category: "Recovery",
      badge: "Best Seller",
      description: "Heavy-duty electric winch with synthetic rope and wireless remote"
    },
    {
      id: 2,
      name: "All-Terrain LED Light Bar 50\"",
      price: "$349.99",
      originalPrice: "$449.99",
      image: "/src/assets/offroad-bg-2.jpg",
      rating: 4.9,
      reviews: 189,
      category: "Lighting",
      badge: "New",
      description: "Ultra-bright LED light bar with flood and spot beam combo"
    },
    {
      id: 3,
      name: "Heavy Duty Roof Rack System",
      price: "$599.99",
      originalPrice: "$749.99",
      image: "/src/assets/offroad-bg-3.jpg",
      rating: 4.7,
      reviews: 156,
      category: "Storage",
      badge: "Sale",
      description: "Modular roof rack system with integrated mounting points"
    },
    {
      id: 4,
      name: "Mud Terrain Tires Set (4)",
      price: "$1,299.99",
      originalPrice: "$1,599.99",
      image: "/src/assets/hero-offroad-1.jpg",
      rating: 4.6,
      reviews: 298,
      category: "Tires",
      badge: "Popular",
      description: "Premium mud terrain tires for extreme off-road performance"
    },
    {
      id: 5,
      name: "Rock Sliders Protection Kit",
      price: "$749.99",
      originalPrice: "$899.99",
      image: "/src/assets/hero-offroad-2.jpg",
      rating: 4.8,
      reviews: 124,
      category: "Protection",
      badge: "Recommended",
      description: "Heavy-duty rock sliders with integrated step plates"
    },
    {
      id: 6,
      name: "Suspension Lift Kit 6\"",
      price: "$2,199.99",
      originalPrice: "$2,599.99",
      image: "/src/assets/hero-offroad-3.jpg",
      rating: 4.9,
      reviews: 87,
      category: "Suspension",
      badge: "Premium",
      description: "Complete suspension lift kit with adjustable coilovers"
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) 
            ? 'fill-yellow-400 text-yellow-400' 
            : 'text-muted-foreground'
        }`}
      />
    ));
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background with 4x4 car theme */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url('/src/assets/parts-hero.jpg')`,
          backgroundBlendMode: 'overlay'
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-primary border-primary/20">
            Premium Products
          </Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 bg-gradient-primary bg-clip-text text-transparent">
            4x4 Gear & Accessories
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover our premium collection of off-road equipment, from winches to lighting systems, 
            designed to enhance your 4x4 adventures.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card key={product.id} className="group glass-effect border-border/20 hover:shadow-glow transition-all duration-300 hover-lift overflow-hidden">
              {/* Product Image */}
              <div className="relative overflow-hidden aspect-video">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Badge */}
                <Badge 
                  variant="secondary" 
                  className="absolute top-4 left-4 bg-primary text-primary-foreground border-0"
                >
                  {product.badge}
                </Badge>

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button size="icon" variant="secondary" className="h-10 w-10 glass-effect">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="secondary" className="h-10 w-10 glass-effect">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>

                {/* Category */}
                <div className="absolute bottom-4 left-4">
                  <Badge variant="outline" className="glass-effect border-white/20 text-white">
                    {product.category}
                  </Badge>
                </div>
              </div>

              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                    {product.name}
                  </CardTitle>
                </div>
                
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {product.description}
                </CardDescription>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-sm font-semibold">{product.rating}</span>
                  <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Price */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl font-black text-primary">{product.price}</span>
                  <span className="text-lg text-muted-foreground line-through">{product.originalPrice}</span>
                </div>

                {/* Add to Cart Button */}
                <Button className="w-full premium-gradient text-white hover:shadow-glow hover-lift border-0 font-bold">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Products Button */}
        <div className="text-center mt-12">
          <Button 
            size="lg" 
            variant="outline" 
            className="premium-gradient text-white hover:shadow-glow hover-lift border-0 font-bold px-8 py-3"
          >
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;