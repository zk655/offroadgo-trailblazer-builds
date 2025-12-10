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
import { Search, Filter, MapPin, Mountain, Compass, Route } from 'lucide-react';
import Navigation from '@/components/Navigation';
import PageHero from '@/components/PageHero';
import SEOHead from '@/components/SEOHead';
import Footer from '@/components/Footer';
import AdSenseAd from '@/components/AdSenseAd';
import AdPlacement from '@/components/AdPlacement';
import SocialShare from '@/components/SocialShare';

interface Trail {
  id: string;
  name: string;
  difficulty: string | null;
  length: number | null;
  image_url: string | null;
  location: string | null;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  elevation_gain: number | null;
}

const Trails = () => {
  const [trails, setTrails] = useState<Trail[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [allTrails, setAllTrails] = useState<Trail[]>([]);
  
  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    fetchAllTrails();
  }, []);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
    fetchTrails();
  }, [searchTerm, difficultyFilter]);

  useEffect(() => {
    fetchTrails();
  }, [currentPage]);

  const fetchAllTrails = async () => {
    try {
      const { data, error } = await supabase
        .from('trails')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setAllTrails(data || []);
    } catch (error) {
      // Handle error silently in production
    }
  };

  const fetchTrails = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('trails')
        .select('*', { count: 'exact' })
        .order('name', { ascending: true });

      // Apply filters
      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`);
      }

      if (difficultyFilter !== 'all') {
        query = query.eq('difficulty', difficultyFilter);
      }

      // Apply pagination
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;
      
      setTrails(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      // Handle error silently in production
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (trail: Trail) => {
    if (trail.image_url) return trail.image_url;
    // Default placeholder
    return `https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop`;
  };

  const getDifficultyColor = (difficulty: string | null) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
      case 'easy':
        return 'bg-green-500';
      case 'intermediate':
      case 'moderate':
        return 'bg-orange-500';
      case 'expert':
      case 'difficult':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const uniqueDifficulties = [...new Set(allTrails.map(t => t.difficulty).filter(Boolean))];
  
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
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
      <SEOHead 
        title="Epic 4x4 Trails & Off-Road Adventure Routes"
        description="Discover epic off-road trails and adventure routes. From beginner-friendly paths to expert 4x4 challenges. Find your next adventure destination."
        keywords="4x4 trails, off-road routes, adventure trails, jeep trails, mountain trails, desert trails, rock crawling"
        url="/trails"
        type="website"
        image="https://offroadgo.com/og-trails.jpg"
      />
      <Navigation />
      
      {/* Ad Space After Navigation */}
      <AdPlacement 
        position="top" 
        pageType="other"
        className="py-2 bg-muted/10 border-b border-border/30"
      />
      
      {/* Hero Section */}
      <PageHero
        title="Epic 4x4 Trails"
        subtitle="Discover epic off-road trails and adventure routes. From beginner-friendly paths to expert 4x4 challenges."
        icon={Route}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 bg-card p-6 rounded-lg shadow-card">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search trails..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              {uniqueDifficulties.map(difficulty => (
                <SelectItem key={difficulty} value={difficulty!}>{difficulty}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Ad Section 2 - After Filters */}
        <section className="py-2 md:py-4 bg-muted/10 mb-8">
          <div className="w-full overflow-hidden">
            <AdSenseAd 
              slot="8773228071"
              layout="in-article"
              className="w-full"
            />
          </div>
        </section>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, totalCount)} of {totalCount} trails
          </p>
        </div>

        {/* Trails Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trails.map((trail) => {
            return (
              <Card key={trail.id} className="group hover:shadow-primary transition-smooth hover:-translate-y-1 overflow-hidden">
                <div className="relative">
                  <img
                    src={getImageUrl(trail)}
                    alt={trail.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-smooth"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=600&fit=crop';
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className={`text-white ${getDifficultyColor(trail.difficulty)}`}>
                      {trail.difficulty || 'Unknown'}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="text-xl leading-tight">{trail.name}</CardTitle>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="mr-1 h-3 w-3" />
                    {trail.location}
                  </div>
                </CardHeader>

                <CardContent className="py-2">
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {trail.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Length</p>
                      <p className="font-medium">{trail.length} miles</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Elevation</p>
                      <p className="font-medium">{trail.elevation_gain?.toLocaleString()} ft</p>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-2 space-y-2">
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link to={`/trail/${trail.id}`}>
                        View Details
                      </Link>
                    </Button>
                    <Button asChild size="sm" className="flex-1">
                      <Link to={`/trip-planner?trail=${trail.id}`}>
                        Add to Trip
                      </Link>
                    </Button>
                  </div>
                  
                  {/* Social Share */}
                  <div className="flex justify-center">
                    <SocialShare
                      title={trail.name}
                      excerpt={`Explore the ${trail.name} trail in ${trail.location}. ${trail.difficulty} difficulty, ${trail.length} miles.`}
                      url={`/trail/${trail.id}`}
                      image={getImageUrl(trail)}
                      variant="icon"
                      size="sm"
                    />
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {trails.length === 0 && !loading && (
          <div className="text-center py-12">
            <Route className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No trails found</h3>
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

        {/* Ad Section 3 - After Trails Grid */}
        <section className="py-2 md:py-4 bg-muted/5 mb-8">
          <div className="w-full overflow-hidden">
            <AdSenseAd 
              slot="8773228071"
              layout="in-article"
              className="w-full"
            />
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Trails;