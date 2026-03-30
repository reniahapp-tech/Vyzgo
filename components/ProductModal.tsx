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

  // Use the config to determine if the Hero Product has an affiliate link
  // Note: Since Hero is hardcoded in config for this demo, we assume it might have a property or we treat it as standard.
  // For a real app, the Hero would likely be linked to a real Product ID. 
  // Here, we will check if the Hero description or config implies an affiliate link, 
  // OR we can add a specific 'heroAffiliateUrl' to config later.
  // For now, to keep it consistent with the user request, let's assume the Hero behaves like a standard product 
  // unless we are in Affiliate Only mode without a specific link, where it might default to a specific action.
  
  // Since the Hero object in types.ts doesn't have affiliateUrl, let's use a safe fallback or assume standard cart for now,
  // BUT if storeMode is 'affiliate', we shouldn't show "Add to Cart".
  
  const showCartButton = storeMode !== 'affiliate';
  
  // Assuming Hero doesn't have a specific affiliate URL in the current type definition,
  // we will direct to WhatsApp or hide the button if in strict affiliate mode.
  // To make this robust, let's assume if it's affiliate mode, the hero button acts as "Contact" or similar if no link exists.

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
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div 
        className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-slide-up-panel max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: config.theme.backgroundColor }}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/5 hover:bg-black/10 transition-colors"
          style={{ color: theme.textColor }}
        >
          <X size={20} />
        </button>

        {/* Image */}
        <div className="w-full h-56 rounded-2xl overflow-hidden mb-6 shadow-sm relative">
           <ImageWithFallback 
             src={hero.imageUrl} 
             alt={hero.title} 
             className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
           />
           <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold shadow-sm" style={{ color: theme.primaryColor }}>
             Destaque
           </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold leading-tight mb-1" style={{ color: theme.textColor }}>
              {hero.title}
            </h2>
            <p className="text-xl font-medium" style={{ color: theme.primaryColor }}>
              {hero.price}
            </p>
          </div>

          <div className="w-full h-px bg-current opacity-10"></div>

          <p className="opacity-80 leading-relaxed" style={{ color: theme.textColor }}>
            {hero.description || "Descrição do produto indisponível."}
          </p>

          <div className="flex gap-2 mt-2">
            <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md bg-green-100 text-green-700">
              <Check size={12} /> Em estoque
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md bg-blue-100 text-blue-700">
              <Check size={12} /> Envio imediato
            </span>
          </div>

          {/* Action Button */}
          {showCartButton ? (
            <button 
              onClick={handleAddToCart}
              className="block w-full text-center font-bold py-4 px-6 rounded-xl2 shadow-lg hover:shadow-xl transition-all active:scale-[0.98] mt-6 flex items-center justify-center gap-2"
              style={{ backgroundColor: theme.primaryColor, color: '#FFFFFF' }}
            >
              <ShoppingBag size={20} className="fill-white" />
              Adicionar à Sacola
            </button>
          ) : (
            <div className="mt-6 p-4 bg-gray-100 rounded-xl text-center text-gray-500 text-sm flex flex-col items-center">
              <Info size={24} className="mb-2 opacity-50"/>
              <p>Este produto é exclusivo. Entre em contato para saber onde comprar.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductModal;