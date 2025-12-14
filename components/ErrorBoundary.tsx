import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, MessageCircle } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#FDFBF7]">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <AlertTriangle size={32} />
            </div>
            
            <h1 className="text-xl font-bold text-gray-800 mb-2">
              Ops! Algo deu errado.
            </h1>
            
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Não se preocupe, é apenas um soluço técnico. Tente recarregar a página.
            </p>

            <div className="space-y-3">
              <button 
                onClick={this.handleReload}
                className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-black transition-colors"
              >
                <RefreshCw size={18} />
                Recarregar Aplicativo
              </button>

              <a 
                href="https://wa.me/5511999999999" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-green-50 text-green-700 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-green-100 transition-colors"
              >
                <MessageCircle size={18} />
                Falar com Suporte
              </a>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-[10px] text-gray-400 font-mono">
                Erro: {this.state.error?.message || "Unknown Error"}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;