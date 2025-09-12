import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import StructuredData from './StructuredData';

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumb = ({ items, className = '' }: BreadcrumbProps) => {
  const allItems = [
    { name: 'Home', href: '/' },
    ...items
  ];

  const structuredDataItems = allItems.map(item => ({
    name: item.name,
    url: `https://offroadgo.com${item.href}`
  }));

  return (
    <>
      <StructuredData 
        type="BreadcrumbList"
        data={{ items: structuredDataItems }}
      />
      
      <nav className={`flex items-center space-x-2 text-sm ${className}`} aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          {allItems.map((item, index) => (
            <li key={item.href} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 text-muted-foreground mx-2" />
              )}
              
              {index === 0 ? (
                <Link 
                  to={item.href}
                  className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Go to homepage"
                >
                  <Home className="w-4 h-4" />
                  <span className="sr-only">{item.name}</span>
                </Link>
              ) : index === allItems.length - 1 ? (
                <span className="text-foreground font-medium" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link 
                  to={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
};

export default Breadcrumb;