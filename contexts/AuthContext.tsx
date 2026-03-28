/**
 * ============================================================
 *  VITRINE APP — AUTH CONTEXT (Supabase Google OAuth)
 *  Arquivo: contexts/AuthContext.tsx
 * ============================================================
 *
 * Gerencia a sessão do usuário (lojista autenticado com Google).
 * Expõe: user, loading, signIn, signOut.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, signInWithGoogle, signOut as supabaseSignOut } from '../services/supabase';
import { StoreService } from '../services/storeService';

// ── Tipos ────────────────────────────────────────────────────
interface AuthContextType {
  signOut: () => Promise<void>;
  isAdmin: boolean;
  hasStore: boolean;
  refreshStoreStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ── Provider ─────────────────────────────────────────────────
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasStore, setHasStore] = useState(false);

  const refreshStoreStatus = async () => {
    if (!user) {
      setHasStore(false);
      return;
    }
    const store = await StoreService.getStoreByOwner(user.id);
    setHasStore(!!store);
  };

  useEffect(() => {
    // Pega a sessão atual ao montar
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Escuta mudanças de sessão (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Sincroniza com sessionStorage para ProtectedSetup
      if (session?.user) {
        sessionStorage.setItem('admin_auth', 'true');
      } else {
        sessionStorage.removeItem('admin_auth');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) refreshStoreStatus();
  }, [user]);

  const signIn = async () => {
    await signInWithGoogle();
  };

  const signOut = async () => {
    await supabaseSignOut();
    sessionStorage.removeItem('admin_auth');
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signOut,
      isAdmin: !!user,
      hasStore,
      refreshStoreStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// ── Hook de acesso ────────────────────────────────────────────
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
