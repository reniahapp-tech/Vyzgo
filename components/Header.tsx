import React, { useState } from 'react';
import { ShoppingBag, Search, MapPin } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';
import SearchModal from './SearchModal';

const Header: React.FC = () => {
  const { config, cart, setIsCartOpen } = useConfig();
  const { header, theme, storeMode } = config;
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // If Affiliate Only mode, hide cart
  const showCart = storeMode !== 'affiliate';

  return (
    <>
      <header className="sticky top-0 z-[50] bg-white border-b border-gray-100 flex items-center justify-between px-6 py-5 -mx-6 mb-8 shadow-sm">
        <div className="flex items-center gap-4">
          {header.logoUrl ? (
            <img 
              src={header.logoUrl} 
              alt={header.title} 
              className="h-10 w-auto object-contain transition-transform active:scale-95"
            />
          ) : (
             <div className="flex flex-col">
                <h1 className="text-xl font-black tracking-tighter leading-none text-gray-900 uppercase">
                  {header.title}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">
                    {header.subtitle}
                  </span>
                </div>
             </div>
          )}
        </div>

        <div className="flex gap-2">
          {/* Search Button */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="p-3 rounded-2xl transition-all active:scale-90 hover:bg-gray-50 text-gray-900 border border-transparent hover:border-gray-200"
            aria-label="Buscar"
          >
            <Search size={20} strokeWidth={2.5} />
          </button>

          {/* Cart Button (Conditional) */}
          {showCart && (
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-3 rounded-2xl transition-all active:scale-90 bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:bg-indigo-800"
            >
              <ShoppingBag size={20} strokeWidth={2.5} />
              {cart.length > 0 && (
                <div 
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-indigo-600 border-2 border-white bg-white animate-in zoom-in duration-300"
                >
                  {cart.length}
                </div>
              )}
            </button>
          )}
        </div>
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Header;