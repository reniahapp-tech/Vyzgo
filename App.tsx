import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useParams, useLocation, Navigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import Header from './components/Header';
import HeroCard from './components/HeroCard';
import CategoryCard from './components/CategoryCard';
import ContentCard from './components/ContentCard';
import WhatsAppButton from './components/WhatsAppButton';
import AdminPanel from './components/AdminPanel';
import ProductModal from './components/ProductModal';
import CartModal from './components/CartModal';
import CheckoutModal from './components/CheckoutModal';
import QuizModal from './components/QuizModal';
import TrackingModal from './components/TrackingModal';
import LocationModal from './components/LocationModal';
import SocialFooter from './components/SocialFooter';
import CategoryView from './components/CategoryView';
import ProductView from './components/ProductView';
import ToastContainer from './components/ToastContainer';
import { CorporateDashboard } from './components/CorporateDashboard';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import OnboardingWizard from './components/OnboardingWizard';
import { ConfigProvider, useConfig } from './contexts/ConfigContext';
import { PluginProvider } from './contexts/PluginContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import SearchBar from './components/SearchBar';
import AuthCallback from './components/AuthCallback';
import TermsOfUse from './components/TermsOfUse';
import PrivacyPolicy from './components/PrivacyPolicy';
import FeaturedCarousel from './components/FeaturedCarousel';
import StoreMap from './components/StoreMap';

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
  }, []);
};

const Home: React.FC<{ setIsProductModalOpen: (v: boolean) => void, setIsQuizModalOpen: (v: boolean) => void }> = ({ setIsProductModalOpen, setIsQuizModalOpen }) => {
  const { config } = useConfig();

  return (
    <div className="min-h-screen bg-[#FDFBF7] relative overflow-x-hidden">
      
      {/* ====== HEADER – inside max-width container ====== */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 sticky top-0 z-50 bg-[#FDFBF7]">
        <div className="animate-fade-in">
          <Header />
        </div>
      </div>

      {/* ====== BANNER – full width, no padding ====== */}
      <section className="w-full animate-fade-in" style={{ animationDelay: '80ms' }}>
        <HeroCard onClick={() => setIsProductModalOpen(true)} />
      </section>

      {/* ====== REST OF CONTENT – back inside max-width container ====== */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 relative z-10">
        <main className="space-y-14 py-10 pb-28">

          {/* 2. Coleções - Boutique Showcase Formation */}
          <section className="animate-fade-in" style={{ animationDelay: '150ms' }}>
             <div className="flex flex-col mb-8 px-1">
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-2 leading-none">Curadoria Especial</span>
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter text-gray-900 leading-none">
                    Nossas <span className="text-indigo-600">Coleções</span>
                  </h3>
                  <div className="h-[1px] flex-grow bg-gray-100 mx-6 hidden md:block"></div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full border border-gray-100">Deslize p/ ver mais →</span>
                </div>
             </div>
             
             <div className="flex gap-4 overflow-x-auto pb-8 -mx-6 px-6 scrollbar-hide snap-x">
               {config.categories
                 .filter(item => item.id !== 'location' && item.id !== 'tracking') 
                 .map((item, index) => (
                 <div
                   key={item.id}
                   className="snap-start animate-fade-in"
                   style={{ animationDelay: `${200 + (index * 100)}ms` }}
                 >
                   <CategoryCard item={item} />
                 </div>
               ))}
               
               {/* Last Card Placeholder for visual balance */}
               <div className="w-[1px] shrink-0"></div>
             </div>
          </section>

          {/* SearchBar - Minimal Pill */}
          <section className="animate-fade-in" style={{ animationDelay: '250ms' }}>
            <SearchBar />
          </section>

          {/* 3. Featured Products - Carousel */}
          <section className="animate-fade-in" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center gap-2 mb-6 px-1">
               <div className="w-1 h-4 bg-indigo-600 rounded-full"></div>
               <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">
                 Destaques da Temporada
               </h3>
             </div>
            <FeaturedCarousel />
          </section>

          {/* 4. Store Map & Location */}
          <section className="animate-fade-in" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center gap-2 mb-4 px-1 text-gray-400">
               <MapPin size={14} />
               <h3 className="text-[10px] font-black uppercase tracking-widest">Localização</h3>
            </div>
            <StoreMap />
          </section>
        </main>

        <div className="animate-fade-in" style={{ animationDelay: '500ms' }}>
          <WhatsAppButton />
        </div>

        <div className="animate-fade-in mt-12" style={{ animationDelay: '600ms' }}>
          <SocialFooter />
        </div>

        {/* Footer note */}
        <div className="mt-8 text-center opacity-30 text-[9px] uppercase font-black tracking-widest pb-12 animate-fade-in" style={{ animationDelay: '600ms' }}>
          <p>{config.footerText}</p>
        </div>
      </div>
    </div>
  );
};

const CategoryRoute = () => {
  const { categoryId } = useParams();
  const { config } = useConfig();
  const category = config.categories.find(c => c.id === categoryId);

  if (!category) return <div className="p-10 text-center opacity-50">Categoria não encontrada</div>;
  return <CategoryView category={category} />;
};

const ProductRoute = () => {
  const { productId } = useParams();
  const location = useLocation();
  const { config } = useConfig();

  let foundProduct;
  for (const cat of config.categories) {
    const p = cat.products.find(prod => prod.id === productId);
    if (p) {
      foundProduct = p;
      break;
    }
  }

  if (!foundProduct) return <div className="p-10 text-center opacity-50">Produto não encontrado</div>;

  const fromCategoryId = (location.state as any)?.fromCategoryId;

  return <ProductView product={foundProduct} fromCategoryId={fromCategoryId} />;
};

// Protected route — only accessible when admin is authenticated
const ProtectedSetup: React.FC = () => {
  const { isAdmin, loading, hasStore } = useAuth();
  
  if (loading) return <FullScreenLoader />;
  if (!isAdmin) return <Navigate to="/login" replace />;
  
  return <OnboardingWizard />;
};

const FullScreenLoader = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50">
    <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
    <p className="text-sm font-bold text-gray-500 animate-pulse">Carregando VyzGo...</p>
  </div>
);

const StoreNotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-white">
    <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6 text-4xl">
      🏝️
    </div>
    <h1 className="text-2xl font-black text-gray-800 mb-2">VyzGo não encontrada</h1>
    <p className="text-gray-500 max-w-xs mb-8">
      Este endereço não parece estar vinculado a nenhuma loja ativa no momento.
    </p>
    <a href="/demo" className="px-6 py-3 bg-gray-900 text-white rounded-2xl font-bold shadow-xl hover:scale-105 transition-transform">
      Ver Demonstração
    </a>
  </div>
);


const AppContent: React.FC = () => {
  const { config, isLoadingStore, isNotFound, storeId } = useConfig();
  const { user, isAdmin, hasStore, loading: authLoading } = useAuth();
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);

  // Initialize Network Listener
  useNetworkStatus();

  if (isLoadingStore || authLoading) return <FullScreenLoader />;

  const hostname = window.location.hostname;
  const pathname = window.location.pathname;
  
  const isMainDomain = hostname === 'vyzgo.com' || hostname === 'www.vyzgo.com' || hostname.includes('vercel.app') || hostname === 'localhost';
  const isAppDashboard = hostname === 'app.vyzgo.com';
  
  // Detect store slug from subdomain or path fallback /v/slug
  let storeSlugFromUrl = '';
  if (!isMainDomain && !isAppDashboard) {
    storeSlugFromUrl = hostname.split('.')[0];
  } else if (isAppDashboard && pathname.startsWith('/v/')) {
    storeSlugFromUrl = pathname.split('/')[2];
  }

  const isLandingPage = isMainDomain && (pathname === "/" || pathname === "/index.html");
  
  if (isLandingPage) {
    return (
      <Routes>
        <Route path="*" element={<LandingPage />} />
      </Routes>
    );
  }

  // Força a AuthPage se for o domínio do app e o usuário NÃO estiver logado
  if (isAppDashboard && !user && !pathname.startsWith('/auth') && pathname !== '/corporate') {
    return <AuthPage />;
  }

  if (isNotFound && !isLandingPage && !isAppDashboard && storeId !== 'demo' && !window.location.pathname.startsWith('/auth')) {
    return <StoreNotFound />;
  }

  // RENDERIZAÇÃO PRINCIPAL
  return (
    <div 
      className="min-h-screen flex flex-col font-sans transition-colors duration-500"
      style={{ 
        backgroundColor: isAppDashboard ? '#0A0A0A' : config.theme.backgroundColor,
        color: config.theme.textColor
      }}
    >
      <div
        className="w-full max-w-md md:max-w-3xl lg:max-w-5xl mx-auto min-h-screen relative shadow-2xl shadow-gray-200/50 flex flex-col transition-colors duration-300 overflow-hidden"
        style={{ backgroundColor: config.theme.backgroundColor }}
      >
        {/* Main Content Area */}
        <div className="flex-grow flex flex-col">
          <Routes>
            <Route path="/" element={
              isAppDashboard ? (
                hasStore ? <AdminPanel isStandalone={true} /> : <Navigate to="/setup" replace />
              ) : (
                <Home setIsProductModalOpen={setIsProductModalOpen} setIsQuizModalOpen={setIsQuizModalOpen} />
              )
            } />
            <Route path="/v/:slug" element={<Home setIsProductModalOpen={setIsProductModalOpen} setIsQuizModalOpen={setIsQuizModalOpen} />} />
            <Route path="/demo" element={<Home setIsProductModalOpen={setIsProductModalOpen} setIsQuizModalOpen={setIsQuizModalOpen} />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/setup" element={<ProtectedSetup />} />
            <Route path="/corporate" element={<CorporateDashboard />} />
            <Route path="/category/:categoryId" element={<CategoryRoute />} />
            <Route path="/product/:productId" element={<ProductRoute />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/terms" element={<TermsOfUse />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
          </Routes>
        </div>

        {/* Global Modals & Overlays (Only for store view) */}
        {!isAppDashboard && (
          <>
            <ProductModal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} />
            <QuizModal isOpen={isQuizModalOpen} onClose={() => setIsQuizModalOpen(false)} />
            <TrackingModal />
            <LocationModal />
            <CartModal />
            <CheckoutModal />
            <ToastContainer />
            <AdminPanel />
          </>
        )}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ConfigProvider>
          <PluginProvider>
            <AppContent />
          </PluginProvider>
        </ConfigProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;