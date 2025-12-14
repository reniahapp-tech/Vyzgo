import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppConfig, CategoryItem, CartItem, ViewState, ProductItem, Toast } from '../types';

// SAAS CONFIGURATION
const DEFAULT_STORE_ID = 'demo';

const BASE_CONFIGS: Record<string, AppConfig> = {
  // GENERIC TEMPLATE (Default)
  demo: {
    adminPin: '1234',
    storeMode: 'mixed',
    enableWhatsapp: true,
    plan: 'free',
    footerText: 'Feito com amor por Geenfo 🌿',
    theme: {
      backgroundColor: '#FDFBF7',
      primaryColor: '#C27B63',
      secondaryColor: '#8DA893',
      accentColor: '#25D366',
      textColor: '#1A2E22',
    },
    header: {
      title: 'Sua Marca',
      subtitle: 'Adapta-se ao seu negócio',
      logoUrl: '',
      avatarUrl: '', 
      showStatus: true,
    },
    hero: {
      title: 'Destaque da Semana',
      subtitle: 'Use este espaço para promover seu principal produto ou coleção.',
      description: 'Esta é uma descrição de exemplo. No seu app, você detalhará os benefícios do seu produto estrela aqui.',
      price: 'R$ 99,90',
      buttonText: 'Ver Detalhes',
      imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1887&auto=format&fit=crop',
    },
    categories: [
      {
        id: 'cat1',
        title: 'Categoria A',
        subtitle: 'Seus produtos aqui',
        iconKey: 'ShoppingBag',
        bgColor: '#EFF5F2',
        iconColor: '#38BDF8',
        products: [
           { id: '1', title: 'Produto Exemplo 1', price: 'R$ 45,90', description: 'Descrição curta do produto.', imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5e84e43?q=80&w=1000' }
        ]
      },
      {
        id: 'cat2',
        title: 'Categoria B',
        subtitle: 'Mais vendidos',
        iconKey: 'Star',
        bgColor: '#EFF5F2',
        iconColor: '#059669',
        products: []
      },
      {
        id: 'cat3',
        title: 'Serviços',
        subtitle: 'Consultoria & Mais',
        iconKey: 'Zap',
        bgColor: '#FFF9EE',
        iconColor: '#EF4444',
        products: []
      },
      {
        id: 'tracking',
        title: 'Rastrear Pedido',
        subtitle: 'Status de entrega',
        iconKey: 'Package',
        bgColor: '#FFFFFF',
        iconColor: '#B45309',
        hasBorder: true,
        products: []
      },
      {
        id: 'location',
        title: 'Localização',
        subtitle: 'Onde nos encontrar',
        iconKey: 'MapPin',
        bgColor: '#FDFBF7',
        iconColor: '#C27B63',
        hasBorder: true,
        products: []
      }
    ],
    quiz: {
      title: 'Consultoria Digital',
      subtitle: 'Ajude seu cliente a escolher.',
      emoji: '✨',
      bgColor: '#8DA893',
    },
    whatsapp: {
      label: 'Falar com Atendente',
      phoneNumber: '5511999999999',
    },
    location: {
      enabled: true,
      address: 'Seu Endereço Aqui - Cidade, UF',
      mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.197577884869!2d-46.65429988502223!3d-23.563842984681657!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0xd59f9431f2c9776a!2sAv.%20Paulista%2C%201000%20-%20Bela%20Vista%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2001310-100!5e0!3m2!1spt-BR!2sbr!4v1647891234567!5m2!1spt-BR!2sbr'
    },
    social: {
      instagram: 'sualoja',
      facebook: '',
      tiktok: ''
    }
  },
  // TECH EXAMPLE
  tech: {
    adminPin: '0000',
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
  isCartOpen: boolean;
  isTrackingOpen: boolean;
  isLocationOpen: boolean; // NEW
  currentView: ViewState;
  toasts: Toast[];
  
  navigateHome: () => void;
  navigateCategory: (categoryId: string) => void;
  navigateProduct: (productId: string, fromCategoryId: string) => void;
  
  setIsCartOpen: (isOpen: boolean) => void;
  setIsTrackingOpen: (isOpen: boolean) => void;
  setIsLocationOpen: (isOpen: boolean) => void; // NEW
  addToCart: (item: Omit<CartItem, 'id' | 'priceValue'>) => void;
  removeFromCart: (id: string) => void;
  getCartTotal: () => number;
  
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  updateConfig: (newConfig: AppConfig) => void;
  updateNestedConfig: (path: string, value: any) => void;
  addCategory: () => void;
  removeCategory: (index: number) => void;
  addProductToCategory: (categoryIndex: number, product: ProductItem) => void;
  removeProductFromCategory: (categoryIndex: number, productIndex: number) => void;
  updateProduct: (categoryIndex: number, productIndex: number, field: keyof ProductItem, value: string) => void;
  resetConfig: () => void;
  upgradeToPro: () => void;
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
  const params = new URLSearchParams(window.location.search);
  const queryStore = params.get('store');
  if (queryStore && BASE_CONFIGS[queryStore]) return queryStore;

  const hostname = window.location.hostname;
  const subdomain = hostname.split('.')[0];
  if (subdomain && BASE_CONFIGS[subdomain]) return subdomain;

  return DEFAULT_STORE_ID;
};

export const ConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [storeId, setStoreId] = useState(getStoreId());
  const storageKey = `app_config_${storeId}_v6`; // Bump version for footerText

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
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>({ type: 'HOME' });
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const currentStore = getStoreId();
    if (currentStore !== storeId) {
      setStoreId(currentStore);
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(config));
    } catch (e) {
      console.error("Failed to save config", e);
    }
  }, [config, storageKey]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 3000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const navigateHome = () => setCurrentView({ type: 'HOME' });
  const navigateCategory = (categoryId: string) => setCurrentView({ type: 'CATEGORY', categoryId });
  const navigateProduct = (productId: string, fromCategoryId: string) => setCurrentView({ type: 'PRODUCT', productId, fromCategoryId });

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

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.priceValue, 0);
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
    setCurrentView({ type: 'HOME' });
    addToast('Loja resetada para o padrão!', 'info');
  };

  const upgradeToPro = () => {
    setConfig(prev => ({ ...prev, plan: 'pro' }));
    addToast('Parabéns! Sua loja agora é PRO.', 'success');
  };

  return (
    <ConfigContext.Provider value={{ 
      storeId, config, cart, isCartOpen, currentView, toasts, isTrackingOpen, isLocationOpen,
      navigateHome, navigateCategory, navigateProduct,
      setIsCartOpen, setIsTrackingOpen, setIsLocationOpen, addToCart, removeFromCart, getCartTotal,
      addToast, removeToast,
      updateConfig, updateNestedConfig, addCategory, removeCategory,
      addProductToCategory, removeProductFromCategory, updateProduct, resetConfig, upgradeToPro
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