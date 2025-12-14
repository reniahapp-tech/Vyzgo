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

  // Render as Photo Banner
  if (item.imageUrl) {
    return (
      <div 
        onClick={handleClick}
        className={`
          rounded-xl2 p-5 flex flex-col justify-end min-h-[160px] relative
          transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer
          group overflow-hidden
        `}
        style={{ border: 'none' }}
      >
        <ImageWithFallback 
          src={item.imageUrl} 
          alt={item.title} 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>
        <div className="relative z-10">
          <div className="mb-1 opacity-80">
            <DynamicIcon iconKey={item.iconKey} size={20} strokeWidth={2} style={{ color: '#FFFFFF' }} />
          </div>
          <h3 className="font-bold text-lg leading-tight mb-0.5 text-white shadow-sm">{item.title}</h3>
          <p className="text-xs font-medium leading-snug text-white/80">{item.subtitle}</p>
        </div>
      </div>
    );
  }

  // Render as Standard Icon Card
  return (
    <div 
      onClick={handleClick}
      className={`
        rounded-xl2 p-5 flex flex-col min-h-[160px] relative
        transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer
        group overflow-hidden
      `}
      style={{ 
        backgroundColor: item.bgColor,
        border: item.hasBorder ? '2px solid #F3F4F6' : 'none'
      }}
    >
      <div className="mb-4">
        <DynamicIcon 
          iconKey={item.iconKey} 
          size={32} 
          strokeWidth={1.5}
          className="transition-transform group-hover:scale-110"
          style={{ color: item.iconColor, fill: `${item.iconColor}20` }} 
        />
      </div>
      <div className="mt-auto">
        <h3 className="font-bold text-lg leading-tight mb-1" style={{ color: theme.textColor }}>{item.title}</h3>
        <p className="text-xs font-medium leading-snug text-gray-500 opacity-80">{item.subtitle}</p>
      </div>
    </div>
  );
};

export default CategoryCard;