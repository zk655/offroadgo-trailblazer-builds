import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Gauge, Mountain, Fuel, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

// Import vehicle images
import jeepWranglerImage from '@/assets/vehicles/jeep-wrangler-rubicon.jpg';
import fordBroncoImage from '@/assets/vehicles/ford-bronco-wildtrak.jpg';
import chevyColoradoImage from '@/assets/vehicles/chevy-colorado-zr2.jpg';
import toyota4RunnerImage from '@/assets/vehicles/toyota-4runner-trd-pro.jpg';

const VehiclesShowcase = () => {
  const vehicles = [
    {
      id: 'jeep-wrangler-rubicon',
      name: 'Jeep Wrangler Rubicon',
      brand: 'Jeep',
      year: 2024,
      price: '$47,895',
      image: jeepWranglerImage,
      type: 'SUV',
      badge: 'Most Popular',
      description: 'The ultimate off-road machine with legendary capability',
      specs: {
        engine: '3.6L V6',
        horsepower: '285 HP',
        torque: '260 lb-ft',
        mpg: '17/25',
        groundClearance: '10.8"',
        approachAngle: '44°',
        departureAngle: '37°',
        towingCapacity: '3,500 lbs',
        transmission: '8-Speed Auto'
      },
      features: ['Rock-Trac 4WD', 'Electronic Sway Bar', 'Rock Rails', 'Skid Plates']
    },
    {
      id: 'ford-bronco-wildtrak',
      name: 'Ford Bronco Wildtrak',
      brand: 'Ford',
      year: 2024,
      price: '$52,405',
      image: fordBroncoImage,
      type: 'SUV',
      badge: 'Editor\'s Choice',
      description: 'Built wild for the most extreme adventures',
      specs: {
        engine: '2.7L EcoBoost V6',
        horsepower: '330 HP',
        torque: '415 lb-ft',
        mpg: '19/22',
        groundClearance: '11.6"',
        approachAngle: '43.2°',
        departureAngle: '26.3°',
        towingCapacity: '3,500 lbs',
        transmission: '10-Speed Auto'
      },
      features: ['Terrain Management', 'Bilstein Shocks', 'Bash Plates', 'Rock Crawl Mode']
    },
    {
      id: 'chevy-colorado-zr2',
      name: 'Chevrolet Colorado ZR2',
      brand: 'Chevrolet',
      year: 2024,
      price: '$43,200',
      image: chevyColoradoImage,
      type: 'Pickup Truck',
      badge: 'Best Value',
      description: 'Mid-size truck with serious off-road credentials',
      specs: {
        engine: '3.6L V6',
        horsepower: '308 HP',
        torque: '275 lb-ft',
        mpg: '17/24',
        groundClearance: '9.6"',
        approachAngle: '30°',
        departureAngle: '23.5°',
        towingCapacity: '5,000 lbs',
        transmission: '8-Speed Auto'
      },
      features: ['Multimatic DSSV Dampers', 'Electronic Locking Diffs', 'Skid Plates', 'Hill Descent Control']
    },
    {
      id: 'toyota-4runner-trd-pro',
      name: 'Toyota 4Runner TRD Pro',
      brand: 'Toyota',
      year: 2024,
      price: '$51,895',
      image: toyota4RunnerImage,
      type: 'SUV',
      badge: 'Most Reliable',
      description: 'Proven reliability meets serious off-road capability',
      specs: {
        engine: '4.0L V6',
        horsepower: '270 HP',
        torque: '278 lb-ft',
        mpg: '16/19',
        groundClearance: '9.6"',
        approachAngle: '33°',
        departureAngle: '26°',
        towingCapacity: '5,000 lbs',
        transmission: '5-Speed Auto'
      },
      features: ['Fox Racing Shocks', 'Crawl Control', 'Multi-Terrain Select', 'Kinetic Dynamic Suspension']
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-primary border-primary/20 bg-primary/5">
            Top 4x4 Vehicles
          </Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
            Best <span className="text-primary">Off-Road</span> Machines
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover the most capable 4x4 vehicles built for extreme adventures, 
            from legendary Jeeps to powerful pickup trucks.
          </p>
        </div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {vehicles.map((vehicle) => (
            <Card key={vehicle.id} className="group bg-background border border-border hover:shadow-primary/10 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              {/* Vehicle Image */}
              <div className="relative overflow-hidden aspect-[16/10] bg-muted/20">
                <img 
                  src={vehicle.image} 
                  alt={vehicle.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Badge */}
                <Badge 
                  variant="secondary" 
                  className="absolute top-4 left-4 bg-primary text-primary-foreground border-0 font-semibold"
                >
                  {vehicle.badge}
                </Badge>

                {/* Price */}
                <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2">
                  <span className="text-lg font-bold text-primary">{vehicle.price}</span>
                </div>

                {/* Vehicle Type */}
                <div className="absolute bottom-4 left-4">
                  <Badge variant="outline" className="bg-background/80 backdrop-blur-sm border-border">
                    {vehicle.type}
                  </Badge>
                </div>
              </div>

              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-2xl font-bold leading-tight group-hover:text-primary transition-colors">
                      {vehicle.name}
                    </CardTitle>
                    <p className="text-muted-foreground">{vehicle.year} {vehicle.brand}</p>
                  </div>
                </div>
                
                <p className="text-muted-foreground leading-relaxed mt-2">
                  {vehicle.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Key Specs */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Engine</p>
                      <p className="font-semibold">{vehicle.specs.engine}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Power</p>
                      <p className="font-semibold">{vehicle.specs.horsepower}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mountain className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Clearance</p>
                      <p className="font-semibold">{vehicle.specs.groundClearance}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Fuel className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">MPG</p>
                      <p className="font-semibold">{vehicle.specs.mpg}</p>
                    </div>
                  </div>
                </div>

                {/* Key Features */}
                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">Key Features:</p>
                  <div className="flex flex-wrap gap-2">
                    {vehicle.features.slice(0, 3).map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {vehicle.features.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{vehicle.features.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* View Details Button */}
                <Link to={`/vehicles/${vehicle.id}`}>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                    View Full Specifications
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Vehicles Button */}
        <div className="text-center mt-16">
          <Link to="/vehicles">
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-primary text-primary-foreground hover:bg-primary/90 border-primary font-semibold px-8 py-3"
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