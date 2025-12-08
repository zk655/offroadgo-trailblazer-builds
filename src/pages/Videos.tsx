import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import VideoGridWithMasonry from '@/components/VideoGridWithMasonry';
import VideoFilters from '@/components/VideoFilters';
import SEOHead from '@/components/SEOHead';
import PageHero from '@/components/PageHero';
import { Button } from '@/components/ui/button';
import { Filter, Play } from 'lucide-react';
import AdPlacement from '@/components/AdPlacement';


interface VideoTag {
  id: string;
  name: string;
  slug: string;
  color: string;
  usage_count: number;
}


const Videos = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'newest' | 'trending' | 'most_viewed'>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const queryClient = useQueryClient();

  // Fetch video tags
  const { data: videoTags = [] } = useQuery({
    queryKey: ['video-tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('video_tags')
        .select('*')
        .order('usage_count', { ascending: false });
      
      if (error) throw error;
      return data as VideoTag[];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes cache
  });

  // Fetch video categories
  const { data: categories = [] } = useQuery({
    queryKey: ['video-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('videos')
        .select('category')
        .not('category', 'is', null);
      
      if (error) throw error;
      
      const uniqueCategories = [...new Set(data.map(v => v.category))];
      return uniqueCategories.filter(Boolean);
    },
    staleTime: 15 * 60 * 1000, // 15 minutes cache
  });



  return (
    <>
      <SEOHead 
        title="Epic Off-Road Videos - Adventures, Reviews & Trail Guides"
        description="Watch the best off-road adventures, vehicle reviews, and trail guides. From Jeep builds to overlanding tips, discover amazing 4x4 content and inspiration."
        keywords="off-road videos, jeep videos, overlanding, mud terrain, rock crawling, vehicle builds, 4x4 adventures, trail videos"
        url="/videos"
        type="website"
        image="https://offroadgo.com/og-videos.jpg"
      />
      
      <div className="min-h-screen bg-background">
        <Navigation />
        
        {/* Ad Space After Navigation */}
        <AdPlacement 
          position="top" 
          pageType="other"
          className="py-2 bg-muted/10 border-b border-border/30"
        />
        
        {/* Hero Section */}
        <PageHero
          title="Off-Road Videos"
          subtitle="Discover epic adventures, detailed builds, and expert reviews from the off-road community"
          icon={Play}
        />

        {/* Categories Section */}
        {categories.length > 0 && (
          <section className="py-4 bg-muted/20">
            <div className="container mx-auto px-4">
              <div className="flex flex-wrap gap-2 justify-center">
                <Button
                  variant={selectedCategory === '' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory('')}
                >
                  All Videos
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="capitalize"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </section>
        )}
        
        {/* Filters and Controls */}
        <section className="border-b bg-card/50">
          <div className="container mx-auto px-4 py-3">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </div>

              <VideoFilters
                sortBy={sortBy}
                onSortChange={setSortBy}
                selectedTags={selectedTags}
                onTagsChange={setSelectedTags}
                videoTags={videoTags}
                isVisible={showFilters}
              />
            </div>
          </div>
        </section>

        {/* Videos Grid */}
        <section className="py-6">
          <div className="container mx-auto px-4">
            <VideoGridWithMasonry
              searchQuery=""
              selectedTags={selectedTags}
              sortBy={sortBy}
              category={selectedCategory}
            />
          </div>
        </section>

        {/* Ad Section - After Videos */}
        <section className="py-2 bg-muted/5">
          <div className="container mx-auto px-4">
            <AdPlacement position="bottom" pageType="other" />
          </div>
        </section>



        <Footer />
      </div>
    </>
  );
};

export default Videos;