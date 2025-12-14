import React from 'react';
import { X, Trash2, MessageCircle, ShoppingBag } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';

const CartModal: React.FC = () => {
  const { config, cart, isCartOpen, setIsCartOpen, removeFromCart, getCartTotal } = useConfig();
  const { theme, whatsapp } = config;

  if (!isCartOpen) return null;

  const total = getCartTotal();

  // Generate WhatsApp Order Message
  const generateOrderMessage = () => {
    let message = `Olá! Gostaria de fazer o seguinte pedido na *${config.header.title}*:\n\n`;
    
    cart.forEach(item => {
      message += `▪️ 1x ${item.title} - ${item.price}\n`;
    });

    message += `\n*Total: R$ ${total.toFixed(2).replace('.', ',')}*`;
    message += `\n\nAguardo confirmação de disponibilidade e frete. Obrigado!`;

    return encodeURIComponent(message);
  };

  const whatsappUrl = `https://wa.me/${whatsapp.phoneNumber}?text=${generateOrderMessage()}`;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      ></div>

      {/* Modal Content */}
      <div 
        className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-slide-up-panel h-[85vh] flex flex-col"
        style={{ backgroundColor: config.theme.backgroundColor }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: theme.textColor }}>
            <ShoppingBag size={20} className="fill-current opacity-80" />
            Sua Sacola
            <span className="text-sm opacity-50 font-normal">({cart.length})</span>
          </h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-full bg-black/5 hover:bg-black/10 transition-colors"
            style={{ color: theme.textColor }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Empty State */}
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center opacity-50 pb-20">
            <ShoppingBag size={64} className="mb-4 text-gray-300" />
            <p className="text-center font-medium">Sua sacola está vazia.</p>
            <p className="text-center text-sm">Adicione produtos para começar.</p>
          </div>
        ) : (
          /* Cart List */
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-hide">
            {cart.map((item) => (
              <div 
                key={item.id} 
                className="flex gap-4 p-3 rounded-2xl bg-white/50 border border-white/60 shadow-sm"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <h3 className="font-bold text-sm leading-tight mb-1" style={{ color: theme.textColor }}>{item.title}</h3>
                    <p className="text-xs text-gray-500 font-medium">{item.price}</p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="self-start flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-red-400 hover:text-red-600 transition-colors p-1 -ml-1"
                  >
                    <Trash2 size={12} /> Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Actions */}
        {cart.length > 0 && (
          <div className="pt-6 mt-4 border-t border-black/5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-500">Total estimado</span>
              <span className="text-2xl font-bold" style={{ color: theme.primaryColor }}>
                R$ {total.toFixed(2).replace('.', ',')}
              </span>
            </div>
            
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-white font-bold py-4 px-6 rounded-xl2 shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] hover:shadow-xl hover:brightness-105"
              style={{ backgroundColor: theme.accentColor }}
            >
              <MessageCircle size={20} className="fill-white" />
              Finalizar Pedido no Zap
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;