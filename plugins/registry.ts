/**
 * ============================================================
 *  VYZGO — SISTEMA DE MÓDULOS/PLUGINS
 *  Arquivo: plugins/registry.ts
 * ============================================================
 *
 * REGISTRO CENTRAL DE PLUGINS
 *
 * Para adicionar um novo plugin ao app:
 *   1. Crie o plugin em plugins/<nome>/index.tsx
 *   2. Importe e adicione ao array REGISTERED_PLUGINS abaixo
 *   3. Pronto! O plugin aparecerá automaticamente no Admin.
 *
 * Não é necessário modificar nenhum outro arquivo.
 */

import { VitrinePlugin } from './types';

// ── Importe aqui seus plugins ────────────────────────────────
import { LoyaltyPlugin } from './loyalty';
// import { CouponsPlugin } from './coupons';        // exemplo futuro
// import { NewsletterPlugin } from './newsletter';  // exemplo futuro
// import { MercadoPagoPlugin } from './mercadopago'; // exemplo futuro

// ── Lista de todos os plugins disponíveis no app ─────────────
export const REGISTERED_PLUGINS: VitrinePlugin[] = [
  LoyaltyPlugin,
  // CouponsPlugin,
  // NewsletterPlugin,
];
