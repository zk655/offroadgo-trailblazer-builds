import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  Mountain, 
  Settings, 
  MapPin, 
  Wrench, 
  Users, 
  ShieldCheck,
  ArrowRight 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: Mountain,
    title: 'TRAIL GUIDE',
    description: 'Discover hand-picked off-road trails with detailed difficulty ratings and GPS coordinates.',
    href: '/trails'
  },
  {
    icon: Settings,
    title: 'BUILD & PRICE',
    description: 'Design your dream off-road vehicle with our comprehensive build calculator.',
    href: '/build'
  },
  {
    icon: MapPin,
    title: 'FIND A TRAIL',
    description: 'Locate nearby trails based on your skill level and vehicle capabilities.',
    href: '/trails'
  },
  {
    icon: Wrench,
    title: 'PARTS & ACCESSORIES',
    description: 'Shop premium off-road parts, accessories, and performance upgrades.',
    href: '/products'
  },
  {
    icon: Users,
    title: 'COMMUNITY',
    description: 'Connect with fellow adventurers, share tips, and join group expeditions.',
    href: '/clubs-events'
  },
  {
    icon: ShieldCheck,
    title: 'INSURANCE',
    description: 'Protect your investment with specialized off-road vehicle coverage.',
    href: '/insurance'
  }
];

const FeatureCards = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4 tracking-tight">
            EVERYTHING YOU NEED
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Tools and resources to plan, build, and conquer any terrain
          </p>
        </motion.div>

        {/* Feature Grid */}
        <motion.div 
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {features.map((feature, index) => (
            <Link
              key={feature.title}
              to={feature.href}
              className="group bg-background p-8 hover:bg-muted transition-colors"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <feature.icon className="w-8 h-8 mb-4 text-foreground group-hover:text-accent transition-colors" />
                <h3 className="font-display text-lg font-semibold mb-2 tracking-wide group-hover:text-accent transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {feature.description}
                </p>
                <span className="inline-flex items-center text-sm font-medium text-foreground group-hover:text-accent transition-colors">
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureCards;