/**
 * ============================================================
 *  VITRINE APP — STORE SERVICE (SUPABASE)
 *  Arquivo: services/storeService.ts
 * ============================================================
 */

import { supabase } from './supabase';
import { AppConfig } from '../types';

export interface StoreData {
  id: string;
  owner_id: string;
  slug: string;
  custom_domain?: string;
  config: AppConfig;
  is_active: boolean;
  created_at?: string;
}

export const StoreService = {
  /**
   * Busca os dados de uma loja pelo slug (subdomínio) ou domínio customizado
   */
  async getStoreByHostname(hostname: string): Promise<StoreData | null> {
    // 1. Tenta buscar por domínio customizado exato
    let { data, error } = await supabase
      .from('stores')
      .select('*')
      .eq('custom_domain', hostname)
      .eq('is_active', true)
      .single();

    if (data) return data;

    // 2. Se não achou, tenta extrair o slug do subdomínio
    // Ex: loja1.vitrine.com -> slug = loja1
    const parts = hostname.split('.');
    if (parts.length >= 2) {
      const slug = parts[0];
      if (slug !== 'www') {
        const { data: slugData } = await supabase
          .from('stores')
          .select('*')
          .eq('slug', slug)
          .eq('is_active', true)
          .single();
        
        if (slugData) return slugData;
      }
    }

    return null;
  },

  /**
   * Busca a loja de um proprietário específico (usado no Admin)
   */
  async getStoreByOwner(ownerId: string): Promise<StoreData | null> {
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .eq('owner_id', ownerId)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Erro ao buscar loja do dono:', error);
    }
    
    return data;
  },

  /**
   * Cria ou atualiza os dados de uma loja
   */
  async saveStore(store: Partial<StoreData>): Promise<StoreData | null> {
    const { data, error } = await supabase
      .from('stores')
      .upsert(store)
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao salvar loja:', error);
      throw error;
    }
    
    return data;
  },

  /**
   * Verifica se um slug está disponível
   */
  async isSlugAvailable(slug: string, excludeId?: string): Promise<boolean> {
    let query = supabase
      .from('stores')
      .select('id')
      .eq('slug', slug);
    
    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data } = await query;
    return !data || data.length === 0;
  }
};
