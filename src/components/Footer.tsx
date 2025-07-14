import { Link } from 'react-router-dom';
import { Mountain } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card/30 border-t border-border/20 py-8">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center space-x-2 font-bold text-lg">
              <div className="w-8 h-8 rounded-xl premium-gradient flex items-center justify-center">
                <Mountain className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                OffRoadGo
              </span>
            </Link>
            <span className="text-muted-foreground text-sm">
              Premium 4x4 adventures
            </span>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link to="/vehicles" className="text-muted-foreground hover:text-primary transition-smooth">
              Vehicles
            </Link>
            <Link to="/products" className="text-muted-foreground hover:text-primary transition-smooth">
              Products
            </Link>
            <Link to="/trails" className="text-muted-foreground hover:text-primary transition-smooth">
              Trails
            </Link>
            <Link to="/blog" className="text-muted-foreground hover:text-primary transition-smooth">
              Blog
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-sm text-muted-foreground text-center md:text-right">
            <div>© {currentYear} OffRoadGo</div>
            <div>Built for adventure</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;