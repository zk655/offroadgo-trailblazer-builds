import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Star, 
  ShoppingCart, 
  ExternalLink, 
  Package, 
  Shield, 
  Truck,
  Award,
  CheckCircle,
  AlertCircle,
  Zap,
  Lightbulb
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import AdPlacement from '@/components/AdPlacement';
import SEOHead from '@/components/SEOHead';

interface Product {
  id: string;
  slug: string;
  title: string;
  category: string;
  price: number;
  brand: string;
  rating: number;
  image_url: string;
  amazon_link: string;
  description: string;
}

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchProduct(slug);
    }
  }, [slug]);

  const fetchProduct = async (productSlug: string) => {
    try {
      setLoading(true);
      
      // Fetch the main product by slug
      const { data: productData, error: productError } = await supabase
        .from('mods')
        .select('*')
        .eq('slug', productSlug)
        .single();

      if (productError) throw productError;
      setProduct(productData);

      // Fetch related products (same category, different product)
      if (productData) {
        const { data: relatedData, error: relatedError } = await supabase
          .from('mods')
          .select('*')
          .eq('category', productData.category)
          .neq('slug', productSlug)
          .limit(4);

        if (relatedError) throw relatedError;
        setRelatedProducts(relatedData || []);
      }
    } catch (error) {
      // Handle error silently in production
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const getCategoryIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'lighting':
        return <Lightbulb className="h-5 w-5" />;
      case 'protection':
        return <Shield className="h-5 w-5" />;
      case 'performance':
        return <Zap className="h-5 w-5" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  const getAmazonAffiliateLink = (originalLink: string) => {
    // Add your Amazon affiliate tag here
    const affiliateTag = 'offroad-20'; // Replace with your actual affiliate tag
    
    if (originalLink && originalLink.includes('amazon.com')) {
      const url = new URL(originalLink);
      url.searchParams.set('tag', affiliateTag);
      return url.toString();
    }
    return originalLink;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-muted animate-pulse rounded-lg" />
              <div className="space-y-4">
                <div className="h-8 bg-muted animate-pulse rounded" />
                <div className="h-6 bg-muted animate-pulse rounded w-2/3" />
                <div className="h-4 bg-muted animate-pulse rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-32 text-center">
          <AlertCircle className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button onClick={() => navigate('/products')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title={`${product.title} - ${product.brand} | Off-Road Parts`}
        description={`${product.description} ${product.brand} ${product.title} - $${formatPrice(product.price)}. Top-rated ${product.category} with ${product.rating} stars.`}
        keywords={`${product.brand}, ${product.title}, ${product.category}, off-road parts, 4x4 accessories, modification`}
        url={`/products/${product.slug}`}
        type="product"
        image={product.image_url}
      />
      <Navigation />
      
      <main className="pt-16">
        {/* Breadcrumb */}
        <div className="bg-muted/50 py-4">
          <div className="container mx-auto px-4">
            <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <span>/</span>
              <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
              <span>/</span>
              <span className="text-foreground">{product.title}</span>
            </nav>
          </div>
        </div>

        {/* Product Detail */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Product Image */}
              <div className="space-y-4">
                <div className="relative overflow-hidden rounded-lg">
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="w-full h-96 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-black/80 text-white">
                      {getCategoryIcon(product.category)}
                      <span className="ml-2">{product.category}</span>
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <p className="text-muted-foreground font-medium mb-2">{product.brand}</p>
                  <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center space-x-1">
                      {renderStars(product.rating)}
                      <span className="text-sm text-muted-foreground ml-2">
                        ({product.rating} stars)
                      </span>
                    </div>
                    <Badge variant="outline">{product.category}</Badge>
                  </div>

                  <div className="text-3xl font-bold text-primary mb-6">
                    {formatPrice(product.price)}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <Separator />

                {/* Key Features */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Key Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Premium Quality</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">4x4 Compatible</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Easy Installation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Durable Materials</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Action Buttons */}
                <div className="space-y-3">
                  {product.amazon_link && (
                    <Button asChild size="lg" className="w-full">
                      <a 
                        href={getAmazonAffiliateLink(product.amazon_link)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="mr-2 h-5 w-5" />
                        Buy on Amazon
                      </a>
                    </Button>
                  )}
                  
                  <Button variant="outline" size="lg" className="w-full">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Build List
                  </Button>
                </div>

                {/* Trust Indicators */}
                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="text-center">
                    <Truck className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Fast Shipping</p>
                  </div>
                  <div className="text-center">
                    <Shield className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Secure Purchase</p>
                  </div>
                  <div className="text-center">
                    <Award className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Quality Guaranteed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Ad Section - Mid Page */}
            <AdPlacement 
              position="middle" 
              pageType="parts"
              className="py-6 bg-muted/5"
            />

            {/* Related Products */}
            {relatedProducts.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-6">Related Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {relatedProducts.map((relatedProduct) => (
                    <Card 
                      key={relatedProduct.id} 
                      className="group hover:shadow-primary transition-smooth hover:-translate-y-1 overflow-hidden"
                    >
                      <Link to={`/product/${relatedProduct.slug}`}>
                        <div className="relative">
                          <img
                            src={relatedProduct.image_url}
                            alt={relatedProduct.title}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-smooth"
                          />
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-primary text-white text-xs">
                              {formatPrice(relatedProduct.price)}
                            </Badge>
                          </div>
                        </div>
                        
                        <CardContent className="p-4">
                          <p className="text-xs text-muted-foreground mb-1">{relatedProduct.brand}</p>
                          <h3 className="font-semibold text-sm line-clamp-2 mb-2">
                            {relatedProduct.title}
                          </h3>
                          <div className="flex items-center space-x-1">
                            {renderStars(relatedProduct.rating)}
                          </div>
                        </CardContent>
                      </Link>
                    </Card>
                  ))}
                </div>
              </section>
            )}

            {/* Ad Section - Bottom */}
            <AdPlacement 
              position="bottom" 
              pageType="parts"
              className="py-6 bg-muted/10"
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;