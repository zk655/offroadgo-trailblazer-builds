import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  MapPin, 
  Users, 
  Calendar, 
  Compass, 
  Mountain, 
  Settings, 
  Camera,
  Route,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SEOHead from '@/components/SEOHead';

const AdventureStart = () => {
  const adventureTypes = [
    {
      icon: Mountain,
      title: 'Trail Explorer',
      description: 'Discover new trails and test your skills on challenging terrain',
      features: ['GPS Navigation', 'Trail Ratings', 'Community Reviews'],
      action: 'Find Trails',
      href: '/trails',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      icon: Settings,
      title: 'Build Master',
      description: 'Design and customize your perfect off-road vehicle',
      features: ['Mod Calculator', 'Compatibility Check', 'Budget Planner'],
      action: 'Start Building',
      href: '/build',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      icon: Users,
      title: 'Community Leader',
      description: 'Connect with fellow adventurers and share experiences',
      features: ['Group Events', 'Photo Sharing', 'Expert Tips'],
      action: 'Join Community',
      href: '/blog',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10'
    }
  ];

  const quickActions = [
    {
      icon: MapPin,
      title: 'Find Nearby Trails',
      description: 'Discover trails within 50 miles of your location',
      href: '/trails'
    },
    {
      icon: Camera,
      title: 'Share Your Adventure',
      description: 'Upload photos and stories from your latest trip',
      href: '/blog'
    },
    {
      icon: Route,
      title: 'Plan Your Route',
      description: 'Create multi-day adventures with waypoints',
      href: '/trails'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Start Your Off-Road Adventure - Choose Your Path"
        description="Begin your epic off-road journey. Choose your adventure style - trail explorer, build master, or community leader. Start your 4x4 adventure today."
        keywords="start off-road adventure, 4x4 journey, trail explorer, off-road community, adventure planning, outdoor activities"
        url="/adventure-start"
        type="website"
        image="/src/assets/hero-offroad-2.jpg"
      />
      <Navigation />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6">
                Start Your{' '}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Adventure
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Choose your path and begin an epic off-road journey filled with discovery, challenge, and unforgettable experiences.
              </p>
              <Badge variant="secondary" className="mb-8">
                <Star className="w-4 h-4 mr-1" />
                Over 10,000 adventures started
              </Badge>
            </div>
          </div>
        </section>

        {/* Adventure Types */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                Choose Your Adventure Style
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Whether you're a trail explorer, vehicle builder, or community enthusiast, we have the perfect starting point for you.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {adventureTypes.map((type, index) => (
                <Card key={index} className="adventure-card h-full group cursor-pointer hover:shadow-lg transition-all duration-300">
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 rounded-full ${type.bgColor} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <type.icon className={`w-8 h-8 ${type.color}`} />
                    </div>
                    <CardTitle className="text-xl font-heading font-bold">
                      {type.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center space-y-4">
                    <p className="text-muted-foreground">
                      {type.description}
                    </p>
                    
                    <div className="space-y-2">
                      {type.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center justify-center gap-2 text-sm">
                          <Star className="w-3 h-3 text-primary" />
                          {feature}
                        </div>
                      ))}
                    </div>

                    <Link to={type.href}>
                      <Button className="w-full mt-4 group">
                        {type.action}
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                Quick Actions
              </h2>
              <p className="text-lg text-muted-foreground">
                Jump straight into action with these popular features
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {quickActions.map((action, index) => (
                <Link key={index} to={action.href}>
                  <Card className="adventure-card h-full group cursor-pointer hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <action.icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                        {action.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {action.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* CTA */}
            <div className="text-center">
              <Card className="max-w-2xl mx-auto">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-heading font-bold mb-4">
                    Ready to Begin?
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Join thousands of off-road enthusiasts who have already started their adventure with OffRoadGo.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/trails">
                      <Button size="lg" className="bg-primary hover:bg-primary/90">
                        <Compass className="w-5 h-5 mr-2" />
                        Explore Trails
                      </Button>
                    </Link>
                    <Link to="/vehicles">
                      <Button size="lg" variant="outline">
                        <Settings className="w-5 h-5 mr-2" />
                        Browse Vehicles
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AdventureStart;