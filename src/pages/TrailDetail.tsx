import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Clock, Users, Star, Navigation as NavigationIcon, Mountain, Gauge } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

interface Trail {
  id: string;
  name: string;
  location: string;
  difficulty: string;
  distance: number;
  elevation_gain: number;
  terrain: string;
  description: string;
  image_url: string;
  latitude: number;
  longitude: number;
}

const TrailDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trail, setTrail] = useState<Trail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchTrail(id);
    }
  }, [id]);

  const fetchTrail = async (trailId: string) => {
    try {
      const { data, error } = await supabase
        .from('trails')
        .select('*')
        .eq('id', trailId)
        .single();

      if (error) throw error;
      setTrail(data);
    } catch (error) {
      console.error('Error fetching trail:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (trail: Trail) => {
    // Use placeholder images based on terrain type
    const placeholderImages = {
      'Mountain': 'photo-1469474968028-56623f02e42e',
      'Alpine': 'photo-1470071459604-3b5ec3a7fe05',
      'Sandstone': 'photo-1426604966848-d7adac402bff',
      'Rock': 'photo-1513836279014-a89f7a76ae86',
      'Desert': 'photo-1472396961693-142e6e269027',
      'Forest': 'photo-1509316975850-ff9c5deb0cd9',
      'Canyon': 'photo-1482938289607-e9573fc25ebb',
      'Coastal': 'photo-1500375592092-40eb2168fd21',
      'Water': 'photo-1506744038136-46273834b3fb',
      'Hoodoos': 'photo-1426604966848-d7adac402bff',
      'Slot Canyon': 'photo-1482938289607-e9573fc25ebb',
      'Geothermal': 'photo-1469474968028-56623f02e42e',
      'Volcanic Rock': 'photo-1513836279014-a89f7a76ae86',
      'Red Rock': 'photo-1426604966848-d7adac402bff',
      'Glacier': 'photo-1470071459604-3b5ec3a7fe05'
    };
    
    const terrainKey = Object.keys(placeholderImages).find(key => 
      trail.terrain?.toLowerCase().includes(key.toLowerCase())
    );
    
    const fallbackImage = placeholderImages[terrainKey as keyof typeof placeholderImages] || 'photo-1469474968028-56623f02e42e';
    
    return `https://images.unsplash.com/${fallbackImage}?w=1200&h=800&fit=crop`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-green-500 text-white';
      case 'moderate':
        return 'bg-orange-500 text-white';
      case 'difficult':
        return 'bg-red-500 text-white';
      case 'expert':
        return 'bg-purple-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getEstimatedDuration = (distance: number, difficulty: string) => {
    const baseSpeed = difficulty?.toLowerCase() === 'difficult' || difficulty?.toLowerCase() === 'expert' ? 2 : 
                     difficulty?.toLowerCase() === 'moderate' ? 3 : 4; // mph
    const hours = Math.round(distance / baseSpeed);
    return hours <= 1 ? '1-2 hours' : `${Math.max(2, hours-1)}-${hours+1} hours`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-16">
          <div className="h-96 bg-muted animate-pulse" />
          <div className="container mx-auto px-4 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="h-4 bg-muted rounded mb-4 animate-pulse" />
                    <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!trail) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-32 text-center">
          <h1 className="text-2xl font-bold mb-4">Trail not found</h1>
          <Button onClick={() => navigate('/trails')}>
            Back to Trails
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative h-96 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500"
            style={{ backgroundImage: `url(${getImageUrl(trail)})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
          <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
            <div className="text-white animate-fade-in">
              <Button 
                variant="ghost" 
                onClick={() => navigate(-1)}
                className="text-white hover:bg-white/20 mb-4 transition-smooth"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4 drop-shadow-lg">
                {trail.name}
              </h1>
              <div className="flex items-center gap-4 text-lg">
                <div className="flex items-center gap-1">
                  <MapPin className="w-5 h-5" />
                  {trail.location}
                </div>
                <Badge className={getDifficultyColor(trail.difficulty)}>
                  {trail.difficulty}
                </Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Trail Info Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mountain className="w-6 h-6 text-primary" />
                      Trail Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {trail.description}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <Star className="w-5 h-5 text-primary" />
                          Trail Features
                        </h3>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center gap-2">
                            <Mountain className="w-4 h-4 text-muted-foreground" />
                            {trail.terrain} terrain
                          </li>
                          <li className="flex items-center gap-2">
                            <NavigationIcon className="w-4 h-4 text-muted-foreground" />
                            {trail.distance} miles total distance
                          </li>
                          <li className="flex items-center gap-2">
                            <Gauge className="w-4 h-4 text-muted-foreground" />
                            {trail.elevation_gain?.toLocaleString()} ft elevation gain
                          </li>
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <Gauge className="w-5 h-5 text-primary" />
                          Recommendations
                        </h3>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-accent" />
                            4WD vehicle required
                          </li>
                          <li className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-accent" />
                            AT or MT tires recommended
                          </li>
                          <li className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-accent" />
                            Recovery gear suggested
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-6 h-6 text-primary" />
                      Location Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {trail.latitude && trail.longitude && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Coordinates</p>
                          <p className="font-mono text-sm">
                            {trail.latitude.toFixed(4)}, {trail.longitude.toFixed(4)}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Full Location</p>
                        <p>{trail.location}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Terrain Type</p>
                        <Badge variant="outline">{trail.terrain}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Trail Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Distance</span>
                      <span className="font-semibold">{trail.distance} miles</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Elevation Gain</span>
                      <span className="font-semibold">{trail.elevation_gain?.toLocaleString()} ft</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Estimated Duration</span>
                      <span className="font-semibold">{getEstimatedDuration(trail.distance, trail.difficulty)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Terrain</span>
                      <span className="font-semibold">{trail.terrain}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Difficulty</span>
                      <Badge className={getDifficultyColor(trail.difficulty)} variant="secondary">
                        {trail.difficulty}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Ready to explore?</h3>
                    <div className="space-y-3">
                      <Button className="w-full" size="sm">
                        <NavigationIcon className="w-4 h-4 mr-2" />
                        Get Directions
                      </Button>
                      <Button variant="outline" className="w-full" size="sm">
                        <Star className="w-4 h-4 mr-2" />
                        Add to Favorites
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default TrailDetail;