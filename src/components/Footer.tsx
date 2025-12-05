import { Link } from 'react-router-dom';
import { Mountain, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    vehicles: [
      { label: 'Browse All', href: '/vehicles' },
      { label: 'Compare', href: '/compare' },
      { label: 'Build & Price', href: '/build' },
    ],
    explore: [
      { label: 'Trail Guide', href: '/trails' },
      { label: 'Events', href: '/clubs-events' },
      { label: 'Videos', href: '/videos' },
      { label: 'Blog', href: '/blog' },
    ],
    shop: [
      { label: 'Parts & Accessories', href: '/products' },
      { label: 'Insurance', href: '/insurance' },
    ],
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms & Conditions', href: '/terms' },
      { label: 'Sitemap', href: '/sitemap' },
    ],
  };

  return (
    <footer className="bg-nav text-nav-foreground">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 font-display font-bold text-xl mb-4">
              <div className="w-10 h-10 bg-accent flex items-center justify-center">
                <Mountain className="h-6 w-6 text-accent-foreground" />
              </div>
              OFFROADGO
            </Link>
            <p className="text-sm text-nav-foreground/70 mb-6">
              Your ultimate destination for off-road adventures, vehicles, and parts.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              <a href="#" className="p-2 bg-nav-hover hover:bg-accent hover:text-accent-foreground transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-nav-hover hover:bg-accent hover:text-accent-foreground transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-nav-hover hover:bg-accent hover:text-accent-foreground transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-nav-hover hover:bg-accent hover:text-accent-foreground transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Vehicles */}
          <div>
            <h4 className="font-display font-semibold text-sm tracking-wider mb-4">VEHICLES</h4>
            <ul className="space-y-2">
              {footerLinks.vehicles.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href} 
                    className="text-sm text-nav-foreground/70 hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-display font-semibold text-sm tracking-wider mb-4">EXPLORE</h4>
            <ul className="space-y-2">
              {footerLinks.explore.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href} 
                    className="text-sm text-nav-foreground/70 hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-display font-semibold text-sm tracking-wider mb-4">SHOP</h4>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href} 
                    className="text-sm text-nav-foreground/70 hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display font-semibold text-sm tracking-wider mb-4">COMPANY</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link 
                    to={link.href} 
                    className="text-sm text-nav-foreground/70 hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-nav-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-nav-foreground/60">
            <p>© {currentYear} OffRoadGo. All rights reserved.</p>
            <p>Built for adventurers who demand more from their vehicles.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;