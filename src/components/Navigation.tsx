import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Mountain, ChevronDown, MapPin, ShoppingCart, Wrench, User } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();

  // Close mobile menu and dropdowns when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);

  const navItems = [
    { 
      href: '/vehicles', 
      label: 'VEHICLES',
      submenu: [
        { href: '/vehicles', label: 'Browse All Models' },
        { href: '/compare', label: 'Compare Vehicles' }
      ]
    },
    { 
      href: '/trails', 
      label: 'CAPABILITY',
      submenu: [
        { href: '/trails', label: 'Trail Guide' },
        { href: '/build', label: 'Build Your Rig' }
      ]
    },
    { 
      href: '/clubs-events', 
      label: 'EVENTS',
      submenu: [
        { href: '/clubs-events', label: 'Rally Events' },
        { href: '/clubs-events', label: 'Clubs & Community' }
      ]
    },
    { 
      href: '/products', 
      label: 'PARTS',
      submenu: [
        { href: '/products', label: 'All Parts & Accessories' },
        { href: '/insurance', label: 'Insurance' }
      ]
    },
    { href: '/blog', label: 'BLOG' },
    { href: '/videos', label: 'VIDEOS' },
  ];

  const isActiveRoute = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <>
      {/* Top utility bar */}
      <div className="bg-nav text-nav-foreground text-xs py-2 hidden md:block">
        <div className="container mx-auto px-4 flex justify-end items-center gap-6">
          <Link to="/auth" className="flex items-center gap-1 hover:text-accent transition-colors">
            <User className="w-3 h-3" />
            Sign In / Create Account
          </Link>
          <ThemeToggle />
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-nav text-nav-foreground sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 font-display font-bold text-2xl tracking-wider">
              <div className="w-10 h-10 bg-accent flex items-center justify-center">
                <Mountain className="h-6 w-6 text-accent-foreground" />
              </div>
              <span className="hidden sm:block">OFFROADGO</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center h-full">
              {navItems.map((item, index) => (
                <div
                  key={item.href}
                  className="relative h-full flex items-center"
                  onMouseEnter={() => item.submenu && setActiveDropdown(item.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    to={item.href}
                    className={`h-full flex items-center gap-1 px-4 text-sm font-medium tracking-wide transition-colors hover:bg-nav-hover ${
                      isActiveRoute(item.href) ? 'border-b-2 border-accent' : ''
                    }`}
                  >
                    {item.label}
                    {item.submenu && <ChevronDown className="w-3 h-3" />}
                  </Link>

                  {/* Separator line after each menu item */}
                  {index < navItems.length - 1 && (
                    <div className="h-5 w-px bg-nav-border" />
                  )}

                  {/* Mega Menu Dropdown */}
                  <AnimatePresence>
                    {item.submenu && activeDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 bg-nav border-t border-nav-border min-w-[220px] z-50"
                      >
                        {item.submenu.map((subItem, idx) => (
                          <Link
                            key={idx}
                            to={subItem.href}
                            className="block px-6 py-3 text-sm text-nav-foreground hover:bg-nav-hover hover:text-accent transition-colors border-b border-nav-border last:border-b-0"
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="hidden lg:flex items-center gap-1 h-full">
              <Link
                to="/trails"
                className="h-full flex items-center gap-2 px-4 text-sm font-medium hover:bg-nav-hover transition-colors border-l border-nav-border"
              >
                <MapPin className="w-4 h-4" />
                <span className="hidden xl:block">FIND A TRAIL</span>
              </Link>
              <Link
                to="/products"
                className="h-full flex items-center gap-2 px-4 text-sm font-medium hover:bg-nav-hover transition-colors border-l border-nav-border"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden xl:block">SHOP PARTS</span>
              </Link>
              <Link
                to="/build"
                className="h-full flex items-center gap-2 px-4 text-sm font-medium hover:bg-nav-hover transition-colors border-l border-nav-border"
              >
                <Wrench className="w-4 h-4" />
                <span className="hidden xl:block">BUILD & PRICE</span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-2">
              <ThemeToggle />
              <button
                className="p-2 hover:bg-nav-hover transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="lg:hidden bg-nav border-t border-nav-border"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="container mx-auto px-4 py-4">
                {navItems.map((item) => (
                  <div key={item.href} className="border-b border-nav-border last:border-b-0">
                    <Link
                      to={item.href}
                      className={`block py-4 text-sm font-medium tracking-wide ${
                        isActiveRoute(item.href) ? 'text-accent' : ''
                      }`}
                    >
                      {item.label}
                    </Link>
                    {item.submenu && (
                      <div className="pl-4 pb-2">
                        {item.submenu.map((subItem, idx) => (
                          <Link
                            key={idx}
                            to={subItem.href}
                            className="block py-2 text-xs text-muted-foreground hover:text-accent"
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Mobile Action Links */}
                <div className="pt-4 grid grid-cols-3 gap-2">
                  <Link to="/trails" className="flex flex-col items-center gap-1 py-3 bg-nav-hover text-center">
                    <MapPin className="w-5 h-5" />
                    <span className="text-xs">Find Trail</span>
                  </Link>
                  <Link to="/products" className="flex flex-col items-center gap-1 py-3 bg-nav-hover text-center">
                    <ShoppingCart className="w-5 h-5" />
                    <span className="text-xs">Shop</span>
                  </Link>
                  <Link to="/build" className="flex flex-col items-center gap-1 py-3 bg-nav-hover text-center">
                    <Wrench className="w-5 h-5" />
                    <span className="text-xs">Build</span>
                  </Link>
                </div>

                <Link
                  to="/auth"
                  className="block mt-4 py-3 text-center text-sm bg-accent text-accent-foreground font-medium"
                >
                  Sign In / Create Account
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navigation;