import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllVehiclesFlat } from '@/data/vehicleData';

const VehicleSearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const allVehicles = useMemo(() => getAllVehiclesFlat(), []);

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    
    const term = searchTerm.toLowerCase();
    return allVehicles.filter(vehicle =>
      vehicle.name.toLowerCase().includes(term) ||
      vehicle.brand.toLowerCase().includes(term) ||
      vehicle.trim.toLowerCase().includes(term) ||
      `${vehicle.brand} ${vehicle.name}`.toLowerCase().includes(term) ||
      `${vehicle.brand} ${vehicle.name} ${vehicle.trim}`.toLowerCase().includes(term)
    ).slice(0, 10);
  }, [searchTerm, allVehicles]);

  const showResults = isFocused && searchTerm.trim().length > 0;

  return (
    <div className="relative w-full max-w-2xl mx-auto mb-6">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search vehicles... (e.g., Ford Bronco, Jeep Wrangler Rubicon)"
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
              <div className="max-h-96 overflow-y-auto">
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
                        {vehicle.brand} {vehicle.name} {vehicle.trim}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        MSRP starting at {vehicle.price}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] uppercase tracking-wider text-accent/80 font-medium px-2 py-0.5 bg-accent/10 rounded">
                        {vehicle.category}
                      </span>
                      <span className="text-xs text-accent font-medium mt-1">
                        View →
                      </span>
                    </div>
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
