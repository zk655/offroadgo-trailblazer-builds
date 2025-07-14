import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Mountain } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/vehicles', label: 'Our Vehicles' },
    { href: '/parts', label: 'Services' },
    { href: '/build', label: 'Our Builds' },
    { href: '/blog', label: 'Blogs' },
    { href: '/trails', label: 'Contact Us' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-border/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 font-black text-2xl">
            <div className="w-10 h-10 rounded-xl premium-gradient flex items-center justify-center">
              <Mountain className="h-6 w-6 text-white" />
            </div>
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              OffRoadGo
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-muted-foreground hover:text-primary transition-all duration-300 font-semibold relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 premium-gradient group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
            <div className="flex items-center gap-3">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />
            <button
              className="p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-border/20 glass-effect">
            <div className="flex flex-col space-y-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="text-muted-foreground hover:text-primary transition-all duration-300 py-3 px-2 font-semibold text-lg relative group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                  <span className="absolute bottom-0 left-2 w-0 h-0.5 premium-gradient group-hover:w-[calc(100%-16px)] transition-all duration-300"></span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;