import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ArrowRight } from 'lucide-react';
import SocialShare from './SocialShare';

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

interface BlogPostCardProps {
  post: BlogPost;
  variant?: 'featured' | 'regular';
}

const BlogPostCard = ({ post, variant = 'regular' }: BlogPostCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (variant === 'featured') {
    return (
      <Card className="mb-8 overflow-hidden hover:shadow-lg transition-all duration-300 border-2">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          <div className="relative h-48 sm:h-64 lg:h-auto order-2 lg:order-1">
            <Link to={`/blog/${post.slug}`}>
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
              />
            </Link>
            <div className="absolute top-4 left-4">
              <Badge className="bg-primary text-white shadow-lg">
                Featured
              </Badge>
            </div>
          </div>
          
          <div className="p-4 sm:p-6 lg:p-8 flex flex-col justify-center order-1 lg:order-2">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span className="font-medium">{post.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(post.published_at)}</span>
              </div>
            </div>
            
            <Link to={`/blog/${post.slug}`}>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 leading-tight hover:text-primary transition-colors cursor-pointer">
                {post.title}
              </h2>
            </Link>
            
            <p className="text-muted-foreground mb-4 sm:mb-6 line-clamp-3 text-sm sm:text-base leading-relaxed">
              {post.excerpt}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
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
            
            <div className="flex items-center gap-3">
              <Button asChild size="sm" className="sm:w-auto">
                <Link to={`/blog/${post.slug}`}>
                  Read More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <SocialShare
                title={post.title}
                excerpt={post.excerpt}
                url={`/blog/${post.slug}`}
                image={post.cover_image}
              />
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden border">
      <div className="relative overflow-hidden">
        <Link to={`/blog/${post.slug}`}>
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
          />
        </Link>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <CardHeader className="pb-2 p-4">
        <div className="flex items-center gap-2 sm:gap-4 text-xs text-muted-foreground mb-2">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span className="truncate">{post.author}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span className="truncate">{formatDate(post.published_at)}</span>
          </div>
        </div>
        <Link to={`/blog/${post.slug}`}>
          <CardTitle className="text-base sm:text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors cursor-pointer">
            {post.title}
          </CardTitle>
        </Link>
      </CardHeader>

      <CardContent className="py-2 px-4 space-y-3">
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {post.excerpt}
        </p>
        
        <div className="flex flex-wrap gap-1">
          {post.tags?.slice(0, 2).map(tag => (
            <Badge key={tag} variant="outline" className="text-xs px-2 py-1">
              {tag}
            </Badge>
          ))}
          {post.tags && post.tags.length > 2 && (
            <Badge variant="outline" className="text-xs px-2 py-1">
              +{post.tags.length - 2}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-2 p-4 flex items-center gap-2">
        <Button asChild variant="outline" size="sm" className="flex-1 text-xs">
          <Link to={`/blog/${post.slug}`}>
            Read Article
            <ArrowRight className="ml-2 h-3 w-3" />
          </Link>
        </Button>
        <SocialShare
          title={post.title}
          excerpt={post.excerpt}
          url={`/blog/${post.slug}`}
          image={post.cover_image}
          variant="icon"
        />
      </CardFooter>
    </Card>
  );
};

export default BlogPostCard;