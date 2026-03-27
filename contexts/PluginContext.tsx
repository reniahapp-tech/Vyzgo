/**
 * ============================================================
 *  VITRINE APP — SISTEMA DE MÓDULOS/PLUGINS
 *  Arquivo: contexts/PluginContext.tsx
 * ============================================================
 *
 * Context React que gerencia o estado de todos os plugins:
 * - Carrega plugins do registro central
 * - Persiste quais estão ativos e suas configurações no localStorage
 * - Expõe hooks de ciclo de vida para o app chamar
 * - Expõe componentes de UI para injeção nos slots
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { REGISTERED_PLUGINS } from '../plugins/registry';
import { RegisteredPlugin, PluginConfig } from '../plugins/types';
import { CartItem, Order, ProductItem, AppConfig } from '../types';

// ── Tipos do contexto ────────────────────────────────────────
interface PluginContextType {
  plugins: RegisteredPlugin[];
  enablePlugin: (id: string) => void;
  disablePlugin: (id: string) => void;
  updatePluginConfig: (id: string, key: string, value: string | number | boolean) => void;

  // Hooks do ciclo de vida — o app chama esses em momentos chave
  callHook: {
    onCartItemAdded: (item: CartItem) => void;
    onOrderCreated: (order: Order) => void;
    onProductViewed: (product: ProductItem) => void;
    onAppInit: (config: AppConfig) => void;
  };
}

const PluginContext = createContext<PluginContextType | undefined>(undefined);

const STORAGE_KEY = 'vitrine_plugins_state_v1';

// ── Carrega estado salvo do localStorage ─────────────────────
const loadSavedState = (): Record<string, { enabled: boolean; config: PluginConfig }> => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch { return {}; }
};

// ── Provider ─────────────────────────────────────────────────
export const PluginProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [plugins, setPlugins] = useState<RegisteredPlugin[]>(() => {
    const saved = loadSavedState();
    return REGISTERED_PLUGINS.map(plugin => ({
      plugin,
      enabled: saved[plugin.id]?.enabled ?? false, // desativado por padrão
      config: { ...plugin.defaultConfig, ...saved[plugin.id]?.config }
    }));
  });

  // Persiste toda vez que muda
  const persist = (updated: RegisteredPlugin[]) => {
    const toSave: Record<string, { enabled: boolean; config: PluginConfig }> = {};
    updated.forEach(r => { toSave[r.plugin.id] = { enabled: r.enabled, config: r.config }; });
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave)); } catch {}
  };

  const enablePlugin = useCallback((id: string) => {
    setPlugins(prev => {
      const updated = prev.map(r => r.plugin.id === id ? { ...r, enabled: true } : r);
      persist(updated);
      return updated;
    });
  }, []);

  const disablePlugin = useCallback((id: string) => {
    setPlugins(prev => {
      const updated = prev.map(r => r.plugin.id === id ? { ...r, enabled: false } : r);
      persist(updated);
      return updated;
    });
  }, []);

  const updatePluginConfig = useCallback((id: string, key: string, value: string | number | boolean) => {
    setPlugins(prev => {
      const updated = prev.map(r =>
        r.plugin.id === id
          ? { ...r, config: { ...r.config, [key]: value } }
          : r
      );
      persist(updated);
      return updated;
    });
  }, []);

  // ── Executores de hooks — chamam todos os plugins ativos que têm o hook
  const callHook = {
    onCartItemAdded: (item: CartItem) =>
      plugins.filter(r => r.enabled && r.plugin.hooks?.onCartItemAdded)
             .forEach(r => r.plugin.hooks!.onCartItemAdded!(item)),

    onOrderCreated: (order: Order) =>
      plugins.filter(r => r.enabled && r.plugin.hooks?.onOrderCreated)
             .forEach(r => r.plugin.hooks!.onOrderCreated!(order)),

    onProductViewed: (product: ProductItem) =>
      plugins.filter(r => r.enabled && r.plugin.hooks?.onProductViewed)
             .forEach(r => r.plugin.hooks!.onProductViewed!(product)),

    onAppInit: (config: AppConfig) =>
      plugins.filter(r => r.enabled && r.plugin.hooks?.onAppInit)
             .forEach(r => r.plugin.hooks!.onAppInit!(config)),
  };

  return (
    <PluginContext.Provider value={{ plugins, enablePlugin, disablePlugin, updatePluginConfig, callHook }}>
      {children}
    </PluginContext.Provider>
  );
};

// ── Hook de acesso ────────────────────────────────────────────
export const usePlugins = () => {
  const ctx = useContext(PluginContext);
  if (!ctx) throw new Error('usePlugins must be used inside PluginProvider');
  return ctx;
};

// ── Hook de conveniência: pega componentes UI ativos de um slot ─
export const usePluginSlot = <K extends keyof NonNullable<RegisteredPlugin['plugin']['ui']>>(
  slot: K
): Array<NonNullable<NonNullable<RegisteredPlugin['plugin']['ui']>[K]>> => {
  const { plugins } = usePlugins();
  return plugins
    .filter(r => r.enabled && r.plugin.ui?.[slot])
    .map(r => r.plugin.ui![slot] as NonNullable<NonNullable<RegisteredPlugin['plugin']['ui']>[K]>);
};
