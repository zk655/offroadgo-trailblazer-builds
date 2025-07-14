import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface PageHeroProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  backgroundImages?: string[];
  autoRotate?: boolean;
}

// Default 4x4 background images - using imported assets
import heroOffroad1 from '@/assets/hero-offroad-1.jpg';
import heroOffroad2 from '@/assets/hero-offroad-2.jpg';
import heroOffroad3 from '@/assets/hero-offroad-3.jpg';

const default4x4Images = [
  heroOffroad1,
  heroOffroad2,
  heroOffroad3
];

const PageHero = ({ 
  title, 
  subtitle, 
  icon: Icon, 
  backgroundImages = default4x4Images,
  autoRotate = true 
}: PageHeroProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-rotate background images
  useEffect(() => {
    if (!autoRotate || backgroundImages.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [autoRotate, backgroundImages.length]);

  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden mt-16">
      {/* Background Image Carousel */}
      {backgroundImages.length > 0 && (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${backgroundImages[currentImageIndex]})` }}
          />
        </AnimatePresence>
      )}

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20" />

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-6"
          >
            <Icon className="mx-auto h-16 w-16" />
          </motion.div>

          {/* Title */}
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {title}
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            className="text-lg md:text-xl lg:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {subtitle}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default PageHero;