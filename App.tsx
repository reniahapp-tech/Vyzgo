import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroCard from './components/HeroCard';
import CategoryCard from './components/CategoryCard';
import ContentCard from './components/ContentCard';
import WhatsAppButton from './components/WhatsAppButton';
import AdminPanel from './components/AdminPanel';
import ProductModal from './components/ProductModal';
import CartModal from './components/CartModal';
import QuizModal from './components/QuizModal';
import TrackingModal from './components/TrackingModal';
import LocationModal from './components/LocationModal';
import SocialFooter from './components/SocialFooter';
import CategoryView from './components/CategoryView';
import ProductView from './components/ProductView';
import ToastContainer from './components/ToastContainer';
import { ConfigProvider, useConfig } from './contexts/ConfigContext';

// Hook to detect offline status
const useNetworkStatus = () => {
  const { addToast } = useConfig();

  useEffect(() => {
    const handleOffline = () => addToast('Você está offline. Verifique sua conexão.', 'error');
    const handleOnline = () => addToast('Conexão restabelecida!', 'success');

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []); // Empty dependency array = run once on mount
};

const AppContent: React.FC = () => {
  const { config, currentView } = useConfig();
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  
  // Initialize Network Listener
  useNetworkStatus();

  // Router Logic
  const renderView = () => {
    switch (currentView.type) {
      case 'CATEGORY':
        const category = config.categories.find(c => c.id === currentView.categoryId);
        if (!category) return <div>Categoria não encontrada</div>;
        return <CategoryView category={category} />;
      
      case 'PRODUCT':
        // Find product across all categories
        let foundProduct;
        for (const cat of config.categories) {
          const p = cat.products.find(prod => prod.id === currentView.productId);
          if (p) {
            foundProduct = p;
            break;
          }
        }
        if (!foundProduct) return <div>Produto não encontrado</div>;
        return <ProductView product={foundProduct} fromCategoryId={currentView.fromCategoryId} />;

      case 'HOME':
      default:
        return (
          <>
            <div className="animate-fade-in" style={{ animationDelay: '0ms' }}>
              <Header />
            </div>
            
            <main className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {/* 1. Hero Card - Full Width (Span 2 on mobile, Span 4 on tablet) */}
              <div className="col-span-2 md:col-span-4 animate-fade-in" style={{ animationDelay: '100ms' }}>
                 <HeroCard onClick={() => setIsProductModalOpen(true)} />
              </div>
              
              {/* 2. Categories Grid */}
              {config.categories.map((item, index) => (
                <div 
                  key={item.id} 
                  className="col-span-1 animate-fade-in" 
                  style={{ animationDelay: `${200 + (index * 50)}ms` }}
                >
                  <CategoryCard item={item} />
                </div>
              ))}
              
              {/* 3. Content Card (Quiz) - Full Width on Mobile, Span 4 on tablet (or 2 if we had another card) */}
              <div className="col-span-2 md:col-span-4 animate-fade-in" style={{ animationDelay: '400ms' }}>
                 <ContentCard onClick={() => setIsQuizModalOpen(true)} />
              </div>
            </main>
            
            <div className="mt-6 md:mt-10 animate-fade-in" style={{ animationDelay: '500ms' }}>
              <WhatsAppButton />
            </div>

            <div className="animate-fade-in" style={{ animationDelay: '600ms' }}>
              <SocialFooter />
            </div>
          </>
        );
    }
  };

  return (
    <div 
      className="min-h-screen font-sans selection:text-white transition-colors duration-300"
      style={{ 
        backgroundColor: config.theme.backgroundColor,
        color: config.theme.textColor 
      }}
    >
      <div 
        className="w-full max-w-md md:max-w-3xl lg:max-w-5xl mx-auto min-h-screen relative shadow-2xl shadow-gray-200/50 flex flex-col transition-colors duration-300"
        style={{ backgroundColor: config.theme.backgroundColor }}
      >
        {/* Main Content Area */}
        <div className="p-6 md:p-8 lg:p-10 flex-grow flex flex-col">
          {renderView()}

          {/* Footer note (only on home) */}
          {currentView.type === 'HOME' && (
            <div className="mt-2 text-center opacity-40 text-sm font-medium pb-4 animate-fade-in" style={{ animationDelay: '600ms' }}>
              <p>{config.footerText}</p>
            </div>
          )}
        </div>

        {/* Global Modals & Overlays */}
        <ProductModal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} />
        <QuizModal isOpen={isQuizModalOpen} onClose={() => setIsQuizModalOpen(false)} />
        <TrackingModal />
        <LocationModal />
        <CartModal />
        <ToastContainer />
        
        <AdminPanel />
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ConfigProvider>
      <AppContent />
    </ConfigProvider>
  );
};

export default App;