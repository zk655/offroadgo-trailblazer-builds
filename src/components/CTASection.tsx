import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Compass, Users, Zap } from 'lucide-react';
import offroadBg2 from '@/assets/offroad-bg-2.jpg';

const CTASection = () => {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* 4x4 Background */}
      <div className="absolute inset-0">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${offroadBg2})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/95" />
      </div>
      
      <div className="relative z-10 container mx-auto px-4">
        {/* Main CTA */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold mb-4 md:mb-6">
            Ready to Start Your{' '}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Adventure?
            </span>
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto px-4">
            Join thousands of off-road enthusiasts who trust OffRoadGo for their next adventure.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center max-w-md sm:max-w-none mx-auto">
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 py-2 group">
              <Compass className="mr-2 h-4 w-4" />
              Explore Trails Now
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="sm" className="font-medium px-6 py-2">
              <Users className="mr-2 h-4 w-4" />
              Join Community
            </Button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <Card className="glass-effect border-border/50 hover:shadow-card transition-smooth bg-card/80 backdrop-blur-sm">
            <CardContent className="p-4 md:p-6 text-center">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Zap className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-sm md:text-base text-muted-foreground">
                Instant vehicle comparisons and trail searches powered by optimized data.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-border/50 hover:shadow-card transition-smooth bg-card/80 backdrop-blur-sm">
            <CardContent className="p-4 md:p-6 text-center">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Users className="h-5 w-5 md:h-6 md:w-6 text-accent" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Community Driven</h3>
              <p className="text-sm md:text-base text-muted-foreground">
                Real reviews and insights from experienced off-road adventurers.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-effect border-border/50 hover:shadow-card transition-smooth bg-card/80 backdrop-blur-sm">
            <CardContent className="p-4 md:p-6 text-center">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Compass className="h-5 w-5 md:h-6 md:w-6 text-secondary" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Always Updated</h3>
              <p className="text-sm md:text-base text-muted-foreground">
                Latest trail conditions, vehicle specs, and mod pricing in real-time.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CTASection;