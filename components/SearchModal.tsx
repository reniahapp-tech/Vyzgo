import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronRight } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';
import { ProductItem } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const { config, navigateProduct } = useConfig();
  const { theme } = config;
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ product: ProductItem, categoryId: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const found: { product: ProductItem, categoryId: string }[] = [];

    config.categories.forEach(cat => {
      cat.products.forEach(prod => {
        if (prod.title.toLowerCase().includes(lowerQuery) || prod.description.toLowerCase().includes(lowerQuery)) {
          found.push({ product: prod, categoryId: cat.id });
        }
      });
    });

    setResults(found);
  }, [query, config.categories]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b border-gray-100">
        <div className="flex-1 bg-gray-100 rounded-xl flex items-center px-3 py-3">
          <Search size={20} className="text-gray-400 mr-2" />
          <input 
            ref={inputRef}
            type="text"
            placeholder="Buscar produtos..."
            className="bg-transparent border-none outline-none w-full text-base font-medium text-gray-800 placeholder-gray-400"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 rounded-full bg-gray-200 text-gray-500">
              <X size={12} />
            </button>
          )}
        </div>
        <button 
          onClick={onClose}
          className="p-3 font-bold text-sm"
          style={{ color: theme.primaryColor }}
        >
          Cancelar
        </button>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto p-4">
        {query.trim() === '' ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400 opacity-60">
            <Search size={48} className="mb-4" />
            <p className="text-sm">Digite para buscar...</p>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p>Nenhum produto encontrado para "{query}"</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{results.length} resultados</p>
            {results.map(({ product, categoryId }) => (
              <div 
                key={product.id}
                onClick={() => {
                  navigateProduct(product.id, categoryId);
                  onClose();
                }}
                className="flex gap-4 p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                  <img src={product.imageUrl} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-gray-800 mb-0.5">{product.title}</h4>
                    <span className="text-xs font-bold" style={{ color: theme.primaryColor }}>{product.price}</span>
                  </div>
                  <ChevronRight size={18} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchModal;