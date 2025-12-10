import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock, DollarSign, ArrowLeft, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';
import SocialShare from '@/components/SocialShare';

interface Event {
  id: string;
  title: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  location: string | null;
  difficulty: string | null;
  image_url: string | null;
  entry_fee: number | null;
  registration_url: string | null;
  website_url: string | null;
}

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      if (!id) throw new Error('Event ID is required');
      
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Event;
    },
    enabled: !!id,
  });

  const getDifficultyColor = (level: string | null) => {
    switch (level?.toLowerCase()) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-orange-500';
      case 'professional': return 'bg-red-500';
      default: return 'bg-blue-500';
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
      <SEOHead 
        title={`${event.title} - Rally Event`}
        description={event.description || `Join the ${event.title} rally event`}
        url={`/event/${event.id}`}
        type="article"
        image={event.image_url || ''}
      />
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/clubs-events">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Link>
        </Button>

        {event.image_url && (
          <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-8">
            <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <Badge className={`${getDifficultyColor(event.difficulty)} text-white border-0`}>
                {event.difficulty || 'Open'}
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold text-white mt-2">{event.title}</h1>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {event.description && <p className="text-muted-foreground">{event.description}</p>}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {event.start_date && (
                    <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 mr-3 text-primary" />
                      <div>
                        <div className="font-medium">Date</div>
                        <div className="text-muted-foreground">{format(new Date(event.start_date), 'PPP')}</div>
                      </div>
                    </div>
                  )}
                  {event.location && (
                    <div className="flex items-center text-sm">
                      <MapPin className="w-4 h-4 mr-3 text-primary" />
                      <div>
                        <div className="font-medium">Location</div>
                        <div className="text-muted-foreground">{event.location}</div>
                      </div>
                    </div>
                  )}
                  {event.entry_fee && (
                    <div className="flex items-center text-sm">
                      <DollarSign className="w-4 h-4 mr-3 text-primary" />
                      <div>
                        <div className="font-medium">Entry Fee</div>
                        <div className="text-muted-foreground">${event.entry_fee}</div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Register</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(event.registration_url || event.website_url) ? (
                  <Button asChild className="w-full" size="lg">
                    <a href={event.registration_url || event.website_url || ''} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Register Now
                    </a>
                  </Button>
                ) : (
                  <Button disabled className="w-full" size="lg">Registration Coming Soon</Button>
                )}
                
                <div className="pt-3 border-t">
                  <div className="text-sm font-medium mb-2 text-center">Share Event</div>
                  <div className="flex justify-center">
                    <SocialShare
                      title={event.title}
                      excerpt={event.description || ''}
                      url={`/event/${event.id}`}
                      image={event.image_url || ''}
                      variant="icon"
                      size="sm"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EventDetail;
