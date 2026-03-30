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

  const bannerList = banners && banners.length > 0 ? banners : [hero.imageUrl];

  const nextBanner = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % bannerList.length);
  };

  const prevBanner = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + bannerList.length) % bannerList.length);
  };

  return (
    <div 
      onClick={onClick}
      className="relative overflow-hidden rounded-xl2 h-72 md:h-96 group cursor-pointer shadow-lg shadow-gray-200/50 transition-all hover:shadow-xl w-full"
    >
      {/* Background Image with Safety Shield */}
      <div className="absolute inset-0 flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {bannerList.map((src, idx) => (
          <div key={idx} className="min-w-full h-full relative">
            <ImageWithFallback 
              src={src} 
              alt={`${hero.title} ${idx + 1}`} 
              fallbackText="Imagem Indisponível"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
      
      {/* Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>
      
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
      <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 flex flex-col items-start z-10">
        <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] md:text-xs font-bold text-white uppercase tracking-wider mb-2 border border-white/30">
          Destaque {currentIndex + 1}
        </div>
        <h2 className="text-white text-3xl md:text-5xl font-bold mb-1 md:mb-3 leading-tight drop-shadow-sm uppercase italic tracking-tighter">
          {hero.title}
        </h2>
        <p className="text-white/90 text-sm md:text-base font-medium mb-4 md:mb-6 drop-shadow-sm max-w-[80%] md:max-w-[60%]">
          {hero.subtitle}
        </p>
        
        <button 
          className="bg-white px-6 py-3 md:px-8 md:py-4 rounded-full text-sm md:text-base font-black shadow-md hover:scale-105 transition-transform flex items-center gap-1 group-active:scale-95 uppercase tracking-tighter"
          style={{ color: theme.primaryColor }}
        >
          {hero.buttonText} 
          <span className="w-px h-3 bg-gray-300 mx-2"></span>
          <span>{hero.price}</span>
        </button>
      </div>
    </div>
  );
};

export default HeroCard;