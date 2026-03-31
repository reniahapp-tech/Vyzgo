import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';
import ImageWithFallback from './ImageWithFallback';
import { ProductItem } from '../types';

const FeaturedCarousel: React.FC = () => {
  const { config, navigateProduct } = useConfig();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Collect all products from all categories
  const allProducts: ProductItem[] = config.categories.flatMap(cat => cat.products);
  
  // Filter by featured IDs or just take the first 5 if not specified
  const featuredProducts = config.featuredProductIds 
    ? allProducts.filter(p => config.featuredProductIds?.includes(p.id))
    : allProducts.slice(0, 5);

  if (featuredProducts.length === 0) return null;

  return (
    <div className="relative group/parent">
      <div 
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-6 -mx-6 px-6"
      >
        {featuredProducts.map((product) => (
          <div 
            key={product.id}
            className="min-w-[280px] md:min-w-[340px] snap-center bg-white rounded-[2rem] overflow-hidden shadow-2xl shadow-gray-200/40 hover:shadow-indigo-100 transition-all cursor-pointer group/card border border-gray-50 active:scale-[0.98]"
            onClick={() => navigateProduct(product.id, '')}
          >
            <div className="aspect-[4/5] relative overflow-hidden">
              <ImageWithFallback 
                src={product.imageUrl} 
                alt={product.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
              
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg">
                <p className="text-sm font-black text-indigo-600">{product.price}</p>
              </div>
            </div>
            <div className="p-6 bg-white">
              <h4 className="font-black text-gray-900 text-lg leading-tight uppercase tracking-tighter group-hover/card:text-indigo-600 transition-colors">{product.title}</h4>
              <p className="text-[11px] font-bold text-gray-400 mt-1 uppercase tracking-widest">Veja detalhes <span className="text-indigo-300">→</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedCarousel;
