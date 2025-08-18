import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

interface VideoTag {
  id: string;
  name: string;
  slug: string;
  color: string;
  usage_count: number;
}

interface VideoFiltersProps {
  sortBy: 'newest' | 'trending' | 'most_viewed';
  onSortChange: (sort: 'newest' | 'trending' | 'most_viewed') => void;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  videoTags: VideoTag[];
  isVisible: boolean;
}

const VideoFilters: React.FC<VideoFiltersProps> = ({
  sortBy,
  onSortChange,
  selectedTags,
  onTagsChange,
  videoTags,
  isVisible
}) => {
  const handleTagClick = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      onTagsChange(selectedTags.filter(tag => tag !== tagName));
    } else {
      onTagsChange([...selectedTags, tagName]);
    }
  };

  const clearAllTags = () => {
    onTagsChange([]);
  };

  if (!isVisible) {
    return (
      <div className="flex items-center gap-4">
        <Select value={sortBy} onValueChange={(value: any) => onSortChange(value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="trending">Trending</SelectItem>
            <SelectItem value="most_viewed">Most Viewed</SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 mt-4 p-4 bg-card/50 rounded-lg border">
      {/* Sort Options */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">Sort by:</label>
        <Select value={sortBy} onValueChange={(value: any) => onSortChange(value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="trending">Trending</SelectItem>
            <SelectItem value="most_viewed">Most Viewed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tag Filters */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Filter by tags:</label>
          {selectedTags.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllTags}
              className="text-xs"
            >
              Clear all
            </Button>
          )}
        </div>

        {/* Selected Tags */}
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <Badge
                key={tag}
                variant="default"
                className="cursor-pointer hover:bg-primary/80 transition-colors"
                onClick={() => handleTagClick(tag)}
              >
                #{tag}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            ))}
          </div>
        )}

        {/* Available Tags */}
        <div className="flex flex-wrap gap-2">
          {videoTags
            .filter(tag => !selectedTags.includes(tag.name))
            .sort((a, b) => b.usage_count - a.usage_count)
            .map((tag) => (
              <Badge
                key={tag.id}
                variant="outline"
                className="cursor-pointer hover:bg-accent transition-colors"
                onClick={() => handleTagClick(tag.name)}
                style={{ borderColor: tag.color + '40', color: tag.color }}
              >
                #{tag.name} ({tag.usage_count})
              </Badge>
            ))}
        </div>

        {videoTags.length === 0 && (
          <p className="text-sm text-muted-foreground">No tags available</p>
        )}
      </div>
    </div>
  );
};

export default VideoFilters;