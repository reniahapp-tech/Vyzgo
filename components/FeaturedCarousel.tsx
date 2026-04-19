import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';
import ImageWithFallback from './ImageWithFallback';
import { ProductItem } from '../types';

const CARD_WIDTH_DESKTOP = 260; // px - compact card
const GAP = 20;
const AUTOPLAY_INTERVAL = 3500;

const FeaturedCarousel: React.FC = () => {
  const { config, navigateProduct } = useConfig();
  const trackRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const animRef = useRef<number | null>(null);
  const speedRef = useRef(0.5); // pixels per frame

  // ── Collect Products ─────────────────────────────────────────────────────
  const allProducts: ProductItem[] = config.categories.flatMap(cat => cat.products);
  const base = config.featuredProductIds
    ? allProducts.filter(p => config.featuredProductIds?.includes(p.id))
    : allProducts;

  // Guarantee at least 7 items by repeating
  const filled: ProductItem[] = base.length === 0
    ? []
    : Array.from({ length: Math.max(7, base.length) }, (_, i) => base[i % base.length]);

  // Triple the list for seamless infinite loop
  const items = [...filled, ...filled, ...filled];
  const loopLength = filled.length * (CARD_WIDTH_DESKTOP + GAP);

  // ── Infinite scroll engine ────────────────────────────────────────────────
  const animate = useCallback(() => {
    if (!isPaused) {
      setOffset(prev => {
        const next = prev + speedRef.current;
        // Reset silently when we've scrolled one full loop
        return next >= loopLength ? next - loopLength : next;
      });
    }
    animRef.current = requestAnimationFrame(animate);
  }, [isPaused, loopLength]);

  useEffect(() => {
    if (filled.length === 0) return;
    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [animate, filled.length]);

  // ── Manual step (arrow buttons) ───────────────────────────────────────────
  const step = (dir: 'left' | 'right') => {
    setOffset(prev => {
      const delta = dir === 'right' ? CARD_WIDTH_DESKTOP + GAP : -(CARD_WIDTH_DESKTOP + GAP);
      let next = prev + delta;
      if (next < 0) next += loopLength;
      if (next >= loopLength) next -= loopLength;
      return next;
    });
  };

  if (filled.length === 0) return null;

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* ── Arrow buttons – same style as Banner (dark semi-transparent) ── */}
      <button
        onClick={() => step('left')}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full text-white flex items-center justify-center transition-all active:scale-90 shadow-lg"
        aria-label="Anterior"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => step('right')}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full text-white flex items-center justify-center transition-all active:scale-90 shadow-lg"
        aria-label="Próximo"
      >
        <ChevronRight size={20} />
      </button>

      {/* ── Clip window — no scrollbar, no overflow ── */}
      <div className="overflow-hidden -mx-4 md:-mx-6 px-4 md:px-6">
        <div
          ref={trackRef}
          className="flex"
          style={{
            gap: `${GAP}px`,
            transform: `translateX(-${offset}px)`,
            willChange: 'transform',
          }}
        >
          {items.map((product, idx) => (
            <div
              key={`${product.id}-${idx}`}
              className="shrink-0 bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl cursor-pointer group/card transition-shadow border border-gray-100 active:scale-[0.98]"
              style={{ width: `${CARD_WIDTH_DESKTOP}px` }}
              onClick={() => navigateProduct(product.id, '')}
            >
              {/* Image */}
              <div className="relative overflow-hidden" style={{ aspectRatio: '3/4' }}>
                <ImageWithFallback
                  src={product.imageUrl}
                  alt={product.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-105"
                />
                {/* Price badge */}
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-md">
                  <p className="text-xs font-black text-indigo-600">{product.price}</p>
                </div>
                {/* Hover CTA */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity flex items-end p-4">
                  <span className="w-full text-center text-white text-[10px] font-black uppercase tracking-widest bg-white/20 backdrop-blur-sm py-2 rounded-full">
                    Ver produto
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="px-4 py-3">
                <h4 className="font-black text-gray-900 text-sm leading-tight truncate group-hover/card:text-indigo-600 transition-colors">
                  {product.title}
                </h4>
                <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Coleção Premium</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedCarousel;
