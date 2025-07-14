import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Search, Filter, Star, ShoppingCart, ExternalLink, Wrench } from 'lucide-react';
import Navigation from '@/components/Navigation';
import PageHero from '@/components/PageHero';

interface Mod {
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

const Mods = () => {
  const [mods, setMods] = useState<Mod[]>([]);
  const [filteredMods, setFilteredMods] = useState<Mod[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');

  useEffect(() => {
    fetchMods();
  }, []);

  useEffect(() => {
    filterMods();
  }, [mods, searchTerm, categoryFilter, priceFilter]);

  const fetchMods = async () => {
    try {
      const { data, error } = await supabase
        .from('mods')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      setMods(data || []);
    } catch (error) {
      console.error('Error fetching mods:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterMods = () => {
    let filtered = mods;

    if (searchTerm) {
      filtered = filtered.filter(mod =>
        mod.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mod.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mod.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(mod => mod.category === categoryFilter);
    }

    if (priceFilter !== 'all') {
      const [min, max] = priceFilter.split('-').map(Number);
      filtered = filtered.filter(mod => {
        if (max) {
          return mod.price >= min && mod.price <= max;
        } else {
          return mod.price >= min;
        }
      });
    }

    setFilteredMods(filtered);
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
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const uniqueCategories = [...new Set(mods.map(m => m.category))];

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
      <PageHero
        title="4x4 Modifications & Upgrades"
        subtitle="Upgrade your 4x4 with the best off-road gear and modifications. From tires to lighting, build the ultimate adventure machine."
        icon={Wrench}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 bg-card p-6 rounded-lg shadow-card">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search modifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
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

          <Select value={priceFilter} onValueChange={setPriceFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
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

        {/* Category Badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Badge
            variant={categoryFilter === 'all' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setCategoryFilter('all')}
          >
            All
          </Badge>
          {uniqueCategories.map(category => (
            <Badge
              key={category}
              variant={categoryFilter === category ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setCategoryFilter(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredMods.length} of {mods.length} modifications
          </p>
        </div>

        {/* Mods Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMods.map((mod) => (
            <Card key={mod.id} className="group hover:shadow-primary transition-smooth hover:-translate-y-1 overflow-hidden">
              <div className="relative">
                <img
                  src={mod.image_url}
                  alt={mod.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-smooth"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-white/90 text-black">
                    {mod.category}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge className="bg-primary text-white">
                    {formatPrice(mod.price)}
                  </Badge>
                </div>
              </div>

              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">{mod.brand}</p>
                    <CardTitle className="text-lg leading-tight line-clamp-2">{mod.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="py-2">
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {mod.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    {renderStars(mod.rating)}
                    <span className="text-sm text-muted-foreground ml-1">
                      ({mod.rating})
                    </span>
                  </div>
                  <p className="text-lg font-bold text-primary">{formatPrice(mod.price)}</p>
                </div>
              </CardContent>

              <CardFooter className="pt-2 flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Build
                </Button>
                {mod.amazon_link && (
                  <Button asChild size="sm" className="flex-1">
                    <a href={mod.amazon_link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Buy Now
                    </a>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredMods.length === 0 && (
          <div className="text-center py-12">
            <Wrench className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No modifications found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Mods;