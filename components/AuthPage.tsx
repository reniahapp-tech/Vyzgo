/**
 * ============================================================
 *  VYZGO — AUTH PAGE
 *  Arquivo: components/AuthPage.tsx
 * ============================================================
 */

import React, { useState } from 'react';
import { LogIn, Mail, Lock, ArrowRight, UserPlus, ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AuthPage: React.FC = () => {
  const { signIn, signInWithEmail, signUpWithEmail, loading } = useAuth();
  const navigate = useNavigate();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setAuthLoading(true);

    try {
      if (isLogin) {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
        alert('Cadastro realizado! Se necessário, verifique seu e-mail para confirmar a conta.');
      }
      // O redirect é feito pelo AuthContext/App.tsx ao detectar o novo usuário
    } catch (err: any) {
      if (err.message === 'Email not confirmed') {
        setError('Por favor, verifique seu e-mail e clique no link de confirmação antes de entrar.');
      } else if (err.message === 'Invalid login credentials') {
        setError('E-mail ou senha incorretos. Verifique suas credenciais.');
      } else {
        setError(err.message || 'Erro ao processar autenticação');
      }
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-6 font-sans">
      <div className="w-full max-w-[450px] bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden border border-gray-100 flex flex-col">
        {/* Header Section */}
        <div className="pt-12 pb-8 px-10 text-center">
          <div className="flex items-center justify-center mx-auto mb-4 transition-transform duration-500 hover:scale-110">
            <img src="/logo-main.png" alt="VyzGo Logo" className="h-20 w-auto object-contain" />
          </div>
        </div>

        {/* Content Section */}
        <div className="px-10 pb-12 flex-grow">
          {/* Tabs */}
          <div className="flex bg-gray-50 p-1.5 rounded-2xl mb-8 border border-gray-100">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${isLogin ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              type="button"
            >
              Entrar
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 rounded-xl font-bold text-sm transition-all ${!isLogin ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
              type="button"
            >
              Criar Conta
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4 mb-8">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">E-mail</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={18} />
                <input 
                  type="email" 
                  placeholder="seu@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl outline-none transition-all font-medium text-gray-800"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Senha</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={18} />
                <input 
                  type="password" 
                  placeholder="********"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:border-black rounded-2xl outline-none transition-all font-medium text-gray-800"
                />
              </div>
            </div>

            {error && <p className="text-xs font-bold text-red-500 bg-red-50 p-3 rounded-xl border border-red-100">{error}</p>}

            <button 
              type="submit"
              disabled={authLoading}
              className="w-full py-4 bg-black text-white rounded-2xl font-black text-lg shadow-2xl shadow-black/10 hover:translate-y-[-2px] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {authLoading ? 'Verificando...' : (isLogin ? 'Acessar Painel' : 'Começar Agora')}
              {!authLoading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          {/* Divider */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest">
              <span className="bg-white px-4 text-gray-400 font-bold uppercase tracking-widest">Ou continue com</span>
            </div>
          </div>

          {/* Social Auth */}
          <button 
            type="button"
            onClick={signIn}
            className="w-full py-4 border-2 border-gray-100 rounded-2xl font-bold text-gray-700 hover:bg-gray-50 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              alt="Google" 
              className="w-5 h-5"
            />
            Login com Google
          </button>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 py-6 px-10 text-center border-t border-gray-100">
          <p className="text-xs text-gray-400 font-medium">
            Ao continuar, você concorda com nossos <br/> 
            <span className="text-gray-600 underline cursor-pointer">Termos de Uso</span> e <span className="text-gray-600 underline cursor-pointer">Privacidade</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
