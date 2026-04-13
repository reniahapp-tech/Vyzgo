-- Migration: 20260331_add_asaas_columns.sql
-- Adiciona suporte para assinaturas e monetização via Asaas

ALTER TABLE stores 
ADD COLUMN IF NOT EXISTS asaas_customer_id TEXT,
ADD COLUMN IF NOT EXISTS asaas_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'trialing',
ADD COLUMN IF NOT EXISTS is_pro BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS plan_type TEXT DEFAULT 'free';

-- Criar índice para busca rápida por asaas_customer_id (usado no webhook)
CREATE INDEX IF NOT EXISTS idx_stores_asaas_customer_id ON stores(asaas_customer_id);
