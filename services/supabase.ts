/**
 * ============================================================
 *  VITRINE APP — SUPABASE CLIENT
 *  Arquivo: services/supabase.ts
 * ============================================================
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Debug log (masked for security)
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ SUPABASE CONFIG MISSING! Check your Environment Variables.');
} else {
  console.log('✅ Supabase initialized for:', supabaseUrl.substring(0, 15) + '...');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ── Auth helpers ──────────────────────────────────────────────

/** Inicia o OAuth do Google. Redireciona para o Google e volta para o app. */
export const signInWithGoogle = async () => {
  try {
    const redirectTo = `${window.location.origin}/auth/callback`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo },
    });
    if (error) throw error;
  } catch (err: any) {
    console.error('Google Auth Error:', err);
    alert('Erro ao iniciar login: ' + (err.message || JSON.stringify(err)));
    throw err;
  }
};

/** Faz logout da sessão atual. */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

/** Retorna o usuário atual da sessão (ou null se não logado). */
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};
