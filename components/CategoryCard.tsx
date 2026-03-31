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
      className="flex flex-col items-center gap-2 cursor-pointer group shrink-0 w-20 pt-1"
    >
      <div 
        className="w-16 h-16 rounded-full flex items-center justify-center relative transition-all duration-300 active:scale-90 border-2 border-white shadow-md group-hover:shadow-lg overflow-hidden"
        style={{ backgroundColor: item.bgColor || '#F3F4F6' }}
      >
        {item.imageUrl ? (
          <ImageWithFallback 
            src={item.imageUrl} 
            alt={item.title} 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <DynamicIcon 
            iconKey={item.iconKey} 
            size={24} 
            strokeWidth={2.5}
            style={{ color: item.iconColor || theme.primaryColor }} 
          />
        )}
        
        {/* Subtle gradient overlay for image categories */}
        {item.imageUrl && <div className="absolute inset-0 bg-black/5 opacity-20 group-hover:opacity-0 transition-opacity"></div>}
      </div>
      
      <span className="text-[10px] font-black text-gray-700 uppercase tracking-tighter text-center line-clamp-1 w-full leading-none px-1">
        {item.title}
      </span>
    </div>
  );
};

export default CategoryCard;