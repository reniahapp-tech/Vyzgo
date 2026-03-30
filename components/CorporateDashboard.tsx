import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { SuperAdminDashboard } from './SuperAdminDashboard';
import { AgencyDashboard } from './AgencyDashboard';

const MASTER_PIN = 'admin123'; // In production, move to env or backend auth

export const CorporateDashboard: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [pin, setPin] = useState('');
    const [viewMode, setViewMode] = useState<'master' | 'agency' | null>(null);
    const [agencyId, setAgencyId] = useState('');

    const handleLogin = () => {
        if (pin === MASTER_PIN) {
            setIsAuthenticated(true);
            setViewMode('master');
        } else if (pin.startsWith('agency-')) {
            setIsAuthenticated(true);
            setViewMode('agency');
            setAgencyId(pin);
        } else {
            alert('Acesso negado. Use o Código da Agência ou PIN Mestre.');
        }
    };

    if (isAuthenticated) {
        if (viewMode === 'master') {
            return <SuperAdminDashboard />;
        }
        if (viewMode === 'agency') {
            return <AgencyDashboard agencyId={agencyId} />;
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
            <div className="bg-white p-10 rounded-[32px] shadow-2xl w-full max-w-md border border-gray-100 animate-in fade-in zoom-in duration-500">
                <div className="flex justify-center mb-8">
                    <div className="p-4 bg-indigo-50 text-indigo-600 rounded-3xl shadow-inner">
                        <Lock className="w-10 h-10" />
                    </div>
                </div>
                
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Painel Corporativo</h2>
                    <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Plataforma VyzGo Whitelabel</p>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Código de Acesso</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                            className="w-full text-center text-3xl tracking-[12px] p-5 bg-gray-50 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-[24px] outline-none transition-all placeholder:tracking-normal placeholder:text-gray-200"
                            autoFocus
                        />
                    </div>

                    <button
                        onClick={handleLogin}
                        className="w-full py-5 bg-indigo-600 text-white rounded-[24px] font-black text-lg shadow-xl shadow-indigo-100 hover:translate-y-[-2px] active:scale-[0.98] transition-all"
                    >
                        Entrar no Painel
                    </button>
                </div>

                <div className="mt-10 pt-8 border-t border-gray-50 text-center">
                    <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">Segurança de Nível Bancário</p>
                </div>
            </div>
        </div>
    );
};
