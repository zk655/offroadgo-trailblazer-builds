import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Search, Filter, Star, ShoppingCart, ExternalLink, Package, Zap, Shield, Lightbulb } from 'lucide-react';
import Navigation from '@/components/Navigation';
import partsHero from '@/assets/parts-hero.jpg';

interface Part {
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
  const [parts, setParts] = useState<Part[]>([]);
  const [filteredParts, setFilteredParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [brandFilter, setBrandFilter] = useState('all');

  useEffect(() => {
    fetchParts();
  }, []);

  useEffect(() => {
    filterParts();
  }, [parts, searchTerm, categoryFilter, priceFilter, brandFilter]);

  const fetchParts = async () => {
    try {
      const { data, error } = await supabase
        .from('mods')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      setParts(data || []);
    } catch (error) {
      console.error('Error fetching parts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterParts = () => {
    let filtered = parts;

    if (searchTerm) {
      filtered = filtered.filter(part =>
        part.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        part.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        part.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(part => part.category === categoryFilter);
    }

    if (brandFilter !== 'all') {
      filtered = filtered.filter(part => part.brand === brandFilter);
    }

    if (priceFilter !== 'all') {
      const [min, max] = priceFilter.split('-').map(Number);
      filtered = filtered.filter(part => {
        if (max) {
          return part.price >= min && part.price <= max;
        } else {
          return part.price >= min;
        }
      });
    }

    setFilteredParts(filtered);
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

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'lighting':
        return <Lightbulb className="h-4 w-4" />;
      case 'protection':
        return <Shield className="h-4 w-4" />;
      case 'performance':
        return <Zap className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const uniqueCategories = [...new Set(parts.map(p => p.category))];
  const uniqueBrands = [...new Set(parts.map(p => p.brand))];

  const featuredCategories = [
    { name: 'Lighting', icon: Lightbulb, description: 'LED light bars, rock lights, and more' },
    { name: 'Protection', icon: Shield, description: 'Bumpers, skid plates, and armor' },
    { name: 'Performance', icon: Zap, description: 'Engine mods and upgrades' },
    { name: 'Suspension', icon: Package, description: 'Lift kits and shock absorbers' }
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
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 mt-16 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={partsHero}
            alt="4x4 Parts and Accessories"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        <div className="relative container mx-auto px-4 text-center text-white">
          <Package className="mx-auto mb-4 h-16 w-16" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Premium 4x4 Parts
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto mb-8">
            Upgrade your off-road machine with premium parts and accessories. All items feature Amazon affiliate links for easy purchasing.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {featuredCategories.map((category) => (
              <Button
                key={category.name}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => setCategoryFilter(category.name)}
              >
                <category.icon className="mr-2 h-4 w-4" />
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-12 bg-card/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCategories.map((category) => (
              <Card 
                key={category.name}
                className="group cursor-pointer hover:shadow-primary transition-smooth hover:-translate-y-1"
                onClick={() => setCategoryFilter(category.name)}
              >
                <CardContent className="p-6 text-center">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-smooth">
                    <category.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Advanced Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search parts..."
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

        {/* Quick Category Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Badge
            variant={categoryFilter === 'all' ? 'default' : 'outline'}
            className="cursor-pointer px-4 py-2"
            onClick={() => setCategoryFilter('all')}
          >
            All Parts
          </Badge>
          {uniqueCategories.map(category => (
            <Badge
              key={category}
              variant={categoryFilter === category ? 'default' : 'outline'}
              className="cursor-pointer px-4 py-2"
              onClick={() => setCategoryFilter(category)}
            >
              <span className="mr-1">{getCategoryIcon(category)}</span>
              {category}
            </Badge>
          ))}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredParts.length} of {parts.length} parts
          </p>
        </div>

        {/* Parts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredParts.map((part) => (
            <Card key={part.id} className="group hover:shadow-primary transition-smooth hover:-translate-y-1 overflow-hidden">
              <div className="relative">
                <img
                  src={part.image_url}
                  alt={part.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-smooth"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-black/80 text-white border-0">
                    {getCategoryIcon(part.category)}
                    <span className="ml-1">{part.category}</span>
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge className="bg-primary text-white border-0">
                    {formatPrice(part.price)}
                  </Badge>
                </div>
              </div>

              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground font-medium">{part.brand}</p>
                    <CardTitle className="text-lg leading-tight line-clamp-2">{part.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="py-2">
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {part.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    {renderStars(part.rating)}
                    <span className="text-sm text-muted-foreground ml-1">
                      ({part.rating})
                    </span>
                  </div>
                  <p className="text-lg font-bold text-primary">{formatPrice(part.price)}</p>
                </div>
              </CardContent>

              <CardFooter className="pt-2 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
                {part.amazon_link && (
                  <Button asChild size="sm" className="flex-1">
                    <a href={part.amazon_link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Buy on Amazon
                    </a>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredParts.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No parts found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Parts;