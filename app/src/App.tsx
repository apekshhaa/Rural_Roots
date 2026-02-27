import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { WarehouseSection } from '@/components/sections/WarehouseSection';
import { SustainableSection } from '@/components/sections/SustainableSection';
import { FarmSection } from '@/components/sections/FarmSection';
import { GallerySection } from '@/components/sections/GallerySection';
import { ShopSection } from '@/components/sections/ShopSection';
import { BlogSection } from '@/components/sections/BlogSection';
import { useCart } from '@/hooks/useCart';
import type { Product } from '@/types';
import Login from '@/components/Login';

function Home() {
  const {
    items,
    isOpen,
    setIsOpen,
    addItem,
    removeItem,
    updateQuantity,
    totalItems,
    totalPrice,
  } = useCart();

  const handleAddToCart = (product: Product) => {
    addItem(product);
    setIsOpen(true);
  };

  return (
    <div className="min-h-screen bg-farm-cream">
      {/* Navigation */}
      <Navbar cartCount={totalItems} onCartClick={() => setIsOpen(true)} />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        items={items}
        onUpdateQuantity={updateQuantity}
        onRemove={removeItem}
        totalPrice={totalPrice}
      />

      {/* Main Content */}
      <main>
        <HeroSection />
        <AboutSection />
        <WarehouseSection />
        <SustainableSection />
        <FarmSection />
        <GallerySection />
        <ShopSection onAddToCart={handleAddToCart} />
        <BlogSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
