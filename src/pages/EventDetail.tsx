import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, MapPin, Users, Clock, DollarSign, Trophy, 
  ArrowLeft, ExternalLink, Globe, Mail, Phone, Mountain
} from 'lucide-react';
import { format } from 'date-fns';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

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
  difficulty_level: string;
  terrain_type: string;
  image_url: string;
  entry_fee: number;
  max_participants: number;
  current_participants: number;
  external_url: string;
  club?: {
    name: string;
    contact_email: string;
    website_url: string;
  };
}

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      if (!id) throw new Error('Event ID is required');
      
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          club:clubs(name, contact_email, website_url)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Event;
    },
    enabled: !!id,
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded mb-4" />
            <div className="h-64 bg-muted rounded-xl mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-4">
                <div className="h-6 bg-muted rounded" />
                <div className="h-6 bg-muted rounded" />
                <div className="h-6 bg-muted rounded" />
              </div>
              <div className="h-96 bg-muted rounded-xl" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The event you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/clubs-events">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Events
              </Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title={`${event.title} - Rally Event Details`}
        description={event.description || `Join the ${event.title} rally event in ${event.location}, ${event.country}`}
      />
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="pl-0">
            <Link to="/clubs-events">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Link>
          </Button>
        </div>

        {/* Hero Image */}
        {event.image_url && (
          <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-8">
            <img 
              src={event.image_url} 
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className={`${getDifficultyColor(event.difficulty_level)} text-white border-0`}>
                  {event.difficulty_level}
                </Badge>
                <Badge variant="secondary" className="bg-black/30 text-white border-0">
                  <Trophy className="w-3 h-3 mr-1" />
                  {event.event_type}
                </Badge>
                {event.terrain_type && (
                  <Badge variant="secondary" className="bg-black/30 text-white border-0">
                    <Mountain className="w-3 h-3 mr-1" />
                    {event.terrain_type}
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">{event.title}</h1>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {event.description && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-muted-foreground leading-relaxed">{event.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center text-sm">
                    <Calendar className="w-4 h-4 mr-3 text-primary" />
                    <div>
                      <div className="font-medium">Start Date</div>
                      <div className="text-muted-foreground">
                        {event.start_date && format(new Date(event.start_date), 'PPP')}
                      </div>
                    </div>
                  </div>

                  {event.end_date && (
                    <div className="flex items-center text-sm">
                      <Clock className="w-4 h-4 mr-3 text-primary" />
                      <div>
                        <div className="font-medium">End Date</div>
                        <div className="text-muted-foreground">
                          {format(new Date(event.end_date), 'PPP')}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center text-sm">
                    <MapPin className="w-4 h-4 mr-3 text-primary" />
                    <div>
                      <div className="font-medium">Location</div>
                      <div className="text-muted-foreground">
                        {event.venue && `${event.venue}, `}{event.location}, {event.country}
                      </div>
                    </div>
                  </div>

                  {event.entry_fee && (
                    <div className="flex items-center text-sm">
                      <DollarSign className="w-4 h-4 mr-3 text-primary" />
                      <div>
                        <div className="font-medium">Entry Fee</div>
                        <div className="text-muted-foreground">${event.entry_fee}</div>
                      </div>
                    </div>
                  )}

                  {event.max_participants && (
                    <div className="flex items-center text-sm">
                      <Users className="w-4 h-4 mr-3 text-primary" />
                      <div>
                        <div className="font-medium">Participants</div>
                        <div className="text-muted-foreground">
                          {event.current_participants || 0} / {event.max_participants}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <Card>
              <CardHeader>
                <CardTitle>Register for Event</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {event.external_url ? (
                  <Button asChild className="w-full" size="lg">
                    <a href={event.external_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Register Now
                    </a>
                  </Button>
                ) : (
                  <Button disabled className="w-full" size="lg">
                    Registration Coming Soon
                  </Button>
                )}
                
                <div className="text-sm text-muted-foreground text-center">
                  Spaces available: {(event.max_participants || 0) - (event.current_participants || 0)}
                </div>
              </CardContent>
            </Card>

            {/* Organizer Info */}
            {event.club && (
              <Card>
                <CardHeader>
                  <CardTitle>Organized by</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="font-medium">{event.club.name}</div>
                  
                  {event.club.contact_email && (
                    <Button variant="outline" size="sm" asChild className="w-full">
                      <a href={`mailto:${event.club.contact_email}`}>
                        <Mail className="w-4 h-4 mr-2" />
                        Contact Club
                      </a>
                    </Button>
                  )}
                  
                  {event.club.website_url && (
                    <Button variant="outline" size="sm" asChild className="w-full">
                      <a href={event.club.website_url} target="_blank" rel="noopener noreferrer">
                        <Globe className="w-4 h-4 mr-2" />
                        Visit Website
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EventDetail;