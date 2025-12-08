import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X, Play, FileText, Shield, ChevronLeft, ChevronRight } from 'lucide-react';

// Import truck images
import fordBroncoImg from '@/assets/vehicles/ford-bronco-wildtrak.jpg';
import jeepWranglerImg from '@/assets/vehicles/jeep-wrangler-rubicon.jpg';
import toyota4RunnerImg from '@/assets/vehicles/toyota-4runner-trd-pro.jpg';
import chevyColoradoImg from '@/assets/vehicles/chevy-colorado-zr2.jpg';
import ramTrxImg from '@/assets/vehicles/ram-1500-trx.jpg';
import gmcSierraImg from '@/assets/vehicles/gmc-sierra-at4x.jpg';
import nissanFrontierImg from '@/assets/vehicles/nissan-frontier-pro4x.jpg';
import subaruOutbackImg from '@/assets/vehicles/subaru-outback-wilderness.jpg';

interface TruckBrand {
  id: string;
  name: string;
  shortName: string;
  image: string;
  models: {
    name: string;
    year: string;
    price: string;
    image: string;
  }[];
  blogs: {
    title: string;
    slug: string;
  }[];
  videos: {
    title: string;
    thumbnail: string;
  }[];
  insuranceInfo: string;
}

const truckBrands: TruckBrand[] = [
  {
    id: 'ford',
    name: 'Ford',
    shortName: 'FORD',
    image: fordBroncoImg,
    models: [
      { name: 'Bronco Raptor', year: '2024', price: '$73,000', image: fordBroncoImg },
      { name: 'F-150 Raptor', year: '2024', price: '$76,775', image: fordBroncoImg },
      { name: 'Bronco Wildtrak', year: '2024', price: '$49,595', image: fordBroncoImg },
    ],
    blogs: [
      { title: 'Ford Bronco Raptor: Ultimate Off-Road Beast', slug: 'ford-bronco-raptor' },
      { title: 'F-150 Raptor vs Competition', slug: 'f150-raptor-comparison' },
    ],
    videos: [
      { title: 'Bronco Raptor Desert Run', thumbnail: fordBroncoImg },
    ],
    insuranceInfo: 'Ford off-road vehicles typically cost $150-250/month to insure.',
  },
  {
    id: 'jeep',
    name: 'Jeep',
    shortName: 'JEEP',
    image: jeepWranglerImg,
    models: [
      { name: 'Wrangler Rubicon', year: '2024', price: '$52,000', image: jeepWranglerImg },
      { name: 'Gladiator Mojave', year: '2024', price: '$56,000', image: jeepWranglerImg },
    ],
    blogs: [
      { title: 'Jeep Wrangler Modifications Guide', slug: 'jeep-modifications' },
      { title: 'Best Trails for Jeep Wrangler', slug: 'jeep-trails-guide' },
    ],
    videos: [
      { title: 'Wrangler Rock Crawling', thumbnail: jeepWranglerImg },
    ],
    insuranceInfo: 'Jeep Wrangler insurance averages $130-200/month.',
  },
  {
    id: 'toyota',
    name: 'Toyota',
    shortName: 'TOYOTA',
    image: toyota4RunnerImg,
    models: [
      { name: '4Runner TRD Pro', year: '2024', price: '$58,000', image: toyota4RunnerImg },
      { name: 'Tacoma TRD Pro', year: '2024', price: '$52,000', image: toyota4RunnerImg },
      { name: 'Land Cruiser', year: '2024', price: '$78,000', image: toyota4RunnerImg },
    ],
    blogs: [
      { title: 'Toyota 4Runner: Reliability King', slug: '4runner-reliability' },
    ],
    videos: [
      { title: '4Runner TRD Pro Trail Test', thumbnail: toyota4RunnerImg },
    ],
    insuranceInfo: 'Toyota off-road models average $120-180/month insurance.',
  },
  {
    id: 'chevy',
    name: 'Chevrolet',
    shortName: 'CHEVY',
    image: chevyColoradoImg,
    models: [
      { name: 'Colorado ZR2', year: '2024', price: '$49,000', image: chevyColoradoImg },
      { name: 'Silverado ZR2', year: '2024', price: '$68,000', image: chevyColoradoImg },
    ],
    blogs: [
      { title: 'Colorado ZR2 Bison Edition Review', slug: 'colorado-zr2-bison' },
    ],
    videos: [
      { title: 'ZR2 Desert Racing', thumbnail: chevyColoradoImg },
    ],
    insuranceInfo: 'Chevy trucks typically cost $140-220/month to insure.',
  },
  {
    id: 'ram',
    name: 'RAM',
    shortName: 'RAM',
    image: ramTrxImg,
    models: [
      { name: '1500 TRX', year: '2024', price: '$92,000', image: ramTrxImg },
      { name: '2500 Power Wagon', year: '2024', price: '$75,000', image: ramTrxImg },
    ],
    blogs: [
      { title: 'RAM TRX: The 702HP Monster Truck', slug: 'ram-trx-review' },
    ],
    videos: [
      { title: 'TRX Hellcat Power', thumbnail: ramTrxImg },
    ],
    insuranceInfo: 'RAM TRX insurance is higher at $200-350/month due to power.',
  },
  {
    id: 'gmc',
    name: 'GMC',
    shortName: 'GMC',
    image: gmcSierraImg,
    models: [
      { name: 'Sierra AT4X', year: '2024', price: '$78,000', image: gmcSierraImg },
      { name: 'Canyon AT4X', year: '2024', price: '$58,000', image: gmcSierraImg },
    ],
    blogs: [
      { title: 'GMC AT4X vs AT4: What\'s the Difference?', slug: 'gmc-at4x-comparison' },
    ],
    videos: [
      { title: 'Sierra AT4X Mountain Trail', thumbnail: gmcSierraImg },
    ],
    insuranceInfo: 'GMC premium trucks average $160-250/month insurance.',
  },
  {
    id: 'nissan',
    name: 'Nissan',
    shortName: 'NISSAN',
    image: nissanFrontierImg,
    models: [
      { name: 'Frontier PRO-4X', year: '2024', price: '$42,000', image: nissanFrontierImg },
      { name: 'Titan PRO-4X', year: '2024', price: '$58,000', image: nissanFrontierImg },
    ],
    blogs: [
      { title: 'Nissan Frontier: Budget-Friendly Off-Roader', slug: 'frontier-budget-offroad' },
    ],
    videos: [
      { title: 'Frontier Desert Adventure', thumbnail: nissanFrontierImg },
    ],
    insuranceInfo: 'Nissan trucks are affordable at $100-160/month insurance.',
  },
  {
    id: 'subaru',
    name: 'Subaru',
    shortName: 'SUBARU',
    image: subaruOutbackImg,
    models: [
      { name: 'Outback Wilderness', year: '2024', price: '$42,000', image: subaruOutbackImg },
      { name: 'Crosstrek Wilderness', year: '2024', price: '$35,000', image: subaruOutbackImg },
    ],
    blogs: [
      { title: 'Subaru Wilderness: AWD Excellence', slug: 'subaru-wilderness-review' },
    ],
    videos: [
      { title: 'Outback Wilderness Snow Run', thumbnail: subaruOutbackImg },
    ],
    insuranceInfo: 'Subaru models are economical at $90-140/month insurance.',
  },
];

const TruckBrandsCarousel = () => {
  const [selectedBrand, setSelectedBrand] = useState<TruckBrand | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const scrollLeft = () => {
    setScrollPosition(Math.max(0, scrollPosition - 200));
  };

  const scrollRight = () => {
    setScrollPosition(scrollPosition + 200);
  };

  return (
    <section className="py-8 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-center font-display text-2xl md:text-3xl font-bold mb-6 text-foreground">
          TOP OFFROAD TRUCKS
        </h2>
        
        {/* Circular Brand Selector */}
        <div className="relative">
          {/* Scroll Buttons */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background p-2 rounded-full shadow-lg transition-all"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background p-2 rounded-full shadow-lg transition-all"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Brand Circles Container */}
          <div className="overflow-hidden mx-10">
            <motion.div
              className="flex gap-4 md:gap-6 justify-center py-4"
              animate={{ x: -scrollPosition }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {truckBrands.map((brand) => (
                <motion.button
                  key={brand.id}
                  onClick={() => setSelectedBrand(selectedBrand?.id === brand.id ? null : brand)}
                  className={`flex-shrink-0 flex flex-col items-center gap-2 group transition-all ${
                    selectedBrand?.id === brand.id ? 'scale-110' : ''
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div
                    className={`w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-3 transition-all shadow-lg ${
                      selectedBrand?.id === brand.id
                        ? 'border-accent ring-4 ring-accent/30'
                        : 'border-border group-hover:border-accent/50'
                    }`}
                  >
                    <img
                      src={brand.image}
                      alt={brand.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className={`text-xs md:text-sm font-semibold tracking-wide transition-colors ${
                    selectedBrand?.id === brand.id ? 'text-accent' : 'text-foreground group-hover:text-accent'
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
              transition={{ duration: 0.3 }}
              className="mt-6 overflow-hidden"
            >
              <div className="bg-card rounded-xl border border-border p-6 relative">
                {/* Close Button */}
                <button
                  onClick={() => setSelectedBrand(null)}
                  className="absolute top-4 right-4 p-2 hover:bg-muted rounded-full transition-colors"
                  aria-label="Close panel"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-accent">
                    <img
                      src={selectedBrand.image}
                      alt={selectedBrand.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-bold text-foreground">
                      {selectedBrand.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">Off-Road Vehicles & Resources</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Models Section */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                        🚗
                      </span>
                      Models
                    </h4>
                    <div className="space-y-2">
                      {selectedBrand.models.map((model, idx) => (
                        <Link
                          key={idx}
                          to="/vehicles"
                          className="block p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                        >
                          <p className="font-medium text-sm text-foreground">{model.name}</p>
                          <p className="text-xs text-muted-foreground">{model.year} • {model.price}</p>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Blogs Section */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-accent" />
                      </span>
                      Blog Articles
                    </h4>
                    <div className="space-y-2">
                      {selectedBrand.blogs.map((blog, idx) => (
                        <Link
                          key={idx}
                          to={`/blog/${blog.slug}`}
                          className="block p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                        >
                          <p className="text-sm text-foreground hover:text-accent transition-colors">
                            {blog.title}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Videos Section */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                        <Play className="w-4 h-4 text-accent" />
                      </span>
                      Videos
                    </h4>
                    <div className="space-y-2">
                      {selectedBrand.videos.map((video, idx) => (
                        <Link
                          key={idx}
                          to="/videos"
                          className="block p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-8 rounded overflow-hidden">
                              <img
                                src={video.thumbnail}
                                alt={video.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <p className="text-sm text-foreground">{video.title}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Insurance Section */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                        <Shield className="w-4 h-4 text-accent" />
                      </span>
                      Insurance Info
                    </h4>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm text-foreground mb-3">{selectedBrand.insuranceInfo}</p>
                      <Link
                        to="/insurance"
                        className="text-sm text-accent hover:underline font-medium"
                      >
                        Get Quotes →
                      </Link>
                    </div>
                  </div>
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
