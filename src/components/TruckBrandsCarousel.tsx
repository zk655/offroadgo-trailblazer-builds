import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight, Car, DollarSign, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import VehicleSearchBar from './VehicleSearchBar';
import { brandsData, BrandData, VehicleCategory } from '@/data/vehicleData';
import { ScrollArea } from '@/components/ui/scroll-area';

const TruckBrandsCarousel = () => {
  const [selectedBrand, setSelectedBrand] = useState<BrandData | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const scrollLeft = () => {
    setScrollPosition(Math.max(0, scrollPosition - 200));
  };

  const scrollRight = () => {
    setScrollPosition(scrollPosition + 200);
  };

  const toggleCategory = (categoryName: string) => {
    setExpandedCategory(expandedCategory === categoryName ? null : categoryName);
  };

  const formatPrice = (price: string) => {
    return price.replace('$', '').replace('*', '');
  };

  return (
    <section className="py-6 bg-nav-dark border-b border-border/30">
      <div className="container mx-auto px-4">
        {/* Search Bar */}
        <VehicleSearchBar />
        
        {/* Section Title */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px flex-1 max-w-16 bg-gradient-to-r from-transparent to-accent/50" />
          <h2 className="text-center font-display text-lg md:text-xl font-bold text-foreground tracking-wider uppercase">
            Top Offroad Trucks
          </h2>
          <div className="h-px flex-1 max-w-16 bg-gradient-to-l from-transparent to-accent/50" />
        </div>
        
        {/* Circular Brand Selector */}
        <div className="relative">
          {/* Scroll Buttons */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-card/90 hover:bg-card p-2 rounded-full shadow-lg transition-all border border-border/50"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-card/90 hover:bg-card p-2 rounded-full shadow-lg transition-all border border-border/50"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>

          {/* Brand Circles Container */}
          <div className="overflow-hidden mx-10">
            <motion.div
              className="flex gap-3 md:gap-5 justify-center py-3"
              animate={{ x: -scrollPosition }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {brandsData.map((brand) => (
                <motion.button
                  key={brand.id}
                  onClick={() => {
                    setSelectedBrand(selectedBrand?.id === brand.id ? null : brand);
                    setExpandedCategory(null);
                  }}
                  className={`flex-shrink-0 flex flex-col items-center gap-1.5 group transition-all ${
                    selectedBrand?.id === brand.id ? 'scale-105' : ''
                  }`}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div
                    className={`w-14 h-14 md:w-[4.5rem] md:h-[4.5rem] rounded-full overflow-hidden border-2 transition-all shadow-md ${
                      selectedBrand?.id === brand.id
                        ? 'border-accent ring-2 ring-accent/40 shadow-accent/20 shadow-lg'
                        : 'border-border/60 group-hover:border-accent/60'
                    }`}
                  >
                    <img
                      src={brand.image}
                      alt={brand.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className={`text-[10px] md:text-xs font-bold tracking-wider transition-colors ${
                    selectedBrand?.id === brand.id ? 'text-accent' : 'text-muted-foreground group-hover:text-accent'
                  }`}>
                    {brand.shortName}
                  </span>
                </motion.button>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Brand Details Panel */}
        <AnimatePresence>
          {selectedBrand && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="mt-4 overflow-hidden"
            >
              <div className="bg-card/95 backdrop-blur-sm rounded-xl border border-border/50 p-4 md:p-6 relative shadow-xl">
                {/* Close Button */}
                <button
                  onClick={() => setSelectedBrand(null)}
                  className="absolute top-3 right-3 p-1.5 hover:bg-muted rounded-full transition-colors z-10"
                  aria-label="Close panel"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>

                {/* Brand Header */}
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border/30">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-accent shadow-md flex-shrink-0">
                    <img
                      src={selectedBrand.image}
                      alt={selectedBrand.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-foreground">
                      {selectedBrand.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {selectedBrand.categories.length} Vehicle Lines • {selectedBrand.categories.reduce((acc, cat) => acc + cat.models.length, 0)} Models
                    </p>
                  </div>
                </div>

                {/* Vehicle Categories Grid */}
                <ScrollArea className="max-h-[400px] pr-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {selectedBrand.categories.map((category) => (
                      <div
                        key={category.name}
                        className="bg-muted/30 rounded-lg border border-border/30 overflow-hidden"
                      >
                        {/* Category Header */}
                        <button
                          onClick={() => toggleCategory(category.name)}
                          className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                              <Car className="w-3.5 h-3.5 text-accent" />
                            </span>
                            <div className="text-left">
                              <p className="font-semibold text-sm text-foreground">{category.name}</p>
                              <p className="text-[10px] text-muted-foreground">{category.models.length} trims available</p>
                            </div>
                          </div>
                          {expandedCategory === category.name ? (
                            <ChevronUp className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                          )}
                        </button>

                        {/* Models List */}
                        <AnimatePresence>
                          {expandedCategory === category.name && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="border-t border-border/30"
                            >
                              <div className="max-h-48 overflow-y-auto">
                                {category.models.map((model, idx) => (
                                  <Link
                                    key={idx}
                                    to="/vehicles"
                                    className="flex items-center justify-between p-2.5 hover:bg-muted/50 transition-colors border-b border-border/20 last:border-b-0"
                                  >
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-medium text-foreground truncate">
                                        {model.trim}
                                      </p>
                                      {model.engine && (
                                        <p className="text-[10px] text-muted-foreground truncate flex items-center gap-1">
                                          <Zap className="w-2.5 h-2.5" />
                                          {model.engine}
                                        </p>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-1 text-accent font-semibold text-xs flex-shrink-0 ml-2">
                                      <DollarSign className="w-3 h-3" />
                                      {formatPrice(model.price)}
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Insurance Info Footer */}
                <div className="mt-4 pt-3 border-t border-border/30">
                  <p className="text-xs text-muted-foreground mb-2">
                    💡 {selectedBrand.insuranceInfo}
                  </p>
                  <Link
                    to="/insurance"
                    className="text-sm text-accent hover:underline font-medium inline-flex items-center gap-1"
                  >
                    Get Insurance Quotes →
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default TruckBrandsCarousel;
