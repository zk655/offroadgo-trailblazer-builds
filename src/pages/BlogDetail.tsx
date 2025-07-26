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

  const getPostImage = (slug: string) => {
    const imageMap: Record<string, string> = {
      'ford-bronco-raptor-2024-review': '/src/assets/blog/ford-bronco-raptor.jpg',
      'jeep-wrangler-modifications-guide': '/src/assets/blog/jeep-modifications.jpg',
      'moab-hells-revenge-trail-guide': '/src/assets/blog/moab-hells-revenge.jpg',
      'recovery-gear-safety-kit-guide': '/src/assets/blog/recovery-gear.jpg',
      'winter-4x4-maintenance-tips': '/src/assets/blog/winter-maintenance.jpg',
      'king-of-hammers-2024-recap': '/src/assets/blog/king-of-hammers.jpg',
      'advanced-winching-techniques-guide': '/src/assets/blog/winching-techniques.jpg',
      'colorado-secret-offroad-destinations': '/src/assets/blog/colorado-destinations.jpg',
      'best-tires-rock-crawling-2024': '/src/assets/blog/recovery-gear.jpg'
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
      'colorado-secret-offroad-destinations': 'Hidden Gems: Secret Off-Road Destinations in Colorado',
      'best-tires-rock-crawling-2024': 'Best Tires for Rock Crawling in 2024'
    };
    return titleMap[slug] || 'The Ultimate Guide to Off-Road Adventures';
  };

  const getPostExcerpt = (slug: string) => {
    const excerptMap: Record<string, string> = {
      'ford-bronco-raptor-2024-review': 'Comprehensive review of the 2024 Ford Bronco Raptor, featuring enhanced suspension, powerful engine, and advanced off-road technology.',
      'jeep-wrangler-modifications-guide': 'Transform your Jeep Wrangler with these essential modifications that enhance performance, capability, and style.',
      'moab-hells-revenge-trail-guide': 'Complete guide to conquering Hell\'s Revenge trail in Moab, including difficulty ratings, key obstacles, and safety tips.',
      'recovery-gear-safety-kit-guide': 'Build the ultimate recovery kit with our comprehensive guide to essential safety equipment for off-road adventures.',
      'best-tires-rock-crawling-2024': 'Discover the best tires for rock crawling in 2024, with expert recommendations and buying guide.'
    };
    return excerptMap[slug] || 'Discover everything you need to know about off-road adventures, from choosing the right vehicle to mastering challenging terrains.';
  };

  const getPostTags = (slug: string) => {
    const tagsMap: Record<string, string[]> = {
      'ford-bronco-raptor-2024-review': ['vehicles', 'ford', 'bronco', 'review'],
      'jeep-wrangler-modifications-guide': ['modifications', 'jeep', 'wrangler', 'upgrade'],
      'moab-hells-revenge-trail-guide': ['trails', 'moab', 'utah', 'guide'],
      'recovery-gear-safety-kit-guide': ['gear', 'safety', 'recovery', 'equipment'],
      'best-tires-rock-crawling-2024': ['tires', 'rock-crawling', 'equipment', 'guide']
    };
    return tagsMap[slug] || ['adventure', 'off-road', 'guide', '4x4'];
  };

  const generateDetailedContent = (slug: string) => {
    const contentMap: Record<string, string> = {
      'best-tires-rock-crawling-2024': `
        <div className="space-y-8">
          <div className="text-center mb-8">
            <img src="https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800&h=400&fit=crop&crop=center" alt="Rock crawling tires" className="w-full h-64 object-cover rounded-lg shadow-lg mb-4" />
            <p className="text-sm text-muted-foreground">The right tires make all the difference in rock crawling performance</p>
          </div>

          <h2 className="text-3xl font-bold text-foreground mb-6">Best Tires for Rock Crawling in 2024</h2>
          <p className="text-lg leading-relaxed mb-8 text-foreground">Rock crawling demands specific tire characteristics that differ from other forms of off-roading. This comprehensive guide covers the top tire choices for 2024, focusing on grip, durability, and performance on technical terrain.</p>

          <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 rounded-lg mb-8 border">
            <h3 className="text-2xl font-bold mb-4 text-foreground">Top Rock Crawling Tires</h3>
            <div className="grid gap-6">
              <div className="bg-card p-4 rounded-lg border">
                <h4 className="text-xl font-semibold mb-3 text-foreground">BFGoodrich Krawler T/A KX</h4>
                <p className="text-muted-foreground mb-2">The gold standard for rock crawling with sticky compound and aggressive tread pattern.</p>
                <ul className="list-disc ml-6 space-y-1 text-muted-foreground">
                  <li>Available sizes: 35" to 43"</li>
                  <li>DOT approved for street use</li>
                  <li>Price range: $400-800 per tire</li>
                  <li>Best for: Serious rock crawling and competition</li>
                </ul>
              </div>
              
              <div className="bg-card p-4 rounded-lg border">
                <h4 className="text-xl font-semibold mb-3 text-foreground">Maxxis Creepy Crawler</h4>
                <p className="text-muted-foreground mb-2">Competition-grade tire with maximum grip for extreme terrain.</p>
                <ul className="list-disc ml-6 space-y-1 text-muted-foreground">
                  <li>Super soft compound for maximum grip</li>
                  <li>Bias-ply construction for flexibility</li>
                  <li>Competition use only (not street legal)</li>
                  <li>Price range: $500-900 per tire</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-muted p-6 rounded-lg border-l-4 border-primary">
            <h2 className="text-2xl font-bold mb-4 text-foreground">Selection Tips</h2>
            <ul className="list-disc ml-6 space-y-2 text-muted-foreground">
              <li>Prioritize compound softness over tread pattern</li>
              <li>Consider bias-ply for maximum conformability</li>
              <li>Match tire size to your vehicle's capabilities</li>
              <li>Budget for frequent replacement due to wear</li>
            </ul>
          </div>
        </div>
      `,
      'jeep-wrangler-modifications-guide': `
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-foreground mb-6">Ultimate Jeep Wrangler Modification Guide</h2>
          <p className="text-lg leading-relaxed mb-8 text-foreground">Transform your Wrangler with these essential modifications for enhanced performance and capability.</p>
          
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 rounded-lg mb-8 border">
            <h3 className="text-2xl font-bold mb-4 text-foreground">1. Lift Kit - Foundation Upgrade</h3>
            <p className="text-base leading-relaxed mb-4 text-foreground">A quality lift kit provides increased ground clearance and allows for larger tires. Options range from budget 2-3 inch lifts to extreme 6+ inch systems.</p>
          </div>
          
          <div className="bg-gradient-to-r from-accent/10 to-primary/10 p-6 rounded-lg mb-8 border">
            <h3 className="text-2xl font-bold mb-4 text-foreground">2. Larger Tires - Maximum Traction</h3>
            <p className="text-base leading-relaxed mb-4 text-foreground">Upgrade to 33", 35", or 37" tires for improved traction. Each size requires different modifications.</p>
          </div>
          
          <div className="bg-muted p-6 rounded-lg border-l-4 border-primary">
            <h4 className="text-xl font-bold mb-3 text-foreground">Professional Installation Recommended</h4>
            <p className="text-foreground">Complex modifications should be installed by professionals to ensure safety and proper function.</p>
          </div>
        </div>
      `
    };

    return contentMap[slug] || `
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-4 text-foreground">Comprehensive Off-Road Guide</h2>
        <p className="text-base leading-relaxed mb-6 text-foreground">This detailed guide covers everything you need to know about off-road adventures, providing expert insights and practical advice for enthusiasts of all skill levels.</p>
        
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 rounded-lg mb-8 border">
          <h3 className="text-xl font-bold mb-4 text-foreground">Getting Started</h3>
          <p className="text-base leading-relaxed text-foreground">Whether you're new to off-roading or looking to expand your knowledge, this guide provides essential information for safe and successful adventures.</p>
        </div>
        
        <div className="bg-muted p-6 rounded-lg border-l-4 border-primary">
          <h4 className="text-lg font-bold mb-3 text-foreground">Safety Reminder</h4>
          <p className="text-foreground">Always prioritize safety, travel with others when possible, and respect the environment while exploring.</p>
        </div>
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
      
      <article className="container mx-auto px-4 pt-20 pb-12">
        <div className="max-w-4xl mx-auto">
          <nav className="mb-8">
            <Button variant="ghost" asChild className="p-0 h-auto">
              <Link to="/blog" className="flex items-center text-muted-foreground hover:text-foreground">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </Button>
          </nav>

          <header className="mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {post.tags?.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex items-center gap-6 text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(post.published_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{readingTime} min read</span>
              </div>
            </div>

            {post.cover_image && (
              <div className="mb-8">
                <img 
                  src={post.cover_image} 
                  alt={post.title}
                  className="w-full h-64 md:h-96 object-cover rounded-lg"
                />
              </div>
            )}
          </header>

          {/* Ad Section - Top of Article */}
          <div className="py-4 mb-8">
            <AdSenseAd 
              slot="8773228071"
              layout="in-article"
              className="w-full max-w-4xl"
            />
          </div>

          <div className="prose prose-lg max-w-none mb-12">
            <div 
              className="blog-content" 
              dangerouslySetInnerHTML={{ 
                __html: post.content 
                  ? post.content.replace(/<pre class="ql-syntax"[^>]*>/g, '<div>').replace(/<\/pre>/g, '</div>')
                  : generateDetailedContent(post.slug) 
              }}
            />
          </div>

          {/* Ad Section - After Content */}
          <div className="py-4 mb-8">
            <AdSenseAd 
              slot="2268201929"
              layout="in-article"
              className="w-full max-w-4xl"
            />
          </div>

          <div className="flex items-center gap-4 py-6 border-t border-b mb-8">
            <span className="text-sm font-medium">Share this article:</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>

          {relatedPosts.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Card key={relatedPost.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="p-0">
                      {relatedPost.cover_image && (
                        <img 
                          src={relatedPost.cover_image} 
                          alt={relatedPost.title}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                      )}
                    </CardHeader>
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-2 line-clamp-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {relatedPost.excerpt}
                      </p>
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/blog/${relatedPost.slug}`}>
                          Read More
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogDetail;