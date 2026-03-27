/**
 * ============================================================
 *  VITRINE APP — PLUGIN EXEMPLO
 *  Arquivo: plugins/loyalty/index.tsx
 * ============================================================
 *
 * PLUGIN: Programa de Fidelidade (Pontos)
 *
 * Funcionalidades:
 *   - Acumula pontos a cada pedido finalizado
 *   - Mostra pontos disponíveis no carrinho
 *   - Admin pode configurar taxa de conversão (R$ → pontos)
 *
 * Hooks usados: onOrderCreated
 * Slots de UI: CartExtra, ProductExtra
 */

import React from 'react';
import { VitrinePlugin, PluginConfig } from '../types';
import { Order, ProductItem } from '../../types';

// ── Chave de storage para os pontos do cliente ───────────────
const POINTS_KEY = 'vitrine_loyalty_points';

const getPoints = (): number => {
  try { return parseInt(localStorage.getItem(POINTS_KEY) || '0', 10); } catch { return 0; }
};

const addPoints = (pts: number) => {
  try { localStorage.setItem(POINTS_KEY, String(getPoints() + pts)); } catch {}
};

// ── Componente: exibido no carrinho ──────────────────────────
const CartExtraComponent: React.FC = () => {
  const pts = getPoints();
  return (
    <div className="flex items-center gap-2 mt-2 px-3 py-2 bg-yellow-50 border border-yellow-100 rounded-xl text-xs">
      <span className="text-lg">⭐</span>
      <span className="text-yellow-800 font-medium">
        Você tem <strong>{pts} pontos</strong> acumulados.
        {pts >= 100 && <span className="ml-1 text-green-700 font-bold">Resgate no próximo pedido!</span>}
      </span>
    </div>
  );
};

// ── Componente: exibido abaixo da descrição do produto ───────
const ProductExtraComponent: React.FC<{ product: ProductItem }> = ({ product }) => {
  const rate = 10; // pontos por real — padrão
  const priceNum = parseFloat(
    (product.price || '0').replace('R$', '').replace('.', '').replace(',', '.').trim()
  );
  if (!priceNum) return null;
  const pts = Math.floor(priceNum * rate);
  return (
    <div className="flex items-center gap-2 mt-1 px-3 py-1.5 bg-yellow-50 border border-yellow-100 rounded-lg text-xs inline-flex">
      <span>⭐</span>
      <span className="text-yellow-800 font-medium">Ganhe <strong>{pts} pontos</strong> com esta compra</span>
    </div>
  );
};

// ── Componente: aba no Admin ─────────────────────────────────
const AdminTabComponent: React.FC<{
  config: PluginConfig;
  onConfigChange: (key: string, value: string | number | boolean) => void;
}> = ({ config, onConfigChange }) => {
  const pts = getPoints();

  return (
    <div className="space-y-4">
      <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4">
        <h3 className="text-xs font-bold text-yellow-800 uppercase mb-3 flex items-center gap-2">
          ⭐ Programa de Fidelidade
        </h3>
        <p className="text-xs text-yellow-700 mb-4">
          Clientes acumulam pontos a cada compra. Configure a taxa de conversão abaixo.
        </p>

        {/* Taxa de conversão */}
        <div className="mb-3">
          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
            Pontos por R$ 1,00 gasto
          </label>
          <input
            type="number"
            min={1}
            max={100}
            value={(config.pointsPerReal as number) ?? 10}
            onChange={e => onConfigChange('pointsPerReal', Number(e.target.value))}
            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-yellow-300"
          />
          <p className="text-[10px] text-gray-400 mt-1">
            Padrão: 10 pontos por R$ 1,00
          </p>
        </div>

        {/* Limite de resgate */}
        <div className="mb-3">
          <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
            Mínimo para resgate (pontos)
          </label>
          <input
            type="number"
            min={1}
            value={(config.minRedemption as number) ?? 100}
            onChange={e => onConfigChange('minRedemption', Number(e.target.value))}
            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-yellow-300"
          />
        </div>
      </div>

      {/* Stats — pontos do cliente atual */}
      <div className="bg-white/50 border border-white/60 rounded-xl p-4">
        <h4 className="text-[10px] font-bold text-gray-500 uppercase mb-3">Simulação — Sessão Atual</h4>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">Pontos acumulados (este navegador):</span>
          <span className="text-xl font-bold text-yellow-600">{pts} ⭐</span>
        </div>
        <button
          onClick={() => {
            try { localStorage.setItem(POINTS_KEY, '0'); } catch {}
            window.location.reload();
          }}
          className="mt-3 w-full text-[10px] text-red-400 hover:text-red-600 font-bold py-1"
        >
          Resetar pontos (teste)
        </button>
      </div>
    </div>
  );
};

// ── Definição completa do plugin ─────────────────────────────
export const LoyaltyPlugin: VitrinePlugin = {
  id: 'loyalty_points',
  name: 'Programa de Fidelidade',
  version: '1.0.0',
  description: 'Clientes acumulam pontos a cada compra e podem resgatar descontos.',
  icon: '⭐',
  author: 'Vitrine App',

  defaultConfig: {
    pointsPerReal: 10,
    minRedemption: 100,
  },

  AdminTab: AdminTabComponent,

  ui: {
    CartExtra: CartExtraComponent,
    ProductExtra: ProductExtraComponent,
  },

  hooks: {
    onOrderCreated: (order: Order) => {
      // Calcula pontos com base no total do pedido
      const rate = 10; // poderia vir do config; simplificado aqui
      const earned = Math.floor(order.total * rate);
      addPoints(earned);
      console.log(`[LoyaltyPlugin] +${earned} pontos adicionados. Total: ${getPoints()}`);
    },
  },
};
