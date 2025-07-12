import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Search } from 'lucide-react';
import heroImage1 from '@/assets/hero-modern-1.jpg';
import heroImage2 from '@/assets/hero-modern-2.jpg';
import heroImage3 from '@/assets/hero-modern-3.jpg';

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const heroImages = [heroImage1, heroImage2, heroImage3];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Images with Rotation */}
      {heroImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={image}
            alt={`Off-road adventure ${index + 1}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/30 to-background/80" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-card/80 backdrop-blur-sm border border-border">
            <span className="text-sm font-medium text-muted-foreground">
              🏔️ The Ultimate Off-Road Platform
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
            Build, Compare &{' '}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Explore
            </span>{' '}
            Your Next Adventure
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            From vehicle comparisons to trail planning, OffRoadGo is your complete toolkit 
            for off-road adventures. Build custom mods, discover epic trails, and join a 
            community of passionate explorers.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="hero" size="lg" className="group">
              Start Exploring
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button variant="adventure" size="lg" className="group">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>

          {/* Search Bar */}
          <div className="mt-12 max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search vehicles, trails, or mods..."
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-card/80 backdrop-blur-sm border border-border focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
              />
            </div>
          </div>
        </div>

        {/* Image Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-smooth ${
                index === currentImageIndex
                  ? 'bg-primary shadow-glow'
                  : 'bg-muted hover:bg-muted-foreground'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;