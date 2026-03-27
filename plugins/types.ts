/**
 * ============================================================
 *  VITRINE APP — SISTEMA DE MÓDULOS/PLUGINS
 *  Arquivo: plugins/types.ts
 * ============================================================
 *
 * Este arquivo define o CONTRATO que todo plugin deve seguir.
 * Para criar um novo plugin, implemente a interface VitrinePlugin.
 */

import React from 'react';
import { AppConfig, CartItem, Order, ProductItem } from '../types';

// ── Hooks que o plugin pode escutar ─────────────────────────
export interface PluginHooks {
  /** Chamado quando um item é adicionado ao carrinho */
  onCartItemAdded?: (item: CartItem) => void;
  /** Chamado quando um pedido é finalizado pelo cliente */
  onOrderCreated?: (order: Order) => void;
  /** Chamado quando o cliente visualiza um produto */
  onProductViewed?: (product: ProductItem) => void;
  /** Chamado quando o app é inicializado */
  onAppInit?: (config: AppConfig) => void;
}

// ── Componentes de UI opcionais que o plugin pode injetar ───
export interface PluginUI {
  /**
   * Componente exibido na tela do produto (abaixo da descrição).
   * Ex: badge de cashback, avaliações, etc.
   */
  ProductExtra?: React.ComponentType<{ product: ProductItem }>;

  /**
   * Componente exibido no carrinho (abaixo dos itens).
   * Ex: campo de cupom, pontos a ganhar, etc.
   */
  CartExtra?: React.ComponentType;

  /**
   * Componente exibido no CheckoutModal (antes de confirmar).
   * Ex: seleção de frete, termos de cashback, etc.
   */
  CheckoutExtra?: React.ComponentType;

  /**
   * Widget flutuante exibido em qualquer lugar da home.
   * Ex: chat de suporte, contador de visitantes, etc.
   */
  FloatingWidget?: React.ComponentType;
}

// ── Configurações do plugin armazenadas no Admin ─────────────
export interface PluginConfig {
  [key: string]: string | number | boolean;
}

// ── Interface principal — todo plugin deve implementar isso ──
export interface VitrinePlugin {
  /** Identificador único (snake_case). Ex: 'loyalty_points' */
  id: string;

  /** Nome legível para humanos. Ex: 'Programa de Fidelidade' */
  name: string;

  /** Versão semântica. Ex: '1.0.0' */
  version: string;

  /** Descrição curta do que o plugin faz */
  description: string;

  /** Emoji ou ícone representativo */
  icon: string;

  /** Autor do plugin */
  author?: string;

  /**
   * Componente React para a aba do plugin no Admin Panel.
   * Recebe as configurações salvas e uma função para atualizar.
   */
  AdminTab?: React.ComponentType<{
    config: PluginConfig;
    onConfigChange: (key: string, value: string | number | boolean) => void;
  }>;

  /** Hooks do ciclo de vida do app */
  hooks?: PluginHooks;

  /** Componentes de UI injetados pelo plugin */
  ui?: PluginUI;

  /** Configurações padrão do plugin */
  defaultConfig?: PluginConfig;
}

// ── Estado de um plugin registrado ──────────────────────────
export interface RegisteredPlugin {
  plugin: VitrinePlugin;
  enabled: boolean;
  config: PluginConfig;
}
