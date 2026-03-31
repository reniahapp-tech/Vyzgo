-- Migration: 20260331_add_stripe_columns.sql
-- Adiciona suporte para assinaturas e monetização via Stripe

ALTER TABLE stores 
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'trialing',
ADD COLUMN IF NOT EXISTS is_pro BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS plan_type TEXT DEFAULT 'free';

-- Criar índice para busca rápida por customer_id (usado no webhook)
CREATE INDEX IF NOT EXISTS idx_stores_stripe_customer_id ON stores(stripe_customer_id);
