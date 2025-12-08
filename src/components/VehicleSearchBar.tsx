import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Import truck images
import fordBroncoImg from '@/assets/vehicles/ford-bronco-wildtrak.jpg';
import jeepWranglerImg from '@/assets/vehicles/jeep-wrangler-rubicon.jpg';
import toyota4RunnerImg from '@/assets/vehicles/toyota-4runner-trd-pro.jpg';
import chevyColoradoImg from '@/assets/vehicles/chevy-colorado-zr2.jpg';
import ramTrxImg from '@/assets/vehicles/ram-1500-trx.jpg';
import gmcSierraImg from '@/assets/vehicles/gmc-sierra-at4x.jpg';
import nissanFrontierImg from '@/assets/vehicles/nissan-frontier-pro4x.jpg';
import subaruOutbackImg from '@/assets/vehicles/subaru-outback-wilderness.jpg';

interface VehicleModel {
  name: string;
  brand: string;
  year: string;
  price: string;
  image: string;
  slug: string;
}

const allVehicles: VehicleModel[] = [
  // Ford
  { name: 'Bronco Raptor', brand: 'Ford', year: '2024', price: '$73,000', image: fordBroncoImg, slug: 'ford-bronco-raptor' },
  { name: 'F-150 Raptor', brand: 'Ford', year: '2024', price: '$76,775', image: fordBroncoImg, slug: 'ford-f150-raptor' },
  { name: 'Bronco Wildtrak', brand: 'Ford', year: '2024', price: '$49,595', image: fordBroncoImg, slug: 'ford-bronco-wildtrak' },
  { name: 'Ranger Raptor', brand: 'Ford', year: '2024', price: '$56,785', image: fordBroncoImg, slug: 'ford-ranger-raptor' },
  // Jeep
  { name: 'Wrangler Rubicon', brand: 'Jeep', year: '2024', price: '$52,000', image: jeepWranglerImg, slug: 'jeep-wrangler-rubicon' },
  { name: 'Gladiator Mojave', brand: 'Jeep', year: '2024', price: '$56,000', image: jeepWranglerImg, slug: 'jeep-gladiator-mojave' },
  { name: 'Grand Cherokee', brand: 'Jeep', year: '2024', price: '$45,000', image: jeepWranglerImg, slug: 'jeep-grand-cherokee' },
  // Toyota
  { name: '4Runner TRD Pro', brand: 'Toyota', year: '2024', price: '$58,000', image: toyota4RunnerImg, slug: 'toyota-4runner-trd-pro' },
  { name: 'Tacoma TRD Pro', brand: 'Toyota', year: '2024', price: '$52,000', image: toyota4RunnerImg, slug: 'toyota-tacoma-trd-pro' },
  { name: 'Land Cruiser', brand: 'Toyota', year: '2024', price: '$78,000', image: toyota4RunnerImg, slug: 'toyota-land-cruiser' },
  { name: 'Tundra TRD Pro', brand: 'Toyota', year: '2024', price: '$67,000', image: toyota4RunnerImg, slug: 'toyota-tundra-trd-pro' },
  // Chevy
  { name: 'Colorado ZR2', brand: 'Chevrolet', year: '2024', price: '$49,000', image: chevyColoradoImg, slug: 'chevy-colorado-zr2' },
  { name: 'Silverado ZR2', brand: 'Chevrolet', year: '2024', price: '$68,000', image: chevyColoradoImg, slug: 'chevy-silverado-zr2' },
  // RAM
  { name: '1500 TRX', brand: 'RAM', year: '2024', price: '$92,000', image: ramTrxImg, slug: 'ram-1500-trx' },
  { name: '2500 Power Wagon', brand: 'RAM', year: '2024', price: '$75,000', image: ramTrxImg, slug: 'ram-2500-power-wagon' },
  // GMC
  { name: 'Sierra AT4X', brand: 'GMC', year: '2024', price: '$78,000', image: gmcSierraImg, slug: 'gmc-sierra-at4x' },
  { name: 'Canyon AT4X', brand: 'GMC', year: '2024', price: '$58,000', image: gmcSierraImg, slug: 'gmc-canyon-at4x' },
  // Nissan
  { name: 'Frontier PRO-4X', brand: 'Nissan', year: '2024', price: '$42,000', image: nissanFrontierImg, slug: 'nissan-frontier-pro4x' },
  { name: 'Titan PRO-4X', brand: 'Nissan', year: '2024', price: '$58,000', image: nissanFrontierImg, slug: 'nissan-titan-pro4x' },
  // Subaru
  { name: 'Outback Wilderness', brand: 'Subaru', year: '2024', price: '$42,000', image: subaruOutbackImg, slug: 'subaru-outback-wilderness' },
  { name: 'Crosstrek Wilderness', brand: 'Subaru', year: '2024', price: '$35,000', image: subaruOutbackImg, slug: 'subaru-crosstrek-wilderness' },
];

const VehicleSearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    
    const term = searchTerm.toLowerCase();
    return allVehicles.filter(vehicle =>
      vehicle.name.toLowerCase().includes(term) ||
      vehicle.brand.toLowerCase().includes(term) ||
      `${vehicle.brand} ${vehicle.name}`.toLowerCase().includes(term)
    ).slice(0, 8);
  }, [searchTerm]);

  const showResults = isFocused && searchTerm.trim().length > 0;

  return (
    <div className="relative w-full max-w-2xl mx-auto mb-6">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search vehicles... (e.g., Ford Raptor, Jeep Wrangler)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className="pl-12 pr-10 h-12 text-base bg-card border-border/50 focus:border-accent rounded-full shadow-lg"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-50"
          >
            {searchResults.length > 0 ? (
              <div className="max-h-80 overflow-y-auto">
                {searchResults.map((vehicle, idx) => (
                  <Link
                    key={idx}
                    to={`/vehicles`}
                    className="flex items-center gap-4 p-3 hover:bg-muted transition-colors border-b border-border/50 last:border-b-0"
                    onClick={() => setSearchTerm('')}
                  >
                    <div className="w-14 h-10 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={vehicle.image}
                        alt={vehicle.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground truncate">
                        {vehicle.brand} {vehicle.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {vehicle.year} • {vehicle.price}
                      </p>
                    </div>
                    <span className="text-xs text-accent font-medium">
                      View →
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-muted-foreground text-sm">
                No vehicles found for "{searchTerm}"
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VehicleSearchBar;
