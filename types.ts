import { LucideIcon } from 'lucide-react';

export interface ProductItem {
  id: string;
  title: string;
  price: string;
  description: string;
  imageUrl: string;
  affiliateUrl?: string;
}

export interface CategoryItem {
  id: string;
  title: string;
  subtitle: string;
  iconKey: string;
  bgColor: string;
  iconColor: string;
  hasBorder?: boolean;
  imageUrl?: string;
  products: ProductItem[]; 
}

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  price: string;
  priceValue: number;
  imageUrl: string;
  quantity: number;
}

export type ViewState = 
  | { type: 'HOME' }
  | { type: 'CATEGORY', categoryId: string }
  | { type: 'PRODUCT', productId: string, fromCategoryId: string };

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export type StoreMode = 'mixed' | 'store' | 'affiliate';

export type PlanType = 'free' | 'pro';

export interface AppConfig {
  adminPin: string;
  storeMode: StoreMode; 
  enableWhatsapp: boolean;
  plan: PlanType;
  footerText: string; // New Field
  theme: {
    backgroundColor: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    textColor: string;
  };
  header: {
    title: string;
    subtitle: string;
    logoUrl?: string;
    avatarUrl: string;
    showStatus: boolean;
  };
  hero: {
    title: string;
    subtitle: string;
    description: string;
    price: string;
    buttonText: string;
    imageUrl: string;
  };
  categories: CategoryItem[];
  quiz: {
    title: string;
    subtitle: string;
    emoji: string;
    bgColor: string;
  };
  whatsapp: {
    label: string;
    phoneNumber: string;
  };
  // NEW FIELDS
  location: {
    enabled: boolean;
    address: string;
    mapUrl: string; // Embed URL
  };
  social: {
    instagram: string;
    facebook: string;
    tiktok: string;
  };
}