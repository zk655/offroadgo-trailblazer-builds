import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Car, Gauge, Fuel, TrendingUp, Download, Share2, Heart, Plus, Settings, Mountain } from 'lucide-react';
import Navigation from '@/components/Navigation';

// Import vehicle images
import jeepWranglerImage from '@/assets/vehicles/jeep-wrangler-rubicon.jpg';
import fordBroncoImage from '@/assets/vehicles/ford-bronco-wildtrak.jpg';
import chevyColoradoImage from '@/assets/vehicles/chevy-colorado-zr2.jpg';
import toyota4RunnerImage from '@/assets/vehicles/toyota-4runner-trd-pro.jpg';
import ramTRXImage from '@/assets/vehicles/ram-1500-trx.jpg';
import gmcSierraImage from '@/assets/vehicles/gmc-sierra-at4x.jpg';
import nissanFrontierImage from '@/assets/vehicles/nissan-frontier-pro4x.jpg';
import subaruOutbackImage from '@/assets/vehicles/subaru-outback-wilderness.jpg';

interface Vehicle {
  id: string;
  name: string;
  brand: string;
  year: number;
  price: string;
  image: string;
  type: string;
  badge: string;
  description: string;
  specs: {
    engine: string;
    horsepower: string;
    torque: string;
    mpg: string;
    groundClearance: string;
    approachAngle: string;
    departureAngle: string;
    towingCapacity: string;
    transmission: string;
  };
  features: string[];
  detailedSpecs: {
    dimensions: {
      length: string;
      width: string;
      height: string;
      wheelbase: string;
      curbWeight: string;
    };
    drivetrain: {
      driveType: string;
      transferCase: string;
      frontDifferential: string;
      rearDifferential: string;
    };
    suspension: {
      front: string;
      rear: string;
      shocks: string;
    };
    brakes: {
      front: string;
      rear: string;
      abs: boolean;
    };
  };
}

const vehicleData: Record<string, Vehicle> = {
  'jeep-wrangler-rubicon': {
    id: 'jeep-wrangler-rubicon',
    name: 'Jeep Wrangler Rubicon',
    brand: 'Jeep',
    year: 2024,
    price: '$47,895',
    image: jeepWranglerImage,
    type: 'SUV',
    badge: 'Most Popular',
    description: 'The ultimate off-road machine with legendary capability and removable doors and roof for the perfect adventure companion.',
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
    features: ['Rock-Trac 4WD', 'Electronic Sway Bar', 'Rock Rails', 'Skid Plates', 'Removable Doors', 'Fold-Down Windshield'],
    detailedSpecs: {
      dimensions: {
        length: '188.4"',
        width: '73.8"',
        height: '73.6"',
        wheelbase: '118.4"',
        curbWeight: '4,449 lbs'
      },
      drivetrain: {
        driveType: 'Part-time 4WD',
        transferCase: 'Rock-Trac HD',
        frontDifferential: 'Dana 44',
        rearDifferential: 'Dana 44 w/ Tru-Lok'
      },
      suspension: {
        front: 'Independent MacPherson',
        rear: 'Solid Axle',
        shocks: 'Performance Monotube'
      },
      brakes: {
        front: '12.8" Vented Discs',
        rear: '12.8" Vented Discs',
        abs: true
      }
    }
  },
  'ford-bronco-wildtrak': {
    id: 'ford-bronco-wildtrak',
    name: 'Ford Bronco Wildtrak',
    brand: 'Ford',
    year: 2024,
    price: '$52,405',
    image: fordBroncoImage,
    type: 'SUV',
    badge: 'Editor\'s Choice',
    description: 'Built wild for the most extreme adventures with advanced terrain management and rugged durability.',
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
    features: ['Terrain Management', 'Bilstein Shocks', 'Bash Plates', 'Rock Crawl Mode', 'GOAT Modes', 'Trail Toolbox'],
    detailedSpecs: {
      dimensions: {
        length: '191.5"',
        width: '75.9"',
        height: '76.7"',
        wheelbase: '116.1"',
        curbWeight: '4,851 lbs'
      },
      drivetrain: {
        driveType: 'Part-time 4WD',
        transferCase: 'Electronic 2-Speed',
        frontDifferential: 'Dana 44',
        rearDifferential: 'Dana 44 w/ E-Locker'
      },
      suspension: {
        front: 'Independent SLA',
        rear: 'Solid Axle',
        shocks: 'Bilstein Position Sensitive'
      },
      brakes: {
        front: '13.1" Vented Discs',
        rear: '13.6" Vented Discs',
        abs: true
      }
    }
  },
  'ram-1500-trx': {
    id: 'ram-1500-trx',
    name: 'RAM 1500 TRX',
    brand: 'RAM',
    year: 2024,
    price: '$75,540',
    image: ramTRXImage,
    type: 'Pickup Truck',
    badge: 'Most Powerful',
    description: 'The most powerful factory production pickup truck ever built.',
    specs: {
      engine: '6.2L Supercharged V8',
      horsepower: '702 HP',
      torque: '650 lb-ft',
      mpg: '10/14',
      groundClearance: '11.8"',
      approachAngle: '30.2°',
      departureAngle: '23.5°',
      towingCapacity: '8,100 lbs',
      transmission: '8-Speed Auto'
    },
    features: ['Supercharged HEMI', 'Fox Racing Shocks', 'Launch Control', 'Baja Mode', 'Skid Plates', 'Limited Slip Diff'],
    detailedSpecs: {
      dimensions: {
        length: '232.9"',
        width: '88.0"',
        height: '78.0"',
        wheelbase: '144.5"',
        curbWeight: '6,396 lbs'
      },
      drivetrain: {
        driveType: 'Full-time 4WD',
        transferCase: 'BorgWarner 48-12',
        frontDifferential: 'Dana 60',
        rearDifferential: 'Dana 60 w/ Anti-Spin'
      },
      suspension: {
        front: 'Independent A-Arm',
        rear: 'Multilink',
        shocks: 'Fox 3.0" Internal Bypass'
      },
      brakes: {
        front: '15.0" Vented Discs',
        rear: '14.0" Vented Discs',
        abs: true
      }
    }
  },
  'gmc-sierra-at4x': {
    id: 'gmc-sierra-at4x',
    name: 'GMC Sierra AT4X',
    brand: 'GMC',
    year: 2024,
    price: '$68,500',
    image: gmcSierraImage,
    type: 'Pickup Truck',
    badge: 'Luxury Off-Road',
    description: 'Premium off-road capability with luxury appointments.',
    specs: {
      engine: '6.2L V8',
      horsepower: '420 HP',
      torque: '460 lb-ft',
      mpg: '14/18',
      groundClearance: '11.2"',
      approachAngle: '31.8°',
      departureAngle: '23.3°',
      towingCapacity: '9,500 lbs',
      transmission: '10-Speed Auto'
    },
    features: ['Multimatic DSSV Dampers', 'Electronic Lockers', 'Terrain Mode', 'Skid Plates', 'AT4X Suspension', 'Hill Descent'],
    detailedSpecs: {
      dimensions: {
        length: '231.7"',
        width: '81.2"',
        height: '75.5"',
        wheelbase: '147.4"',
        curbWeight: '5,540 lbs'
      },
      drivetrain: {
        driveType: 'Part-time 4WD',
        transferCase: 'Electronic 2-Speed',
        frontDifferential: 'Electronic Locking',
        rearDifferential: 'Electronic Locking'
      },
      suspension: {
        front: 'Independent Torsion Bar',
        rear: 'Leaf Spring',
        shocks: 'Multimatic DSSV'
      },
      brakes: {
        front: '13.6" Vented Discs',
        rear: '13.4" Vented Discs',
        abs: true
      }
    }
  },
  'chevy-colorado-zr2': {
    id: 'chevy-colorado-zr2',
    name: 'Chevrolet Colorado ZR2',
    brand: 'Chevrolet',
    year: 2024,
    price: '$43,200',
    image: chevyColoradoImage,
    type: 'Pickup Truck',
    badge: 'Best Value',
    description: 'Mid-size truck with serious off-road credentials and best-in-class towing capability.',
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
    features: ['Multimatic DSSV Dampers', 'Electronic Locking Diffs', 'Skid Plates', 'Hill Descent Control', 'Bed Protection', 'Crew Cab'],
    detailedSpecs: {
      dimensions: {
        length: '212.7"',
        width: '74.3"',
        height: '71.5"',
        wheelbase: '128.3"',
        curbWeight: '4,513 lbs'
      },
      drivetrain: {
        driveType: 'Part-time 4WD',
        transferCase: 'Electronic 2-Speed',
        frontDifferential: 'Eaton Automatic',
        rearDifferential: 'Eaton Automatic'
      },
      suspension: {
        front: 'Independent Torsion Bar',
        rear: 'Leaf Spring',
        shocks: 'Multimatic DSSV'
      },
      brakes: {
        front: '12.8" Vented Discs',
        rear: '13.3" Vented Discs',
        abs: true
      }
    }
  },
  'toyota-4runner-trd-pro': {
    id: 'toyota-4runner-trd-pro',
    name: 'Toyota 4Runner TRD Pro',
    brand: 'Toyota',
    year: 2024,
    price: '$51,895',
    image: toyota4RunnerImage,
    type: 'SUV',
    badge: 'Most Reliable',
    description: 'Proven reliability meets serious off-road capability with legendary Toyota durability.',
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
    features: ['Fox Racing Shocks', 'Crawl Control', 'Multi-Terrain Select', 'Kinetic Dynamic Suspension', 'TRD Skid Plates', 'Roof Rails'],
    detailedSpecs: {
      dimensions: {
        length: '190.2"',
        width: '75.8"',
        height: '71.5"',
        wheelbase: '109.8"',
        curbWeight: '4,805 lbs'
      },
      drivetrain: {
        driveType: 'Part-time 4WD',
        transferCase: 'Electronic 2-Speed',
        frontDifferential: 'Open',
        rearDifferential: 'Locking'
      },
      suspension: {
        front: 'Independent Double Wishbone',
        rear: 'Solid Axle',
        shocks: 'Fox 2.5" Internal Bypass'
      },
      brakes: {
        front: '12.9" Vented Discs',
        rear: '12.9" Vented Discs',
        abs: true
      }
    }
  },
  'nissan-frontier-pro4x': {
    id: 'nissan-frontier-pro4x',
    name: 'Nissan Frontier Pro-4X',
    brand: 'Nissan',
    year: 2024,
    price: '$38,650',
    image: nissanFrontierImage,
    type: 'Pickup Truck',
    badge: 'Budget Pick',
    description: 'Affordable off-road capability with modern features.',
    specs: {
      engine: '3.8L V6',
      horsepower: '310 HP',
      torque: '281 lb-ft',
      mpg: '18/24',
      groundClearance: '10.0"',
      approachAngle: '32.0°',
      departureAngle: '21.0°',
      towingCapacity: '6,720 lbs',
      transmission: '9-Speed Auto'
    },
    features: ['Electronic Locking Rear Diff', 'Bilstein Off-Road Shocks', 'All-Terrain Tires', 'Hill Start Assist', 'Hill Descent Control', 'Skid Plates'],
    detailedSpecs: {
      dimensions: {
        length: '210.2"',
        width: '72.8"',
        height: '71.0"',
        wheelbase: '126.0"',
        curbWeight: '4,270 lbs'
      },
      drivetrain: {
        driveType: 'Part-time 4WD',
        transferCase: 'Electronic 2-Speed',
        frontDifferential: 'Open',
        rearDifferential: 'Electronic Locking'
      },
      suspension: {
        front: 'Independent Double Wishbone',
        rear: 'Leaf Spring',
        shocks: 'Bilstein Off-Road'
      },
      brakes: {
        front: '12.6" Vented Discs',
        rear: '13.0" Vented Discs',
        abs: true
      }
    }
  },
  'subaru-outback-wilderness': {
    id: 'subaru-outback-wilderness',
    name: 'Subaru Outback Wilderness',
    brand: 'Subaru',
    year: 2024,
    price: '$37,895',
    image: subaruOutbackImage,
    type: 'SUV',
    badge: 'Adventure Ready',
    description: 'The most capable Outback ever with enhanced off-road features.',
    specs: {
      engine: '2.4L Turbo',
      horsepower: '260 HP',
      torque: '277 lb-ft',
      mpg: '22/30',
      groundClearance: '9.5"',
      approachAngle: '20.0°',
      departureAngle: '21.7°',
      towingCapacity: '3,500 lbs',
      transmission: 'CVT'
    },
    features: ['X-MODE with Dual Function', 'Hill Descent Control', 'Copper Accent Elements', 'All-Terrain Tires', 'Wilderness Trim', 'Roof Rails'],
    detailedSpecs: {
      dimensions: {
        length: '191.3"',
        width: '73.0"',
        height: '68.1"',
        wheelbase: '108.1"',
        curbWeight: '3,634 lbs'
      },
      drivetrain: {
        driveType: 'Full-time AWD',
        transferCase: 'Electronic Multi-Plate',
        frontDifferential: 'Open',
        rearDifferential: 'Open'
      },
      suspension: {
        front: 'Independent MacPherson',
        rear: 'Independent Multi-Link',
        shocks: 'Standard'
      },
      brakes: {
        front: '12.4" Vented Discs',
        rear: '12.0" Solid Discs',
        abs: true
      }
    }
  }
};

const VehicleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && vehicleData[id]) {
      setVehicle(vehicleData[id]);
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-20">
          <div className="animate-pulse">
            <div className="h-64 bg-muted rounded-lg mb-8" />
            <div className="h-8 bg-muted rounded w-1/2 mb-4" />
            <div className="h-4 bg-muted rounded w-1/3 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-24 bg-muted rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-20 text-center">
          <Car className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">Vehicle not found</h1>
          <p className="text-muted-foreground mb-8">The vehicle you're looking for doesn't exist.</p>
          <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-20 pb-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6" size="sm">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        {/* Compact Vehicle Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Image */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted">
              <img
                src={vehicle.image}
                alt={vehicle.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute top-4 left-4">
              <Badge className="bg-primary text-primary-foreground text-xs">
                {vehicle.badge}
              </Badge>
            </div>
            <div className="absolute top-4 right-4">
              <Badge variant="secondary" className="bg-background/90 text-xs">
                {vehicle.year}
              </Badge>
            </div>
          </div>

          {/* Compact Info */}
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">{vehicle.brand}</p>
              <h1 className="text-3xl font-bold mb-2">{vehicle.name}</h1>
              <p className="text-2xl font-bold text-primary">{vehicle.price}</p>
            </div>

            <p className="text-muted-foreground leading-relaxed text-sm">
              {vehicle.description}
            </p>

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">{vehicle.type}</Badge>
              <Badge variant="outline" className="text-xs">{vehicle.specs.engine}</Badge>
              <Badge variant="outline" className="text-xs">{vehicle.specs.transmission}</Badge>
            </div>

            {/* Compact Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-3">
                <div className="text-center">
                  <Settings className="mx-auto h-5 w-5 text-primary mb-1" />
                  <p className="text-lg font-bold">{vehicle.specs.horsepower}</p>
                  <p className="text-xs text-muted-foreground">Horsepower</p>
                </div>
              </Card>
              
              <Card className="p-3">
                <div className="text-center">
                  <Mountain className="mx-auto h-5 w-5 text-primary mb-1" />
                  <p className="text-lg font-bold">{vehicle.specs.groundClearance}</p>
                  <p className="text-xs text-muted-foreground">Ground Clearance</p>
                </div>
              </Card>
              
              <Card className="p-3">
                <div className="text-center">
                  <Fuel className="mx-auto h-5 w-5 text-primary mb-1" />
                  <p className="text-lg font-bold">{vehicle.specs.mpg}</p>
                  <p className="text-xs text-muted-foreground">MPG</p>
                </div>
              </Card>
              
              <Card className="p-3">
                <div className="text-center">
                  <TrendingUp className="mx-auto h-5 w-5 text-primary mb-1" />
                  <p className="text-lg font-bold">{vehicle.specs.towingCapacity}</p>
                  <p className="text-xs text-muted-foreground">Towing</p>
                </div>
              </Card>
            </div>

            {/* Compact Action Buttons */}
            <div className="flex gap-2">
              <Button className="flex-1" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add to Build
              </Button>
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Compact Tabs */}
        <Tabs defaultValue="specs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="specs" className="text-xs">Specifications</TabsTrigger>
            <TabsTrigger value="features" className="text-xs">Features</TabsTrigger>
            <TabsTrigger value="dimensions" className="text-xs">Dimensions</TabsTrigger>
            <TabsTrigger value="drivetrain" className="text-xs">Drivetrain</TabsTrigger>
          </TabsList>

          <TabsContent value="specs" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-base">
                    <Gauge className="mr-2 h-4 w-4" />
                    Engine & Power
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Engine</span>
                    <span className="font-medium">{vehicle.specs.engine}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Horsepower</span>
                    <span className="font-medium">{vehicle.specs.horsepower}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Torque</span>
                    <span className="font-medium">{vehicle.specs.torque}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Transmission</span>
                    <span className="font-medium">{vehicle.specs.transmission}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-base">
                    <Mountain className="mr-2 h-4 w-4" />
                    Off-Road Capability
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ground Clearance</span>
                    <span className="font-medium">{vehicle.specs.groundClearance}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Approach Angle</span>
                    <span className="font-medium">{vehicle.specs.approachAngle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Departure Angle</span>
                    <span className="font-medium">{vehicle.specs.departureAngle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Towing Capacity</span>
                    <span className="font-medium">{vehicle.specs.towingCapacity}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-base">
                    <Fuel className="mr-2 h-4 w-4" />
                    Efficiency & Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fuel Economy</span>
                    <span className="font-medium">{vehicle.specs.mpg} MPG</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Year</span>
                    <span className="font-medium">{vehicle.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span className="font-medium">{vehicle.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">MSRP</span>
                    <span className="font-medium">{vehicle.price}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="features" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Key Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {vehicle.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dimensions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Vehicle Dimensions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(vehicle.detailedSpecs.dimensions).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-1 border-b border-border last:border-0 text-sm">
                    <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="drivetrain" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Drivetrain</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {Object.entries(vehicle.detailedSpecs.drivetrain).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Suspension & Brakes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Front Suspension</span>
                    <span className="font-medium">{vehicle.detailedSpecs.suspension.front}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rear Suspension</span>
                    <span className="font-medium">{vehicle.detailedSpecs.suspension.rear}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shocks</span>
                    <span className="font-medium">{vehicle.detailedSpecs.suspension.shocks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Front Brakes</span>
                    <span className="font-medium">{vehicle.detailedSpecs.brakes.front}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rear Brakes</span>
                    <span className="font-medium">{vehicle.detailedSpecs.brakes.rear}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-center pt-6">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download Spec Sheet (PDF)
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetail;