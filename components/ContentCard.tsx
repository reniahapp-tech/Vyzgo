import React from 'react';
import { useConfig } from '../contexts/ConfigContext';

interface ContentCardProps {
  onClick: () => void;
}

const ContentCard: React.FC<ContentCardProps> = ({ onClick }) => {
  const { config } = useConfig();
  const { quiz } = config;

  return (
    <div 
      onClick={onClick}
      className="rounded-xl2 p-6 md:p-8 relative overflow-hidden group cursor-pointer shadow-sm transition-all hover:shadow-md w-full"
      style={{ backgroundColor: quiz.bgColor }}
    >
      <div className="flex items-center gap-4 md:gap-6 relative z-10">
        {/* Emoji Icon */}
        <div className="text-4xl md:text-5xl filter drop-shadow-md transform group-hover:scale-110 transition-transform duration-300">
          {quiz.emoji}
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2">{quiz.title}</h3>
          <p className="text-white/90 text-sm md:text-base leading-snug">
            {quiz.subtitle}
          </p>
        </div>
        
        <div className="bg-white/20 backdrop-blur-md rounded-full px-3 py-1 md:px-5 md:py-2 text-xs md:text-sm text-white font-bold hover:bg-white/30 transition-colors">
          Jogar
        </div>
      </div>
      
      {/* Subtle shine effect */}
      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-white/10 to-transparent pointer-events-none"></div>
    </div>
  );
};

export default ContentCard;