import React, { useState } from 'react';
import { ShoppingBag, Search } from 'lucide-react';
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
      <header className="sticky top-0 z-[50] bg-white/70 backdrop-blur-xl border-b border-gray-100 flex items-center justify-between px-6 py-4 -mx-6 mb-6">
        <div className="flex items-center gap-3">
          {header.logoUrl ? (
            <img 
              src={header.logoUrl} 
              alt={header.title} 
              className="h-9 w-auto object-contain transition-transform active:scale-95"
            />
          ) : (
             <div className="flex flex-col">
                <h1 className="text-lg font-black tracking-tight leading-none text-gray-900">
                  {header.title}
                </h1>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight mt-0.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 align-middle"></span>
                  {header.subtitle}
                </span>
             </div>
          )}
        </div>

        <div className="flex gap-1">
          {/* Search Button */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="p-2.5 rounded-2xl transition-all active:scale-90 hover:bg-black/5 text-gray-800"
            aria-label="Buscar"
          >
            <Search size={22} strokeWidth={2.5} />
          </button>

          {/* Cart Button (Conditional) */}
          {showCart && (
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-2xl transition-all active:scale-90 hover:bg-black/5 text-gray-800"
            >
              <ShoppingBag size={22} strokeWidth={2.5} />
              {cart.length > 0 && (
                <div 
                  className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black text-white border border-white bg-indigo-600 animate-in zoom-in duration-300"
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