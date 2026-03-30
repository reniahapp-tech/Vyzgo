import React, { useState } from 'react';
import { useConfig } from '../contexts/ConfigContext';
import { usePlugins } from '../contexts/PluginContext';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';
import { Settings, X, RotateCcw, Palette, Layout, Type, Image as ImageIcon, Plus, Trash2, Link, Upload, ShoppingBag, Lock, Unlock, MapPinOff, MapPin, ToggleLeft, ToggleRight, Store, Crown, Star, Share2, Map, HelpCircle, ChevronDown, ChevronUp, BookOpen, ExternalLink, MessageCircle, Terminal, Globe, ClipboardList, Package, AlertTriangle, Puzzle, Tag, LogOut, User as UserIcon, Save, ArrowRight } from 'lucide-react';
import { availableIcons } from './IconMapper';
import { ProductItem } from '../types';
import PaymentGateway from './PaymentGateway';
import { uploadToR2, saveConfigToR2 } from '../services/r2';
import { generateProductDescription } from '../services/ai';
import { CloudUpload, Sparkles } from 'lucide-react';

// Preset Themes Configuration
export const PRESET_THEMES = [
  {
    id: 'natura',
    name: 'Natura Original',
    colors: ['#FDFBF7', '#C27B63', '#8DA893'],
    config: {
      theme: {
        backgroundColor: '#FDFBF7',
        primaryColor: '#C27B63',
        secondaryColor: '#8DA893',
        accentColor: '#25D366',
        textColor: '#1A2E22',
      },
      quiz: { bgColor: '#8DA893' }
    }
  },
  {
    id: 'dark',
    name: 'Midnight Luxury',
    colors: ['#121212', '#D4AF37', '#1E1E1E'],
    config: {
      theme: {
        backgroundColor: '#121212',
        primaryColor: '#D4AF37', // Gold
        secondaryColor: '#2A2A2A', // Dark Gray
        accentColor: '#10B981', // Emerald
        textColor: '#F3F4F6',
      },
      quiz: { bgColor: '#2A2A2A' }
    }
  },
  {
    id: 'ocean',
    name: 'Ocean Breeze',
    colors: ['#F0F9FF', '#0EA5E9', '#BAE6FD'],
    config: {
      theme: {
        backgroundColor: '#F0F9FF', // Sky 50
        primaryColor: '#0284C7', // Sky 600
        secondaryColor: '#7DD3FC', // Sky 300
        accentColor: '#0EA5E9', // Sky 500
        textColor: '#0C4A6E', // Sky 900
      },
      quiz: { bgColor: '#0284C7' }
    }
  },
  {
    id: 'lavender',
    name: 'Lavanda Soft',
    colors: ['#FAF5FF', '#9333EA', '#E9D5FF'],
    config: {
      theme: {
        backgroundColor: '#FAF5FF', // Purple 50
        primaryColor: '#9333EA', // Purple 600
        secondaryColor: '#D8B4FE', // Purple 300
        accentColor: '#A855F7', // Purple 500
        textColor: '#3B0764', // Purple 950
      },
      quiz: { bgColor: '#9333EA' }
    }
  },
  {
    id: 'mint',
    name: 'Mint Fresh',
    colors: ['#F0FDF4', '#15803D', '#86EFAC'],
    config: {
      theme: {
        backgroundColor: '#F0FDF4', // Green 50
        primaryColor: '#15803D', // Green 700
        secondaryColor: '#86EFAC', // Green 300
        accentColor: '#16A34A', // Green 600
        textColor: '#14532D', // Green 900
      },
      quiz: { bgColor: '#15803D' }
    }
  },
  {
    id: 'rose',
    name: 'Rose Petal',
    colors: ['#FFF1F2', '#BE123C', '#FECDD3'],
    config: {
      theme: {
        backgroundColor: '#FFF1F2', // Rose 50
        primaryColor: '#BE123C', // Rose 700
        secondaryColor: '#FECDD3', // Rose 200
        accentColor: '#E11D48', // Rose 600
        textColor: '#881337', // Rose 900
      },
      quiz: { bgColor: '#BE123C' }
    }
  },
  {
    id: 'solar',
    name: 'Solar Flare',
    colors: ['#FFF7ED', '#C2410C', '#FFEDD5'],
    config: {
      theme: {
        backgroundColor: '#FFF7ED', // Orange 50
        primaryColor: '#C2410C', // Orange 700
        secondaryColor: '#FFEDD5', // Orange 100
        accentColor: '#EA580C', // Orange 600
        textColor: '#7C2D12', // Orange 900
      },
      quiz: { bgColor: '#C2410C' }
    }
  },
  {
    id: 'slate',
    name: 'Slate Minimal',
    colors: ['#F8FAFC', '#334155', '#CBD5E1'],
    config: {
      theme: {
        backgroundColor: '#F8FAFC', // Slate 50
        primaryColor: '#334155', // Slate 700
        secondaryColor: '#CBD5E1', // Slate 300
        accentColor: '#475569', // Slate 600
        textColor: '#0F172A', // Slate 900
      },
      quiz: { bgColor: '#334155' }
    }
  },
  {
    id: 'royal',
    name: 'Royal Velvet',
    colors: ['#F5F3FF', '#6D28D9', '#DDD6FE'],
    config: {
      theme: {
        backgroundColor: '#F5F3FF', // Violet 50
        primaryColor: '#6D28D9', // Violet 700
        secondaryColor: '#DDD6FE', // Violet 200
        accentColor: '#7C3AED', // Violet 600
        textColor: '#4C1D95', // Violet 900
      },
      quiz: { bgColor: '#6D28D9' }
    }
  },
  {
    id: 'coffee',
    name: 'Coffee Bean',
    colors: ['#FFFCF5', '#78350F', '#E7D5C0'],
    config: {
      theme: {
        backgroundColor: '#FFFCF5', // Custom Warm
        primaryColor: '#78350F', // Amber 900
        secondaryColor: '#E7D5C0', // Custom Beige
        accentColor: '#92400E', // Amber 800
        textColor: '#451A03', // Amber 950
      },
      quiz: { bgColor: '#78350F' }
    }
  },
  {
    id: 'cherry',
    name: 'Cherry Bomb',
    colors: ['#FEF2F2', '#B91C1C', '#FECACA'],
    config: {
      theme: {
        backgroundColor: '#FEF2F2', // Red 50
        primaryColor: '#B91C1C', // Red 700
        secondaryColor: '#FECACA', // Red 200
        accentColor: '#DC2626', // Red 600
        textColor: '#7F1D1D', // Red 900
      },
      quiz: { bgColor: '#B91C1C' }
    }
  },
  {
    id: 'deepsea',
    name: 'Deep Sea',
    colors: ['#ECFEFF', '#0E7490', '#A5F3FC'],
    config: {
      theme: {
        backgroundColor: '#ECFEFF', // Cyan 50
        primaryColor: '#0E7490', // Cyan 700
        secondaryColor: '#A5F3FC', // Cyan 200
        accentColor: '#0891B2', // Cyan 600
        textColor: '#164E63', // Cyan 900
      },
      quiz: { bgColor: '#0E7490' }
    }
  },
  {
    id: 'cyber',
    name: 'Cyberpunk',
    colors: ['#050505', '#D946EF', '#22D3EE'],
    config: {
      theme: {
        backgroundColor: '#050505', // Black
        primaryColor: '#D946EF', // Fuchsia 500
        secondaryColor: '#22D3EE', // Cyan 400
        accentColor: '#FACC15', // Yellow 400
        textColor: '#F3F4F6', // Gray 100
      },
      quiz: { bgColor: '#18181B' } // Zinc 900
    }
  },
  {
    id: 'corporate',
    name: 'Corporate Blue',
    colors: ['#F0F4F8', '#1D4ED8', '#DBEAFE'],
    config: {
      theme: {
        backgroundColor: '#F0F4F8', // Slate/Blue custom
        primaryColor: '#1D4ED8', // Blue 700
        secondaryColor: '#DBEAFE', // Blue 100
        accentColor: '#2563EB', // Blue 600
        textColor: '#1E3A8A', // Blue 900
      },
      quiz: { bgColor: '#1D4ED8' }
    }
  },
  {
    id: 'forest',
    name: 'Deep Forest',
    colors: ['#F2F8F4', '#14532D', '#86EFAC'],
    config: {
      theme: {
        backgroundColor: '#F2F8F4',
        primaryColor: '#14532D', // Green 900
        secondaryColor: '#BBF7D0', // Green 200
        accentColor: '#16A34A', // Green 600
        textColor: '#052E16',
      },
      quiz: { bgColor: '#14532D' }
    }
  }
];

const WHATSAPP_LABELS = [
  "Falar com Atendente",
  "Comprar no WhatsApp",
  "Tirar Dúvidas",
  "Fazer Pedido",
  "Falar com Especialista",
  "Suporte Online",
  "Orçamento Rápido"
];

const AdminPanel: React.FC<{ isStandalone?: boolean }> = ({ isStandalone = false }) => {
  const { storeId, config, updateConfig, updateNestedConfig, resetConfig, addCategory, removeCategory, addProductToCategory, removeProductFromCategory, updateProduct, addToast, upgradeToPro, seedInitialData, clearDemoData, orders, coupons, saveCoupon, deleteCoupon, saveStoreToCloud, isLoadingStore } = useConfig();
  const { plugins, enablePlugin, disablePlugin, updatePluginConfig } = usePlugins();
  const { isAdmin, user, signOut, hasStore, isActive } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'themes' | 'branding' | 'home' | 'products' | 'plan' | 'social' | 'help' | 'orders' | 'modules' | 'coupons'>('themes');
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [activePluginId, setActivePluginId] = useState<string | null>(null);
  // Coupon form state
  const [couponForm, setCouponForm] = useState({ code: '', type: 'percent' as 'percent' | 'fixed', value: 10, minOrder: 0, active: true });

  // State for editable presets
  const [themesList, setThemesList] = useState(PRESET_THEMES);

  const isPro = config.plan === 'pro';

  const applyTheme = (preset: typeof PRESET_THEMES[0]) => {
    const newConfig = {
      ...config,
      theme: { ...config.theme, ...preset.config.theme },
      quiz: { ...config.quiz, ...preset.config.quiz }
    };
    updateConfig(newConfig);
    addToast(`Tema "${preset.name}" aplicado!`, 'success');
  };

  const updateThemeQuizColor = (id: string, color: string) => {
    setThemesList(prev => prev.map(theme => {
      if (theme.id === id) {
        return {
          ...theme,
          config: {
            ...theme.config,
            quiz: {
              ...theme.config.quiz,
              bgColor: color
            }
          }
        };
      }
      return theme;
    }));
  };
  // Image upload with canvas compression
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, onUrl: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      addToast('Apenas imagens são permitidas (JPG, PNG, WEBP).', 'error');
      e.target.value = '';
      return;
    }
    // Compress via canvas (max 800px wide, JPEG 82%)
    const compress = (f: File): Promise<File> => new Promise(resolve => {
      const img = new Image();
      const objUrl = URL.createObjectURL(f);
      img.onload = () => {
        const MAX = 800;
        let { width, height } = img;
        if (width > MAX) { height = Math.round(height * MAX / width); width = MAX; }
        const canvas = document.createElement('canvas');
        canvas.width = width; canvas.height = height;
        canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
        canvas.toBlob(blob => {
          URL.revokeObjectURL(objUrl);
          resolve(blob ? new File([blob], f.name, { type: 'image/jpeg' }) : f);
        }, 'image/jpeg', 0.82);
      };
      img.src = objUrl;
    });
    addToast('Comprimindo e enviando...', 'info');
    try {
      const compressed = await compress(file);
      const url = await uploadToR2(compressed);
      onUrl(url);
      addToast('Imagem enviada!', 'success');
    } catch (error) {
      addToast('Erro no upload. Usando fallback local.', 'error');
      const reader = new FileReader();
      reader.onloadend = () => onUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = () => {
    const newProduct: ProductItem = {
      id: `prod-${Date.now()}`,
      title: 'Novo Produto',
      price: 'R$ 0,00',
      description: 'Descrição do produto',
      imageUrl: 'https://images.unsplash.com/photo-1590735213920-68192a487561?q=80&w=1000&auto=format&fit=crop'
    };
    addProductToCategory(selectedCategoryIndex, newProduct);
  };

  // Helper to check if Tracking/Location is active
  const hasTracking = config.categories.some(c => c.id === 'tracking');
  const hasLocation = config.categories.some(c => c.id === 'location');

  const toggleCard = (type: 'tracking' | 'location') => {
    if (type === 'tracking') {
      if (hasTracking) {
        updateConfig({ ...config, categories: config.categories.filter(c => c.id !== 'tracking') });
        addToast('Card de Rastreio removido.');
      } else {
        const trackingCat = { id: 'tracking', title: 'Rastrear Pedido', subtitle: 'Localize sua caixa', iconKey: 'Package', bgColor: '#FFFFFF', iconColor: config.theme.primaryColor, hasBorder: true, products: [] };
        updateConfig({ ...config, categories: [...config.categories, trackingCat] });
        addToast('Card de Rastreio adicionado.');
      }
    }
    if (type === 'location') {
      if (hasLocation) {
        updateConfig({ ...config, categories: config.categories.filter(c => c.id !== 'location') });
        addToast('Card de Mapa removido.');
      } else {
        const locCat = { id: 'location', title: 'Nossa Loja', subtitle: 'Venha nos visitar', iconKey: 'MapPin', bgColor: '#FDFBF7', iconColor: config.theme.primaryColor, hasBorder: true, products: [] };
        updateConfig({ ...config, categories: [...config.categories, locCat] });
        addToast('Card de Mapa adicionado.');
      }
    }
  };

  const handleStoreModeChange = (mode: 'mixed' | 'store' | 'affiliate') => {
    if (!isPro && mode !== 'mixed') {
      setIsPaymentOpen(true); // Trigger payment gateway for pro features
      return;
    }
    updateConfig({ ...config, storeMode: mode });
  };

  const handleWhatsappToggle = () => {
    if (!isPro) {
      setIsPaymentOpen(true);
      return;
    }
    updateConfig({ ...config, enableWhatsapp: !config.enableWhatsapp });
  };

  // 1. Button to open panel (always visible)
  if (!isStandalone && !isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-black text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 group"
      >
        <Settings className="group-hover:rotate-90 transition-transform duration-500" />
      </button>
    );
  }

  const containerClasses = isStandalone 
    ? "flex flex-col h-full bg-white/80 backdrop-blur-xl"
    : "fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 animate-in fade-in zoom-in duration-300";

  const contentClasses = isStandalone
    ? "w-full h-full flex flex-col"
    : "bg-white/80 backdrop-blur-xl w-full max-w-6xl h-[90vh] rounded-[40px] shadow-2xl border border-white/50 overflow-hidden flex flex-col relative";

  // 2. Login Screen (if not authenticated)
  if (!isAdmin) {
    return <AuthModal isOpen={isOpen} onClose={() => setIsOpen(false)} />;
  }

  // 2.1 License Check (if store is not active/paid)
  if (hasStore && !isActive) {
    return (
      <div className="fixed inset-0 bg-white/20 backdrop-blur-xl z-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center border border-red-50 animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
            <AlertTriangle size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Pagamento Pendente</h2>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            Sua vitrine está temporariamente desativada. Regularize seu plano para voltar a gerenciar seus produtos e receber pedidos.
          </p>
          <div className="space-y-3">
            <button 
              onClick={() => window.open('https://wa.me/5588997380123?text=Quero+ativar+minha+vitrine', '_blank')}
              className="w-full py-4 bg-green-600 text-white rounded-2xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-100"
            >
              Falar com Suporte
            </button>
            <button 
              onClick={() => { signOut(); setIsOpen(false); }}
              className="w-full py-3 text-gray-400 text-xs font-bold hover:text-gray-600 transition-colors"
            >
              Sair da conta
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Admin Dashboard (Authenticated)
  const InputGroup = ({ label, value, onChange, placeholder, textarea = false }: { label: string, value: string, onChange: (val: string) => void, placeholder?: string, textarea?: boolean }) => (
    <div className="mb-3 group">
      <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1 tracking-wider">{label}</label>
      {textarea ? (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={2}
          className="w-full bg-white/40 border border-white/50 backdrop-blur-sm rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none resize-none"
        />
      ) : (
        <input
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-white/40 border border-white/50 backdrop-blur-sm rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-blue-500 outline-none"
        />
      )}
    </div>
  );

  return (
    <div className={containerClasses}>
      {!isStandalone && (
        <div 
          className="absolute inset-0 bg-black/20 backdrop-blur-sm -z-10" 
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <div className={contentClasses}>
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between bg-white/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center shadow-lg">
              <Settings size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-800 tracking-tight">VyzGo Painel</h2>
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none">Configurações da sua Vitrine</p>
                {storeId === 'demo' && (
                  <span className="flex items-center gap-1 text-[8px] font-black bg-yellow-400 text-black px-1.5 py-0.5 rounded uppercase animate-pulse">
                     <AlertTriangle size={8} /> Modo Demo
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            <a 
              href={storeId === 'demo' ? '/demo' : `/v/${storeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] md:text-xs font-black hover:bg-blue-100 transition-all border border-blue-100 shadow-sm active:scale-95"
            >
              <ExternalLink size={14} />
              <span className="hidden sm:inline">Ver Minha Vitrine</span>
              <span className="sm:hidden">Ver Loja</span>
            </a>

            <div className="h-8 w-[1px] bg-gray-100 mx-1 hidden md:block" />

            <button
               onClick={() => { signOut(); setIsOpen(false); }}
               className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-500 rounded-xl text-[10px] md:text-xs font-black hover:bg-red-100 transition-all border border-red-100 active:scale-95"
               title="Sair da conta"
            >
              <LogOut size={14} />
              <span className="hidden md:inline">Sair</span>
            </button>

            {!isStandalone && (
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-black"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex p-2 gap-1 overflow-x-auto scrollbar-hide">
          {[
            { id: 'plan', icon: Crown, label: 'Plano', highlight: !isPro },
            { id: 'orders', icon: ClipboardList, label: 'Pedidos', badge: orders.filter(o => o.status === 'pending').length || 0 },
            { id: 'coupons', icon: Tag, label: 'Cupons' },
            { id: 'modules', icon: Puzzle, label: 'Módulos', badge: plugins.filter(p => p.enabled).length || 0 },
            { id: 'help', icon: HelpCircle, label: 'Ajuda' },
            { id: 'themes', icon: Palette, label: 'Temas' },
            { id: 'branding', icon: Link, label: 'Marca' },
            { id: 'home', icon: Layout, label: 'Home' },
            { id: 'products', icon: ShoppingBag, label: 'Itens' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2 px-3 rounded-xl flex flex-col items-center gap-1 text-[10px] font-bold uppercase transition-all whitespace-nowrap relative ${
                activeTab === tab.id ? 'bg-white shadow-md text-gray-900 scale-105' : 'text-gray-500 hover:bg-white/30'
              } ${(tab as any).highlight ? 'text-yellow-600 bg-yellow-50' : ''}`}
            >
              <tab.icon size={18} className={(tab as any).highlight ? 'fill-yellow-500 text-yellow-600' : ''} />
              {tab.label}
              {(tab as any).badge > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                  {(tab as any).badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          
          {storeId === 'demo' && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-100 rounded-2xl flex items-start gap-4 animate-in slide-in-from-top-2 duration-500">
              <div className="w-10 h-10 bg-yellow-400 text-black rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                <AlertTriangle size={20} />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-black text-yellow-800 uppercase tracking-tight mb-1">Atenção: Modo de Demonstração Ativo</h4>
                <p className="text-[10px] text-yellow-700 leading-relaxed">
                  Você está visualizando a vitrine de exemplo. Qualquer alteração feita aqui é <b>compartilhada com outros usuários</b> e pode ser resetada a qualquer momento. Para ter sua própria vitrine exclusiva, faça login ou crie sua conta.
                </p>
                <div className="flex gap-3 mt-3">
                   <button onClick={() => window.location.href = '/'} className="text-[10px] font-black text-yellow-800 underline decoration-yellow-300 hover:decoration-yellow-500 transition-all">Criar Minha Própria Vitrine</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'help' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <h3 className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-2">
                  <BookOpen size={16} /> Bem-vindo ao VyzGo
                </h3>
                <p className="text-xs text-blue-600 leading-relaxed mb-3">
                  Este é seu painel de controle. Aqui você pode personalizar toda a aparência e funcionamento da sua loja virtual sem precisar de código.
                </p>
              </div>

              <div className="space-y-2">
                <FAQItem
                  title="Primeiros Passos"
                  content="Comece na aba 'Marca' para definir seu logo e nome. Depois, vá em 'Temas' para escolher as cores. Por fim, use 'Home' e 'Itens' para cadastrar seus produtos."
                />
                <FAQItem
                  title="Modos de Loja"
                  content={
                    <ul className="list-disc pl-4 space-y-1">
                      <li><strong>Híbrido:</strong> O padrão. Permite carrinho de compras E links externos (afiliados).</li>
                      <li><strong>Apenas Loja (Pro):</strong> Foca 100% no carrinho e envio do pedido para o WhatsApp.</li>
                      <li><strong>Apenas Afiliado (Pro):</strong> Remove o carrinho e transforma todos os botões em links externos.</li>
                    </ul>
                  }
                />
                <FAQItem
                  title="Como recebo os pedidos?"
                  content="Os pedidos feitos no carrinho geram uma mensagem automática formatada que o cliente envia para o seu WhatsApp cadastrado na aba 'Marca'."
                />
                <FAQItem
                  title="Como funciona o Plano Pro?"
                  content="O plano Pro desbloqueia funcionalidades avançadas como modos exclusivos de loja, remoção de limites e controle total sobre o botão flutuante do WhatsApp."
                />
                <FAQItem
                  title="Como funciona a marca VyzGo?"
                  content="No plano Pro, você tem total autonomia para remover a marca VyzGo e usar seu próprio domínio customizado."
                />
                <FAQItem
                  title="Fiz login, e agora?"
                  content="Agora você está autenticado com sua conta Google. Seu acesso é protegido e você pode gerenciar todas as configurações da sua loja com segurança."
                />
              </div>
            </div>
          )}

          {activeTab === 'coupons' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <Tag size={14} className="text-yellow-500" />
                <h3 className="text-xs font-bold text-gray-700 uppercase">Cupons de Desconto</h3>
                <span className="ml-auto text-[10px] bg-yellow-100 text-yellow-600 px-2 py-0.5 rounded-full">
                  {coupons.filter(c => c.active).length} ativo{coupons.filter(c => c.active).length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Form para criar cupom */}
              <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-3 space-y-2">
                <h4 className="text-[10px] font-bold text-yellow-800 uppercase">Criar Cupom</h4>
                <input
                  type="text" placeholder="Código (ex: PROMO10)" value={couponForm.code}
                  onChange={e => setCouponForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                  className="w-full bg-white border border-yellow-200 rounded-xl px-3 py-2 text-sm font-mono outline-none focus:ring-2 focus:ring-yellow-300"
                />
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] font-bold text-gray-500 uppercase">Tipo</label>
                    <select
                      value={couponForm.type}
                      onChange={e => setCouponForm(f => ({ ...f, type: e.target.value as 'percent' | 'fixed' }))}
                      className="w-full bg-white border border-gray-200 rounded-xl px-2 py-2 text-xs outline-none"
                    >
                      <option value="percent">% Desconto</option>
                      <option value="fixed">R$ Fixo</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-gray-500 uppercase">Valor</label>
                    <input
                      type="number" min={1} value={couponForm.value}
                      onChange={e => setCouponForm(f => ({ ...f, value: Number(e.target.value) }))}
                      className="w-full bg-white border border-gray-200 rounded-xl px-2 py-2 text-xs outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[9px] font-bold text-gray-500 uppercase">Pedido Mínimo (R$) — 0 = sem mínimo</label>
                  <input
                    type="number" min={0} value={couponForm.minOrder}
                    onChange={e => setCouponForm(f => ({ ...f, minOrder: Number(e.target.value) }))}
                    className="w-full bg-white border border-gray-200 rounded-xl px-2 py-2 text-xs outline-none"
                  />
                </div>
                <button
                  onClick={() => {
                    if (!couponForm.code.trim()) { addToast('Digite um código de cupom.', 'error'); return; }
                    saveCoupon({
                      code: couponForm.code,
                      type: couponForm.type,
                      value: couponForm.value,
                      minOrder: couponForm.minOrder || undefined,
                      active: true,
                      usedCount: 0
                    });
                    setCouponForm({ code: '', type: 'percent', value: 10, minOrder: 0, active: true });
                    addToast(`Cupom ${couponForm.code} salvo!`, 'success');
                  }}
                  className="w-full py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  + Criar Cupom
                </button>
              </div>

              {/* Lista de cupons */}
              {coupons.length === 0 ? (
                <p className="text-[10px] text-gray-400 text-center py-4">Nenhum cupom criado ainda.</p>
              ) : coupons.map(coupon => (
                <div key={coupon.code} className="bg-white/50 border border-white/60 rounded-xl p-3 flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono font-bold text-gray-800">{coupon.code}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${coupon.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {coupon.active ? 'ATIVO' : 'INATIVO'}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      {coupon.type === 'percent' ? `${coupon.value}% off` : `R$ ${coupon.value.toFixed(2)} off`}
                      {coupon.minOrder ? ` • Mín. R$ ${coupon.minOrder}` : ''}
                    </p>
                  </div>
                  <button
                    onClick={() => saveCoupon({ ...coupon, active: !coupon.active })}
                    className={`text-2xl transition-colors ${coupon.active ? 'text-green-500' : 'text-gray-300'}`}
                  >
                    {coupon.active ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                  </button>
                  <button onClick={() => deleteCoupon(coupon.code)} className="text-red-400 hover:text-red-600">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'modules' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <Puzzle size={14} className="text-purple-500" />
                <h3 className="text-xs font-bold text-gray-700 uppercase">Módulos do App</h3>
                <span className="ml-auto text-[10px] bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full">
                  {plugins.filter(p => p.enabled).length} ativo{plugins.filter(p => p.enabled).length !== 1 ? 's' : ''}
                </span>
              </div>
              <p className="text-[10px] text-gray-400 leading-relaxed">
                Módulos adicionam funcionalidades extras à sua vitrine sem alterar o código principal.
              </p>

              {/* Lista de plugins */}
              {plugins.map(({ plugin, enabled, config: pConfig }) => (
                <div key={plugin.id} className="bg-white/50 border border-white/60 rounded-xl overflow-hidden">
                  <div className="flex items-center gap-3 p-3">
                    <span className="text-2xl">{plugin.icon}</span>
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-gray-800">{plugin.name}</h4>
                      <p className="text-[10px] text-gray-500 leading-tight">{plugin.description}</p>
                      <p className="text-[9px] text-gray-400 mt-0.5">v{plugin.version}{plugin.author ? ` • ${plugin.author}` : ''}</p>
                    </div>
                    {/* Toggle ON/OFF */}
                    <button
                      onClick={() => enabled ? disablePlugin(plugin.id) : enablePlugin(plugin.id)}
                      className={`text-3xl transition-colors ${enabled ? 'text-green-500' : 'text-gray-300'}`}
                    >
                      {enabled ? <ToggleRight size={36} /> : <ToggleLeft size={36} />}
                    </button>
                  </div>

                  {/* Configuração do plugin (só se ativo e tiver AdminTab) */}
                  {enabled && plugin.AdminTab && (
                    <div className="border-t border-gray-100">
                      <button
                        onClick={() => setActivePluginId(activePluginId === plugin.id ? null : plugin.id)}
                        className="w-full flex items-center justify-between px-3 py-2 text-[10px] font-bold text-purple-600 hover:bg-purple-50 transition-colors"
                      >
                        <span>⚙️ Configurar módulo</span>
                        {activePluginId === plugin.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      </button>
                      {activePluginId === plugin.id && (
                        <div className="px-3 pb-3">
                          <plugin.AdminTab
                            config={pConfig}
                            onConfigChange={(key, val) => updatePluginConfig(plugin.id, key, val)}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* Dica de criação */}
              <div className="bg-purple-50 border border-purple-100 rounded-xl p-3 mt-2">
                <p className="text-[10px] text-purple-700 leading-relaxed">
                  💡 <strong>Quer criar um módulo?</strong> Veja o arquivo
                  <code className="bg-purple-100 px-1 rounded ml-1">plugins/COMO_CRIAR_PLUGIN.md</code>
                </p>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <ClipboardList size={14} className="text-gray-500" />
                <h3 className="text-xs font-bold text-gray-700 uppercase">Histórico de Pedidos</h3>
                <span className="ml-auto text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{orders.length} pedido{orders.length !== 1 ? 's' : ''}</span>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12 opacity-40">
                  <Package size={40} className="mx-auto mb-3 text-gray-300" />
                  <p className="text-xs font-medium text-gray-500">Nenhum pedido ainda.</p>
                  <p className="text-[10px] text-gray-400 mt-1">Os pedidos aparecem aqui após o cliente finalizar.</p>
                </div>
              ) : (
                orders.map(order => (
                  <div key={order.id} className="bg-white/50 border border-white/60 rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-gray-400">{order.id}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'shipped' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {order.status === 'pending' ? 'Pendente' :
                         order.status === 'confirmed' ? 'Confirmado' :
                         order.status === 'shipped' ? 'Enviado' : 'Cancelado'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-gray-800">{order.customer.customerName}</p>
                        <p className="text-[10px] text-gray-500">{order.customer.deliveryType === 'delivery' ? `📦 ${order.customer.address}` : '🏪 Retirada'}</p>
                      </div>
                      <span className="text-sm font-bold text-green-600">R$ {order.total.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <div className="text-[10px] text-gray-400">
                      {order.items.map(i => `${i.quantity}x ${i.title}`).join(', ')}
                    </div>
                    <p className="text-[10px] text-gray-400">{new Date(order.createdAt).toLocaleString('pt-BR')}</p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'plan' && (
            <div className="space-y-4">
              <div className={`p-6 rounded-2xl text-center border-2 ${isPro ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white/50'}`}>
                {isPro ? (
                  <>
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                      <Crown size={32} fill="currentColor" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Membro Premium</h3>
                    <p className="text-sm text-gray-500 mb-4">Você tem acesso total a todos os recursos.</p>
                    <div className="text-xs font-bold text-green-700 bg-green-200 px-3 py-1 rounded-full inline-block">ATIVO</div>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                      <Lock size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Plano Gratuito</h3>
                    <p className="text-sm text-gray-500 mb-6">Desbloqueie modos exclusivos e remova limites.</p>
                    <button
                      onClick={() => setIsPaymentOpen(true)}
                      className="w-full py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl shadow-lg hover:scale-105 transition-transform font-bold flex items-center justify-center gap-2"
                    >
                      <Crown size={18} fill="gold" className="text-yellow-400" />
                      Fazer Upgrade (R$ 29/mês)
                    </button>
                  </>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-500 uppercase ml-1">Comparativo</h4>
                <div className="bg-white/40 rounded-xl p-3 border border-white/50">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-xs font-bold text-gray-700">Produtos Ilimitados</span>
                    <CheckIcon active={true} />
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-xs font-bold text-gray-700">Temas Premium</span>
                    <CheckIcon active={true} />
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-xs font-bold text-gray-700 flex items-center gap-1">Modo Loja <Crown size={10} className="text-yellow-600" /></span>
                    <CheckIcon active={isPro} />
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-xs font-bold text-gray-700 flex items-center gap-1">Modo Afiliado <Crown size={10} className="text-yellow-600" /></span>
                    <CheckIcon active={isPro} />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-xs font-bold text-gray-700 flex items-center gap-1">Controle WhatsApp <Crown size={10} className="text-yellow-600" /></span>
                    <CheckIcon active={isPro} />
                  </div>
                </div>
              </div>

          {/* DEVELOPER BYPASS — only in development */}
              {import.meta.env.DEV && (
              <div className="mt-8 border-t border-dashed border-gray-300 pt-4">
                <div className="flex items-center justify-center gap-2 mb-3 text-gray-400">
                  <Terminal size={12} />
                  <p className="text-[10px] font-bold uppercase tracking-widest">Área do Desenvolvedor</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      updateConfig({ ...config, plan: 'free' });
                      addToast('Forçado para plano Free');
                    }}
                    className="py-2 px-3 rounded-lg bg-gray-100 text-gray-500 text-xs font-bold hover:bg-gray-200 transition-colors"
                  >
                    Forçar Free
                  </button>
                  <button
                    onClick={() => {
                      updateConfig({ ...config, plan: 'pro' });
                      addToast('Forçado para plano Pro');
                    }}
                    className="py-2 px-3 rounded-lg bg-yellow-50 text-yellow-700 text-xs font-bold border border-yellow-200 hover:bg-yellow-100 transition-colors flex items-center justify-center gap-1"
                  >
                    <Crown size={12} /> Forçar Pro
                  </button>
                </div>
              </div>
              )}
            </div>
          )}

          {activeTab === 'themes' && (
            <div className="space-y-3">
              <div className="bg-white/40 p-3 rounded-xl border border-white/50 mb-4">
                <h3 className="text-xs font-bold text-gray-700 uppercase mb-2">Ajuste Rápido (Atual)</h3>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Cor Fundo Quiz</span>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full shadow-sm border border-white" style={{ backgroundColor: config.quiz.bgColor }}></div>
                    <input
                      type="color"
                      value={config.quiz.bgColor}
                      onChange={(e) => updateNestedConfig('quiz.bgColor', e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0"
                    />
                  </div>
                </div>
              </div>

              <h3 className="text-xs font-bold text-gray-700 uppercase mb-2">Bibliotecas de Temas</h3>
              <div className="grid grid-cols-1 gap-3">
                {themesList.map(theme => (
                  <div key={theme.id} className="flex items-center gap-2 p-2 bg-white/40 rounded-xl border border-white/50 hover:shadow-md transition-all">
                    <button
                      onClick={() => applyTheme(theme)}
                      className="flex-1 flex items-center gap-4 text-left"
                    >
                      <div className="flex -space-x-2">
                        {theme.colors.map((c, i) => <div key={i} className="w-6 h-6 rounded-full border border-white" style={{ backgroundColor: c }} />)}
                      </div>
                      <span className="font-bold text-xs text-gray-700">{theme.name}</span>
                    </button>

                    <div className="flex flex-col items-center border-l border-white/50 pl-2">
                      <label className="text-[8px] font-bold text-gray-400 uppercase mb-1">Quiz</label>
                      <input
                        type="color"
                        value={theme.config.quiz.bgColor}
                        onChange={(e) => updateThemeQuizColor(theme.id, e.target.value)}
                        title="Cor do Quiz Card"
                        className="w-6 h-6 rounded-full border-none p-0 overflow-hidden cursor-pointer shadow-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="space-y-4">
              <div className="bg-white/40 border border-white/50 rounded-xl p-3">
                <h3 className="text-xs font-bold text-gray-700 uppercase mb-3 flex items-center gap-2">
                  <Share2 size={14} /> Redes Sociais
                </h3>
                <p className="text-[10px] text-gray-500 mb-3">Links que aparecerão no rodapé do app.</p>

                <InputGroup label="Instagram (@usuario ou link)" value={config.social.instagram} onChange={(v) => updateNestedConfig('social.instagram', v)} />
                <InputGroup label="Facebook (Link)" value={config.social.facebook} onChange={(v) => updateNestedConfig('social.facebook', v)} />
                <InputGroup label="TikTok (Link)" value={config.social.tiktok} onChange={(v) => updateNestedConfig('social.tiktok', v)} />
              </div>

              <div className="bg-white/40 border border-white/50 rounded-xl p-3">
                <h3 className="text-xs font-bold text-gray-700 uppercase mb-3 flex items-center gap-2">
                  <MapPin size={14} /> Endereço Físico
                </h3>
                <InputGroup label="Endereço Completo" value={config.location.address} onChange={(v) => updateNestedConfig('location.address', v)} />
                <InputGroup label="Link do Google Maps Embed (iframe)" value={config.location.mapUrl} onChange={(v) => updateNestedConfig('location.mapUrl', v)} textarea placeholder="Cole a URL do src do iframe do Google Maps aqui" />
              </div>
            </div>
          )}

          {activeTab === 'branding' && (
            <div className="space-y-4">
              {/* CONFIGURAÇÕES GERAIS DA LOJA */}
              <div className="bg-white/40 border border-white/50 rounded-xl p-3 mb-4 relative overflow-hidden">
                <h3 className="text-xs font-bold text-gray-700 uppercase mb-3 flex items-center gap-2">
                  <Store size={14} /> Modo de Operação
                </h3>

                <div className="space-y-2 relative z-10">
                  <label className="flex items-center gap-3 p-2 bg-white/50 rounded-lg cursor-pointer hover:bg-white/80 transition-colors">
                    <input
                      type="radio"
                      name="storeMode"
                      checked={config.storeMode === 'mixed'}
                      onChange={() => handleStoreModeChange('mixed')}
                      className="text-terracotta focus:ring-terracotta"
                    />
                    <div>
                      <p className="text-xs font-bold text-gray-800">Híbrido (Padrão)</p>
                      <p className="text-[10px] text-gray-500">Carrinho + Links Externos</p>
                    </div>
                  </label>

                  <label className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${!isPro ? 'opacity-50 grayscale bg-gray-100' : 'bg-white/50 hover:bg-white/80'}`}>
                    <div className="relative">
                      <input
                        type="radio"
                        name="storeMode"
                        checked={config.storeMode === 'store'}
                        onChange={() => handleStoreModeChange('store')}
                        className="text-terracotta focus:ring-terracotta"
                        disabled={!isPro}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <p className="text-xs font-bold text-gray-800">Apenas Loja</p>
                        {!isPro && <Lock size={12} className="text-gray-500" />}
                      </div>
                      <p className="text-[10px] text-gray-500">Apenas Carrinho / WhatsApp</p>
                    </div>
                  </label>

                  <label className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${!isPro ? 'opacity-50 grayscale bg-gray-100' : 'bg-white/50 hover:bg-white/80'}`}>
                    <input
                      type="radio"
                      name="storeMode"
                      checked={config.storeMode === 'affiliate'}
                      onChange={() => handleStoreModeChange('affiliate')}
                      className="text-terracotta focus:ring-terracotta"
                      disabled={!isPro}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <p className="text-xs font-bold text-gray-800">Apenas Afiliado</p>
                        {!isPro && <Lock size={12} className="text-gray-500" />}
                      </div>
                      <p className="text-[10px] text-gray-500">Esconde Carrinho. Foco em Links.</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* TOGGLE WHATSAPP */}
              <div className={`bg-white/40 border border-white/50 rounded-xl p-3 ${!isPro ? 'opacity-60' : ''}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-gray-700 flex items-center gap-2">
                    Botão WhatsApp Flutuante
                    {!isPro && <Lock size={12} />}
                  </span>
                  <button
                    onClick={handleWhatsappToggle}
                    className={`text-2xl transition-colors ${config.enableWhatsapp ? 'text-green-600' : 'text-gray-400'}`}
                  >
                    {config.enableWhatsapp ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                  </button>
                </div>

                {/* WhatsApp Label Selector */}
                {config.enableWhatsapp && (
                  <div className="mt-2">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Texto do Botão</label>
                    <div className="relative">
                      <select
                        value={config.whatsapp.label}
                        onChange={(e) => updateNestedConfig('whatsapp.label', e.target.value)}
                        disabled={!isPro}
                        className="w-full bg-white/60 border border-white/50 rounded-xl px-3 py-2 text-xs outline-none appearance-none pr-8"
                      >
                        {WHATSAPP_LABELS.map((label) => (
                          <option key={label} value={label}>{label}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                )}
              </div>

              {/* CUSTOM DOMAIN CONFIGURATION */}
              <div className={`bg-white/40 border border-white/50 rounded-xl p-3 mb-4 relative overflow-hidden ${!isPro ? 'opacity-60' : ''}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-gray-700 uppercase flex items-center gap-2">
                    <Globe size={14} /> Endereço da Loja (Subdomínio)
                  </h3>
                </div>
                <div className="flex items-center gap-2 mb-4 group">
                  <div className="flex-1 flex items-center bg-white/60 border border-white/50 rounded-xl px-3 py-2 text-xs">
                    <input
                      value={storeId}
                      onChange={(e) => {/* Slug logic needs careful handling in ConfigContext */}}
                      placeholder="ex: minha-loja"
                      disabled={true}
                      className="flex-1 bg-transparent outline-none opacity-60 text-right pr-1"
                    />
                    <span className="font-bold text-gray-400">.vyzgo.com</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <a 
                      href={`https://${storeId}.vyzgo.com`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-black text-white px-4 py-2 rounded-xl text-[10px] font-bold flex items-center justify-between group hover:bg-gray-800 transition-colors shadow-sm"
                    >
                      <span>Ver Loja (Subdomínio)</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                    <a 
                      href={`/v/${storeId}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-white text-black border border-gray-200 px-4 py-2 rounded-xl text-[10px] font-bold flex items-center justify-between group hover:bg-gray-50 transition-colors shadow-sm"
                    >
                      <div className="flex flex-col items-start">
                        <span>Acesso Imediato (Provisório)</span>
                        <span className="text-[8px] font-normal opacity-50">Não depende de DNS</span>
                      </div>
                      <ExternalLink size={14} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-gray-700 uppercase flex items-center gap-2">
                    <Globe size={14} /> Domínio Personalizado (White Label)
                    {!isPro && <Lock size={12} />}
                  </h3>
                  {isPro && <span className="text-[10px] bg-green-100 text-green-700 px-2 rounded-full font-bold">PRO</span>}
                </div>

                <div className="relative">
                  <input
                    value={config.customDomain || ''}
                    onChange={(e) => updateConfig({ ...config, customDomain: e.target.value })}
                    placeholder="ex: loja.suamarca.com"
                    disabled={!isPro}
                    className="w-full bg-white/60 border border-white/50 rounded-xl px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed"
                  />
                  {!isPro && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-[1px]">
                      <button onClick={() => setIsPaymentOpen(true)} className="text-[10px] bg-black text-white px-3 py-1 rounded-full shadow-lg font-bold hover:scale-105 transition-transform">
                        Desbloquear
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-[9px] text-gray-500 mt-2 leading-relaxed">
                  Para funcionar, configure um CNAME no seu provedor de domínio apontando para <b>cname.vyzgo.com</b>.
                </p>
              </div>

              {/* HEADER CONFIGURATION GROUP */}
              <div className="bg-white/40 border border-white/50 rounded-xl p-3">
                <h3 className="text-xs font-bold text-gray-700 uppercase mb-3 flex items-center gap-2">
                  <ImageIcon size={14} /> Identidade Visual
                </h3>

                {/* Logo Upload */}
                <div className="mb-4">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Logotipo da Loja</label>
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-white rounded-xl border border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative group">
                      {config.header.logoUrl ? (
                        <img src={config.header.logoUrl} className="w-full h-full object-contain p-1" />
                      ) : (
                        <span className="text-gray-300 text-xs text-center px-1">Sem Logo</span>
                      )}

                      <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                        <Upload size={16} className="text-white" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, (url) => updateNestedConfig('header.logoUrl', url))}
                        />
                      </label>
                    </div>

                    <div className="flex-1 space-y-2">
                      <p className="text-[10px] text-gray-500 leading-tight">
                        Carregue sua logo para substituir o título em texto. <br />
                        <span className="text-[9px] opacity-70">Recomendado: PNG transparente.</span>
                      </p>
                      {config.header.logoUrl && (
                        <button
                          onClick={() => updateNestedConfig('header.logoUrl', '')}
                          className="px-3 py-1 bg-red-50 text-red-500 text-[10px] font-bold rounded-lg flex items-center gap-1 hover:bg-red-100 transition-colors"
                        >
                          <Trash2 size={10} /> Remover Logo
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <InputGroup label="Nome da Loja (Usado se sem logo)" value={config.header.title} onChange={(v) => updateNestedConfig('header.title', v)} />
                <InputGroup label="Subtítulo" value={config.header.subtitle} onChange={(v) => updateNestedConfig('header.subtitle', v)} />
                <div className="pt-2 border-t border-white/20 mt-2">
                  <InputGroup label="Texto do Rodapé (Direitos Autorais)" value={config.footerText} onChange={(v) => updateConfig({ ...config, footerText: v })} />
                </div>
              </div>

              <InputGroup label="WhatsApp" value={config.whatsapp.phoneNumber} onChange={(v) => updateNestedConfig('whatsapp.phoneNumber', v)} />

              {/* Tracking & Location Toggle */}
              <div className="pt-2 border-t border-white/20">
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2 tracking-wider">Funcionalidades Extras</label>
                <div className="space-y-2">
                  <button
                    onClick={() => toggleCard('tracking')}
                    className={`w-full py-2 px-3 rounded-xl flex items-center justify-between text-xs font-bold transition-all ${hasTracking ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}
                  >
                    <span className="flex items-center gap-2">
                      {hasTracking ? <MapPinOff size={14} /> : <MapPin size={14} />}
                      Rastreio de Pedido
                    </span>
                    <span className="text-[10px] opacity-60 uppercase">{hasTracking ? 'Ativo' : 'Inativo'}</span>
                  </button>

                  <button
                    onClick={() => toggleCard('location')}
                    className={`w-full py-2 px-3 rounded-xl flex items-center justify-between text-xs font-bold transition-all ${hasLocation ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}
                  >
                    <span className="flex items-center gap-2">
                      {hasLocation ? <MapPinOff size={14} /> : <MapPin size={14} />}
                      Mapa da Loja
                    </span>
                    <span className="text-[10px] opacity-60 uppercase">{hasLocation ? 'Ativo' : 'Inativo'}</span>
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-white/20">
                <p className="text-[9px] text-gray-400 text-center">Configurações de marca e operação da loja pública.</p>
              </div>
            </div>
          )}

          {activeTab === 'home' && (
            <div className="space-y-6">
              {/* BANNERS SECTION */}
              <div className="bg-white/40 border border-white/50 rounded-xl p-3">
                <h3 className="text-xs font-black text-gray-700 uppercase mb-3 flex items-center gap-2">
                  <ImageIcon size={14} className="text-blue-500" /> Banners da Vitrine (Carrossel)
                </h3>
                <p className="text-[10px] text-gray-500 mb-4">Adicione até 3-5 imagens para o destaque principal.</p>
                
                <div className="space-y-3">
                  {(config.banners || []).map((url, idx) => (
                    <div key={idx} className="flex gap-2">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-white">
                        <img src={url} className="w-full h-full object-cover" />
                      </div>
                      <input 
                        value={url}
                        onChange={(e) => {
                          const newBanners = [...(config.banners || [])];
                          newBanners[idx] = e.target.value;
                          updateConfig({ ...config, banners: newBanners });
                        }}
                        placeholder="URL da Imagem..."
                        className="flex-1 bg-white/60 border border-white/50 rounded-xl px-3 py-2 text-[10px] outline-none"
                      />
                      <button 
                         onClick={() => {
                           const newBanners = (config.banners || []).filter((_, i) => i !== idx);
                           updateConfig({ ...config, banners: newBanners });
                         }}
                         className="text-red-400 hover:text-red-600 p-2"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  
                  <button 
                    onClick={() => {
                      const newBanners = [...(config.banners || []), ''];
                      updateConfig({ ...config, banners: newBanners });
                    }}
                    className="w-full py-2 border-2 border-dashed border-blue-200 rounded-xl text-[10px] font-bold text-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center gap-1"
                  >
                    <Plus size={12} /> Adicionar Banner
                  </button>
                </div>
              </div>

              {/* FEATURED PRODUCTS SECTION */}
              <div className="bg-white/40 border border-white/50 rounded-xl p-3">
                <h3 className="text-xs font-black text-gray-700 uppercase mb-3 flex items-center gap-2">
                  <Star size={14} className="text-yellow-500" /> Produtos em Destaque
                </h3>
                <p className="text-[10px] text-gray-500 mb-4">Selecione até 5 produtos para aparecerem no carrossel de destaques.</p>
                
                <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin pr-2">
                  {config.categories.flatMap(cat => cat.products).map(product => {
                    const isFeatured = config.featuredProductIds?.includes(product.id);
                    return (
                      <button
                        key={product.id}
                        onClick={() => {
                          const current = config.featuredProductIds || [];
                          const next = isFeatured 
                            ? current.filter(id => id !== product.id)
                            : [...current, product.id].slice(0, 5);
                          updateConfig({ ...config, featuredProductIds: next });
                        }}
                        className={`w-full flex items-center gap-3 p-2 rounded-xl border transition-all text-left ${
                          isFeatured ? 'bg-yellow-50 border-yellow-200 shadow-sm' : 'bg-white/40 border-white/50 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0">
                          <img src={product.imageUrl} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                           <p className="text-[10px] font-bold text-gray-800 truncate">{product.title}</p>
                           <p className="text-[9px] text-gray-500">{product.price}</p>
                        </div>
                        {isFeatured ? <Star size={14} className="text-yellow-500 fill-yellow-500" /> : <div className="w-3.5 h-3.5 rounded-full border border-gray-300" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* CATEGORIES SECTION */}
              <div>
                <h3 className="font-black text-xs text-gray-800 mb-2 uppercase tracking-tight">Categorias & Navegação</h3>
                <div className="space-y-2">
                  {config.categories.map((cat, index) => (
                    <div key={cat.id} className="p-3 bg-white/40 rounded-xl border border-white/50 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{cat.iconKey === 'Star' ? '⭐' : cat.iconKey === 'Package' ? '📦' : '📁'}</span>
                          <span className="text-xs font-bold text-gray-700">{cat.title}</span>
                        </div>
                        <div className="flex gap-2">
                          {cat.id !== 'tracking' && cat.id !== 'location' && (
                            <button onClick={() => removeCategory(index)} className="text-red-400 hover:text-red-500"><Trash2 size={14} /></button>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                         <InputGroup label="Título" value={cat.title} onChange={(v) => {
                            const newCats = [...config.categories];
                            newCats[index].title = v;
                            updateConfig({ ...config, categories: newCats });
                         }} />
                         <InputGroup label="Subtítulo" value={cat.subtitle} onChange={(v) => {
                            const newCats = [...config.categories];
                            newCats[index].subtitle = v;
                            updateConfig({ ...config, categories: newCats });
                         }} />
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={addCategory} className="w-full py-3 bg-white border border-gray-100 text-blue-600 rounded-xl text-xs font-black shadow-sm flex items-center justify-center gap-2 mt-4 hover:scale-[1.02] transition-transform">
                  <Plus size={16} /> Nova Categoria
                </button>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-4">
              {/* Demo Tools */}
              <div className="bg-purple-50 border border-purple-100 rounded-xl p-3">
                <h3 className="text-xs font-bold text-purple-800 uppercase mb-2 flex items-center gap-2">
                  <Sparkles size={14} /> Dados de Demonstração
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      if (confirm('Isso irá adicionar produtos de exemplo. Continuar?')) seedInitialData();
                    }}
                    className="py-2 px-3 bg-white text-purple-700 text-xs font-bold rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors flex items-center justify-center gap-1"
                  >
                    <Plus size={12} /> Carregar Demo
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Isso removerá os produtos de demonstração. Continuar?')) clearDemoData();
                    }}
                    className="py-2 px-3 bg-white text-red-600 text-xs font-bold rounded-lg border border-red-200 hover:bg-red-50 transition-colors flex items-center justify-center gap-1"
                  >
                    <Trash2 size={12} /> Limpar Demo
                  </button>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Selecionar Categoria</label>
                <select
                  value={selectedCategoryIndex}
                  onChange={(e) => setSelectedCategoryIndex(Number(e.target.value))}
                  className="w-full bg-white/60 border border-white/50 rounded-xl px-3 py-2 text-xs outline-none"
                >
                  {config.categories.map((cat, i) => (
                    <option key={cat.id} value={i}>{cat.title}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                {config.categories[selectedCategoryIndex]?.products.map((prod, pIndex) => (
                  <div key={prod.id} className="bg-white/40 border border-white/50 rounded-xl p-3">
                    <div className="flex gap-2 mb-2">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0 relative group">
                        <img src={prod.imageUrl} className="w-full h-full object-cover" />
                        <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer text-white">
                          <Upload size={12} />
                          <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, (url) => updateProduct(selectedCategoryIndex, pIndex, 'imageUrl', url))} />
                        </label>
                      </div>
                      <div className="flex-1 space-y-1">
                        <input
                          value={prod.title}
                          onChange={(e) => updateProduct(selectedCategoryIndex, pIndex, 'title', e.target.value)}
                          className="w-full bg-transparent border-b border-gray-200 text-xs font-bold outline-none"
                          placeholder="Nome do Produto"
                        />
                        <input
                          value={prod.price}
                          onChange={(e) => updateProduct(selectedCategoryIndex, pIndex, 'price', e.target.value)}
                          className="w-full bg-transparent border-b border-gray-200 text-xs text-green-600 outline-none"
                          placeholder="Preço"
                        />
                      </div>
                      <button onClick={() => removeProductFromCategory(selectedCategoryIndex, pIndex)} className="text-red-400 self-start">
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="flex justify-end mb-1">
                      <button
                        onClick={async () => {
                          if (!prod.title) return alert("Digite o nome do produto primeiro.");
                          addToast('Criando mágica... ✨', 'info');
                          try {
                            const desc = await generateProductDescription(
                              prod.title,
                              prod.price,
                              config.categories[selectedCategoryIndex].title
                            );
                            updateProduct(selectedCategoryIndex, pIndex, 'description', desc);
                            addToast('Descrição gerada!', 'success');
                          } catch (e: any) {
                            addToast(e.message || 'Erro ao gerar descrição.', 'error');
                          }
                        }}
                        className="text-[10px] text-purple-600 font-bold flex items-center gap-1 hover:bg-purple-50 px-2 py-1 rounded-full transition-colors"
                        title="Gerar descrição com IA"
                      >
                        <Sparkles size={10} /> Mágica IA
                      </button>
                    </div>
                    <textarea
                      value={prod.description}
                      onChange={(e) => updateProduct(selectedCategoryIndex, pIndex, 'description', e.target.value)}
                      className="w-full bg-white/50 rounded-lg p-2 text-[10px] resize-none outline-none mb-2"
                      placeholder="Descrição..."
                      rows={2}
                    />
                    {/* Stock field */}
                    <div className="flex items-center gap-2 mt-2 p-2 bg-orange-50 border border-orange-100 rounded-lg">
                      <Package size={10} className="text-orange-500 shrink-0" />
                      <label className="text-[9px] font-bold text-orange-700 uppercase flex-1">Estoque</label>
                      <input
                        type="number"
                        value={prod.stock ?? ''}
                        placeholder="∞"
                        min={0}
                        onChange={e => updateProduct(selectedCategoryIndex, pIndex, 'stock', e.target.value === '' ? null : Number(e.target.value))}
                        className="w-20 bg-white border border-orange-200 rounded px-2 py-1 text-[10px] text-center outline-none"
                      />
                      {prod.stock === 0 && <span className="text-[9px] font-bold text-red-500">Esgotado</span>}
                    </div>

                    {/* Affiliate Link Input */}
                    <div className="bg-blue-50/50 p-2 rounded-lg border border-blue-100">
                      <div className="flex items-center gap-1 mb-1">
                        <Link size={10} className="text-blue-500" />
                        <label className="text-[9px] font-bold text-blue-600 uppercase">Link de Afiliado/Externo (Opcional)</label>
                      </div>
                      <input
                        value={prod.affiliateUrl || ''}
                        onChange={(e) => updateProduct(selectedCategoryIndex, pIndex, 'affiliateUrl', e.target.value)}
                        placeholder="https://..."
                        className="w-full bg-white border border-blue-100 rounded px-2 py-1 text-[10px] text-blue-800 outline-none"
                      />
                    </div>
                  </div>
                ))}

                <button
                  onClick={handleAddProduct}
                  className="w-full py-3 bg-green-50 text-green-600 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-green-100 shadow-sm"
                >
                  <Plus size={14} /> Adicionar Produto em {config.categories[selectedCategoryIndex]?.title}
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/20 bg-white/10">
          <button onClick={resetConfig} className="w-full flex items-center justify-center gap-2 text-red-500 text-xs font-bold opacity-60 hover:opacity-100"><RotateCcw size={12} /> Resetar App</button>
        </div>
      </div>

      <PaymentGateway
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onSuccess={upgradeToPro}
        planName="Plano Pro"
        price="R$ 29,90"
      />
    </div>
  );
};

// FAQ Accordion Component
const FAQItem = ({ title, content }: { title: string, content: React.ReactNode }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white/40 border border-white/50 rounded-xl overflow-hidden transition-all">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-3 text-left hover:bg-white/30"
      >
        <span className="text-xs font-bold text-gray-700">{title}</span>
        {open ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
      </button>
      {open && (
        <div className="px-3 pb-3 pt-0">
          <div className="text-[11px] text-gray-600 leading-relaxed border-t border-gray-100 pt-2">
            {content}
          </div>
        </div>
      )}
    </div>
  );
};

const CheckIcon = ({ active }: { active: boolean }) => (
  active ?
    <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center text-green-600"><Unlock size={10} /></div> :
    <div className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center text-gray-400"><Lock size={10} /></div>
);

export default AdminPanel;