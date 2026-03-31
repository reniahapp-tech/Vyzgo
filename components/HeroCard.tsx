import React, { useState } from 'react';
import { useConfig } from '../contexts/ConfigContext';
import ImageWithFallback from './ImageWithFallback';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroCardProps {
  onClick: () => void;
}

const HeroCard: React.FC<HeroCardProps> = ({ onClick }) => {
  const { config } = useConfig();
  const { hero, theme, banners } = config;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const bannerList = banners && banners.length > 0 ? banners : [hero.imageUrl];

  React.useEffect(() => {
    if (bannerList.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bannerList.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [bannerList.length, isPaused]);

  const nextBanner = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % bannerList.length);
  };

  const prevBanner = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + bannerList.length) % bannerList.length);
  };

  const isVideo = (url: string) => /\.(mp4|webm|mov|ogg|m4v)$/i.test(url);

  return (
    <div 
      onClick={onClick}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative overflow-hidden rounded-3xl h-[400px] md:h-[500px] group cursor-pointer shadow-2xl shadow-indigo-200/20 transition-all hover:scale-[1.01] w-full bg-gray-900"
    >
      {/* Background Media (Image or Video) */}
      <div className="absolute inset-0 flex transition-transform duration-700 cubic-bezier(0.4, 0, 0.2, 1)" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {bannerList.map((src, idx) => (
          <div key={idx} className="min-w-full h-full relative">
            {isVideo(src) ? (
              <video 
                src={src} 
                autoPlay 
                muted 
                loop 
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <ImageWithFallback 
                src={src} 
                alt={`${hero.title} ${idx + 1}`} 
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
          </div>
        ))}
      </div>
      
      {/* Premium Glass Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
      
      {/* Manual Navigation Arrows */}
      {bannerList.length > 1 && (
        <>
          <button 
            onClick={prevBanner}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/20 hover:bg-black/40 transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={nextBanner}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/20 hover:bg-black/40 transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Pagination Dots */}
      {bannerList.length > 1 && (
        <div className="absolute top-6 right-6 z-20 flex gap-1.5">
          {bannerList.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40'}`}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end z-10">
        <div className="animate-in slide-in-from-bottom-4 duration-700 delay-100">
          <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[9px] md:text-xs font-black text-white uppercase tracking-[0.2em] mb-4 border border-white/20 w-fit">
            News & Trends
          </div>
          <h2 className="text-white text-4xl md:text-6xl font-black mb-2 leading-[0.95] tracking-tighter max-w-[90%] uppercase">
            {hero.title}
          </h2>
          <p className="text-white/70 text-sm md:text-lg font-bold mb-8 drop-shadow-sm max-w-[85%] md:max-w-[50%] leading-snug">
            {hero.subtitle}
          </p>
          
          <button 
            className="group/btn bg-white hover:bg-slate-50 text-indigo-900 px-8 py-4 rounded-2xl text-sm md:text-base font-black shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-3 w-fit uppercase tracking-wider"
          >
            {hero.buttonText} 
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
            <span className="opacity-60">{hero.price}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroCard;