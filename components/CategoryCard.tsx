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
      className="flex flex-col items-center gap-2.5 cursor-pointer group shrink-0 w-[76px] py-1"
    >
      <div 
        className="relative w-16 h-16 p-[3px] rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-yellow-500 transition-all duration-300 group-active:scale-95"
      >
        <div className="w-full h-full rounded-full bg-white p-[2px]">
          <div 
            className="w-full h-full rounded-full flex items-center justify-center relative shadow-sm overflow-hidden"
            style={{ backgroundColor: item.bgColor || '#F8F9FA' }}
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
                size={22} 
                strokeWidth={2}
                style={{ color: item.iconColor || theme.primaryColor }} 
              />
            )}
            
            <div className="absolute inset-0 bg-black/5 opacity-20 group-hover:opacity-0 transition-opacity"></div>
          </div>
        </div>
      </div>
      
      <span className="text-[9px] font-black text-gray-900 uppercase tracking-tight text-center line-clamp-1 w-full leading-none group-hover:text-indigo-600 transition-colors">
        {item.title}
      </span>
    </div>
  );
};

export default CategoryCard;