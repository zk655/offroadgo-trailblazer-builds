import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Calendar, User, Clock, Share2, Heart, BookOpen, Tag, ArrowRight } from 'lucide-react';
import Navigation from '@/components/Navigation';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';
import AdSenseAd from '@/components/AdSenseAd';
import '../styles/blog.css';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image: string;
  author: string;
  published_at: string;
  tags: string[];
  external_url: string;
}

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [readingTime, setReadingTime] = useState(0);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      // First try to get from local database
      const { data: localPost, error: localError } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .single();

      if (localPost && !localError) {
        setPost(localPost);
        calculateReadingTime(localPost.content);
        fetchRelatedPosts(localPost.tags);
      } else {
        // If not found locally, create a sample detailed post
        const samplePost: BlogPost = {
          id: '1',
          title: getPostTitle(slug),
          slug: slug || '',
          content: generateDetailedContent(slug),
          excerpt: getPostExcerpt(slug),
          cover_image: getPostImage(slug),
          author: 'Off-Road Expert',
          published_at: new Date().toISOString(),
          tags: getPostTags(slug),
          external_url: ''
        };
        setPost(samplePost);
        calculateReadingTime(samplePost.content);
        fetchRelatedPosts(samplePost.tags);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageSrc = (imagePath: string) => {
    // Handle both local assets and external URLs
    if (imagePath.startsWith('/src/assets/')) {
      // For Vite, we need to handle assets differently
      return imagePath.replace('/src/assets/', '/src/assets/');
    }
    return imagePath;
  };

  const getPostImage = (slug: string) => {
    const imageMap: Record<string, string> = {
      'ford-bronco-raptor-2024-review': '/src/assets/blog/ford-bronco-raptor.jpg',
      'jeep-wrangler-modifications-guide': '/src/assets/blog/jeep-modifications.jpg',
      'moab-hells-revenge-trail-guide': '/src/assets/blog/moab-hells-revenge.jpg',
      'recovery-gear-safety-kit-guide': '/src/assets/blog/recovery-gear.jpg',
      'winter-4x4-maintenance-tips': '/src/assets/blog/winter-maintenance.jpg',
      'king-of-hammers-2024-recap': '/src/assets/blog/king-of-hammers.jpg',
      'advanced-winching-techniques-guide': '/src/assets/blog/winching-techniques.jpg',
      'colorado-secret-offroad-destinations': '/src/assets/blog/colorado-destinations.jpg'
    };
    return imageMap[slug] || '/src/assets/blog/ford-bronco-raptor.jpg';
  };

  const getPostTitle = (slug: string) => {
    const titleMap: Record<string, string> = {
      'ford-bronco-raptor-2024-review': 'New 2024 Ford Bronco Raptor: Ultimate Off-Road Beast',
      'jeep-wrangler-modifications-guide': 'Top 10 Must-Have Modifications for Your Jeep Wrangler',
      'moab-hells-revenge-trail-guide': 'Moab Trail Guide: Hell\'s Revenge Complete Walkthrough',
      'recovery-gear-safety-kit-guide': 'Essential Recovery Gear: Complete Safety Kit Guide',
      'winter-4x4-maintenance-tips': 'Winter Maintenance Tips for Your 4x4',
      'king-of-hammers-2024-recap': 'King of the Hammers 2024: Event Recap and Highlights',
      'advanced-winching-techniques-guide': 'Advanced Winching Techniques for Extreme Recovery',
      'colorado-secret-offroad-destinations': 'Hidden Gems: Secret Off-Road Destinations in Colorado'
    };
    return titleMap[slug] || 'The Ultimate Guide to Off-Road Adventures';
  };

  const getPostExcerpt = (slug: string) => {
    const excerptMap: Record<string, string> = {
      'ford-bronco-raptor-2024-review': 'Comprehensive review of the 2024 Ford Bronco Raptor, featuring enhanced suspension, powerful engine, and advanced off-road technology.',
      'jeep-wrangler-modifications-guide': 'Transform your Jeep Wrangler with these essential modifications that enhance performance, capability, and style.',
      'moab-hells-revenge-trail-guide': 'Complete guide to conquering Hell\'s Revenge trail in Moab, including difficulty ratings, key obstacles, and safety tips.',
      'recovery-gear-safety-kit-guide': 'Build the ultimate recovery kit with our comprehensive guide to essential safety equipment for off-road adventures.',
      'winter-4x4-maintenance-tips': 'Keep your 4x4 running smoothly through winter with these essential maintenance tips and cold-weather preparations.',
      'king-of-hammers-2024-recap': 'Relive the excitement of King of the Hammers 2024 with our comprehensive event recap and race highlights.',
      'advanced-winching-techniques-guide': 'Master advanced winching techniques for safe and effective vehicle recovery in challenging off-road situations.',
      'colorado-secret-offroad-destinations': 'Discover Colorado\'s best-kept off-road secrets with our guide to hidden trails and spectacular destinations.'
    };
    return excerptMap[slug] || 'Discover everything you need to know about off-road adventures, from choosing the right vehicle to mastering challenging terrains.';
  };

  const getPostTags = (slug: string) => {
    const tagsMap: Record<string, string[]> = {
      'ford-bronco-raptor-2024-review': ['vehicles', 'ford', 'bronco', 'review'],
      'jeep-wrangler-modifications-guide': ['modifications', 'jeep', 'wrangler', 'upgrade'],
      'moab-hells-revenge-trail-guide': ['trails', 'moab', 'utah', 'guide'],
      'recovery-gear-safety-kit-guide': ['gear', 'safety', 'recovery', 'equipment'],
      'winter-4x4-maintenance-tips': ['maintenance', 'winter', '4x4', 'tips'],
      'king-of-hammers-2024-recap': ['events', 'racing', 'koh', 'community'],
      'advanced-winching-techniques-guide': ['safety', 'recovery', 'winching', 'techniques'],
      'colorado-secret-offroad-destinations': ['destinations', 'colorado', 'trails', 'adventure']
    };
    return tagsMap[slug] || ['adventure', 'off-road', 'guide', '4x4'];
  };

  const generateDetailedContent = (slug: string) => {
    const contentMap: Record<string, string> = {
      'jeep-wrangler-modifications-guide': `
        <div class="space-y-8">
          <div class="text-center mb-8">
            <img src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=400&fit=crop&crop=center" alt="Modified Jeep Wrangler on trail" class="w-full h-64 object-cover rounded-lg shadow-lg mb-4" />
            <p class="text-sm text-muted-foreground">A well-modified Jeep Wrangler conquering challenging terrain</p>
          </div>

          <h2 class="text-3xl font-bold text-foreground mb-6">The Ultimate Jeep Wrangler Modification Guide</h2>
          <p class="text-lg leading-relaxed mb-8">The Jeep Wrangler stands as America's most modification-friendly vehicle, offering endless possibilities for customization. Whether you're a weekend warrior or a hardcore rock crawler, transforming your Wrangler into the ultimate off-road machine requires careful planning and the right modifications. This comprehensive guide covers the top 10 essential modifications that will dramatically improve your Jeep's capability, comfort, and style.</p>

          <div class="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg mb-8">
            <h3 class="text-2xl font-bold mb-4">🚗 1. Lift Kit - The Foundation of Every Build</h3>
            <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=300&fit=crop&crop=center" alt="Jeep suspension lift kit installation" class="w-full h-48 object-cover rounded-lg mb-4" />
            
            <p class="text-base leading-relaxed mb-4">A quality lift kit serves as the foundation for virtually every other modification you'll make to your Wrangler. Beyond the obvious benefit of increased ground clearance, a proper lift kit transforms your vehicle's geometry, improving approach angles, departure angles, and breakover angles that are crucial for tackling challenging obstacles.</p>
            
            <h4 class="text-xl font-semibold mb-3">Types of Lift Kits</h4>
            
            <div class="space-y-4 ml-4">
              <div class="bg-background/50 p-4 rounded-lg">
                <h5 class="font-bold text-lg mb-2">Budget Lift (2-3 inches)</h5>
                <ul class="list-disc ml-6 space-y-2">
                  <li><strong>Body Lift:</strong> $200-500 - Raises body from frame using spacers</li>
                  <li><strong>Spacer Lift:</strong> $300-800 - Uses coil spacers and shock extensions</li>
                  <li><strong>Pros:</strong> Affordable, maintains ride quality, minimal modifications needed</li>
                  <li><strong>Cons:</strong> Limited capability improvement, may affect handling</li>
                </ul>
              </div>

              <div class="bg-background/50 p-4 rounded-lg">
                <h5 class="font-bold text-lg mb-2">Suspension Lift (2-4 inches)</h5>
                <ul class="list-disc ml-6 space-y-2">
                  <li><strong>Complete Kit:</strong> $800-2500 - New springs, shocks, control arms</li>
                  <li><strong>Long Arm Kit:</strong> $1500-4000 - Extended control arms for better geometry</li>
                  <li><strong>Pros:</strong> Improved suspension travel, better articulation, maintains ride quality</li>
                  <li><strong>Cons:</strong> Higher cost, more complex installation</li>
                </ul>
              </div>

              <div class="bg-background/50 p-4 rounded-lg">
                <h5 class="font-bold text-lg mb-2">Extreme Lift (4+ inches)</h5>
                <ul class="list-disc ml-6 space-y-2">
                  <li><strong>Long Arm System:</strong> $3000-8000+ - Complete suspension overhaul</li>
                  <li><strong>Pros:</strong> Maximum clearance, extreme capability, impressive appearance</li>
                  <li><strong>Cons:</strong> Expensive, affects daily drivability, requires supporting modifications</li>
                </ul>
              </div>
            </div>

            <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6">
              <h5 class="font-bold mb-2">💡 Expert Tip</h5>
              <p>Choose your lift height based on your intended use. Daily drivers should stick to 2-3 inches, while dedicated trail rigs can benefit from more aggressive setups.</p>
            </div>
          </div>

          <div class="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg mb-8">
            <h3 class="text-2xl font-bold mb-4">🛞 2. Larger Tires - Where the Rubber Meets the Rock</h3>
            <img src="https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&h=300&fit=crop&crop=center" alt="Large all-terrain tires on Jeep" class="w-full h-48 object-cover rounded-lg mb-4" />
            
            <p class="text-base leading-relaxed mb-4">Tire selection represents one of the most impactful modifications you can make to your Wrangler. The right tires not only improve traction on various surfaces but also enhance your vehicle's appearance and capability. However, choosing the correct size requires understanding the relationship between tire diameter, lift height, and required modifications.</p>
            
            <h4 class="text-xl font-semibold mb-3">Tire Size Progression</h4>
            
            <div class="grid md:grid-cols-2 gap-6">
              <div class="bg-background/50 p-4 rounded-lg">
                <h5 class="font-bold text-lg mb-2">33" Tires (285/70R17)</h5>
                <ul class="list-disc ml-6 space-y-1">
                  <li>Minimum lift: Stock to 2.5"</li>
                  <li>Popular brands: BFG KO2, Falken Wildpeak</li>
                  <li>Best for: Daily driving with weekend adventures</li>
                  <li>Modifications needed: Minimal to none</li>
                </ul>
              </div>

              <div class="bg-background/50 p-4 rounded-lg">
                <h5 class="font-bold text-lg mb-2">35" Tires (315/70R17)</h5>
                <ul class="list-disc ml-6 space-y-1">
                  <li>Minimum lift: 2.5-3.5"</li>
                  <li>Sweet spot for most Jeep owners</li>
                  <li>May require: Fender trimming, bump stops</li>
                  <li>Gear ratio: Consider regearing to 4.56 or 4.88</li>
                </ul>
              </div>

              <div class="bg-background/50 p-4 rounded-lg">
                <h5 class="font-bold text-lg mb-2">37" Tires (37x12.50R17)</h5>
                <ul class="list-disc ml-6 space-y-1">
                  <li>Minimum lift: 3.5-4.5"</li>
                  <li>Requires: Significant fender modification</li>
                  <li>Gear ratio: 4.88 or 5.13 strongly recommended</li>
                  <li>Best for: Dedicated off-road builds</li>
                </ul>
              </div>

              <div class="bg-background/50 p-4 rounded-lg">
                <h5 class="font-bold text-lg mb-2">40"+ Tires</h5>
                <ul class="list-disc ml-6 space-y-1">
                  <li>Minimum lift: 6"+ with long arms</li>
                  <li>Requires: Extensive modifications</li>
                  <li>Consider: Axle upgrades, steering reinforcement</li>
                  <li>Purpose: Competition or extreme rock crawling</li>
                </ul>
              </div>
            </div>

            <h4 class="text-xl font-semibold mb-3 mt-6">Tire Types and Tread Patterns</h4>
            <div class="space-y-3 ml-4">
              <p><strong>All-Terrain (A/T):</strong> Best balance of on-road comfort and off-road capability. Ideal for daily drivers who venture off-road occasionally.</p>
              <p><strong>Mud-Terrain (M/T):</strong> Aggressive tread for maximum off-road traction. Trade-off in road noise and fuel economy.</p>
              <p><strong>Hybrid/Rugged Terrain:</strong> Newer category offering aggressive looks with better on-road manners than traditional M/T tires.</p>
            </div>
          </div>

          <div class="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-lg mb-8">
            <h3 class="text-2xl font-bold mb-4">🛡️ 3. Armor and Protection - Shields for Your Steed</h3>
            <img src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&h=300&fit=crop&crop=center" alt="Jeep with rock sliders and armor" class="w-full h-48 object-cover rounded-lg mb-4" />
            
            <p class="text-base leading-relaxed mb-4">Protection systems serve dual purposes: safeguarding your investment and improving your vehicle's capability. Quality armor allows you to tackle more challenging terrain with confidence, knowing your critical components are protected from rocks, stumps, and other trail hazards.</p>
            
            <h4 class="text-xl font-semibold mb-3">Essential Armor Components</h4>
            
            <div class="grid gap-6">
              <div class="bg-background/50 p-4 rounded-lg">
                <h5 class="font-bold text-lg mb-2">Front Bumpers ($800-2500)</h5>
                <ul class="list-disc ml-6 space-y-2">
                  <li><strong>Stubby Bumpers:</strong> Improved approach angle, lighter weight</li>
                  <li><strong>Full Width:</strong> Maximum protection, integrated fog lights</li>
                  <li><strong>Features to look for:</strong> Winch mounting, D-ring mounts, LED provisions</li>
                  <li><strong>Popular brands:</strong> Rugged Ridge, Smittybilt, Rock Hard 4x4</li>
                </ul>
              </div>

              <div class="bg-background/50 p-4 rounded-lg">
                <h5 class="font-bold text-lg mb-2">Rock Sliders ($400-1200 per pair)</h5>
                <ul class="list-disc ml-6 space-y-2">
                  <li><strong>Body Mount:</strong> Attaches to body, adequate for light use</li>
                  <li><strong>Frame Mount:</strong> Bolts to frame, handles serious rock contact</li>
                  <li><strong>Consider:</strong> Step integration for easy entry/exit</li>
                  <li><strong>Material:</strong> Steel for strength, aluminum for weight savings</li>
                </ul>
              </div>

              <div class="bg-background/50 p-4 rounded-lg">
                <h5 class="font-bold text-lg mb-2">Skid Plates ($300-800 complete set)</h5>
                <ul class="list-disc ml-6 space-y-2">
                  <li><strong>Engine/Transmission:</strong> Protects oil pan and transmission case</li>
                  <li><strong>Transfer Case:</strong> Shields lowest hanging component</li>
                  <li><strong>Fuel Tank:</strong> Essential for serious rock crawling</li>
                  <li><strong>Material options:</strong> Steel (strength) vs Aluminum (weight)</li>
                </ul>
              </div>

              <div class="bg-background/50 p-4 rounded-lg">
                <h5 class="font-bold text-lg mb-2">Rear Bumpers ($600-1800)</h5>
                <ul class="list-disc ml-6 space-y-2">
                  <li><strong>Swing-out tire carriers:</strong> Free up interior space</li>
                  <li><strong>Receiver hitches:</strong> For trailers and accessories</li>
                  <li><strong>Recovery points:</strong> Essential for vehicle recovery</li>
                  <li><strong>Consider:</strong> Integrated jerry can and tool mounts</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg mb-8">
            <h3 class="text-2xl font-bold mb-4">⚙️ 4. Winch System - Your Mechanical Lifeline</h3>
            <img src="https://images.unsplash.com/photo-1551698618-13641e14c4eb?w=600&h=300&fit=crop&crop=center" alt="Winch recovery operation" class="w-full h-48 object-cover rounded-lg mb-4" />
            
            <p class="text-base leading-relaxed mb-4">A winch system represents the ultimate insurance policy for off-road adventures. Whether you're stuck in mud, sand, or wedged between rocks, a quality winch can mean the difference between self-recovery and an expensive tow truck call. However, selecting and installing a winch system involves more than just picking the highest pulling capacity.</p>
            
            <h4 class="text-xl font-semibold mb-3">Winch Selection Criteria</h4>
            
            <div class="bg-background/50 p-4 rounded-lg mb-4">
              <h5 class="font-bold text-lg mb-2">Capacity Calculation</h5>
              <p class="mb-2">The golden rule: Choose a winch rated for 1.5 times your vehicle's Gross Vehicle Weight (GVW).</p>
              <ul class="list-disc ml-6 space-y-1">
                <li><strong>JK/JL Wrangler GVW:</strong> ~5,000-6,000 lbs</li>
                <li><strong>Recommended capacity:</strong> 9,000-12,000 lbs</li>
                <li><strong>Popular sizes:</strong> 9,500, 10,000, and 12,000 lb models</li>
              </ul>
            </div>

            <div class="grid md:grid-cols-2 gap-6">
              <div class="bg-background/50 p-4 rounded-lg">
                <h5 class="font-bold text-lg mb-2">Cable Types</h5>
                <p class="mb-2"><strong>Steel Cable</strong></p>
                <ul class="list-disc ml-6 space-y-1 mb-3">
                  <li>Pros: Durable, heat resistant, affordable</li>
                  <li>Cons: Heavy, stores energy when under load</li>
                  <li>Best for: Heavy-duty use, budget builds</li>
                </ul>
                <p class="mb-2"><strong>Synthetic Rope</strong></p>
                <ul class="list-disc ml-6 space-y-1">
                  <li>Pros: Lightweight, safer, easier to handle</li>
                  <li>Cons: More expensive, UV sensitive</li>
                  <li>Best for: Frequent use, safety-conscious users</li>
                </ul>
              </div>

              <div class="bg-background/50 p-4 rounded-lg">
                <h5 class="font-bold text-lg mb-2">Essential Accessories</h5>
                <ul class="list-disc ml-6 space-y-1">
                  <li><strong>Tree saver strap:</strong> Protect trees and provide anchor points</li>
                  <li><strong>Snatch blocks:</strong> Change pulling direction and double capacity</li>
                  <li><strong>D-ring shackles:</strong> Connect winch line to recovery points</li>
                  <li><strong>Damper/blanket:</strong> Safety device for broken cables</li>
                  <li><strong>Wireless remote:</strong> Safer operation from a distance</li>
                  <li><strong>Recovery gloves:</strong> Protect hands during operations</li>
                </ul>
              </div>
            </div>

            <div class="bg-red-50 border-l-4 border-red-400 p-4 mt-6">
              <h5 class="font-bold mb-2">⚠️ Safety Warning</h5>
              <p>Winching can be dangerous. Always use proper techniques, safety equipment, and never exceed rated capacities. Consider taking a recovery course before your first off-road adventure.</p>
            </div>
          </div>

          <div class="bg-gradient-to-r from-yellow-50 to-green-50 p-6 rounded-lg mb-8">
            <h3 class="text-2xl font-bold mb-4">💡 5. LED Lighting - Illuminating Your Adventures</h3>
            <img src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&h=300&fit=crop&crop=center" alt="Jeep with LED light bar at night" class="w-full h-48 object-cover rounded-lg mb-4" />
            
            <p class="text-base leading-relaxed mb-4">Modern LED lighting technology has revolutionized off-road illumination, providing incredible brightness while consuming minimal power. A well-planned lighting system extends your adventures into the night while improving safety and confidence on challenging terrain.</p>
            
            <h4 class="text-xl font-semibold mb-3">Lighting System Components</h4>
            
            <div class="space-y-4">
              <div class="bg-background/50 p-4 rounded-lg">
                <h5 class="font-bold text-lg mb-2">LED Light Bars</h5>
                <div class="grid md:grid-cols-2 gap-4">
                  <div>
                    <p class="mb-2"><strong>Single Row (20"-50")</strong></p>
                    <ul class="list-disc ml-6 space-y-1">
                      <li>Lower profile, less wind noise</li>
                      <li>Good for everyday use</li>
                      <li>15,000-30,000 lumens typical</li>
                    </ul>
                  </div>
                  <div>
                    <p class="mb-2"><strong>Double Row (20"-50")</strong></p>
                    <ul class="list-disc ml-6 space-y-1">
                      <li>Maximum brightness output</li>
                      <li>Best for serious night driving</li>
                      <li>30,000-60,000+ lumens</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div class="bg-background/50 p-4 rounded-lg">
                <h5 class="font-bold text-lg mb-2">Auxiliary Lighting Options</h5>
                <ul class="list-disc ml-6 space-y-2">
                  <li><strong>Fog Lights:</strong> Wide, low beam pattern for dust and weather</li>
                  <li><strong>Driving Lights:</strong> Long-range spot beam for trail running</li>
                  <li><strong>Rock Lights:</strong> Close-range lighting for precise wheel placement</li>
                  <li><strong>Camp Lights:</strong> Area lighting for basecamp setup</li>
                  <li><strong>Reverse Lights:</strong> Backup assistance and trailer hookup</li>
                </ul>
              </div>

              <div class="bg-background/50 p-4 rounded-lg">
                <h5 class="font-bold text-lg mb-2">Installation Considerations</h5>
                <ul class="list-disc ml-6 space-y-2">
                  <li><strong>Electrical system:</strong> Use proper relays and fusing</li>
                  <li><strong>Switch panels:</strong> Centralized control for multiple lights</li>
                  <li><strong>Beam patterns:</strong> Combine spot and flood for optimal coverage</li>
                  <li><strong>Legal compliance:</strong> Check local laws for light bar usage</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg mb-8">
            <h3 class="text-2xl font-bold mb-4">🔒 6. Differential Lockers - Maximizing Traction</h3>
            <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=300&fit=crop&crop=center" alt="Differential locker mechanism" class="w-full h-48 object-cover rounded-lg mb-4" />
            
            <p class="text-base leading-relaxed mb-4">Differential lockers represent one of the most significant capability upgrades available for your Wrangler. By forcing both wheels on an axle to turn at the same speed, lockers ensure maximum traction is available when navigating challenging obstacles. Understanding the different types and their applications is crucial for making the right choice.</p>
            
            <h4 class="text-xl font-semibold mb-3">Types of Lockers</h4>
            
            <div class="space-y-4">
              <div class="bg-background/50 p-4 rounded-lg">
                <h5 class="font-bold text-lg mb-2">Air Lockers ($1200-1800 each)</h5>
                <ul class="list-disc ml-6 space-y-2">
                  <li><strong>Operation:</strong> Pneumatic engagement via dashboard switch</li>
                  <li><strong>Pros:</strong> On-demand operation, maintains normal driving</li>
                  <li><strong>Cons:</strong> Complex installation, requires air compressor</li>
                  <li><strong>Best for:</strong> Daily drivers who need maximum capability</li>
                  <li><strong>Popular brands:</strong> ARB, Eaton E-Lockers</li>
                </ul>
              </div>

              <div class="bg-background/50 p-4 rounded-lg">
                <h5 class="font-bold text-lg mb-2">Automatic Lockers ($600-1000 each)</h5>
                <ul class="list-disc ml-6 space-y-2">
                  <li><strong>Operation:</strong> Mechanical engagement based on wheel speed difference</li>
                  <li><strong>Pros:</strong> Always ready, no switches or compressors needed</li>
                  <li><strong>Cons:</strong> Can affect normal driving feel, clicking sounds</li>
                  <li><strong>Best for:</strong> Dedicated off-road vehicles</li>
                  <li><strong>Popular brands:</strong> Detroit Locker, Powertrax</li>
                </ul>
              </div>

              <div class="bg-background/50 p-4 rounded-lg">
                <h5 class="font-bold text-lg mb-2">Limited Slip Differentials ($400-800 each)</h5>
                <ul class="list-disc ml-6 space-y-2">
                  <li><strong>Operation:</strong> Clutch or gear-based limited slip action</li>
                  <li><strong>Pros:</strong> Improved traction with normal driving feel</li>
                  <li><strong>Cons:</strong> Less effective than true lockers</li>
                  <li><strong>Best for:</strong> Light to moderate off-road use</li>
                  <li><strong>Popular brands:</strong> Eaton Truetrac, Auburn Gear</li>
                </ul>
              </div>
            </div>

            <div class="bg-blue-50 border-l-4 border-blue-400 p-4 mt-6">
              <h5 class="font-bold mb-2">💡 Installation Priority</h5>
              <p>Most experts recommend installing a rear locker first, as it provides the most noticeable improvement in traction. Front lockers are beneficial for extreme situations but should be used carefully to avoid driveline damage.</p>
            </div>
          </div>

          <div class="bg-gradient-to-r from-cyan-50 to-teal-50 p-6 rounded-lg mb-8">
            <h3 class="text-2xl font-bold mb-4">🌬️ 7. Snorkel System - Breathing Easy</h3>
            <img src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&h=300&fit=crop&crop=center" alt="Jeep with snorkel crossing water" class="w-full h-48 object-cover rounded-lg mb-4" />
            
            <p class="text-base leading-relaxed mb-4">A snorkel system serves dual purposes: enabling deeper water crossings and providing cleaner air intake in dusty conditions. While often considered an aesthetic modification, a properly installed snorkel can significantly expand your adventure possibilities while protecting your engine.</p>
            
            <h4 class="text-xl font-semibold mb-3">Benefits and Considerations</h4>
            
            <div class="grid md:grid-cols-2 gap-6">
              <div class="bg-background/50 p-4 rounded-lg">
                <h5 class="font-bold text-lg mb-2">Water Crossing Capability</h5>
                <ul class="list-disc ml-6 space-y-2">
                  <li><strong>Stock depth:</strong> 24-30 inches maximum</li>
                  <li><strong>With snorkel:</strong> 48+ inches possible</li>
                  <li><strong>Remember:</strong> Other components still limit depth</li>
                  <li><strong>Critical:</strong> Electrical system waterproofing</li>
                </ul>
              </div>

              <div class="bg-background/50 p-4 rounded-lg">
                <h5 class="font-bold text-lg mb-2">Air Quality Improvement</h5>
                <ul class="list-disc ml-6 space-y-2">
                  <li><strong>Cleaner air:</strong> Intake above dust clouds</li>
                  <li><strong>Cooler air:</strong> Better engine performance</li>
                  <li><strong>Less maintenance:</strong> Reduced air filter changes</li>
                  <li><strong>Group riding:</strong> Avoid dust from lead vehicles</li>
                </ul>
              </div>
            </div>

            <div class="bg-background/50 p-4 rounded-lg mt-4">
              <h5 class="font-bold text-lg mb-2">Installation Requirements</h5>
              <ul class="list-disc ml-6 space-y-2">
                <li><strong>Professional installation recommended:</strong> Requires body modifications</li>
                <li><strong>Quality materials:</strong> UV-resistant plastics and stainless hardware</li>
                <li><strong>Proper sealing:</strong> All connections must be watertight</li>
                <li><strong>Regular maintenance:</strong> Check seals and clean pre-filter regularly</li>
              </ul>
            </div>
          </div>

          <div class="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-lg mb-8">
            <h3 class="text-2xl font-bold mb-4">🪑 8. Interior and Comfort Upgrades</h3>
            <img src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&h=300&fit=crop&crop=center" alt="Jeep interior with protective covers" class="w-full h-48 object-cover rounded-lg mb-4" />
            
            <p class="text-base leading-relaxed mb-4">While capability modifications get most of the attention, interior upgrades significantly improve the off-road experience. Protection, comfort, and functionality enhancements make long trail days more enjoyable while preserving your vehicle's resale value.</p>
            
            <h4 class="text-xl font-semibold mb-3">Essential Interior Modifications</h4>
            
            <div class="space-y-4">
              <div class="bg-background/50 p-4 rounded-lg">
                <h5 class="font-bold text-lg mb-2">Protective Coverings</h5>
                <ul class="list-disc ml-6 space-y-2">
                  <li><strong>Seat covers:</strong> Neoprene or canvas for durability and water resistance</li>
                  <li><strong>Floor liners:</strong> Custom-fit rubber mats for easy cleaning</li>
                  <li><strong>Cargo area protection:</strong> Waterproof liners for gear transport</li>
                  <li><strong>Door sill guards:</strong> Protect from rock and debris damage</li>
                </ul>
              </div>

              <div class="bg-background/50 p-4 rounded-lg">
                <h5 class="font-bold text-lg mb-2">Comfort and Convenience</h5>
                <ul class="list-disc ml-6 space-y-2">
                  <li><strong>Grab handles:</strong> Additional support points for passengers</li>
                  <li><strong>Center console:</strong> Secure storage for valuables</li>
                  <li><strong>Overhead storage:</strong> Nets or pods for lightweight gear</li>
                  <li><strong>Phone/GPS mounts:</strong> Secure device positioning</li>
                </ul>
              </div>

              <div class="bg-background/50 p-4 rounded-lg">
                <h5 class="font-bold text-lg mb-2">Tool and Gear Organization</h5>
                <ul class="list-disc ml-6 space-y-2">
                  <li><strong>Tool bags:</strong> Organized storage for trail tools</li>
                  <li><strong>Fire extinguisher mount:</strong> Safety equipment within reach</li>
                  <li><strong>First aid kit storage:</strong> Easily accessible emergency supplies</li>
                  <li><strong>Recovery gear bags:</strong> Organized storage for straps and shackles</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg mb-8">
            <h3 class="text-2xl font-bold mb-4">🔧 9. Essential Recovery Gear</h3>
            <img src="https://images.unsplash.com/photo-1551698618-13641e14c4eb?w=600&h=300&fit=crop&crop=center" alt="Recovery gear laid out" class="w-full h-48 object-cover rounded-lg mb-4" />
            
            <p class="text-base leading-relaxed mb-4">Recovery gear is your lifeline when adventures go wrong. A well-equipped recovery kit can turn a potential disaster into a minor inconvenience. Building a comprehensive kit requires understanding different recovery scenarios and having the right tools for each situation.</p>
            
            <h4 class="text-xl font-semibold mb-3">Complete Recovery Kit ($800-1500)</h4>
            
            <div class="grid md:grid-cols-2 gap-6">
              <div class="bg-background/50 p-4 rounded-lg">
                <h5 class="font-bold text-lg mb-2">Winching Accessories</h5>
                <ul class="list-disc ml-6 space-y-1">
                  <li><strong>Tree saver strap:</strong> 2-3" x 8-10' (20,000+ lb rating)</li>
                  <li><strong>Snatch blocks:</strong> 2-3 blocks for direction changes</li>
                  <li><strong>D-ring shackles:</strong> 3/4" rated for 9.5 tons minimum</li>
                  <li><strong>Soft shackles:</strong> Lightweight alternative to steel</li>
                </ul>
              </div>

              <div class="bg-background/50 p-4 rounded-lg">
                <h5 class="font-bold text-lg mb-2">Traction Aids</h5>
                <ul class="list-disc ml-6 space-y-1">
                  <li><strong>Traction boards:</strong> MaxTrax or similar for sand/mud</li>
                  <li><strong>Hi-Lift jack:</strong> 48-60" for lifting and winching</li>
                  <li><strong>Jack base:</strong> Prevents sinking in soft terrain</li>
                  <li><strong>Tire repair kit:</strong> Plugs, patches, and portable compressor</li>
                </ul>
              </div>

              <div class="bg-background/50 p-4 rounded-lg">
                <h5 class="font-bold text-lg mb-2">Vehicle Recovery</h5>
                <ul class="list-disc ml-6 space-y-1">
                  <li><strong>Kinetic recovery rope:</strong> 7/8" x 20-30' for dynamic recovery</li>
                  <li><strong>Static tow strap:</strong> Non-stretch for steady pulls</li>
                  <li><strong>Come-along winch:</strong> Manual winching without power winch</li>
                  <li><strong>Shovel:</strong> Collapsible military-style entrenching tool</li>
                </ul>
              </div>

              <div class="bg-background/50 p-4 rounded-lg">
                <h5 class="font-bold text-lg mb-2">Safety Equipment</h5>
                <ul class="list-disc ml-6 space-y-1">
                  <li><strong>Recovery damper:</strong> Weighted blanket for broken cables</li>
                  <li><strong>Work gloves:</strong> Leather or synthetic for cable handling</li>
                  <li><strong>Safety glasses:</strong> Eye protection during recovery</li>
                  <li><strong>Whistle:</strong> Communication tool for spotting</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-r from-green-50 to-yellow-50 p-6 rounded-lg mb-8">
            <h3 class="text-2xl font-bold mb-4">⚡ 10. Performance Tuning and Gearing</h3>
            <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=300&fit=crop&crop=center" alt="Engine performance modifications" class="w-full h-48 object-cover rounded-lg mb-4" />
            
            <p class="text-base leading-relaxed mb-4">Performance modifications optimize your Wrangler's powertrain for the demands of larger tires and off-road use. Proper gearing and engine tuning restore lost performance while improving reliability and longevity under extreme conditions.</p>
            
            <h4 class="text-xl font-semibold mb-3">Gearing Considerations</h4>
            
            <div class="bg-background/50 p-4 rounded-lg mb-4">
              <h5 class="font-bold text-lg mb-2">Gear Ratio Selection</h5>
              <div class="grid md:grid-cols-3 gap-4">
                <div>
                  <p class="font-semibold mb-1">33" Tires</p>
                  <ul class="list-disc ml-6 space-y-1 text-sm">
                    <li>V6: 4.10 or 4.56</li>
                    <li>V8: 3.73 or 4.10</li>
                    <li>Diesel: 3.73 or 4.10</li>
                  </ul>
                </div>
                <div>
                  <p class="font-semibold mb-1">35" Tires</p>
                  <ul class="list-disc ml-6 space-y-1 text-sm">
                    <li>V6: 4.56 or 4.88</li>
                    <li>V8: 4.10 or 4.56</li>
                    <li>Diesel: 4.10 or 4.56</li>
                  </ul>
                </div>
                <div>
                  <p class="font-semibold mb-1">37"+ Tires</p>
                  <ul class="list-disc ml-6 space-y-1 text-sm">
                    <li>V6: 4.88 or 5.13</li>
                    <li>V8: 4.56 or 4.88</li>
                    <li>Diesel: 4.56 or 4.88</li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <div class="bg-background/50 p-4 rounded-lg">
                <h5 class="font-bold text-lg mb-2">Engine Performance Modifications</h5>
                <ul class="list-disc ml-6 space-y-2">
                  <li><strong>Cold air intake:</strong> Improved airflow and engine sound ($200-500)</li>
                  <li><strong>Exhaust system:</strong> Better flow and reduced backpressure ($400-1000)</li>
                  <li><strong>Engine tuning:</strong> Optimize for modifications and fuel type ($300-600)</li>
                  <li><strong>Throttle body:</strong> Increased airflow capacity ($300-800)</li>
                </ul>
              </div>

              <div class="bg-background/50 p-4 rounded-lg">
                <h5 class="font-bold text-lg mb-2">Cooling System Upgrades</h5>
                <ul class="list-disc ml-6 space-y-2">
                  <li><strong>Radiator upgrade:</strong> Increased capacity for towing/hauling</li>
                  <li><strong>Transmission cooler:</strong> Essential for heavy-duty use</li>
                  <li><strong>Engine oil cooler:</strong> Maintains proper oil temperatures</li>
                  <li><strong>Electric fans:</strong> Improved cooling efficiency</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-r from-red-100 to-orange-100 border-l-4 border-red-500 p-6 rounded-lg">
            <h2 class="text-2xl font-bold mb-4">⚠️ Critical Installation and Planning Considerations</h2>
            
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <h4 class="text-xl font-semibold mb-3">Modification Order</h4>
                <ol class="list-decimal ml-6 space-y-2">
                  <li><strong>Plan your build:</strong> Determine end goals before starting</li>
                  <li><strong>Lift and tires:</strong> Foundation modifications first</li>
                  <li><strong>Armor and protection:</strong> Safeguard your investment</li>
                  <li><strong>Recovery equipment:</strong> Safety should never be an afterthought</li>
                  <li><strong>Performance tuning:</strong> Optimize the completed package</li>
                </ol>
              </div>
              
              <div>
                <h4 class="text-xl font-semibold mb-3">Budget Considerations</h4>
                <ul class="list-disc ml-6 space-y-2">
                  <li><strong>Quality over quantity:</strong> Buy once, cry once philosophy</li>
                  <li><strong>Professional installation:</strong> Complex mods need expertise</li>
                  <li><strong>Warranty implications:</strong> Understand what modifications void coverage</li>
                  <li><strong>Resale value:</strong> Some mods help, others hurt</li>
                </ul>
              </div>
            </div>

            <div class="mt-6 p-4 bg-yellow-50 rounded-lg">
              <h4 class="text-xl font-semibold mb-3">🎯 Final Recommendations</h4>
              <p class="text-base leading-relaxed">Building the perfect Jeep Wrangler is a journey, not a destination. Start with your most critical needs and build gradually. Focus on quality components from reputable manufacturers, and don't hesitate to invest in professional installation for complex modifications. Remember that the best modification is the one that matches your actual use case – there's no point in building a rock crawler if you primarily drive forest service roads.</p>
              
              <p class="text-base leading-relaxed mt-4">Most importantly, join the Jeep community. Local clubs, online forums, and off-road events are invaluable resources for learning about modifications, installation tips, and finding the best trails in your area. The Jeep wave isn't just a greeting – it's a sign of membership in one of the most helpful and welcoming automotive communities in the world.</p>
            </div>
          </div>
        </div>
      `,
      'ford-bronco-raptor-2024-review': `
        <div class="space-y-6">
          <h2 class="text-2xl font-bold mb-4">2024 Ford Bronco Raptor Review</h2>
          <p class="text-base leading-relaxed mb-6">The 2024 Ford Bronco Raptor represents the pinnacle of factory off-road performance.</p>
        </div>
      `
    };

    return contentMap[slug] || `
      <div class="space-y-6">
        <h2 class="text-2xl font-bold mb-4">Comprehensive Guide to Off-Road Adventures</h2>
        <p class="text-base leading-relaxed mb-6">This detailed guide covers everything you need to know about off-road adventures.</p>
      </div>
    `;
  };

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const time = Math.ceil(wordCount / wordsPerMinute);
    setReadingTime(time);
  };

  const fetchRelatedPosts = async (tags: string[]) => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .neq('slug', slug)
        .limit(3);

      if (!error && data) {
        setRelatedPosts(data);
      }
    } catch (error) {
      console.error('Error fetching related posts:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-20">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded mb-4 w-1/4" />
            <div className="h-12 bg-muted rounded mb-6" />
            <div className="h-64 bg-muted rounded mb-6" />
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-muted rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-6">The blog post you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title={`${post.title} - OffRoadGo Blog`}
        description={post.excerpt}
        keywords={post.tags?.join(', ')}
        url={`/blog/${post.slug}`}
        image={post.cover_image}
      />
      <Navigation />
      
      <div className="container mx-auto px-4 pt-20 pb-12">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </Button>

        {/* Article Header */}
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 space-y-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags?.map(tag => (
                <Badge key={tag} variant="secondary" className="text-sm px-3 py-1">
                  <Tag className="mr-1 h-3 w-3" />
                  {tag}
                </Badge>
              ))}
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-foreground">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-muted-foreground text-sm md:text-base">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-medium">{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(post.published_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{readingTime} min read</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleShare} className="h-8 px-3">
                <Share2 className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Share</span>
              </Button>
            </div>
          </div>

          {/* Featured Image */}
          <div className="mb-6 sm:mb-8 overflow-hidden rounded-lg shadow-lg bg-muted">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover hover:scale-105 transition-transform duration-500"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&h=600&fit=crop';
              }}
            />
          </div>

          {/* Ad Section 1 - After Header */}
          <section className="py-4 mb-8">
            <AdSenseAd 
              slot="8773228071"
              layout="in-article"
              className="w-full"
            />
          </section>

          {/* Article Content */}
          <article className="mb-12 blog-content">
            <div className="prose prose-base sm:prose-lg dark:prose-invert max-w-none 
                          prose-headings:text-foreground prose-headings:font-bold 
                          prose-h2:text-xl sm:prose-h2:text-2xl prose-h2:mt-6 sm:prose-h2:mt-8 prose-h2:mb-3 sm:prose-h2:mb-4 
                          prose-h3:text-lg sm:prose-h3:text-xl prose-h3:mt-4 sm:prose-h3:mt-6 prose-h3:mb-2 sm:prose-h3:mb-3 
                          prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:text-sm sm:prose-p:text-base prose-p:mb-4
                          prose-ul:my-3 sm:prose-ul:my-4 prose-li:my-1 sm:prose-li:my-2 prose-li:text-sm sm:prose-li:text-base
                          prose-strong:text-foreground prose-strong:font-semibold">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
          </article>

          {/* Ad Section 2 - Mid Article */}
          <section className="py-4 mb-8">
            <AdSenseAd 
              slot="8773228071"
              layout="in-article"
              className="w-full"
            />
          </section>

          <Separator className="my-8" />

          {/* Author Section */}
          <Card className="mb-8 border-2 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg">
                  <User className="h-8 w-8 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{post.author}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Passionate off-road enthusiast and automotive expert with years of experience in 4x4 adventures. 
                    Dedicated to sharing knowledge and helping fellow adventurers explore the great outdoors safely and responsibly.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">Related Articles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Card key={relatedPost.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border overflow-hidden">
                    <div className="relative overflow-hidden">
                      <img
                        src={relatedPost.cover_image}
                        alt={relatedPost.title}
                        className="w-full h-32 sm:h-40 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <CardContent className="p-4 space-y-3">
                      <h3 className="font-semibold text-sm md:text-base line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                        {relatedPost.title}
                      </h3>
                      <p className="text-xs md:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {relatedPost.excerpt}
                      </p>
                      <Button asChild variant="outline" size="sm" className="w-full text-xs">
                        <Link to={`/blog/${relatedPost.slug}`}>
                          Read More
                          <ArrowRight className="ml-2 h-3 w-3" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Ad Section 3 - Before Footer */}
      <section className="py-4 bg-muted/5 mb-8">
        <div className="container mx-auto px-4">
          <AdSenseAd 
            slot="8773228071"
            layout="in-article"
            className="w-full"
          />
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default BlogDetail;