import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

// Hero background images
import heroModern1 from '@/assets/hero-modern-1.jpg';
import heroModern2 from '@/assets/hero-modern-2.jpg';
import heroModern3 from '@/assets/hero-modern-3.jpg';

const heroSlides = [
  {
    image: heroModern1,
    title: 'CONQUER ANY TERRAIN',
    subtitle: 'Built for adventure. Designed for performance.',
    cta: { label: 'EXPLORE VEHICLES', href: '/vehicles' }
  },
  {
    image: heroModern2,
    title: 'FIND YOUR TRAIL',
    subtitle: 'Discover epic off-road destinations across the country.',
    cta: { label: 'VIEW TRAILS', href: '/trails' }
  },
  {
    image: heroModern3,
    title: 'BUILD YOUR RIG',
    subtitle: 'Customize your perfect off-road machine.',
    cta: { label: 'START BUILDING', href: '/build' }
  }
];

const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % heroSlides.length);
  }, []);

  // Auto-rotate slides
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(goToNext, 6000);
    return () => clearInterval(timer);
  }, [isPlaying, goToNext]);

  const currentSlide = heroSlides[currentIndex];

  return (
    <section className="relative w-full h-[80vh] min-h-[500px] max-h-[800px] overflow-hidden">
      {/* Background Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${currentSlide.image})` }}
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full container mx-auto px-4 flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl text-white"
          >
            <h1 className="font-display text-5xl md:text-7xl font-bold mb-4 tracking-tight text-white">
              {currentSlide.title}
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white/90">
              {currentSlide.subtitle}
            </p>
            <Link to={currentSlide.cta.href}>
              <Button 
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-display font-semibold tracking-wide px-8 py-6 text-base"
              >
                {currentSlide.cta.label}
              </Button>
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 p-3 text-white/80 hover:text-white transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-10 h-10 md:w-14 md:h-14" strokeWidth={1} />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 p-3 text-white/80 hover:text-white transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="w-10 h-10 md:w-14 md:h-14" strokeWidth={1} />
      </button>

      {/* Bottom Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4">
        {/* Dot Indicators */}
        <div className="flex gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-white scale-110'
                  : 'bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Play/Pause Button */}
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="absolute top-4 right-4 z-20 p-2 bg-black/30 hover:bg-black/50 text-white transition-colors"
        aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
      >
        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
      </button>
    </section>
  );
};

export default HeroSection;