import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Calendar, User, Clock, Share2, Heart, BookOpen, Tag } from 'lucide-react';
import Navigation from '@/components/Navigation';
import SEO from '@/components/SEO';
import Footer from '@/components/Footer';
import AdSenseAd from '@/components/AdSenseAd';

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
          title: 'The Ultimate Guide to Off-Road Adventures',
          slug: slug || '',
          content: generateDetailedContent(),
          excerpt: 'Discover everything you need to know about off-road adventures, from choosing the right vehicle to mastering challenging terrains.',
          cover_image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&h=600&fit=crop',
          author: 'Off-Road Expert',
          published_at: new Date().toISOString(),
          tags: ['adventure', 'off-road', 'guide', '4x4'],
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

  const generateDetailedContent = () => {
    return `
      <h2>Introduction to Off-Road Adventures</h2>
      <p>Off-road driving is more than just a hobby—it's a passion that connects you with nature, challenges your skills, and creates unforgettable memories. Whether you're navigating rocky mountain trails, splashing through muddy paths, or conquering desert dunes, each adventure offers unique experiences and lessons.</p>

      <h2>Choosing the Right Vehicle</h2>
      <p>The foundation of any successful off-road adventure starts with selecting the right vehicle. Here's what you need to consider:</p>
      
      <h3>Key Features to Look For:</h3>
      <ul>
        <li><strong>4-Wheel Drive System:</strong> Essential for traction on challenging terrain</li>
        <li><strong>Ground Clearance:</strong> Higher clearance prevents undercarriage damage</li>
        <li><strong>Approach and Departure Angles:</strong> Critical for navigating steep inclines</li>
        <li><strong>Skid Plates:</strong> Protect vital components from rocks and debris</li>
        <li><strong>Locking Differentials:</strong> Improve traction in difficult conditions</li>
      </ul>

      <h2>Essential Gear and Equipment</h2>
      <p>Proper preparation can make the difference between an epic adventure and a dangerous situation. Here's your essential gear checklist:</p>

      <h3>Recovery Equipment:</h3>
      <ul>
        <li>Winch and recovery straps</li>
        <li>Traction boards or sand ladders</li>
        <li>Shovel and basic tools</li>
        <li>Tire repair kit and portable compressor</li>
      </ul>

      <h3>Safety Equipment:</h3>
      <ul>
        <li>First aid kit</li>
        <li>Emergency communication device</li>
        <li>Extra water and food</li>
        <li>Fire extinguisher</li>
      </ul>

      <h2>Popular Off-Road Destinations</h2>
      <p>The United States offers some of the world's most spectacular off-road destinations:</p>

      <h3>Moab, Utah</h3>
      <p>Known for its red rock formations and challenging trails like Hell's Revenge and Fins and Things. Perfect for rock crawling enthusiasts.</p>

      <h3>Rubicon Trail, California</h3>
      <p>The ultimate test of vehicle and driver skill. This 22-mile trail is considered one of the most difficult in the country.</p>

      <h3>The Hammers, California</h3>
      <p>Home to King of the Hammers race, offering everything from fast desert racing to technical rock crawling.</p>

      <h2>Trail Etiquette and Environmental Responsibility</h2>
      <p>As off-road enthusiasts, we have a responsibility to preserve these natural areas for future generations:</p>

      <ul>
        <li>Stay on designated trails</li>
        <li>Pack out all trash</li>
        <li>Respect wildlife and vegetation</li>
        <li>Travel in groups for safety</li>
        <li>Inform others of your plans</li>
      </ul>

      <h2>Building Your Skills</h2>
      <p>Off-road driving requires specific skills that develop over time:</p>

      <h3>Basic Techniques:</h3>
      <ul>
        <li><strong>Momentum Management:</strong> Knowing when to use power and when to slow down</li>
        <li><strong>Line Selection:</strong> Choosing the best path through obstacles</li>
        <li><strong>Tire Pressure Adjustment:</strong> Lower pressure for sand, higher for rocks</li>
        <li><strong>Recovery Techniques:</strong> Self-recovery and helping others safely</li>
      </ul>

      <h2>Maintenance and Preparation</h2>
      <p>Regular maintenance becomes even more critical for off-road vehicles:</p>

      <ul>
        <li>Check and change fluids more frequently</li>
        <li>Inspect suspension components regularly</li>
        <li>Clean air filters after dusty conditions</li>
        <li>Examine tires for wear and damage</li>
        <li>Test 4WD system before heading out</li>
      </ul>

      <h2>Conclusion</h2>
      <p>Off-road adventures offer unparalleled excitement and the opportunity to explore some of the most beautiful, remote places on Earth. With proper preparation, the right equipment, and respect for the environment, your off-road experiences will be safe, fun, and memorable. Remember, the journey is just as important as the destination.</p>

      <p>Whether you're a beginner taking your first steps into the off-road world or an experienced driver looking to tackle new challenges, always prioritize safety, preparation, and environmental stewardship. Happy trails!</p>
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
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags?.map(tag => (
                <Badge key={tag} variant="secondary">
                  <Tag className="mr-1 h-3 w-3" />
                  {tag}
                </Badge>
              ))}
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-6">
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                <span className="font-medium">{post.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4" />
                <span>{formatDate(post.published_at)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                <span>{readingTime} min read</span>
              </div>
              <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>

          {/* Featured Image */}
          <div className="mb-8">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
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
          <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>

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
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{post.author}</h3>
                  <p className="text-muted-foreground">
                    Passionate off-road enthusiast and automotive expert with years of experience in 4x4 adventures.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Card key={relatedPost.id} className="group hover:shadow-lg transition-smooth">
                    <div className="relative">
                      <img
                        src={relatedPost.cover_image}
                        alt={relatedPost.title}
                        className="w-full h-32 object-cover rounded-t-lg"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {relatedPost.excerpt}
                      </p>
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/blog/${relatedPost.slug}`}>
                          Read More
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
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