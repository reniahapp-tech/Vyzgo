import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';
import ImageWithFallback from './ImageWithFallback';
import { ProductItem } from '../types';

const FeaturedCarousel: React.FC = () => {
  const { config, navigateProduct } = useConfig();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Collect all products from all categories
  const allProducts: ProductItem[] = config.categories.flatMap(cat => cat.products);
  
  // Filter by featured IDs or just take the first 5 if not specified
  const featuredProducts = config.featuredProductIds 
    ? allProducts.filter(p => config.featuredProductIds?.includes(p.id))
    : allProducts.slice(0, 8);

  // Autoplay Logic
  useEffect(() => {
    if (isPaused || featuredProducts.length <= 1) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 10;
        
        if (isAtEnd) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: clientWidth * 0.8, behavior: 'smooth' });
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused, featuredProducts.length]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth * 0.8 : clientWidth * 0.8;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (featuredProducts.length === 0) return null;

  return (
    <div 
      className="relative group/parent"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Navigation Arrows */}
      <button 
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur-xl rounded-full shadow-2xl flex items-center justify-center -ml-6 opacity-0 group-hover/parent:opacity-100 transition-all hover:scale-110 active:scale-90 border border-gray-100 text-gray-800"
      >
        <ChevronLeft size={24} />
      </button>

      <button 
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 backdrop-blur-xl rounded-full shadow-2xl flex items-center justify-center -mr-6 opacity-0 group-hover/parent:opacity-100 transition-all hover:scale-110 active:scale-90 border border-gray-100 text-gray-800"
      >
        <ChevronRight size={24} />
      </button>

      {/* Product List */}
      <div 
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-10 -mx-6 px-6"
        style={{ scrollBehavior: 'smooth' }}
      >
        {featuredProducts.map((product) => (
          <div 
            key={product.id}
            className="min-w-[280px] md:min-w-[400px] snap-center bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-gray-200/40 hover:shadow-indigo-100 transition-all cursor-pointer group/card border border-gray-100 active:scale-[0.98]"
            onClick={() => navigateProduct(product.id, '')}
          >
            <div className="aspect-[4/5] relative overflow-hidden">
              <ImageWithFallback 
                src={product.imageUrl} 
                alt={product.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
              
              <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl">
                <p className="text-base font-black text-indigo-600">{product.price}</p>
              </div>

              {/* Hover Details Overlay */}
              <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100 transition-all duration-500">
                 <button className="w-full py-4 bg-white text-gray-900 rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl">
                    Ver Produto
                 </button>
              </div>
            </div>
            <div className="p-8 bg-white">
              <div className="flex flex-col gap-1">
                <h4 className="font-black text-gray-900 text-xl leading-tight uppercase tracking-tight group-hover/card:text-indigo-600 transition-colors">
                  {product.title}
                </h4>
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Coleção Premium</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedCarousel;
