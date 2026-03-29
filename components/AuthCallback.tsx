/**
 * ============================================================
 *  VITRINE APP — AUTH CALLBACK
 *  Arquivo: components/AuthCallback.tsx
 * ============================================================
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { hasStore, loading } = useAuth();

  useEffect(() => {
    // Escuta a mudança de estado, mas como o AuthProvider já cuida do carregamento, 
    // podemos agir quando o loading do Auth terminar.
    if (!loading) {
      if (!hasStore) {
        navigate('/setup');
      } else {
        navigate('/');
      }
    }
  }, [loading, hasStore, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500 font-medium">Autenticando...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
