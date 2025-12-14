import React from 'react';
import { useConfig } from '../contexts/ConfigContext';
import ImageWithFallback from './ImageWithFallback';

interface HeroCardProps {
  onClick: () => void;
}

const HeroCard: React.FC<HeroCardProps> = ({ onClick }) => {
  const { config } = useConfig();
  const { hero, theme } = config;

  return (
    <div 
      onClick={onClick}
      className="relative overflow-hidden rounded-xl2 h-72 md:h-96 group cursor-pointer shadow-lg shadow-gray-200/50 transition-all hover:shadow-xl w-full"
    >
      {/* Background Image with Safety Shield */}
      <ImageWithFallback 
        src={hero.imageUrl} 
        alt={hero.title} 
        fallbackText="Imagem Indisponível"
        className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-105"
      />
      
      {/* Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 flex flex-col items-start z-10">
        <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] md:text-xs font-bold text-white uppercase tracking-wider mb-2 border border-white/30">
          Oferta Especial
        </div>
        <h2 className="text-white text-3xl md:text-5xl font-bold mb-1 md:mb-3 leading-tight drop-shadow-sm">
          {hero.title}
        </h2>
        <p className="text-white/90 text-sm md:text-lg font-medium mb-4 md:mb-6 drop-shadow-sm max-w-[80%] md:max-w-[60%]">
          {hero.subtitle}
        </p>
        
        <button 
          className="bg-white px-6 py-3 md:px-8 md:py-4 rounded-full text-sm md:text-base font-bold shadow-md hover:bg-gray-50 transition-transform flex items-center gap-1 group-active:scale-95"
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