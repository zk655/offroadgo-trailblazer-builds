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

// Default background images
import heroOffroad1 from '@/assets/hero-offroad-1.jpg';
import heroOffroad2 from '@/assets/hero-offroad-2.jpg';
import heroOffroad3 from '@/assets/hero-offroad-3.jpg';

const default4x4Images = [heroOffroad1, heroOffroad2, heroOffroad3];

const PageHero = ({ 
  title, 
  subtitle, 
  icon: Icon, 
  backgroundImages = default4x4Images,
  autoRotate = true 
}: PageHeroProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!autoRotate || backgroundImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [autoRotate, backgroundImages.length]);

  return (
    <section className="relative h-[50vh] min-h-[350px] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImageIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImages[currentImageIndex]})` }}
        />
      </AnimatePresence>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl text-white"
        >
          <Icon className="w-10 h-10 mb-4 text-accent" />
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight text-white">
            {title}
          </h1>
          <p className="text-lg text-white/80">
            {subtitle}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PageHero;