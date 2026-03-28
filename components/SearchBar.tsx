import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ShoppingBag, ExternalLink } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';
import { ProductItem } from '../types';

const SearchBar: React.FC = () => {
  const { config, navigateProduct, addToCart } = useConfig();
  const { theme, categories } = config;
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Todos os produtos de todas as categorias
  const allProducts: Array<{ product: ProductItem; categoryId: string; categoryTitle: string }> = [];
  categories.forEach(cat => {
    cat.products.forEach(p => {
      allProducts.push({ product: p, categoryId: cat.id, categoryTitle: cat.title });
    });
  });

  const results = query.length < 2 ? [] : allProducts.filter(({ product }) =>
    product.title.toLowerCase().includes(query.toLowerCase()) ||
    product.description.toLowerCase().includes(query.toLowerCase()) ||
    product.price.includes(query)
  ).slice(0, 8);

  useEffect(() => {
    if (query.length >= 2) setIsOpen(true);
    else setIsOpen(false);
  }, [query]);

  // Fechar ao clicar fora
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!(e.target as Element).closest('[data-search-bar]')) setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div data-search-bar="" className="relative w-full max-w-xl mx-auto mb-6">
      {/* Input */}
      <div
        className="flex items-center gap-2 px-4 py-2.5 rounded-2xl shadow-sm border border-white/60 backdrop-blur-sm transition-all"
        style={{ backgroundColor: 'white', borderColor: `${theme.primaryColor}30` }}
      >
        <Search size={16} style={{ color: theme.primaryColor }} className="shrink-0" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Buscar produtos..."
          className="flex-1 bg-transparent outline-none text-sm placeholder-gray-400"
          style={{ color: theme.textColor }}
        />
        {query && (
          <button onClick={() => { setQuery(''); setIsOpen(false); }} className="text-gray-400 hover:text-gray-600">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Dropdown de Resultados */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-fade-in">
          {results.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-gray-400">
              Nenhum produto encontrado para "<strong>{query}</strong>"
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              {results.map(({ product, categoryId, categoryTitle }) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 last:border-0"
                  onClick={() => {
                    navigateProduct(product.id, categoryId);
                    setQuery('');
                    setIsOpen(false);
                  }}
                >
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                    <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 truncate">{product.title}</p>
                    <p className="text-[10px] text-gray-400">{categoryTitle}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm font-bold" style={{ color: theme.primaryColor }}>{product.price}</span>
                    {product.stock === 0 ? (
                      <span className="text-[9px] bg-red-50 text-red-400 px-1.5 py-0.5 rounded-full font-bold">Esgotado</span>
                    ) : product.affiliateUrl ? (
                      <ExternalLink size={14} className="text-gray-400" />
                    ) : (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          addToCart({ productId: product.id, title: product.title, price: product.price, imageUrl: product.imageUrl, quantity: 1 });
                          setIsOpen(false);
                        }}
                        className="p-1.5 rounded-full text-white transition-colors"
                        style={{ backgroundColor: theme.accentColor }}
                      >
                        <ShoppingBag size={12} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
            <p className="text-[10px] text-gray-400 text-center">
              {results.length} resultado{results.length !== 1 ? 's' : ''} • pressione ESC para fechar
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
