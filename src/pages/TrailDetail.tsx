import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Clock, Users, Star, Navigation as NavigationIcon, Mountain, Gauge } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const TrailDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock trail data - in a real app, this would be fetched from an API
  const trail = {
    id: id || '1',
    name: 'Moab Rim Trail',
    location: 'Moab, Utah',
    difficulty: 'Moderate',
    distance: '6.2 miles',
    elevation: '1,280 ft',
    rating: 4.8,
    reviews: 1243,
    duration: '3-4 hours',
    terrain: 'Rock, Sand',
    image: '/src/assets/hero-offroad-1.jpg',
    description: 'A spectacular trail offering breathtaking views of the Colorado River and Arches National Park. This moderate trail features challenging rock formations and technical sections that will test your driving skills.',
    highlights: [
      'Panoramic views of Moab Valley',
      'Technical rock crawling sections',
      'Historic mining equipment',
      'Wildlife viewing opportunities'
    ],
    requirements: [
      '4WD vehicle required',
      'AT or MT tires recommended',
      'Minimum 8" ground clearance',
      'Recovery gear suggested'
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative h-96 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${trail.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
          <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
            <div className="text-white">
              <Button 
                variant="ghost" 
                onClick={() => navigate(-1)}
                className="text-white hover:bg-white/20 mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4">
                {trail.name}
              </h1>
              <div className="flex items-center gap-4 text-lg">
                <div className="flex items-center gap-1">
                  <MapPin className="w-5 h-5" />
                  {trail.location}
                </div>
                <Badge variant="secondary">{trail.difficulty}</Badge>
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
                    
                    <h3 className="text-xl font-semibold mb-4">Trail Highlights</h3>
                    <ul className="space-y-2">
                      {trail.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-primary" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gauge className="w-6 h-6 text-primary" />
                      Vehicle Requirements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {trail.requirements.map((requirement, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <NavigationIcon className="w-4 h-4 text-accent" />
                          {requirement}
                        </li>
                      ))}
                    </ul>
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
                      <span className="font-semibold">{trail.distance}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Elevation Gain</span>
                      <span className="font-semibold">{trail.elevation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-semibold">{trail.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Terrain</span>
                      <span className="font-semibold">{trail.terrain}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Rating</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-primary text-primary" />
                        <span className="font-semibold">{trail.rating}</span>
                        <span className="text-sm text-muted-foreground">({trail.reviews})</span>
                      </div>
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