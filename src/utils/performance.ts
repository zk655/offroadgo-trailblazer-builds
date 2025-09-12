// Performance optimization utilities

export const prefetchRoute = (routePath: string) => {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = routePath;
  document.head.appendChild(link);
};

export const preloadCriticalImages = (imagePaths: string[]) => {
  imagePaths.forEach(path => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = path;
    document.head.appendChild(link);
  });
};

export const measureWebVitals = () => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    // Largest Contentful Paint
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      console.log('LCP:', lastEntry.startTime);
      
      // Send to analytics if needed
      if (window.gtag) {
        window.gtag('event', 'web_vitals', {
          event_category: 'Web Vitals',
          event_label: 'LCP',
          value: Math.round(lastEntry.startTime)
        });
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        const fidValue = entry.processingStart - entry.startTime;
        console.log('FID:', fidValue);
        
        if (window.gtag) {
          window.gtag('event', 'web_vitals', {
            event_category: 'Web Vitals',
            event_label: 'FID',
            value: Math.round(fidValue)
          });
        }
      });
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift
    let clsValue = 0;
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      
      console.log('CLS:', clsValue);
      
      if (window.gtag) {
        window.gtag('event', 'web_vitals', {
          event_category: 'Web Vitals',
          event_label: 'CLS',
          value: Math.round(clsValue * 1000)
        });
      }
    }).observe({ entryTypes: ['layout-shift'] });
  }
};

export const optimizeImages = () => {
  // Add loading="lazy" to all images below the fold
  const images = document.querySelectorAll('img');
  images.forEach((img, index) => {
    if (index > 2) { // First 3 images load eagerly
      img.loading = 'lazy';
    }
  });
};

// Critical CSS for above-the-fold content
export const criticalCSS = `
  /* Critical styles for initial render */
  .hero-section {
    background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .navigation {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 50;
    background: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(8px);
  }
  
  .btn-primary {
    background: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 600;
    transition: all 0.2s;
  }
  
  .btn-primary:hover {
    background: hsl(var(--primary) / 0.9);
    transform: translateY(-1px);
  }
`;

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}