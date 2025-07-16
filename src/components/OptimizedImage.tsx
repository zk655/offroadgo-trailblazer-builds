import React, { useState, useCallback } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  onError?: (error: any) => void;
  loading?: 'lazy' | 'eager';
  width?: number;
  height?: number;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  fallbackSrc = '/placeholder.svg',
  className = '',
  onError,
  loading = 'lazy',
  width,
  height,
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
  }, []);

  const handleError = useCallback((e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.warn(`Image failed to load: ${currentSrc}`);
    setIsLoading(false);
    
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(false);
    } else {
      setHasError(true);
    }
    
    if (onError) {
      onError(e);
    }
  }, [currentSrc, fallbackSrc, onError]);

  if (hasError) {
    return (
      <div 
        className={`bg-muted flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <div className="text-center text-muted-foreground text-sm">
          <div className="w-8 h-8 mx-auto mb-2 bg-muted-foreground/20 rounded"></div>
          Image unavailable
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div 
          className={`absolute inset-0 bg-muted animate-pulse ${className}`}
          style={{ width, height }}
        />
      )}
      <img
        src={currentSrc}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={handleLoad}
        onError={handleError}
        loading={loading}
        width={width}
        height={height}
        decoding="async"
      />
    </div>
  );
};

export default OptimizedImage;