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
      <header className="flex items-center justify-between mb-6 pt-2">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative">
            {header.avatarUrl ? (
               <img 
                 src={header.avatarUrl} 
                 alt="Avatar" 
                 className="w-12 h-12 rounded-full object-cover shadow-sm border-2 border-white"
               />
            ) : (
              <div 
                className="w-12 h-12 rounded-full shadow-sm flex items-center justify-center text-white/20"
                style={{ backgroundColor: theme.secondaryColor }}
              >
              </div>
            )}
            
            {header.showStatus && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          
          <div>
            {header.logoUrl ? (
              <img 
                src={header.logoUrl} 
                alt={header.title} 
                className="h-10 w-auto object-contain mb-1"
              />
            ) : (
              <h1 className="text-xl font-bold tracking-tight leading-none" style={{ color: theme.textColor }}>
                {header.title}
              </h1>
            )}
            
            <span className="text-xs text-gray-500 font-medium block mt-0.5">
              <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-1.5 align-middle"></span>
              {header.subtitle}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          {/* Search Button */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="p-2.5 rounded-xl transition-all active:scale-95 hover:bg-black/5"
            aria-label="Buscar"
          >
            <Search size={24} style={{ color: theme.textColor }} />
          </button>

          {/* Cart Button (Conditional) */}
          {showCart && (
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl transition-all active:scale-95 hover:bg-black/5"
            >
              <ShoppingBag size={24} style={{ color: theme.textColor }} />
              {cart.length > 0 && (
                <div 
                  className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-white"
                  style={{ backgroundColor: theme.accentColor }}
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