import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Trophy, ArrowRight, Flag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

// Import rally event images
import rallyEvent1 from '@/assets/rally-event-1.jpg';
import rallyEvent2 from '@/assets/rally-event-2.jpg';
import rallyEvent3 from '@/assets/rally-event-3.jpg';
import rallyEvent4 from '@/assets/rally-event-4.jpg';
import rallyEvent5 from '@/assets/rally-event-5.jpg';
import rallyEvent6 from '@/assets/rally-event-6.jpg';

interface Event {
  id: string;
  title: string;
  description: string;
  event_type: string;
  start_date: string;
  location: string;
  country: string;
  difficulty_level: string;
  image_url: string;
  venue: string;
  current_participants: number;
  max_participants: number;
}

const ClubsEventsSection = () => {
  // Import event images for fallback
  const eventImages = [rallyEvent1, rallyEvent2, rallyEvent3, rallyEvent4, rallyEvent5, rallyEvent6];
  
  const { data: upcomingEvents, isLoading } = useQuery({
    queryKey: ['upcoming-4x4-events-preview'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('start_date', new Date().toISOString())
        .or('terrain_type.ilike.%gravel%,terrain_type.ilike.%snow%,terrain_type.ilike.%4x4%,event_type.ilike.%rally%,event_type.ilike.%4x4%,title.ilike.%rally%,title.ilike.%4x4%,description.ilike.%4x4%,description.ilike.%off-road%')
        .order('start_date')
        .limit(4);
      
      if (error) throw error;
      return data as Event[];
    },
  });

  const getDifficultyColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-orange-500';
      case 'professional': return 'bg-red-500';
      default: return 'bg-primary';
    }
  };

  const getEventImage = (event: Event, index: number) => {
    // Use event's image_url if available, otherwise use local images
    if (event.image_url && !event.image_url.includes('placeholder')) {
      return event.image_url;
    }
    return eventImages[index % eventImages.length];
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-3 text-primary border-primary/20 bg-primary/5 text-xs font-medium">
            4x4 Rally Events
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Upcoming <span className="text-primary">Rally Events</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Join thrilling 4x4 adventures and compete with fellow off-road enthusiasts
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-lg h-64" />
              </div>
            ))}
          </div>
        ) : upcomingEvents && upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {upcomingEvents.map((event, index) => (
              <Card key={event.id} className="group bg-background border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                {/* Event Image */}
                <div className="relative overflow-hidden aspect-[4/3] bg-muted/10">
                  <img 
                    src={getEventImage(event, index)} 
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      console.error('Event image loading error for:', event.title);
                      e.currentTarget.src = eventImages[index % eventImages.length];
                    }}
                  />
                  
                  {/* Difficulty Badge */}
                  <Badge 
                    className={`absolute top-2 left-2 ${getDifficultyColor(event.difficulty_level)} text-white border-0 text-xs font-medium`}
                  >
                    {event.difficulty_level || 'Open'}
                  </Badge>

                  {/* Event Type */}
                  <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm rounded-md px-2 py-1">
                    <span className="text-xs font-semibold text-primary">{event.event_type}</span>
                  </div>
                </div>

                <CardContent className="p-4">
                  {/* Event Info */}
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                      {event.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                      {event.description}
                    </p>
                  </div>

                  {/* Event Details */}
                  <div className="space-y-2 mb-4 text-xs">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-primary" />
                      <span className="font-medium">
                        {event.start_date && format(new Date(event.start_date), 'MMM dd, yyyy')}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-primary" />
                      <span className="font-medium">{event.location}, {event.country}</span>
                    </div>
                    {event.current_participants && event.max_participants && (
                      <div className="flex items-center gap-1">
                        <Trophy className="h-3 w-3 text-primary" />
                        <span className="font-medium">
                          {event.current_participants}/{event.max_participants} participants
                        </span>
                      </div>
                    )}
                  </div>

                  {/* View Details Button */}
                  <Link to={`/event/${event.id}`}>
                    <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-xs h-8">
                      <Flag className="h-3 w-3 mr-1" />
                      Join Event
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 mb-8">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No upcoming events</h3>
            <p className="text-muted-foreground text-sm">Check back soon for new rally events and competitions.</p>
          </div>
        )}

        {/* View All Events Button */}
        <div className="text-center">
          <Link to="/clubs-events">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Trophy className="w-4 h-4 mr-2" />
              View All Rally Events
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ClubsEventsSection;