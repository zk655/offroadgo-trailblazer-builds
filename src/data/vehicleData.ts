// Import truck images
import fordBroncoImg from '@/assets/vehicles/ford-bronco-wildtrak.jpg';
import jeepWranglerImg from '@/assets/vehicles/jeep-wrangler-rubicon.jpg';
import toyota4RunnerImg from '@/assets/vehicles/toyota-4runner-trd-pro.jpg';
import chevyColoradoImg from '@/assets/vehicles/chevy-colorado-zr2.jpg';
import ramTrxImg from '@/assets/vehicles/ram-1500-trx.jpg';
import gmcSierraImg from '@/assets/vehicles/gmc-sierra-at4x.jpg';

export interface VehicleModel {
  name: string;
  trim: string;
  price: string;
  engine?: string;
  category: 'suv' | 'truck';
}

export interface VehicleCategory {
  name: string;
  models: VehicleModel[];
}

export interface BrandData {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  image: string;
  categories: VehicleCategory[];
  insuranceInfo: string;
}

// Comprehensive vehicle data
export const brandsData: BrandData[] = [
  {
    id: 'jeep',
    name: 'Jeep',
    shortName: 'JEEP',
    logo: jeepWranglerImg,
    image: jeepWranglerImg,
    categories: [
      {
        name: 'Compass',
        models: [
          { name: 'Compass', trim: 'Sport 4X4', price: '$26,900', engine: '2.0L I4 DOHC DI Turbo Engine with Stop/Start', category: 'suv' },
          { name: 'Compass', trim: 'Latitude 4X4', price: '$28,765', category: 'suv' },
          { name: 'Compass', trim: 'Limited 4X4', price: '$32,840', category: 'suv' },
          { name: 'Compass', trim: 'Trailhawk 4X4', price: '$32,990', category: 'suv' },
        ],
      },
      {
        name: 'Wrangler',
        models: [
          { name: 'Wrangler', trim: 'Sport', price: '$37,290', category: 'suv' },
          { name: 'Wrangler', trim: 'Sport S', price: '$40,295', category: 'suv' },
          { name: 'Wrangler', trim: 'Willys', price: '$44,790', category: 'suv' },
          { name: 'Wrangler', trim: 'Sahara', price: '$49,370', category: 'suv' },
          { name: 'Wrangler', trim: 'Rubicon', price: '$52,050', category: 'suv' },
          { name: 'Wrangler', trim: 'Rubicon X', price: '$62,000', category: 'suv' },
          { name: 'Wrangler', trim: 'Rubicon 392', price: '$100,590', category: 'suv' },
        ],
      },
      {
        name: 'Cherokee',
        models: [
          { name: 'Cherokee', trim: 'Base', price: '$35,000', category: 'suv' },
          { name: 'Cherokee', trim: 'Laredo', price: '$38,595', category: 'suv' },
          { name: 'Cherokee', trim: 'Limited', price: '$41,095', category: 'suv' },
          { name: 'Cherokee', trim: 'Overland', price: '$44,595', category: 'suv' },
        ],
      },
      {
        name: 'Grand Cherokee',
        models: [
          { name: 'Grand Cherokee', trim: 'Laredo A', price: '$36,495', category: 'suv' },
          { name: 'Grand Cherokee', trim: 'Laredo', price: '$37,035', category: 'suv' },
          { name: 'Grand Cherokee', trim: 'Laredo X', price: '$37,785', category: 'suv' },
          { name: 'Grand Cherokee', trim: 'Altitude', price: '$41,640', category: 'suv' },
          { name: 'Grand Cherokee', trim: 'Altitude X', price: '$42,140', category: 'suv' },
          { name: 'Grand Cherokee', trim: 'Limited', price: '$42,905', category: 'suv' },
          { name: 'Grand Cherokee', trim: 'Overland', price: '$56,995', category: 'suv' },
          { name: 'Grand Cherokee', trim: 'Summit', price: '$58,560', category: 'suv' },
          { name: 'Grand Cherokee', trim: 'Summit Reserve', price: '$63,040', category: 'suv' },
        ],
      },
      {
        name: 'Grand Cherokee 4xe',
        models: [
          { name: 'Grand Cherokee 4xe', trim: '4xe', price: '$60,490', category: 'suv' },
          { name: 'Grand Cherokee 4xe', trim: 'Anniversary Edition', price: '$63,485', category: 'suv' },
          { name: 'Grand Cherokee 4xe', trim: 'Trailhawk', price: '$66,185', category: 'suv' },
          { name: 'Grand Cherokee 4xe', trim: 'Overland', price: '$73,480', category: 'suv' },
          { name: 'Grand Cherokee 4xe', trim: 'Summit', price: '$74,670', category: 'suv' },
          { name: 'Grand Cherokee 4xe', trim: 'Summit Reserve', price: '$79,150', category: 'suv' },
        ],
      },
      {
        name: 'Gladiator',
        models: [
          { name: 'Gladiator', trim: 'Sport', price: '$38,695', category: 'truck' },
          { name: 'Gladiator', trim: 'Nighthawk', price: '$41,490', category: 'truck' },
          { name: 'Gladiator', trim: 'Sport S', price: '$41,600', category: 'truck' },
          { name: 'Gladiator', trim: 'High Tide', price: '$46,095', category: 'truck' },
          { name: 'Gladiator', trim: 'Willys', price: '$45,795', category: 'truck' },
          { name: 'Gladiator', trim: 'Mojave', price: '$51,695', category: 'truck' },
          { name: 'Gladiator', trim: 'Rubicon X', price: '$61,695', category: 'truck' },
          { name: 'Gladiator', trim: 'Mojave X', price: '$61,100', category: 'truck' },
        ],
      },
      {
        name: 'Wagoneer',
        models: [
          { name: 'Wagoneer', trim: 'Base', price: '$59,945', category: 'suv' },
          { name: 'Wagoneer', trim: 'Series II', price: '$63,945', category: 'suv' },
          { name: 'Wagoneer', trim: 'Carbide', price: '$67,335', category: 'suv' },
          { name: 'Wagoneer', trim: 'Overland', price: '$72,740', category: 'suv' },
          { name: 'Wagoneer', trim: 'Series III', price: '$73,945', category: 'suv' },
          { name: 'Wagoneer', trim: 'Limited', price: '$75,135', category: 'suv' },
          { name: 'Wagoneer', trim: 'Super', price: '$81,135', category: 'suv' },
        ],
      },
      {
        name: 'Wagoneer S',
        models: [
          { name: 'Wagoneer S', trim: 'Limited', price: '$65,200', category: 'suv' },
          { name: 'Wagoneer S', trim: 'Launch Edition', price: '$70,795', category: 'suv' },
        ],
      },
      {
        name: 'Grand Wagoneer',
        models: [
          { name: 'Grand Wagoneer', trim: 'Base', price: '$84,945', category: 'suv' },
          { name: 'Grand Wagoneer', trim: 'Obsidian', price: '$98,945', category: 'suv' },
          { name: 'Grand Wagoneer', trim: 'Series III', price: '$107,945', category: 'suv' },
        ],
      },
    ],
    insuranceInfo: 'Jeep vehicles typically cost $130-250/month to insure depending on model.',
  },
  {
    id: 'toyota',
    name: 'Toyota',
    shortName: 'TOYOTA',
    logo: toyota4RunnerImg,
    image: toyota4RunnerImg,
    categories: [
      {
        name: 'Corolla Cross',
        models: [
          { name: 'Corolla Cross', trim: 'Base', price: '$24,635', category: 'suv' },
          { name: 'Corolla Cross', trim: 'Hybrid', price: '$28,995', category: 'suv' },
        ],
      },
      {
        name: 'RAV4',
        models: [
          { name: 'RAV4', trim: 'Base', price: '$29,800', category: 'suv' },
          { name: 'RAV4', trim: 'Hybrid', price: '$32,850', category: 'suv' },
          { name: 'RAV4', trim: 'Plug-in Hybrid', price: '$44,815', category: 'suv' },
        ],
      },
      {
        name: 'Highlander',
        models: [
          { name: 'Highlander', trim: 'Base', price: '$45,270', category: 'suv' },
          { name: 'Highlander', trim: 'Hybrid', price: '$47,020', category: 'suv' },
          { name: 'Grand Highlander', trim: 'Base', price: '$41,360', category: 'suv' },
          { name: 'Grand Highlander', trim: 'Hybrid', price: '$44,710', category: 'suv' },
        ],
      },
      {
        name: '4Runner',
        models: [
          { name: '4Runner', trim: 'Base', price: '$41,270', category: 'suv' },
          { name: '4Runner', trim: 'i-FORCE MAX', price: '$52,490', category: 'suv' },
        ],
      },
      {
        name: 'Land Cruiser',
        models: [
          { name: 'Land Cruiser', trim: '1958 Edition', price: '$57,200', category: 'suv' },
          { name: 'Land Cruiser', trim: 'Base', price: '$63,275', category: 'suv' },
        ],
      },
      {
        name: 'Tacoma',
        models: [
          { name: 'Tacoma', trim: 'SR', price: '$31,590', category: 'truck' },
          { name: 'Tacoma', trim: 'SR5', price: '$36,220', category: 'truck' },
          { name: 'Tacoma', trim: 'TRD PreRunner', price: '$38,520', category: 'truck' },
          { name: 'Tacoma', trim: 'TRD Sport', price: '$39,800', category: 'truck' },
          { name: 'Tacoma', trim: 'TRD Off-Road', price: '$42,200', category: 'truck' },
          { name: 'Tacoma', trim: 'Limited', price: '$52,955', category: 'truck' },
          { name: 'Tacoma', trim: 'TRD Sport i-Force MAX', price: '$46,720', category: 'truck' },
          { name: 'Tacoma', trim: 'TRD Off-Road i-Force MAX', price: '$47,020', category: 'truck' },
          { name: 'Tacoma', trim: 'Limited i-Force Max', price: '$56,280', category: 'truck' },
          { name: 'Tacoma', trim: 'Trail Hunter', price: '$63,135', category: 'truck' },
          { name: 'Tacoma', trim: 'TRD Pro', price: '$64,135', category: 'truck' },
        ],
      },
      {
        name: 'Tundra',
        models: [
          { name: 'Tundra', trim: 'SR', price: '$41,260', category: 'truck' },
          { name: 'Tundra', trim: 'SR5', price: '$46,510', category: 'truck' },
          { name: 'Tundra', trim: 'Limited', price: '$54,860', category: 'truck' },
          { name: 'Tundra', trim: 'Limited i-FORCE MAX', price: '$58,560', category: 'truck' },
          { name: 'Tundra', trim: 'Platinum', price: '$63,695', category: 'truck' },
          { name: 'Tundra', trim: '1794 Edition', price: '$64,380', category: 'truck' },
          { name: 'Tundra', trim: 'Platinum i-FORCE MAX', price: '$70,605', category: 'truck' },
          { name: 'Tundra', trim: '1794 Edition i-FORCE MAX', price: '$71,305', category: 'truck' },
          { name: 'Tundra', trim: 'TRD Pro', price: '$72,565', category: 'truck' },
          { name: 'Tundra', trim: 'Capstone', price: '$80,800', category: 'truck' },
        ],
      },
    ],
    insuranceInfo: 'Toyota off-road models average $120-180/month insurance.',
  },
  {
    id: 'chevrolet',
    name: 'Chevrolet',
    shortName: 'CHEVY',
    logo: chevyColoradoImg,
    image: chevyColoradoImg,
    categories: [
      {
        name: 'Colorado',
        models: [
          { name: 'Colorado', trim: 'WT', price: '$31,900', category: 'truck' },
          { name: 'Colorado', trim: 'LT', price: '$35,800', category: 'truck' },
          { name: 'Colorado', trim: 'Trail Boss', price: '$39,900', category: 'truck' },
          { name: 'Colorado', trim: 'Z71', price: '$43,900', category: 'truck' },
          { name: 'Colorado', trim: 'ZR2', price: '$49,600', category: 'truck' },
        ],
      },
      {
        name: 'Silverado 1500',
        models: [
          { name: 'Silverado', trim: 'WT', price: '$36,900', category: 'truck' },
          { name: 'Silverado', trim: 'Custom', price: '$42,400', category: 'truck' },
          { name: 'Silverado', trim: 'Custom Trail Boss', price: '$52,800', category: 'truck' },
          { name: 'Silverado', trim: 'LT', price: '$47,900', category: 'truck' },
          { name: 'Silverado', trim: 'RST', price: '$51,300', category: 'truck' },
          { name: 'Silverado', trim: 'LT Trail Boss', price: '$59,600', category: 'truck' },
          { name: 'Silverado', trim: 'LTZ', price: '$58,000', category: 'truck' },
          { name: 'Silverado', trim: 'High Country', price: '$62,900', category: 'truck' },
          { name: 'Silverado', trim: 'ZR2', price: '$71,700', category: 'truck' },
        ],
      },
      {
        name: 'Silverado HD',
        models: [
          { name: 'Silverado HD', trim: 'WT', price: '$51,600', category: 'truck' },
          { name: 'Silverado HD', trim: 'Custom', price: '$53,100', category: 'truck' },
          { name: 'Silverado HD', trim: 'LT', price: '$55,700', category: 'truck' },
          { name: 'Silverado HD', trim: 'LTZ', price: '$62,600', category: 'truck' },
          { name: 'Silverado HD', trim: 'ZR2', price: '$71,100', category: 'truck' },
          { name: 'Silverado HD', trim: 'High Country', price: '$72,900', category: 'truck' },
        ],
      },
      {
        name: 'Silverado EV',
        models: [
          { name: 'Silverado EV', trim: 'Custom', price: '$55,895', category: 'truck' },
          { name: 'Silverado EV', trim: 'LT', price: '$69,100', category: 'truck' },
          { name: 'Silverado EV', trim: 'Trail Boss', price: '$70,000', category: 'truck' },
        ],
      },
      {
        name: 'Suburban',
        models: [
          { name: 'Suburban', trim: 'LS', price: '$62,000', category: 'suv' },
          { name: 'Suburban', trim: 'LT', price: '$65,000', category: 'suv' },
          { name: 'Suburban', trim: 'RST', price: '$70,000', category: 'suv' },
          { name: 'Suburban', trim: 'Z71', price: '$72,000', category: 'suv' },
          { name: 'Suburban', trim: 'Premier', price: '$76,600', category: 'suv' },
          { name: 'Suburban', trim: 'High Country', price: '$81,700', category: 'suv' },
        ],
      },
      {
        name: 'Tahoe',
        models: [
          { name: 'Tahoe', trim: 'LS', price: '$59,000', category: 'suv' },
          { name: 'Tahoe', trim: 'LT', price: '$62,000', category: 'suv' },
          { name: 'Tahoe', trim: 'RST', price: '$67,000', category: 'suv' },
          { name: 'Tahoe', trim: 'Z71', price: '$69,000', category: 'suv' },
          { name: 'Tahoe', trim: 'Premier', price: '$73,600', category: 'suv' },
          { name: 'Tahoe', trim: 'High Country', price: '$78,700', category: 'suv' },
        ],
      },
      {
        name: 'Traverse',
        models: [
          { name: 'Traverse', trim: 'LT', price: '$40,700', category: 'suv' },
          { name: 'Traverse', trim: 'Z71', price: '$47,800', category: 'suv' },
          { name: 'Traverse', trim: 'High Country', price: '$53,800', category: 'suv' },
          { name: 'Traverse', trim: 'RS', price: '$54,100', category: 'suv' },
        ],
      },
      {
        name: 'Blazer',
        models: [
          { name: 'Blazer', trim: '2LT', price: '$35,600', category: 'suv' },
          { name: 'Blazer', trim: '3LT', price: '$39,500', category: 'suv' },
          { name: 'Blazer', trim: 'RS', price: '$43,000', category: 'suv' },
          { name: 'Blazer', trim: 'Premier', price: '$43,000', category: 'suv' },
        ],
      },
      {
        name: 'Blazer EV',
        models: [
          { name: 'Blazer EV', trim: 'LT', price: '$44,600', category: 'suv' },
          { name: 'Blazer EV', trim: 'RS', price: '$49,900', category: 'suv' },
          { name: 'Blazer EV', trim: 'SS', price: '$60,600', category: 'suv' },
        ],
      },
      {
        name: 'Trax',
        models: [
          { name: 'Trax', trim: 'LS', price: '$20,500', category: 'suv' },
          { name: 'Trax', trim: '1RS', price: '$22,500', category: 'suv' },
          { name: 'Trax', trim: 'LT', price: '$22,700', category: 'suv' },
          { name: 'Trax', trim: '2RS', price: '$24,500', category: 'suv' },
          { name: 'Trax', trim: 'ACTIV', price: '$24,500', category: 'suv' },
        ],
      },
      {
        name: 'Trailblazer',
        models: [
          { name: 'Trailblazer', trim: 'LS', price: '$23,200', category: 'suv' },
          { name: 'Trailblazer', trim: 'LT', price: '$24,400', category: 'suv' },
          { name: 'Trailblazer', trim: 'ACTIV', price: '$27,800', category: 'suv' },
          { name: 'Trailblazer', trim: 'RS', price: '$27,800', category: 'suv' },
        ],
      },
      {
        name: 'Equinox',
        models: [
          { name: 'Equinox', trim: 'LT', price: '$28,700', category: 'suv' },
          { name: 'Equinox', trim: 'RS', price: '$33,600', category: 'suv' },
          { name: 'Equinox', trim: 'ACTIV', price: '$33,600', category: 'suv' },
        ],
      },
      {
        name: 'Equinox EV',
        models: [
          { name: 'Equinox EV', trim: 'LT 1', price: '$33,600', category: 'suv' },
          { name: 'Equinox EV', trim: 'LT 2', price: '$41,900', category: 'suv' },
          { name: 'Equinox EV', trim: 'RS', price: '$43,400', category: 'suv' },
        ],
      },
    ],
    insuranceInfo: 'Chevy trucks typically cost $140-220/month to insure.',
  },
  {
    id: 'gmc',
    name: 'GMC',
    shortName: 'GMC',
    logo: gmcSierraImg,
    image: gmcSierraImg,
    categories: [
      {
        name: 'Canyon',
        models: [
          { name: 'Canyon', trim: 'Elevation', price: '$38,900', category: 'truck' },
          { name: 'Canyon', trim: 'AT4', price: '$45,400', category: 'truck' },
          { name: 'Canyon', trim: 'AT4X', price: '$57,200', category: 'truck' },
          { name: 'Canyon', trim: 'Denali', price: '$53,000', category: 'truck' },
        ],
      },
      {
        name: 'Sierra 1500',
        models: [
          { name: 'Sierra 1500', trim: 'Pro', price: '$38,300', category: 'truck' },
          { name: 'Sierra 1500', trim: 'SLE', price: '$48,700', category: 'truck' },
          { name: 'Sierra 1500', trim: 'Elevation', price: '$50,500', category: 'truck' },
          { name: 'Sierra 1500', trim: 'SLT', price: '$54,900', category: 'truck' },
          { name: 'Sierra 1500', trim: 'AT4', price: '$66,800', category: 'truck' },
          { name: 'Sierra 1500', trim: 'AT4X', price: '$79,400', category: 'truck' },
          { name: 'Sierra 1500', trim: 'Denali Ultimate', price: '$84,200', category: 'truck' },
        ],
      },
      {
        name: 'Sierra HD',
        models: [
          { name: 'Sierra HD', trim: 'Pro', price: '$46,700', category: 'truck' },
          { name: 'Sierra HD', trim: 'SLE', price: '$53,500', category: 'truck' },
          { name: 'Sierra HD', trim: 'SLT', price: '$64,700', category: 'truck' },
          { name: 'Sierra HD', trim: 'AT4', price: '$71,600', category: 'truck' },
          { name: 'Sierra HD', trim: 'AT4X', price: '$83,700', category: 'truck' },
          { name: 'Sierra HD', trim: 'Denali', price: '$75,000', category: 'truck' },
          { name: 'Sierra HD', trim: 'Denali Ultimate', price: '$93,800', category: 'truck' },
        ],
      },
      {
        name: 'Sierra EV',
        models: [
          { name: 'Sierra EV', trim: 'Elevation', price: '$62,400', category: 'truck' },
          { name: 'Sierra EV', trim: 'AT4', price: '$79,300', category: 'truck' },
          { name: 'Sierra EV', trim: 'Denali', price: '$69,700', category: 'truck' },
        ],
      },
      {
        name: 'Hummer EV Truck',
        models: [
          { name: 'Hummer EV', trim: '2X', price: '$96,600', category: 'truck' },
          { name: 'Hummer EV', trim: '3X', price: '$104,700', category: 'truck' },
        ],
      },
      {
        name: 'Terrain',
        models: [
          { name: 'Terrain', trim: 'Elevation', price: '$30,100', category: 'suv' },
          { name: 'Terrain', trim: 'AT4', price: '$39,300', category: 'suv' },
          { name: 'Terrain', trim: 'Denali', price: '$41,800', category: 'suv' },
        ],
      },
      {
        name: 'Acadia',
        models: [
          { name: 'Acadia', trim: 'Elevation', price: '$43,700', category: 'suv' },
          { name: 'Acadia', trim: 'AT4', price: '$52,300', category: 'suv' },
          { name: 'Acadia', trim: 'Denali', price: '$55,700', category: 'suv' },
          { name: 'Acadia', trim: 'Denali Ultimate', price: '$62,900', category: 'suv' },
        ],
      },
      {
        name: 'Yukon',
        models: [
          { name: 'Yukon', trim: 'Elevation', price: '$69,200', category: 'suv' },
          { name: 'Yukon', trim: 'AT4', price: '$76,000', category: 'suv' },
          { name: 'Yukon', trim: 'AT4 Ultimate', price: '$97,300', category: 'suv' },
          { name: 'Yukon', trim: 'Denali', price: '$80,000', category: 'suv' },
          { name: 'Yukon', trim: 'Denali Ultimate', price: '$103,300', category: 'suv' },
        ],
      },
      {
        name: 'Hummer EV SUV',
        models: [
          { name: 'Hummer EV SUV', trim: '2X', price: '$96,550', category: 'suv' },
          { name: 'Hummer EV SUV', trim: '3X', price: '$104,650', category: 'suv' },
        ],
      },
    ],
    insuranceInfo: 'GMC premium trucks average $160-250/month insurance.',
  },
  {
    id: 'ram',
    name: 'Ram',
    shortName: 'RAM',
    logo: ramTrxImg,
    image: ramTrxImg,
    categories: [
      {
        name: 'RAM 1500',
        models: [
          { name: 'RAM 1500', trim: '2025', price: '$69,995', category: 'truck' },
          { name: 'RAM 1500', trim: '2026', price: '$41,025', category: 'truck' },
          { name: 'RAM 1500', trim: 'Rebel X', price: '$65,000', category: 'truck' },
        ],
      },
      {
        name: 'RAM 2500',
        models: [
          { name: 'RAM 2500', trim: '2025', price: '$45,565', category: 'truck' },
        ],
      },
      {
        name: 'RAM 3500',
        models: [
          { name: 'RAM 3500', trim: '2025', price: '$46,570', category: 'truck' },
        ],
      },
    ],
    insuranceInfo: 'RAM TRX insurance is higher at $200-350/month due to power.',
  },
  {
    id: 'ford',
    name: 'Ford',
    shortName: 'FORD',
    logo: fordBroncoImg,
    image: fordBroncoImg,
    categories: [
      {
        name: 'Maverick',
        models: [
          { name: 'Maverick', trim: 'XL', price: '$28,145', category: 'truck' },
          { name: 'Maverick', trim: 'XLT', price: '$30,645', category: 'truck' },
          { name: 'Maverick', trim: 'Lobo', price: '$35,930', category: 'truck' },
          { name: 'Maverick', trim: 'Lariat', price: '$38,440', category: 'truck' },
          { name: 'Maverick', trim: 'Tremor', price: '$40,995', category: 'truck' },
        ],
      },
      {
        name: 'Ranger',
        models: [
          { name: 'Ranger', trim: 'XL', price: '$33,350', category: 'truck' },
          { name: 'Ranger', trim: 'XLT', price: '$35,375', category: 'truck' },
          { name: 'Ranger', trim: 'Lariat', price: '$43,755', category: 'truck' },
          { name: 'Ranger', trim: 'Raptor', price: '$56,070', category: 'truck' },
        ],
      },
      {
        name: 'F-150',
        models: [
          { name: 'F-150', trim: 'XL', price: '$38,810', category: 'truck' },
          { name: 'F-150', trim: 'STX', price: '$42,015', category: 'truck' },
          { name: 'F-150', trim: 'XLT', price: '$45,695', category: 'truck' },
          { name: 'F-150', trim: 'Lariat', price: '$63,360', category: 'truck' },
          { name: 'F-150', trim: 'Tremor', price: '$64,915', category: 'truck' },
          { name: 'F-150', trim: 'King Ranch', price: '$74,905', category: 'truck' },
          { name: 'F-150', trim: 'Platinum', price: '$74,905', category: 'truck' },
          { name: 'F-150', trim: 'Raptor', price: '$79,005', category: 'truck' },
        ],
      },
      {
        name: 'Bronco',
        models: [
          { name: 'Bronco', trim: 'Base', price: '$39,995', category: 'suv' },
          { name: 'Bronco', trim: 'Big Bend', price: '$40,845', category: 'suv' },
          { name: 'Bronco', trim: 'Outer Banks', price: '$47,940', category: 'suv' },
          { name: 'Bronco', trim: 'Badlands', price: '$49,585', category: 'suv' },
          { name: 'Bronco', trim: 'Heritage Edition', price: '$51,475', category: 'suv' },
          { name: 'Bronco', trim: 'Stroppe Edition', price: '$75,635', category: 'suv' },
          { name: 'Bronco', trim: 'Raptor', price: '$79,995', category: 'suv' },
        ],
      },
      {
        name: 'Bronco Sport',
        models: [
          { name: 'Bronco Sport', trim: 'Big Bend', price: '$31,695', category: 'suv' },
          { name: 'Bronco Sport', trim: 'Heritage', price: '$33,995', category: 'suv' },
          { name: 'Bronco Sport', trim: 'Outer Banks', price: '$36,795', category: 'suv' },
          { name: 'Bronco Sport', trim: 'Badlands', price: '$40,115', category: 'suv' },
        ],
      },
    ],
    insuranceInfo: 'Ford off-road vehicles typically cost $150-250/month to insure.',
  },
];

// Helper function to get all vehicles as a flat list for search
export function getAllVehiclesFlat() {
  const vehicles: { name: string; brand: string; trim: string; price: string; image: string; category: string }[] = [];
  
  brandsData.forEach(brand => {
    brand.categories.forEach(category => {
      category.models.forEach(model => {
        vehicles.push({
          name: model.name,
          brand: brand.name,
          trim: model.trim,
          price: model.price,
          image: brand.image,
          category: model.category,
        });
      });
    });
  });
  
  return vehicles;
}

// Get brand by ID
export function getBrandById(id: string) {
  return brandsData.find(brand => brand.id === id);
}
