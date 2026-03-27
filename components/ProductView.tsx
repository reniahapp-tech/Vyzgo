import React, { useEffect } from 'react';
import { ArrowLeft, MessageCircle, Check, ShoppingBag, ShieldCheck, ExternalLink, Info, Share2, AlertCircle } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';
import { ProductItem } from '../types';
import ImageWithFallback from './ImageWithFallback';

interface ProductViewProps {
  product: ProductItem;
  fromCategoryId: string;
}

const ProductView: React.FC<ProductViewProps> = ({ product, fromCategoryId }) => {
  const { config, navigateCategory, addToCart, addToast } = useConfig();
  const { theme, whatsapp, storeMode, enableWhatsapp } = config;

  // SEO: Update page title and meta description
  useEffect(() => {
    const prevTitle = document.title;
    document.title = `${product.title} — ${config.header.title}`;
    // Update meta description
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    const prevDesc = meta.content;
    meta.content = product.description || `${product.title} por ${product.price} em ${config.header.title}`;
    return () => {
      document.title = prevTitle;
      if (meta) meta.content = prevDesc;
    };
  }, [product, config]);

  // Direct WhatsApp Link for questions
  const encodedMessage = encodeURIComponent(
    `Olá! Vi o produto *${product.title}* na ${config.header.title} e tenho uma dúvida.`
  );
  const whatsappUrl = `https://wa.me/${whatsapp.phoneNumber}?text=${encodedMessage}`;

  // Mode Logic
  const showCartButton = storeMode !== 'affiliate';
  const shouldUseAffiliateLink = (storeMode === 'mixed' || storeMode === 'affiliate') && product.affiliateUrl;

  // Stock status
  const isOutOfStock = product.stock === 0;

  // Share product
  const handleShare = async () => {
    const shareData = { title: product.title, text: `${product.title} — ${product.price}`, url: window.location.href };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        addToast('Link copiado!', 'success');
      }
    } catch {
      await navigator.clipboard.writeText(window.location.href);
      addToast('Link copiado!', 'success');
    }
  };

  return (
    <div className="animate-fade-in flex flex-col h-full min-h-[80vh] md:justify-center">
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-10 md:static md:mb-6">
        <button 
          onClick={() => navigateCategory(fromCategoryId)}
          className="p-2 rounded-full bg-white/80 backdrop-blur-md shadow-sm hover:bg-white transition-colors"
          style={{ color: theme.textColor }}
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:gap-10 md:items-start h-full">
        
        {/* Hero Image Section */}
        <div className="-mx-6 -mt-6 md:mx-0 md:mt-0 h-80 md:h-[500px] md:w-1/2 bg-gray-100 relative mb-6 md:mb-0 md:rounded-3xl overflow-hidden shadow-md">
          <ImageWithFallback 
            src={product.imageUrl} 
            alt={product.title} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent md:hidden"></div>
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col h-full md:justify-center">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-2xl md:text-4xl font-bold leading-tight max-w-[80%]" style={{ color: theme.textColor }}>
              {product.title}
            </h1>
            <span className="text-xl md:text-2xl font-bold whitespace-nowrap" style={{ color: theme.primaryColor }}>
              {product.price}
            </span>
          </div>

          <div className="flex items-center gap-2 mb-6">
             <span className={`text-[10px] md:text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1 ${
               isOutOfStock
                 ? 'bg-red-100 text-red-600'
                 : 'bg-green-100 text-green-700'
             }`}>
               {isOutOfStock ? <AlertCircle size={12} /> : <Check size={12} />}
               {isOutOfStock ? 'Esgotado' : 'Disponível'}
             </span>
             {!isOutOfStock && (
               <span className="text-[10px] md:text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-bold flex items-center gap-1">
                 <ShieldCheck size={12} /> Garantia
               </span>
             )}
             {/* Share button */}
             <button
               onClick={handleShare}
               className="ml-auto p-2 rounded-full bg-black/5 hover:bg-black/10 transition-colors"
               title="Compartilhar produto"
               style={{ color: theme.textColor }}
             >
               <Share2 size={16} />
             </button>
          </div>

          <div className="w-full h-px bg-gray-100 mb-6 md:mb-8"></div>

          <h3 className="font-bold text-sm mb-2 opacity-70 uppercase tracking-wide">Sobre o produto</h3>
          <p className="text-gray-600 leading-relaxed mb-8 md:text-lg">
            {product.description || "Sem descrição definida para este item."}
          </p>

          {/* Bottom Actions - Dynamic based on Mode */}
          <div className="mt-auto md:mt-8 space-y-3 pb-4">
            
            {shouldUseAffiliateLink ? (
              /* AFFILIATE LINK BUTTON */
              <a
                href={product.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full font-bold py-4 rounded-xl2 flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] hover:shadow-xl hover:brightness-110 hover:-translate-y-1"
                style={{ backgroundColor: theme.primaryColor, color: '#FFFFFF' }}
              >
                <ExternalLink size={20} />
                Acessar Site Oficial
              </a>
            ) : showCartButton ? (
              /* CART BUTTON (If allowed by mode) */
              <button
                onClick={() => addToCart({
                  productId: product.id,
                  title: product.title,
                  price: product.price,
                  imageUrl: product.imageUrl,
                  quantity: 1
                })}
                disabled={isOutOfStock}
                className={`w-full font-bold py-4 rounded-xl2 border-2 flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                  isOutOfStock
                    ? 'opacity-40 cursor-not-allowed border-gray-200 text-gray-400'
                    : 'hover:bg-gray-50'
                }`}
                style={isOutOfStock ? {} : { borderColor: theme.primaryColor, color: theme.primaryColor }}
              >
                <ShoppingBag size={20} />
                {isOutOfStock ? 'Produto Esgotado' : 'Adicionar à Sacola'}
              </button>
            ) : (
              /* AFFILIATE MODE BUT NO LINK PROVIDED */
              <div className="w-full text-center py-4 text-gray-400 text-sm flex flex-col items-center">
                 <Info size={20} className="mb-1" />
                 Link indisponível no momento
              </div>
            )}

            {/* Support Button (Controlled by Global Toggle) */}
            {enableWhatsapp && (
              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full font-bold py-4 rounded-xl2 flex items-center justify-center gap-2 transition-all active:scale-[0.98] hover:-translate-y-1 ${shouldUseAffiliateLink ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'text-white shadow-lg hover:shadow-xl'}`}
                style={shouldUseAffiliateLink ? {} : { backgroundColor: theme.accentColor }}
              >
                <MessageCircle size={20} className={shouldUseAffiliateLink ? "fill-gray-600" : "fill-white"} />
                {shouldUseAffiliateLink ? 'Tirar Dúvidas no WhatsApp' : 'Comprar no WhatsApp'}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductView;