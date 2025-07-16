// Service for fetching blog content from external APIs and managing categories
import fordBroncoImage from '@/assets/blog/ford-bronco-raptor.jpg';
import jeepModificationsImage from '@/assets/blog/jeep-modifications.jpg';
import moabTrailImage from '@/assets/blog/moab-hells-revenge.jpg';
import recoveryGearImage from '@/assets/blog/recovery-gear.jpg';
import winterMaintenanceImage from '@/assets/blog/winter-maintenance.jpg';
import kingOfHammersImage from '@/assets/blog/king-of-hammers.jpg';
import winchingTechniquesImage from '@/assets/blog/winching-techniques.jpg';
import coloradoDestinationsImage from '@/assets/blog/colorado-destinations.jpg';

interface ExternalBlogPost {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
  content?: string;
}

interface RedditPost {
  data: {
    title: string;
    selftext: string;
    url: string;
    thumbnail: string;
    created_utc: number;
    author: string;
    subreddit: string;
    ups: number;
  };
}

export interface BlogCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
}

export const blogCategories: BlogCategory[] = [
  {
    id: 'vehicles',
    name: '4x4 Vehicles',
    description: 'Reviews, comparisons, and guides for off-road vehicles',
    color: 'bg-blue-500',
    icon: '🚗'
  },
  {
    id: 'modifications',
    name: 'Modifications',
    description: 'Vehicle modifications, upgrades, and DIY guides',
    color: 'bg-green-500',
    icon: '🔧'
  },
  {
    id: 'trails',
    name: 'Trail Guides',
    description: 'Trail reviews, maps, and adventure stories',
    color: 'bg-orange-500',
    icon: '🏔️'
  },
  {
    id: 'gear',
    name: 'Gear & Equipment',
    description: 'Reviews of off-road gear and equipment',
    color: 'bg-purple-500',
    icon: '⚙️'
  },
  {
    id: 'maintenance',
    name: 'Maintenance',
    description: 'Vehicle maintenance tips and tutorials',
    color: 'bg-red-500',
    icon: '🛠️'
  },
  {
    id: 'events',
    name: 'Events & Community',
    description: 'Off-road events, meetups, and community news',
    color: 'bg-yellow-500',
    icon: '🏁'
  },
  {
    id: 'safety',
    name: 'Safety & Recovery',
    description: 'Safety tips and recovery techniques',
    color: 'bg-pink-500',
    icon: '🚨'
  },
  {
    id: 'destinations',
    name: 'Destinations',
    description: 'Off-road destinations and travel guides',
    color: 'bg-teal-500',
    icon: '🗺️'
  }
];

// Generate sample live content for different categories
const generateLiveBlogContent = (): any[] => {
  const samplePosts = [
    {
      id: 'live-1',
      title: 'New 2024 Ford Bronco Raptor: Ultimate Off-Road Beast',
      slug: 'ford-bronco-raptor-2024-review',
      content: generateDetailedContent('Ford Bronco Raptor'),
      excerpt: 'Comprehensive review of the 2024 Ford Bronco Raptor, featuring enhanced suspension, powerful engine, and advanced off-road technology.',
      cover_image: fordBroncoImage,
      author: 'Vehicle Expert',
      published_at: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      tags: ['vehicles', 'ford', 'bronco', 'review'],
      category: 'vehicles',
      external_url: null
    },
    {
      id: 'live-2',
      title: 'Top 10 Must-Have Modifications for Your Jeep Wrangler',
      slug: 'jeep-wrangler-modifications-guide',
      content: generateDetailedContent('Jeep Modifications'),
      excerpt: 'Transform your Jeep Wrangler with these essential modifications that enhance performance, capability, and style.',
      cover_image: jeepModificationsImage,
      author: 'Mod Specialist',
      published_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      tags: ['modifications', 'jeep', 'wrangler', 'upgrade'],
      category: 'modifications',
      external_url: null
    },
    {
      id: 'live-3',
      title: 'Moab Trail Guide: Hell\'s Revenge Complete Walkthrough',
      slug: 'moab-hells-revenge-trail-guide',
      content: generateDetailedContent('Moab Trail Guide'),
      excerpt: 'Complete guide to conquering Hell\'s Revenge trail in Moab, including difficulty ratings, key obstacles, and safety tips.',
      cover_image: moabTrailImage,
      author: 'Trail Master',
      published_at: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      tags: ['trails', 'moab', 'utah', 'guide'],
      category: 'trails',
      external_url: null
    },
    {
      id: 'live-4',
      title: 'Essential Recovery Gear: Complete Safety Kit Guide',
      slug: 'recovery-gear-safety-kit-guide',
      content: generateDetailedContent('Recovery Gear'),
      excerpt: 'Build the ultimate recovery kit with our comprehensive guide to essential safety equipment for off-road adventures.',
      cover_image: recoveryGearImage,
      author: 'Safety Expert',
      published_at: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
      tags: ['gear', 'safety', 'recovery', 'equipment'],
      category: 'gear',
      external_url: null
    },
    {
      id: 'live-5',
      title: 'Winter Maintenance Tips for Your 4x4',
      slug: 'winter-4x4-maintenance-tips',
      content: generateDetailedContent('Winter Maintenance'),
      excerpt: 'Keep your 4x4 running smoothly through winter with these essential maintenance tips and cold-weather preparations.',
      cover_image: winterMaintenanceImage,
      author: 'Maintenance Pro',
      published_at: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
      tags: ['maintenance', 'winter', '4x4', 'tips'],
      category: 'maintenance',
      external_url: null
    },
    {
      id: 'live-6',
      title: 'King of the Hammers 2024: Event Recap and Highlights',
      slug: 'king-of-hammers-2024-recap',
      content: generateDetailedContent('King of the Hammers'),
      excerpt: 'Relive the excitement of King of the Hammers 2024 with our comprehensive event recap and race highlights.',
      cover_image: kingOfHammersImage,
      author: 'Event Reporter',
      published_at: new Date(Date.now() - 518400000).toISOString(), // 6 days ago
      tags: ['events', 'racing', 'koh', 'community'],
      category: 'events',
      external_url: null
    },
    {
      id: 'live-7',
      title: 'Advanced Winching Techniques for Extreme Recovery',
      slug: 'advanced-winching-techniques-guide',
      content: generateDetailedContent('Winching Techniques'),
      excerpt: 'Master advanced winching techniques for safe and effective vehicle recovery in challenging off-road situations.',
      cover_image: winchingTechniquesImage,
      author: 'Recovery Specialist',
      published_at: new Date(Date.now() - 604800000).toISOString(), // 1 week ago
      tags: ['safety', 'recovery', 'winching', 'techniques'],
      category: 'safety',
      external_url: null
    },
    {
      id: 'live-8',
      title: 'Hidden Gems: Secret Off-Road Destinations in Colorado',
      slug: 'colorado-secret-offroad-destinations',
      content: generateDetailedContent('Colorado Destinations'),
      excerpt: 'Discover Colorado\'s best-kept off-road secrets with our guide to hidden trails and spectacular destinations.',
      cover_image: coloradoDestinationsImage,
      author: 'Adventure Guide',
      published_at: new Date(Date.now() - 691200000).toISOString(), // 8 days ago
      tags: ['destinations', 'colorado', 'trails', 'adventure'],
      category: 'destinations',
      external_url: null
    }
  ];

  return samplePosts;
};

const generateDetailedContent = (topic: string): string => {
  const contentMap: Record<string, string> = {
    'Ford Bronco Raptor': `
      <h2>Introduction to the 2024 Ford Bronco Raptor</h2>
      <p>The 2024 Ford Bronco Raptor represents the pinnacle of factory off-road performance, combining the legendary Bronco heritage with Ford's high-performance Raptor DNA. This isn't just another trim level—it's a purpose-built off-road weapon designed to tackle the most challenging terrain with confidence and capability.</p>

      <h2>Engine and Performance</h2>
      <p>At the heart of the Bronco Raptor lies a twin-turbocharged 3.0-liter EcoBoost V6 engine, producing an impressive 418 horsepower and 440 lb-ft of torque. This powerplant is paired with Ford's robust 10-speed automatic transmission, providing smooth power delivery across all driving conditions.</p>

      <h3>Key Performance Specs:</h3>
      <ul>
        <li>418 HP / 440 lb-ft of torque</li>
        <li>10-speed automatic transmission</li>
        <li>Advanced 4WD system with multiple terrain modes</li>
        <li>0-60 mph in 6.0 seconds</li>
      </ul>

      <h2>Suspension and Chassis</h2>
      <p>The Raptor's suspension system is where it truly shines. Fox Racing 3.1 Internal Bypass shocks with position-sensitive dampening provide exceptional control over rough terrain while maintaining comfort on the road.</p>

      <h3>Suspension Features:</h3>
      <ul>
        <li>Fox Racing 3.1 Internal Bypass shocks</li>
        <li>13 inches of front suspension travel</li>
        <li>14 inches of rear suspension travel</li>
        <li>Position-sensitive dampening technology</li>
      </ul>

      <h2>Off-Road Capability</h2>
      <p>With 13.1 inches of ground clearance, 47.4-degree approach angle, and 40.5-degree departure angle, the Bronco Raptor can tackle obstacles that would stop most vehicles in their tracks.</p>

      <h2>Technology and Features</h2>
      <p>The Raptor comes loaded with advanced technology including Trail Turn Assist, Rock Crawl mode, and Baja mode for high-speed desert running. The SYNC 4A infotainment system provides navigation and connectivity features essential for remote adventures.</p>

      <h2>Verdict</h2>
      <p>The 2024 Ford Bronco Raptor successfully combines heritage with modern performance, creating a vehicle that's equally at home on technical rock crawling trails and high-speed desert runs. While the price point positions it as a premium offering, the level of capability and factory engineering justifies the investment for serious off-road enthusiasts.</p>
    `,
    'Jeep Modifications': `
      <h2>Essential Jeep Wrangler Modifications</h2>
      <p>The Jeep Wrangler is one of the most modification-friendly vehicles on the market. Whether you're looking to improve capability, comfort, or style, these ten modifications will transform your Wrangler into the ultimate off-road machine.</p>

      <h2>1. Lift Kit</h2>
      <p>A quality lift kit is often the first modification Jeep owners consider. It provides increased ground clearance, allows for larger tires, and improves approach and departure angles.</p>

      <h3>Lift Kit Options:</h3>
      <ul>
        <li>2-3 inch lift for daily driving with improved capability</li>
        <li>4-6 inch lift for serious off-road use</li>
        <li>Budget boost vs. complete suspension system</li>
      </ul>

      <h2>2. Larger Tires</h2>
      <p>Upgrading to larger, more aggressive tires dramatically improves traction on all surfaces. Popular sizes include 33", 35", and 37" tires, each requiring different levels of modification.</p>

      <h2>3. Bumpers and Armor</h2>
      <p>Aftermarket bumpers provide better approach angles, winch mounting points, and protection for your vehicle's vital components.</p>

      <h3>Armor Components:</h3>
      <ul>
        <li>Front and rear bumpers</li>
        <li>Rock sliders</li>
        <li>Skid plates</li>
        <li>Fender flares</li>
      </ul>

      <h2>4. Winch System</h2>
      <p>A reliable winch can be the difference between adventure and disaster. Choose a winch rated for at least 1.5 times your vehicle's weight.</p>

      <h2>5. LED Lighting</h2>
      <p>LED light bars and auxiliary lights improve visibility during night driving and add a distinctive look to your Jeep.</p>

      <h2>6. Air Lockers</h2>
      <p>Locking differentials provide maximum traction in challenging conditions by ensuring both wheels on an axle turn at the same speed.</p>

      <h2>7. Snorkel</h2>
      <p>A snorkel allows for deeper water crossings and provides cleaner air intake for dusty conditions.</p>

      <h2>8. Interior Upgrades</h2>
      <p>Seat covers, floor liners, and grab handles improve comfort and durability for off-road adventures.</p>

      <h2>9. Recovery Gear</h2>
      <p>Essential recovery equipment should be easily accessible and properly secured in your Jeep.</p>

      <h2>10. Performance Tuning</h2>
      <p>Engine tuning can optimize performance for larger tires and improved throttle response.</p>

      <h2>Installation Considerations</h2>
      <p>While many modifications can be DIY projects, complex installations like lift kits and lockers are best left to professionals. Always consider the warranty implications of modifications and choose reputable brands with good customer support.</p>
    `,
    'Moab Trail Guide': `
      <h2>Hell's Revenge Trail Overview</h2>
      <p>Hell's Revenge is one of Moab's most iconic off-road trails, offering spectacular red rock scenery and challenging obstacles that test both vehicle and driver capabilities. This 6.5-mile trail is rated as moderate to difficult and requires proper preparation and equipment.</p>

      <h2>Trail Difficulty and Requirements</h2>
      <p>Hell's Revenge is rated 4/10 on the difficulty scale, making it accessible to intermediate off-road enthusiasts while still providing excitement for experienced drivers.</p>

      <h3>Vehicle Requirements:</h3>
      <ul>
        <li>4WD system (required)</li>
        <li>Minimum 31" tires recommended</li>
        <li>Skid plates for undercarriage protection</li>
        <li>Tow points or recovery equipment</li>
        <li>Good ground clearance</li>
      </ul>

      <h2>Key Obstacles and Features</h2>
      <p>The trail features several memorable obstacles that have earned their own names among the off-road community.</p>

      <h3>Notable Obstacles:</h3>
      <ul>
        <li><strong>Hell's Gate:</strong> A narrow passage between towering red rocks</li>
        <li><strong>Mickey's Hot Tub:</strong> A large sandstone depression requiring careful navigation</li>
        <li><strong>Escalator:</strong> A steep, slick rock climb</li>
        <li><strong>The Tip-Over Challenge:</strong> A off-camber section requiring precise wheel placement</li>
      </ul>

      <h2>Trail Navigation</h2>
      <p>The trail is well-marked with cairns (rock stacks) and follows established routes across the slickrock. GPS coordinates and a detailed map are recommended for first-time visitors.</p>

      <h3>Starting Point:</h3>
      <p>The trailhead is located off Sand Flats Road, approximately 5 miles from Moab. A day-use fee is required for the Sand Flats Recreation Area.</p>

      <h2>Best Time to Visit</h2>
      <p>Spring (March-May) and fall (September-November) offer the best weather conditions. Summer temperatures can exceed 100°F, making midday travel dangerous. Winter conditions can create icy surfaces on the slickrock.</p>

      <h2>Safety Considerations</h2>
      <p>Safety should be the top priority when running Hell's Revenge or any Moab trail.</p>

      <h3>Essential Safety Tips:</h3>
      <ul>
        <li>Travel with multiple vehicles when possible</li>
        <li>Carry plenty of water (1 gallon per person minimum)</li>
        <li>Inform someone of your planned route and return time</li>
        <li>Check weather conditions before departing</li>
        <li>Carry emergency communication device</li>
      </ul>

      <h2>Environmental Responsibility</h2>
      <p>Moab's fragile desert ecosystem requires responsible recreation practices.</p>

      <h3>Leave No Trace Principles:</h3>
      <ul>
        <li>Stay on designated trails</li>
        <li>Don't stack additional cairns</li>
        <li>Pack out all trash</li>
        <li>Respect wildlife and vegetation</li>
        <li>Camp only in designated areas</li>
      </ul>

      <h2>What to Expect</h2>
      <p>The Hell's Revenge trail typically takes 3-4 hours to complete, depending on group size and skill level. The trail offers stunning views of the Colorado River, Arches National Park, and the La Sal Mountains.</p>

      <h2>Photography Opportunities</h2>
      <p>Hell's Revenge offers numerous photography opportunities, from dramatic landscape shots to action photos of vehicles navigating obstacles. The contrast between red rock and blue sky creates particularly striking images.</p>

      <h2>Conclusion</h2>
      <p>Hell's Revenge represents the quintessential Moab experience, combining technical challenges with breathtaking scenery. Proper preparation, respect for the environment, and a focus on safety will ensure an unforgettable adventure on one of America's most famous off-road trails.</p>
    `
  };

  return contentMap[topic] || `
    <h2>Comprehensive Guide to ${topic}</h2>
    <p>This detailed guide covers everything you need to know about ${topic.toLowerCase()}, providing expert insights and practical advice for off-road enthusiasts.</p>
    
    <h2>Overview</h2>
    <p>Understanding ${topic.toLowerCase()} is crucial for anyone serious about off-road adventures. This comprehensive guide will walk you through the essential information you need.</p>
    
    <h2>Key Considerations</h2>
    <ul>
      <li>Safety should always be your top priority</li>
      <li>Proper preparation prevents poor performance</li>
      <li>Quality equipment makes a significant difference</li>
      <li>Experience is the best teacher</li>
    </ul>
    
    <h2>Best Practices</h2>
    <p>Following established best practices will help ensure your success and safety in all off-road endeavors.</p>
    
    <h2>Conclusion</h2>
    <p>Mastering ${topic.toLowerCase()} takes time and practice, but with the right knowledge and approach, you'll be well-equipped for whatever challenges lie ahead on the trail.</p>
  `;
};

// Fetch automotive news from NewsAPI (free tier available)
export const fetchAutomotiveNews = async (): Promise<ExternalBlogPost[]> => {
  try {
    // For demo purposes, we'll return sample data since NewsAPI requires API key
    // In production, you would use: https://newsapi.org/v2/everything?q=4x4+OR+off-road+OR+jeep+OR+truck&apiKey=YOUR_API_KEY
    
    const sampleNewsData: ExternalBlogPost[] = [
      {
        title: "Latest 4x4 Vehicle Releases and Industry News",
        description: "Stay updated with the latest developments in the 4x4 and off-road vehicle industry, including new releases and technology advances.",
        url: "https://example.com/automotive-news",
        urlToImage: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop",
        publishedAt: new Date().toISOString(),
        source: { name: "Automotive News" }
      }
    ];
    
    return sampleNewsData;
  } catch (error) {
    console.error('Error fetching automotive news:', error);
    return [];
  }
};

// Fetch from Reddit off-road communities
export const fetchRedditPosts = async (): Promise<RedditPost[]> => {
  try {
    // Reddit API endpoint for off-road subreddits
    // const response = await fetch('https://www.reddit.com/r/4x4+offroad+jeep.json?limit=10');
    // const data = await response.json();
    // return data.data.children;
    
    // Sample data for demo
    return [];
  } catch (error) {
    console.error('Error fetching Reddit posts:', error);
    return [];
  }
};

// Get all live blog content
export const getLiveBlogContent = async () => {
  try {
    const [generatedPosts, newsData, redditData] = await Promise.all([
      generateLiveBlogContent(),
      fetchAutomotiveNews(),
      fetchRedditPosts()
    ]);

    // Combine all sources
    const allPosts = [
      ...generatedPosts,
      // Transform external data to match our format
      ...newsData.map((post, index) => ({
        id: `news-${index}`,
        title: post.title,
        slug: post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        content: post.content || generateDetailedContent(post.title),
        excerpt: post.description,
        cover_image: post.urlToImage || 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop',
        author: post.source.name,
        published_at: post.publishedAt,
        tags: ['news', 'automotive', '4x4'],
        category: 'vehicles',
        external_url: post.url
      }))
    ];

    return allPosts;
  } catch (error) {
    console.error('Error getting live blog content:', error);
    return generateLiveBlogContent();
  }
};

export default {
  getLiveBlogContent,
  fetchAutomotiveNews,
  fetchRedditPosts,
  blogCategories
};