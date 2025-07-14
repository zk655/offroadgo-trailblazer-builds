import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Car, Search, Filter, Star, Fuel, Gauge, TrendingUp, Zap, Shield, Users, Calendar, Award } from 'lucide-react';
import Navigation from '@/components/Navigation';
import PageHero from '@/components/PageHero';

// Import vehicle images
import fordBroncoRaptor from '@/assets/vehicles/ford-bronco-wildtrak.jpg';
import fordF150Raptor from '@/assets/vehicles/ford-bronco-wildtrak.jpg';
import ramTrx from '@/assets/vehicles/ram-1500-trx.jpg';
import jeepWrangler from '@/assets/vehicles/jeep-wrangler-rubicon.jpg';
import toyota4Runner from '@/assets/vehicles/toyota-4runner-trd-pro.jpg';
import chevyColorado from '@/assets/vehicles/chevy-colorado-zr2.jpg';
import gmcSierra from '@/assets/vehicles/gmc-sierra-at4x.jpg';
import nissanFrontier from '@/assets/vehicles/nissan-frontier-pro4x.jpg';
import subaruOutback from '@/assets/vehicles/subaru-outback-wilderness.jpg';

interface Vehicle {
  id: string;
  name: string;
  brand: string;
  type: string;
  engine: string;
  clearance: number;
  tire_size: string;
  image_url: string;
  year: number;
  price: number;
  mpg: number;
  towing_capacity: number;
  ground_clearance: number;
  seating_capacity: number;
  drivetrain: string;
  transmission: string;
  fuel_tank: number;
  warranty: string;
  safety_rating: number;
}

// Comprehensive 4x4 vehicle data with 50+ vehicles
const vehicleData: Vehicle[] = [
  // Ford 4x4 Vehicles
  {
    id: '1',
    name: 'Bronco Raptor',
    brand: 'Ford',
    type: 'SUV',
    engine: '3.0L V6 Twin-Turbo',
    clearance: 13.1,
    tire_size: '37x12.50R17',
    image_url: fordBroncoRaptor,
    year: 2024,
    price: 69995,
    mpg: 15,
    towing_capacity: 4500,
    ground_clearance: 13.1,
    seating_capacity: 4,
    drivetrain: '4WD',
    transmission: '10-Speed Automatic',
    fuel_tank: 23.8,
    warranty: '3yr/36k Basic',
    safety_rating: 4
  },
  {
    id: '2',
    name: 'F-150 Raptor',
    brand: 'Ford',
    type: 'Truck',
    engine: '3.5L V6 Twin-Turbo',
    clearance: 13.0,
    tire_size: '35x12.50R17',
    image_url: fordF150Raptor,
    year: 2024,
    price: 78205,
    mpg: 15,
    towing_capacity: 8200,
    ground_clearance: 13.0,
    seating_capacity: 5,
    drivetrain: '4WD',
    transmission: '10-Speed Automatic',
    fuel_tank: 36.0,
    warranty: '3yr/36k Basic',
    safety_rating: 5
  },
  {
    id: '3',
    name: 'F-150 Tremor',
    brand: 'Ford',
    type: 'Truck',
    engine: '3.5L V6 EcoBoost',
    clearance: 10.9,
    tire_size: '33x12.50R18',
    image_url: fordF150Raptor,
    year: 2024,
    price: 54970,
    mpg: 18,
    towing_capacity: 10800,
    ground_clearance: 10.9,
    seating_capacity: 5,
    drivetrain: '4WD',
    transmission: '10-Speed Automatic',
    fuel_tank: 36.0,
    warranty: '3yr/36k Basic',
    safety_rating: 5
  },
  {
    id: '4',
    name: 'Bronco Sport',
    brand: 'Ford',
    type: 'SUV',
    engine: '2.0L I4 EcoBoost',
    clearance: 8.8,
    tire_size: '30x9.50R17',
    image_url: fordBroncoRaptor,
    year: 2024,
    price: 35295,
    mpg: 23,
    towing_capacity: 2200,
    ground_clearance: 8.8,
    seating_capacity: 5,
    drivetrain: '4WD',
    transmission: '8-Speed Automatic',
    fuel_tank: 16.0,
    warranty: '3yr/36k Basic',
    safety_rating: 4
  },
  {
    id: '5',
    name: 'Ranger Raptor',
    brand: 'Ford',
    type: 'Truck',
    engine: '3.0L V6 Twin-Turbo',
    clearance: 11.1,
    tire_size: '33x10.50R17',
    image_url: fordF150Raptor,
    year: 2024,
    price: 56960,
    mpg: 18,
    towing_capacity: 7500,
    ground_clearance: 11.1,
    seating_capacity: 5,
    drivetrain: '4WD',
    transmission: '10-Speed Automatic',
    fuel_tank: 18.0,
    warranty: '3yr/36k Basic',
    safety_rating: 4
  },

  // Ram 4x4 Vehicles
  {
    id: '6',
    name: '1500 TRX',
    brand: 'Ram',
    type: 'Truck',
    engine: '6.2L Supercharged HEMI V8',
    clearance: 11.8,
    tire_size: '35x11.50R18',
    image_url: ramTrx,
    year: 2024,
    price: 98335,
    mpg: 12,
    towing_capacity: 8100,
    ground_clearance: 11.8,
    seating_capacity: 5,
    drivetrain: '4WD',
    transmission: '8-Speed Automatic',
    fuel_tank: 33.0,
    warranty: '3yr/36k Basic',
    safety_rating: 4
  },
  {
    id: '7',
    name: '2500 Power Wagon',
    brand: 'Ram',
    type: 'Truck',
    engine: '6.4L HEMI V8',
    clearance: 14.9,
    tire_size: '33x12.50R17',
    image_url: ramTrx,
    year: 2024,
    price: 67040,
    mpg: 12,
    towing_capacity: 10330,
    ground_clearance: 14.9,
    seating_capacity: 5,
    drivetrain: '4WD',
    transmission: '8-Speed Automatic',
    fuel_tank: 32.0,
    warranty: '3yr/36k Basic',
    safety_rating: 4
  },
  {
    id: '8',
    name: '1500 Rebel',
    brand: 'Ram',
    type: 'Truck',
    engine: '5.7L HEMI V8',
    clearance: 10.3,
    tire_size: '33x12.50R18',
    image_url: ramTrx,
    year: 2024,
    price: 54490,
    mpg: 15,
    towing_capacity: 11610,
    ground_clearance: 10.3,
    seating_capacity: 5,
    drivetrain: '4WD',
    transmission: '8-Speed Automatic',
    fuel_tank: 33.0,
    warranty: '3yr/36k Basic',
    safety_rating: 5
  },
  {
    id: '9',
    name: '2500 Laramie',
    brand: 'Ram',
    type: 'Truck',
    engine: '6.7L Cummins Turbo Diesel',
    clearance: 12.1,
    tire_size: '33x12.50R18',
    image_url: ramTrx,
    year: 2024,
    price: 73995,
    mpg: 22,
    towing_capacity: 19780,
    ground_clearance: 12.1,
    seating_capacity: 5,
    drivetrain: '4WD',
    transmission: '6-Speed Manual',
    fuel_tank: 32.0,
    warranty: '3yr/36k Basic',
    safety_rating: 4
  },

  // Jeep 4x4 Vehicles
  {
    id: '10',
    name: 'Wrangler Rubicon',
    brand: 'Jeep',
    type: 'SUV',
    engine: '3.6L V6',
    clearance: 10.8,
    tire_size: '33x12.50R17',
    image_url: jeepWrangler,
    year: 2024,
    price: 48995,
    mpg: 18,
    towing_capacity: 3500,
    ground_clearance: 10.8,
    seating_capacity: 4,
    drivetrain: '4WD',
    transmission: '8-Speed Automatic',
    fuel_tank: 22.5,
    warranty: '3yr/36k Basic',
    safety_rating: 3
  },
  {
    id: '11',
    name: 'Wrangler 392',
    brand: 'Jeep',
    type: 'SUV',
    engine: '6.4L HEMI V8',
    clearance: 10.8,
    tire_size: '33x12.50R17',
    image_url: jeepWrangler,
    year: 2024,
    price: 79995,
    mpg: 13,
    towing_capacity: 3500,
    ground_clearance: 10.8,
    seating_capacity: 4,
    drivetrain: '4WD',
    transmission: '8-Speed Automatic',
    fuel_tank: 22.5,
    warranty: '3yr/36k Basic',
    safety_rating: 3
  },
  {
    id: '12',
    name: 'Gladiator Mojave',
    brand: 'Jeep',
    type: 'Truck',
    engine: '3.6L V6',
    clearance: 11.1,
    tire_size: '33x12.50R17',
    image_url: jeepWrangler,
    year: 2024,
    price: 52395,
    mpg: 17,
    towing_capacity: 7650,
    ground_clearance: 11.1,
    seating_capacity: 5,
    drivetrain: '4WD',
    transmission: '8-Speed Automatic',
    fuel_tank: 22.0,
    warranty: '3yr/36k Basic',
    safety_rating: 4
  },
  {
    id: '13',
    name: 'Grand Cherokee Trailhawk',
    brand: 'Jeep',
    type: 'SUV',
    engine: '5.7L HEMI V8',
    clearance: 10.9,
    tire_size: '31.5x10.50R18',
    image_url: jeepWrangler,
    year: 2024,
    price: 58995,
    mpg: 14,
    towing_capacity: 7200,
    ground_clearance: 10.9,
    seating_capacity: 5,
    drivetrain: '4WD',
    transmission: '8-Speed Automatic',
    fuel_tank: 24.6,
    warranty: '3yr/36k Basic',
    safety_rating: 5
  },
  {
    id: '14',
    name: 'Grand Cherokee 4xe',
    brand: 'Jeep',
    type: 'SUV',
    engine: '2.0L Turbo I4 Hybrid',
    clearance: 10.9,
    tire_size: '30x10.50R18',
    image_url: jeepWrangler,
    year: 2024,
    price: 59995,
    mpg: 56,
    towing_capacity: 6000,
    ground_clearance: 10.9,
    seating_capacity: 5,
    drivetrain: '4WD',
    transmission: '8-Speed Automatic',
    fuel_tank: 17.0,
    warranty: '3yr/36k Basic',
    safety_rating: 5
  },

  // Toyota 4x4 Vehicles
  {
    id: '15',
    name: '4Runner TRD Pro',
    brand: 'Toyota',
    type: 'SUV',
    engine: '4.0L V6',
    clearance: 9.6,
    tire_size: '33x11.50R17',
    image_url: toyota4Runner,
    year: 2024,
    price: 54520,
    mpg: 17,
    towing_capacity: 5000,
    ground_clearance: 9.6,
    seating_capacity: 5,
    drivetrain: '4WD',
    transmission: '5-Speed Automatic',
    fuel_tank: 23.0,
    warranty: '3yr/36k Basic',
    safety_rating: 4
  },
  {
    id: '16',
    name: 'Tacoma TRD Pro',
    brand: 'Toyota',
    type: 'Truck',
    engine: '3.5L V6',
    clearance: 11.3,
    tire_size: '33x11.50R16',
    image_url: toyota4Runner,
    year: 2024,
    price: 51395,
    mpg: 19,
    towing_capacity: 6800,
    ground_clearance: 11.3,
    seating_capacity: 5,
    drivetrain: '4WD',
    transmission: '6-Speed Manual',
    fuel_tank: 21.1,
    warranty: '3yr/36k Basic',
    safety_rating: 4
  },
  {
    id: '17',
    name: 'Tundra TRD Pro',
    brand: 'Toyota',
    type: 'Truck',
    engine: '3.5L Twin-Turbo V6',
    clearance: 11.3,
    tire_size: '33x12.50R18',
    image_url: toyota4Runner,
    year: 2024,
    price: 69995,
    mpg: 18,
    towing_capacity: 12000,
    ground_clearance: 11.3,
    seating_capacity: 5,
    drivetrain: '4WD',
    transmission: '10-Speed Automatic',
    fuel_tank: 38.0,
    warranty: '3yr/36k Basic',
    safety_rating: 4
  },
  {
    id: '18',
    name: 'Sequoia TRD Pro',
    brand: 'Toyota',
    type: 'SUV',
    engine: '3.5L Twin-Turbo V6 Hybrid',
    clearance: 10.0,
    tire_size: '33x12.50R18',
    image_url: toyota4Runner,
    year: 2024,
    price: 77215,
    mpg: 19,
    towing_capacity: 9520,
    ground_clearance: 10.0,
    seating_capacity: 8,
    drivetrain: '4WD',
    transmission: '10-Speed Automatic',
    fuel_tank: 22.5,
    warranty: '3yr/36k Basic',
    safety_rating: 5
  },
  {
    id: '19',
    name: 'Land Cruiser',
    brand: 'Toyota',
    type: 'SUV',
    engine: '3.4L Twin-Turbo V6 Hybrid',
    clearance: 10.7,
    tire_size: '32x11.50R18',
    image_url: toyota4Runner,
    year: 2024,
    price: 55950,
    mpg: 22,
    towing_capacity: 8000,
    ground_clearance: 10.7,
    seating_capacity: 8,
    drivetrain: '4WD',
    transmission: '8-Speed Automatic',
    fuel_tank: 17.9,
    warranty: '3yr/36k Basic',
    safety_rating: 5
  },

  // Chevrolet 4x4 Vehicles
  {
    id: '20',
    name: 'Colorado ZR2',
    brand: 'Chevrolet',
    type: 'Truck',
    engine: '2.7L Turbo I-4',
    clearance: 10.7,
    tire_size: '33x10.50R17',
    image_url: chevyColorado,
    year: 2024,
    price: 48195,
    mpg: 19,
    towing_capacity: 7700,
    ground_clearance: 10.7,
    seating_capacity: 5,
    drivetrain: '4WD',
    transmission: '8-Speed Automatic',
    fuel_tank: 21.0,
    warranty: '3yr/36k Basic',
    safety_rating: 4
  },
  {
    id: '21',
    name: 'Silverado ZR2',
    brand: 'Chevrolet',
    type: 'Truck',
    engine: '6.2L V8',
    clearance: 11.2,
    tire_size: '33x12.50R18',
    image_url: chevyColorado,
    year: 2024,
    price: 71200,
    mpg: 16,
    towing_capacity: 8900,
    ground_clearance: 11.2,
    seating_capacity: 5,
    drivetrain: '4WD',
    transmission: '10-Speed Automatic',
    fuel_tank: 24.0,
    warranty: '3yr/36k Basic',
    safety_rating: 5
  },
  {
    id: '22',
    name: 'Tahoe Z71',
    brand: 'Chevrolet',
    type: 'SUV',
    engine: '5.3L V8',
    clearance: 10.0,
    tire_size: '33x12.50R18',
    image_url: chevyColorado,
    year: 2024,
    price: 59200,
    mpg: 16,
    towing_capacity: 8600,
    ground_clearance: 10.0,
    seating_capacity: 8,
    drivetrain: '4WD',
    transmission: '10-Speed Automatic',
    fuel_tank: 24.0,
    warranty: '3yr/36k Basic',
    safety_rating: 5
  },
  {
    id: '23',
    name: 'Suburban Z71',
    brand: 'Chevrolet',
    type: 'SUV',
    engine: '5.3L V8',
    clearance: 9.0,
    tire_size: '32x11.50R18',
    image_url: chevyColorado,
    year: 2024,
    price: 62200,
    mpg: 16,
    towing_capacity: 8300,
    ground_clearance: 9.0,
    seating_capacity: 9,
    drivetrain: '4WD',
    transmission: '10-Speed Automatic',
    fuel_tank: 28.0,
    warranty: '3yr/36k Basic',
    safety_rating: 5
  },
  {
    id: '24',
    name: 'TrailBlazer',
    brand: 'Chevrolet',
    type: 'SUV',
    engine: '1.3L Turbo I3',
    clearance: 8.0,
    tire_size: '30x9.50R17',
    image_url: chevyColorado,
    year: 2024,
    price: 32100,
    mpg: 29,
    towing_capacity: 1000,
    ground_clearance: 8.0,
    seating_capacity: 5,
    drivetrain: 'AWD',
    transmission: 'CVT',
    fuel_tank: 13.2,
    warranty: '3yr/36k Basic',
    safety_rating: 4
  },

  // GMC 4x4 Vehicles
  {
    id: '25',
    name: 'Sierra AT4X',
    brand: 'GMC',
    type: 'Truck',
    engine: '6.2L V8',
    clearance: 11.2,
    tire_size: '33x12.50R18',
    image_url: gmcSierra,
    year: 2024,
    price: 75395,
    mpg: 16,
    towing_capacity: 9500,
    ground_clearance: 11.2,
    seating_capacity: 5,
    drivetrain: '4WD',
    transmission: '10-Speed Automatic',
    fuel_tank: 24.0,
    warranty: '3yr/36k Basic',
    safety_rating: 5
  },
  {
    id: '26',
    name: 'Canyon AT4X',
    brand: 'GMC',
    type: 'Truck',
    engine: '2.7L Turbo I-4',
    clearance: 10.7,
    tire_size: '33x10.50R17',
    image_url: gmcSierra,
    year: 2024,
    price: 47195,
    mpg: 19,
    towing_capacity: 7700,
    ground_clearance: 10.7,
    seating_capacity: 5,
    drivetrain: '4WD',
    transmission: '8-Speed Automatic',
    fuel_tank: 21.0,
    warranty: '3yr/36k Basic',
    safety_rating: 4
  },
  {
    id: '27',
    name: 'Yukon AT4',
    brand: 'GMC',
    type: 'SUV',
    engine: '5.3L V8',
    clearance: 10.0,
    tire_size: '33x12.50R18',
    image_url: gmcSierra,
    year: 2024,
    price: 68200,
    mpg: 16,
    towing_capacity: 8400,
    ground_clearance: 10.0,
    seating_capacity: 8,
    drivetrain: '4WD',
    transmission: '10-Speed Automatic',
    fuel_tank: 24.0,
    warranty: '3yr/36k Basic',
    safety_rating: 5
  },
  {
    id: '28',
    name: 'Terrain AT4',
    brand: 'GMC',
    type: 'SUV',
    engine: '1.5L Turbo I4',
    clearance: 8.9,
    tire_size: '31x10.50R17',
    image_url: gmcSierra,
    year: 2024,
    price: 38495,
    mpg: 26,
    towing_capacity: 3500,
    ground_clearance: 8.9,
    seating_capacity: 5,
    drivetrain: 'AWD',
    transmission: '9-Speed Automatic',
    fuel_tank: 14.9,
    warranty: '3yr/36k Basic',
    safety_rating: 5
  },

  // Nissan 4x4 Vehicles
  {
    id: '29',
    name: 'Frontier Pro-4X',
    brand: 'Nissan',
    type: 'Truck',
    engine: '3.8L V6',
    clearance: 10.5,
    tire_size: '32x11.50R17',
    image_url: nissanFrontier,
    year: 2024,
    price: 39990,
    mpg: 18,
    towing_capacity: 6720,
    ground_clearance: 10.5,
    seating_capacity: 5,
    drivetrain: '4WD',
    transmission: '9-Speed Automatic',
    fuel_tank: 21.1,
    warranty: '3yr/36k Basic',
    safety_rating: 4
  },
  {
    id: '30',
    name: 'Titan PRO-4X',
    brand: 'Nissan',
    type: 'Truck',
    engine: '5.6L V8',
    clearance: 9.8,
    tire_size: '33x12.50R18',
    image_url: nissanFrontier,
    year: 2024,
    price: 56840,
    mpg: 15,
    towing_capacity: 9310,
    ground_clearance: 9.8,
    seating_capacity: 5,
    drivetrain: '4WD',
    transmission: '9-Speed Automatic',
    fuel_tank: 26.0,
    warranty: '3yr/36k Basic',
    safety_rating: 4
  },
  {
    id: '31',
    name: 'Pathfinder Rock Creek',
    brand: 'Nissan',
    type: 'SUV',
    engine: '3.5L V6',
    clearance: 8.0,
    tire_size: '31x10.50R18',
    image_url: nissanFrontier,
    year: 2024,
    price: 43990,
    mpg: 24,
    towing_capacity: 6000,
    ground_clearance: 8.0,
    seating_capacity: 8,
    drivetrain: 'AWD',
    transmission: 'CVT',
    fuel_tank: 19.5,
    warranty: '3yr/36k Basic',
    safety_rating: 5
  },
  {
    id: '32',
    name: 'Armada',
    brand: 'Nissan',
    type: 'SUV',
    engine: '5.6L V8',
    clearance: 8.9,
    tire_size: '32x11.50R18',
    image_url: nissanFrontier,
    year: 2024,
    price: 52590,
    mpg: 14,
    towing_capacity: 8500,
    ground_clearance: 8.9,
    seating_capacity: 8,
    drivetrain: '4WD',
    transmission: '7-Speed Automatic',
    fuel_tank: 26.0,
    warranty: '3yr/36k Basic',
    safety_rating: 4
  },

  // Subaru AWD Vehicles
  {
    id: '33',
    name: 'Outback Wilderness',
    brand: 'Subaru',
    type: 'SUV',
    engine: '2.4L Turbo H4',
    clearance: 9.5,
    tire_size: '32x11.50R17',
    image_url: subaruOutback,
    year: 2024,
    price: 38395,
    mpg: 24,
    towing_capacity: 3500,
    ground_clearance: 9.5,
    seating_capacity: 5,
    drivetrain: 'AWD',
    transmission: 'CVT',
    fuel_tank: 19.3,
    warranty: '3yr/36k Basic',
    safety_rating: 5
  },
  {
    id: '34',
    name: 'Forester Wilderness',
    brand: 'Subaru',
    type: 'SUV',
    engine: '2.5L H4',
    clearance: 9.2,
    tire_size: '31x10.50R17',
    image_url: subaruOutback,
    year: 2024,
    price: 33395,
    mpg: 26,
    towing_capacity: 1500,
    ground_clearance: 9.2,
    seating_capacity: 5,
    drivetrain: 'AWD',
    transmission: 'CVT',
    fuel_tank: 16.6,
    warranty: '3yr/36k Basic',
    safety_rating: 5
  },
  {
    id: '35',
    name: 'Ascent',
    brand: 'Subaru',
    type: 'SUV',
    engine: '2.4L Turbo H4',
    clearance: 8.7,
    tire_size: '30x9.50R18',
    image_url: subaruOutback,
    year: 2024,
    price: 34295,
    mpg: 23,
    towing_capacity: 5000,
    ground_clearance: 8.7,
    seating_capacity: 8,
    drivetrain: 'AWD',
    transmission: 'CVT',
    fuel_tank: 19.3,
    warranty: '3yr/36k Basic',
    safety_rating: 5
  },

  // Land Rover 4x4 Vehicles
  {
    id: '36',
    name: 'Defender 110',
    brand: 'Land Rover',
    type: 'SUV',
    engine: '3.0L Mild Hybrid I6',
    clearance: 11.5,
    tire_size: '32x11.50R18',
    image_url: toyota4Runner,
    year: 2024,
    price: 59300,
    mpg: 19,
    towing_capacity: 8200,
    ground_clearance: 11.5,
    seating_capacity: 8,
    drivetrain: '4WD',
    transmission: '8-Speed Automatic',
    fuel_tank: 23.8,
    warranty: '4yr/50k Basic',
    safety_rating: 4
  },
  {
    id: '37',
    name: 'Discovery',
    brand: 'Land Rover',
    type: 'SUV',
    engine: '3.0L Supercharged V6',
    clearance: 11.1,
    tire_size: '32x11.50R19',
    image_url: toyota4Runner,
    year: 2024,
    price: 62700,
    mpg: 17,
    towing_capacity: 8200,
    ground_clearance: 11.1,
    seating_capacity: 7,
    drivetrain: '4WD',
    transmission: '8-Speed Automatic',
    fuel_tank: 22.7,
    warranty: '4yr/50k Basic',
    safety_rating: 4
  },
  {
    id: '38',
    name: 'Range Rover Sport',
    brand: 'Land Rover',
    type: 'SUV',
    engine: '3.0L Turbo I6 Hybrid',
    clearance: 11.4,
    tire_size: '33x12.50R21',
    image_url: toyota4Runner,
    year: 2024,
    price: 84400,
    mpg: 20,
    towing_capacity: 7700,
    ground_clearance: 11.4,
    seating_capacity: 5,
    drivetrain: '4WD',
    transmission: '8-Speed Automatic',
    fuel_tank: 22.8,
    warranty: '4yr/50k Basic',
    safety_rating: 5
  },

  // Honda 4x4 Vehicles
  {
    id: '39',
    name: 'Pilot TrailSport',
    brand: 'Honda',
    type: 'SUV',
    engine: '3.5L V6',
    clearance: 8.2,
    tire_size: '31x10.50R18',
    image_url: toyota4Runner,
    year: 2024,
    price: 49350,
    mpg: 21,
    towing_capacity: 5000,
    ground_clearance: 8.2,
    seating_capacity: 8,
    drivetrain: 'AWD',
    transmission: '10-Speed Automatic',
    fuel_tank: 19.5,
    warranty: '3yr/36k Basic',
    safety_rating: 5
  },
  {
    id: '40',
    name: 'Passport TrailSport',
    brand: 'Honda',
    type: 'SUV',
    engine: '3.5L V6',
    clearance: 8.1,
    tire_size: '31x10.50R18',
    image_url: toyota4Runner,
    year: 2024,
    price: 44350,
    mpg: 22,
    towing_capacity: 5000,
    ground_clearance: 8.1,
    seating_capacity: 5,
    drivetrain: 'AWD',
    transmission: '9-Speed Automatic',
    fuel_tank: 19.5,
    warranty: '3yr/36k Basic',
    safety_rating: 5
  },
  {
    id: '41',
    name: 'Ridgeline',
    brand: 'Honda',
    type: 'Truck',
    engine: '3.5L V6',
    clearance: 8.6,
    tire_size: '31x10.50R18',
    image_url: toyota4Runner,
    year: 2024,
    price: 45900,
    mpg: 21,
    towing_capacity: 5000,
    ground_clearance: 8.6,
    seating_capacity: 5,
    drivetrain: 'AWD',
    transmission: '9-Speed Automatic',
    fuel_tank: 19.5,
    warranty: '3yr/36k Basic',
    safety_rating: 5
  },

  // Volkswagen 4x4 Vehicles
  {
    id: '42',
    name: 'Atlas Cross Sport',
    brand: 'Volkswagen',
    type: 'SUV',
    engine: '3.6L V6',
    clearance: 8.0,
    tire_size: '31x10.50R20',
    image_url: toyota4Runner,
    year: 2024,
    price: 41995,
    mpg: 20,
    towing_capacity: 5000,
    ground_clearance: 8.0,
    seating_capacity: 5,
    drivetrain: '4Motion AWD',
    transmission: '8-Speed Automatic',
    fuel_tank: 18.6,
    warranty: '4yr/50k Basic',
    safety_rating: 5
  },
  {
    id: '43',
    name: 'Tiguan',
    brand: 'Volkswagen',
    type: 'SUV',
    engine: '2.0L Turbo I4',
    clearance: 8.3,
    tire_size: '30x9.50R17',
    image_url: toyota4Runner,
    year: 2024,
    price: 32545,
    mpg: 24,
    towing_capacity: 1500,
    ground_clearance: 8.3,
    seating_capacity: 7,
    drivetrain: '4Motion AWD',
    transmission: '8-Speed Automatic',
    fuel_tank: 15.9,
    warranty: '4yr/50k Basic',
    safety_rating: 5
  },

  // Hyundai 4x4 Vehicles
  {
    id: '44',
    name: 'Santa Fe',
    brand: 'Hyundai',
    type: 'SUV',
    engine: '2.5L Turbo I4',
    clearance: 8.2,
    tire_size: '31x10.50R19',
    image_url: toyota4Runner,
    year: 2024,
    price: 38950,
    mpg: 23,
    towing_capacity: 5000,
    ground_clearance: 8.2,
    seating_capacity: 5,
    drivetrain: 'AWD',
    transmission: '8-Speed Automatic',
    fuel_tank: 18.8,
    warranty: '5yr/60k Basic',
    safety_rating: 5
  },
  {
    id: '45',
    name: 'Tucson',
    brand: 'Hyundai',
    type: 'SUV',
    engine: '2.5L I4',
    clearance: 8.6,
    tire_size: '30x9.50R19',
    image_url: toyota4Runner,
    year: 2024,
    price: 32550,
    mpg: 26,
    towing_capacity: 2000,
    ground_clearance: 8.6,
    seating_capacity: 5,
    drivetrain: 'AWD',
    transmission: '8-Speed Automatic',
    fuel_tank: 14.3,
    warranty: '5yr/60k Basic',
    safety_rating: 5
  },

  // Kia 4x4 Vehicles
  {
    id: '46',
    name: 'Sorento',
    brand: 'Kia',
    type: 'SUV',
    engine: '2.5L Turbo I4',
    clearance: 8.2,
    tire_size: '31x10.50R19',
    image_url: toyota4Runner,
    year: 2024,
    price: 37290,
    mpg: 24,
    towing_capacity: 5000,
    ground_clearance: 8.2,
    seating_capacity: 7,
    drivetrain: 'AWD',
    transmission: '8-Speed Automatic',
    fuel_tank: 18.8,
    warranty: '5yr/60k Basic',
    safety_rating: 5
  },
  {
    id: '47',
    name: 'Sportage',
    brand: 'Kia',
    type: 'SUV',
    engine: '2.5L I4',
    clearance: 8.8,
    tire_size: '30x9.50R19',
    image_url: toyota4Runner,
    year: 2024,
    price: 30290,
    mpg: 25,
    towing_capacity: 2000,
    ground_clearance: 8.8,
    seating_capacity: 5,
    drivetrain: 'AWD',
    transmission: '8-Speed Automatic',
    fuel_tank: 14.0,
    warranty: '5yr/60k Basic',
    safety_rating: 5
  },

  // Mazda AWD Vehicles
  {
    id: '48',
    name: 'CX-90',
    brand: 'Mazda',
    type: 'SUV',
    engine: '3.3L Turbo I6',
    clearance: 8.6,
    tire_size: '32x11.50R20',
    image_url: toyota4Runner,
    year: 2024,
    price: 51550,
    mpg: 24,
    towing_capacity: 5000,
    ground_clearance: 8.6,
    seating_capacity: 7,
    drivetrain: 'AWD',
    transmission: '8-Speed Automatic',
    fuel_tank: 17.8,
    warranty: '3yr/36k Basic',
    safety_rating: 5
  },
  {
    id: '49',
    name: 'CX-50',
    brand: 'Mazda',
    type: 'SUV',
    engine: '2.5L Turbo I4',
    clearance: 8.6,
    tire_size: '31x10.50R19',
    image_url: toyota4Runner,
    year: 2024,
    price: 37550,
    mpg: 24,
    towing_capacity: 3500,
    ground_clearance: 8.6,
    seating_capacity: 5,
    drivetrain: 'AWD',
    transmission: '6-Speed Automatic',
    fuel_tank: 15.3,
    warranty: '3yr/36k Basic',
    safety_rating: 5
  },

  // Acura AWD Vehicles
  {
    id: '50',
    name: 'MDX',
    brand: 'Acura',
    type: 'SUV',
    engine: '3.5L V6',
    clearance: 8.2,
    tire_size: '32x11.50R20',
    image_url: toyota4Runner,
    year: 2024,
    price: 50200,
    mpg: 21,
    towing_capacity: 5000,
    ground_clearance: 8.2,
    seating_capacity: 7,
    drivetrain: 'SH-AWD',
    transmission: '10-Speed Automatic',
    fuel_tank: 19.5,
    warranty: '4yr/50k Basic',
    safety_rating: 5
  },
  {
    id: '51',
    name: 'RDX',
    brand: 'Acura',
    type: 'SUV',
    engine: '2.0L Turbo I4',
    clearance: 8.2,
    tire_size: '31x10.50R19',
    image_url: toyota4Runner,
    year: 2024,
    price: 43300,
    mpg: 23,
    towing_capacity: 1500,
    ground_clearance: 8.2,
    seating_capacity: 5,
    drivetrain: 'SH-AWD',
    transmission: '10-Speed Automatic',
    fuel_tank: 18.6,
    warranty: '4yr/50k Basic',
    safety_rating: 5
  },

  // Infiniti AWD Vehicles
  {
    id: '52',
    name: 'QX80',
    brand: 'Infiniti',
    type: 'SUV',
    engine: '5.6L V8',
    clearance: 9.2,
    tire_size: '33x12.50R20',
    image_url: toyota4Runner,
    year: 2024,
    price: 72150,
    mpg: 14,
    towing_capacity: 8500,
    ground_clearance: 9.2,
    seating_capacity: 8,
    drivetrain: 'AWD',
    transmission: '7-Speed Automatic',
    fuel_tank: 26.0,
    warranty: '4yr/60k Basic',
    safety_rating: 4
  }
];

const Vehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(vehicleData);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>(vehicleData);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [brandFilter, setBrandFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    filterVehicles();
  }, [vehicles, searchTerm, brandFilter, typeFilter]);

  const filterVehicles = () => {
    let filtered = vehicles;

    if (searchTerm) {
      filtered = filtered.filter(vehicle =>
        vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (brandFilter !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.brand === brandFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.type === typeFilter);
    }

    setFilteredVehicles(filtered);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getDifficultyColor = (clearance: number) => {
    if (clearance >= 11) return 'bg-red-500';
    if (clearance >= 9) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const uniqueBrands = [...new Set(vehicles.map(v => v.brand))];
  const uniqueTypes = [...new Set(vehicles.map(v => v.type))];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <PageHero
        title="4x4 Off-Road Vehicles"
        subtitle="Discover the perfect 4x4 vehicle for your next adventure. Compare specs, features, and find your ideal off-road companion built to conquer any terrain."
        icon={Car}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 bg-card p-6 rounded-lg shadow-card">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search vehicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={brandFilter} onValueChange={setBrandFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              {uniqueBrands.map(brand => (
                <SelectItem key={brand} value={brand}>{brand}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {uniqueTypes.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredVehicles.length} of {vehicles.length} vehicles
          </p>
        </div>

        {/* Vehicle Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVehicles.map((vehicle) => (
            <Card key={vehicle.id} className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 overflow-hidden bg-gradient-to-br from-card via-card/95 to-card/90 backdrop-blur-sm border-2 border-border/20 hover:border-primary/40 rounded-3xl relative">
              {/* Enhanced Card Outline */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/0 via-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/5 group-hover:ring-primary/20 transition-all duration-500" />
              
              <div className="relative overflow-hidden rounded-t-3xl">
                <img
                  src={vehicle.image_url}
                  alt={vehicle.name}
                  className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Enhanced Badges */}
                <div className="absolute top-4 left-4">
                  <Badge className={`text-white text-xs font-bold ${getDifficultyColor(vehicle.ground_clearance)} shadow-2xl ring-1 ring-white/20`}>
                    <Shield className="w-3 h-3 mr-1" />
                    {vehicle.ground_clearance}" Clearance
                  </Badge>
                </div>
                
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <Badge variant="secondary" className="bg-black/60 text-white border-white/30 backdrop-blur-md text-xs font-semibold shadow-lg">
                    <Calendar className="w-3 h-3 mr-1" />
                    {vehicle.year}
                  </Badge>
                  <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md rounded-lg px-2 py-1">
                    {[...Array(vehicle.safety_rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                
                <div className="absolute bottom-4 right-4">
                  <Badge className="bg-gradient-to-r from-primary to-accent text-white font-bold text-sm shadow-2xl border border-white/20">
                    {formatPrice(vehicle.price)}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6 relative">
                {/* Header Section */}
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-xs font-bold text-primary uppercase tracking-wider">{vehicle.brand}</p>
                    <div className="flex-1 h-px bg-gradient-to-r from-primary/20 to-transparent" />
                  </div>
                  <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors duration-300">{vehicle.name}</h3>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground mt-2">
                    <span className="flex items-center gap-1">
                      <Car className="w-3 h-3" />
                      {vehicle.type}
                    </span>
                    <span>•</span>
                    <span>{vehicle.drivetrain}</span>
                  </div>
                </div>

                {/* Enhanced Performance Section */}
                <div className="mb-5 p-4 rounded-2xl bg-gradient-to-br from-primary/8 via-primary/5 to-accent/8 border border-primary/15 shadow-inner">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center">
                      <Gauge className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-bold text-primary">Performance</span>
                  </div>
                  <div className="grid grid-cols-1 gap-3 text-xs">
                    <div className="flex justify-between items-center p-2 rounded-lg bg-card/50">
                      <span className="text-muted-foreground font-medium">Engine:</span>
                      <span className="font-bold">{vehicle.engine}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg bg-card/50">
                      <span className="text-muted-foreground font-medium">Transmission:</span>
                      <span className="font-bold">{vehicle.transmission}</span>
                    </div>
                  </div>
                </div>

                {/* Enhanced Key Specs Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs mb-5">
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-br from-muted/60 to-muted/40 hover:from-muted/80 hover:to-muted/60 transition-all duration-300 border border-border/50">
                    <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Fuel className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-muted-foreground font-medium">MPG</p>
                      <p className="font-bold text-foreground">{vehicle.mpg}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-br from-muted/60 to-muted/40 hover:from-muted/80 hover:to-muted/60 transition-all duration-300 border border-border/50">
                    <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
                      <TrendingUp className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-muted-foreground font-medium">Towing</p>
                      <p className="font-bold text-foreground">{(vehicle.towing_capacity / 1000).toFixed(1)}K lbs</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-br from-muted/60 to-muted/40 hover:from-muted/80 hover:to-muted/60 transition-all duration-300 border border-border/50">
                    <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Users className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-muted-foreground font-medium">Seating</p>
                      <p className="font-bold text-foreground">{vehicle.seating_capacity}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-br from-muted/60 to-muted/40 hover:from-muted/80 hover:to-muted/60 transition-all duration-300 border border-border/50">
                    <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Zap className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-muted-foreground font-medium">Tires</p>
                      <p className="font-bold text-foreground text-xs">{vehicle.tire_size}</p>
                    </div>
                  </div>
                </div>

                {/* Enhanced Additional Details */}
                <div className="space-y-3 text-xs mb-5 p-4 rounded-2xl bg-muted/20 border border-border/30">
                  <div className="flex justify-between items-center py-1 border-b border-border/20 last:border-0">
                    <span className="text-muted-foreground font-medium flex items-center gap-2">
                      <Fuel className="w-3 h-3" />
                      Fuel Tank:
                    </span>
                    <span className="font-bold">{vehicle.fuel_tank} gal</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-border/20 last:border-0">
                    <span className="text-muted-foreground font-medium flex items-center gap-2">
                      <Award className="w-3 h-3" />
                      Warranty:
                    </span>
                    <span className="font-bold">{vehicle.warranty}</span>
                  </div>
                </div>

                {/* Enhanced Action Buttons */}
                <div className="flex gap-3">
                  <Button asChild variant="outline" size="sm" className="flex-1 group-hover:border-primary/60 group-hover:bg-primary/5 text-xs h-10 rounded-xl font-semibold transition-all duration-300">
                    <Link to={`/vehicle/${vehicle.id}`}>
                      View Details
                    </Link>
                  </Button>
                  <Button asChild size="sm" className="flex-1 text-xs h-10 rounded-xl font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300">
                    <Link to={`/compare?vehicles=${vehicle.id}`}>
                      Compare
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredVehicles.length === 0 && (
          <div className="text-center py-12">
            <Car className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No vehicles found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Vehicles;