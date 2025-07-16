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
        <div class="space-y-6">
          <h2 class="text-2xl font-bold text-foreground mb-4">Essential Jeep Wrangler Modifications</h2>
          <p class="text-base leading-relaxed mb-6">The Jeep Wrangler is one of the most modification-friendly vehicles on the market. Whether you're looking to improve capability, comfort, or style, these ten modifications will transform your Wrangler into the ultimate off-road machine.</p>

          <div class="bg-muted/20 p-4 rounded-lg mb-6">
            <h3 class="text-xl font-semibold mb-3">🚗 1. Lift Kit - The Foundation</h3>
            <p class="mb-4">A quality lift kit is often the first modification Jeep owners consider. It provides increased ground clearance, allows for larger tires, and improves approach and departure angles.</p>
            
            <div class="ml-4 space-y-2">
              <h4 class="font-medium text-lg">Lift Kit Options:</h4>
              <ul class="list-disc ml-6 space-y-1">
                <li><strong>2-3 inch lift:</strong> Perfect for daily driving with improved capability</li>
                <li><strong>4-6 inch lift:</strong> Designed for serious off-road use</li>
                <li><strong>Budget boost vs. complete suspension system:</strong> Consider your needs and budget</li>
              </ul>
            </div>
          </div>

          <div class="bg-muted/20 p-4 rounded-lg mb-6">
            <h3 class="text-xl font-semibold mb-3">🛞 2. Larger Tires - Traction Revolution</h3>
            <p class="mb-4">Upgrading to larger, more aggressive tires dramatically improves traction on all surfaces. Popular sizes include 33", 35", and 37" tires, each requiring different levels of modification.</p>
            
            <div class="ml-4">
              <h4 class="font-medium text-lg mb-2">Popular Tire Sizes:</h4>
              <ul class="list-disc ml-6 space-y-1">
                <li><strong>33" tires:</strong> Minimal modifications required</li>
                <li><strong>35" tires:</strong> May require fender trimming</li>
                <li><strong>37" tires:</strong> Extensive modifications needed</li>
              </ul>
            </div>
          </div>

          <div class="bg-muted/20 p-4 rounded-lg mb-6">
            <h3 class="text-xl font-semibold mb-3">🛡️ 3. Bumpers and Armor - Protection First</h3>
            <p class="mb-4">Aftermarket bumpers provide better approach angles, winch mounting points, and protection for your vehicle's vital components.</p>
            
            <div class="ml-4">
              <h4 class="font-medium text-lg mb-2">Essential Armor Components:</h4>
              <ul class="list-disc ml-6 space-y-1">
                <li>Front and rear bumpers with recovery points</li>
                <li>Rock sliders for side protection</li>
                <li>Skid plates for undercarriage protection</li>
                <li>Fender flares for tire clearance</li>
              </ul>
            </div>
          </div>

          <div class="bg-muted/20 p-4 rounded-lg mb-6">
            <h3 class="text-xl font-semibold mb-3">⚙️ 4. Winch System - Your Trail Lifeline</h3>
            <p class="mb-4">A reliable winch can be the difference between adventure and disaster. Choose a winch rated for at least 1.5 times your vehicle's weight.</p>
            
            <div class="ml-4">
              <h4 class="font-medium text-lg mb-2">Winch Selection Tips:</h4>
              <ul class="list-disc ml-6 space-y-1">
                <li>Calculate proper weight rating</li>
                <li>Choose between synthetic and steel cable</li>
                <li>Consider wireless remote options</li>
                <li>Don't forget recovery accessories</li>
              </ul>
            </div>
          </div>

          <div class="bg-muted/20 p-4 rounded-lg mb-6">
            <h3 class="text-xl font-semibold mb-3">💡 5. LED Lighting - See and Be Seen</h3>
            <p class="mb-4">LED light bars and auxiliary lights improve visibility during night driving and add a distinctive look to your Jeep.</p>
            
            <div class="ml-4">
              <h4 class="font-medium text-lg mb-2">Lighting Options:</h4>
              <ul class="list-disc ml-6 space-y-1">
                <li>LED light bar for maximum coverage</li>
                <li>Fog lights for weather conditions</li>
                <li>Rock lights for close-up visibility</li>
                <li>Headlight upgrades for better performance</li>
              </ul>
            </div>
          </div>

          <div class="bg-muted/20 p-4 rounded-lg mb-6">
            <h3 class="text-xl font-semibold mb-3">🔒 6. Air Lockers - Maximum Traction</h3>
            <p class="mb-4">Locking differentials provide maximum traction in challenging conditions by ensuring both wheels on an axle turn at the same speed.</p>
          </div>

          <div class="bg-muted/20 p-4 rounded-lg mb-6">
            <h3 class="text-xl font-semibold mb-3">🌬️ 7. Snorkel - Deep Water Capability</h3>
            <p class="mb-4">A snorkel allows for deeper water crossings and provides cleaner air intake for dusty conditions.</p>
          </div>

          <div class="bg-muted/20 p-4 rounded-lg mb-6">
            <h3 class="text-xl font-semibold mb-3">🪑 8. Interior Upgrades - Comfort Matters</h3>
            <p class="mb-4">Seat covers, floor liners, and grab handles improve comfort and durability for off-road adventures.</p>
          </div>

          <div class="bg-muted/20 p-4 rounded-lg mb-6">
            <h3 class="text-xl font-semibold mb-3">🔧 9. Recovery Gear - Be Prepared</h3>
            <p class="mb-4">Essential recovery equipment should be easily accessible and properly secured in your Jeep.</p>
          </div>

          <div class="bg-muted/20 p-4 rounded-lg mb-6">
            <h3 class="text-xl font-semibold mb-3">⚡ 10. Performance Tuning - Optimize Everything</h3>
            <p class="mb-4">Engine tuning can optimize performance for larger tires and improved throttle response.</p>
          </div>

          <div class="bg-primary/10 p-6 rounded-lg mt-8">
            <h2 class="text-2xl font-bold mb-4">⚠️ Installation Considerations</h2>
            <p class="mb-4">While many modifications can be DIY projects, complex installations like lift kits and lockers are best left to professionals.</p>
            <ul class="list-disc ml-6 space-y-2">
              <li>Always consider warranty implications</li>
              <li>Choose reputable brands with good customer support</li>
              <li>Plan modifications in logical order</li>
              <li>Budget for professional installation when needed</li>
            </ul>
          </div>
        </div>
      `,
      'ford-bronco-raptor-2024-review': `
        <div class="space-y-6">
          <h2 class="text-2xl font-bold mb-4">Introduction to the 2024 Ford Bronco Raptor</h2>
          <p class="text-base leading-relaxed mb-6">The 2024 Ford Bronco Raptor represents the pinnacle of factory off-road performance, combining the legendary Bronco heritage with Ford's high-performance Raptor DNA.</p>
          
          <div class="bg-muted/20 p-4 rounded-lg mb-6">
            <h3 class="text-xl font-semibold mb-3">🚗 Engine and Performance</h3>
            <p class="mb-4">At the heart of the Bronco Raptor lies a twin-turbocharged 3.0-liter EcoBoost V6 engine, producing an impressive 418 horsepower and 440 lb-ft of torque.</p>
          </div>
          
          <div class="bg-muted/20 p-4 rounded-lg mb-6">
            <h3 class="text-xl font-semibold mb-3">🛞 Suspension and Chassis</h3>
            <p class="mb-4">Fox Racing 3.1 Internal Bypass shocks with position-sensitive dampening provide exceptional control over rough terrain.</p>
          </div>
        </div>
      `
    };

    return contentMap[slug] || `
      <div class="space-y-6">
        <h2 class="text-2xl font-bold mb-4">Comprehensive Guide to Off-Road Adventures</h2>
        <p class="text-base leading-relaxed mb-6">This detailed guide covers everything you need to know about off-road adventures, providing expert insights and practical advice.</p>
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