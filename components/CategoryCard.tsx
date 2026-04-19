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
      className="flex flex-col items-center gap-3 cursor-pointer group shrink-0 w-[88px] py-1"
    >
      {/* Gradient ring — Instagram Story style */}
      <div className="relative w-[72px] h-[72px] p-[3px] rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-yellow-400 shadow-md group-hover:shadow-indigo-400/40 transition-all duration-300 group-active:scale-95">
        <div className="w-full h-full rounded-full bg-white p-[2.5px]">
          <div
            className="w-full h-full rounded-full flex items-center justify-center relative overflow-hidden"
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
                size={26}
                strokeWidth={2}
                style={{ color: item.iconColor || theme.primaryColor }}
              />
            )}
          </div>
        </div>
      </div>

      <span className="text-[10px] font-black text-gray-800 uppercase tracking-tight text-center line-clamp-1 w-full leading-none group-hover:text-indigo-600 transition-colors">
        {item.title}
      </span>
    </div>
  );
};

export default CategoryCard;