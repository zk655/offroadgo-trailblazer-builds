import { Button } from '@/components/ui/button';
import { ArrowRight, MapPin, ShoppingCart, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import offroadBg2 from '@/assets/offroad-bg-2.jpg';

const CTASection = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${offroadBg2})` }}
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 tracking-tight">
          START YOUR ADVENTURE
        </h2>
        <p className="text-lg text-white/80 mb-10 max-w-xl mx-auto">
          Whether you're building your dream rig or hitting the trails, we've got you covered.
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <Link to="/trails">
            <Button 
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-display font-semibold tracking-wide px-8"
            >
              <MapPin className="w-4 h-4 mr-2" />
              FIND A TRAIL
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link to="/build">
            <Button 
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 font-display font-semibold tracking-wide px-8"
            >
              <Wrench className="w-4 h-4 mr-2" />
              BUILD & PRICE
            </Button>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 max-w-4xl mx-auto">
          <Link 
            to="/vehicles" 
            className="bg-black/40 hover:bg-black/60 transition-colors p-6 text-center group"
          >
            <h3 className="font-display text-lg font-semibold mb-2 group-hover:text-accent transition-colors">
              BROWSE VEHICLES
            </h3>
            <p className="text-sm text-white/60">
              Explore our complete lineup of off-road capable vehicles
            </p>
          </Link>
          <Link 
            to="/products" 
            className="bg-black/40 hover:bg-black/60 transition-colors p-6 text-center group"
          >
            <h3 className="font-display text-lg font-semibold mb-2 group-hover:text-accent transition-colors">
              SHOP PARTS
            </h3>
            <p className="text-sm text-white/60">
              Premium parts and accessories for your build
            </p>
          </Link>
          <Link 
            to="/clubs-events" 
            className="bg-black/40 hover:bg-black/60 transition-colors p-6 text-center group"
          >
            <h3 className="font-display text-lg font-semibold mb-2 group-hover:text-accent transition-colors">
              JOIN EVENTS
            </h3>
            <p className="text-sm text-white/60">
              Connect with the off-road community
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;