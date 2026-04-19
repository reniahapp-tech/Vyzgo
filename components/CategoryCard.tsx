import React from 'react';
import { CategoryItem } from '../types';
import { DynamicIcon } from './IconMapper';
import { useConfig } from '../contexts/ConfigContext';
import ImageWithFallback from './ImageWithFallback';

interface CategoryCardProps {
  item: CategoryItem;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ item }) => {
  const { config, navigateCategory, setIsTrackingOpen, setIsLocationOpen } = useConfig();
  const { theme } = config;

  const handleClick = () => {
    if (item.id === 'tracking') {
      setIsTrackingOpen(true);
    } else if (item.id === 'location') {
      setIsLocationOpen(true);
    } else {
      navigateCategory(item.id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="relative group shrink-0 w-[140px] h-[180px] rounded-[32px] overflow-hidden cursor-pointer shadow-xl hover:shadow-indigo-500/20 transition-all duration-500 active:scale-95"
    >
      {/* Background Image/Color */}
      <div className="absolute inset-0 z-0">
        {item.imageUrl ? (
          <>
            <ImageWithFallback
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:bg-black/40 transition-colors duration-500" />
          </>
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center group-hover:scale-110 transition-transform duration-700"
            style={{ backgroundColor: item.bgColor || '#F8F9FA' }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-40" />
            <DynamicIcon
              iconKey={item.iconKey}
              size={40}
              strokeWidth={1.5}
              style={{ color: item.iconColor || theme.primaryColor }}
              className="relative z-10"
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="absolute inset-0 z-10 p-5 flex flex-col justify-end">
        <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
           <span className="block text-[8px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-1 opacity-0 group-hover:opacity-100 transition-opacity">Ver Estilo</span>
           <h3 className="text-sm font-black text-white uppercase tracking-tighter leading-none italic">
             {item.title}
           </h3>
           <div className="h-0.5 w-0 group-hover:w-8 bg-indigo-500 mt-2 transition-all duration-500 rounded-full"></div>
        </div>
      </div>

      {/* Glass Border Effect */}
      <div className="absolute inset-0 border border-white/10 rounded-[32px] pointer-events-none group-hover:border-white/20 transition-colors" />
    </div>
  );
};

export default CategoryCard;