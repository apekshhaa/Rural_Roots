import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, ShoppingCart, ChevronDown, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useScrollPosition } from '@/hooks/useScrollPosition';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
}

const navLinks = [
  { name: 'The Farm', href: '#about' },
  { name: 'Practices', href: '#sustainable' },
  { name: 'Blog', href: '#blog' },
  { name: 'Contact', href: '#footer', external: true },
];

const harvestItems = [
  { name: 'Fresh Produce', href: '#selection' },
  { name: 'Dairy & Eggs', href: '#selection' },
  { name: 'Baked Goods', href: '#selection' },
];

const exploreItems = [
  { name: 'Gallery', href: '#gallery' },
  { name: 'Online Shop', href: '#shop' },
  { name: 'Our Story', href: '#about' },
];

export function Navbar({ cartCount, onCartClick }: NavbarProps) {
  const { isScrolled } = useScrollPosition();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
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
                className="lg:hidden text-farm-dark bg-farm-mint hover:bg-farm-mint/90 rounded-md"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                className="hidden lg:flex items-center gap-2 text-farm-dark bg-farm-mint hover:bg-farm-mint/90 px-4 py-2 rounded-md font-medium"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
                <span>Menu</span>
              </Button>
              <a
                href="#"
                className="text-2xl font-serif font-semibold text-white tracking-wide"
              >
                Rural Roots
              </a>
            </div>

            {/* Center: Navigation Links */}
            <div className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-white/90 hover:text-farm-mint transition-colors duration-200 text-sm font-medium flex items-center gap-1"
                >
                  {link.name}
                  {link.external && <ExternalLink className="h-3 w-3" />}
                </a>
              ))}

              {/* Harvest Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="text-white/90 hover:text-farm-mint transition-colors duration-200 text-sm font-medium flex items-center gap-1 outline-none">
                  Harvest
                  <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-farm-dark border-farm-primary/30">
                  {harvestItems.map((item) => (
                    <DropdownMenuItem
                      key={item.name}
                      className="text-white/90 hover:text-farm-mint hover:bg-farm-primary/30 cursor-pointer"
                    >
                      <a href={item.href}>{item.name}</a>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Explore Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="text-white/90 hover:text-farm-mint transition-colors duration-200 text-sm font-medium flex items-center gap-1 outline-none">
                  Explore
                  <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-farm-dark border-farm-primary/30">
                  {exploreItems.map((item) => (
                    <DropdownMenuItem
                      key={item.name}
                      className="text-white/90 hover:text-farm-mint hover:bg-farm-primary/30 cursor-pointer"
                    >
                      <a href={item.href}>{item.name}</a>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Right: Search + Cart */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center">
                <Input
                  type="text"
                  placeholder="Search..."
                  className="w-40 lg:w-52 bg-farm-primary/50 border-farm-primary/50 text-white placeholder:text-white/50 rounded-r-none focus-visible:ring-farm-mint"
                />
                <Button
                  size="icon"
                  className="bg-farm-primary/70 hover:bg-farm-primary rounded-l-none border border-l-0 border-farm-primary/50"
                >
                  <Search className="h-4 w-4 text-white" />
                </Button>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-white hover:text-farm-mint hover:bg-transparent"
                onClick={onCartClick}
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-farm-mint text-farm-dark text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
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
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="pt-4 border-t border-white/10"
                >
                  <span className="text-sm text-white/50 uppercase tracking-wider">
                    Harvest
                  </span>
                  <div className="flex flex-col gap-2 mt-2">
                    {harvestItems.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="text-lg text-white/70 hover:text-farm-mint transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="pt-4 border-t border-white/10"
                >
                  <span className="text-sm text-white/50 uppercase tracking-wider">
                    Explore
                  </span>
                  <div className="flex flex-col gap-2 mt-2">
                    {exploreItems.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="text-lg text-white/70 hover:text-farm-mint transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </motion.div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
