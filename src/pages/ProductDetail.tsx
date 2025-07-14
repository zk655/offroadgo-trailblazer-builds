import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock product data - in a real app, this would be fetched from an API
  const product = {
    id: id || '1',
    name: 'Winch 12000lb Synthetic Rope',
    price: '$799.99',
    originalPrice: '$999.99',
    brand: 'WARN',
    rating: 4.8,
    reviews: 342,
    category: 'Recovery',
    inStock: true,
    image: '/src/assets/products/winch-12000lb.jpg',
    images: [
      '/src/assets/products/winch-12000lb.jpg',
      '/src/assets/products/recovery-tracks.jpg',
      '/src/assets/products/bull-bar-bumper.jpg'
    ],
    description: 'Heavy-duty 12,000lb capacity winch with synthetic rope. Features wireless remote control, automatic load-holding brake, and weatherproof construction. Perfect for serious off-road recovery situations.',
    features: [
      '12,000 lb pulling capacity',
      'Synthetic rope (lighter and safer than steel cable)',
      'Wireless remote control with 50ft range',
      'Automatic load-holding brake system',
      'IP67 weatherproof rating',
      'Includes mounting hardware and fairlead'
    ],
    specifications: {
      'Pulling Capacity': '12,000 lbs',
      'Motor': '6.0 HP series wound',
      'Gear Ratio': '218:1',
      'Rope Length': '100 ft',
      'Rope Diameter': '3/8 inch',
      'Weight': '89 lbs'
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-primary text-primary' : 'text-muted-foreground'}`} 
      />
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-16">
        {/* Breadcrumb */}
        <section className="bg-muted/50 py-4">
          <div className="container mx-auto px-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </div>
        </section>

        {/* Product Details */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Product Images */}
              <div className="space-y-4">
                <div className="aspect-square overflow-hidden rounded-lg bg-muted">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {product.images.map((image, index) => (
                    <div key={index} className="aspect-square overflow-hidden rounded-lg bg-muted cursor-pointer border-2 border-transparent hover:border-primary transition-colors">
                      <img 
                        src={image} 
                        alt={`${product.name} view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <Badge variant="secondary" className="mb-2">{product.category}</Badge>
                  <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">
                    {product.name}
                  </h1>
                  <p className="text-muted-foreground mb-4">by {product.brand}</p>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      {renderStars(product.rating)}
                    </div>
                    <span className="font-medium">{product.rating}</span>
                    <span className="text-muted-foreground">({product.reviews} reviews)</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-3xl font-bold text-primary">{product.price}</span>
                    <span className="text-xl text-muted-foreground line-through">{product.originalPrice}</span>
                    <Badge variant="destructive">20% OFF</Badge>
                  </div>

                  {/* Stock Status */}
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-green-600 font-medium">In Stock - Ready to Ship</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </Button>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="font-medium">
                      <Heart className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" className="font-medium">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>

                {/* Shipping Info */}
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Truck className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-medium">Free Shipping</p>
                          <p className="text-sm text-muted-foreground">On orders over $99</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <RotateCcw className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-medium">30-Day Returns</p>
                          <p className="text-sm text-muted-foreground">Easy returns & exchanges</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-medium">2-Year Warranty</p>
                          <p className="text-sm text-muted-foreground">Manufacturer warranty included</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Product Details Tabs */}
            <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {product.description}
                  </p>
                  
                  <h3 className="text-lg font-semibold mb-4">Key Features</h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Specifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-border/50 last:border-0">
                        <span className="text-muted-foreground">{key}</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;