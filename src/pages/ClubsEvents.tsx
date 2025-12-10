import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, Trophy, ExternalLink, Clock, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import OptimizedImage from '@/components/OptimizedImage';
import SocialShare from '@/components/SocialShare';
import AdPlacement from '@/components/AdPlacement';

interface Club {
  id: string;
  name: string;
  location: string | null;
  description: string | null;
  website_url: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  type: string | null;
  member_count: number | null;
  image_url: string | null;
}

interface Event {
  id: string;
  title: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  location: string | null;
  difficulty: string | null;
  entry_fee: number | null;
  image_url: string | null;
  registration_url: string | null;
  website_url: string | null;
}

const ClubsEvents = () => {
  const [activeTab, setActiveTab] = useState<'clubs' | 'events'>('events');

  const { data: clubs, isLoading: clubsLoading } = useQuery({
    queryKey: ['clubs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clubs')
        .select('*')
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

  const getDifficultyColor = (level: string | null) => {
    switch (level?.toLowerCase()) {
      case 'beginner': return 'bg-gradient-to-r from-green-500 to-green-600';
      case 'intermediate': return 'bg-gradient-to-r from-yellow-500 to-orange-500';
      case 'advanced': return 'bg-gradient-to-r from-orange-500 to-red-500';
      case 'professional': return 'bg-gradient-to-r from-red-500 to-purple-600';
      default: return 'bg-gradient-to-r from-blue-500 to-blue-600';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Off-Road Clubs & Events - Join the Adventure Community"
        description="Discover off-road clubs and upcoming events worldwide. Join the 4x4 community and participate in exciting competitions, rallies, and adventure meetups."
        keywords="off-road clubs, 4x4 events, motorsport events, rally clubs, off-road competitions, racing, adventure meetups"
        url="/clubs-events"
        type="website"
        image="https://offroadgo.com/og-clubs-events.jpg"
      />
      <Navigation />
      
      {/* Ad Space After Navigation */}
      <AdPlacement 
        position="top" 
        pageType="other"
        className="py-2 bg-muted/10 border-b border-border/30"
      />

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
                            <Badge className={`${getDifficultyColor(event.difficulty)} text-white border-0 shadow-lg`}>
                              {event.difficulty || 'Open'}
                            </Badge>
                          </div>
                        </div>
                      )}
                      
                      <CardHeader>
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                          {event.title}
                        </CardTitle>
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
                            {event.location || 'TBA'}
                          </div>

                          {event.entry_fee && (
                            <div className="flex items-center text-sm text-muted-foreground">
                              <DollarSign className="w-4 h-4 mr-2" />
                              ${event.entry_fee}
                            </div>
                          )}

                          <div className="space-y-3 pt-4">
                            {(event.registration_url || event.website_url) && (
                              <Button variant="outline" size="sm" asChild>
                                <a href={event.registration_url || event.website_url || ''} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  Register
                                </a>
                              </Button>
                            )}
                            
                            {/* Social Share */}
                            <div className="flex justify-center">
                              <SocialShare
                                title={event.title}
                                excerpt={event.description || `Join the ${event.title} rally event`}
                                url={`/event/${event.id}`}
                                image={event.image_url || ''}
                                variant="icon"
                                size="sm"
                              />
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
                            {club.location || 'Location TBA'}
                          </div>

                          {club.member_count && (
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Users className="w-4 h-4 mr-2" />
                              {club.member_count} members
                            </div>
                          )}

                          <div className="pt-4">
                            {club.type && (
                              <Badge variant="secondary" className="mb-3">
                                {club.type}
                              </Badge>
                            )}
                            
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
                                  excerpt={club.description || `Join ${club.name} rally club`}
                                  url={`/clubs-events#club-${club.id}`}
                                  image={club.image_url || ''}
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
                  <p className="text-muted-foreground">Check back soon for new rally clubs.</p>
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
