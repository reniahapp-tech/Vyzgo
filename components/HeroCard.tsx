import React, { useState, useEffect } from 'react';
import { useConfig } from '../contexts/ConfigContext';
import ImageWithFallback from './ImageWithFallback';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BannerItem } from '../types';

interface HeroCardProps {
  onClick: () => void;
}

const HeroCard: React.FC<HeroCardProps> = ({ onClick }) => {
  const { config, navigateCategory } = useConfig();
  const { hero, banners, bannerItems } = config;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Normaliza: usa bannerItems (novo), ou converte banners (legado) ou usa hero.imageUrl como fallback
  const resolvedBanners: BannerItem[] = (() => {
    if (bannerItems && bannerItems.length > 0) return bannerItems;
    if (banners && banners.length > 0) return banners.map(url => ({ imageUrl: url }));
    return [{ imageUrl: hero.imageUrl }];
  })();

  useEffect(() => {
    if (resolvedBanners.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % resolvedBanners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [resolvedBanners.length, isPaused]);

  const next = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev + 1) % resolvedBanners.length);
  };

  const prev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev - 1 + resolvedBanners.length) % resolvedBanners.length);
  };

  const handleBannerClick = () => {
    const current = resolvedBanners[currentIndex];
    if (current.linkUrl) {
      // Se for link de categoria interno
      if (current.linkUrl.startsWith('/category/')) {
        navigateCategory(current.linkUrl.replace('/category/', ''));
      } else if (current.linkUrl.startsWith('http')) {
        window.open(current.linkUrl, '_blank');
      } else {
        onClick();
      }
    } else {
      onClick();
    }
  };

  const isVideo = (url: string) => /\.(mp4|webm|mov|ogg|m4v)$/i.test(url);

  return (
    <div
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Banner slider */}
      <div
        className="relative w-full cursor-pointer"
        style={{ aspectRatio: '16/7' }}
        onClick={handleBannerClick}
      >
        {/* Slides */}
        <div
          className="absolute inset-0 flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {resolvedBanners.map((banner, idx) => (
            <div key={idx} className="min-w-full h-full relative bg-gray-900">
              {isVideo(banner.imageUrl) ? (
                <video
                  src={banner.imageUrl}
                  autoPlay muted loop playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <ImageWithFallback
                  src={banner.imageUrl}
                  alt={banner.label || `Banner ${idx + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
            </div>
          ))}
        </div>

        {/* Gradient overlay – bottom only, subtle */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

        {/* Navigation arrows – always visible on desktop, touch-friendly on mobile */}
        {resolvedBanners.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-11 md:h-11 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full text-white flex items-center justify-center transition-all active:scale-90"
              aria-label="Banner anterior"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-11 md:h-11 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full text-white flex items-center justify-center transition-all active:scale-90"
              aria-label="Próximo banner"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Dots / progress indicator */}
        {resolvedBanners.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
            {resolvedBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={e => { e.stopPropagation(); setCurrentIndex(idx); }}
                className={`rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? 'w-6 h-1.5 bg-white'
                    : 'w-1.5 h-1.5 bg-white/40'
                }`}
              />
            ))}
          </div>
        )}

        {/* Hero text overlay – only shown when no specific link (acts like a "shop now" promo) */}
        {!resolvedBanners[currentIndex]?.linkUrl && (
          <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8 z-10 pointer-events-none">
            <p className="text-white/70 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mb-1">
              {hero.subtitle}
            </p>
            <h2 className="text-white text-xl md:text-4xl font-black leading-tight tracking-tight uppercase drop-shadow-lg">
              {hero.title}
            </h2>
            {hero.price && (
              <div className="mt-2 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-1.5 rounded-full pointer-events-auto cursor-pointer hover:bg-white/30 transition-all">
                <span className="text-white text-xs font-black uppercase tracking-widest">
                  {hero.buttonText}
                </span>
                <span className="text-white/80 text-xs font-bold">•</span>
                <span className="text-white text-xs font-bold">{hero.price}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroCard;