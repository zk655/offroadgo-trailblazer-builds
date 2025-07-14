import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { supabase } from '@/integrations/supabase/client';
import { Search, Filter, Star, ExternalLink, Package, Zap, Shield, Lightbulb, Grid, List } from 'lucide-react';
import Navigation from '@/components/Navigation';
import PageHero from '@/components/PageHero';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';

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
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [brandFilter, setBrandFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
    fetchProducts();
  }, [searchTerm, categoryFilter, priceFilter, brandFilter]);

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const fetchAllData = async () => {
    try {
      const { data, error } = await supabase
        .from('mods')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      // This is for getting unique categories and brands
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching all data:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('mods')
        .select('*', { count: 'exact' })
        .order('category', { ascending: true })
        .order('title', { ascending: true });

      // Apply filters
      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,brand.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`);
      }

      if (categoryFilter !== 'all') {
        query = query.eq('category', categoryFilter);
      }

      if (brandFilter !== 'all') {
        query = query.eq('brand', brandFilter);
      }

      if (priceFilter !== 'all') {
        const [min, max] = priceFilter.split('-').map(Number);
        if (max) {
          query = query.gte('price', min).lte('price', max);
        } else {
          query = query.gte('price', min);
        }
      }

      // Apply pagination
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;
      
      setProducts(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching products:', error);
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
        className={`h-3 w-3 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-600'
        }`}
      />
    ));
  };

  const getAmazonAffiliateLink = (originalLink: string) => {
    const affiliateTag = 'offroad-20'; // Replace with your actual affiliate tag
    
    if (originalLink && originalLink.includes('amazon.com')) {
      const url = new URL(originalLink);
      url.searchParams.set('tag', affiliateTag);
      return url.toString();
    }
    return originalLink;
  };

  const uniqueCategories = [...new Set(products.map(p => p.category))];
  const uniqueBrands = [...new Set(products.map(p => p.brand))];
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const featuredCategories = [
    { name: 'Lighting', icon: Lightbulb, description: 'LED light bars, rock lights, and more', count: products.filter(p => p.category === 'Lighting').length },
    { name: 'Protection', icon: Shield, description: 'Bumpers, skid plates, and armor', count: products.filter(p => p.category === 'Protection').length },
    { name: 'Performance', icon: Zap, description: 'Engine mods and upgrades', count: products.filter(p => p.category === 'Performance').length },
    { name: 'Suspension', icon: Package, description: 'Lift kits and shock absorbers', count: products.filter(p => p.category === 'Suspension').length }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
        title="Premium 4x4 Products"
        subtitle="Upgrade your off-road machine with premium parts and accessories. All items feature Amazon affiliate links for easy purchasing."
        icon={Package}
      />

      {/* Featured Categories */}
      <section className="py-12 bg-card/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredCategories.map((category) => (
              <Card 
                key={category.name}
                className="group cursor-pointer hover:shadow-primary transition-smooth hover:-translate-y-1 text-center"
                onClick={() => setCategoryFilter(category.name)}
              >
                <CardContent className="p-4 md:p-6">
                  <div className="bg-primary/10 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4 group-hover:bg-primary/20 transition-smooth">
                    <category.icon className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm md:text-base mb-1 md:mb-2">{category.name}</h3>
                  <p className="text-xs md:text-sm text-muted-foreground mb-2">{category.description}</p>
                  <Badge variant="secondary" className="text-xs">
                    {category.count} products
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Advanced Filters */}
        <Card className="mb-6 md:mb-8">
          <CardContent className="p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {uniqueCategories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={brandFilter} onValueChange={setBrandFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Brands</SelectItem>
                  {uniqueBrands.map(brand => (
                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="0-500">Under $500</SelectItem>
                  <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                  <SelectItem value="1000-2000">$1,000 - $2,000</SelectItem>
                  <SelectItem value="2000">$2,000+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* View Toggle and Results */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <p className="text-muted-foreground">
              Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, totalCount)} of {totalCount} products
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="hidden md:flex"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="hidden md:flex"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Quick Category Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Badge
            variant={categoryFilter === 'all' ? 'default' : 'outline'}
            className="cursor-pointer px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm"
            onClick={() => setCategoryFilter('all')}
          >
            All Products
          </Badge>
          {uniqueCategories.slice(0, 5).map(category => (
            <Badge
              key={category}
              variant={categoryFilter === category ? 'default' : 'outline'}
              className="cursor-pointer px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm"
              onClick={() => setCategoryFilter(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Products Grid */}
        <div className={`grid gap-4 md:gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {products.map((product) => (
            <Card 
              key={product.id} 
              className={`group hover:shadow-primary transition-smooth hover:-translate-y-1 overflow-hidden ${
                viewMode === 'list' ? 'md:flex md:flex-row' : ''
              }`}
            >
              <Link to={`/product/${product.id}`} className={viewMode === 'list' ? 'md:flex md:flex-row md:w-full' : ''}>
                <div className={`relative ${viewMode === 'list' ? 'md:w-48 md:flex-shrink-0' : ''}`}>
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className={`object-cover group-hover:scale-105 transition-smooth ${
                      viewMode === 'list' ? 'w-full h-48 md:h-full' : 'w-full h-48'
                    }`}
                  />
                  <div className="absolute top-2 md:top-4 left-2 md:left-4">
                    <Badge variant="secondary" className="bg-black/80 text-white border-0 text-xs">
                      {product.category}
                    </Badge>
                  </div>
                  <div className="absolute top-2 md:top-4 right-2 md:right-4">
                    <Badge className="bg-primary text-white border-0 text-xs">
                      {formatPrice(product.price)}
                    </Badge>
                  </div>
                </div>

                <div className={`flex flex-col ${viewMode === 'list' ? 'md:flex-1 md:p-6' : ''}`}>
                  <CardHeader className={`pb-2 ${viewMode === 'list' ? 'md:pb-4' : ''}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-xs md:text-sm text-muted-foreground font-medium">{product.brand}</p>
                        <CardTitle className={`leading-tight line-clamp-2 ${
                          viewMode === 'list' ? 'text-lg md:text-xl' : 'text-base md:text-lg'
                        }`}>
                          {product.title}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className={`py-2 flex-1 ${viewMode === 'list' ? 'md:py-4' : ''}`}>
                    <p className={`text-muted-foreground line-clamp-2 mb-3 ${
                      viewMode === 'list' ? 'text-sm md:text-base md:line-clamp-3' : 'text-sm'
                    }`}>
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        {renderStars(product.rating)}
                        <span className="text-xs md:text-sm text-muted-foreground ml-1">
                          ({product.rating})
                        </span>
                      </div>
                      <p className={`font-bold text-primary ${
                        viewMode === 'list' ? 'text-lg md:text-xl' : 'text-base md:text-lg'
                      }`}>
                        {formatPrice(product.price)}
                      </p>
                    </div>
                  </CardContent>
                </div>
              </Link>

              <CardFooter className={`pt-2 gap-2 ${
                viewMode === 'list' ? 'md:flex-col md:w-48 md:justify-center md:px-6' : 'flex-col sm:flex-row'
              }`}>
                <Button 
                  asChild 
                  size="sm" 
                  className={`w-full ${viewMode === 'list' ? 'md:mb-2' : ''}`}
                >
                  <Link to={`/product/${product.id}`}>
                    View Details
                  </Link>
                </Button>
                {product.amazon_link && (
                  <Button 
                    asChild 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                  >
                    <a 
                      href={getAmazonAffiliateLink(product.amazon_link)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Buy on Amazon
                    </a>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        {products.length === 0 && !loading && (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination>
              <PaginationContent>
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(currentPage - 1);
                      }}
                    />
                  </PaginationItem>
                )}
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = currentPage <= 3 
                    ? i + 1 
                    : currentPage >= totalPages - 2 
                    ? totalPages - 4 + i 
                    : currentPage - 2 + i;
                  
                  if (pageNum < 1 || pageNum > totalPages) return null;
                  
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(pageNum);
                        }}
                        isActive={currentPage === pageNum}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                
                {currentPage < totalPages - 3 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                
                {currentPage < totalPages && (
                  <PaginationItem>
                    <PaginationNext 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(currentPage + 1);
                      }}
                    />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Parts;