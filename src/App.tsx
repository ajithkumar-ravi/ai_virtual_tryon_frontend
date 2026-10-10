import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext.js';
import { ToastProvider, useToast } from './context/ToastContext.js';
import { useVirtualTryOn } from './hooks/useVirtualTryOn.js';
import { ApiService } from './services/api.js';
import { Product } from './types.js';

import { Navbar } from './components/Navbar.js';
import { HeroSection } from './components/HeroSection.js';
import { HowItWorks } from './components/HowItWorks.js';
import { ProductCatalog } from './components/ProductCatalog.js';
import { TryOnWorkspace } from './components/TryOnWorkspace.js';
import { Footer } from './components/Footer.js';
import { ToastContainer } from './components/ToastContainer.js';

function MainTrialRoomApp() {
  const { addToast } = useToast();
  const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);
  const [activeNav, setActiveNav] = useState<string>('home');

  // Load catalog products initially for the workspace garment picker
  useEffect(() => {
    let mounted = true;
    async function fetchCatalog() {
      try {
        const data = await ApiService.getProducts({ limit: 12 });
        if (mounted && data.products) {
          setCatalogProducts(data.products);
        }
      } catch (err) {
        console.warn('Initial product catalog load notice:', err);
      }
    }
    fetchCatalog();
    return () => {
      mounted = false;
    };
  }, []);

  const tryOnState = useVirtualTryOn((msg, type) => {
    addToast(msg, type);
  });

  const handleNavigate = (sectionId: string) => {
    setActiveNav(sectionId);
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleSelectProductFromCatalog = (product: Product) => {
    tryOnState.selectProductGarment(product);
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 transition-colors duration-200">
      {/* Navigation Header */}
      <Navbar onNavigate={handleNavigate} activeSection={activeNav} />

      <main className="flex-grow">
        {/* Hero Section */}
        <HeroSection
          onStartTryOn={() => handleNavigate('try-room')}
          onExploreCatalog={() => handleNavigate('catalog')}
        />

        {/* AI Virtual Trial Room Workspace (Main Core Feature) */}
        <TryOnWorkspace
          personFile={tryOnState.personFile}
          personPreviewUrl={tryOnState.personPreviewUrl}
          onSetPersonPhoto={tryOnState.setPersonPhoto}
          onRemovePersonPhoto={tryOnState.removePersonPhoto}
          garmentFile={tryOnState.garmentFile}
          garmentPreviewUrl={tryOnState.garmentPreviewUrl}
          selectedProduct={tryOnState.selectedProduct}
          onSelectProductGarment={tryOnState.selectProductGarment}
          onUploadCustomGarment={tryOnState.uploadCustomGarment}
          onRemoveGarment={tryOnState.removeGarment}
          category={tryOnState.category}
          onSetCategory={tryOnState.setCategory}
          loading={tryOnState.loading}
          step={tryOnState.step}
          statusMessage={tryOnState.statusMessage}
          resultData={tryOnState.resultData}
          error={tryOnState.error}
          onGenerateTryOn={tryOnState.generateTryOn}
          onTryAnotherOutfit={tryOnState.tryAnotherOutfit}
          onResetAll={tryOnState.resetAll}
          catalogProducts={catalogProducts}
        />

        {/* Wardrobe / Products Catalog */}
        <ProductCatalog
          onSelectProduct={handleSelectProductFromCatalog}
          selectedProductId={tryOnState.selectedProduct?.id}
        />

        {/* 3-Step Process Explanation */}
        <HowItWorks />
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Toast Alerts */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <MainTrialRoomApp />
      </ToastProvider>
    </ThemeProvider>
  );
}
