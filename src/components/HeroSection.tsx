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
            <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-background/20" />
          </div>
        ))}
        
        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Badge */}
              <div className="flex items-center gap-4">
                <ChevronLeft className="text-primary h-6 w-6" />
                <span className="text-primary font-medium uppercase tracking-wide text-sm">
                  EXPLORE THE TRAILS
                </span>
                <ChevronRight className="text-primary h-6 w-6" />
              </div>

              {/* Main Headline */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Explore{' '}
                <span className="text-primary">with Confidence.</span>
                <br />
                Adventure{' '}
                <span className="text-primary">with Trust.</span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
                Whether you're hitting the trails or planning your next build, we've got you covered. From reliable 
                vehicle guides to expert modifications, our all-in-one platform is built for adventure, trust, and exploration. 
                Plan your journey in just a few clicks — no delays, no worries.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                  Our Services
                </Button>
                
                <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-white">
                  View Our Fleet
                </Button>
              </div>
            </div>

            {/* Right side - Image indicators moved here */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="flex space-x-3">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-4 h-4 rounded-full transition-all duration-300 ${
                      index === currentImageIndex
                        ? 'bg-primary shadow-lg scale-110'
                        : 'bg-white/50 hover:bg-white/70'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking/Planning Section */}
      <section className="relative -mt-20 z-10">
        <div className="container mx-auto px-4">
          <div className="bg-card rounded-lg shadow-card p-8 max-w-4xl mx-auto">
            {/* Tabs */}
            <div className="flex mb-6">
              <button
                onClick={() => setActiveTab('explore')}
                className={`px-6 py-3 rounded-l-lg font-medium transition-colors ${
                  activeTab === 'explore'
                    ? 'bg-primary text-white'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                Explore Trails
              </button>
              <button
                onClick={() => setActiveTab('build')}
                className={`px-6 py-3 rounded-r-lg font-medium transition-colors ${
                  activeTab === 'build'
                    ? 'bg-primary text-white'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                Plan Your Build
              </button>
            </div>

            {/* Form Content */}
            <div className="grid md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {activeTab === 'explore' ? 'Trail Location' : 'Vehicle Type'}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder={activeTab === 'explore' ? 'Search a location' : 'Select vehicle type'}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {activeTab === 'explore' ? 'Start Date' : 'Budget Range'}
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder={activeTab === 'explore' ? '24/12/2024' : '$5,000 - $15,000'}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {activeTab === 'explore' ? 'Difficulty Level' : 'Modification Type'}
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder={activeTab === 'explore' ? 'Select difficulty' : 'Select mods'}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-end">
                <Button className="w-full bg-primary hover:bg-primary/90 text-white py-3">
                  {activeTab === 'explore' ? 'Find Trails' : 'Build Now'}
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