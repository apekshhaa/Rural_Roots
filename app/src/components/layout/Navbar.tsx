import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, X, Search, ChevronDown, ExternalLink, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { products, blogPosts } from '@/data/content';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
}

const navLinks = [
  { name: 'The Farm', href: '#about' },
  { name: 'Warehouse', href: '#warehouse' },
  { name: 'Blog', href: '#blog' },
  { name: 'Contact', href: '#footer', external: true },
];

const exploreItems = [
  { name: 'Gallery', href: '#gallery' },
  { name: 'Online Shop', href: '#shop' },
  { name: 'Our Story', href: '#about' },
];

const preferenceItems = [
  { name: 'SMS' },
  { name: 'Phone Number' },
  { name: 'In-person' },
];

export function Navbar({ }: NavbarProps) {
  const { isScrolled } = useScrollPosition();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ id: string, name: string, type: 'product' | 'post', href: string }[]>([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }

    const filteredProducts = products
      .filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
      .map(p => ({ id: p.id, name: p.name, type: 'product' as const, href: '#shop' }));

    const filteredPosts = blogPosts
      .filter(p => p.title.toLowerCase().includes(query.toLowerCase()))
      .map(p => ({ id: p.id, name: p.title, type: 'post' as const, href: '#blog' }));

    setSearchResults([...filteredProducts, ...filteredPosts]);
  };

  const handleResultClick = (href: string) => {
    setSearchQuery('');
    setSearchResults([]);
    window.location.hash = href;
  };

  const handlePreferenceClick = (preference: string) => {
    alert(`Preference ${preference} added successfully`);
  };

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

              {/* Loan Link */}
              <a
                href="#shop"
                className="text-white/90 hover:text-farm-mint transition-colors duration-200 text-sm font-medium flex items-center gap-1"
              >
                Loan
              </a>

              {/* Trends Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="text-white/90 hover:text-farm-mint transition-colors duration-200 text-sm font-medium flex items-center gap-1 outline-none">
                  Trends
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

              {/* Preference Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="text-white/90 hover:text-farm-mint transition-colors duration-200 text-sm font-medium flex items-center gap-1 outline-none">
                  Preference
                  <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-farm-dark border-farm-primary/30">
                  {preferenceItems.map((item) => (
                    <DropdownMenuItem
                      key={item.name}
                      onClick={() => handlePreferenceClick(item.name)}
                      className="text-white/90 hover:text-farm-mint hover:bg-farm-primary/30 cursor-pointer"
                    >
                      {item.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Right: Search + Cart */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center relative">
                <div className="flex items-center">
                  <Input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-40 lg:w-52 bg-farm-primary/50 border-farm-primary/50 text-white placeholder:text-white/50 rounded-r-none focus-visible:ring-farm-mint"
                  />
                  <Button
                    size="icon"
                    className="bg-farm-primary/70 hover:bg-farm-primary rounded-l-none border border-l-0 border-farm-primary/50"
                  >
                    <Search className="h-4 w-4 text-white" />
                  </Button>
                </div>

                {/* Search Results Dropdown */}
                <AnimatePresence>
                  {searchResults.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-farm-dark border border-farm-primary/30 rounded-lg shadow-xl overflow-hidden z-50 max-h-60 overflow-y-auto"
                    >
                      {searchResults.map((result) => (
                        <button
                          key={`${result.type}-${result.id}`}
                          onClick={() => handleResultClick(result.href)}
                          className="w-full text-left px-4 py-2 hover:bg-farm-primary/30 transition-colors flex flex-col gap-0.5"
                        >
                          <span className="text-white text-sm font-medium truncate">{result.name}</span>
                          <span className="text-farm-mint text-[10px] uppercase font-bold tracking-wider">{result.type}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <Button
                variant="default"
                className="hidden sm:flex items-center gap-2 bg-farm-mint text-farm-dark hover:bg-farm-mint/90 px-4 py-2 rounded-md font-semibold ml-2 shadow-sm"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
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
                <motion.a
                  href="#shop"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="pt-4 border-t border-white/10 text-2xl text-white/90 hover:text-farm-mint transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Loan
                </motion.a>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="pt-4 border-t border-white/10"
                >
                  <span className="text-sm text-white/50 uppercase tracking-wider">
                    Trends
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
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="pt-4 border-t border-white/10"
                >
                  <span className="text-sm text-white/50 uppercase tracking-wider">
                    Preference
                  </span>
                  <div className="flex flex-col gap-2 mt-2">
                    {preferenceItems.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => {
                          handlePreferenceClick(item.name);
                          setMobileMenuOpen(false);
                        }}
                        className="text-lg text-left text-white/70 hover:text-farm-mint transition-colors"
                      >
                        {item.name}
                      </button>
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
