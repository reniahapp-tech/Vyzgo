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

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth * 0.8 
        : scrollLeft + clientWidth * 0.8;
      
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group/parent">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
          <ShoppingBag size={20} className="text-indigo-600" />
          Destaques
        </h3>
        <div className="flex gap-2">
          <button 
            onClick={() => scroll('left')}
            className="p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 active:scale-90 transition-all"
          >
            <ChevronLeft size={18} />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="p-2 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 active:scale-90 transition-all"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-4"
        style={{ scrollbarWidth: 'none' }}
      >
        {featuredProducts.map((product) => (
          <div 
            key={product.id}
            className="min-w-[70%] md:min-w-[40%] lg:min-w-[30%] snap-start bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer"
            onClick={() => navigateProduct(product.id, '')}
          >
            <div className="aspect-square relative">
              <ImageWithFallback 
                src={product.imageUrl} 
                alt={product.title} 
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h4 className="font-bold text-gray-900 truncate">{product.title}</h4>
              <p className="text-indigo-600 font-black mt-1">{product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedCarousel;
