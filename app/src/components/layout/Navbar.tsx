import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, X, LayoutDashboard, Menu, ChevronDown, Sprout, TrendingUp, Settings, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useScrollPosition } from '@/hooks/useScrollPosition';

interface NavbarProps {
  onPortalClick: () => void;
  isPortalActive: boolean;
}

const navLinks = [
  { name: 'The Farm', href: '#about' },
];

const harvestItems = [
  { name: 'Warehouse Booking', href: '#warehouse', icon: <Sprout className="h-4 w-4" /> },
  { name: 'Market Prices', href: '#prices', icon: <TrendingUp className="h-4 w-4" /> },
  { name: 'Equipment Rental', href: '#equipment', icon: <Settings className="h-4 w-4" /> },
];

const trendsItems = [
  { name: 'Crop Trends', href: '#trends', icon: <TrendingUp className="h-4 w-4" /> },
  { name: 'Weather Forecast', href: '#weather', icon: <Sprout className="h-4 w-4" /> },
  { name: 'Soil Health', href: '#soil', icon: <Settings className="h-4 w-4" /> },
];

const preferenceItems = [
  { name: 'Language', href: '#language', icon: <Languages className="h-4 w-4" /> },
  { name: 'Theme', href: '#theme', icon: <Settings className="h-4 w-4" /> },
  { name: 'Notifications', href: '#notifications', icon: <Sprout className="h-4 w-4" /> },
];

export function Navbar({ onPortalClick, isPortalActive }: NavbarProps) {
  const navigate = useNavigate();
  const { isScrolled } = useScrollPosition();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? 'bg-farm-dark/95 backdrop-blur-md shadow-lg'
          : 'bg-farm-dark/80'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            {/* Left: Menu Button + Logo */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-white hover:text-farm-mint hover:bg-transparent -ml-2"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </Button>
              <button
                onClick={() => isPortalActive ? onPortalClick() : undefined}
                className="text-2xl font-serif font-semibold text-white tracking-wide hover:text-farm-mint transition-colors"
              >
                Rural Roots
              </button>
            </div>

            {/* Center: Navigation Links */}
            <div className="hidden lg:flex items-center gap-6">
              {!isPortalActive ? (
                <>
                  {navLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      className="text-white/90 hover:text-farm-mint transition-colors duration-200 text-sm font-medium flex items-center gap-1"
                    >
                      {link.name}
                    </a>
                  ))}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <a href="#warehouse" className="text-white/90 hover:text-farm-mint transition-colors duration-200 text-sm font-medium flex items-center gap-1 outline-none cursor-pointer">
                        Warehouse <ChevronDown className="h-4 w-4" />
                      </a>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-farm-dark border-white/10 text-white">
                      {harvestItems.map((item) => (
                        <DropdownMenuItem key={item.name} asChild className="hover:bg-white/10 cursor-pointer">
                          <a href={item.href} className="flex items-center gap-2 w-full">
                            {item.icon} {item.name}
                          </a>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <a href="#trends" className="text-white/90 hover:text-farm-mint transition-colors duration-200 text-sm font-medium flex items-center gap-1 outline-none cursor-pointer">
                        Trends <ChevronDown className="h-4 w-4" />
                      </a>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-farm-dark border-white/10 text-white">
                      {trendsItems.map((item) => (
                        <DropdownMenuItem key={item.name} asChild className="hover:bg-white/10 cursor-pointer">
                          <a href={item.href} className="flex items-center gap-2 w-full">
                            {item.icon} {item.name}
                          </a>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <a href="#preference" className="text-white/90 hover:text-farm-mint transition-colors duration-200 text-sm font-medium flex items-center gap-1 outline-none cursor-pointer">
                        Preference <ChevronDown className="h-4 w-4" />
                      </a>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-farm-dark border-white/10 text-white">
                      {preferenceItems.map((item) => (
                        <DropdownMenuItem key={item.name} asChild className="hover:bg-white/10 cursor-pointer">
                          <a href={item.href} className="flex items-center gap-2 w-full">
                            {item.icon} {item.name}
                          </a>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <button
                  onClick={onPortalClick}
                  className="text-farm-mint hover:text-white transition-colors duration-200 text-lg font-medium flex items-center gap-2"
                >
                  ← Back to Main Site
                </button>
              )}
            </div>

            {/* Right: Logout + Farmer Portal */}
            <div className="flex items-center gap-3">
              {!isPortalActive && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-red-500 hover:bg-transparent"
                  onClick={() => navigate('/')}
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              )}
              <Button
                variant="default"
                onClick={onPortalClick}
                className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-md font-semibold ml-2 shadow-sm transition-all ${isPortalActive
                  ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30 border border-red-500/50'
                  : 'bg-farm-mint text-farm-dark hover:bg-farm-mint/90'
                  }`}
              >
                {isPortalActive ? (
                  <>
                    <LogOut className="h-4 w-4" />
                    <span>Exit Portal</span>
                  </>
                ) : (
                  <>
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Farmer Portal</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-farm-dark/95 backdrop-blur-lg"
          >
            <div className="flex flex-col h-full p-6">
              <div className="flex items-center justify-between mb-8">
                <span className="text-2xl font-serif font-semibold text-white">
                  Rural Roots
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-farm-mint"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              <nav className="flex flex-col gap-4">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-2xl text-white/90 hover:text-farm-mint transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </motion.a>
                ))}

                <div className="flex flex-col gap-2 pt-2">
                  <span className="text-white/40 text-sm uppercase tracking-widest font-bold">Services</span>
                  {harvestItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="text-xl text-white/90 hover:text-farm-mint transition-colors py-1"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </a>
                  ))}
                  {trendsItems.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="text-xl text-white/90 hover:text-farm-mint transition-colors py-1"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <button
                  className="pt-4 border-t border-white/10 text-2xl text-red-500 hover:text-red-400 transition-colors py-2 text-left"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/');
                  }}
                >
                  Logout
                </button>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
