import React from 'react';
import { ArrowLeft, ShoppingBag, ExternalLink } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';
import { CategoryItem } from '../types';

interface CategoryViewProps {
  category: CategoryItem;
}

const CategoryView: React.FC<CategoryViewProps> = ({ category }) => {
  const { config, navigateHome, navigateProduct, addToCart } = useConfig();
  const { theme, storeMode } = config;

  return (
    <div className="animate-fade-in">
      {/* Navbar for Page */}
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={navigateHome}
          className="p-2 -ml-2 rounded-full hover:bg-black/5 transition-colors"
          style={{ color: theme.textColor }}
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: theme.textColor }}>
          {category.title}
        </h1>
      </div>

      {/* Banner if exists */}
      {category.imageUrl && (
        <div className="w-full h-40 md:h-64 rounded-2xl overflow-hidden mb-6 md:mb-8 shadow-sm relative group">
           <img src={category.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
           <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
           <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 text-white">
             <p className="text-sm md:text-lg font-medium opacity-90 text-shadow-sm">{category.subtitle}</p>
           </div>
        </div>
      )}

      {/* Product Grid */}
      {category.products.length === 0 ? (
        <div className="text-center py-20 opacity-50">
          <p>Nenhum produto cadastrado nesta categoria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 pb-20">
          {category.products.map((product) => {
            // Logic to determine icon: 
            // Only show External Link icon if mode allows it AND url exists
            const showExternalIcon = (storeMode === 'mixed' || storeMode === 'affiliate') && product.affiliateUrl;

            return (
              <div 
                key={product.id}
                onClick={() => navigateProduct(product.id, category.id)}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group flex flex-col h-full"
              >
                <div className="h-32 md:h-48 bg-gray-100 overflow-hidden relative">
                  <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-3 flex flex-col flex-grow">
                  <h3 className="font-bold text-sm md:text-base mb-1 leading-tight" style={{ color: theme.textColor }}>{product.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-2 flex-grow">{product.description}</p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                    <span className="font-bold text-sm md:text-base" style={{ color: theme.primaryColor }}>{product.price}</span>
                    
                    {/* Action Button: Cart or Link */}
                    {showExternalIcon ? (
                       <button 
                         className="p-2 rounded-full text-white shadow-sm active:scale-95 bg-gray-800 hover:bg-black transition-colors"
                       >
                         <ExternalLink size={14} />
                       </button>
                    ) : (
                       <button 
                         onClick={(e) => {
                           e.stopPropagation();
                           addToCart({
                             productId: product.id,
                             title: product.title,
                             price: product.price,
                             imageUrl: product.imageUrl,
                             quantity: 1
                           });
                         }}
                         className="p-2 rounded-full text-white shadow-sm active:scale-95 transition-transform hover:scale-110"
                         style={{ backgroundColor: theme.accentColor }}
                       >
                         <ShoppingBag size={14} />
                       </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CategoryView;