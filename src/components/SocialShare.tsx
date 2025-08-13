import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { Share2, Facebook, Twitter, Link2, Printer } from 'lucide-react';
import { toast } from 'sonner';

interface SocialShareProps {
  title: string;
  excerpt: string;
  url: string;
  image?: string;
  variant?: 'button' | 'icon';
  size?: 'sm' | 'default' | 'lg';
}

const SocialShare = ({ 
  title, 
  excerpt, 
  url, 
  image,
  variant = 'button',
  size = 'sm'
}: SocialShareProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const fullUrl = `${window.location.origin}${url}`;
  const encodedTitle = encodeURIComponent(title);
  const encodedText = encodeURIComponent(excerpt);
  const encodedUrl = encodeURIComponent(fullUrl);
  const encodedImage = image ? encodeURIComponent(`${window.location.origin}${image}`) : '';

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodedImage}&description=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  };

  const handleShare = (platform: string) => {
    if (platform === 'copy') {
      navigator.clipboard.writeText(fullUrl);
      toast.success('Link copied to clipboard!');
      setIsOpen(false);
      return;
    }

    if (platform === 'print') {
      window.print();
      setIsOpen(false);
      return;
    }

    const shareUrl = shareLinks[platform as keyof typeof shareLinks];
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
      setIsOpen(false);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: excerpt,
          url: fullUrl,
        });
      } catch (error) {
        // Fallback to dialog if native share fails
        setIsOpen(true);
      }
    } else {
      setIsOpen(true);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size={size}
          onClick={handleNativeShare}
          className="flex items-center gap-2"
        >
          <Share2 className="h-4 w-4" />
          {variant === 'button' && 'Share'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share this post</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 py-4">
          <Button
            variant="outline"
            onClick={() => handleShare('facebook')}
            className="flex items-center gap-2 justify-start"
          >
            <Facebook className="h-4 w-4 text-blue-600" />
            Facebook
          </Button>
          <Button
            variant="outline"
            onClick={() => handleShare('twitter')}
            className="flex items-center gap-2 justify-start"
          >
            <Twitter className="h-4 w-4 text-blue-400" />
            Twitter
          </Button>
          <Button
            variant="outline"
            onClick={() => handleShare('pinterest')}
            className="flex items-center gap-2 justify-start"
          >
            <div className="h-4 w-4 bg-red-600 rounded flex items-center justify-center text-white text-xs font-bold">P</div>
            Pinterest
          </Button>
          <Button
            variant="outline"
            onClick={() => handleShare('linkedin')}
            className="flex items-center gap-2 justify-start"
          >
            <div className="h-4 w-4 bg-blue-700 rounded flex items-center justify-center text-white text-xs font-bold">in</div>
            LinkedIn
          </Button>
          <Button
            variant="outline"
            onClick={() => handleShare('copy')}
            className="flex items-center gap-2 justify-start"
          >
            <Link2 className="h-4 w-4" />
            Copy Link
          </Button>
          <Button
            variant="outline"
            onClick={() => handleShare('print')}
            className="flex items-center gap-2 justify-start"
          >
            <Printer className="h-4 w-4" />
            Print
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SocialShare;