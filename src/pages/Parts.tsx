import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Search, Filter, Star, Eye, Heart, Package, Zap, Shield, Lightbulb, Settings, Wrench } from 'lucide-react';
import Navigation from '@/components/Navigation';
import PageHero from '@/components/PageHero';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';
import AdSenseAd from '@/components/AdSenseAd';

interface Product {
  id: string;
  title: string;
  category: string;
  price: number;
  brand: string;
  rating: number;
  image_url: string;
  amazon_link: string;
  description: string;
}

const Parts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, categoryFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('mods')
        .select('*')
        .order('category', { ascending: true })
        .order('title', { ascending: true });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    setFilteredProducts(filtered);
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
        className={`h-3 w-3 ${
          i < Math.floor(rating) 
            ? 'fill-yellow-400 text-yellow-400' 
            : 'text-muted-foreground'
        }`}
      />
    ));
  };

  const uniqueCategories = [...new Set(products.map(p => p.category))];

  const featuredCategories = [
    { 
      name: 'Lighting', 
      icon: Lightbulb, 
      description: 'LED light bars, rock lights, and auxiliary lighting',
      color: 'from-yellow-500 to-orange-500'
    },
    { 
      name: 'Protection', 
      icon: Shield, 
      description: 'Bumpers, skid plates, and armor protection',
      color: 'from-blue-500 to-purple-500'
    },
    { 
      name: 'Suspension', 
      icon: Settings, 
      description: 'Lift kits, shocks, and suspension components',
      color: 'from-green-500 to-teal-500'
    },
    { 
      name: 'Performance', 
      icon: Zap, 
      description: 'Engine mods, exhaust, and performance upgrades',
      color: 'from-red-500 to-pink-500'
    },
    { 
      name: 'Tires', 
      icon: Package, 
      description: 'All-terrain and mud-terrain tire options',
      color: 'from-gray-500 to-slate-500'
    },
    { 
      name: 'Recovery', 
      icon: Wrench, 
      description: 'Winches, recovery tracks, and safety gear',
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-muted rounded-t-lg" />
                <CardContent className="p-4">
                  <div className="h-4 bg-muted rounded mb-2" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Premium 4x4 Parts & Accessories - Off-Road Products"
        description="Shop premium 4x4 parts and accessories. Find LED light bars, winches, lift kits, bumpers, and more. All products feature Amazon affiliate links for easy purchasing."
        keywords="4x4 parts, off-road accessories, LED light bars, winches, lift kits, bumpers, rock sliders, recovery gear"
        url="/products"
      />
      <Navigation />
      
      {/* Hero Section */}
      <PageHero
        title="Premium 4x4 Parts & Accessories"
        subtitle="Discover professional-grade off-road equipment designed to enhance your adventures. From lighting solutions to protection gear."
        icon={Package}
      />

      {/* Featured Categories */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-3 text-primary border-primary/20 bg-primary/5 text-xs font-medium">
              Shop by Category
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Find Your Perfect <span className="text-primary">Upgrade</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Browse our curated collection of premium off-road parts and accessories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCategories.map((category) => (
              <Card 
                key={category.name}
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden border-0 bg-gradient-to-r from-background to-muted/50"
                onClick={() => setCategoryFilter(category.name)}
              >
                <CardContent className="p-6 relative">
                  <div className={`absolute inset-0 bg-gradient-to-r ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`p-3 rounded-full bg-gradient-to-r ${category.color} text-white`}>
                        <category.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {products.filter(p => p.category === category.name).length} products
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Ad Section */}
      <section className="py-8 px-4">
        <div className="container mx-auto text-center">
          <AdSenseAd 
            slot="8773228071"
            style={{ display: 'block', textAlign: 'center', minHeight: '250px' }}
            format="auto"
            responsive={true}
          />
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="container mx-auto">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {uniqueCategories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`}>
                <Card className="group bg-background border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer">
                  {/* Product Image */}
                  <div className="relative overflow-hidden aspect-square bg-muted/10 p-4">
                    <img 
                      src={product.image_url} 
                      alt={product.title}
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                    
                    {/* Badge */}
                    <Badge 
                      variant="secondary" 
                      className="absolute top-2 left-2 bg-primary text-primary-foreground border-0 text-xs font-medium"
                    >
                      {product.category}
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

                    {/* Price Badge */}
                    <div className="absolute bottom-2 right-2">
                      <Badge className="bg-primary text-primary-foreground border-0 text-xs font-semibold">
                        {formatPrice(product.price)}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    {/* Product Info */}
                    <div className="mb-3">
                      <p className="text-xs text-muted-foreground font-medium mb-1">{product.brand}</p>
                      <h3 className="text-base font-semibold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                        {product.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {product.description}
                      </p>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1.5 mb-4">
                      <div className="flex items-center gap-0.5">
                        {renderStars(product.rating)}
                      </div>
                      <span className="text-xs font-medium">{product.rating}</span>
                    </div>

                    {/* View Details Button */}
                    <Button 
                      size="sm" 
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium h-8 text-xs"
                    >
                      <Eye className="h-3 w-3 mr-1.5" />
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* No Products Found */}
          {filteredProducts.length === 0 && !loading && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Parts;