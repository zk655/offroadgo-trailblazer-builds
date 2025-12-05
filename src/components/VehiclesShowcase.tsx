import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import OptimizedImage from '@/components/OptimizedImage';

import jeepWranglerImage from '@/assets/vehicles/jeep-wrangler-rubicon.jpg';
import fordBroncoImage from '@/assets/vehicles/ford-bronco-wildtrak.jpg';
import ramTRXImage from '@/assets/vehicles/ram-1500-trx.jpg';
import toyota4RunnerImage from '@/assets/vehicles/toyota-4runner-trd-pro.jpg';

const VehiclesShowcase = () => {
  const vehicles = [
    {
      id: 'c551e2f6-b64f-4a03-84fd-f50a9eb49fa8',
      slug: 'jeep-wrangler-rubicon-2024',
      name: 'Jeep Wrangler Rubicon',
      year: 2024,
      price: '$47,895',
      image: jeepWranglerImage,
      tagline: 'Legendary capability'
    },
    {
      id: '073a8d5d-3540-41ec-b3a8-5ad8278937c5',
      slug: 'ford-bronco-raptor-2024',
      name: 'Ford Bronco Raptor',
      year: 2024,
      price: '$52,405',
      image: fordBroncoImage,
      tagline: 'Desert dominator'
    },
    {
      id: '20ec7cd3-5354-49f9-b5e7-ec13ee9065c5',
      slug: 'ram-1500-trx-2024',
      name: 'RAM 1500 TRX',
      year: 2024,
      price: '$75,540',
      image: ramTRXImage,
      tagline: '702 HP of pure power'
    },
    {
      id: 'fce134a7-3158-44d7-b13d-955717e70ce5',
      slug: 'toyota-4runner-trd-pro-2024',
      name: 'Toyota 4Runner TRD Pro',
      year: 2024,
      price: '$51,895',
      image: toyota4RunnerImage,
      tagline: 'Built to last'
    }
  ];

  return (
    <section className="py-16 bg-muted">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight mb-2">
              FEATURED VEHICLES
            </h2>
            <p className="text-muted-foreground">
              The most capable off-road machines on the market
            </p>
          </div>
          <Link to="/vehicles">
            <Button variant="outline" className="font-display font-medium tracking-wide">
              VIEW ALL VEHICLES
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {vehicles.map((vehicle) => (
            <Link 
              key={vehicle.id} 
              to={`/vehicles/${vehicle.slug}`}
              className="group bg-background overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <OptimizedImage
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  fallbackSrc="/placeholder.svg"
                  loading="lazy"
                />
              </div>

              {/* Content */}
              <div className="p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  {vehicle.year}
                </p>
                <h3 className="font-display text-lg font-semibold mb-1 group-hover:text-accent transition-colors">
                  {vehicle.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {vehicle.tagline}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-display font-semibold text-lg">
                    {vehicle.price}
                  </span>
                  <span className="text-sm text-foreground group-hover:text-accent transition-colors flex items-center gap-1">
                    Details
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VehiclesShowcase;