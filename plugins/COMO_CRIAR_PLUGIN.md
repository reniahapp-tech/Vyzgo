# 🔌 Como Criar um Módulo para o Vitrine App

Este guia explica como criar um novo módulo/plugin do zero e adicioná-lo ao app.

---

## 1. Crie a pasta do plugin

```
plugins/
  meu-plugin/
    index.tsx      ← arquivo principal do plugin
```

---

## 2. Escreva o plugin (copie este template)

```tsx
// plugins/meu-plugin/index.tsx
import React from 'react';
import { VitrinePlugin } from '../types';

export const MeuPlugin: VitrinePlugin = {
  // ── Identidade ────────────────────────────────────────────
  id: 'meu_plugin',              // snake_case, único
  name: 'Meu Plugin',
  version: '1.0.0',
  description: 'Descrição curta do que o plugin faz.',
  icon: '🎯',
  author: 'Seu Nome',

  // ── Configurações padrão (opcionais) ──────────────────────
  defaultConfig: {
    minhaOpcao: 'valor padrão',
    meuNumero: 42,
  },

  // ── Aba de configuração no Admin (opcional) ───────────────
  AdminTab: ({ config, onConfigChange }) => (
    <div className="space-y-3 p-2">
      <label className="block text-xs text-gray-600">
        Minha Opção
        <input
          value={config.minhaOpcao as string}
          onChange={e => onConfigChange('minhaOpcao', e.target.value)}
          className="w-full mt-1 px-3 py-2 rounded-xl border border-gray-200 text-sm outline-none"
        />
      </label>
    </div>
  ),

  // ── Hooks do ciclo de vida (opcional) ─────────────────────
  hooks: {
    // Chamado quando cliente adiciona ao carrinho
    onCartItemAdded: (item) => {
      console.log('Item adicionado:', item.title);
    },

    // Chamado quando pedido é finalizado
    onOrderCreated: (order) => {
      console.log('Pedido criado! Total:', order.total);
      // Aqui: salvar em banco, enviar email, etc.
    },

    // Chamado quando produto é visualizado
    onProductViewed: (product) => {
      console.log('Produto visto:', product.title);
    },
  },

  // ── Componentes de UI injetados na vitrine (opcional) ─────
  ui: {
    // Aparece abaixo da descrição do produto
    ProductExtra: ({ product }) => (
      <div className="p-2 bg-blue-50 rounded-xl text-xs text-blue-700">
        🎯 Meu componente em {product.title}
      </div>
    ),

    // Aparece no modal do carrinho
    CartExtra: () => (
      <div className="p-2 bg-blue-50 rounded-xl text-xs text-blue-700">
        🎯 Meu componente no carrinho
      </div>
    ),

    // Widget flutuante na home
    FloatingWidget: () => (
      <div className="fixed bottom-24 left-4 bg-white shadow-xl rounded-full p-3 z-50">
        🎯
      </div>
    ),
  },
};
```

---

## 3. Registre o plugin

Abra `plugins/registry.ts` e adicione:

```ts
import { MeuPlugin } from './meu-plugin';

export const REGISTERED_PLUGINS: VitrinePlugin[] = [
  LoyaltyPlugin,
  MeuPlugin,   // ← adicione aqui
];
```

**Só isso!** O plugin aparecerá automaticamente na aba **Módulos** do Admin.

---

## 4. Ative o plugin

Abra o Admin Panel → aba **Módulos** → toggle ON no seu plugin.

---

## Slots de UI disponíveis

| Slot | Onde aparece |
|------|-------------|
| `ProductExtra` | Abaixo da descrição do produto |
| `CartExtra` | Dentro do modal de sacola |
| `CheckoutExtra` | Antes da confirmação do pedido |
| `FloatingWidget` | Widget flutuante em qualquer tela |

## Hooks disponíveis

| Hook | Quando é chamado |
|------|-----------------|
| `onAppInit` | App inicializado |
| `onProductViewed` | Cliente abre página do produto |
| `onCartItemAdded` | Cliente adiciona ao carrinho |
| `onOrderCreated` | Cliente finaliza pedido |

---

## Exemplos de Módulos Futuros

| Ideia | Hook/Slot principal |
|-------|---------------------|
| Cupons de desconto | `CartExtra` + `onOrderCreated` |
| Newsletter | `CheckoutExtra` |
| Avaliações de produtos | `ProductExtra` |
| Chat ao vivo | `FloatingWidget` |
| Integração Mercado Pago | `onOrderCreated` |
| Rastreamento de pixels | `onProductViewed` + `onOrderCreated` |
| Agendamento | `ProductExtra` (substituir carrinho) |
