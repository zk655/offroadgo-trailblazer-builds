import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, Trophy, ExternalLink, Clock, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import OptimizedImage from '@/components/OptimizedImage';
import SocialShare from '@/components/SocialShare';

interface Club {
  id: string;
  name: string;
  location: string;
  country: string;
  description: string;
  website_url: string;
  contact_email: string;
  club_type: string;
  founded_year: number;
  member_count: number;
  image_url: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  event_type: string;
  start_date: string;
  end_date: string;
  location: string;
  country: string;
  venue: string;
  entry_fee: number;
  max_participants: number;
  current_participants: number;
  external_url: string;
  image_url: string;
  difficulty_level: string;
  terrain_type: string;
}

const ClubsEvents = () => {
  const [activeTab, setActiveTab] = useState<'clubs' | 'events'>('events');

  const { data: clubs, isLoading: clubsLoading } = useQuery({
    queryKey: ['clubs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clubs')
        .select(`
          id,
          name,
          location,
          country,
          description,
          website_url,
          club_type,
          image_url,
          founded_year,
          member_count,
          created_at,
          updated_at,
          contact_email
        `)
        .order('name');
      
      if (error) throw error;
      return data as Club[];
    },
  });

  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('start_date', new Date().toISOString())
        .order('start_date');
      
      if (error) throw error;
      return data as Event[];
    },
  });

  const getDifficultyColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'beginner': return 'bg-gradient-to-r from-green-500 to-green-600';
      case 'intermediate': return 'bg-gradient-to-r from-yellow-500 to-orange-500';
      case 'advanced': return 'bg-gradient-to-r from-orange-500 to-red-500';
      case 'professional': return 'bg-gradient-to-r from-red-500 to-purple-600';
      default: return 'bg-gradient-to-r from-blue-500 to-blue-600';
    }
  };

  const getTerrainIcon = (terrain: string) => {
    return '🏔️'; // Default terrain icon
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Rally Clubs & Events - OffRoadGo"
        description="Discover rally clubs and upcoming motorsport events worldwide. Join the off-road community and participate in exciting competitions."
        keywords="rally clubs, motorsport events, off-road competitions, racing, WRC, rally championship"
        url="/clubs-events"
      />
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary via-primary-dark to-secondary overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Rally Clubs & Events
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            Connect with the global rally community. Discover clubs, join events, and experience the thrill of competitive off-roading.
          </p>
          
          {/* Tab Navigation */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setActiveTab('events')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'events'
                  ? 'bg-white text-primary shadow-lg'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <Calendar className="inline-block w-5 h-5 mr-2" />
              Upcoming Events
            </button>
            <button
              onClick={() => setActiveTab('clubs')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'clubs'
                  ? 'bg-white text-primary shadow-lg'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <Users className="inline-block w-5 h-5 mr-2" />
              Rally Clubs
            </button>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {activeTab === 'events' && (
            <div>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Upcoming Rally Events</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Join thrilling rally competitions and meetups happening around the world.
                </p>
              </div>

              {eventsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-muted rounded-lg h-64" />
                    </div>
                  ))}
                </div>
              ) : events && events.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((event) => (
                    <Card key={event.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-border/30 hover:border-primary/40 bg-card/80 backdrop-blur-sm rounded-2xl overflow-hidden">
                      {event.image_url && (
                        <div className="relative h-48 overflow-hidden">
                          <OptimizedImage
                            src={event.image_url} 
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            fallbackSrc="/placeholder.svg"
                            loading="lazy"
                            width={400}
                            height={192}
                          />
                          <div className="absolute top-4 left-4">
                            <Badge className={`${getDifficultyColor(event.difficulty_level)} text-white border-0 shadow-lg`}>
                              {event.difficulty_level || 'Open'}
                            </Badge>
                          </div>
                        </div>
                      )}
                      
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-xl group-hover:text-primary transition-colors">
                            {event.title}
                          </CardTitle>
                          <Badge variant="outline" className="ml-2">
                            <Trophy className="w-3 h-3 mr-1" />
                            {event.event_type}
                          </Badge>
                        </div>
                        <CardDescription className="text-sm line-clamp-2">
                          {event.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4 mr-2" />
                            {event.start_date && format(new Date(event.start_date), 'MMM dd, yyyy')}
                          </div>
                          
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4 mr-2" />
                            {event.location}, {event.country}
                          </div>

                          {event.terrain_type && (
                            <div className="flex items-center text-sm text-muted-foreground">
                              <span className="mr-2">{getTerrainIcon(event.terrain_type)}</span>
                              {event.terrain_type}
                            </div>
                          )}

                          {event.entry_fee && (
                            <div className="flex items-center text-sm text-muted-foreground">
                              <DollarSign className="w-4 h-4 mr-2" />
                              ${event.entry_fee}
                            </div>
                          )}

                          <div className="space-y-3 pt-4">
                            <div className="flex items-center justify-between">
                              <div className="text-sm text-muted-foreground">
                                {event.current_participants}/{event.max_participants} participants
                              </div>
                              
                              {event.external_url && (
                                <Button variant="outline" size="sm" asChild>
                                  <a href={event.external_url} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    Register
                                  </a>
                                </Button>
                              )}
                            </div>
                            
                            {/* Social Share - Aligned in same row with register button */}
                            <div className="flex items-center justify-between">
                              <div className="flex justify-center flex-1">
                                <SocialShare
                                  title={event.title}
                                  excerpt={event.description || `Join the ${event.title} rally event in ${event.location}, ${event.country}`}
                                  url={`/event/${event.id}`}
                                  image={event.image_url}
                                  variant="icon"
                                  size="sm"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No upcoming events</h3>
                  <p className="text-muted-foreground">Check back soon for new rally events and competitions.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'clubs' && (
            <div>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Rally Clubs Worldwide</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Connect with local rally clubs and join the global off-road community.
                </p>
              </div>

              {clubsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-muted rounded-lg h-64" />
                    </div>
                  ))}
                </div>
              ) : clubs && clubs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {clubs.map((club) => (
                    <Card key={club.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 border-border/30 hover:border-primary/40 bg-card/80 backdrop-blur-sm rounded-2xl overflow-hidden">
                      {club.image_url && (
                        <div className="relative h-48 overflow-hidden">
                          <OptimizedImage
                            src={club.image_url} 
                            alt={club.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            fallbackSrc="/placeholder.svg"
                            loading="lazy"
                            width={400}
                            height={192}
                          />
                        </div>
                      )}
                      
                      <CardHeader>
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                          {club.name}
                        </CardTitle>
                        <CardDescription className="text-sm line-clamp-2">
                          {club.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4 mr-2" />
                            {club.location}, {club.country}
                          </div>
                          
                          {club.founded_year && (
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="w-4 h-4 mr-2" />
                              Founded {club.founded_year}
                            </div>
                          )}

                          {club.member_count && (
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Users className="w-4 h-4 mr-2" />
                              {club.member_count} members
                            </div>
                          )}

                          <div className="pt-4">
                            <Badge variant="secondary" className="mb-3">
                              {club.club_type}
                            </Badge>
                            
                            <div className="space-y-2">
                              <div className="flex gap-2">
                                {club.website_url && (
                                  <Button variant="outline" size="sm" asChild className="flex-1">
                                    <a href={club.website_url} target="_blank" rel="noopener noreferrer">
                                      <ExternalLink className="w-4 h-4 mr-2" />
                                      Website
                                    </a>
                                  </Button>
                                )}
                                
                                {club.contact_email && (
                                  <Button variant="outline" size="sm" asChild className="flex-1">
                                    <a href={`mailto:${club.contact_email}`}>
                                      Contact
                                    </a>
                                  </Button>
                                )}
                              </div>
                              
                              {/* Social Share */}
                              <div className="flex justify-center">
                                <SocialShare
                                  title={club.name}
                                  excerpt={club.description || `Join ${club.name}, a rally club based in ${club.location}, ${club.country}`}
                                  url={`/clubs-events#club-${club.id}`}
                                  image={club.image_url}
                                  variant="icon"
                                  size="sm"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No clubs found</h3>
                  <p className="text-muted-foreground">Check back soon for new rally clubs in your area.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ClubsEvents;