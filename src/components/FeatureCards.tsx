import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  GitCompare, 
  Wrench, 
  Map, 
  BookOpen, 
  Car, 
  Mountain,
  ArrowRight,
  Zap
} from 'lucide-react';

const FeatureCards = () => {
  const features = [
    {
      icon: GitCompare,
      title: 'Compare Vehicles',
      description: 'Side-by-side comparison of off-road specs, performance metrics, and terrain suitability ratings.',
      link: '/compare',
      badge: 'Popular',
      gradient: 'from-primary/20 to-accent/20'
    },
    {
      icon: Wrench,
      title: 'Plan Modifications',
      description: 'Visual mod builder with real pricing, compatibility checks, and performance impact analysis.',
      link: '/build',
      badge: 'New',
      gradient: 'from-accent/20 to-secondary/20'
    },
    {
      icon: Map,
      title: 'Explore Trails',
      description: 'Interactive trail maps with difficulty ratings, terrain types, and community reviews.',
      link: '/trails',
      badge: 'Featured',
      gradient: 'from-secondary/20 to-primary/20'
    },
    {
      icon: BookOpen,
      title: 'Read Blog',
      description: 'Latest off-road news, vehicle reviews, modification guides, and adventure stories.',
      link: '/blog',
      badge: null,
      gradient: 'from-muted/20 to-accent/20'
    }
  ];

  const stats = [
    { icon: Car, label: 'Vehicles', value: '500+' },
    { icon: Mountain, label: 'Trails', value: '1,200+' },
    { icon: Wrench, label: 'Mods', value: '2,500+' },
    { icon: Zap, label: 'Builds', value: '850+' }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need for{' '}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Off-Road Adventures
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive tools and resources for planning, building, and exploring the great outdoors.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="group relative overflow-hidden bg-gradient-card border-border/50 hover:shadow-card hover:scale-105 transition-bounce">
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-smooth`} />
              
              {/* Badge */}
              {feature.badge && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="px-2 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                    {feature.badge}
                  </span>
                </div>
              )}

              <CardHeader className="relative z-10">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-smooth">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="relative z-10">
                <Button 
                  variant="ghost" 
                  className="w-full justify-between group-hover:text-primary transition-smooth"
                  asChild
                >
                  <a href={feature.link}>
                    Get Started
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-smooth">
                <stat.icon className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;