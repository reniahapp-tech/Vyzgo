import React from 'react';
import { X, ShoppingBag, Check, ExternalLink, Info } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';
import ImageWithFallback from './ImageWithFallback';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose }) => {
  const { config, addToCart } = useConfig();
  const { hero, theme, storeMode } = config;

  if (!isOpen) return null;

  const showCartButton = storeMode !== 'affiliate';

  const handleAddToCart = () => {
    addToCart({
      productId: 'hero-product',
      title: hero.title,
      price: hero.price,
      imageUrl: hero.imageUrl,
      quantity: 1
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div 
        className="relative w-full max-w-lg bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 duration-500 max-h-[95vh] flex flex-col"
      >
        {/* Header Image */}
        <div className="relative w-full aspect-[4/3] md:aspect-video shrink-0">
          <ImageWithFallback 
            src={hero.imageUrl} 
            alt={hero.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-40"></div>
          
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/40 transition-all active:scale-90"
          >
            <X size={20} />
          </button>

          <div className="absolute bottom-6 left-8 bg-indigo-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
            Edição Especial
          </div>
        </div>

        {/* Content Area */}
        <div className="px-8 pb-8 pt-4 overflow-y-auto flex-1">
          <div className="space-y-6">
            <div className="flex flex-col gap-1">
              <h2 className="text-3xl font-black text-gray-900 leading-[0.95] tracking-tighter uppercase">
                {hero.title}
              </h2>
              <div className="flex items-center gap-3 mt-2">
                <p className="text-2xl font-black text-indigo-600">
                  {hero.price}
                </p>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-wider">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                   Pronta Entrega
                </div>
              </div>
            </div>

            <div className="space-y-3">
               <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Sobre este item</h3>
               <p className="text-gray-600 text-sm leading-relaxed font-medium">
                  {hero.description || "Este item exclusivo foi selecionado para proporcionar a melhor experiência de estilo e qualidade. Design atemporal com acabamento premium."}
               </p>
            </div>

            <div className="grid grid-cols-2 gap-3 py-2">
               <div className="p-3 bg-gray-50 rounded-2xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-indigo-500 shadow-sm">
                    <Check size={16} strokeWidth={3} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-tighter text-gray-500">100% Original</span>
               </div>
               <div className="p-3 bg-gray-50 rounded-2xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-indigo-500 shadow-sm">
                    <Info size={16} strokeWidth={3} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-tighter text-gray-500">Garantia VyzGo</span>
               </div>
            </div>
          </div>
        </div>

        {/* Sticky Actions */}
        <div className="p-6 bg-white border-t border-gray-100 shrink-0">
          {showCartButton ? (
            <button 
              onClick={handleAddToCart}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-[1.5rem] font-black shadow-2xl shadow-indigo-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
            >
              <ShoppingBag size={20} strokeWidth={2.5} />
              Adicionar à Sacola
            </button>
          ) : (
             <button 
              onClick={() => window.open(`https://wa.me/${config.whatsapp.phoneNumber}`, '_blank')}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-5 rounded-[1.5rem] font-black shadow-2xl shadow-green-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
            >
              <ExternalLink size={20} strokeWidth={2.5} />
              Comprar via WhatsApp
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductModal;