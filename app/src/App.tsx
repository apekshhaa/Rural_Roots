import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { WarehouseSection } from '@/components/sections/WarehouseSection';
import { SustainableSection } from '@/components/sections/SustainableSection';
import { FarmSection } from '@/components/sections/FarmSection';
import FarmerPortal from '@/components/sections/FarmerPortal';
import Login from '@/components/Login';

function Home() {
  const [view, setView] = useState<'landing' | 'portal'>('landing');

  return (
    <div className="min-h-screen bg-farm-cream">
      {/* Navigation */}
      <Navbar
        onPortalClick={() => setView(view === 'landing' ? 'portal' : 'landing')}
        isPortalActive={view === 'portal'}
      />

      {/* Main Content */}
      <main>
        {view === 'landing' ? (
          <>
            <HeroSection />
            <AboutSection />
            <SustainableSection />
            <FarmSection />
            <WarehouseSection /> {/* Keeping only for Chatbot until user confirms removal of chatbot too */}
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
