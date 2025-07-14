import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Mountain, 
  Settings, 
  MapPin, 
  Camera, 
  Users, 
  Route,
  ArrowRight 
} from 'lucide-react';

const features = [
  {
    icon: Mountain,
    title: 'Epic Trails',
    description: 'Discover hand-picked off-road adventures with detailed maps, difficulty ratings, and GPS coordinates.',
    color: 'text-primary',
    bgGradient: 'from-primary/10 to-primary/5',
    href: '/trails'
  },
  {
    icon: Settings,
    title: 'Build Planner',
    description: 'Design your dream off-road vehicle with our comprehensive mod calculator and compatibility checker.',
    color: 'text-accent',
    bgGradient: 'from-accent/10 to-accent/5',
    href: '/build'
  },
  {
    icon: MapPin,
    title: 'Trail Finder',
    description: 'Find nearby trails based on your location, skill level, and vehicle capabilities.',
    color: 'text-primary',
    bgGradient: 'from-primary/10 to-primary/5',
    href: '/trails'
  },
  {
    icon: Camera,
    title: 'Adventure Gallery',
    description: 'Share your epic moments and get inspired by the off-road community\'s best shots.',
    color: 'text-accent',
    bgGradient: 'from-accent/10 to-accent/5',
    href: '/gallery'
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Connect with fellow adventurers, share build tips, and plan group expeditions.',
    color: 'text-primary',
    bgGradient: 'from-primary/10 to-primary/5',
    href: '/blog'
  },
  {
    icon: Route,
    title: 'Trip Planner',
    description: 'Plan multi-day adventures with waypoints, camping spots, and fuel stops.',
    color: 'text-accent',
    bgGradient: 'from-accent/10 to-accent/5',
    href: '/trip-planner'
  }
];

const FeatureCards = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.8
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1] as const
      }
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
            Your Off-Road <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Journey</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Everything you need to plan, build, and conquer the world's most challenging terrain
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div 
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={cardVariants}
              whileHover={{ 
                y: -8, 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
            >
              <Card className="adventure-card h-full group cursor-pointer">
                <CardHeader className="pb-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.bgGradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl font-heading font-bold group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between group-hover:bg-primary/10 transition-all duration-300"
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Button size="lg" className="adventure-button text-lg px-8 py-4">
            Start Your Adventure
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureCards;