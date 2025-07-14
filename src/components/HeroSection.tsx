import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Search, MapPin, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import heroImage1 from '@/assets/hero-modern-1.jpg';
import heroImage2 from '@/assets/hero-modern-2.jpg';
import heroImage3 from '@/assets/hero-modern-3.jpg';
const heroImage4 = '/lovable-uploads/5cbd8c63-ddc0-41d6-90e4-247c610f2c46.png';

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('explore');
  const heroImages = [heroImage1, heroImage2, heroImage3, heroImage4];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Background Images with Rotation */}
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div 
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/60 to-background/30" />
          </div>
        ))}
        
        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-0.5 bg-gradient-primary"></div>
                <span className="text-primary font-semibold uppercase tracking-[0.2em] text-sm">
                  EXPLORE THE UNKNOWN
                </span>
                <div className="w-12 h-0.5 bg-gradient-primary"></div>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-[0.9] mb-6 md:mb-8">
                <span className="block">Adventure</span>
                <span className="block text-primary">Without</span>
                <span className="block">Limits</span>
              </h1>

              {/* Subheadline */}
              <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-xl leading-relaxed mb-6 md:mb-8 font-medium">
                Push boundaries. Conquer terrain. Create memories that last forever with our premium 4x4 experience.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                <Button size="lg" className="premium-gradient text-white hover:shadow-glow hover-lift border-0 h-12 md:h-14 px-6 md:px-8 text-base md:text-lg font-semibold">
                  Start Your Journey
                </Button>
                
                <Button variant="outline" size="lg" className="glass-effect text-foreground hover:bg-primary hover:text-white h-12 md:h-14 px-6 md:px-8 text-base md:text-lg font-semibold border-2">
                  Explore Vehicles
                </Button>
              </div>
            </div>

            {/* Right side - Image indicators moved here */}
            <div className="relative flex justify-center lg:justify-end items-center">
              <div className="flex flex-col space-y-4 glass-effect p-4 rounded-xl">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-12 rounded-full transition-all duration-500 ${
                      index === currentImageIndex
                        ? 'bg-gradient-primary shadow-glow scale-110'
                        : 'bg-muted hover:bg-primary/50'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Booking Section */}
      <section className="relative -mt-32 z-20 pb-20">
        <div className="container mx-auto px-4">
          <div className="glass-effect rounded-2xl p-8 max-w-6xl mx-auto border border-border/20 shadow-premium">
            {/* Tabs */}
            <div className="flex mb-8 p-1 glass-effect rounded-xl w-fit">
              <button
                onClick={() => setActiveTab('explore')}
                className={`px-8 py-4 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === 'explore'
                    ? 'premium-gradient text-white shadow-glow'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                🗺️ Explore Trails
              </button>
              <button
                onClick={() => setActiveTab('build')}
                className={`px-8 py-4 rounded-lg font-semibold transition-all duration-300 ${
                  activeTab === 'build'
                    ? 'premium-gradient text-white shadow-glow'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                🔧 Custom Build
              </button>
            </div>

            {/* Modern Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <div className="space-y-3">
                <label className="text-xs md:text-sm font-semibold text-foreground uppercase tracking-wide">
                  {activeTab === 'explore' ? '📍 Destination' : '🚗 Vehicle'}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-primary" />
                  <input
                    type="text"
                    placeholder={activeTab === 'explore' ? 'Where to explore?' : 'Choose your ride'}
                    className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-3 md:py-4 rounded-xl glass-effect focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-base md:text-lg font-medium"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs md:text-sm font-semibold text-foreground uppercase tracking-wide">
                  {activeTab === 'explore' ? '📅 When' : '💰 Budget'}
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-primary" />
                  <input
                    type="text"
                    placeholder={activeTab === 'explore' ? 'Pick a date' : 'Set your range'}
                    className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-3 md:py-4 rounded-xl glass-effect focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-base md:text-lg font-medium"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs md:text-sm font-semibold text-foreground uppercase tracking-wide">
                  {activeTab === 'explore' ? '⚡ Level' : '🔧 Mods'}
                </label>
                <div className="relative">
                  <Search className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-primary" />
                  <input
                    type="text"
                    placeholder={activeTab === 'explore' ? 'Difficulty' : 'Modifications'}
                    className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-3 md:py-4 rounded-xl glass-effect focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-base md:text-lg font-medium"
                  />
                </div>
              </div>

              <div className="flex items-end sm:col-span-2 lg:col-span-1">
                <Button className="w-full premium-gradient text-white hover:shadow-glow hover-lift py-3 md:py-4 text-base md:text-lg font-bold border-0 rounded-xl">
                  {activeTab === 'explore' ? '🚀 Let\'s Go!' : '⚡ Build It!'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;