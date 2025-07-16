import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Menu, X, Mountain, ChevronDown } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Track scroll position for glass effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const navItems = [
    { href: '/', label: 'Home' },
    { 
      href: '/vehicles', 
      label: 'Vehicles',
      submenu: [
        { href: '/vehicles', label: 'Browse All Models' },
        { href: '/compare', label: 'Compare Vehicles' }
      ]
    },
    { 
      href: '/clubs-events', 
      label: 'Events',
      submenu: [
        { href: '/clubs-events', label: 'Rally Events' },
        { href: '/clubs-events', label: 'Clubs & Teams' }
      ]
    },
    { 
      href: '/insurance', 
      label: 'Insurance',
      submenu: [
        { href: '/insurance', label: 'Compare Quotes' },
        { href: '/insurance', label: 'Coverage Guide' }
      ]
    },
    { href: '/trails', label: 'Trails' },
    { href: '/build', label: 'Build' },
    { href: '/products', label: 'Products' },
    { href: '/blog', label: 'Blog' },
    { href: '/about', label: 'About' },
  ];

  const isActiveRoute = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'glass-effect border-b border-border/20 py-1' 
        : 'bg-transparent py-2'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="flex items-center space-x-2 md:space-x-3 font-heading font-black text-xl md:text-2xl group">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl premium-gradient flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Mountain className="h-5 w-5 md:h-7 md:w-7 text-white" />
              </div>
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent hidden sm:block">
                OffRoadGo
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                <Link
                  to={item.href}
                  className={`text-foreground hover:text-primary transition-all duration-300 font-semibold relative group flex items-center gap-1 ${
                    isActiveRoute(item.href) ? 'text-primary' : ''
                  }`}
                >
                  {item.label}
                  {item.submenu && <ChevronDown className="w-4 h-4" />}
                  <span className={`absolute bottom-0 left-0 h-0.5 premium-gradient transition-all duration-300 ${
                    isActiveRoute(item.href) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </Link>

                {/* Submenu */}
                {item.submenu && (
                  <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <div className="bg-background border border-border rounded-xl shadow-lg py-2 min-w-[180px] backdrop-blur-sm">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.href}
                          to={subItem.href}
                          className="block px-4 py-3 text-sm text-foreground hover:text-primary hover:bg-primary/10 transition-colors border-b border-border/10 last:border-b-0"
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
            
            <div className="flex items-center ml-2 lg:ml-4">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <motion.button
              className="p-2 rounded-xl hover:bg-primary/10 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="md:hidden mt-4 glass-effect rounded-2xl border border-border/20"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="py-6 px-4 space-y-4">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link
                      to={item.href}
                      className={`block py-3 px-4 rounded-xl transition-all duration-300 font-semibold text-lg ${
                        isActiveRoute(item.href)
                          ? 'bg-primary/10 text-primary'
                          : 'text-foreground hover:bg-primary/5 hover:text-primary'
                      }`}
                    >
                      {item.label}
                    </Link>
                    {item.submenu && isActiveRoute(item.href) && (
                      <div className="ml-4 mt-2 space-y-1">
                        {item.submenu.map((subItem) => (
                          <Link
                            key={subItem.href}
                            to={subItem.href}
                            className="block py-2 px-4 text-sm text-muted-foreground hover:text-primary transition-colors"
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
                
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navigation;