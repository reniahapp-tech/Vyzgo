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
  const itemCount = cart.reduce((n, i) => n + i.quantity, 0);

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-stretch justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Content */}
      <div
        className="relative w-full max-w-md bg-white shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col h-full rounded-l-[2rem]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-8 shrink-0">
          <div className="flex flex-col">
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter flex items-center gap-3">
              Sua Sacola
            </h2>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mt-1">
              {itemCount} {itemCount === 1 ? 'item selecionado' : 'itens selecionados'}
            </p>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 transition-all active:scale-95 text-gray-400"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Empty State */}
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-12 text-center">
            <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center mb-6">
              <ShoppingBag size={40} className="text-gray-200" />
            </div>
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-2">Sacola Vazia</h3>
            <p className="text-sm text-gray-400 font-medium leading-relaxed">
              Parece que você ainda não escolheu nada. Explore nossas coleções e encontre algo incrível!
            </p>
            <button 
              onClick={() => setIsCartOpen(false)}
              className="mt-8 px-8 py-3 rounded-xl border-2 border-gray-100 text-sm font-black uppercase tracking-widest text-gray-400 hover:bg-gray-50"
            >
              Voltar à Loja
            </button>
          </div>
        ) : (
          /* Cart List */
          <div className="flex-1 overflow-y-auto px-8 space-y-4 scrollbar-hide pb-10">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-200/30 group/item"
              >
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-50 shrink-0 border border-gray-50">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500" />
                </div>
                
                <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-black text-sm text-gray-900 uppercase tracking-tighter truncate">{item.title}</h3>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-full scale-90 -ml-2">
                      <button
                        onClick={() => item.quantity > 1 && updateCartQuantity(item.id, -1)}
                        className={`w-5 h-5 flex items-center justify-center transition-colors ${item.quantity > 1 ? 'text-gray-400 hover:text-indigo-600' : 'text-gray-200 cursor-not-allowed'}`}
                      >
                        <Minus size={14} strokeWidth={3} />
                      </button>
                      <span className="text-xs font-black text-gray-900 w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, 1)}
                        className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-indigo-600 transition-colors"
                      >
                        <Plus size={14} strokeWidth={3} />
                      </button>
                    </div>
                    
                    <span className="text-sm font-black text-indigo-600">
                      R$ {(item.priceValue * item.quantity).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Actions */}
        {cart.length > 0 && (
          <div className="p-8 bg-white border-t border-gray-100 shrink-0 shadow-[0_-20px_40px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Valor Total</span>
                <span className="text-3xl font-black text-indigo-600 tracking-tighter">
                  R$ {total.toFixed(2).replace('.', ',')}
                </span>
              </div>
              <div className="text-right">
                 <span className="text-[9px] font-bold text-gray-400 uppercase">Checkout 100% Seguro</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-[1.5rem] font-black shadow-2xl shadow-indigo-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
            >
              Fechar Pedido
              <span className="w-1.5 h-1.5 rounded-full bg-white opacity-40"></span>
              <span className="opacity-80">R$ {total.toFixed(2).replace('.', ',')}</span>
            </button>
            <p className="text-center text-[10px] text-gray-400 font-bold mt-4 uppercase tracking-tighter">Taxas e frete calculados no próximo passo</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;