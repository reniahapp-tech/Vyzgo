import React, { useState } from 'react';
import { X, Search, Truck, Check, Package, MessageCircle } from 'lucide-react';
import { useConfig } from '../contexts/ConfigContext';

const TrackingModal: React.FC = () => {
  const { config, isTrackingOpen, setIsTrackingOpen } = useConfig();
  const { theme, whatsapp } = config;
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'found'>('idle');

  if (!isTrackingOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    
    setStatus('loading');
    // Simulate API delay
    setTimeout(() => {
      setStatus('found');
    }, 1500);
  };

  const encodedMessage = encodeURIComponent(`Olá! Preciso de ajuda para rastrear o pedido com código *${code}*.`);
  const whatsappUrl = `https://wa.me/${whatsapp.phoneNumber}?text=${encodedMessage}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsTrackingOpen(false)}
      ></div>

      {/* Modal */}
      <div 
        className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl animate-slide-up-panel overflow-hidden"
        style={{ backgroundColor: theme.backgroundColor }}
      >
        {/* Close Button */}
        <button 
          onClick={() => setIsTrackingOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 transition-colors"
          style={{ color: theme.textColor }}
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-1" style={{ color: theme.textColor }}>Central de Entregas</h2>
        <p className="text-sm text-gray-500 mb-6">Acompanhe a jornada do seu pedido.</p>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Digite o código (ex: PED-4590)"
              className="w-full bg-white border border-gray-200 rounded-xl py-3.5 pl-4 pr-12 outline-none focus:ring-2 focus:ring-opacity-50 transition-all shadow-sm font-medium uppercase tracking-wider text-sm"
              style={{ focusRingColor: theme.primaryColor }}
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button 
              type="submit"
              className="absolute right-2 top-2 p-1.5 rounded-lg text-white shadow-sm transition-transform active:scale-95"
              style={{ backgroundColor: theme.primaryColor }}
            >
              <Search size={18} />
            </button>
          </div>
        </form>

        {/* Content Area */}
        {status === 'loading' && (
           <div className="text-center py-8">
             <div className="w-10 h-10 border-4 border-gray-200 rounded-full border-t-terracotta animate-spin mx-auto mb-3"></div>
             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest animate-pulse">Buscando...</p>
           </div>
        )}

        {status === 'found' && (
          <div className="animate-fade-in">
             <div className="bg-white/60 rounded-2xl border border-white p-4 shadow-sm mb-6">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                   <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                     <Package size={20} />
                   </div>
                   <div>
                     <h3 className="font-bold text-sm text-gray-800">Pedido #{code.toUpperCase()}</h3>
                     <p className="text-xs text-gray-500">Previsão: 2 dias úteis</p>
                   </div>
                </div>

                {/* Timeline */}
                <div className="space-y-6 relative pl-2">
                   {/* Line */}
                   <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-gray-200"></div>

                   <div className="relative flex gap-4">
                      <div className="w-7 h-7 rounded-full bg-green-500 border-4 border-white shadow-sm flex items-center justify-center relative z-10 shrink-0">
                         <Check size={12} className="text-white" strokeWidth={3} />
                      </div>
                      <div className="pt-0.5">
                        <p className="font-bold text-xs text-gray-800">Pagamento Confirmado</p>
                        <p className="text-[10px] text-gray-400">Hoje, 09:42</p>
                      </div>
                   </div>

                   <div className="relative flex gap-4">
                      <div className="w-7 h-7 rounded-full bg-green-500 border-4 border-white shadow-sm flex items-center justify-center relative z-10 shrink-0">
                         <Check size={12} className="text-white" strokeWidth={3} />
                      </div>
                      <div className="pt-0.5">
                        <p className="font-bold text-xs text-gray-800">Em Separação</p>
                        <p className="text-[10px] text-gray-400">Hoje, 14:30</p>
                      </div>
                   </div>

                   <div className="relative flex gap-4">
                      <div className="w-7 h-7 rounded-full bg-blue-500 border-4 border-white shadow-sm flex items-center justify-center relative z-10 shrink-0 animate-pulse">
                         <Truck size={12} className="text-white" />
                      </div>
                      <div className="pt-0.5">
                        <p className="font-bold text-xs text-blue-600">Em Trânsito</p>
                        <p className="text-[10px] text-gray-400">Aguardando atualização</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* Footer Help */}
        <div className="mt-auto pt-6 border-t border-black/5 text-center">
           <p className="text-xs text-gray-400 mb-3">Problemas com seu pedido?</p>
           <a 
             href={whatsappUrl}
             target="_blank"
             rel="noopener noreferrer"
             className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-700 text-xs font-bold hover:bg-green-100 transition-colors"
           >
             <MessageCircle size={14} /> Falar com Suporte Humano
           </a>
        </div>

      </div>
    </div>
  );
};

export default TrackingModal;