import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Gauge, Mountain, Fuel, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import OptimizedImage from '@/components/OptimizedImage';
import SocialShare from '@/components/SocialShare';

// Import vehicle images with error handling
const importImage = (imagePath: string) => {
  try {
    return imagePath;
  } catch (error) {
    console.error('Image import error:', error);
    return '/placeholder.svg';
  }
};

import jeepWranglerImage from '@/assets/vehicles/jeep-wrangler-rubicon.jpg';
import fordBroncoImage from '@/assets/vehicles/ford-bronco-wildtrak.jpg';
import chevyColoradoImage from '@/assets/vehicles/chevy-colorado-zr2.jpg';
import toyota4RunnerImage from '@/assets/vehicles/toyota-4runner-trd-pro.jpg';
import ramTRXImage from '@/assets/vehicles/ram-1500-trx.jpg';
import gmcSierraImage from '@/assets/vehicles/gmc-sierra-at4x.jpg';
import nissanFrontierImage from '@/assets/vehicles/nissan-frontier-pro4x.jpg';
import subaruOutbackImage from '@/assets/vehicles/subaru-outback-wilderness.jpg';

const VehiclesShowcase = () => {
  const vehicles = [
    {
      id: 'c551e2f6-b64f-4a03-84fd-f50a9eb49fa8',
      slug: 'jeep-wrangler-rubicon-2024',
      name: 'Jeep Wrangler Rubicon',
      brand: 'Jeep',
      year: 2024,
      price: '$47,895',
      image: jeepWranglerImage,
      type: 'SUV',
      badge: 'Most Popular',
      specs: {
        engine: '3.6L V6',
        horsepower: '285 HP',
        groundClearance: '10.8"',
        mpg: '17/25'
      }
    },
    {
      id: '073a8d5d-3540-41ec-b3a8-5ad8278937c5',
      slug: 'ford-bronco-raptor-2024',
      name: 'Ford Bronco Raptor',
      brand: 'Ford',
      year: 2024,
      price: '$52,405',
      image: fordBroncoImage,
      type: 'SUV',
      badge: 'Editor\'s Choice',
      specs: {
        engine: '2.7L EcoBoost V6',
        horsepower: '330 HP',
        groundClearance: '11.6"',
        mpg: '19/22'
      }
    },
    {
      id: '20ec7cd3-5354-49f9-b5e7-ec13ee9065c5',
      slug: 'ram-1500-trx-2024',
      name: 'RAM 1500 TRX',
      brand: 'RAM',
      year: 2024,
      price: '$75,540',
      image: ramTRXImage,
      type: 'Pickup Truck',
      badge: 'Most Powerful',
      specs: {
        engine: '6.2L Supercharged V8',
        horsepower: '702 HP',
        groundClearance: '11.8"',
        mpg: '10/14'
      }
    },
    {
      id: '321d86ce-211e-4348-b06f-a5e8225e4365',
      slug: 'gmc-sierra-at4x-2024',
      name: 'GMC Sierra AT4X',
      brand: 'GMC',
      year: 2024,
      price: '$68,500',
      image: gmcSierraImage,
      type: 'Pickup Truck',
      badge: 'Luxury Off-Road',
      specs: {
        engine: '6.2L V8',
        horsepower: '420 HP',
        groundClearance: '11.2"',
        mpg: '14/18'
      }
    },
    {
      id: '318eb40b-e033-41e4-8c36-b96d6c3b86b4',
      slug: 'chevrolet-colorado-zr2-2024',
      name: 'Chevrolet Colorado ZR2',
      brand: 'Chevrolet',
      year: 2024,
      price: '$43,200',
      image: chevyColoradoImage,
      type: 'Pickup Truck',
      badge: 'Best Value',
      specs: {
        engine: '3.6L V6',
        horsepower: '308 HP',
        groundClearance: '9.6"',
        mpg: '17/24'
      }
    },
    {
      id: 'fce134a7-3158-44d7-b13d-955717e70ce5',
      slug: 'toyota-4runner-trd-pro-2024',
      name: 'Toyota 4Runner TRD Pro',
      brand: 'Toyota',
      year: 2024,
      price: '$51,895',
      image: toyota4RunnerImage,
      type: 'SUV',
      badge: 'Most Reliable',
      specs: {
        engine: '4.0L V6',
        horsepower: '270 HP',
        groundClearance: '9.6"',
        mpg: '16/19'
      }
    },
    {
      id: 'dd55d8ca-5ce3-43ff-8d3f-8db9717c80d7',
      slug: 'nissan-frontier-pro-4x-2024',
      name: 'Nissan Frontier Pro-4X',
      brand: 'Nissan',
      year: 2024,
      price: '$38,650',
      image: nissanFrontierImage,
      type: 'Pickup Truck',
      badge: 'Budget Pick',
      specs: {
        engine: '3.8L V6',
        horsepower: '310 HP',
        groundClearance: '10.0"',
        mpg: '18/24'
      }
    },
    {
      id: '609a4fbd-b40e-4dfb-95ce-a03b19111d77',
      slug: 'subaru-outback-wilderness-2024',
      name: 'Subaru Outback Wilderness',
      brand: 'Subaru',
      year: 2024,
      price: '$37,895',
      image: subaruOutbackImage,
      type: 'SUV',
      badge: 'Adventure Ready',
      specs: {
        engine: '2.4L Turbo',
        horsepower: '260 HP',
        groundClearance: '9.5"',
        mpg: '22/30'
      }
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/20">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-3 text-primary border-primary/20 bg-primary/5 text-xs font-medium">
            Top 4x4 Vehicles
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Best <span className="text-primary">Off-Road</span> Machines
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover the most capable 4x4 vehicles built for extreme adventures
          </p>
        </div>

        {/* Top 4 Vehicles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {vehicles.slice(0, 4).map((vehicle) => (
            <Card key={vehicle.id} className="group bg-background border border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              {/* Vehicle Image - Optimized */}
              <div className="relative overflow-hidden aspect-[4/3] bg-muted/10">
                <OptimizedImage
                  src={vehicle.image} 
                  alt={vehicle.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  fallbackSrc="/placeholder.svg"
                  loading="lazy"
                />
                
                {/* Badge */}
                <Badge 
                  variant="secondary" 
                  className="absolute top-2 left-2 bg-primary text-primary-foreground border-0 text-xs font-medium"
                >
                  {vehicle.badge}
                </Badge>

                {/* Price */}
                <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm rounded-md px-2 py-1">
                  <span className="text-sm font-semibold text-primary">{vehicle.price}</span>
                </div>
              </div>

              <CardContent className="p-4">
                {/* Vehicle Info */}
                <div className="mb-3">
                  <h3 className="text-lg font-semibold leading-tight group-hover:text-primary transition-colors line-clamp-1">
                    {vehicle.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{vehicle.year} {vehicle.brand}</p>
                </div>

                {/* Compact Specs */}
                <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                  <div className="flex items-center gap-1">
                    <Settings className="h-3 w-3 text-primary" />
                    <span className="font-medium">{vehicle.specs.horsepower}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Mountain className="h-3 w-3 text-primary" />
                    <span className="font-medium">{vehicle.specs.groundClearance}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Gauge className="h-3 w-3 text-primary" />
                    <span className="font-medium">{vehicle.specs.engine}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Fuel className="h-3 w-3 text-primary" />
                    <span className="font-medium">{vehicle.specs.mpg}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <Link to={`/vehicles/${vehicle.slug}`}>
                    <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-xs h-8">
                      View Details
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                  
                  {/* Social Share */}
                  <div className="flex justify-center">
                    <SocialShare
                      title={`${vehicle.year} ${vehicle.name}`}
                      excerpt={`Check out the ${vehicle.year} ${vehicle.name} - ${vehicle.specs.horsepower} with ${vehicle.specs.groundClearance} ground clearance starting at ${vehicle.price}`}
                      url={`/vehicles/${vehicle.slug}`}
                      image={vehicle.image}
                      variant="icon"
                      size="sm"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Vehicles Button */}
        <div className="text-center mt-12">
          <Link to="/vehicles">
            <Button 
              size="sm" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium px-6 py-2"
            >
              View All Vehicles
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default VehiclesShowcase;