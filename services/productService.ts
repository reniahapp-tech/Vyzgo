
import { ProductItem } from '../types';

export const DEMO_PRODUCTS: ProductItem[] = [
    {
        id: 'demo_1',
        title: 'Kit Essencial Natura',
        price: 'R$ 149,90',
        description: 'Um kit completo com hidratante, perfume e sabonetes da linha Ekos.',
        imageUrl: 'https://images.unsplash.com/photo-1571781348782-f2a477319905?auto=format&fit=crop&q=80&w=800',
        is_demo: true,
        affiliateUrl: 'https://shopee.com.br/example'
    },
    {
        id: 'demo_2',
        title: 'Smartwatch Ultra 8',
        price: 'R$ 299,00',
        description: 'Relógio inteligente com monitoramento cardíaco, GPS e à prova d\'água.',
        imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=800',
        is_demo: true,
        affiliateUrl: 'https://amazon.com.br/example'
    },
    {
        id: 'demo_3',
        title: 'Tênis Sport Runner',
        price: 'R$ 189,90',
        description: 'Conforto e desempenho para suas corridas diárias.',
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800',
        is_demo: true
    },
    {
        id: 'demo_4',
        title: 'Fones Bluetooth Pro',
        price: 'R$ 129,00',
        description: 'Cancelamento de ruído ativo e 24h de bateria.',
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
        is_demo: true
    },
    {
        id: 'demo_5',
        title: 'Garrafa Térmica 1L',
        price: 'R$ 59,90',
        description: 'Mantém sua bebida gelada por 12 horas ou quente por 6 horas.',
        imageUrl: 'https://images.unsplash.com/photo-1602143407151-011141951e60?auto=format&fit=crop&q=80&w=800',
        is_demo: true
    },
    {
        id: 'demo_6',
        title: 'Curso Marketing Digital',
        price: 'R$ 49,90',
        description: 'Aprenda a vender na internet do zero ao avançado. E-book completo.',
        imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800',
        is_demo: true,
        affiliateUrl: 'https://hotmart.com/example'
    }
];

export const ProductService = {
    getDemoProducts: () => DEMO_PRODUCTS,

    // Helpers to manage local products (mocking database)
    filterDemoProducts: (products: ProductItem[]) => products.filter(p => p.is_demo),

    removeDemoProducts: (products: ProductItem[]) => products.filter(p => !p.is_demo),

    hasDemoProducts: (products: ProductItem[]) => products.some(p => p.is_demo)
};
