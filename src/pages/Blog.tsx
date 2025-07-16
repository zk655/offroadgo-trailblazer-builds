import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { getLiveBlogContent, blogCategories } from '@/services/blogService';
import { Search, Calendar, User, BookOpen, ArrowRight, Grid } from 'lucide-react';
import Navigation from '@/components/Navigation';
import PageHero from '@/components/PageHero';
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
  category?: string;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts, searchTerm, selectedTag, selectedCategory]);

  const fetchPosts = async () => {
    try {
      // Get live content first
      const liveContent = await getLiveBlogContent();
      
      // Get local database content
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('published_at', { ascending: false });

      // Combine live and local content
      const allPosts = [...liveContent, ...(data || [])];
      setPosts(allPosts);
    } catch (error) {
      // Handle error silently in production
    } finally {
      setLoading(false);
    }
  };

  const filterPosts = () => {
    let filtered = posts;

    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedTag !== 'all') {
      filtered = filtered.filter(post => 
        post.tags && post.tags.includes(selectedTag)
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => 
        post.category === selectedCategory
      );
    }

    setFilteredPosts(filtered);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAllTags = () => {
    const allTags = posts.flatMap(post => post.tags || []);
    return [...new Set(allTags)];
  };

  const uniqueTags = getAllTags();

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-muted rounded-t-lg" />
                <CardContent className="p-4">
                  <div className="h-4 bg-muted rounded mb-2" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Off-Road Adventure Blog - 4x4 Stories & Guides"
        description="Stories, guides, and insights from the 4x4 community. Learn from experts and fellow off-road adventurers. Latest tips and adventures."
        keywords="off-road blog, 4x4 stories, adventure guides, jeep adventures, off-road tips, trail reports"
        url="/blog"
      />
      <Navigation />
      
      {/* Hero Section */}
      <PageHero
        title="Off-Road Adventure Blog"
        subtitle="Stories, guides, and insights from the 4x4 community. Learn from experts and fellow off-road adventurers."
        icon={BookOpen}
      />

      {/* Ad Section 1 - After Hero */}
      <section className="py-2 md:py-4 bg-muted/5">
        <div className="w-full overflow-hidden">
          <AdSenseAd 
            slot="8773228071"
            layout="in-article"
            className="w-full"
          />
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 bg-card p-6 rounded-lg shadow-card">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <Grid className="mr-2 h-5 w-5" />
            Categories
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {blogCategories.map(category => (
              <Card key={category.id} className="p-3 cursor-pointer hover:shadow-md transition-smooth" onClick={() => setSelectedCategory(category.id)}>
                <div className="text-center">
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <h4 className="font-medium text-sm">{category.name}</h4>
                  <p className="text-xs text-muted-foreground">{category.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Badge
            variant={selectedTag === 'all' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setSelectedTag('all')}
          >
            All Posts
          </Badge>
          {uniqueTags.map(tag => (
            <Badge
              key={tag}
              variant={selectedTag === tag ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Ad Section 2 - After Filters */}
        <section className="py-2 md:py-4 bg-muted/10 mb-8">
          <div className="w-full overflow-hidden">
            <AdSenseAd 
              slot="8773228071"
              layout="in-article"
              className="w-full"
            />
          </div>
        </section>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredPosts.length} of {posts.length} articles
          </p>
        </div>

        {/* Featured Post */}
        {filteredPosts.length > 0 && (
          <Card className="mb-8 overflow-hidden hover:shadow-primary transition-smooth">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="relative h-64 lg:h-auto">
                <img
                  src={filteredPosts[0].cover_image}
                  alt={filteredPosts[0].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-primary text-white">
                    Featured
                  </Badge>
                </div>
              </div>
              
              <div className="p-6 lg:p-8 flex flex-col justify-center">
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center">
                    <User className="mr-1 h-3 w-3" />
                    {filteredPosts[0].author}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-3 w-3" />
                    {formatDate(filteredPosts[0].published_at)}
                  </div>
                </div>
                
                <h2 className="text-2xl lg:text-3xl font-bold mb-4">
                  {filteredPosts[0].title}
                </h2>
                
                <p className="text-muted-foreground mb-6 line-clamp-3">
                  {filteredPosts[0].excerpt}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {filteredPosts[0].tags?.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <Button asChild>
                  <Link to={`/blog/${filteredPosts[0].slug}`}>
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.slice(1).map((post) => (
            <Card key={post.id} className="group hover:shadow-primary transition-smooth hover:-translate-y-1 overflow-hidden">
              <div className="relative">
                <img
                  src={post.cover_image}
                  alt={post.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-smooth"
                />
              </div>

              <CardHeader className="pb-2">
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                  <div className="flex items-center">
                    <User className="mr-1 h-3 w-3" />
                    {post.author}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-3 w-3" />
                    {formatDate(post.published_at)}
                  </div>
                </div>
                <CardTitle className="text-lg leading-tight line-clamp-2">
                  {post.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="py-2">
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  {post.excerpt}
                </p>
                
                <div className="flex flex-wrap gap-1">
                  {post.tags?.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {post.tags && post.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{post.tags.length - 3}
                    </Badge>
                  )}
                </div>
              </CardContent>

              <CardFooter className="pt-2">
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link to={`/blog/${post.slug}`}>
                    Read Article
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No articles found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or check back later for new content.
            </p>
          </div>
        )}
      </div>

      {/* Ad Section 3 - After Blog Grid */}
      <section className="py-2 md:py-4 bg-muted/5 mb-8">
        <div className="w-full overflow-hidden">
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

export default Blog;