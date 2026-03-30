import React, { useState, useEffect } from 'react';
import { useConfig } from '../contexts/ConfigContext';
import { 
  Store, Plus, ExternalLink, RefreshCw, 
  Layout, Palette, Settings, Users,
  Globe, MessageCircle, BarChart, ShieldCheck
} from 'lucide-react';

interface AgencyDashboardProps {
    agencyId: string;
}

export const AgencyDashboard: React.FC<AgencyDashboardProps> = ({ agencyId }) => {
    const { addToast, config } = useConfig();
    const [stores, setStores] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newStoreSlug, setNewStoreSlug] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    // Simulated Agency Branding (in a real app, this would come from a DB)
    const agencyBranding = {
        name: agencyId.replace('agency-', '').toUpperCase() + ' DIGITAL',
        primaryColor: '#4f46e5', // Indigo
        logo: '/logo-main.png'
    };

    useEffect(() => {
        loadAgencyStores();
    }, [agencyId]);

    const loadAgencyStores = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/list-stores');
            if (response.ok) {
                const data = await response.json();
                const allStores = data.stores as string[];
                // Filter only stores belonging to this agency
                const myStores = allStores.filter(s => s.startsWith(`${agencyId}-`));
                setStores(myStores);
            }
        } catch (e) {
            addToast('Erro ao carregar suas lojas', 'error');
        }
        setIsLoading(false);
    };

    const createStore = async () => {
        if (!newStoreSlug) return;
        const finalId = `${agencyId}-${newStoreSlug.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
        
        setIsCreating(true);
        try {
            const response = await fetch('/api/create-store', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    storeId: finalId, 
                    config: {
                        ...config,
                        header: { ...config.header, title: `Loja: ${newStoreSlug}` }
                    }
                })
            });

            if (response.ok) {
                addToast('Nova loja lançada com sucesso!', 'success');
                setNewStoreSlug('');
                loadAgencyStores();
            } else {
                throw new Error('Erro na criação');
            }
        } catch (e) {
            addToast('Falha ao criar loja.', 'error');
        }
        setIsCreating(false);
    };

    return (
        <div className="min-h-screen bg-[#fafafa] p-4 md:p-8 font-sans">
            <div className="max-w-6xl mx-auto">
                {/* Agency Branding Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-white rounded-3xl shadow-xl flex items-center justify-center p-3 border border-gray-100">
                            <img src={agencyBranding.logo} alt="Agency Logo" className="w-full h-full object-contain" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-gray-900 tracking-tight">{agencyBranding.name}</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] font-bold bg-indigo-600 text-white px-2 py-0.5 rounded-full uppercase tracking-widest">Parceiro Oficial</span>
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID: {agencyId}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all">
                            <Palette size={18} />
                            Minha Marca
                        </button>
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-2xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all">
                            <Settings size={18} />
                            Configurações
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Store Management Section */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total de Clientes</p>
                                <p className="text-3xl font-black text-gray-900">{stores.length}</p>
                            </div>
                            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status do Plano</p>
                                <p className="text-xl font-black text-green-600 uppercase">Premium ILIMITADO</p>
                            </div>
                        </div>

                        {/* Store Table */}
                        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="font-black text-gray-800 tracking-tight">Suas Lojas Ativas</h3>
                                <button onClick={loadAgencyStores} className="p-2 hover:bg-gray-50 rounded-xl transition-colors">
                                    <RefreshCw size={18} className={isLoading ? 'animate-spin' : 'text-gray-400'} />
                                </button>
                            </div>

                            <div className="divide-y divide-gray-50">
                                {isLoading ? (
                                    <div className="p-12 text-center text-gray-400 font-medium">Sincronizando lojas...</div>
                                ) : stores.length === 0 ? (
                                    <div className="p-12 text-center text-gray-400 font-medium">Você ainda não lançou nenhuma loja.</div>
                                ) : stores.map(store => (
                                    <div key={store} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black uppercase text-lg shadow-sm">
                                                {store.split('-').pop()?.substring(0, 1)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-800">{store.split('-').pop()}</h4>
                                                <p className="text-xs text-gray-400 font-medium">{store}.vyzgo.com</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button className="p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all" title="Ver Loja">
                                                <Globe size={20} />
                                            </button>
                                            <button className="p-2.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all" title="Ver Vendas">
                                                <BarChart size={20} />
                                            </button>
                                            <button className="ml-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-gray-200">
                                                ACESSAR ADMIN
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Quick Launch Sidebar */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-indigo-600 rounded-[32px] p-8 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-xl font-black mb-2 flex items-center gap-2">
                                    <Plus className="text-indigo-200" />
                                    Lançar Nova Loja
                                </h3>
                                <p className="text-indigo-100 text-xs font-medium mb-8 leading-relaxed">Crie uma nova vitrine instantânea para o seu cliente.</p>
                                
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Identificação do Cliente</label>
                                        <input 
                                            type="text" 
                                            placeholder="Ex: joao-calcados"
                                            value={newStoreSlug}
                                            onChange={(e) => setNewStoreSlug(e.target.value)}
                                            className="w-full p-4 bg-indigo-700/50 border border-indigo-500/50 rounded-2xl outline-none placeholder:text-indigo-400 font-bold"
                                        />
                                    </div>

                                    <button 
                                        onClick={createStore}
                                        disabled={!newStoreSlug || isCreating}
                                        className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-lg shadow-xl hover:translate-y-[-2px] active:scale-[0.98] transition-all disabled:opacity-50"
                                    >
                                        {isCreating ? 'Lançando...' : 'Lançar Agora 🚀'}
                                    </button>
                                </div>
                            </div>
                            {/* Decorative element */}
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl"></div>
                        </div>

                        {/* Partner Support */}
                        <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
                            <h3 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-2">
                                <ShieldCheck className="text-green-500" />
                                Suporte VIP
                            </h3>
                            <button className="w-full flex items-center justify-center gap-3 py-4 bg-green-50 text-green-700 rounded-2xl font-bold hover:bg-green-100 transition-all border border-green-100">
                                <MessageCircle size={20} />
                                Falar com Gerente
                            </button>
                            <p className="text-[10px] text-gray-400 text-center mt-4 font-medium uppercase tracking-widest">Atendimento 24/7 para parceiros</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
