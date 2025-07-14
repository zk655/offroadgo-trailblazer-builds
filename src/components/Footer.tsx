import { Link } from 'react-router-dom';
import { Mountain, Github, Twitter, Instagram } from 'lucide-react';
import footerBg from '@/assets/footer-bg-1.jpg';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Tools',
      links: [
        { href: '/compare', label: 'Compare Vehicles' },
        { href: '/build', label: 'Mod Builder' },
        { href: '/mod-planner', label: 'Mod Planner' },
        { href: '/trip-planner', label: 'Trip Planner' },
      ],
    },
    {
      title: 'Explore',
      links: [
        { href: '/trails', label: 'Trail Explorer' },
        { href: '/garage', label: 'Community Builds' },
        { href: '/mods', label: 'Browse Mods' },
        { href: '/blog', label: 'Blog' },
      ],
    },
    {
      title: 'Community',
      links: [
        { href: '/community', label: 'Knowledge Base' },
        { href: '/blog', label: 'Latest Posts' },
        { href: '/contact', label: 'Contact Us' },
        { href: '/about', label: 'About OffRoadGo' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { href: '/privacy', label: 'Privacy Policy' },
        { href: '/terms', label: 'Terms of Service' },
        { href: '/contact', label: 'Support' },
      ],
    },
  ];

  return (
    <footer className="relative bg-gradient-to-t from-muted/20 to-background border-t border-border overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
        style={{ backgroundImage: `url(${footerBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/85 to-background/95" />
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 font-bold text-xl mb-4">
              <Mountain className="h-8 w-8 text-primary" />
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                OffRoadGo
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              Your complete toolkit for off-road adventures. Build, compare, and explore with confidence.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-smooth"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-smooth"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-primary transition-smooth"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-foreground mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.href}
                      className="text-muted-foreground hover:text-foreground transition-smooth text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-muted-foreground mb-4 md:mb-0">
              © {currentYear} OffRoadGo. All rights reserved.
            </div>
            <div className="text-sm text-muted-foreground">
              Built with ❤️ for the off-road community
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;