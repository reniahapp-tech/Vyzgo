import { LucideIcon } from 'lucide-react';

export interface ProductVariant {
  id: string;
  label: string;    // ex: 'Azul M', 'Vermelho G'
  price?: string;   // preço override (opcional)
  priceValue?: number;
  stock?: number | null;
}

export interface ProductItem {
  id: string;
  title: string;
  price: string;
  priceValue?: number;
  description: string;
  imageUrl: string;
  imageUrls?: string[];       // galeria: imagens adicionais
  affiliateUrl?: string;
  is_demo?: boolean;
  stock?: number | null;
  variants?: ProductVariant[]; // variantes de cor/tamanho/etc
}

export type PaymentMethod = 'credit_card' | 'pix' | 'money';
export type PaymentStatus = 'pending' | 'paid' | 'failed';
export type DeliveryType = 'delivery' | 'pickup';
export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'cancelled';

export interface PedidoOnline {
  id: string;
  items: CartItem[];
  total: number;
  customer: {
    name: string;
    phone: string;
    address: string;
  };
  payment: {
    method: PaymentMethod;
    status: PaymentStatus;
    transactionId?: string;
  };
  createdAt: string;
}

export interface CheckoutData {
  customerName: string;
  customerPhone: string;
  deliveryType: DeliveryType;
  address?: string;
}

export interface Order {
  id: string;
  storeId: string;
  items: CartItem[];
  total: number;
  discount?: number;        // valor do desconto aplicado
  couponCode?: string;      // código do cupão usado
  customer: CheckoutData;
  status: OrderStatus;
  createdAt: string;
}

export interface Coupon {
  code: string;             // ex: 'PROMO10'
  type: 'percent' | 'fixed'; // % ou valor fixo
  value: number;            // 10 = 10% ou R$10
  minOrder?: number;        // pedido mínimo para usar
  maxUses?: number;         // null = ilimitado
  usedCount?: number;
  expiresAt?: string;       // ISO date string
  active: boolean;
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


// ViewState removed in favor of React Router


export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export type StoreMode = 'mixed' | 'store' | 'affiliate';

export type PlanType = 'free' | 'pro';

export interface AppConfig {
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
  customDomain?: string; // New: White Label
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