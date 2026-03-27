import React from 'react';
import { X, Trash2, ShoppingBag, Plus, Minus } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';

const CartModal: React.FC = () => {
  const {
    config, cart, isCartOpen, setIsCartOpen, removeFromCart,
    getCartTotal, updateCartQuantity, setIsCheckoutOpen
  } = useConfig();
  const { theme } = config;

  if (!isCartOpen) return null;

  const total = getCartTotal();

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

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
            <span className="text-sm opacity-50 font-normal">({cart.reduce((n, i) => n + i.quantity, 0)})</span>
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
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-hide">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 p-3 rounded-2xl bg-white/50 border border-white/60 shadow-sm"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-0.5">
                  <div>
                    <h3 className="font-bold text-sm leading-tight mb-0.5" style={{ color: theme.textColor }}>{item.title}</h3>
                    <p className="text-xs text-gray-500 font-medium">{item.price}</p>
                  </div>
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() => item.quantity === 1 ? removeFromCart(item.id) : updateCartQuantity(item.id, -1)}
                      className="w-6 h-6 rounded-full bg-black/5 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors"
                      style={{ color: theme.textColor }}
                    >
                      {item.quantity === 1 ? <Trash2 size={11} /> : <Minus size={11} />}
                    </button>
                    <span className="text-sm font-bold w-4 text-center" style={{ color: theme.textColor }}>{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.id, 1)}
                      className="w-6 h-6 rounded-full flex items-center justify-center transition-colors text-white"
                      style={{ backgroundColor: theme.primaryColor }}
                    >
                      <Plus size={11} />
                    </button>
                  </div>
                </div>
                {/* Item Total */}
                <div className="flex items-center shrink-0">
                  <span className="text-sm font-bold" style={{ color: theme.primaryColor }}>
                    R$ {(item.priceValue * item.quantity).toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Actions */}
        {cart.length > 0 && (
          <div className="pt-5 mt-4 border-t border-black/5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-500">Total estimado</span>
              <span className="text-2xl font-bold" style={{ color: theme.primaryColor }}>
                R$ {total.toFixed(2).replace('.', ',')}
              </span>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full text-white font-bold py-4 px-6 rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] hover:shadow-xl hover:brightness-105"
              style={{ backgroundColor: theme.accentColor }}
            >
              Finalizar Pedido →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;