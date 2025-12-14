import React from 'react';
import { 
  Droplet, Coffee, Pill, Package, Leaf, Sun, Moon, 
  Heart, Star, Zap, ShoppingBag, Truck, Gift, MapPin,
  Instagram, Facebook, Twitter, Smartphone
} from 'lucide-react';

const iconMap: Record<string, any> = {
  Droplet, Coffee, Pill, Package, Leaf, Sun, Moon, 
  Heart, Star, Zap, ShoppingBag, Truck, Gift, MapPin,
  Instagram, Facebook, Twitter, Smartphone
};

export const getIconComponent = (key: string) => {
  return iconMap[key] || Leaf;
};

export const availableIcons = Object.keys(iconMap);

interface DynamicIconProps {
  iconKey: string;
  size?: number;
  className?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ iconKey, ...props }) => {
  const IconComponent = getIconComponent(iconKey);
  return <IconComponent {...props} />;
};