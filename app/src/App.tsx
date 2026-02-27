import { useState } from 'react';
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
import FarmerPortal from '@/components/sections/FarmerPortal';
import { useCart } from '@/hooks/useCart';
import type { Product } from '@/types';

function App() {
  const [view, setView] = useState<'landing' | 'portal'>('landing');
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
      <Navbar
        cartCount={totalItems}
        onCartClick={() => setIsOpen(true)}
        onPortalClick={() => setView(view === 'landing' ? 'portal' : 'landing')}
        isPortalActive={view === 'portal'}
      />

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
        {view === 'landing' ? (
          <>
            <HeroSection />
            <AboutSection />
            <WarehouseSection />
            <SustainableSection />
            <FarmSection />
            <GallerySection />
            <ShopSection onAddToCart={handleAddToCart} />
            <BlogSection />
          </>
        ) : (
          <FarmerPortal onBack={() => setView('landing')} />
        )}
      </main>

      {/* Footer */}
      {view === 'landing' && <Footer />}
    </div>
  );
}

export default App;
