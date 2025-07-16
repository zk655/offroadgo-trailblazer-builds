import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, ArrowRight, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

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
}

const ClubsEventsSection = () => {
  const { data: upcomingEvents, isLoading } = useQuery({
    queryKey: ['upcoming-4x4-events-preview'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('start_date', new Date().toISOString())
        .or('terrain_type.ilike.%4x4%,event_type.ilike.%4x4%,title.ilike.%4x4%,description.ilike.%4x4%')
        .order('start_date')
        .limit(4);
      
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

  return (
    <section className="py-24 bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 dark:from-orange-950/20 dark:via-red-950/20 dark:to-yellow-950/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/src/assets/rally-event-1.jpg')] bg-cover bg-center opacity-5" />
      <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 via-red-600/10 to-yellow-600/20" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-600 to-red-700 rounded-full mb-8 shadow-xl">
            <Calendar className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-orange-600 via-red-600 to-yellow-600 bg-clip-text text-transparent">
            4x4 Rally Events
          </h2>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Experience the ultimate 4x4 adventures. Join professional rally events, tackle challenging terrains, 
            and compete with fellow off-road enthusiasts in thrilling competitions worldwide.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-xl h-80" />
              </div>
            ))}
          </div>
        ) : upcomingEvents && upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {upcomingEvents.map((event) => (
              <Link to={`/event/${event.id}`} key={event.id}>
                <Card className="group hover:shadow-2xl hover:scale-105 transition-all duration-500 border-0 bg-card/80 backdrop-blur-sm overflow-hidden cursor-pointer">
                {event.image_url && (
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={event.image_url} 
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4">
                      <Badge className={`${getDifficultyColor(event.difficulty_level)} text-white border-0`}>
                        {event.difficulty_level || 'Open'}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-bold text-lg line-clamp-2">{event.title}</h3>
                    </div>
                  </div>
                )}
                
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-2" />
                      {event.start_date && format(new Date(event.start_date), 'MMM dd, yyyy')}
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2" />
                      {event.location}, {event.country}
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        <Trophy className="w-3 h-3 mr-1" />
                        {event.event_type}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {event.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 mb-12">
            <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No upcoming events</h3>
            <p className="text-muted-foreground">Check back soon for new rally events and competitions.</p>
          </div>
        )}

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-orange-600/10 via-red-600/5 to-yellow-600/10 rounded-2xl p-8 md:p-12 text-center border border-orange-200/20 dark:border-orange-800/20">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Join the Adventure?
            </h3>
            <p className="text-lg text-muted-foreground mb-8">
              Discover rally clubs worldwide, register for upcoming events, and connect with fellow off-road enthusiasts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-orange-600 to-red-700 hover:shadow-lg transition-all">
                <Link to="/clubs-events">
                  <Users className="w-5 h-5 mr-2" />
                  Explore 4x4 Events
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white">
                <Link to="/clubs-events">
                  View All Events
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClubsEventsSection;