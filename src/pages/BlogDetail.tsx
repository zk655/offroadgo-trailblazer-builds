import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Calendar, User, Clock, Heart, BookOpen, Tag, ArrowRight } from 'lucide-react';
import SocialShare from '@/components/SocialShare';
import Navigation from '@/components/Navigation';
import SEO from '@/components/SEO';
import StructuredData from '@/components/StructuredData';
import SEOHead from '@/components/SEOHead';
import Breadcrumb from '@/components/Breadcrumb';
import Footer from '@/components/Footer';
import AdSenseAd from '@/components/AdSenseAd';
import { sanitizeHtml } from '@/utils/sanitizer';
import '../styles/blog.css';

interface BlogPost {
  id: string;
  title: string;
  content: string | null;
  excerpt: string | null;
  image_url: string | null;
  thumbnail_url: string | null;
  author: string | null;
  created_at: string | null;
  tags: string[] | null;
  published: boolean | null;
  seo_title: string | null;
  seo_description: string | null;
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
      // Try to find by ID first (slug might be an ID)
      const { data: localPost, error: localError } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', slug)
        .single();

      if (localPost && !localError) {
        setPost(localPost);
        calculateReadingTime(localPost.content || '');
        fetchRelatedPosts(localPost.tags || []);
      } else {
        // Fallback to sample post
        const samplePost: BlogPost = {
          id: '1',
          title: getPostTitle(slug),
          content: generateDetailedContent(slug),
          excerpt: getPostExcerpt(slug),
          image_url: getPostImage(slug),
          thumbnail_url: null,
          author: 'Off-Road Expert',
          created_at: new Date().toISOString(),
          tags: getPostTags(slug),
          published: true,
          seo_title: null,
          seo_description: null,
        };
        setPost(samplePost);
        calculateReadingTime(samplePost.content || '');
        fetchRelatedPosts(samplePost.tags || []);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPostImage = (slug: string | undefined) => {
    if (!slug) return '/src/assets/blog/ford-bronco-raptor.jpg';
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

  const getPostTitle = (slug: string | undefined) => {
    if (!slug) return 'The Ultimate Guide to Off-Road Adventures';
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

  const getPostExcerpt = (slug: string | undefined) => {
    if (!slug) return 'Discover everything you need to know about off-road adventures.';
    const excerptMap: Record<string, string> = {
      'ford-bronco-raptor-2024-review': 'Comprehensive review of the 2024 Ford Bronco Raptor, featuring enhanced suspension, powerful engine, and advanced off-road technology.',
      'jeep-wrangler-modifications-guide': 'Transform your Jeep Wrangler with these essential modifications that enhance performance, capability, and style.',
      'moab-hells-revenge-trail-guide': 'Complete guide to conquering Hell\'s Revenge trail in Moab, including difficulty ratings, key obstacles, and safety tips.',
      'recovery-gear-safety-kit-guide': 'Build the ultimate recovery kit with our comprehensive guide to essential safety equipment for off-road adventures.',
      'best-tires-rock-crawling-2024': 'Discover the best tires for rock crawling in 2024, with expert recommendations and buying guide.'
    };
    return excerptMap[slug] || 'Discover everything you need to know about off-road adventures, from choosing the right vehicle to mastering challenging terrains.';
  };

  const getPostTags = (slug: string | undefined) => {
    if (!slug) return ['adventure', 'off-road', 'guide', '4x4'];
    const tagsMap: Record<string, string[]> = {
      'ford-bronco-raptor-2024-review': ['vehicles', 'ford', 'bronco', 'review'],
      'jeep-wrangler-modifications-guide': ['modifications', 'jeep', 'wrangler', 'upgrade'],
      'moab-hells-revenge-trail-guide': ['trails', 'moab', 'utah', 'guide'],
      'recovery-gear-safety-kit-guide': ['gear', 'safety', 'recovery', 'equipment'],
      'best-tires-rock-crawling-2024': ['tires', 'rock-crawling', 'equipment', 'guide']
    };
    return tagsMap[slug] || ['adventure', 'off-road', 'guide', '4x4'];
  };

  const generateDetailedContent = (slug: string | undefined) => {
    return `
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
        .neq('id', slug)
        .eq('published', true)
        .limit(3);

      if (!error && data) {
        setRelatedPosts(data);
      }
    } catch (error) {
      console.error('Error fetching related posts:', error);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
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
          text: post.excerpt || '',
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
      <SEOHead 
        title={post.seo_title || post.title}
        description={post.seo_description || post.excerpt || ''}
        keywords={post.tags?.join(', ') || ''}
        url={`/blog/${post.id}`}
        image={post.image_url || ''}
        type="article"
        article={{
          author: post.author || 'Off-Road Expert',
          publishedTime: post.created_at || '',
          modifiedTime: post.created_at || '',
          section: "Off-Road",
          tags: post.tags || []
        }}
      />
      
      <StructuredData 
        type="Article"
        data={{
          headline: post.title,
          description: post.excerpt || '',
          image: post.image_url || '',
          author: post.author || 'Off-Road Expert',
          datePublished: post.created_at || '',
          dateModified: post.created_at || '',
          url: `https://offroadgo.com/blog/${post.id}`,
          category: "Off-Road",
          keywords: post.tags?.join(', ') || ''
        }}
      />
      
      <Navigation />
      
      <article className="container mx-auto px-4 pt-20 pb-12">
        <div className="max-w-4xl mx-auto">
          <nav className="mb-8 space-y-4">
            <Button variant="ghost" asChild className="p-0 h-auto">
              <Link to="/blog" className="flex items-center text-muted-foreground hover:text-foreground">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </Button>
            
            <Breadcrumb 
              items={[
                { name: 'Blog', href: '/blog' },
                { name: post.title, href: `/blog/${post.id}` }
              ]}
            />
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
                <span>{post.author || 'Off-Road Expert'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(post.created_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{readingTime} min read</span>
              </div>
            </div>

            {post.image_url && (
              <div className="mb-8">
                <img 
                  src={post.image_url} 
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
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content || '') }}
            />
          </div>

          <Separator className="my-8" />

          {/* Social Share */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              <span className="text-sm text-muted-foreground">Share this article</span>
            </div>
            <SocialShare 
              title={post.title}
              excerpt={post.excerpt || ''}
              url={`/blog/${post.id}`}
              image={post.image_url || ''}
            />
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link key={relatedPost.id} to={`/blog/${relatedPost.id}`}>
                    <Card className="hover:shadow-lg transition-shadow">
                      {relatedPost.image_url && (
                        <img 
                          src={relatedPost.image_url}
                          alt={relatedPost.title}
                          className="w-full h-32 object-cover rounded-t-lg"
                        />
                      )}
                      <CardContent className="p-4">
                        <h3 className="font-semibold line-clamp-2 mb-2">{relatedPost.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{relatedPost.excerpt}</p>
                      </CardContent>
                    </Card>
                  </Link>
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
