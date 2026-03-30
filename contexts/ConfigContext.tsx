import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadConfigFromR2 } from '../services/r2';
import { ProductService } from '../services/productService';
import { StoreService, StoreData } from '../services/storeService';
import { useAuth } from './AuthContext';
import { AppConfig, CategoryItem, CartItem, ProductItem, Toast, Order, Coupon } from '../types';

// SAAS CONFIGURATION
const DEFAULT_STORE_ID = 'demo';

const BASE_CONFIGS: Record<string, AppConfig> = {
  // GENERIC TEMPLATE (Default)
  demo: {
    storeMode: 'mixed',
    enableWhatsapp: true,
    plan: 'pro',
    footerText: 'VyzGo - Demonstração',
    theme: {
      backgroundColor: '#FDFBF7',
      primaryColor: '#C27B63',
      secondaryColor: '#8DA893',
      accentColor: '#25D366',
      textColor: '#1A2E22',
    },
    header: {
      title: 'VyzGo',
      subtitle: 'Sua vitrine digital inteligente',
      logoUrl: '/logo-main.png',
      avatarUrl: '/logo-icon.png',
      showStatus: true,
    },
    hero: {
      title: 'Coleção Verão 2025',
      subtitle: 'Leveza e estilo para os dias de sol.',
      description: 'Descubra peças exclusivas feitas com tecidos sustentáveis e design atemporal. A escolha perfeita para quem busca conforto sem abrir mão da elegância.',
      price: 'A partir de R$ 89,90',
      buttonText: 'Ver Coleção',
      imageUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1000&auto=format&fit=crop',
    },
    categories: [
      {
        id: 'lancamentos',
        title: 'Lançamentos',
        subtitle: 'Novidades da semana',
        iconKey: 'Sparkles',
        bgColor: '#FFF5F5',
        iconColor: '#E53E3E',
        products: [
          { id: 'l1', title: 'Vestido Floral Midi', price: 'R$ 149,90', description: 'Vestido leve com estampa floral exclusiva, perfeito para ocasiões diurnas.', imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800' },
          { id: 'l2', title: 'Conjunto Linho Bege', price: 'R$ 219,90', description: 'Elegância e frescor. Conjunto de calça e blazer em linho puro.', imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800' }
        ]
      },
      {
        id: 'acessorios',
        title: 'Acessórios',
        subtitle: 'Complemente seu look',
        iconKey: 'ShoppingBag',
        bgColor: '#F0FFF4',
        iconColor: '#38A169',
        products: [
          { id: 'a1', title: 'Bolsa Couro Caramelo', price: 'R$ 289,90', description: 'Design minimalista e espaçosa. Ideal para o dia a dia.', imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800' },
          { id: 'a2', title: 'Óculos de Sol Vintage', price: 'R$ 99,90', description: 'Proteção UV400 com estilo retrô.', imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800' }
        ]
      },
      {
        id: 'sapatos',
        title: 'Sapatos',
        subtitle: 'Conforto e design',
        iconKey: 'Anchor',
        bgColor: '#EEF2FF',
        iconColor: '#6366F1',
        products: [
          { id: 's1', title: 'Sandália Salto Bloco', price: 'R$ 129,90', description: 'Conforto garantido para o dia todo.', imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800' }
        ]
      },
      {
        id: 'tracking',
        title: 'Rastrear Pedido',
        subtitle: 'Acompanhe sua entrega',
        iconKey: 'Package',
        bgColor: '#FFFFFF',
        iconColor: '#D97706',
        hasBorder: true,
        products: []
      },
      {
        id: 'location',
        title: 'Nossa Loja',
        subtitle: 'Venha nos visitar',
        iconKey: 'MapPin',
        bgColor: '#FDFBF7',
        iconColor: '#C27B63',
        hasBorder: true,
        products: []
      }
    ],
    quiz: {
      title: 'Personal Stylist',
      subtitle: 'Descubra seu estilo ideal em 1 min.',
      emoji: '✨',
      bgColor: '#C27B63',
    },
    whatsapp: {
      label: 'Falar com Consultora',
      phoneNumber: '5511999999999',
    },
    location: {
      enabled: true,
      address: 'Rua Oscar Freire, 1234 - Jardins, São Paulo',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.197577884869!2d-46.65429988502223!3d-23.563842984681657!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0xd59f9431f2c9776a!2sAv.%20Paulista%2C%201000%20-%20Bela%20Vista%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2001310-100!5e0!3m2!1spt-BR!2sbr!4v1647891234567!5m2!1spt-BR!2sbr'
    },
    social: {
      instagram: 'boutique.elegance',
      facebook: 'boutiqueelegance',
      tiktok: ''
    },
    banners: [
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1000',
      'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1000',
      'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1000'
    ],
    featuredProductIds: ['l1', 'l2', 'a1']
  },
  // TECH EXAMPLE
  tech: {
    storeMode: 'store',
    enableWhatsapp: true,
    plan: 'pro',
    footerText: 'Powered by Geenfo Tech',
    theme: {
      backgroundColor: '#0F172A',
      primaryColor: '#3B82F6',
      secondaryColor: '#1E293B',
      accentColor: '#6366F1',
      textColor: '#F8FAFC',
    },
    header: {
      title: 'TechStore',
      subtitle: 'Eletrônicos Premium',
      logoUrl: '',
      avatarUrl: '',
      showStatus: true,
    },
    hero: {
      title: 'Headset Pro X',
      subtitle: 'Cancelamento de ruído ativo e RGB.',
      description: 'Imersão total nos seus jogos favoritos.',
      price: 'R$ 499,00',
      buttonText: 'Comprar Agora',
      imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1000&auto=format&fit=crop',
    },
    categories: [
      {
        id: 'perif',
        title: 'Periféricos',
        subtitle: 'Teclados e Mouses',
        iconKey: 'Zap',
        bgColor: '#1E293B',
        iconColor: '#3B82F6',
        products: []
      },
      {
        id: 'consoles',
        title: 'Consoles',
        subtitle: 'Next Gen',
        iconKey: 'Package',
        bgColor: '#1E293B',
        iconColor: '#A855F7',
        products: []
      }
    ],
    quiz: {
      title: 'Setup Builder',
      subtitle: 'Monte o PC dos seus sonhos.',
      emoji: '🚀',
      bgColor: '#3B82F6',
    },
    whatsapp: {
      label: 'Falar com Especialista',
      phoneNumber: '5511888888888',
    },
    location: {
      enabled: false,
      address: '',
      mapUrl: ''
    },
    social: {
      instagram: 'techstore',
      facebook: '',
      tiktok: ''
    }
  }
};

interface ConfigContextType {
  storeId: string;
  config: AppConfig;
  cart: CartItem[];
  orders: Order[];
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  isTrackingOpen: boolean;
  isLocationOpen: boolean;

  toasts: Toast[];

  navigateHome: () => void;
  navigateCategory: (categoryId: string) => void;
  navigateProduct: (productId: string, fromCategoryId: string) => void;

  setIsCartOpen: (isOpen: boolean) => void;
  setIsCheckoutOpen: (isOpen: boolean) => void;
  setIsTrackingOpen: (isOpen: boolean) => void;
  setIsLocationOpen: (isOpen: boolean) => void;
  addToCart: (item: Omit<CartItem, 'id' | 'priceValue'>) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartTotalWithDiscount: () => number;
  addOrder: (order: Order) => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  saveCoupon: (coupon: Coupon) => void;
  deleteCoupon: (code: string) => void;

  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  updateConfig: (newConfig: AppConfig) => void;
  updateNestedConfig: (path: string, value: any) => void;
  addCategory: () => void;
  removeCategory: (index: number) => void;
  addProductToCategory: (categoryIndex: number, product: ProductItem) => void;
  removeProductFromCategory: (categoryIndex: number, productIndex: number) => void;
  upgradeToPro: () => void;
  seedInitialData: () => void;
  clearDemoData: () => void;
  
  isLoadingStore: boolean;
  isNotFound: boolean;
  saveStoreToCloud: () => Promise<void>;
  updateStoreSlug: (newSlug: string) => Promise<boolean>;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

const parsePrice = (priceStr: string): number => {
  try {
    return parseFloat(priceStr.replace('R$', '').replace('.', '').replace(',', '.').trim());
  } catch {
    return 0;
  }
};

const getStoreId = () => {
  if (window.location.pathname.startsWith('/demo')) return 'demo';
  const params = new URLSearchParams(window.location.search);
  const queryStore = params.get('store');
  if (queryStore) return queryStore;
  
  const hostname = window.location.hostname;
  
  // Se for o domínio raiz ou o app oficial, usamos demo por padrão (se não houver query)
  if (hostname === 'app.vyzgo.com' || hostname === 'vyzgo.com' || hostname === 'www.vyzgo.com' || hostname === 'localhost') {
    return 'demo';
  }

  // Se for um subdomínio vyzgo.com, pegamos apenas o prefixo
  if (hostname.endsWith('.vyzgo.com')) {
    return hostname.split('.')[0];
  }

  return hostname; // Hostname é a chave para domínios customizados
};

const INITIAL_CONFIG: AppConfig = BASE_CONFIGS['demo'];

export const ConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [storeId, setStoreId] = useState(getStoreId());
  const storageKey = `app_config_${storeId}_v7`; // Bump version for Pro enabling

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('status') === 'approved' || params.get('payment') === 'success') {
      setConfig(prev => {
        const newConfig = { ...prev, plan: 'pro' as const };
        localStorage.setItem(storageKey, JSON.stringify(newConfig));
        return newConfig;
      });
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
      setTimeout(() => {
        console.log("Payment Confirmed: Upgraded to PRO");
      }, 500);
    }
  }, [storageKey]);

  if (window.location.search.includes('reset=true')) {
    localStorage.removeItem(storageKey);
    const url = new URL(window.location.href);
    url.searchParams.delete('reset');
    window.history.replaceState({}, '', url);
  }

  const [config, setConfig] = useState<AppConfig>(() => {
    try {
      const savedConfig = localStorage.getItem(storageKey);
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        const base = BASE_CONFIGS[storeId] || BASE_CONFIGS['demo'];
        // Merge allows new fields to appear in old configs
        return {
          ...base,
          ...parsed,
          footerText: parsed.footerText || base.footerText,
          location: { ...base.location, ...parsed.location },
          social: { ...base.social, ...parsed.social }
        };
      }
      return BASE_CONFIGS[storeId] || BASE_CONFIGS['demo'];
    } catch (e) {
      return BASE_CONFIGS['demo'];
    }
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const ordersStorageKey = `app_orders_${storeId}_v1`;
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ordersStorageKey);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const couponsStorageKey = `app_coupons_${storeId}_v1`;
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try { return JSON.parse(localStorage.getItem(couponsStorageKey) || '[]'); } catch { return []; }
  });
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  const [isLoadingStore, setIsLoadingStore] = useState(true);
  const [isNotFound, setIsNotFound] = useState(false);
  const [storeData, setStoreData] = useState<StoreData | null>(null);
  const { user } = useAuth();

  // EFETUA O LOAD DA LOJA VIA SUPABASE
  useEffect(() => {
    const loadStore = async () => {
      setIsLoadingStore(true);
      const hostname = window.location.hostname;
      
      // Se estiver em localhost ou rota demo, usamos o demo padrão
      if (hostname === 'localhost' || window.location.pathname.startsWith('/demo')) {
        setStoreId('demo');
        setConfig(BASE_CONFIGS['demo']);
        setIsLoadingStore(false);
        return;
      }

      // 0. Detecta se é a Landing Page de Vendas (vyzgo.com ou www.vyzgo.com)
      const isApp = hostname === 'app.vyzgo.com';
      const isRoot = hostname === 'vyzgo.com' || hostname === 'www.vyzgo.com' || hostname === 'agenciawint.com' || hostname === 'vitrinebio.vercel.app' || isApp;
      
      if (isRoot) {
        setIsLoadingStore(false);
        return;
      }

      try {
        const data = await StoreService.getStoreByHostname(hostname);
        if (data) {
          setStoreData(data);
          setStoreId(data.slug);
          setConfig(data.config);
          setIsNotFound(false);
        } else {
          setIsNotFound(true);
        }
      } catch (err) {
        console.error("Erro ao carregar loja:", err);
        setIsNotFound(true);
      } finally {
        setIsLoadingStore(false);
      }
    };

    loadStore();
  }, []);

  const saveStoreToCloud = async () => {
    if (!user || !storeData) return;
    try {
      await StoreService.saveStore({
        ...storeData,
        config: config
      });
      addToast('Alterações salvas na nuvem!', 'success');
    } catch (err) {
      addToast('Erro ao salvar no servidor.', 'error');
    }
  };

  const updateStoreSlug = async (newSlug: string) => {
    if (!user || !storeData) return false;
    
    const cleanSlug = newSlug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (!cleanSlug || cleanSlug.length < 3) {
      addToast('O subdomínio deve ter pelo menos 3 caracteres e usar apenas letras minúsculas, números e hífens.', 'error');
      return false;
    }
    
    if (cleanSlug === storeData.slug) return true;

    try {
      const isAvailable = await StoreService.isSlugAvailable(cleanSlug, storeData.id);
      if (!isAvailable) {
        addToast('Este subdomínio já está em uso. Tente outro.', 'error');
        return false;
      }

      await StoreService.saveStore({
        ...storeData,
        slug: cleanSlug,
        config: config
      });
      
      setStoreData(prev => prev ? { ...prev, slug: cleanSlug } : null);
      setStoreId(cleanSlug);
      addToast('Domínio alterado com sucesso! Seus links antigos não funcionarão mais.', 'success');
      return true;
    } catch (err) {
      console.error(err);
      addToast('Erro ao alterar o domínio.', 'error');
      return false;
    }
  };

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 3000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const navigateHome = () => {
    const isRoot = window.location.hostname === 'vyzgo.com' || window.location.hostname === 'www.vyzgo.com' || window.location.hostname === 'vitrinebio.vercel.app';
    if (window.location.pathname.startsWith('/demo') || (storeId === 'demo' && isRoot)) {
      navigate('/demo');
    } else {
      navigate('/');
    }
  };
  const navigateCategory = (categoryId: string) => navigate(`/category/${categoryId}`);
  const navigateProduct = (productId: string, fromCategoryId: string) => navigate(`/product/${productId}`, { state: { fromCategoryId } });

  const addToCart = (item: Omit<CartItem, 'id' | 'priceValue'>) => {
    const newItem: CartItem = {
      ...item,
      id: Date.now().toString(),
      priceValue: parsePrice(item.price)
    };
    setCart(prev => [...prev, newItem]);
    addToast(`${item.title} adicionado à sacola!`);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart(prev => prev
      .map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item)
    );
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.priceValue * item.quantity, 0);
  };

  const addOrder = (order: Order) => {
    setOrders(prev => {
      const updated = [order, ...prev];
      try { localStorage.setItem(ordersStorageKey, JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const getCartTotalWithDiscount = () => {
    const total = getCartTotal();
    if (!appliedCoupon) return total;
    if (appliedCoupon.type === 'percent') return Math.max(0, total * (1 - appliedCoupon.value / 100));
    return Math.max(0, total - appliedCoupon.value);
  };

  const applyCoupon = (code: string): boolean => {
    const coupon = coupons.find(c =>
      c.code.toUpperCase() === code.toUpperCase() &&
      c.active &&
      (!c.expiresAt || new Date(c.expiresAt) > new Date()) &&
      (!c.maxUses || (c.usedCount || 0) < c.maxUses) &&
      (!c.minOrder || getCartTotal() >= c.minOrder)
    );
    if (coupon) { setAppliedCoupon(coupon); return true; }
    return false;
  };

  const removeCoupon = () => setAppliedCoupon(null);

  const saveCoupon = (coupon: Coupon) => {
    setCoupons(prev => {
      const exists = prev.findIndex(c => c.code === coupon.code);
      const updated = exists >= 0
        ? prev.map((c, i) => i === exists ? coupon : c)
        : [...prev, coupon];
      try { localStorage.setItem(couponsStorageKey, JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const deleteCoupon = (code: string) => {
    setCoupons(prev => {
      const updated = prev.filter(c => c.code !== code);
      try { localStorage.setItem(couponsStorageKey, JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const updateConfig = (newConfig: AppConfig) => setConfig(newConfig);

  const updateNestedConfig = (path: string, value: any) => {
    setConfig((prev) => {
      const newConfig = { ...prev };
      const keys = path.split('.');
      let current: any = newConfig;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newConfig;
    });
  };

  const addCategory = () => {
    const newCategory: CategoryItem = {
      id: `cat-${Date.now()}`,
      title: 'Nova Categoria',
      subtitle: 'Descrição curta',
      iconKey: 'Star',
      bgColor: '#FFFFFF',
      iconColor: config.theme.primaryColor,
      hasBorder: true,
      products: []
    };
    setConfig(prev => ({ ...prev, categories: [...prev.categories, newCategory] }));
  };

  const removeCategory = (index: number) => {
    setConfig(prev => ({ ...prev, categories: prev.categories.filter((_, i) => i !== index) }));
  };

  const addProductToCategory = (categoryIndex: number, product: ProductItem) => {
    const newCategories = [...config.categories];
    newCategories[categoryIndex].products.push(product);
    setConfig({ ...config, categories: newCategories });
  };

  const removeProductFromCategory = (categoryIndex: number, productIndex: number) => {
    const newCategories = [...config.categories];
    newCategories[categoryIndex].products.splice(productIndex, 1);
    setConfig({ ...config, categories: newCategories });
  };

  const updateProduct = (categoryIndex: number, productIndex: number, field: keyof ProductItem, value: string) => {
    const newCategories = [...config.categories];
    newCategories[categoryIndex].products[productIndex] = {
      ...newCategories[categoryIndex].products[productIndex],
      [field]: value
    };
    setConfig({ ...config, categories: newCategories });
  };

  const resetConfig = () => {
    const base = BASE_CONFIGS[storeId] || BASE_CONFIGS['demo'];
    setConfig(base);
    localStorage.removeItem(storageKey);
    navigate('/');
    addToast('Loja resetada para o padrão!', 'info');
  };

  const upgradeToPro = () => {
    setConfig(prev => ({ ...prev, plan: 'pro' }));
    addToast('Parabéns! Sua loja agora é PRO.', 'success');
  };

  const seedInitialData = () => {
    const demoProducts = ProductService.getDemoProducts();
    const demoCategory: CategoryItem = {
      id: 'demo-initial',
      title: 'Produtos de Demonstração',
      subtitle: 'Exemplos de produtos físicos e digitais',
      iconKey: 'Package',
      bgColor: '#F3F4F6',
      iconColor: '#4B5563',
      products: demoProducts
    };

    // Add as first category
    setConfig(prev => ({
      ...prev,
      categories: [demoCategory, ...prev.categories]
    }));
    addToast('Dados de demonstração carregados com sucesso!');
  };

  const clearDemoData = () => {
    setConfig(prev => {
      const newCategories = prev.categories.map(cat => ({
        ...cat,
        products: ProductService.removeDemoProducts(cat.products)
      })).filter(cat => cat.products.length > 0 || cat.id === 'tracking' || cat.id === 'location'); // Keep special cats

      return { ...prev, categories: newCategories };
    });
    addToast('Dados de demonstração removidos.');
  };

  return (
    <ConfigContext.Provider value={{
      storeId, config, cart, orders, coupons, appliedCoupon,
      isCartOpen, isCheckoutOpen, toasts, isTrackingOpen, isLocationOpen,
      navigateHome, navigateCategory, navigateProduct,
      setIsCartOpen, setIsCheckoutOpen, setIsTrackingOpen, setIsLocationOpen,
      addToCart, removeFromCart, updateCartQuantity, clearCart,
      getCartTotal, getCartTotalWithDiscount, addOrder,
      applyCoupon, removeCoupon, saveCoupon, deleteCoupon,
      addToast, removeToast,
      updateConfig, updateNestedConfig, addCategory, removeCategory,
      addProductToCategory, removeProductFromCategory, updateProduct, resetConfig, upgradeToPro,
      seedInitialData, clearDemoData,
      isLoadingStore, isNotFound, saveStoreToCloud, updateStoreSlug
    }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};