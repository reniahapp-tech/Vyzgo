/**
 * ============================================================
 *  VITRINE APP — AUTH MODAL
 *  Arquivo: components/AuthModal.tsx
 * ============================================================
 */

import React from 'react';
import { X, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useConfig } from '../contexts/ConfigContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signIn, loading } = useAuth();
  const { config } = useConfig();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Content */}
      <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-scale-up">
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <LogIn size={32} />
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-2">Acesso Restrito</h2>
          <p className="text-sm text-gray-500 mb-8 px-4">
            Faça login com sua conta Google para gerenciar sua vitrine digital.
          </p>

          <button
            onClick={() => signIn()}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-6 bg-white border-2 border-gray-100 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 active:scale-[0.98] transition-all shadow-sm group disabled:opacity-50"
          >
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              alt="Google" 
              className="w-5 h-5 group-hover:scale-110 transition-transform"
            />
            {loading ? 'Carregando...' : 'Entrar com Google'}
          </button>

          <button
            onClick={onClose}
            className="mt-6 text-xs text-gray-400 font-medium hover:text-gray-600 transition-colors"
          >
            Voltar para a Vitrine
          </button>
        </div>

        {/* Decor */}
        <div 
          className="h-1.5 w-full" 
          style={{ backgroundColor: config.theme.primaryColor }}
        />
      </div>
    </div>
  );
};

export default AuthModal;
